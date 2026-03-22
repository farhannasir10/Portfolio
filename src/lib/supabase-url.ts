/**
 * Resolve Supabase API base URL from env. Supports full URL or project ref only
 * (handy when a host’s env UI dislikes values that look like URLs).
 */

function stripTrailingSlash(u: string): string {
  return u.replace(/\/+$/, "");
}

/**
 * Normalize user input: full https URL, `ref.supabase.co`, or bare project ref.
 */
function expandToApiBase(raw: string): string | undefined {
  let s = raw.trim();
  if (!s) return undefined;

  if (/^https?:\/\//i.test(s)) {
    s = stripTrailingSlash(s);
    const m = s.match(/^https?:\/\/([a-z0-9-]+)\.supabase\.co$/i);
    if (m) return `https://${m[1].toLowerCase()}.supabase.co`;
    return s;
  }

  const host = s.match(/^([a-z0-9-]+)\.supabase\.co$/i);
  if (host) return `https://${host[1].toLowerCase()}.supabase.co`;

  if (/^[a-z0-9-]{8,64}$/i.test(s)) {
    return `https://${s.toLowerCase()}.supabase.co`;
  }

  return undefined;
}

/** Server / API routes: full URL vars or *_PROJECT_REF. */
export function supabaseProjectUrlForServer(): string | undefined {
  const a =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim();
  if (a) {
    const u = expandToApiBase(a);
    if (u) return u;
  }
  const ref =
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF?.trim() ||
    process.env.SUPABASE_PROJECT_REF?.trim();
  if (ref) return expandToApiBase(ref);
  return undefined;
}

/** Browser: only NEXT_PUBLIC_* (inlined at build). */
export function supabaseUrlForBrowser(): string | undefined {
  const a = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (a) {
    const u = expandToApiBase(a);
    if (u) return u;
  }
  const ref = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF?.trim();
  if (ref) return expandToApiBase(ref);
  return undefined;
}
