import { LocaleSwitch } from '@/components/locale-switch';
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout tree={source.getPageTree()} {...baseOptions()}>
      <div className="flex justify-end px-6 pt-3"><LocaleSwitch /></div>
      {children}
    </DocsLayout>
  );
}
