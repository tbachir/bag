import { publicMarkdown } from '@/scripts/markdown.mjs';
import { basePath } from '@/lib/shared';
import { docsLlms } from '@/lib/source';

export const revalidate = false;

export async function GET() {
  return new Response(publicMarkdown(await docsLlms.index(), basePath));
}
