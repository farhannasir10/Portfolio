import { AdminNotice } from "@/components/admin/AdminNotice";
import { prismaPortfolioTestimonials } from "@/lib/prisma-portfolio-testimonial";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = { searchParams?: Promise<{ saved?: string; deleted?: string }> };

export default async function AdminTestimonialsPage({ searchParams }: Props) {
  const q = searchParams ? await searchParams : {};
  const testimonials = await prismaPortfolioTestimonials().findMany({
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">Testimonials</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Published quotes appear in the <strong className="text-zinc-300">Kind words</strong>{" "}
            section on the home page. With none published, that section is hidden.
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-400"
        >
          New testimonial
        </Link>
      </div>

      <AdminNotice
        deleted={q.deleted === "1"}
        saved={q.saved === "1"}
        savedMessage="Testimonial created."
      />

      <ul className="mt-8 space-y-2">
        {testimonials.map((t) => (
          <li
            key={t.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3"
          >
            <div className="min-w-0">
              <span className="font-medium text-zinc-200">{t.clientName}</span>
              {t.clientRole ? (
                <span className="ml-2 text-xs text-zinc-500">· {t.clientRole}</span>
              ) : null}
              <span className="ml-2 text-xs text-zinc-500">
                {t.published ? "published" : "draft"}
              </span>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-400">&ldquo;{t.quote}&rdquo;</p>
            </div>
            <Link
              href={`/admin/testimonials/${t.id}`}
              className="shrink-0 text-sm text-orange-400 hover:underline"
            >
              Edit
            </Link>
          </li>
        ))}
        {testimonials.length === 0 ? (
          <li className="text-sm text-zinc-500">No testimonials yet.</li>
        ) : null}
      </ul>
    </div>
  );
}
