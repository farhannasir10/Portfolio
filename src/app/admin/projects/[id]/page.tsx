import {
  deleteProject,
  deleteProjectMedia,
  updateProject,
  updateProjectMediaSort,
} from "@/actions/projects";
import { AdminFileField } from "@/components/AdminFileField";
import { AdminMarkdownTextarea } from "@/components/admin/AdminMarkdownTextarea";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    saved?: string;
    removed?: string;
    mediaAdded?: string;
    mediaError?: string;
  }>;
};

const MEDIA_ERROR_TEXT: Record<string, string> = {
  file:
    "Choose a file and wait until you see “Uploaded. Key: …” in green before clicking Add.",
  url: "Enter a URL for the external link.",
  type: "Invalid media type.",
  project: "Project not found.",
  unknown: "Could not add media. Try again.",
};

export default async function EditProjectPage({ params, searchParams }: Props) {
  const { id } = await params;
  const q = searchParams ? await searchParams : {};
  const project = await prisma.project.findUnique({
    where: { id },
    include: { media: { orderBy: { sortOrder: "asc" } } },
  });
  if (!project) notFound();

  return (
    <div>
      <Link href="/admin/projects" className="text-sm text-orange-400 hover:underline">
        ← Projects
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-50">Edit project</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Add media first, or scroll down to edit title, summary, and details.
      </p>

      <AdminNotice
        removed={q.removed === "1"}
        saved={q.saved === "1" || q.mediaAdded === "1"}
        savedMessage={
          q.mediaAdded === "1" ? "Media added." : "Saved successfully."
        }
      />
      {q.mediaError ? (
        <p className="mt-4 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">
          {MEDIA_ERROR_TEXT[q.mediaError] ?? MEDIA_ERROR_TEXT.unknown}
        </p>
      ) : null}

      <section id="media" className="mt-8 scroll-mt-8">
        <h2 className="text-lg font-semibold text-orange-100">Project media</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Screen recordings, screenshots, and Loom / Drive / demo links appear on
          your public portfolio.
        </p>

        <div className="mt-4 rounded-lg border border-orange-900/45 bg-orange-950/25 px-4 py-3 text-sm leading-relaxed text-orange-100/90">
          <p>
            <strong className="text-orange-50">Sort order</strong> controls display
            order everywhere. Lower numbers appear first.
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-orange-100/80">
            <li>
              <strong className="text-orange-50">Home page card image</strong> uses
              the screenshot (<code className="text-orange-200">IMAGE</code>) with
              the <strong>lowest</strong> sort order. Put your cover at{" "}
              <code className="text-orange-200">0</code> (or lower than other
              images).
            </li>
            <li>
              On the <strong className="text-orange-50">project detail</strong>{" "}
              page, screenshots show in a horizontal scroller in sort order;
              videos and links are listed below them.
            </li>
          </ul>
        </div>

        <ul className="mt-6 space-y-3">
          {project.media.map((m) => (
            <li
              key={m.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3 text-sm"
            >
              <div className="flex flex-wrap items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-300">
                      {m.type}
                    </span>
                    <span className="text-xs text-zinc-500">
                      Sort order: <strong className="text-zinc-300">{m.sortOrder}</strong>
                    </span>
                  </div>
                  <p className="mt-2 break-all font-mono text-xs text-zinc-500">
                    {m.url}
                  </p>
                  {m.caption ? (
                    <p className="mt-1 text-zinc-400">{m.caption}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-end gap-2">
                  <form
                    action={updateProjectMediaSort.bind(null, m.id)}
                    className="flex items-end gap-2"
                  >
                    <div>
                      <label className="block text-xs text-zinc-500">Order</label>
                      <input
                        type="number"
                        name="sortOrder"
                        defaultValue={m.sortOrder}
                        className="mt-0.5 w-20 rounded border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm"
                      />
                    </div>
                    <AdminFormSubmitButton
                      pendingLabel="Saving…"
                      className="rounded border border-zinc-600 px-2 py-1.5 text-xs hover:bg-zinc-800"
                    >
                      Save order
                    </AdminFormSubmitButton>
                  </form>
                  <form action={deleteProjectMedia.bind(null, m.id)}>
                    <AdminFormSubmitButton
                      pendingLabel="Removing…"
                      className="text-xs text-red-400 hover:underline"
                    >
                      Remove
                    </AdminFormSubmitButton>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 p-4">
            <h3 className="text-sm font-medium text-zinc-200">1 · Upload video</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Screen recording (MP4, WebM, MOV). Large files need a Node server or
              cloud storage in production.
            </p>
            <form
              method="POST"
              action="/api/admin/project-media"
              className="mt-4 space-y-4"
            >
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="type" value="VIDEO_UPLOAD" />
              <AdminFileField kind="video" label="Choose video file" />
              <div>
                <label className="block text-sm text-zinc-400">Caption (optional)</label>
                <input
                  name="caption"
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                />
              </div>
              <input type="hidden" name="externalUrl" value="" />
              <button
                type="submit"
                className="rounded-lg border border-zinc-600 px-3 py-1.5 text-sm hover:bg-zinc-800"
              >
                Add video
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-zinc-800 p-4">
            <h3 className="text-sm font-medium text-zinc-200">2 · Upload screenshot</h3>
            <form
              method="POST"
              action="/api/admin/project-media"
              className="mt-4 space-y-4"
            >
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="type" value="IMAGE" />
              <AdminFileField kind="image" label="Choose image" />
              <div>
                <label className="block text-sm text-zinc-400">Caption (optional)</label>
                <input
                  name="caption"
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                />
              </div>
              <input type="hidden" name="externalUrl" value="" />
              <button
                type="submit"
                className="rounded-lg border border-zinc-600 px-3 py-1.5 text-sm hover:bg-zinc-800"
              >
                Add image
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-zinc-800 p-4 lg:col-span-2">
            <h3 className="text-sm font-medium text-zinc-200">3 · External link</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Loom share URL, Google Drive link, demo site, etc.
            </p>
            <form
              method="POST"
              action="/api/admin/project-media"
              className="mt-4 max-w-xl space-y-4"
            >
              <input type="hidden" name="projectId" value={project.id} />
              <input type="hidden" name="type" value="EXTERNAL_LINK" />
              <input type="hidden" name="storageKey" value="" />
              <div>
                <label className="block text-sm text-zinc-400">URL</label>
                <input
                  name="externalUrl"
                  required
                  placeholder="https://www.loom.com/share/…"
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400">Caption (optional)</label>
                <input
                  name="caption"
                  className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg border border-zinc-600 px-3 py-1.5 text-sm hover:bg-zinc-800"
              >
                Add link
              </button>
            </form>
          </div>
        </div>
      </section>

      <form
        action={updateProject.bind(null, project.id)}
        className="mt-14 max-w-xl space-y-6 border-t border-zinc-800 pt-10"
      >
        <h2 className="text-lg font-semibold text-zinc-100">Project details</h2>
        <div>
          <label className="block text-sm text-zinc-400">Title</label>
          <input
            name="title"
            required
            defaultValue={project.title}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Slug (URL)</label>
          <input
            name="slug"
            defaultValue={project.slug}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Summary</label>
          <textarea
            name="summary"
            rows={3}
            defaultValue={project.summary ?? ""}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Body (Markdown)</label>
          <AdminMarkdownTextarea
            name="content"
            rows={8}
            defaultValue={project.content ?? ""}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Stack</label>
          <input
            name="stack"
            defaultValue={project.stack ?? ""}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Sort order</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={project.sortOrder}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            name="published"
            defaultChecked={project.published}
            className="rounded"
          />
          Published
        </label>
        <AdminFormSubmitButton
          pendingLabel="Saving…"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-400"
        >
          Save project
        </AdminFormSubmitButton>
      </form>

      <form action={deleteProject.bind(null, project.id)} className="mt-12">
        <AdminFormSubmitButton
          pendingLabel="Deleting…"
          confirmMessage="Delete this project?"
          className="rounded-lg border border-red-900/40 px-3 py-2 text-sm text-red-400 hover:bg-red-950/30"
        >
          Delete project
        </AdminFormSubmitButton>
      </form>
    </div>
  );
}
