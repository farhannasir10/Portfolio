export function publicFileUrl(stored: string | null | undefined): string | null {
  if (!stored) return null;
  const value = stored.trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `/api/files/${encodeURIComponent(value)}`;
}
