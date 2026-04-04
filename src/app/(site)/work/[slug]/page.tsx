import { MarkdownBody } from "@/components/MarkdownBody";
import { ProjectDetailMedia } from "@/components/ProjectDetailMedia";
import { StackPills } from "@/components/StackPills";
import { getPublishedProjectBySlug } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) return { title: "Project" };
  return { title: `${project.title} · Portfolio` };
}

export default async function WorkDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-6xl scroll-mt-36 px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
      <Link
        href="/#projects"
        className="kicker-sky inline-block opacity-90 transition hover:text-[var(--link-hover-subtle)]"
      >
        ← Projects
      </Link>
      <h1 className="mt-8 text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl sm:leading-tight">
        {project.title}
      </h1>
      {project.stack ? (
        <StackPills stack={project.stack} cardHighlight className="mt-5" />
      ) : null}
      {project.summary ? (
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          {project.summary}
        </p>
      ) : null}
      <ProjectDetailMedia media={project.media} />
      {project.content ? (
        <div className="mt-14 max-w-3xl border-t border-[color:var(--site-section-border)] pt-14">
          <h2 className="mb-6 text-xs font-bold tracking-widest text-[var(--muted)] uppercase">
            Details
          </h2>
          <MarkdownBody content={project.content} highlightTechTerms />
        </div>
      ) : null}
    </article>
  );
}
