#!/usr/bin/env node
/**
 * BAG CLI — machine-readable search, discovery, planning, skill installation, and function execution.
 * Uses Node standard libraries only; zero external dependencies.
 */
import {
  readCatalog,
  searchItems,
  describeLoadout,
  planLoadout,
  applyPlan,
  installSkill,
  listFunctions,
  executeFunction,
  fail
} from '../../catalog/lib.mjs';

const HELP = `BAG — Developer's Inventory & Active Tool Runtime
Usage:
  node spellbook/scripts/bag.mjs list [--json]
  node spellbook/scripts/bag.mjs search <words> [--json]
  node spellbook/scripts/bag.mjs show <item-id> [--json]
  node spellbook/scripts/bag.mjs loadouts [--json]
  node spellbook/scripts/bag.mjs loadout <id> [--json]
  node spellbook/scripts/bag.mjs plan <id> --target <existing-directory> [--json]
  node spellbook/scripts/bag.mjs equip <id> --target <existing-directory> [--apply] [--json]
  node spellbook/scripts/bag.mjs install <skill-id> --target <existing-directory> [--agent <client>] [--apply] [--json]
  node spellbook/scripts/bag.mjs functions [--json]
  node spellbook/scripts/bag.mjs call <function-name> [--target <dir>] [extra-args...] [--json]
  node spellbook/scripts/bag.mjs validate [--json]

Skill Installation:
  Install targets: .agents/skills/<id>/SKILL.md (default), or customize via --agent <agents|gemini|cursor|claude|root>.
  Dry-run by default. --apply is required to write files and synchronize skills-lock.json.

Function Execution:
  Executes curated allowlist functions (e.g. clean-code, ui-studio, skill-audit, validate).
`;

function parse(argv) {
  const flags = { json: false, apply: false, target: null, agent: 'agents', rawArgs: [] };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--json') flags.json = true;
    else if (arg === '--apply') flags.apply = true;
    else if (arg === '--agent') {
      if (!argv[i + 1] || argv[i + 1].startsWith('--')) fail('--agent requires an agent client identifier');
      flags.agent = argv[++i];
    } else if (arg === '--target') {
      if (!argv[i + 1] || argv[i + 1].startsWith('--')) fail('--target needs an existing directory');
      flags.target = argv[++i];
    } else if (arg.startsWith('--')) {
      flags.rawArgs.push(arg);
    } else positional.push(arg);
  }
  return { flags, positional };
}

async function main() {
  const { flags, positional } = parse(process.argv.slice(2));
  const [command, ...args] = positional;
  if (!command || command === 'help') { console.log(HELP); return; }

  const needsTarget = ['plan', 'equip', 'install'].includes(command);
  if (flags.apply && !['equip', 'install'].includes(command)) fail('--apply is only valid with equip or install');
  if (flags.target && !needsTarget && command !== 'call') fail('--target is only valid with plan/equip/install/call');
  if (needsTarget && !flags.target) fail('Pass --target <existing project directory>');

  const catalog = await readCatalog();
  let output;

  switch (command) {
    case 'validate':
      if (args.length) fail('validate takes no arguments');
      output = { valid: true, schemaVersion: 1, items: catalog.items.size, loadouts: catalog.loadouts.size };
      break;
    case 'list':
      if (args.length) fail('list takes no arguments');
      output = [...catalog.items.values()];
      break;
    case 'search':
      if (!args.length) fail('search needs at least one word');
      output = searchItems(catalog, args.join(' '));
      break;
    case 'show':
      if (args.length !== 1) fail('show needs one item id');
      output = catalog.items.get(args[0]);
      if (!output) fail(`Unknown item: ${args[0]}`);
      break;
    case 'loadouts':
      if (args.length) fail('loadouts takes no arguments');
      output = [...catalog.loadouts.values()];
      break;
    case 'loadout':
      if (args.length !== 1) fail('loadout needs one id');
      output = describeLoadout(catalog, args[0]);
      break;
    case 'plan':
      if (args.length !== 1) fail('plan needs one loadout id');
      output = await planLoadout(catalog, args[0], flags.target);
      break;
    case 'equip':
      if (args.length !== 1) fail('equip needs one loadout id');
      output = flags.apply ? await applyPlan(catalog, args[0], flags.target) : await planLoadout(catalog, args[0], flags.target);
      break;
    case 'install':
      if (args.length !== 1) fail('install needs one skill id');
      output = await installSkill(catalog, args[0], flags.target, { agent: flags.agent, apply: flags.apply });
      break;
    case 'functions':
      if (args.length) fail('functions takes no arguments');
      output = listFunctions();
      break;
    case 'call': {
      if (!args.length) fail('call needs at least one function name');
      const [fnName, ...fnArgs] = args;
      const combinedArgs = [...fnArgs, ...flags.rawArgs];
      output = await executeFunction(fnName, combinedArgs, { target: flags.target });
      if (!flags.json) {
        if (output.stdout) process.stdout.write(output.stdout);
        if (output.stderr) process.stderr.write(output.stderr);
        if (!output.success) process.exitCode = output.exitCode || 1;
        return;
      }
      break;
    }
    default:
      fail(`Unknown command: ${command}. Use help.`);
  }

  if (flags.json) {
    console.log(JSON.stringify(output, null, 2));
  } else if (Array.isArray(output)) {
    for (const item of output) {
      if (item.script) {
        console.log(`${item.name.padEnd(16)} ${item.script.padEnd(42)} ${item.description}`);
      } else {
        console.log(`${item.id.padEnd(22)} ${item.title} — ${item.summary}`);
      }
    }
    console.log(`${output.length} result(s).`);
  } else if (output.actions) {
    const isInstall = !!output.item;
    const prefix = output.dryRun ? 'PREVIEW (no files written)' : (isInstall ? 'INSTALLED' : 'APPLIED');
    const label = isInstall ? `skill ${output.item}` : output.loadout;
    console.log(`${prefix} · ${label} → ${output.target}`);
    for (const a of output.actions) {
      console.log(`  ${a.status.padEnd(14)} ${a.item}: ${a.destination || a.source}`);
    }
    if (output.dryRun) {
      const applyCmd = isInstall
        ? `install ${output.item} --target <directory> --apply`
        : `equip ${output.loadout} --target <directory> --apply`;
      console.log(`To write files explicitly: ${applyCmd}`);
    }
    if (output.lockfileUpdated) {
      console.log(`Updated skills-lock.json with SHA-256 hash.`);
    }
  } else {
    console.log(JSON.stringify(output, null, 2));
  }
}

main().catch(err => {
  console.error(`BAG: ${err.message}`);
  process.exitCode = 1;
});
