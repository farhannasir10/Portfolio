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
    ? "stack-pill-tag stack-pill-tag--card"
    : "stack-pill-tag";

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
