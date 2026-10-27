#!/usr/bin/env node
/**
 * BAG CLI — machine-readable search, discovery, planning and opt-in local equip.
 * Uses Node standard libraries only; never executes or downloads inventory items.
 */
import { readCatalog, searchItems, describeLoadout, planLoadout, applyPlan, fail } from '../../catalog/lib.mjs';

const HELP = `BAG — Developer's Inventory
Usage:
  node spellbook/scripts/bag.mjs list [--json]
  node spellbook/scripts/bag.mjs search <words> [--json]
  node spellbook/scripts/bag.mjs show <item-id> [--json]
  node spellbook/scripts/bag.mjs loadouts [--json]
  node spellbook/scripts/bag.mjs loadout <id> [--json]
  node spellbook/scripts/bag.mjs plan <id> --target <existing-directory> [--json]
  node spellbook/scripts/bag.mjs equip <id> --target <existing-directory> [--apply] [--json]
  node spellbook/scripts/bag.mjs validate [--json]

Equip is a dry-run by default. --apply is required to write. Existing files are
never overwritten; references are never installed. No network or subprocesses.`;

function parse(argv) {
  const flags = {json:false, apply:false, target:null};
  const positional = [];
  for (let i=0;i<argv.length;i++) {
    const arg=argv[i];
    if (arg==='--json') flags.json=true;
    else if (arg==='--apply') flags.apply=true;
    else if (arg==='--target') {
      if (!argv[i+1] || argv[i+1].startsWith('--')) fail('--target needs an existing directory');
      flags.target=argv[++i];
    } else if (arg.startsWith('--')) fail(`Unknown option: ${arg}`);
    else positional.push(arg);
  }
  return { flags, positional };
}
async function main() {
  const { flags, positional }=parse(process.argv.slice(2));
  const [command, ...args] = positional;
  if (!command || command==='help') { console.log(HELP); return; }
  const needsTarget = ['plan','equip'].includes(command);
  if (flags.apply && command!=='equip') fail('--apply is only valid with equip');
  if (flags.target && !needsTarget) fail('--target is only valid with plan/equip');
  if (needsTarget && !flags.target) fail('Pass --target <existing project directory>');
  const catalog=await readCatalog();
  let output;
  switch(command) {
    case 'validate':
      if (args.length) fail('validate takes no arguments');
      output={valid:true,schemaVersion:1,items:catalog.items.size,loadouts:catalog.loadouts.size}; break;
    case 'list':
      if (args.length) fail('list takes no arguments');
      output=[...catalog.items.values()]; break;
    case 'search':
      if (!args.length) fail('search needs at least one word');
      output=searchItems(catalog,args.join(' ')); break;
    case 'show':
      if (args.length!==1) fail('show needs one item id');
      output=catalog.items.get(args[0]); if (!output) fail(`Unknown item: ${args[0]}`); break;
    case 'loadouts':
      if (args.length) fail('loadouts takes no arguments');
      output=[...catalog.loadouts.values()]; break;
    case 'loadout':
      if (args.length!==1) fail('loadout needs one id');
      output=describeLoadout(catalog,args[0]); break;
    case 'plan':
      if (args.length!==1) fail('plan needs one loadout id');
      output=await planLoadout(catalog,args[0],flags.target); break;
    case 'equip':
      if (args.length!==1) fail('equip needs one loadout id');
      output=flags.apply ? await applyPlan(catalog,args[0],flags.target) : await planLoadout(catalog,args[0],flags.target);
      break;
    default: fail(`Unknown command: ${command}. Use help.`);
  }
  if (flags.json) console.log(JSON.stringify(output,null,2));
  else if (Array.isArray(output)) {
    for(const item of output) console.log(`${item.id.padEnd(22)} ${item.title} — ${item.summary}`);
    console.log(`${output.length} result(s).`);
  } else if (output.actions) {
    console.log(`${output.dryRun?'PREVIEW (no files written)':'APPLIED'} · ${output.loadout} → ${output.target}`);
    for (const a of output.actions) console.log(`  ${a.status.padEnd(14)} ${a.item}: ${a.destination || a.source}`);
    if(output.dryRun) console.log('To copy new files explicitly: equip <id> --target <directory> --apply');
  } else console.log(JSON.stringify(output,null,2));
}
main().catch(err => { console.error(`BAG: ${err.message}`); process.exitCode=1; });
