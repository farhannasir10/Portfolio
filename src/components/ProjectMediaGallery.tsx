import { MediaType } from "@prisma/client";
import { publicFileUrl } from "@/lib/public-file-url";

function fileSrc(key: string) {
  return publicFileUrl(key) ?? "";
}

function loomEmbedUrl(url: string): string | null {
  const share = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
  if (share) return `https://www.loom.com/embed/${share[1]}`;
  if (url.includes("loom.com/embed")) return url;
  return null;
}

export function ProjectMediaGallery({
  media,
}: {
  media: Array<{
    id: string;
    type: MediaType;
    url: string;
    caption: string | null;
  }>;
}) {
  if (!media.length) return null;

  return (
    <ul className="mt-8 flex flex-col gap-6">
      {media.map((m) => (
        <li
          key={m.id}
          className="overflow-hidden rounded-xl border border-sky-500/10 bg-slate-950/50 shadow-inner shadow-black/30"
        >
          <MediaItem {...m} />
          {m.caption ? (
            <p className="border-t border-sky-500/10 bg-sky-500/[0.03] px-4 py-3 text-sm leading-relaxed text-slate-400">
              {m.caption}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function MediaItem(m: {
  type: MediaType;
  url: string;
  caption: string | null;
}) {
  if (m.type === MediaType.EXTERNAL_LINK) {
    const loom = loomEmbedUrl(m.url);
    if (loom) {
      return (
        <div className="aspect-video w-full bg-black">
          <iframe
            title="Loom"
            src={loom}
            className="h-full w-full"
            allowFullScreen
          />
        </div>
      );
    }
    return (
      <div className="px-5 py-6">
        <a
          href={m.url}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-sm text-sky-300 underline decoration-sky-500/40 underline-offset-4 transition hover:text-sky-200"
        >
          {m.url}
        </a>
      </div>
    );
  }

  if (m.type === MediaType.VIDEO_UPLOAD) {
    return (
      <video
        className="max-h-[70vh] w-full bg-black object-contain"
        controls
        playsInline
        preload="metadata"
        src={fileSrc(m.url)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={fileSrc(m.url)}
      alt={m.caption ?? "Project screenshot"}
      className="max-h-[80vh] w-full object-contain"
    />
  );
}
