import { AdminNotice } from "@/components/admin/AdminNotice";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = { searchParams?: Promise<{ deleted?: string }> };

export default async function AdminProjectsPage({ searchParams }: Props) {
  const q = searchParams ? await searchParams : {};
  const projects = await prisma.project.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">Projects</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Open a project to add videos, screenshots, and external links.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/blogs/new"
            className="rounded-lg border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800"
          >
            New blog post
          </Link>
          <Link
            href="/admin/projects/new"
            className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-cyan-400"
          >
            New project
          </Link>
        </div>
      </div>

      <AdminNotice deleted={q.deleted === "1"} />

      <ul className="mt-8 space-y-2">
        {projects.map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3"
          >
            <div>
              <span className="font-medium text-zinc-200">{p.title}</span>
              <span className="ml-2 text-xs text-zinc-500">
                {p.published ? "published" : "draft"}
              </span>
            </div>
            <Link
              href={`/admin/projects/${p.id}`}
              className="text-sm text-cyan-400 hover:underline"
            >
              Edit
            </Link>
          </li>
        ))}
        {projects.length === 0 ? (
          <li className="text-sm text-zinc-500">No projects yet.</li>
        ) : null}
      </ul>
    </div>
  );
}
