'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Backpack, Menu, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SearchTrigger } from 'fumadocs-ui/layouts/shared/slots/search-trigger';
import { ThemeSwitch } from 'fumadocs-ui/layouts/shared/slots/theme-switch';
import { useDropBag } from '@/components/use-drop-bag';
import { basePath } from '@/lib/shared';
import { isNavigationActive, primaryNavigation } from '@/lib/navigation';

export function SiteHeader() {
  const pathname = usePathname();
  const route = basePath && pathname.startsWith(basePath + '/')
    ? pathname.slice(basePath.length)
    : pathname;
  const [mobileOpen, setMobileOpen] = useState(false);
  const { selected } = useDropBag();

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <header data-testid="site-header" className="relative z-50 shrink-0 border-b border-fd-border bg-fd-background text-fd-foreground">
      <div className="mx-auto flex min-h-16 w-full max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="BAG home"
          className="inline-flex shrink-0 items-center gap-2.5 rounded-md font-extrabold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-fd-primary text-fd-primary-foreground">
            <Backpack aria-hidden="true" className="size-5" />
          </span>
          <span>BAG</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden min-w-0 items-center gap-1 lg:flex">
          {primaryNavigation.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isNavigationActive(route, href) ? 'page' : undefined}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground aria-[current=page]:bg-fd-accent aria-[current=page]:text-fd-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchTrigger className="rounded-lg border border-fd-border" />
          <Link
            href="/explore/"
            aria-label={`Drop Bag (${selected.length} selected)`}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-fd-border px-2.5 text-sm font-medium hover:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
          >
            <ShoppingBag aria-hidden="true" className="size-4" />
            <span className="hidden sm:inline">Drop Bag</span>
            <span aria-hidden="true" className="min-w-4 text-center tabular-nums">{selected.length}</span>
          </Link>
          <div className="hidden sm:block">
            <ThemeSwitch />
          </div>
          <button
            type="button"
            aria-label={mobileOpen ? 'Close main menu' : 'Open main menu'}
            aria-expanded={mobileOpen}
            aria-controls="bag-mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
            className="inline-flex size-10 items-center justify-center rounded-lg border border-fd-border hover:bg-fd-accent lg:hidden"
          >
            {mobileOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>

      <nav
        id="bag-mobile-navigation"
        aria-label="Mobile main navigation"
        hidden={!mobileOpen}
        className="border-t border-fd-border px-4 pb-4 pt-2 lg:hidden"
      >
        <div className="mx-auto flex max-w-[1440px] flex-col gap-1">
          {primaryNavigation.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              aria-current={isNavigationActive(route, href) ? 'page' : undefined}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-fd-muted-foreground hover:bg-fd-accent aria-[current=page]:bg-fd-accent aria-[current=page]:text-fd-foreground"
            >
              {label}
            </Link>
          ))}
          <div className="mt-2 flex items-center gap-3 border-t border-fd-border pt-3">
            <span className="text-xs text-fd-muted-foreground">Theme</span>
            <ThemeSwitch />
          </div>
        </div>
      </nav>
    </header>
  );
}
