import { createTestimonial } from "@/actions/testimonials";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import Link from "next/link";

export default function NewTestimonialPage() {
  return (
    <div>
      <Link href="/admin/testimonials" className="text-sm text-orange-400 hover:underline">
        ← Testimonials
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-50">New testimonial</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Add a client quote for the <strong className="text-zinc-300">Kind words</strong> section.
      </p>

      <form action={createTestimonial} className="mt-8 max-w-xl space-y-6">
        <div>
          <label className="block text-sm text-zinc-400">Quote</label>
          <textarea
            name="quote"
            required
            rows={5}
            placeholder="What the client said about working with you…"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Client name</label>
          <input
            name="clientName"
            required
            placeholder="Jane Smith"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Role / company (optional)</label>
          <input
            name="clientRole"
            placeholder="Product lead at Acme"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Sort order</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={0}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-zinc-500">Lower numbers appear first.</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="published" defaultChecked className="rounded" />
          Published (visible on site)
        </label>
        <AdminFormSubmitButton
          pendingLabel="Creating…"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-400"
        >
          Create testimonial
        </AdminFormSubmitButton>
      </form>
    </div>
  );
}
