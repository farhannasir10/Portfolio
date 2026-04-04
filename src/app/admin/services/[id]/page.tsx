import { updateService } from "@/actions/services";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { ServiceDeleteForm } from "@/components/admin/ServiceDeleteForm";
import { SERVICE_ICON_OPTIONS } from "@/lib/service-icons";
import { prismaPortfolioServices } from "@/lib/prisma-portfolio-service";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ saved?: string }>;
};

export default async function EditServicePage({ params, searchParams }: Props) {
  const { id } = await params;
  const q = searchParams ? await searchParams : {};
  const service = await prismaPortfolioServices().findUnique({ where: { id } });
  if (!service) notFound();

  return (
    <div>
      <Link href="/admin/services" className="text-sm text-cyan-400 hover:underline">
        ← Services
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-50">Edit service</h1>

      <AdminNotice saved={q.saved === "1"} />

      <form action={updateService.bind(null, service.id)} className="mt-8 max-w-xl space-y-6">
        <div>
          <label className="block text-sm text-zinc-400">Title</label>
          <input
            name="title"
            required
            defaultValue={service.title}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Description (optional)</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={service.description}
            placeholder="Leave blank if you only want a title on the card."
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Icon</label>
          <select
            name="iconKey"
            defaultValue={service.iconKey}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          >
            {SERVICE_ICON_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Sort order</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={service.sortOrder}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            name="published"
            defaultChecked={service.published}
            className="rounded"
          />
          Published (visible on site)
        </label>
        <AdminFormSubmitButton
          pendingLabel="Saving…"
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-cyan-400"
        >
          Save changes
        </AdminFormSubmitButton>
      </form>

      <ServiceDeleteForm serviceId={service.id} />
    </div>
  );
}
