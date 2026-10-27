import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'BAG';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

export const gitConfig = {
  user: 'tbachir',
  repo: 'bag',
  branch: 'main',
};

export const basePath = process.env.NEXT_PUBLIC_DOCS_BASE_PATH ?? '';
export function sitePath(value: string) { return `${basePath}${value}`; }

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: sitePath(getContentUrl(segments, page.locale)) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: sitePath(getImageUrl(segments, page.locale)) };
}
