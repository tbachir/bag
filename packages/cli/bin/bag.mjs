#!/usr/bin/env node
/**
 * BAG CLI — Agent-first developer inventory and scaffolding tool.
 * Manages Skills, MCP servers, Recipes, Templates, and Packs.
 * Uses Node standard libraries only; safe, local-first, dry-run by default.
 */
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import {
  readCatalog,
  searchItems,
  describeLoadout,
  planLoadout,
  applyPlan,
  installSkill,
  planItem,
  checkTarget,
  checkDestination,
  fail,
  ROOT
} from '../src/lib.mjs';

const HELP = `BAG — Agent-first Developer Inventory & CLI

Usage:
  bag search <words> [--json]
  bag list [--json]
  bag show <item-id> [--json]

Primitives:
  bag skill [list|show <id>|add <id> --target <dir> [-a claude-code|codex]]
  bag mcp [list|show <server>|add <server> -a cursor|claude-desktop|gemini]
  bag recipe [list|show <id> [--prompt]]
  bag template [list|apply <id> --target <dir> [--apply]]
  bag pack [list|show <id>|plan <id> --target <dir>|equip <id> --target <dir> [--apply]]

System:
  bag validate [--json]

Options:
  --json       Output machine-readable JSON
  --apply      Write changes to disk (safe, no overwrites)
  --target     Target project directory
  -a, --adapter Agent client adapter (claude-code, codex, cursor, etc.)
`;

function parse(argv) {
  const flags = { json: false, apply: false, target: null, adapter: null, prompt: false, help: false };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') flags.help = true;
    else if (arg === '--json') flags.json = true;
    else if (arg === '--apply') flags.apply = true;
    else if (arg === '--prompt') flags.prompt = true;
    else if (arg === '--target') {
      if (!argv[i + 1] || argv[i + 1].startsWith('--')) fail('--target requires an existing directory');
      flags.target = argv[++i];
    } else if (arg === '-a' || arg === '--adapter') {
      if (!argv[i + 1] || argv[i + 1].startsWith('-')) fail('--adapter requires a client name');
      flags.adapter = argv[++i];
    } else if (arg.startsWith('--')) fail(`Unknown option: ${arg}`);
    else positional.push(arg);
  }
  return { flags, positional };
}

async function copyDirSafe(src, targetRoot, relDestDir, apply = true) {
  async function scanFiles(dir, prefix = '') {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.')) {
          files.push(...await scanFiles(path.join(dir, entry.name), rel));
        }
      } else if (entry.isFile()) {
        files.push(rel);
      }
    }
    return files;
  }

  const files = await scanFiles(src);
  for (const file of files) {
    const relFile = `${relDestDir}/${file}`;
    await checkDestination(targetRoot, relFile);
  }

  if (!apply) return;

  for (const file of files) {
    const relFile = `${relDestDir}/${file}`;
    const dest = await checkDestination(targetRoot, relFile);
    if (!dest.exists) {
      await fs.mkdir(path.dirname(dest.full), { recursive: true });
      await checkDestination(targetRoot, relFile);
      try {
        await fs.copyFile(path.join(src, file), dest.full, fs.constants.COPYFILE_EXCL);
      } catch (err) {
        if (err.code !== 'EEXIST') throw err;
      }
    }
  }
}

async function main() {
  const { flags, positional } = parse(process.argv.slice(2));
  const [command, subCommand, ...rest] = positional;

  if (!command || command === 'help' || flags.help) {
    console.log(HELP);
    return;
  }

  const catalog = await readCatalog();
  let output;

  switch (command) {
    case 'validate':
      output = { valid: true, schemaVersion: 1, items: catalog.items.size, loadouts: catalog.loadouts.size };
      break;

    case 'list':
      output = [...catalog.items.values()];
      break;

    case 'search': {
      const query = [subCommand, ...rest].filter(Boolean).join(' ');
      if (!query) fail('search requires a query string');
      output = searchItems(catalog, query);
      break;
    }

    case 'show': {
      if (!subCommand) fail('show requires an item id');
      output = catalog.items.get(subCommand);
      if (!output) fail(`Unknown item: ${subCommand}`);
      break;
    }

    // SKILL COMMAND
    case 'skill':
    case 'skills': {
      const action = subCommand || 'list';
      const skillId = rest[0];
      const skillsDir = path.join(ROOT, 'skills');

      if (action === 'list') {
        const entries = await fs.readdir(skillsDir, { withFileTypes: true });
        output = entries.filter(e => e.isDirectory() && !e.name.startsWith('.')).map(e => ({
          id: e.name,
          category: 'skill',
          path: `skills/${e.name}`
        }));
      } else if (action === 'show') {
        if (!skillId) fail('skill show requires a skill id');
        const skillPath = path.join(skillsDir, skillId, 'SKILL.md');
        try {
          const content = await fs.readFile(skillPath, 'utf8');
          output = { id: skillId, content, path: `skills/${skillId}/SKILL.md` };
        } catch {
          fail(`Skill not found: ${skillId}`);
        }
      } else if (action === 'add') {
        if (!skillId) fail('skill add requires a skill id');
        if (!flags.target) fail('skill add requires --target <directory>');
        const destRoot = await checkTarget(path.resolve(flags.target));
        const sourceSkill = path.join(skillsDir, skillId);
        try {
          await fs.access(sourceSkill);
        } catch {
          fail(`Skill not found: ${skillId}`);
        }

        const agentFolder = flags.adapter === 'claude-code' ? '.claude/skills' : (flags.adapter === 'gemini' ? '.gemini/skills' : (flags.adapter === 'cursor' ? '.cursor/skills' : '.agents/skills'));
        const relSkillDir = `${agentFolder}/${skillId}`;
        const destSkill = path.join(destRoot, relSkillDir);

        if (catalog.items.has(skillId) && catalog.items.get(skillId).kind === 'skill') {
          const res = await installSkill(catalog, skillId, destRoot, {
            adapter: flags.adapter,
            apply: flags.apply,
            lockfile: true
          });
          if (!flags.apply) {
            output = {
              status: 'dry-run',
              skill: skillId,
              adapter: flags.adapter || 'agents',
              destination: destSkill,
              actions: res.actions,
              message: 'Run with --apply to write changes to disk.'
            };
          } else {
            output = {
              status: 'installed',
              skill: skillId,
              adapter: flags.adapter || 'agents',
              destination: destSkill,
              actions: res.actions,
              lockfile: res.lockfile
            };
          }
        } else {
          if (!flags.apply) {
            await copyDirSafe(sourceSkill, destRoot, relSkillDir, false);
            output = {
              status: 'dry-run',
              skill: skillId,
              adapter: flags.adapter || 'agents',
              destination: destSkill,
              message: 'Run with --apply to write changes to disk.'
            };
          } else {
            await copyDirSafe(sourceSkill, destRoot, relSkillDir, true);
            output = { status: 'installed', skill: skillId, destination: destSkill };
          }
        }
      } else {
        fail(`Unknown skill action: ${action}`);
      }
      break;
    }

    // MCP COMMAND
    case 'mcp': {
      const action = subCommand || 'list';
      const serverId = rest[0];
      const mcpDir = path.join(ROOT, 'mcp/servers');

      if (action === 'list') {
        const entries = await fs.readdir(mcpDir, { withFileTypes: true });
        output = entries.filter(e => e.isDirectory()).map(e => ({
          server: e.name,
          guide: `mcp/servers/${e.name}/README.md`
        }));
      } else if (action === 'show') {
        if (!serverId) fail('mcp show requires a server id');
        const guidePath = path.join(mcpDir, serverId, 'README.md');
        try {
          const content = await fs.readFile(guidePath, 'utf8');
          output = { server: serverId, guide: content };
        } catch {
          fail(`MCP server guide not found: ${serverId}`);
        }
      } else if (action === 'add') {
        if (!serverId) fail('mcp add requires a server id (bag-mcp, supabase, context7, ui-skills)');
        const mcpConfigs = {
          'bag-mcp': {
            name: 'bag',
            config: { command: 'node', args: [path.resolve(ROOT, 'spellbook/scripts/bag-mcp.mjs')] }
          },
          'bag': {
            name: 'bag',
            config: { command: 'node', args: [path.resolve(ROOT, 'spellbook/scripts/bag-mcp.mjs')] }
          },
          'supabase': {
            name: 'supabase',
            config: {
              command: 'npx',
              args: ['-y', '@supabase/mcp-server'],
              env: { SUPABASE_ACCESS_TOKEN: '<your-personal-access-token>' }
            }
          },
          'context7': {
            name: 'context7',
            config: { command: 'npx', args: ['-y', '@context7/mcp-server'] }
          },
          'ui-skills': {
            name: 'ui-skills',
            config: { command: 'npx', args: ['-y', '@ui-skills/mcp-server'] }
          }
        };

        const serverEntry = mcpConfigs[serverId];
        if (!serverEntry) fail(`Unknown MCP server: ${serverId}. Available: ${Object.keys(mcpConfigs).join(', ')}`);

        const adapter = flags.adapter || 'cursor';
        let relConfigFile = '.cursor/mcp.json';
        if (adapter === 'cursor') relConfigFile = '.cursor/mcp.json';
        else if (adapter === 'claude' || adapter === 'claude-code') relConfigFile = '.claude/mcp.json';
        else if (adapter === 'gemini' || adapter === 'antigravity') relConfigFile = '.gemini/mcp.json';
        else if (adapter === 'vscode') relConfigFile = '.vscode/mcp.json';

        if (flags.target) {
          const targetDir = await checkTarget(path.resolve(flags.target));
          const targetConfigFile = path.join(targetDir, relConfigFile);
          await checkDestination(targetDir, relConfigFile);

          if (!flags.apply) {
            output = {
              status: 'dry-run',
              adapter,
              targetFile: targetConfigFile,
              server: serverEntry.name,
              configuration: serverEntry.config,
              message: 'Run with --apply to write configuration to target.'
            };
          } else {
            let existing = { mcpServers: {} };
            try {
              const prev = await fs.readFile(targetConfigFile, 'utf8');
              try {
                existing = JSON.parse(prev);
                if (!existing || typeof existing !== 'object' || Array.isArray(existing)) {
                  fail(`Existing MCP configuration at ${targetConfigFile} is not a valid JSON object`);
                }
                if (!existing.mcpServers || typeof existing.mcpServers !== 'object' || Array.isArray(existing.mcpServers)) {
                  existing.mcpServers = {};
                }
              } catch (parseErr) {
                fail(`Failed to parse existing MCP configuration at ${targetConfigFile}: ${parseErr.message}`);
              }
            } catch (readErr) {
              if (readErr.code !== 'ENOENT') {
                fail(`Failed to read existing MCP configuration at ${targetConfigFile}: ${readErr.message}`);
              }
            }
            await fs.mkdir(path.dirname(targetConfigFile), { recursive: true });
            await checkDestination(targetDir, relConfigFile);
            existing.mcpServers[serverEntry.name] = serverEntry.config;
            await fs.writeFile(targetConfigFile, JSON.stringify(existing, null, 2) + '\n', 'utf8');
            output = {
              status: 'installed',
              adapter,
              targetFile: targetConfigFile,
              server: serverEntry.name,
              configuration: serverEntry.config
            };
          }
        } else {
          output = {
            server: serverEntry.name,
            configuration: serverEntry.config,
            instructions: `Add to ${relConfigFile} or specify --target <dir> --apply`
          };
        }
      } else {
        fail(`Unknown mcp action: ${action}`);
      }
      break;
    }

    // RECIPE COMMAND
    case 'recipe':
    case 'recipes': {
      const action = subCommand || 'list';
      const recipeId = rest[0];
      const recipesDir = path.join(ROOT, 'recipes');

      if (action === 'list') {
        const entries = await fs.readdir(recipesDir, { withFileTypes: true });
        output = entries.filter(e => e.isDirectory()).map(e => ({
          recipe: e.name,
          path: `recipes/${e.name}`
        }));
      } else if (action === 'show') {
        if (!recipeId) fail('recipe show requires a recipe id');
        const recipeReadme = path.join(recipesDir, recipeId, 'README.md');
        try {
          const content = await fs.readFile(recipeReadme, 'utf8');
          if (flags.prompt) {
            const promptMatch = content.match(/```(?:text|markdown)?\s*\n([\s\S]*?)```/);
            output = { recipe: recipeId, prompt: promptMatch ? promptMatch[1].trim() : content };
          } else {
            output = { recipe: recipeId, description: content };
          }
        } catch {
          fail(`Recipe not found: ${recipeId}`);
        }
      } else {
        fail(`Unknown recipe action: ${action}`);
      }
      break;
    }

    // TEMPLATE COMMAND
    case 'template':
    case 'templates': {
      const action = subCommand || 'list';
      const tmplId = rest[0];

      if (action === 'list') {
        output = [
          { id: 'configs/editorconfig', path: 'templates/configs/.editorconfig.template' },
          { id: 'configs/node-gitignore', path: 'templates/configs/.gitignore.template' },
          { id: 'skills/template', path: 'templates/skills/SKILL.md' }
        ];
      } else if (action === 'apply') {
        if (!tmplId) fail('template apply requires a template id (e.g. configs/editorconfig, configs/node-gitignore)');
        if (!flags.target) fail('template apply requires --target <directory>');
        const targetDir = await checkTarget(path.resolve(flags.target));

        const templateMap = {
          'configs/editorconfig': { src: 'templates/configs/.editorconfig.template', dest: '.editorconfig' },
          'editorconfig': { src: 'templates/configs/.editorconfig.template', dest: '.editorconfig' },
          'configs/node-gitignore': { src: 'templates/configs/.gitignore.template', dest: '.gitignore' },
          'gitignore': { src: 'templates/configs/.gitignore.template', dest: '.gitignore' },
          'skills/template': { src: 'templates/skills/SKILL.md', dest: '.agents/skills/new-skill/SKILL.md' }
        };

        const entry = templateMap[tmplId];
        if (!entry) fail(`Unknown template: ${tmplId}. Available: ${Object.keys(templateMap).join(', ')}`);

        const srcPath = path.join(ROOT, entry.src);
        const dest = await checkDestination(targetDir, entry.dest);

        if (dest.exists) {
          fail(`Destination already exists: ${dest.full}. Template application will not overwrite.`);
        }

        if (!flags.apply) {
          output = {
            status: 'dry-run',
            template: tmplId,
            source: entry.src,
            destination: dest.full,
            message: 'Run with --apply to copy template file.'
          };
        } else {
          await fs.mkdir(path.dirname(dest.full), { recursive: true });
          await checkDestination(targetDir, entry.dest);
          const stat = await fs.stat(srcPath);
          if (stat.isDirectory()) {
            await copyDirSafe(srcPath, targetDir, entry.dest, true);
          } else {
            await fs.copyFile(srcPath, dest.full, fs.constants.COPYFILE_EXCL);
          }
          output = {
            status: 'applied',
            template: tmplId,
            destination: dest.full
          };
        }
      } else {
        fail(`Unknown template action: ${action}`);
      }
      break;
    }

    // PACK COMMAND (and backward-compatible loadout)
    case 'pack':
    case 'packs':
    case 'loadouts':
    case 'loadout':
    case 'plan':
    case 'equip': {
      let packAction = subCommand;
      let packId = rest[0];

      if (command === 'loadouts') { packAction = 'list'; }
      else if (command === 'loadout') { packAction = 'show'; packId = subCommand; }
      else if (command === 'plan') { packAction = 'plan'; packId = subCommand; }
      else if (command === 'equip') { packAction = 'equip'; packId = subCommand; }

      packAction = packAction || 'list';

      if (packAction === 'list') {
        output = [...catalog.loadouts.values()];
      } else if (packAction === 'show') {
        if (!packId) fail('pack show requires an id');
        output = describeLoadout(catalog, packId);
      } else if (packAction === 'plan') {
        if (!packId) fail('pack plan requires an id');
        if (!flags.target) fail('pack plan requires --target <directory>');
        output = await planLoadout(catalog, packId, flags.target);
      } else if (packAction === 'equip') {
        if (!packId) fail('pack equip requires an id');
        if (!flags.target) fail('pack equip requires --target <directory>');
        output = flags.apply
          ? await applyPlan(catalog, packId, flags.target)
          : await planLoadout(catalog, packId, flags.target);
      } else {
        fail(`Unknown pack action: ${packAction}`);
      }
      break;
    }

    default:
      fail(`Unknown command: ${command}. Use 'bag help'.`);
  }

  if (flags.json) {
    console.log(JSON.stringify(output, null, 2));
  } else if (Array.isArray(output)) {
    for (const item of output) {
      if (item.id && item.title) {
        console.log(`${item.id.padEnd(24)} ${item.title} — ${item.summary || ''}`);
      } else if (item.id) {
        console.log(`${item.id.padEnd(24)} ${item.path || ''}`);
      } else if (item.server) {
        console.log(`${item.server.padEnd(24)} ${item.guide || ''}`);
      } else if (item.recipe) {
        console.log(`${item.recipe.padEnd(24)} ${item.path || ''}`);
      } else {
        console.log(JSON.stringify(item));
      }
    }
    console.log(`\n${output.length} result(s).`);
  } else if (output && output.actions) {
    console.log(`${output.dryRun ? 'PREVIEW (dry-run, no files written)' : 'APPLIED'} · ${output.loadout} → ${output.target}`);
    for (const a of output.actions) {
      console.log(`  ${a.status.padEnd(14)} ${a.item}: ${a.destination || a.source}`);
    }
    if (output.dryRun) {
      console.log('\nTo copy files explicitly: bag pack equip <id> --target <directory> --apply');
    }
  } else if (output && typeof output.prompt === 'string') {
    console.log(output.prompt);
  } else if (output && typeof output.guide === 'string') {
    console.log(output.guide);
  } else if (output && typeof output.description === 'string') {
    console.log(output.description);
  } else if (output && typeof output.content === 'string') {
    console.log(output.content);
  } else {
    console.log(JSON.stringify(output, null, 2));
  }
}

main().catch(err => {
  console.error(`BAG: ${err.message}`);
  process.exitCode = 1;
});
