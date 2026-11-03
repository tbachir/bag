#!/usr/bin/env node
/**
 * Local helper to verify, package, and publish @tbachir/bag to npm.
 * Safe by default (dry-run unless --apply is passed).
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const exec = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const cliDir = path.join(root, 'packages/cli');

async function main() {
  const args = process.argv.slice(2);
  const isApply = args.includes('--apply');
  const pkgJsonPath = path.join(cliDir, 'package.json');
  const pkg = JSON.parse(await fs.readFile(pkgJsonPath, 'utf8'));

  console.log(`📦 Preparing @tbachir/bag v${pkg.version}...`);

  // 1. Validate links and tests
  console.log('🔍 Running repository link validation and unit tests...');
  await exec(process.execPath, [path.join(root, 'spellbook/scripts/validate.mjs')]);
  await exec(process.execPath, ['--test', ...await getTestFiles()]);
  console.log('✅ Validation and unit tests passed.');

  // 2. Synchronize resources
  console.log('🔄 Synchronizing CLI inventory resources...');
  await exec(process.execPath, [path.join(root, 'spellbook/scripts/sync-cli.mjs')]);

  // 3. Test package packing
  console.log('📦 Testing npm pack simulation...');
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const { stdout: packOut } = await exec(npmCmd, ['pack', '--dry-run'], { cwd: cliDir, shell: true });
  console.log(packOut.trim());

  if (!isApply) {
    console.log('\n✨ DRY-RUN COMPLETE: Package is validated and ready for npm publication.');
    console.log('\nTo automate via GitHub Actions:');
    console.log('  1. Add NPM_TOKEN in GitHub repository secrets (Settings > Secrets and variables > Actions)');
    console.log(`  2. Push a git tag: git tag v${pkg.version} && git push origin v${pkg.version}`);
    console.log('     Or trigger the "Publish BAG CLI to npm" workflow from GitHub Actions tab.');
    console.log('\nTo publish directly from this machine:');
    console.log('  node spellbook/scripts/publish-cli.mjs --apply');
  } else {
    console.log('\n🚀 Publishing @tbachir/bag to npm registry...');
    const { stdout: pubOut } = await exec(npmCmd, ['publish', '--access', 'public'], { cwd: cliDir, shell: true });
    console.log(pubOut);
    console.log(`🎉 Successfully published @tbachir/bag v${pkg.version} to npm!`);
  }
}

async function getTestFiles() {
  const testsDir = path.join(root, 'tests');
  const entries = await fs.readdir(testsDir);
  return entries.filter(f => f.endsWith('.test.mjs')).map(f => path.join(testsDir, f));
}

main().catch(err => {
  console.error(`❌ Publish failed: ${err.message}`);
  process.exit(1);
});
