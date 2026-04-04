import {
  fileSrcFromKey,
  getProjectCardTeaserText,
  getProjectCoverImageKey,
} from "@/lib/project-media";
import type { MediaType } from "@prisma/client";
import Link from "next/link";
import { StackPills } from "@/components/StackPills";

type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  stack: string | null;
  media: Array<{
    id: string;
    type: MediaType;
    url: string;
    caption: string | null;
    sortOrder: number;
  }>;
};

export function ProjectCard({ project }: { project: Project }) {
  const coverKey = getProjectCoverImageKey(project.media);
  const teaser = getProjectCardTeaserText(project.summary, project.content);

  return (
    <article className="project-card-wrap surface-card surface-card-hover flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--project-placeholder-to)]">
        <div className="project-card-shine" aria-hidden />
        {coverKey ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fileSrcFromKey(coverKey)}
            alt=""
            className="project-card-media h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center border-b border-[color:var(--border)] bg-gradient-to-br from-[var(--project-placeholder-from)] to-[var(--project-placeholder-to)]">
            <span className="text-xs font-medium tracking-widest text-[var(--dim)] uppercase">
              No cover
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-lg font-bold tracking-tight text-[var(--text)] sm:text-xl">
          {project.title}
        </h3>
        {teaser ? (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">
            {teaser}
          </p>
        ) : (
          <p className="mt-3 text-sm italic text-[var(--dim)]">No description yet.</p>
        )}
        {project.stack ? (
          <StackPills stack={project.stack} className="mt-4" cardHighlight />
        ) : null}
        <div className="mt-6 flex flex-1 flex-col justify-end">
          <Link href={`/work/${project.slug}`} className="btn-project-cta w-full text-center sm:w-auto sm:self-start">
            View project details
          </Link>
        </div>
      </div>
    </article>
  );
}
