#!/usr/bin/env node
/**
 * BAG Clean Code & Hygiene Runner
 * Zero external dependencies; uses Node.js standard libraries only.
 * Analyzes codebase for common code smells, debugging leftovers, excessive nesting,
 * and whitespace violations. Optionally applies safe automated fixes (--fix).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const IGNORED_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.next', 'out', 'coverage', '.turbo'
]);

const SCANNED_EXTS = new Set([
  '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.py', '.json', '.md'
]);

const HELP = `BAG Clean Code — Code Hygiene and Smells Scanner

Usage:
  node spellbook/scripts/clean-code.mjs [--target <dir|file>] [--fix] [--json]

Options:
  --target <dir|file>   Directory or single file to analyze (default: current directory)
  --fix                 Automatically fix safe hygiene issues (e.g. trailing whitespace)
  --json                Emit structured JSON report for tooling/agents
  --help                Show this help message
`;

export function parseArgs(argv) {
  const options = { target: process.cwd(), fix: false, json: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--fix') options.fix = true;
    else if (arg === '--json') options.json = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--target') {
      if (!argv[i + 1] || argv[i + 1].startsWith('--')) {
        throw new Error('--target requires a directory or file path');
      }
      options.target = path.resolve(argv[++i]);
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      options.target = path.resolve(arg);
    }
  }
  return options;
}

export async function collectFiles(targetPath) {
  const stat = await fs.stat(targetPath);
  if (stat.isFile()) return [targetPath];

  const results = [];
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
          await walk(path.join(dir, entry.name));
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (SCANNED_EXTS.has(ext)) {
          results.push(path.join(dir, entry.name));
        }
      }
    }
  }
  await walk(targetPath);
  return results.sort();
}

export async function analyzeFile(filePath, fix = false) {
  const content = await fs.readFile(filePath, 'utf8');
  const lines = content.split(/\r?\n/);
  const issues = [];
  let fileFixed = false;

  const ext = path.extname(filePath).toLowerCase();
  const isMarkdown = ext === '.md' || ext === '.markdown';
  const isPython = ext === '.py';
  const isJsLike = ['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx'].includes(ext);
  const isCode = !['.json', '.md'].includes(ext);
  let newLines = fix ? [] : null;

  let inPyTriple = null;
  let inJsTemplate = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const lineNum = i + 1;

    // Track whether line starts or continues inside a multiline string
    const startsInMultiline = Boolean(inPyTriple || inJsTemplate);

    // Update multiline string state for Python
    if (isPython) {
      if (inPyTriple) {
        const closeIdx = line.indexOf(inPyTriple);
        if (closeIdx !== -1) {
          const rest = line.slice(closeIdx + 3);
          const next = rest.match(/"""|'''/);
          inPyTriple = next ? next[0] : null;
        }
      } else {
        const matches = [...line.matchAll(/"""|'''/g)];
        if (matches.length % 2 === 1) {
          inPyTriple = matches[matches.length - 1][0];
        }
      }
    }

    // Update multiline template literal state for JS/TS
    if (isJsLike) {
      const backticks = [...line.matchAll(/(?<!\\)`/g)];
      if (backticks.length % 2 === 1) {
        inJsTemplate = !inJsTemplate;
      }
    }

    const isMeaningful = isMarkdown || startsInMultiline || inPyTriple || inJsTemplate;

    // 1. Trailing whitespace
    if (/[ \t]+$/.test(line)) {
      issues.push({
        type: 'trailing-whitespace',
        line: lineNum,
        message: isMeaningful
          ? 'Line contains trailing whitespace (preserved; meaningful in context)'
          : 'Line contains trailing whitespace'
      });
      if (fix && !isMeaningful) {
        line = line.replace(/[ \t]+$/, '');
        fileFixed = true;
      }
    }

    if (fix) newLines.push(line);

    // 2. Debug / stray console statements (in code files)
    if (isCode) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('//') && !trimmed.startsWith('#') && !trimmed.startsWith('/*')) {
        // Exclude string/regex declarations matching the word
        if (/\bconsole\.(log|debug|trace)\s*\(/.test(trimmed) && !/['"`\/]/.test(trimmed.slice(0, trimmed.indexOf('console')))) {
          issues.push({
            type: 'debug-statement',
            line: lineNum,
            message: `Possible stray debug log: "${trimmed.slice(0, 60)}"`
          });
        }
        if (/^debugger;?$/.test(trimmed) || /;\s*debugger;?$/.test(trimmed)) {
          issues.push({
            type: 'debugger-statement',
            line: lineNum,
            message: 'Stray debugger statement'
          });
        }
      }

      // 3. Deep nesting check (> 4 indent levels: 16 spaces or 4 tabs)
      const indentMatch = line.match(/^([ \t]+)/);
      if (indentMatch) {
        const ind = indentMatch[1];
        const spaces = ind.replace(/\t/g, '    ').length;
        if (spaces >= 20 && trimmed.length > 0) {
          issues.push({
            type: 'excessive-nesting',
            line: lineNum,
            message: `Excessive nesting depth (${Math.floor(spaces / 4)} levels)`
          });
        }
      }
    }

    // 4. Debt markers
    if (/\b(TODO|FIXME|HACK|XXX):/i.test(line)) {
      const match = line.match(/\b(TODO|FIXME|HACK|XXX):[^\r\n]*/i);
      issues.push({
        type: 'debt-marker',
        line: lineNum,
        message: `Debt marker: ${match ? match[0].trim().slice(0, 80) : 'TODO'}`
      });
    }
  }

  // 5. Excessive file length (> 400 lines)
  if (lines.length > 400) {
    issues.push({
      type: 'excessive-file-length',
      line: lines.length,
      message: `File is large (${lines.length} lines); consider modular extraction`
    });
  }

  if (fix && fileFixed) {
    const eol = content.includes('\r\n') ? '\r\n' : '\n';
    let output = newLines.join(eol);
    if (!output.endsWith(eol) && output.length > 0) output += eol;
    await fs.writeFile(filePath, output, 'utf8');
  }

  return {
    file: filePath,
    lines: lines.length,
    issues,
    fixed: fileFixed
  };
}

export async function runCleanCode(options) {
  const files = await collectFiles(options.target);
  const reports = [];
  let totalIssues = 0;
  let totalFixed = 0;

  for (const file of files) {
    const report = await analyzeFile(file, options.fix);
    if (report.issues.length > 0 || report.fixed) {
      reports.push(report);
      totalIssues += report.issues.length;
      if (report.fixed) totalFixed++;
    }
  }

  return {
    target: options.target,
    scannedFiles: files.length,
    filesWithIssues: reports.length,
    totalIssues,
    fixedFiles: totalFixed,
    reports
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(HELP);
    return;
  }

  const result = await runCleanCode(options);

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(`BAG Clean Code Scanner`);
  console.log(`Target: ${result.target}`);
  console.log(`Scanned: ${result.scannedFiles} file(s)`);
  console.log(`Found:   ${result.totalIssues} issue(s) across ${result.filesWithIssues} file(s)`);
  if (options.fix) console.log(`Fixed:   ${result.fixedFiles} file(s)`);

  if (result.reports.length > 0) {
    console.log(`\nDetailed Issues:`);
    for (const r of result.reports) {
      const rel = path.relative(process.cwd(), r.file);
      console.log(`\n  📄 ${rel} (${r.issues.length} issue${r.issues.length === 1 ? '' : 's'})`);
      for (const iss of r.issues.slice(0, 10)) {
        console.log(`     L${iss.line}: [${iss.type}] ${iss.message}`);
      }
      if (r.issues.length > 10) {
        console.log(`     ... and ${r.issues.length - 10} more issue(s)`);
      }
    }
  } else {
    console.log(`\n✨ No code hygiene issues detected! Clean code maintained.`);
  }
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  main().catch(err => {
    console.error(`Clean Code Error: ${err.message}`);
    process.exitCode = 1;
  });
}
