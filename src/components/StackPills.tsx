export function StackPills({
  stack,
  className,
  /** Subtle orange-tinted ring for project cards on the home grid. */
  cardHighlight = false,
}: {
  stack: string;
  className?: string;
  cardHighlight?: boolean;
}) {
  const tags = stack
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!tags.length) return null;

  const pillClass = cardHighlight
    ? "rounded-full border border-orange-500/25 bg-zinc-900/55 px-3 py-1 text-xs font-medium tracking-wide text-zinc-400 shadow-[inset_0_0_0_1px_rgba(253,186,116,0.12)]"
    : "rounded-full border border-zinc-700 bg-zinc-900/80 px-3 py-1 text-xs font-medium tracking-wide text-zinc-400";

  return (
    <div className={`flex flex-wrap gap-2 ${className ?? "mt-4"}`}>
      {tags.map((t) => (
        <span key={t} className={pillClass}>
          {t}
        </span>
      ))}
    </div>
  );
}
