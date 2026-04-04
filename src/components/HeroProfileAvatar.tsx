import { publicFileUrl } from "@/lib/public-file-url";

function UserPlaceholder() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1}
      stroke="currentColor"
      className="h-14 w-14 text-zinc-600"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

export function HeroProfileAvatar({
  storageKey,
}: {
  storageKey: string | null | undefined;
}) {
  const src = publicFileUrl(storageKey);
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        width={200}
        height={200}
        className="relative z-10 h-40 w-40 shrink-0 rounded-2xl border border-zinc-800 object-cover shadow-xl shadow-black/40 md:h-44 md:w-44"
      />
    );
  }

  return (
    <div
      className="relative z-10 flex h-40 w-40 shrink-0 items-center justify-center rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 md:h-44 md:w-44"
      title="Profile photo"
      aria-label="Profile photo placeholder"
    >
      <UserPlaceholder />
    </div>
  );
}
