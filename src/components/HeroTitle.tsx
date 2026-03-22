/** Last word gets sky gradient + subtle `{ }` like reference portfolios */
export function HeroTitle({ title }: { title: string }) {
  const trimmed = title.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length <= 1) {
    return (
      <h1 className="max-w-3xl text-3xl font-semibold leading-[1.15] tracking-tight text-slate-50 sm:text-4xl md:text-5xl">
        <span className="gradient-text-sky">{trimmed}</span>
      </h1>
    );
  }
  const last = words[words.length - 1];
  const rest = words.slice(0, -1).join(" ");
  return (
    <h1 className="max-w-3xl text-3xl font-semibold leading-[1.15] tracking-tight text-slate-50 sm:text-4xl md:text-5xl">
      {rest}{" "}
      <span className="whitespace-nowrap">
        <span className="text-sky-500/40" aria-hidden>
          {"{"}
        </span>
        <span className="gradient-text-sky">{last}</span>
        <span className="text-sky-500/40" aria-hidden>
          {"}"}
        </span>
      </span>
    </h1>
  );
}
