import { createService } from "@/actions/services";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import { SERVICE_ICON_OPTIONS } from "@/lib/service-icons";
import Link from "next/link";

export default function NewServicePage() {
  return (
    <div>
      <Link href="/admin/services" className="text-sm text-cyan-400 hover:underline">
        ← Services
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-50">New service</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Choose an icon preset and a title. Description is optional for the public card.
      </p>

      <form action={createService} className="mt-8 max-w-xl space-y-6">
        <div>
          <label className="block text-sm text-zinc-400">Title</label>
          <input
            name="title"
            required
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Description (optional)</label>
          <textarea
            name="description"
            rows={4}
            placeholder="Leave blank if you only want a title on the card."
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Icon</label>
          <select
            name="iconKey"
            defaultValue="code"
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
            defaultValue={0}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input type="checkbox" name="published" defaultChecked className="rounded" />
          Published (visible on site)
        </label>
        <AdminFormSubmitButton
          pendingLabel="Creating…"
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-cyan-400"
        >
          Create service
        </AdminFormSubmitButton>
      </form>
    </div>
  );
}
