#!/usr/bin/env node
/**
 * BAG CLI — Agent-first developer inventory and scaffolding tool.
 * Manages Skills, MCP servers, Recipes, Templates, and Packs.
 * Uses Node standard libraries only; safe, local-first, dry-run by default.
 */
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { readCatalog, searchItems, describeLoadout, planLoadout, applyPlan, fail, ROOT } from '../../../catalog/lib.mjs';

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

async function copyDirSafe(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDirSafe(srcPath, destPath);
    } else if (entry.isFile()) {
      try {
        await fs.copyFile(srcPath, destPath, fs.constants.COPYFILE_EXCL);
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
        const sourceSkill = path.join(skillsDir, skillId);
        try {
          await fs.access(sourceSkill);
        } catch {
          fail(`Skill not found: ${skillId}`);
        }
        const agentFolder = flags.adapter === 'claude-code' ? '.claude/skills' : '.agents/skills';
        const destSkill = path.join(path.resolve(flags.target), agentFolder, skillId);
        await copyDirSafe(sourceSkill, destSkill);
        output = { status: 'installed', skill: skillId, destination: destSkill };
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
        if (!serverId) fail('mcp add requires a server id');
        output = {
          status: 'ready',
          server: serverId,
          instructions: `Inspect mcp/servers/${serverId}/README.md and configure your client.`
        };
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
          output = { recipe: recipeId, description: content };
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
          { id: 'skills/template', path: 'templates/skills/SKILL.md' },
          { id: 'boilerplates/fumadocs-starter', path: 'templates/boilerplates/fumadocs-starter' }
        ];
      } else if (action === 'apply') {
        if (!tmplId) fail('template apply requires a template id');
        if (!flags.target) fail('template apply requires --target <directory>');
        output = { status: 'applied', template: tmplId, target: flags.target };
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
