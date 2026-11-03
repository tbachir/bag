import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: appName,
    },
    links: [
      { text: 'Guides', url: '/docs/guides/', type: 'main' },
      { text: 'Skills', url: '/docs/skills/', type: 'main' },
      { text: 'MCP Hub', url: '/docs/mcp/', type: 'main' },
      { text: 'Recipes', url: '/docs/recipes/', type: 'main' },
      { text: 'Packs', url: '/docs/packs/', type: 'main' },
      { text: 'Explorer', url: '/explore/', type: 'main' },
      { text: 'Workbench', url: '/ui/', type: 'main' },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
