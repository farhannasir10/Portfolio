import { AdminNotice } from "@/components/admin/AdminNotice";
import { prismaPortfolioSkillsMaybe } from "@/lib/prisma-portfolio-skill";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = { searchParams?: Promise<{ saved?: string; deleted?: string }> };

export default async function AdminSkillsPage({ searchParams }: Props) {
  const q = searchParams ? await searchParams : {};
  const delegate = prismaPortfolioSkillsMaybe();
  const skills = delegate
    ? await delegate.findMany({
        orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      })
    : [];

  return (
    <div>
      {!delegate ? (
        <div className="mb-8 rounded-lg border border-amber-900/50 bg-amber-950/30 px-4 py-3 text-sm text-amber-100">
          <p className="font-medium">Prisma client did not load the skills model.</p>
          <p className="mt-2 text-amber-200/80">
            Stop <code className="rounded bg-black/30 px-1">next dev</code>, run{" "}
            <code className="rounded bg-black/30 px-1">npx prisma generate</code>, start
            again. If it still fails on Windows, close the terminal (EPERM on the query
            engine), then retry.
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">Skills</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Short labels (e.g. TypeScript, Next.js) shown as pills on the home page.
            With none published, the skills block is hidden.
          </p>
        </div>
        {delegate ? (
          <Link
            href="/admin/skills/new"
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-400"
          >
            Add skill
          </Link>
        ) : (
          <span className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-500">
            Add skill
          </span>
        )}
      </div>

      <AdminNotice
        deleted={q.deleted === "1"}
        saved={q.saved === "1"}
        savedMessage="Skill created."
      />

      <ul className="mt-8 space-y-2">
        {skills.map((s) => (
          <li
            key={s.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3"
          >
            <div>
              <span className="font-medium text-zinc-200">{s.name}</span>
              <span className="ml-2 text-xs text-zinc-500">
                {s.published ? "published" : "draft"}
              </span>
            </div>
            <Link
              href={`/admin/skills/${s.id}`}
              className="text-sm text-orange-400 hover:underline"
            >
              Edit
            </Link>
          </li>
        ))}
        {skills.length === 0 ? (
          <li className="text-sm text-zinc-500">No skills yet.</li>
        ) : null}
      </ul>
    </div>
  );
}
