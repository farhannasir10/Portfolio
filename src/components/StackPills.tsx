export function StackPills({
  stack,
  className,
}: {
  stack: string;
  className?: string;
}) {
  const tags = stack
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!tags.length) return null;
  return (
    <div className={`flex flex-wrap gap-2 ${className ?? "mt-4"}`}>
      {tags.map((t) => (
        <span
          key={t}
          className="rounded-full border border-zinc-700 bg-zinc-900/80 px-3 py-1 text-xs font-medium tracking-wide text-zinc-400"
        >
          {t}
        </span>
      ))}
    </div>
  );
}
