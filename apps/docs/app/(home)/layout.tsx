import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

// The root SiteHeader owns the global navigation. Keep HomeLayout for Fumadocs
// styling without rendering another top-level header.
export default function Layout({ children }: LayoutProps<'/'>) {
  return <HomeLayout {...baseOptions()} nav={{ enabled: false }}>{children}</HomeLayout>;
}
