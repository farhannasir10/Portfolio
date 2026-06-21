import Link from "next/link";

export function ProjectPager({
  prev,
  next,
}: {
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}) {
  if (!prev && !next) return null;

  return (
    <nav
      className="project-pager"
      aria-label="Other projects"
    >
      {prev ? (
        <Link href={`/work/${prev.slug}`} className="project-pager-link project-pager-link--prev">
          <span className="project-pager-kicker">Previous</span>
          <span className="project-pager-title">{prev.title}</span>
        </Link>
      ) : (
        <div className="project-pager-spacer" aria-hidden />
      )}
      {next ? (
        <Link href={`/work/${next.slug}`} className="project-pager-link project-pager-link--next">
          <span className="project-pager-kicker">Next</span>
          <span className="project-pager-title">{next.title}</span>
        </Link>
      ) : (
        <div className="project-pager-spacer" aria-hidden />
      )}
    </nav>
  );
}
