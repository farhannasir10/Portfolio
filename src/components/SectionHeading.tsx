export function SectionHeading({
  kicker,
  title,
}: {
  kicker?: string;
  title: string;
}) {
  return (
    <header className="mb-10 max-w-2xl">
      {kicker ? <p className="kicker-sky mb-3">{kicker}</p> : null}
      <h2 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl sm:leading-tight">
        {title}
      </h2>
    </header>
  );
}
