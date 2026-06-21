import { formatReadTime } from "@/lib/read-time";

export function BlogMeta({
  publishedAt,
  readMinutes,
}: {
  publishedAt?: Date | null;
  readMinutes: number;
}) {
  return (
    <div className="blog-meta-row">
      {publishedAt ? (
        <time
          className="meta-pill"
          dateTime={publishedAt.toISOString()}
        >
          {publishedAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
      ) : null}
      <span className="meta-pill">{formatReadTime(readMinutes)}</span>
    </div>
  );
}
