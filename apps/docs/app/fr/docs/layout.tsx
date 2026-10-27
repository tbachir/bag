import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { LocaleSwitch } from '@/components/locale-switch';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout tree={source.getPageTree('fr')} {...baseOptions()}>
      <div className="flex justify-end px-6 pt-3"><LocaleSwitch /></div>
      {children}
    </DocsLayout>
  );
}
