import { MediaType } from "@prisma/client";
import { fileSrcFromKey } from "@/lib/project-media";

function loomEmbedUrl(url: string): string | null {
  const share = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
  if (share) return `https://www.loom.com/embed/${share[1]}`;
  if (url.includes("loom.com/embed")) return url;
  return null;
}

type MediaRow = {
  id: string;
  type: MediaType;
  url: string;
  caption: string | null;
};

const galleryTrackClass =
  "-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-sky-500/25";

const galleryItemClass =
  "w-[min(85vw,520px)] shrink-0 snap-center snap-always";

const mediaFrameClass =
  "overflow-hidden rounded-xl border border-sky-500/10 bg-slate-950/50 shadow-lg shadow-black/40";

const mediaMaxClass =
  "max-h-[min(70vh,480px)] w-full bg-black object-contain object-center";

function ExternalLinkBlock(m: MediaRow) {
  if (m.type !== MediaType.EXTERNAL_LINK) return null;

  const loom = loomEmbedUrl(m.url);
  if (loom) {
    return (
      <div className="overflow-hidden rounded-xl border border-sky-500/10 bg-slate-950/50 shadow-inner shadow-black/30">
        <div className="aspect-video w-full bg-black">
          <iframe
            title="Embedded video"
            src={loom}
            className="h-full w-full"
            allowFullScreen
          />
        </div>
        {m.caption ? (
          <p className="border-t border-sky-500/10 bg-sky-500/3 px-4 py-3 text-sm text-slate-400">
            {m.caption}
          </p>
        ) : null}
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-sky-500/10 bg-slate-950/50 px-5 py-6">
      <a
        href={m.url}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all text-sm text-sky-300 underline decoration-sky-500/40 underline-offset-4 transition hover:text-sky-200"
      >
        {m.url}
      </a>
      {m.caption ? (
        <p className="mt-3 text-sm text-slate-500">{m.caption}</p>
      ) : null}
    </div>
  );
}

function GalleryFigure({ m }: { m: MediaRow }) {
  if (m.type === MediaType.IMAGE) {
    return (
      <figure className={galleryItemClass}>
        <div className={mediaFrameClass}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fileSrcFromKey(m.url)}
            alt={m.caption ?? "Project screenshot"}
            className={mediaMaxClass}
          />
        </div>
        {m.caption ? (
          <figcaption className="mt-2 text-sm text-slate-500">
            {m.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (m.type === MediaType.VIDEO_UPLOAD) {
    return (
      <figure className={galleryItemClass}>
        <div className={mediaFrameClass}>
          <video
            className={mediaMaxClass}
            controls
            playsInline
            preload="metadata"
            src={fileSrcFromKey(m.url)}
          />
        </div>
        {m.caption ? (
          <figcaption className="mt-2 text-sm text-slate-500">
            {m.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return null;
}

/** Horizontal scroll for screenshots and uploaded videos (sort order preserved). */
export function ProjectDetailMedia({ media }: { media: MediaRow[] }) {
  const galleryItems = media.filter(
    (m) =>
      m.type === MediaType.IMAGE || m.type === MediaType.VIDEO_UPLOAD,
  );
  const externalOnly = media.filter(
    (m) => m.type === MediaType.EXTERNAL_LINK,
  );

  return (
    <>
      {galleryItems.length > 0 ? (
        <section className="mt-10" aria-label="Project gallery">
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-slate-400">
            Gallery
          </h2>
          <div className={galleryTrackClass}>
            {galleryItems.map((m) => (
              <GalleryFigure key={m.id} m={m} />
            ))}
          </div>
        </section>
      ) : null}

      {externalOnly.length > 0 ? (
        <section className="mt-10" aria-label="Videos and links">
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-slate-400">
            Videos & links
          </h2>
          <ul className="flex flex-col gap-6">
            {externalOnly.map((m) => (
              <li key={m.id}>
                <ExternalLinkBlock {...m} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
