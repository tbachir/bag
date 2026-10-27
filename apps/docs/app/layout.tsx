import { Provider } from '@/components/provider';
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
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
