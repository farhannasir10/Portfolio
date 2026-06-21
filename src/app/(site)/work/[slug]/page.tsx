import { MarkdownBody } from "@/components/MarkdownBody";
import { ProjectDetailMedia } from "@/components/ProjectDetailMedia";
import { ProjectPager } from "@/components/ProjectPager";
import { StackPills } from "@/components/StackPills";
import { getAdjacentPublishedProjects, getPublishedProjectBySlug } from "@/lib/data";
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
  const { prev, next } = await getAdjacentPublishedProjects(slug);

  return (
    <article className="mx-auto max-w-6xl scroll-mt-36 px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
      <Link
        href="/#projects"
        className="page-back-link"
      >
        ← Projects
      </Link>
      <h1 className="detail-hero-title mt-8 text-3xl text-[var(--text)] sm:text-4xl sm:leading-tight">
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
        <div className="detail-content-panel mt-14 max-w-3xl">
          <h2 className="kicker mb-6">Details</h2>
          <MarkdownBody content={project.content} highlightTechTerms />
        </div>
      ) : null}
      <ProjectPager prev={prev} next={next} />
    </article>
  );
}
