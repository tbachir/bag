#!/usr/bin/env node
/**
 * BAG UI Studio CLI (spellbook/scripts/ui-studio.mjs)
 * 
 * Part of BAG (Developer Inventory - Spellbook Scripts).
 * Universal command-line runner to scan any project, extract design tokens
 * from DESIGN.md, inventory routes, components, and dead features, and
 * compile an interactive, self-contained HTML Prototype Studio.
 * 
 * Usage:
 *   node spellbook/scripts/ui-studio.mjs [--target <dir>] [--design <file>] [--config <file>] [--out <file>]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDesignMd, autoDiscoverProject, generateUIStudioHtml } from './ui-studio-engine.mjs';

function parseArgs(args) {
  const result = {
    target: process.cwd(),
    design: null,
    config: null,
    out: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--target' && args[i + 1]) {
      result.target = path.resolve(args[++i]);
    } else if (arg === '--design' && args[i + 1]) {
      result.design = path.resolve(args[++i]);
    } else if (arg === '--config' && args[i + 1]) {
      result.config = path.resolve(args[++i]);
    } else if (arg === '--out' && args[i + 1]) {
      result.out = path.resolve(args[++i]);
    }
  }

  return result;
}

export async function runUiStudio(cliArgs = process.argv.slice(2)) {
  const opts = parseArgs(cliArgs);
  console.log(`🎒 [BAG] Running UI Studio Generator...`);
  console.log(`   Target Directory: ${opts.target}`);

  // Resolve DESIGN.md
  let designPath = opts.design;
  if (!designPath) {
    const candidatePaths = [
      path.join(opts.target, 'design', 'DESIGN.md'),
      path.join(opts.target, 'DESIGN.md'),
      path.join(opts.target, 'apps', 'native', 'design', 'DESIGN.md'),
      path.join(opts.target, 'apps', 'native', 'DESIGN.md')
    ];
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        designPath = p;
        break;
      }
    }
  }

  const design = designPath ? parseDesignMd(designPath) : {};
  if (designPath) {
    console.log(`   ✓ Found DESIGN.md: ${designPath}`);
  } else {
    console.log(`   ℹ No DESIGN.md found; using default design tokens.`);
  }

  // Resolve studio.config.json or auto-discover
  let config = {};
  let configPath = opts.config;
  if (!configPath) {
    const candidateConfigs = [
      path.join(opts.target, 'design', 'studio.config.json'),
      path.join(opts.target, 'studio.config.json'),
      path.join(opts.target, 'apps', 'native', 'design', 'studio.config.json')
    ];
    for (const p of candidateConfigs) {
      if (fs.existsSync(p)) {
        configPath = p;
        break;
      }
    }
  }

  if (configPath && fs.existsSync(configPath)) {
    console.log(`   ✓ Found studio.config.json: ${configPath}`);
    config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } else {
    console.log(`   🔍 Auto-discovering project routes and components...`);
    config = autoDiscoverProject(opts.target);
  }

  const routes = config.routes || [];
  const components = config.components || [];
  const audit = config.audit || [];
  const personas = config.personas || [
    { id: 'user', name: 'User', ink: '#6366f1', soft: '#e0e7ff', text: '#3730a3', on: '#ffffff' },
    { id: 'admin', name: 'Admin', ink: '#ec4899', soft: '#fce7f3', text: '#9d174d', on: '#ffffff' }
  ];

  console.log(`   ✓ Loaded ${routes.length} routes, ${components.length} components, ${audit.length} audit items.`);

  const html = generateUIStudioHtml({
    design,
    config,
    routes,
    components,
    audit,
    personas
  });

  const outputPath = opts.out || path.join(opts.target, 'ui-studio.html');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html, 'utf8');

  console.log(`\n🎉 [BAG] Generated UI Studio successfully at:`);
  console.log(`   ${outputPath}`);

  return outputPath;
}

// Direct execution check cross-platform
const isDirectExecution = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectExecution) {
  runUiStudio().catch(err => {
    console.error('❌ [BAG] Error generating UI Studio:', err);
    process.exit(1);
  });
}
