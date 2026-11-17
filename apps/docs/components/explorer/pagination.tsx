'use client';

const PAGE_SIZE = 24;
export { PAGE_SIZE };

export function Pagination({ page, count, onPage }: {
  page: number;
  count: number;
  onPage: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Inventory pages" className="flex flex-wrap items-center justify-between gap-3 border-t border-fd-border pt-4">
      <span className="text-sm text-fd-muted-foreground">
        Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, count)} of {count} resources
      </span>
      <div className="flex items-center gap-2">
        <button type="button" disabled={page <= 1}
          onClick={() => onPage(page - 1)} className="min-h-10 rounded-lg border border-fd-border px-3 text-sm disabled:opacity-40">
          Previous
        </button>
        <span className="min-w-14 text-center text-sm tabular-nums">{page} / {totalPages}</span>
        <button type="button" disabled={page >= totalPages}
          onClick={() => onPage(page + 1)} className="min-h-10 rounded-lg border border-fd-border px-3 text-sm disabled:opacity-40">
          Next
        </button>
      </div>
    </nav>
  );
}
