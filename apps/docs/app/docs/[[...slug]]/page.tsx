import manifest from '../../../.generated/manifest.json';
import { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { ResourceShowcase } from '@/components/resource-showcase';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getPageImageUrl, getPageMarkdownUrl, gitConfig } from '@/lib/shared';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const origin = manifest.pages.find((entry) => entry.generatedPath === page.path)?.sourcePath;
  const item = manifest.pages.find((entry) => entry.generatedPath === page.path);
  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={origin ? `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/${origin}` : undefined}
        />
        {origin && <a className="text-sm underline underline-offset-2" href={`https://github.com/tbachir/bag/issues/new?title=${encodeURIComponent('Docs feedback: '+origin)}&body=${encodeURIComponent('Page: '+origin+'\\n\\nSuggested improvement:')}`} target="_blank" rel="noopener noreferrer">Suggest an improvement</a>}
      </div>
      <DocsBody>
        {item?.sourcePath && <ResourceShowcase item={{ title:item.title,description:item.description,sourcePath:item.sourcePath,url:item.url,type:('type' in item && typeof item.type === 'string')?item.type:'reference',tags:('tags' in item && Array.isArray(item.tags))?item.tags:[],technologies:('technologies' in item && Array.isArray(item.technologies))?item.technologies:[],useCases:('useCases' in item && Array.isArray(item.useCases))?item.useCases:[],contexts:('contexts' in item && Array.isArray(item.contexts))?item.contexts:[],recommendation:('recommendation' in item && typeof item.recommendation === 'string')?item.recommendation:null,template:('template' in item && typeof item.template === 'string')?item.template:null,prompts:('prompts' in item && Array.isArray(item.prompts))?item.prompts:[] }} />}
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.getPages('en').map((page) => ({ slug: page.slugs }));
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    alternates: { languages: { en: page.url, fr: `/fr${page.url}` } },
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImageUrl(page).url,
    },
  };
}
