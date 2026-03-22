import { AdminNotice } from "@/components/admin/AdminNotice";
import { prismaPortfolioServices } from "@/lib/prisma-portfolio-service";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = { searchParams?: Promise<{ saved?: string; deleted?: string }> };

export default async function AdminServicesPage({ searchParams }: Props) {
  const q = searchParams ? await searchParams : {};
  const services = await prismaPortfolioServices().findMany({
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">Services</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Published services appear in the <strong className="text-zinc-300">Services</strong>{" "}
            section on the home page. With none published, that section and nav link are hidden.
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-cyan-400"
        >
          New service
        </Link>
      </div>

      <AdminNotice
        deleted={q.deleted === "1"}
        saved={q.saved === "1"}
        savedMessage="Service created."
      />

      <ul className="mt-8 space-y-2">
        {services.map((s) => (
          <li
            key={s.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3"
          >
            <div>
              <span className="font-medium text-zinc-200">{s.title}</span>
              <span className="ml-2 text-xs text-zinc-500">
                {s.published ? "published" : "draft"}
              </span>
              <span className="ml-2 text-xs text-zinc-600">· {s.iconKey}</span>
            </div>
            <Link
              href={`/admin/services/${s.id}`}
              className="text-sm text-cyan-400 hover:underline"
            >
              Edit
            </Link>
          </li>
        ))}
        {services.length === 0 ? (
          <li className="text-sm text-zinc-500">No services yet.</li>
        ) : null}
      </ul>
    </div>
  );
}
