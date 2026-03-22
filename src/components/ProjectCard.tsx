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
    <article className="surface-card surface-card-hover flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] bg-slate-950">
        {coverKey ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fileSrcFromKey(coverKey)}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center border-b border-sky-500/10 bg-slate-900/80">
            <span className="text-xs font-medium tracking-wide text-slate-600">
              No cover image
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-lg font-semibold tracking-tight text-slate-50 sm:text-xl">
          {project.title}
        </h3>
        {project.stack ? <StackPills stack={project.stack} className="mt-3" /> : null}
        {teaser ? (
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-400">
            {teaser}
          </p>
        ) : (
          <p className="mt-4 text-sm italic text-slate-600">No description yet.</p>
        )}
        <div className="mt-6 flex flex-1 flex-col justify-end">
          <Link href={`/work/${project.slug}`} className="btn-secondary w-full text-center sm:w-auto sm:self-start">
            View project details
          </Link>
        </div>
      </div>
    </article>
  );
}
