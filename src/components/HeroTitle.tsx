/**
 * Last word in orange inside `{ }`; rest in white (e.g. Farhan {Nasir}).
 * One word → whole word accented with braces.
 */
export function HeroTitle({ title }: { title: string }) {
  const trimmed = title.trim();
  if (!trimmed) {
    return (
      <h1 className="hero-headline text-zinc-100">
        &nbsp;
      </h1>
    );
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length <= 1) {
    return (
      <h1 className="hero-headline text-zinc-100">
        <span className="hero-brace" aria-hidden>
          {"{"}
        </span>
        <span className="gradient-text-sky">{trimmed}</span>
        <span className="hero-brace" aria-hidden>
          {"}"}
        </span>
      </h1>
    );
  }

  const last = words[words.length - 1];
  const rest = words.slice(0, -1).join(" ");
  return (
    <h1 className="hero-headline text-zinc-100">
      {rest}{" "}
      <span className="whitespace-nowrap">
        <span className="hero-brace" aria-hidden>
          {"{"}
        </span>
        <span className="gradient-text-sky">{last}</span>
        <span className="hero-brace" aria-hidden>
          {"}"}
        </span>
      </span>
    </h1>
  );
}
