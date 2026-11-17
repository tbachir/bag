import { Provider } from '@/components/provider';
import { SiteHeader } from '@/components/shell/site-header';
import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.DOCS_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'BAG — Developer Inventory', template: '%s | BAG' },
  description: 'A curated inventory of developer tools, AI skills, guides, and reusable workflows.',
};

const inter = Inter({
  subsets: ['latin'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>
          <a href="#bag-main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:rounded-md focus:bg-fd-background focus:p-3">
            Skip to content
          </a>
          <SiteHeader />
          <div id="bag-main-content" className="flex min-h-0 flex-1 flex-col">
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}
