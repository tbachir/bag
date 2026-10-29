'use client';
import SearchDialog from '@/components/search';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { i18nProvider, uiTranslations } from 'fumadocs-ui/i18n';
import { i18n } from '@/lib/i18n';
import { usePathname } from 'next/navigation';
import { basePath } from '@/lib/shared';
import { type ReactNode } from 'react';

const translations = i18n.translations().extend(uiTranslations());

export function Provider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const path = pathname.startsWith(basePath + '/') ? pathname.slice(basePath.length) : pathname;
  const locale = path.startsWith('/fr/docs/') ? 'fr' : 'en';
  return (
    <RootProvider i18n={i18nProvider(translations, locale)} search={{ SearchDialog }}>
      {children}
    </RootProvider>
  );
}
