import { MediaType } from "@prisma/client";
import { publicFileUrl } from "@/lib/public-file-url";

export type ProjectMediaItem = {
  id: string;
  type: MediaType;
  url: string;
  caption: string | null;
  sortOrder: number;
};

/** Storage key for API path — first IMAGE by sort order (home card + detail hero strip order). */
export function getProjectCoverImageKey(
  media: ProjectMediaItem[],
): string | null {
  const images = media.filter((m) => m.type === MediaType.IMAGE);
  if (!images.length) return null;
  return [...images].sort((a, b) => a.sortOrder - b.sortOrder)[0]?.url ?? null;
}

export function fileSrcFromKey(key: string) {
  return publicFileUrl(key) ?? "";
}

/** Card teaser: summary, else stripped markdown excerpt (no line clamp here — UI uses line-clamp). */
export function getProjectCardTeaserText(
  summary: string | null | undefined,
  content: string | null | undefined,
): string {
  const s = summary?.trim();
  if (s) return s;
  const c = content?.trim();
  if (!c) return "";
  return (
    c
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`[^`]+`/g, " ")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[#>*_\-]/g, " ")
      .replace(/\s+/g, " ")
      .trim() || ""
  );
}
