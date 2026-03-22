/** Browser-safe pathname for Vercel Blob client uploads; server uses addRandomSuffix. */
export function blobPathnameFromFile(file: File): string {
  const raw = (file.name || "upload").replace(/[/\\]/g, "_");
  const extMatch = raw.match(/(\.[a-zA-Z0-9]{1,12})$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : "";
  const base = ext ? raw.slice(0, -ext.length) : raw;
  const safeBase =
    base.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "file";
  const stamp = Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
  return `${stamp}-${safeBase}${ext}`;
}
