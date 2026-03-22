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
          className="rounded-full border border-sky-500/20 bg-sky-500/5 px-3 py-1 text-xs font-medium tracking-wide text-sky-200/90"
        >
          {t}
        </span>
      ))}
    </div>
  );
}
