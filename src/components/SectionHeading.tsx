export function SectionHeading({
  kicker,
  title,
}: {
  kicker?: string;
  title: string;
}) {
  return (
    <header className="section-heading-pro mb-12 max-w-2xl sm:mb-14">
      {kicker ? <p className="kicker-sky mb-3">{kicker}</p> : null}
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl sm:leading-snug">
        {title}
      </h2>
      <div className="section-heading-rule" aria-hidden />
    </header>
  );
}
