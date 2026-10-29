import Link from 'next/link';
import { LocaleSwitch } from '@/components/locale-switch';
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout tree={source.getPageTree()} {...baseOptions()}
      sidebar={{ banner: <Link className="block rounded-lg border border-fd-border bg-fd-card px-3 py-2 text-sm font-medium hover:bg-fd-accent" href="/ui/">UI Workbench · Component stories</Link> }}>
      <div className="flex justify-end px-6 pt-3"><LocaleSwitch /></div>
      {children}
    </DocsLayout>
  );
}
