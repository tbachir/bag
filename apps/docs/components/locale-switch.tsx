'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { basePath } from '@/lib/shared';

export function LocaleSwitch() {
  const pathname = usePathname();
  const local = basePath && pathname.startsWith(basePath + '/') ? pathname.slice(basePath.length) : pathname;
  const french = local.startsWith('/fr/docs/');
  const englishPath = french ? local.slice('/fr'.length) : local;
  const frenchPath = `/fr${englishPath}`;
  if (!englishPath.startsWith('/docs/')) return null;
  return (
    <nav aria-label="Documentation language" className="flex items-center gap-2 text-sm">
      <Link href={englishPath} hrefLang="en" aria-current={!french ? 'page' : undefined}>EN</Link>
      <span aria-hidden="true">/</span>
      <Link href={frenchPath} hrefLang="fr" aria-current={french ? 'page' : undefined}>FR</Link>
    </nav>
  );
}
