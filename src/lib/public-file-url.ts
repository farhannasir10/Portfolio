/**
 * Resolves a stored file reference for use in <img src>, <video src>, or href.
 * Values may be a Supabase (or other) HTTPS URL, or a legacy local storage key
 * served via /api/files/[key].
 */
export function publicFileUrl(
  stored: string | null | undefined,
): string | null {
  if (stored == null || stored === "") return null;
  const t = stored.trim();
  if (/^https?:\/\//i.test(t)) return t;
  return `/api/files/${encodeURIComponent(t)}`;
}
