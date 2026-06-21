/** Rough reading time for markdown/plain text (~220 wpm). */
export function estimateReadMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function formatReadTime(minutes: number): string {
  return `${minutes} min read`;
}
