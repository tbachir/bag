import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

export const revalidate = false;

export const { staticGET: GET } = createFromSource(source, {
  // Build locale-aware indexes; static clients filter results by locale.
  localeMap: {
    en: { language: 'english' },
    fr: { language: 'french' },
  },
});
