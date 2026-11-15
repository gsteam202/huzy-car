export function catalogPage(value: unknown): number | null {
  if (value === undefined) return 1;
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) return null;
  const number = Number(value);
  return Number.isSafeInteger(number) && number <= Math.floor(2147483647 / 30) ? number : null;
}
export function catalogPageHref(path: string, page: number, filters: Record<string, string | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) if (value) query.set(key, value);
  if (page > 1) query.set('page', String(page));
  return path + (query.size ? `?${query}` : '');
}
