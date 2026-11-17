import { LocaleSwitch } from '@/components/locale-switch';
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

// Retain Fumadocs' mobile documentation toolbar to preserve the sidebar trigger.
// The root SiteHeader provides the application-wide navigation and search.
export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      nav={{ title: 'Documentation' }}
      searchToggle={{ enabled: false }}
      themeSwitch={{ enabled: false }}
    >
      <div className="flex justify-end px-6 pt-3"><LocaleSwitch /></div>
      {children}
    </DocsLayout>
  );
}
