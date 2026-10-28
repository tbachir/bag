import manifest from '../../../../.generated/manifest.json';
import { source } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle, MarkdownCopyButton, ViewOptionsPopover } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getPageImageUrl, getPageMarkdownUrl, gitConfig } from '@/lib/shared';

type Props = { params: Promise<{ slug?: string[] }> };

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = source.getPage(slug, 'fr');
  if (!page) notFound();
  const origin = manifest.pages.find((entry) => entry.generatedPath === page.path)?.sourcePath;
  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl({ slugs: page.slugs }).url;
  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover markdownUrl={markdownUrl}
          githubUrl={origin ? `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/${origin}` : undefined} />
      </div>
      <DocsBody>
        <MDX components={getMDXComponents({ a: createRelativeLink(source, page) })} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.getPages('fr').map((page) => ({ slug: page.slugs }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = source.getPage(slug, 'fr');
  if (!page) notFound();
  return { title: page.data.title, description: page.data.description,
    alternates: { languages: { en: page.url.replace(/^\/fr/, ''), fr: page.url } },
    openGraph: { images: getPageImageUrl({ slugs: page.slugs }).url } };
}
