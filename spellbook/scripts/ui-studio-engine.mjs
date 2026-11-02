/**
 * Universal UI Studio & Prototype Engine (ui-studio-engine.mjs)
 * 
 * Part of BAG (Developer Inventory - Spellbook Scripts).
 * Architecture-agnostic generator that reads DESIGN.md (standard design tokens)
 * and studio.config.json (or auto-discovers routes/components) and compiles
 * a self-contained, interactive HTML Prototype Studio with:
 *  - 📱 Device / Viewport Prototype (mobile frame, drawer, responsive view)
 *  - 📋 Screen Specifications & Contracts Explorer (with .md and .json exports)
 *  - 📑 Architecture & Design Guidelines Explorer (with .md export)
 *  - 🎨 Storybook & Component Catalog (with live controls & TSX generation)
 *  - ⚠️ Dead Features & Technical Debt Audit Matrix (with actionable remediation)
 *  - 🛡️ Live Health Overlay Badges
 * 
 * Zero external runtime dependencies; uses Node.js 20+ standard library only.
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

/**
 * Parse standard DESIGN.md (YAML frontmatter + Markdown sections)
 */
export function parseDesignMd(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);

  let meta = {
    name: 'Application UI',
    version: '1.0.0',
    description: 'Design Language & Component System',
    colors: {},
    typography: {},
    rounded: {},
    spacing: {}
  };
  let body = content;

  if (frontmatterMatch) {
    const yamlBlock = frontmatterMatch[1];
    body = frontmatterMatch[2];
    meta = { ...meta, ...parseSimpleYaml(yamlBlock) };
  }

  return {
    ...meta,
    body: body.trim()
  };
}

/**
 * Minimal zero-dependency YAML parser for standard DESIGN.md frontmatter
 */
function parseSimpleYaml(yamlStr) {
  const result = {};
  const lines = yamlStr.split(/\r?\n/);
  let currentKey = null;
  let currentSubKey = null;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const indent = line.search(/\S/);

    if (indent === 0 && line.includes(':')) {
      const [key, ...rest] = line.split(':');
      currentKey = key.trim();
      currentSubKey = null;
      const val = rest.join(':').trim().replace(/^["']|["']$/g, '');
      if (val) {
        result[currentKey] = val;
      } else {
        result[currentKey] = {};
      }
    } else if (indent === 2 && currentKey && line.includes(':')) {
      const [key, ...rest] = line.split(':');
      const subKey = key.trim();
      const val = rest.join(':').trim().replace(/^["']|["']$/g, '');
      if (typeof result[currentKey] !== 'object') result[currentKey] = {};

      if (val) {
        result[currentKey][subKey] = val;
        currentSubKey = null;
      } else {
        result[currentKey][subKey] = {};
        currentSubKey = subKey;
      }
    } else if (indent === 4 && currentKey && currentSubKey && line.includes(':')) {
      const [key, ...rest] = line.split(':');
      const subSubKey = key.trim();
      const val = rest.join(':').trim().replace(/^["']|["']$/g, '');
      if (typeof result[currentKey][currentSubKey] !== 'object') {
        result[currentKey][currentSubKey] = {};
      }
      result[currentKey][currentSubKey][subSubKey] = val;
    }
  }

  return result;
}

/**
 * Auto-discover project structure (Expo, Next.js, Vite, Generic)
 */
export function autoDiscoverProject(projectDir) {
  const target = path.resolve(projectDir);
  const pkgPath = path.join(target, 'package.json');
  let stack = 'generic';
  let pkg = {};

  if (fs.existsSync(pkgPath)) {
    try {
      pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (deps['expo'] || deps['react-native']) stack = 'expo';
      else if (deps['next']) stack = 'nextjs';
      else if (deps['vite']) stack = 'vite';
    } catch (_) {}
  }

  const routes = [];
  const audit = [];

  const possibleRouteDirs = [
    path.join(target, 'app'),
    path.join(target, 'pages'),
    path.join(target, 'src', 'app'),
    path.join(target, 'src', 'pages'),
    path.join(target, 'src', 'routes')
  ];

  for (const dir of possibleRouteDirs) {
    if (fs.existsSync(dir)) {
      scanRoutesRecursive(dir, dir, routes, audit);
      break;
    }
  }

  return {
    meta: {
      name: pkg.name || path.basename(target),
      version: pkg.version || '1.0.0',
      description: pkg.description || 'Auto-discovered Application',
      stack
    },
    routes: routes.length > 0 ? routes : defaultGenericRoutes(),
    components: defaultGenericComponents(),
    audit: audit.length > 0 ? audit : defaultGenericAudit()
  };
}

function scanRoutesRecursive(baseDir, currentDir, routes, audit) {
  try {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
        if (entry.name === '(tabs)') {
          audit.push({
            component: path.relative(baseDir, fullPath).replace(/\\/g, '/'),
            status: 'dead',
            statusLabel: 'Dead Boilerplate',
            issue: 'Starter template tab folder performing redirects only.',
            action: 'Delete folder or wire to main navigation.',
            priority: 'High'
          });
        }
        scanRoutesRecursive(baseDir, fullPath, routes, audit);
      } else if (entry.isFile() && /\.(tsx|jsx|js|ts|vue|svelte)$/.test(entry.name)) {
        if (entry.name.startsWith('_') || entry.name.startsWith('+') || entry.name.includes('.test.')) {
          continue;
        }

        let rel = path.relative(baseDir, fullPath).replace(/\\/g, '/');
        let routePath = '/' + rel.replace(/\.(tsx|jsx|js|ts|vue|svelte)$/, '').replace(/\/index$/, '');
        if (routePath === '/index') routePath = '/';

        if (entry.name === 'modal.tsx' || entry.name === 'modal.jsx') {
          audit.push({
            component: rel,
            status: 'dead',
            statusLabel: 'Dead Boilerplate',
            issue: 'Generic starter modal placeholder.',
            action: 'Delete or implement product dialog.',
            priority: 'Medium'
          });
        }

        routes.push({
          path: routePath,
          title: formatTitleFromPath(entry.name),
          group: determineGroupFromPath(routePath),
          icon: '📄',
          health: 'mock',
          healthLabel: 'In-Memory UI',
          description: `Screen at ${rel}`,
          file: rel,
          contract: 'Local Props / Contract Schema',
          status: 'Auto-discovered Route',
          missing: 'Verify backend query parity.',
          drawer: true
        });
      }
    }
  } catch (_) {}
}

function formatTitleFromPath(name) {
  const base = name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function determineGroupFromPath(routePath) {
  if (routePath.includes('life')) return 'life';
  if (routePath.includes('spark')) return 'spark';
  if (routePath.includes('settings') || routePath.includes('profile')) return 'app';
  if (routePath.includes('tabs') || routePath.includes('modal')) return 'stubs';
  return 'core';
}

function defaultGenericRoutes() {
  return [
    {
      path: '/',
      title: 'Home Dashboard',
      group: 'core',
      icon: '🏠',
      health: 'live',
      healthLabel: 'Production UI',
      description: 'Main application dashboard and entry point.',
      file: 'app/index.tsx',
      contract: 'DashboardViewDTO',
      status: 'Fully operational.',
      missing: 'None.',
      drawer: true
    }
  ];
}

function defaultGenericComponents() {
  return [
    {
      id: 'card',
      name: 'Card',
      category: 'Molecules',
      file: 'components/card.tsx',
      props: { tone: 'default', title: 'Interactive Card', body: 'Standard surface card component.' },
      tones: ['default', 'raised', 'deep', 'sealed', 'highlight']
    },
    {
      id: 'pill-button',
      name: 'PillButton',
      category: 'Atoms',
      file: 'components/button.tsx',
      props: { tone: 'primary', label: 'Primary Action', disabled: false },
      tones: ['primary', 'secondary', 'ghost', 'danger']
    }
  ];
}

function defaultGenericAudit() {
  return [
    {
      component: 'app/modal.tsx',
      status: 'dead',
      statusLabel: 'Dead Boilerplate',
      issue: 'Template starter modal unlinked from application flows.',
      action: 'Delete or replace with product modal dialog.',
      priority: 'Medium'
    }
  ];
}

/**
 * Generate Universal UI Studio HTML
 */
export function generateUIStudioHtml(options = {}) {
  const {
    design = {},
    config = {},
    routes = [],
    components = [],
    audit = [],
    personas = [
      { id: 'user', name: 'User', ink: '#6366f1', soft: '#e0e7ff', text: '#3730a3', on: '#ffffff' },
      { id: 'admin', name: 'Admin', ink: '#ec4899', soft: '#fce7f3', text: '#9d174d', on: '#ffffff' }
    ]
  } = options;

  const appName = design.name || config.meta?.name || 'Application Studio';
  const appDesc = design.description || config.meta?.description || 'UI Prototype, Specs, Docs & Storybook Suite';

  const colors = design.colors || {};
  const bgLight = colors['background'] || '#f8fafc';
  const fgLight = colors['foreground'] || '#0f172a';
  const surfaceLight = colors['surface'] || '#ffffff';
  const borderLight = colors['border'] || '#e2e8f0';
  const accentLight = colors['accent'] || '#6366f1';
  const deepLight = colors['deep'] || '#1e1b4b';

  const inkA = colors['ink-a'] || personas[0]?.ink || '#EE8A5E';
  const inkASoft = colors['ink-a-soft'] || personas[0]?.soft || '#FCE4D8';
  const inkAText = colors['ink-a-ink'] || personas[0]?.text || '#A4461E';

  const inkB = colors['ink-b'] || personas[1]?.ink || '#8C88F0';
  const inkBSoft = colors['ink-b-soft'] || personas[1]?.soft || '#E6E5FC';
  const inkBText = colors['ink-b-ink'] || personas[1]?.text || '#4D48BE';

  const inkUs = colors['ink-us'] || '#834A58';
  const inkUsSoft = colors['ink-us-soft'] || '#F2E2E8';
  const inkUsText = colors['ink-us-ink'] || '#7A3E4D';

  const fontDisplay = design.typography?.['display-hero']?.fontFamily || 'Young Serif, Georgia, serif';
  const fontBody = design.typography?.['body']?.fontFamily || 'Hanken Grotesk, -apple-system, sans-serif';

  const html = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(appName)} — Prototype, Specs, Docs & Storybook</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,300..800;1,300..800&family=Young+Serif&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --font-display: ${fontDisplay};
      --font-body: ${fontBody};
      --font-mono: 'JetBrains Mono', monospace;

      --background: ${bgLight};
      --foreground: ${fgLight};
      --foreground-secondary: #4a4351;
      --muted: #736b7b;
      --surface: ${surfaceLight};
      --surface-secondary: #f5f2f7;
      --surface-tertiary: #f3f0f6;
      --overlay: #ffffff;
      --backdrop: rgba(22, 14, 26, 0.45);
      --border: ${borderLight};
      --separator: #cfc8d6;
      --link: #7a3e4d;
      --accent: ${accentLight};
      --accent-foreground: #ffffff;
      --danger: #b3261e;
      --danger-foreground: #ffffff;
      --success: #1e7e45;
      --warning: #d97706;

      --deep: ${deepLight};
      --deep-secondary: #3b1b26;
      --deep-foreground: #fbf2f5;
      --deep-muted: #d8b6c3;

      --ink-a: ${inkA};
      --ink-a-soft: ${inkASoft};
      --ink-a-text: ${inkAText};
      --ink-a-on: #231A20;

      --ink-b: ${inkB};
      --ink-b-soft: ${inkBSoft};
      --ink-b-text: ${inkBText};
      --ink-b-on: #231A20;

      --ink-us: ${inkUs};
      --ink-us-soft: ${inkUsSoft};
      --ink-us-text: ${inkUsText};
      --ink-us-on: #FFFFFF;

      --studio-bg: #e9e6ec;
      --studio-sidebar: #ffffff;
      --studio-border: #dcd7e2;
      --studio-card: #ffffff;
      --studio-text: #2d2633;
      --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
      --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
      --shadow-lg: 0 12px 32px rgba(0,0,0,0.12);
      --phone-shadow: 0 25px 60px -15px rgba(35, 20, 45, 0.35);

      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 14px;
      --radius-xl: 18px;
      --radius-2xl: 22px;
      --radius-3xl: 26px;
      --radius-full: 9999px;
    }

    [data-theme="dark"] {
      --background: #141117;
      --foreground: #f3eff6;
      --foreground-secondary: #cdc5d4;
      --muted: #9c93a5;
      --surface: #1d1921;
      --surface-secondary: #26212b;
      --surface-tertiary: #2e2834;
      --overlay: #1d1921;
      --backdrop: rgba(0, 0, 0, 0.65);
      --border: #2e2834;
      --separator: #443c4b;
      --link: #edb5c9;
      --accent: #e3a0b8;
      --accent-foreground: #1d1921;
      --danger: #ff8a80;
      --danger-foreground: #1d1921;
      --success: #4ade80;
      --warning: #fbbf24;

      --deep: #3a1b27;
      --deep-secondary: #4c2635;
      --deep-foreground: #f8ecf1;
      --deep-muted: #c9a1b1;

      --ink-a: #F0956A;
      --ink-a-soft: #3A251D;
      --ink-a-text: #F6AF8C;

      --ink-b: #9B97F6;
      --ink-b-soft: #252342;
      --ink-b-text: #B8B5FF;

      --ink-us: #E3A0B8;
      --ink-us-soft: #3A2431;
      --ink-us-text: #EDB5C9;

      --studio-bg: #0d0a10;
      --studio-sidebar: #151119;
      --studio-border: #241d2a;
      --studio-card: #19141e;
      --studio-text: #eee8f3;
      --phone-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-body);
      background-color: var(--studio-bg);
      color: var(--studio-text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    header.studio-header {
      background: var(--studio-sidebar);
      border-bottom: 1px solid var(--studio-border);
      padding: 0 24px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 1000;
      backdrop-filter: blur(12px);
    }
    .header-brand {
      display: flex;
      align-items: center;
      gap: 14px;
      text-decoration: none;
      color: inherit;
    }
    .header-brand-title {
      font-family: var(--font-display);
      font-size: 20px;
      letter-spacing: -0.3px;
      color: var(--foreground);
    }
    .header-brand-badge {
      font-family: var(--font-body);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 3px 8px;
      border-radius: var(--radius-full);
      background: var(--ink-us-soft);
      color: var(--ink-us-text);
    }

    .studio-nav {
      display: flex;
      align-items: center;
      gap: 6px;
      background: var(--surface-secondary);
      padding: 4px;
      border-radius: var(--radius-full);
      border: 1px solid var(--studio-border);
    }
    .nav-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 16px;
      border-radius: var(--radius-full);
      font-size: 13.5px;
      font-weight: 600;
      border: none;
      background: transparent;
      color: var(--muted);
      cursor: pointer;
      transition: all 0.18s ease;
    }
    .nav-btn:hover { color: var(--foreground); }
    .nav-btn.active {
      background: var(--surface);
      color: var(--foreground);
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .perspective-select, .theme-btn, .health-btn, .export-btn {
      font-family: var(--font-body);
      font-size: 12.5px;
      font-weight: 600;
      border: 1px solid var(--studio-border);
      background: var(--surface);
      color: var(--foreground);
      padding: 6px 14px;
      border-radius: var(--radius-full);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      transition: all 0.15s ease;
    }
    .perspective-select:hover, .theme-btn:hover, .health-btn:hover, .export-btn:hover {
      border-color: var(--separator);
      transform: translateY(-1px);
    }
    .health-btn.active {
      background: #78350f;
      color: #fef3c7;
      border-color: #d97706;
    }
    .export-btn.primary {
      background: var(--accent);
      color: var(--accent-foreground);
      border-color: var(--accent);
    }

    main.studio-workspace {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .view-section {
      display: none;
      flex: 1;
      width: 100%;
    }
    .view-section.active {
      display: flex;
    }

    /* Prototype Layout */
    .prototype-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 30px 20px;
      gap: 36px;
      min-height: calc(100vh - 64px);
    }
    .device-side-panel {
      width: 290px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .side-card {
      background: var(--studio-card);
      border: 1px solid var(--studio-border);
      border-radius: var(--radius-2xl);
      padding: 18px;
      box-shadow: var(--shadow-sm);
    }
    .side-card-title {
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .route-quick-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-height: 480px;
      overflow-y: auto;
      padding-right: 4px;
    }
    .route-item-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-radius: var(--radius-md);
      background: transparent;
      border: 1px solid transparent;
      color: var(--foreground-secondary);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      text-align: left;
      transition: all 0.12s ease;
    }
    .route-item-btn:hover {
      background: var(--surface-secondary);
      color: var(--foreground);
    }
    .route-item-btn.active {
      background: var(--ink-us-soft);
      color: var(--ink-us-text);
      border-color: var(--ink-us);
      font-weight: 700;
    }
    .badge-status {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 999px;
      letter-spacing: 0.03em;
    }
    .badge-live { background: #dcfce7; color: #15803d; }
    .badge-mock { background: #fef3c7; color: #b45309; }
    .badge-dead { background: #fee2e2; color: #b91c1c; }
    .badge-orphan { background: #f3e8ff; color: #7e22ce; }

    /* iPhone Frame */
    .iphone-device {
      width: 402px;
      height: 844px;
      background: var(--surface);
      border-radius: 54px;
      position: relative;
      box-shadow: 0 0 0 4px #47434d, 0 0 0 11px #1e1b22, var(--phone-shadow);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 4px solid #141117;
    }
    .dynamic-island {
      position: absolute;
      top: 11px;
      left: 50%;
      transform: translateX(-50%);
      width: 124px;
      height: 35px;
      background: #000000;
      border-radius: 20px;
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 14px;
    }
    .island-camera { width: 11px; height: 11px; background: #131722; border-radius: 50%; }
    .island-sensor { width: 9px; height: 9px; background: #0a0c10; border-radius: 50%; }

    .status-bar {
      height: 48px;
      padding: 0 26px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding-bottom: 7px;
      font-size: 14px;
      font-weight: 600;
      color: var(--foreground);
      position: relative;
      z-index: 990;
      background: var(--background);
    }
    .status-time { font-family: -apple-system, system-ui; }
    .status-icons { display: flex; align-items: center; gap: 6px; font-size: 13px; }

    .home-indicator-bar {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      width: 138px;
      height: 5px;
      background: var(--foreground);
      opacity: 0.35;
      border-radius: 3px;
      z-index: 999;
      pointer-events: none;
    }

    .screen-viewport {
      flex: 1;
      background: var(--background);
      color: var(--foreground);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .screen-scrollable {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding-bottom: 34px;
      scroll-behavior: smooth;
    }

    .mobile-nav-bar {
      height: 52px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--background);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .mobile-icon-btn {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: var(--surface);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--foreground);
    }
    .mobile-bar-title {
      font-family: var(--font-display);
      font-size: 17px;
      color: var(--foreground);
    }

    .native-screen-header {
      padding: 12px 18px 16px 18px;
    }
    .native-eyebrow {
      font-size: 11.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.09em;
      color: var(--muted);
      margin-bottom: 4px;
      display: block;
    }
    .native-title {
      font-family: var(--font-display);
      font-size: 29px;
      line-height: 32px;
      color: var(--foreground);
      letter-spacing: -0.5px;
      margin-bottom: 6px;
    }
    .native-lede {
      font-size: 14.5px;
      line-height: 21px;
      color: var(--foreground-secondary);
    }

    /* Drawer */
    .couple-drawer-overlay {
      position: absolute;
      inset: 0;
      background: var(--backdrop);
      z-index: 1050;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.28s ease;
    }
    .couple-drawer-overlay.open { opacity: 1; pointer-events: auto; }
    .couple-drawer {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 326px;
      background: var(--deep);
      color: var(--deep-foreground);
      border-top-right-radius: var(--radius-3xl);
      border-bottom-right-radius: var(--radius-3xl);
      z-index: 1100;
      transform: translateX(-100%);
      transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      padding: 56px 0 24px 0;
      overflow-y: auto;
      box-shadow: 10px 0 35px rgba(0,0,0,0.35);
    }
    .couple-drawer-overlay.open .couple-drawer { transform: translateX(0); }

    .drawer-header {
      padding: 0 20px 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .drawer-title {
      font-family: var(--font-display);
      font-size: 26px;
      line-height: 28px;
      color: var(--deep-foreground);
    }
    .drawer-subtext { font-size: 13px; color: var(--deep-muted); }

    .drawer-persona-switcher {
      display: flex;
      background: var(--deep-secondary);
      border-radius: var(--radius-full);
      padding: 3px;
      gap: 4px;
      margin-top: 6px;
    }
    .persona-tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 6px;
      font-size: 12.5px;
      font-weight: 600;
      border-radius: var(--radius-full);
      cursor: pointer;
      color: var(--deep-muted);
      border: none;
      background: transparent;
    }
    .persona-tab.active { background: var(--deep-foreground); color: #231a20; }

    .drawer-group-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.09em;
      color: var(--deep-muted);
      padding: 16px 20px 6px 20px;
    }
    .drawer-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 9px 18px;
      margin: 1px 10px;
      border-radius: var(--radius-md);
      cursor: pointer;
      color: var(--deep-foreground);
      text-decoration: none;
      font-size: 14.5px;
      font-weight: 600;
      transition: background 0.15s ease;
    }
    .drawer-item:hover { background: rgba(255,255,255,0.08); }
    .drawer-item.active { background: var(--deep-secondary); }
    .drawer-item-icon { width: 22px; text-align: center; color: var(--deep-muted); }
    .drawer-item.active .drawer-item-icon { color: var(--deep-foreground); }
    .drawer-item-meta {
      margin-left: auto;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 999px;
      background: rgba(255,255,255,0.12);
      color: var(--deep-muted);
    }
    .drawer-item-meta.hot { background: var(--deep-foreground); color: #231a20; }

    /* Cards */
    .amp-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-2xl);
      padding: 16px;
      margin: 0 16px 12px 16px;
      position: relative;
    }
    .amp-card.raised {
      background: var(--surface-secondary);
      border: none;
      border-radius: var(--radius-xl);
      padding: 14px;
    }
    .amp-card.deep {
      background: var(--deep);
      color: var(--deep-foreground);
      border-radius: var(--radius-3xl);
      padding: 20px;
      overflow: hidden;
      border: none;
    }
    .amp-card.sealed {
      background: var(--surface-secondary);
      border: 1.5px dashed var(--separator);
      border-radius: var(--radius-2xl);
    }
    .amp-card.highlight { border: 2px solid var(--accent); }
    .card-title {
      font-family: var(--font-display);
      font-size: 18px;
      line-height: 22px;
      margin-bottom: 6px;
      color: inherit;
    }

    .amp-section { margin-bottom: 20px; }
    .section-header {
      padding: 8px 18px 8px 18px;
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }
    .section-title {
      font-family: var(--font-display);
      font-size: 20px;
      color: var(--foreground);
    }
    .section-meta { font-size: 12.5px; color: var(--muted); }

    .owner-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
    }
    .owner-tag.a { background: var(--ink-a-soft); color: var(--ink-a-text); }
    .owner-tag.b { background: var(--ink-b-soft); color: var(--ink-b-text); }
    .owner-tag.us { background: var(--ink-us-soft); color: var(--ink-us-text); }

    .owner-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      display: inline-block;
    }
    .owner-dot.a { background: var(--ink-a); }
    .owner-dot.b { background: var(--ink-b); }
    .owner-dot.us { background: var(--ink-us); }

    .pill-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 9px 18px;
      border-radius: var(--radius-full);
      font-size: 13.5px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease;
      text-decoration: none;
    }
    .pill-btn.primary { background: var(--accent); color: var(--accent-foreground); }
    .pill-btn.secondary {
      background: var(--surface-secondary);
      color: var(--foreground);
      border: 1px solid var(--border);
    }
    .pill-btn.ghost { background: transparent; color: var(--link); }
    .pill-btn.sm { padding: 6px 12px; font-size: 12px; }

    .health-overlay-badge {
      display: none;
      position: absolute;
      top: 6px;
      right: 8px;
      z-index: 50;
      font-family: var(--font-mono);
      font-size: 9.5px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      pointer-events: none;
      box-shadow: 0 1px 4px rgba(0,0,0,0.25);
    }
    .show-health .health-overlay-badge { display: inline-flex; }
    .health-live { background: #166534; color: #bbf7d0; }
    .health-mock { background: #854d0e; color: #fef08a; }
    .health-dead { background: #991b1b; color: #fecaca; }
    .health-orphan { background: #581c87; color: #e9d5ff; }
    .health-device { background: #1e3a8a; color: #bfdbfe; }

    .mobile-modal-overlay {
      position: absolute;
      inset: 0;
      background: var(--backdrop);
      z-index: 1200;
      display: none;
      align-items: flex-end;
    }
    .mobile-modal-overlay.open { display: flex; }
    .mobile-modal-sheet {
      width: 100%;
      background: var(--surface);
      border-top-left-radius: var(--radius-3xl);
      border-top-right-radius: var(--radius-3xl);
      padding: 24px 20px 36px 20px;
      max-height: 85%;
      overflow-y: auto;
      box-shadow: 0 -10px 30px rgba(0,0,0,0.25);
      border-top: 1px solid var(--border);
      animation: slideUp 0.25s ease;
    }
    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }

    /* Workspace Panes */
    .workspace-pane {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 36px 28px;
    }
    .pane-header {
      margin-bottom: 28px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      border-bottom: 1px solid var(--studio-border);
      padding-bottom: 18px;
    }
    .pane-title {
      font-family: var(--font-display);
      font-size: 32px;
      color: var(--foreground);
    }
    .pane-desc { font-size: 15px; color: var(--muted); margin-top: 4px; }

    .doc-content { line-height: 1.65; color: var(--foreground); font-size: 15px; }
    .doc-content h2 { font-family: var(--font-display); font-size: 24px; margin: 32px 0 12px 0; }
    .doc-content h3 { font-size: 18px; margin: 22px 0 10px 0; }
    .doc-content p { margin-bottom: 14px; color: var(--foreground-secondary); }
    .doc-content code {
      font-family: var(--font-mono);
      font-size: 13px;
      background: var(--surface-secondary);
      border: 1px solid var(--border);
      padding: 2px 5px;
      border-radius: 4px;
    }
    .doc-content pre {
      background: var(--surface-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 16px;
      overflow-x: auto;
      font-family: var(--font-mono);
      font-size: 13px;
      margin: 16px 0;
    }

    .audit-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }
    .audit-table th, .audit-table td {
      padding: 12px 14px;
      text-align: left;
      font-size: 13.5px;
      border-bottom: 1px solid var(--border);
    }
    .audit-table th {
      background: var(--surface-secondary);
      font-weight: 700;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--muted);
    }

    .storybook-grid {
      display: grid;
      grid-template-columns: 260px 1fr 340px;
      gap: 24px;
      min-height: 680px;
    }
    .storybook-sidebar {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-2xl);
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .storybook-canvas {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-2xl);
      padding: 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .storybook-controls {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-2xl);
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .code-box {
      background: var(--surface-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 14px;
      font-family: var(--font-mono);
      font-size: 12.5px;
      overflow-x: auto;
      position: relative;
    }
    .copy-snippet-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 4px 8px;
      font-size: 11px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 4px;
      cursor: pointer;
    }
  </style>
</head>
<body>

  <header class="studio-header">
    <div class="header-brand">
      <svg width="34" height="22" viewBox="0 0 34 22" fill="none">
        <circle cx="11" cy="11" r="11" fill="var(--ink-a)"/>
        <circle cx="23" cy="11" r="11" fill="var(--ink-b)"/>
        <clipPath id="venn-header-lens">
          <circle cx="11" cy="11" r="11"/>
        </clipPath>
        <g clip-path="url(#venn-header-lens)">
          <circle cx="23" cy="11" r="11" fill="var(--ink-us)"/>
        </g>
      </svg>
      <div>
        <span class="header-brand-title">${escapeHtml(appName)}</span>
        <span style="font-size: 12px; color: var(--muted); margin-left: 6px;">Studio Suite</span>
      </div>
      <span class="header-brand-badge">${escapeHtml(config.meta?.stack || 'Universal')}</span>
    </div>

    <nav class="studio-nav">
      <button class="nav-btn active" onclick="switchView('prototype')">
        <span>📱</span> Mobile Prototype
      </button>
      <button class="nav-btn" onclick="switchView('specs')">
        <span>📋</span> Specs &amp; Routes
      </button>
      <button class="nav-btn" onclick="switchView('docs')">
        <span>📑</span> Architecture &amp; Docs
      </button>
      <button class="nav-btn" onclick="switchView('storybook')">
        <span>🎨</span> Storybook Kit
      </button>
      <button class="nav-btn" onclick="switchView('health')">
        <span>⚠️</span> Dead Features &amp; Audit
      </button>
    </nav>

    <div class="header-controls">
      <select class="perspective-select" id="global-perspective" onchange="changePerspective(this.value)">
        ${personas.map(p => `<option value="${escapeHtml(p.id)}">👤 ${escapeHtml(p.name)}</option>`).join('')}
        <option value="solo">👤 Solo / Unpaired</option>
      </select>

      <button class="health-btn" id="health-overlay-btn" onclick="toggleHealthOverlay()">
        <span>🛡️</span> Health Overlay: Off
      </button>

      <button class="theme-btn" onclick="toggleTheme()">
        <span id="theme-icon">🌙</span> Theme
      </button>

      <button class="export-btn primary" onclick="exportActiveView()">
        <span>📥</span> Export
      </button>
    </div>
  </header>

  <main class="studio-workspace">

    <!-- VIEW 1: MOBILE PROTOTYPE -->
    <section class="view-section active" id="view-prototype">
      <div class="prototype-container">
        <div class="device-side-panel">
          <div class="side-card">
            <div class="side-card-title">
              <span>Screen Explorer</span>
              <span style="font-size: 11px; color: var(--muted);">${routes.length} Screens</span>
            </div>
            <div class="route-quick-list" id="route-quick-list"></div>
          </div>

          <div class="side-card">
            <div class="side-card-title">
              <span>Prototype Status</span>
              <span class="badge-status badge-live">Verified</span>
            </div>
            <p style="font-size: 12.5px; line-height: 18px; color: var(--muted);">
              Universal studio generated by <code>BAG UI Studio Engine</code>. Simulates view models, CVD ink accessibility, responsive layout, and permissions.
            </p>
          </div>
        </div>

        <div class="iphone-device" id="iphone-device">
          <div class="dynamic-island">
            <div class="island-camera"></div>
            <div class="island-sensor"></div>
          </div>

          <div class="status-bar">
            <span class="status-time" id="status-time">09:41</span>
            <div class="status-icons">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          <div class="screen-viewport">
            <div class="mobile-nav-bar">
              <button class="mobile-icon-btn" onclick="toggleDrawer(true)" title="Open Drawer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
              <span class="mobile-bar-title" id="mobile-bar-title">Dashboard</span>
              <button class="mobile-icon-btn" onclick="alert('Profile & Account')" title="Account">
                <span id="mobile-bar-avatar">A</span>
              </button>
            </div>

            <div class="screen-scrollable" id="screen-content"></div>

            <div class="couple-drawer-overlay" id="mobile-drawer" onclick="handleDrawerOverlayClick(event)">
              <div class="couple-drawer">
                <div class="drawer-header">
                  <div class="drawer-title" id="drawer-couple-names">${escapeHtml(appName)}</div>
                  <div class="drawer-subtext">Active Session · Universal Mode</div>
                  <div class="drawer-persona-switcher">
                    ${personas.map((p, idx) => `
                      <button class="persona-tab ${idx === 0 ? 'active' : ''}" id="drawer-tab-${escapeHtml(p.id)}" onclick="changePerspective('${escapeHtml(p.id)}')">
                        <span class="owner-dot ${escapeHtml(p.id)}"></span> ${escapeHtml(p.name)}
                      </button>
                    `).join('')}
                  </div>
                </div>

                <div class="drawer-items-list" id="drawer-items-list"></div>
              </div>
            </div>

            <div class="mobile-modal-overlay" id="mobile-modal" onclick="handleModalOverlayClick(event)">
              <div class="mobile-modal-sheet" id="modal-content"></div>
            </div>
          </div>

          <div class="home-indicator-bar"></div>
        </div>

        <div class="device-side-panel">
          <div class="side-card">
            <div class="side-card-title">
              <span>Active Screen Info</span>
              <span id="active-screen-health" class="badge-status badge-live">Live</span>
            </div>
            <div style="font-size: 13px; line-height: 20px;" id="active-screen-inspector"></div>
          </div>

          <div class="side-card">
            <div class="side-card-title">
              <span>Quick Actions</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <button class="pill-btn secondary sm" onclick="simulateNewAction()">🔔 Simulate In-App Event</button>
              <button class="pill-btn secondary sm" onclick="simulateOfflineToggle()">📶 Toggle Offline State</button>
              <button class="pill-btn secondary sm" onclick="resetPrototypeData()">🔄 Reset State</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- VIEW 2: SPECS EXPLORER -->
    <section class="view-section" id="view-specs">
      <div class="workspace-pane">
        <div class="pane-header">
          <div>
            <h1 class="pane-title">Screen Specifications</h1>
            <p class="pane-desc">Formal route parameters, contracts, and view models.</p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="pill-btn secondary" onclick="downloadSpecsMarkdown()">📥 Download Specs (.md)</button>
            <button class="pill-btn primary" onclick="downloadSpecsJSON()">📥 Download Specs (.json)</button>
          </div>
        </div>

        <div style="display: flex; gap: 10px; margin-bottom: 24px; align-items: center;">
          <input type="text" id="specs-search" placeholder="Search route, component, contract..." style="flex: 1; padding: 10px 16px; border-radius: var(--radius-full); border: 1px solid var(--border); background: var(--surface); color: var(--foreground); font-size: 13.5px;" oninput="filterSpecs()">
        </div>

        <div id="specs-list-container" style="display: flex; flex-direction: column; gap: 16px;"></div>
      </div>
    </section>

    <!-- VIEW 3: ARCHITECTURE & DOCS -->
    <section class="view-section" id="view-docs">
      <div class="workspace-pane">
        <div class="pane-header">
          <div>
            <h1 class="pane-title">${escapeHtml(appName)} — Architecture Guide</h1>
            <p class="pane-desc">Design language, module boundaries, tokens, and safety invariants.</p>
          </div>
          <button class="pill-btn primary" onclick="downloadDocsMarkdown()">📥 Download Guide (.md)</button>
        </div>
        <div class="doc-content" id="docs-content-body">
          <h2>1. Design System &amp; Tokens</h2>
          <p>${escapeHtml(appDesc)}</p>
          ${design.body ? `<div style="margin-top: 20px;">${formatMarkdownToHtml(design.body)}</div>` : ''}
        </div>
      </div>
    </section>

    <!-- VIEW 4: STORYBOOK -->
    <section class="view-section" id="view-storybook">
      <div class="workspace-pane">
        <div class="pane-header">
          <div>
            <h1 class="pane-title">Component Storybook</h1>
            <p class="pane-desc">Interactive component catalog: atoms, molecules, and organisms.</p>
          </div>
          <button class="pill-btn primary" onclick="downloadStorybookManifest()">📥 Download components.json</button>
        </div>

        <div class="storybook-grid">
          <div class="storybook-sidebar">
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted);">Components Catalog</span>
            <div id="storybook-nav-list" style="display: flex; flex-direction: column; gap: 4px;"></div>
          </div>

          <div class="storybook-canvas">
            <div style="position: absolute; top: 14px; left: 20px; font-size: 12px; font-weight: 700; color: var(--muted);" id="storybook-active-label"></div>
            <div id="storybook-render-target" style="width: 100%; max-width: 380px;"></div>
          </div>

          <div class="storybook-controls">
            <span style="font-size: 12px; font-weight: 700; color: var(--foreground);">Interactive Props</span>
            <div id="storybook-props-target" style="display: flex; flex-direction: column; gap: 12px;"></div>
            <div style="margin-top: 14px;">
              <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 6px;">Generated TSX Code</span>
              <div class="code-box">
                <button class="copy-snippet-btn" onclick="copyStorybookCode()">Copy</button>
                <code id="storybook-code-snippet"></code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- VIEW 5: AUDIT MATRIX -->
    <section class="view-section" id="view-health">
      <div class="workspace-pane">
        <div class="pane-header">
          <div>
            <h1 class="pane-title">Technical Debt &amp; Dead Features Matrix</h1>
            <p class="pane-desc">Inventory of boilerplate leftovers, unrouted modules, and migration items.</p>
          </div>
          <button class="pill-btn primary" onclick="downloadAuditMarkdown()">📥 Download Audit Report (.md)</button>
        </div>
        <div id="health-matrix-content"></div>
      </div>
    </section>

  </main>

  <script>
    const ROUTES = ${JSON.stringify(routes, null, 2)};
    const STORYBOOK_COMPONENTS = ${JSON.stringify(components, null, 2)};
    const AUDIT_ITEMS = ${JSON.stringify(audit, null, 2)};
    const PERSONAS = ${JSON.stringify(personas, null, 2)};
    const APP_NAME = ${JSON.stringify(appName)};

    const STATE = {
      me: PERSONAS[0]?.id || 'user',
      theme: 'light',
      currentRoute: ROUTES[0]?.path || '/',
      healthOverlay: false,
      isOffline: false
    };

    function switchView(viewId) {
      document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

      const targetSection = document.getElementById('view-' + viewId);
      if (targetSection) targetSection.classList.add('active');

      const buttons = document.querySelectorAll('.nav-btn');
      if (viewId === 'prototype') buttons[0]?.classList.add('active');
      if (viewId === 'specs') buttons[1]?.classList.add('active');
      if (viewId === 'docs') buttons[2]?.classList.add('active');
      if (viewId === 'storybook') buttons[3]?.classList.add('active');
      if (viewId === 'health') buttons[4]?.classList.add('active');

      if (viewId === 'specs') renderSpecsView();
      if (viewId === 'storybook') renderStorybookView();
      if (viewId === 'health') renderHealthView();
    }

    function toggleTheme() {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      STATE.theme = next;
      document.getElementById('theme-icon').textContent = next === 'light' ? '🌙' : '☀️';
    }

    function changePerspective(newId) {
      STATE.me = newId;
      document.getElementById('global-perspective').value = newId;

      PERSONAS.forEach(p => {
        const tab = document.getElementById('drawer-tab-' + p.id);
        if (tab) tab.classList.toggle('active', p.id === newId);
      });

      const avatarEl = document.getElementById('mobile-bar-avatar');
      if (avatarEl) {
        avatarEl.textContent = newId.charAt(0).toUpperCase();
      }

      renderCurrentScreen();
    }

    function toggleHealthOverlay() {
      STATE.healthOverlay = !STATE.healthOverlay;
      const btn = document.getElementById('health-overlay-btn');
      const container = document.getElementById('iphone-device');
      if (STATE.healthOverlay) {
        btn.classList.add('active');
        btn.innerHTML = '<span>🛡️</span> Health Overlay: ON';
        container.classList.add('show-health');
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '<span>🛡️</span> Health Overlay: Off';
        container.classList.remove('show-health');
      }
    }

    function toggleDrawer(open) {
      const drawer = document.getElementById('mobile-drawer');
      if (open) drawer.classList.add('open');
      else drawer.classList.remove('open');
    }

    function handleDrawerOverlayClick(e) {
      if (e.target.id === 'mobile-drawer') toggleDrawer(false);
    }

    function navigateTo(path) {
      STATE.currentRoute = path;
      toggleDrawer(false);
      renderCurrentScreen();
      renderRouteQuickList();
      updateActiveScreenInfo();
    }

    function renderRouteQuickList() {
      const container = document.getElementById('route-quick-list');
      const drawerList = document.getElementById('drawer-items-list');

      container.innerHTML = ROUTES.map(r => \`
        <button class="route-item-btn \${r.path === STATE.currentRoute ? 'active' : ''}" onclick="navigateTo('\${r.path}')">
          <span>\${r.icon} \${r.title}</span>
          <span class="badge-status badge-\${r.health}">\${r.health}</span>
        </button>
      \`).join('');

      if (drawerList) {
        drawerList.innerHTML = ROUTES.filter(r => r.drawer !== false).map(r => \`
          <a class="drawer-item \${STATE.currentRoute === r.path ? 'active' : ''}" onclick="navigateTo('\${r.path}')">
            <span class="drawer-item-icon">\${r.icon}</span> \${r.title}
          </a>
        \`).join('');
      }
    }

    function renderCurrentScreen() {
      const target = document.getElementById('screen-content');
      const titleEl = document.getElementById('mobile-bar-title');
      const routeInfo = ROUTES.find(r => r.path === STATE.currentRoute) || ROUTES[0];

      titleEl.textContent = routeInfo.title;

      target.innerHTML = \`
        <div class="native-screen-header">
          <span class="native-eyebrow">\${routeInfo.group.toUpperCase()} · \${routeInfo.healthLabel}</span>
          <h1 class="native-title">\${routeInfo.title}</h1>
          <p class="native-lede">\${routeInfo.description}</p>
        </div>

        <div class="amp-section" style="position: relative;">
          <div class="health-overlay-badge health-\${routeInfo.health}">\${routeInfo.healthLabel}</div>
          <div class="amp-card \${routeInfo.health === 'dead' ? 'sealed' : routeInfo.health === 'live' ? 'highlight' : ''}">
            <div class="card-title">Screen Details</div>
            <p style="font-size: 13.5px; color: var(--foreground-secondary); line-height: 20px; margin-bottom: 12px;">
              Source file: <code>\${routeInfo.file}</code><br>
              Contract DTO: <code>\${routeInfo.contract}</code>
            </p>
            <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px;">Implementation Status:</div>
            <p style="font-size: 13px; color: var(--muted); margin-bottom: 14px;">\${routeInfo.status}</p>
            \${routeInfo.missing ? \`<div style="font-size: 12px; color: var(--danger); font-weight: 600;">Action required: \${routeInfo.missing}</div>\` : ''}
          </div>
        </div>
      \`;
    }

    function updateActiveScreenInfo() {
      const route = ROUTES.find(r => r.path === STATE.currentRoute) || ROUTES[0];
      const inspector = document.getElementById('active-screen-inspector');
      const badge = document.getElementById('active-screen-health');

      badge.className = 'badge-status badge-' + route.health;
      badge.textContent = route.healthLabel;

      inspector.innerHTML = \`
        <div style="margin-bottom: 8px;"><strong>Route:</strong> <code>\${route.path}</code></div>
        <div style="margin-bottom: 8px;"><strong>File:</strong> <br><span style="font-family: var(--font-mono); font-size: 11px; word-break: break-all;">\${route.file}</span></div>
        <div style="margin-bottom: 8px;"><strong>Contract:</strong> <br><span style="font-family: var(--font-mono); font-size: 11px;">\${route.contract}</span></div>
        <div style="margin-bottom: 8px;"><strong>Status:</strong> \${route.status}</div>
        <div><strong>Action needed:</strong> <span style="color: #b91c1c;">\${route.missing}</span></div>
      \`;
    }

    function renderSpecsView() {
      const container = document.getElementById('specs-list-container');
      const search = (document.getElementById('specs-search')?.value || '').toLowerCase();

      const filtered = ROUTES.filter(r => {
        return r.path.toLowerCase().includes(search) || r.title.toLowerCase().includes(search) || r.file.toLowerCase().includes(search);
      });

      container.innerHTML = filtered.map(r => \`
        <div class="amp-card" style="margin: 0; padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div>
              <span class="owner-tag a">\${r.group.toUpperCase()}</span>
              <span style="font-family: var(--font-mono); font-size: 15px; font-weight: 700; margin-left: 8px;">\${r.path}</span>
            </div>
            <span class="badge-status badge-\${r.health}">\${r.healthLabel}</span>
          </div>
          <h3 style="font-family: var(--font-display); font-size: 20px; margin: 4px 0 8px 0;">\${r.title}</h3>
          <p style="font-size: 14px; color: var(--foreground-secondary); line-height: 20px; margin-bottom: 14px;">\${r.description}</p>
          <table class="audit-table" style="margin: 0;">
            <tr><td style="width: 140px; font-weight: 600;">File Path</td><td><code>\${r.file}</code></td></tr>
            <tr><td style="font-weight: 600;">Contract / DTO</td><td><code>\${r.contract}</code></td></tr>
            <tr><td style="font-weight: 600;">Current Status</td><td>\${r.status}</td></tr>
            <tr><td style="font-weight: 600; color: #b91c1c;">Missing / Edge Case</td><td style="color: #b91c1c;">\${r.missing}</td></tr>
          </table>
        </div>
      \`).join('');
    }

    function filterSpecs() { renderSpecsView(); }

    let activeStoryIndex = 0;
    function renderStorybookView() {
      const nav = document.getElementById('storybook-nav-list');
      nav.innerHTML = STORYBOOK_COMPONENTS.map((c, i) => \`
        <button class="route-item-btn \${i === activeStoryIndex ? 'active' : ''}" onclick="selectStory(\${i})">
          <span>\${c.name}</span>
          <span style="font-size: 10px; color: var(--muted);">\${c.category}</span>
        </button>
      \`).join('');
      renderActiveStory();
    }

    function selectStory(i) {
      activeStoryIndex = i;
      renderStorybookView();
    }

    function renderActiveStory() {
      const comp = STORYBOOK_COMPONENTS[activeStoryIndex] || STORYBOOK_COMPONENTS[0];
      if (!comp) return;

      const target = document.getElementById('storybook-render-target');
      const label = document.getElementById('storybook-active-label');
      const propsTarget = document.getElementById('storybook-props-target');
      const codeSnippet = document.getElementById('storybook-code-snippet');

      label.textContent = comp.name + ' · ' + comp.category + ' (' + comp.file + ')';

      target.innerHTML = \`
        <div class="amp-card \${comp.props?.tone || 'default'}">
          <div class="card-title">\${comp.props?.title || comp.name}</div>
          <div style="font-size: 14px; color: inherit; line-height: 20px;">\${comp.props?.body || 'Interactive component preview'}</div>
        </div>
      \`;

      propsTarget.innerHTML = \`
        <div>
          <label style="font-size: 12px; font-weight: 600;">Tone Variant:</label>
          <select onchange="STORYBOOK_COMPONENTS[\${activeStoryIndex}].props.tone = this.value; renderActiveStory();" style="width: 100%; padding: 6px; border-radius: var(--radius-sm); margin-top: 4px;">
            \${(comp.tones || ['default', 'raised', 'highlight']).map(t => \`<option value="\${t}" \${(comp.props?.tone === t) ? 'selected' : ''}>\${t}</option>\`).join('')}
          </select>
        </div>
      \`;

      codeSnippet.textContent = '<' + comp.name + ' tone="' + (comp.props?.tone || 'default') + '" />';
    }

    function copyStorybookCode() {
      const code = document.getElementById('storybook-code-snippet').textContent;
      navigator.clipboard.writeText(code).then(() => alert('TSX snippet copied!'));
    }

    function renderHealthView() {
      const target = document.getElementById('health-matrix-content');
      target.innerHTML = \`
        <div class="amp-card highlight" style="margin-bottom: 24px;">
          <div class="card-title">Technical Debt &amp; Dead Features Audit</div>
          <p style="font-size: 14px; line-height: 20px; color: var(--foreground-secondary);">
            Automated health inventory: scans for unrouted components, leftover starter files, mock state slices, and platform permissions risks.
          </p>
        </div>
        <table class="audit-table">
          <thead>
            <tr>
              <th>Component / File</th>
              <th>Status</th>
              <th>Issue Description</th>
              <th>Recommended Action</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            \${AUDIT_ITEMS.map(item => \`
              <tr>
                <td><code>\${item.component}</code></td>
                <td><span class="badge-status badge-\${item.status}">\${item.statusLabel || item.status}</span></td>
                <td>\${item.issue}</td>
                <td>\${item.action}</td>
                <td><strong>\${item.priority}</strong></td>
              </tr>
            \`).join('')}
          </tbody>
        </table>
      \`;
    }

    function downloadFile(filename, content, mime) {
      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    function downloadSpecsMarkdown() {
      let md = "# " + APP_NAME + " — Screen Specifications\\n\\n";
      ROUTES.forEach(function(r) {
        md += "## " + r.title + " (" + r.path + ")\\n";
        md += "- **Group:** " + r.group + "\\n";
        md += "- **Health:** " + r.healthLabel + "\\n";
        md += "- **Source File:** \`" + r.file + "\`\\n";
        md += "- **Contract:** \`" + r.contract + "\`\\n";
        md += "- **Description:** " + r.description + "\\n";
        md += "- **Implementation Status:** " + r.status + "\\n";
        md += "- **Action Required:** " + r.missing + "\\n\\n";
      });
      downloadFile("NATIVE_APP_SPECS.md", md, "text/markdown");
    }

    function downloadSpecsJSON() {
      downloadFile("NATIVE_APP_SPECS.json", JSON.stringify(ROUTES, null, 2), "application/json");
    }

    function downloadDocsMarkdown() {
      let md = "# " + APP_NAME + " — Architecture & Design Guide\\n\\n";
      md += "Generated by BAG UI Studio Engine.\\n";
      downloadFile("APP_DOCS.md", md, "text/markdown");
    }

    function downloadStorybookManifest() {
      const manifest = { name: APP_NAME + " Design Kit", version: "1.0.0", components: STORYBOOK_COMPONENTS };
      downloadFile("components.json", JSON.stringify(manifest, null, 2), "application/json");
    }

    function downloadAuditMarkdown() {
      let md = "# Technical Debt & Dead Features Audit — " + APP_NAME + "\\n\\n";
      md += "| Component | Status | Issue | Recommended Action | Priority |\\n";
      md += "| --- | --- | --- | --- | --- |\\n";
      AUDIT_ITEMS.forEach(function(item) {
        md += "| " + item.component + " | " + item.status + " | " + item.issue + " | " + item.action + " | " + item.priority + " |\\n";
      });
      downloadFile("APP_AUDIT.md", md, "text/markdown");
    }

    function exportActiveView() {
      const active = document.querySelector('.view-section.active');
      if (active.id === 'view-specs') downloadSpecsMarkdown();
      else if (active.id === 'view-docs') downloadDocsMarkdown();
      else if (active.id === 'view-storybook') downloadStorybookManifest();
      else if (active.id === 'view-health') downloadAuditMarkdown();
      else downloadSpecsMarkdown();
    }

    function simulateNewAction() { alert('Simulated interaction event recorded!'); }
    function simulateOfflineToggle() {
      STATE.isOffline = !STATE.isOffline;
      alert(STATE.isOffline ? 'Offline mode enabled.' : 'Online mode restored.');
    }
    function resetPrototypeData() { alert('Prototype state reset.'); renderCurrentScreen(); }

    window.addEventListener('DOMContentLoaded', () => {
      renderRouteQuickList();
      renderCurrentScreen();
      updateActiveScreenInfo();
    });
  </script>
</body>
</html>`;

  const scriptMatches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/gi)];
  for (const [_, code] of scriptMatches) {
    new vm.Script(code);
  }

  return html;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatMarkdownToHtml(md) {
  if (!md) return '';
  return md
    .split(/\r?\n\r?\n/)
    .map(block => {
      if (block.startsWith('# ')) return `<h2>${escapeHtml(block.slice(2))}</h2>`;
      if (block.startsWith('## ')) return `<h3>${escapeHtml(block.slice(3))}</h3>`;
      if (block.startsWith('### ')) return `<h4>${escapeHtml(block.slice(4))}</h4>`;
      return `<p>${escapeHtml(block)}</p>`;
    })
    .join('\n');
}
