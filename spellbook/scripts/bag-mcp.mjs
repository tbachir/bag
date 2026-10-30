#!/usr/bin/env node
/**
 * BAG MCP Server — Model Context Protocol (MCP) server for BAG (Bag of Holding).
 * Exposes BAG catalog, documentation, skills, tools, and loadouts via stdio JSON-RPC.
 * Zero external dependencies; uses Node.js standard libraries only.
 * Specification compliance: Model Context Protocol (2024-11-05 / 2025-03-26).
 */
import readline from 'node:readline';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { readCatalog, searchItems, describeLoadout, planLoadout, safeRelative, ROOT } from '../../catalog/lib.mjs';

const SERVER_NAME = 'bag-mcp';
const SERVER_VERSION = '1.0.0';
const DEFAULT_PROTOCOL_VERSION = '2024-11-05';

const HELP = `BAG MCP Server — Model Context Protocol endpoint for BAG Developer Inventory.

Usage:
  node spellbook/scripts/bag-mcp.mjs           # Run stdio MCP server for AI clients
  node spellbook/scripts/bag-mcp.mjs --help    # Display this help
  node spellbook/scripts/bag-mcp.mjs --version # Display version

Configuration for AI Clients (Claude Desktop, Cursor, Antigravity, VS Code, etc.):
{
  "mcpServers": {
    "bag": {
      "command": "node",
      "args": ["<absolute-path-to-bag>/spellbook/scripts/bag-mcp.mjs"]
    }
  }
}
`;

async function safeReadDocument(relPath) {
  if (!safeRelative(relPath)) {
    throw new Error(`Unsafe or invalid relative path: ${relPath}`);
  }
  const fullPath = path.resolve(ROOT, ...relPath.split('/'));
  const relFromRoot = path.relative(ROOT, fullPath);
  if (relFromRoot === '..' || relFromRoot.startsWith(`..${path.sep}`) || path.isAbsolute(relFromRoot)) {
    throw new Error(`Path escapes repository root: ${relPath}`);
  }
  const segments = relPath.split('/');
  let current = ROOT;
  for (const segment of segments) {
    current = path.join(current, segment);
    const st = await fs.lstat(current);
    if (st.isSymbolicLink()) {
      throw new Error(`Symbolic link detected in path: ${relPath}`);
    }
  }
  const stat = await fs.lstat(fullPath);
  if (!stat.isFile()) {
    throw new Error(`Path is not a regular file: ${relPath}`);
  }
  return await fs.readFile(fullPath, 'utf8');
}

const TOOLS = [
  {
    name: 'bag_search',
    description: 'Search items in the BAG catalog across title, summary, tags, zone, and kind.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Keywords to search for (e.g. "mcp", "skill", "git", "nextjs")'
        }
      },
      required: ['query'],
      additionalProperties: false
    }
  },
  {
    name: 'bag_list_items',
    description: 'List items in the BAG catalog with optional filtering by zone, kind, status, or tag.',
    inputSchema: {
      type: 'object',
      properties: {
        zone: {
          type: 'string',
          description: 'RPG zone filter: inventory, equipment, skill-tree, spellbook, maps-and-guides, loot',
          enum: ['inventory', 'equipment', 'skill-tree', 'spellbook', 'maps-and-guides', 'loot']
        },
        kind: {
          type: 'string',
          description: 'Kind filter: library, repository, resource, tool, config, skill, agent, plugin, mcp, script, guide'
        },
        status: {
          type: 'string',
          description: 'Status filter: evaluating, ready, archived',
          enum: ['evaluating', 'ready', 'archived']
        },
        tag: {
          type: 'string',
          description: 'Tag filter (exact match)'
        }
      },
      additionalProperties: false
    }
  },
  {
    name: 'bag_get_item',
    description: 'Retrieve full details, metadata, and main document content of a specific BAG catalog item by id.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Unique item ID (e.g. "addbag", "mcp-catalog", "agent-rules")'
        }
      },
      required: ['id'],
      additionalProperties: false
    }
  },
  {
    name: 'bag_list_loadouts',
    description: 'List all curated workflow loadouts in BAG.',
    inputSchema: {
      type: 'object',
      properties: {},
      additionalProperties: false
    }
  },
  {
    name: 'bag_get_loadout',
    description: 'Retrieve details and resolved items for a specific loadout.',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Loadout ID (e.g. "ai-coding")'
        }
      },
      required: ['id'],
      additionalProperties: false
    }
  },
  {
    name: 'bag_read_document',
    description: 'Safely read a curated guide, documentation, or resource Markdown file inside BAG.',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Relative path inside BAG repository (e.g. "README.md", "maps-and-guides/getting-started.md")'
        }
      },
      required: ['path'],
      additionalProperties: false
    }
  },
  {
    name: 'bag_plan_loadout',
    description: 'Preview (dry-run) the effect of equipping a loadout to a target project directory. Read-only; never modifies files.',
    inputSchema: {
      type: 'object',
      properties: {
        loadoutId: {
          type: 'string',
          description: 'Loadout ID to plan'
        },
        targetDirectory: {
          type: 'string',
          description: 'Existing destination directory on local filesystem'
        }
      },
      required: ['loadoutId', 'targetDirectory'],
      additionalProperties: false
    }
  }
];

const PROMPTS = [
  {
    name: 'explore-bag',
    description: 'Guidelines on how to navigate BAG inventory and discover relevant skills, tools, or guides.',
    arguments: []
  },
  {
    name: 'recommend-loadout',
    description: 'Workflow to analyze a target project and recommend the most suitable BAG loadout.',
    arguments: [
      {
        name: 'projectType',
        description: 'Type of project or workflow (e.g. "ai-agent", "nextjs", "documentation")',
        required: true
      }
    ]
  }
];

export async function executeTool(name, args = {}) {
  const catalog = await readCatalog();
  switch (name) {
    case 'bag_search': {
      if (!args.query || typeof args.query !== 'string') {
        throw new Error('Query string parameter is required');
      }
      const results = searchItems(catalog, args.query);
      return {
        resultsCount: results.length,
        items: results.map(item => ({
          id: item.id,
          title: item.title,
          summary: item.summary,
          zone: item.zone,
          kind: item.kind,
          status: item.status,
          tags: item.tags,
          mode: item.mode,
          sourcePath: item.source.path
        }))
      };
    }
    case 'bag_list_items': {
      let items = [...catalog.items.values()];
      if (args.zone) items = items.filter(i => i.zone === args.zone);
      if (args.kind) items = items.filter(i => i.kind === args.kind);
      if (args.status) items = items.filter(i => i.status === args.status);
      if (args.tag) items = items.filter(i => i.tags.includes(args.tag));
      return {
        total: items.length,
        items: items.map(i => ({
          id: i.id,
          title: i.title,
          summary: i.summary,
          zone: i.zone,
          kind: i.kind,
          status: i.status,
          tags: i.tags
        }))
      };
    }
    case 'bag_get_item': {
      if (!args.id) throw new Error('Item id is required');
      const item = catalog.items.get(args.id);
      if (!item) throw new Error(`Unknown item: ${args.id}`);
      let sourceContent = null;
      try {
        sourceContent = await safeReadDocument(item.source.path);
      } catch (err) {
        sourceContent = `(Could not read source document: ${err.message})`;
      }
      return {
        item,
        sourceContent
      };
    }
    case 'bag_list_loadouts': {
      return {
        loadouts: [...catalog.loadouts.values()].map(l => ({
          id: l.id,
          title: l.title,
          summary: l.summary,
          itemCount: l.items.length
        }))
      };
    }
    case 'bag_get_loadout': {
      if (!args.id) throw new Error('Loadout id is required');
      return describeLoadout(catalog, args.id);
    }
    case 'bag_read_document': {
      if (!args.path) throw new Error('Document path is required');
      const content = await safeReadDocument(args.path);
      return {
        path: args.path,
        content
      };
    }
    case 'bag_plan_loadout': {
      if (!args.loadoutId) throw new Error('loadoutId is required');
      if (!args.targetDirectory) throw new Error('targetDirectory is required');
      return await planLoadout(catalog, args.loadoutId, args.targetDirectory);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export async function handleRequest(message) {
  if (!message || typeof message !== 'object') {
    return {
      jsonrpc: '2.0',
      id: null,
      error: { code: -32600, message: 'Invalid Request: expected JSON-RPC object' }
    };
  }

  const { id, method, params } = message;

  switch (method) {
    case 'initialize': {
      const negotiatedProtocolVersion = params?.protocolVersion || DEFAULT_PROTOCOL_VERSION;
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: negotiatedProtocolVersion,
          capabilities: {
            tools: { listChanged: false },
            resources: { subscribe: false, listChanged: false },
            prompts: { listChanged: false }
          },
          serverInfo: {
            name: SERVER_NAME,
            version: SERVER_VERSION
          },
          instructions: 'BAG (Bag of Holding) Developer Inventory MCP Server. Provides read-only access to search, discover, inspect, and plan loadouts from the BAG repository.'
        }
      };
    }
    case 'notifications/initialized':
    case 'initialized': {
      return null;
    }
    case 'ping': {
      return { jsonrpc: '2.0', id, result: {} };
    }
    case 'tools/list': {
      return {
        jsonrpc: '2.0',
        id,
        result: { tools: TOOLS }
      };
    }
    case 'tools/call': {
      const toolName = params?.name;
      const toolArgs = params?.arguments || {};
      try {
        const data = await executeTool(toolName, toolArgs);
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: JSON.stringify(data, null, 2)
              }
            ],
            isError: false
          }
        };
      } catch (err) {
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: `Error executing tool "${toolName}": ${err.message}`
              }
            ],
            isError: true
          }
        };
      }
    }
    case 'resources/list': {
      return {
        jsonrpc: '2.0',
        id,
        result: {
          resources: [
            {
              uri: 'bag://catalog/items',
              name: 'BAG Catalog Items',
              description: 'All items currently registered in the BAG catalog',
              mimeType: 'application/json'
            },
            {
              uri: 'bag://catalog/loadouts',
              name: 'BAG Curated Loadouts',
              description: 'All curated loadouts composed from catalog items',
              mimeType: 'application/json'
            },
            {
              uri: 'bag://overview',
              name: 'BAG Navigation and Zones',
              description: 'The 7 RPG zones and overview of the BAG repository',
              mimeType: 'text/markdown'
            }
          ]
        }
      };
    }
    case 'resources/read': {
      const uri = params?.uri;
      if (!uri) {
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32602, message: 'Invalid params: uri is required' }
        };
      }
      const catalog = await readCatalog();
      if (uri === 'bag://catalog/items') {
        return {
          jsonrpc: '2.0',
          id,
          result: {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify([...catalog.items.values()], null, 2)
              }
            ]
          }
        };
      }
      if (uri === 'bag://catalog/loadouts') {
        return {
          jsonrpc: '2.0',
          id,
          result: {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify([...catalog.loadouts.values()], null, 2)
              }
            ]
          }
        };
      }
      if (uri === 'bag://overview') {
        const text = await safeReadDocument('README.md');
        return {
          jsonrpc: '2.0',
          id,
          result: {
            contents: [
              {
                uri,
                mimeType: 'text/markdown',
                text
              }
            ]
          }
        };
      }
      if (uri.startsWith('bag://items/')) {
        const itemId = uri.replace('bag://items/', '');
        const item = catalog.items.get(itemId);
        if (!item) {
          return {
            jsonrpc: '2.0',
            id,
            error: { code: -32602, message: `Resource not found: ${uri}` }
          };
        }
        return {
          jsonrpc: '2.0',
          id,
          result: {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(item, null, 2)
              }
            ]
          }
        };
      }
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32602, message: `Unknown resource URI: ${uri}` }
      };
    }
    case 'prompts/list': {
      return {
        jsonrpc: '2.0',
        id,
        result: { prompts: PROMPTS }
      };
    }
    case 'prompts/get': {
      const promptName = params?.name;
      if (!promptName) {
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32602, message: 'Invalid params: prompt name is required' }
        };
      }
      if (promptName === 'explore-bag') {
        return {
          jsonrpc: '2.0',
          id,
          result: {
            description: 'Navigate BAG developer inventory',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: 'Explore BAG (Bag of Holding). Use bag_search to discover resources by keyword, bag_list_items to filter by zone, or bag_list_loadouts to see complete kits.'
                }
              }
            ]
          }
        };
      }
      if (promptName === 'recommend-loadout') {
        const projectType = params?.arguments?.projectType;
        if (!projectType) {
          return {
            jsonrpc: '2.0',
            id,
            error: { code: -32602, message: 'Invalid params: "projectType" argument is required' }
          };
        }
        return {
          jsonrpc: '2.0',
          id,
          result: {
            description: 'Recommend a suitable loadout',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `Analyze the project requirements for a ${projectType} project. Inspect available loadouts with bag_list_loadouts, review matching items, and suggest the best loadout with a preview using bag_plan_loadout.`
                }
              }
            ]
          }
        };
      }
      return {
        jsonrpc: '2.0',
        id,
        error: { code: -32602, message: `Unknown prompt: ${promptName}` }
      };
    }
    default: {
      if (id !== undefined && id !== null) {
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Method not found: ${method}` }
        };
      }
      return null;
    }
  }
}

export function startServer() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on('line', async (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    try {
      const message = JSON.parse(trimmed);
      const response = await handleRequest(message);
      if (response) {
        // Enforce single-line JSON formatting on stdout
        process.stdout.write(JSON.stringify(response) + '\n');
      }
    } catch (err) {
      process.stdout.write(JSON.stringify({
        jsonrpc: '2.0',
        id: null,
        error: { code: -32700, message: `Parse error: ${err.message}` }
      }) + '\n');
    }
  });
}

// Direct CLI invocation handling
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(HELP);
    process.exit(0);
  }
  if (process.argv.includes('--version') || process.argv.includes('-v')) {
    console.log(`${SERVER_NAME} ${SERVER_VERSION}`);
    process.exit(0);
  }
  startServer();
}
