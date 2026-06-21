import { updateTestimonial } from "@/actions/testimonials";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { TestimonialDeleteForm } from "@/components/admin/TestimonialDeleteForm";
import { prismaPortfolioTestimonials } from "@/lib/prisma-portfolio-testimonial";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ saved?: string }>;
};

export default async function EditTestimonialPage({ params, searchParams }: Props) {
  const { id } = await params;
  const q = searchParams ? await searchParams : {};
  const testimonial = await prismaPortfolioTestimonials().findUnique({ where: { id } });
  if (!testimonial) notFound();

  return (
    <div>
      <Link href="/admin/testimonials" className="text-sm text-orange-400 hover:underline">
        ← Testimonials
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-50">Edit testimonial</h1>

      <AdminNotice saved={q.saved === "1"} />

      <form action={updateTestimonial.bind(null, testimonial.id)} className="mt-8 max-w-xl space-y-6">
        <div>
          <label className="block text-sm text-zinc-400">Quote</label>
          <textarea
            name="quote"
            required
            rows={5}
            defaultValue={testimonial.quote}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Client name</label>
          <input
            name="clientName"
            required
            defaultValue={testimonial.clientName}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Role / company (optional)</label>
          <input
            name="clientRole"
            defaultValue={testimonial.clientRole ?? ""}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Sort order</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={testimonial.sortOrder}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            name="published"
            defaultChecked={testimonial.published}
            className="rounded"
          />
          Published (visible on site)
        </label>
        <AdminFormSubmitButton
          pendingLabel="Saving…"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-400"
        >
          Save changes
        </AdminFormSubmitButton>
      </form>

      <TestimonialDeleteForm testimonialId={testimonial.id} />
    </div>
  );
}
