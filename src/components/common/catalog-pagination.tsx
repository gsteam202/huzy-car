import Link from 'next/link';
import { catalogPageHref } from '@/lib/catalog-pagination';
export function CatalogPagination({ path, page, total, filters }: { path: string; page: number; total: number; filters: Record<string, string | undefined> }) {
  const pages = Math.max(1, Math.ceil(total / 30));
  return <nav aria-label="목록 페이지 이동" className="flex flex-wrap items-center justify-center gap-5 py-5 text-sm">
    {page > 1 && <Link prefetch={false} href={catalogPageHref(path, page - 1, filters)} className="text-blue-700 underline">← 이전 목록</Link>}
    <span>{page} / {pages} 페이지 · 총 {total.toLocaleString()}건</span>
    {page < pages && <Link prefetch={false} href={catalogPageHref(path, page + 1, filters)} className="text-blue-700 underline">다음 목록 →</Link>}
  </nav>;
}
