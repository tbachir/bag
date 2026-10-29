import manifest from '../../.generated/manifest.json';
import { sitePath } from '@/lib/shared';
import { InventoryExplorer } from './inventory-explorer';

export const metadata = { title: 'Inventory Explorer | BAG', description: 'Filter BAG resources and compose an opt-in agent prompt.' };
export default function ExplorerPage() {
  const pages = manifest.pages.filter((p) => p.sourcePath && p.slugs.length > 0 && !p.sourcePath.startsWith('apps/docs/'));
  const items = pages.map(p => ({
    title:p.title, description:p.description, sourcePath:p.sourcePath!, url:sitePath(p.url),
    type:'type' in p && typeof p.type === 'string' ? p.type : p.slugs[0],
    tags:'tags' in p && Array.isArray(p.tags) ? p.tags : [],
    technologies:'technologies' in p && Array.isArray(p.technologies) ? p.technologies : [],
    useCases:'useCases' in p && Array.isArray(p.useCases) ? p.useCases : [],
    contexts:'contexts' in p && Array.isArray(p.contexts) ? p.contexts : [],
    recommendation:'recommendation' in p && typeof p.recommendation === 'string' ? p.recommendation : null,
    template:'template' in p && typeof p.template === 'string' ? p.template : null,
    prompts:'prompts' in p && Array.isArray(p.prompts) ? p.prompts : [],
  }));
  return <InventoryExplorer items={items} loadouts={manifest.loadouts} />;
}
