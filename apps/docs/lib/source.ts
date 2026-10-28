import { i18n } from './i18n';
import { publicMarkdown } from '../scripts/markdown.mjs';
import { llms, loader } from 'fumadocs-core/source';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';
import { basePath, docsRoute, sitePath } from './shared';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';

const docs = defineDocs({
  dir: '.generated/content',
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  i18n,
  url(slugs, locale) {
    return `${locale === 'fr' ? '/fr' : ''}${docsRoute}/${slugs.join('/')}${slugs.length ? '/' : ''}`;
  },
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${sitePath(page.url)})

${publicMarkdown(await page.data.getText('processed'), basePath)}`,
});
