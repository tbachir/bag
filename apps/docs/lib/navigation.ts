/** Canonical primary destinations, independent of Fumadocs' page tree. */
export const primaryNavigation = [
  { label: 'Home', href: '/' },
  { label: 'Explorer', href: '/explore/' },
  { label: 'Documentation', href: '/docs/' },
  { label: 'Packs', href: '/packs/' },
  { label: 'UI Workbench', href: '/ui/' },
] as const;

export function isNavigationActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  if (href === '/docs/') return pathname.startsWith('/docs/') || pathname.startsWith('/fr/docs/');
  return pathname === href.slice(0, -1) || pathname.startsWith(href);
}
