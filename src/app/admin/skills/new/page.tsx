import { createSkill } from "@/actions/skills";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import { SKILL_CATEGORY_PRESETS } from "@/lib/skill-category-options";
import Link from "next/link";

export default function NewSkillPage() {
  return (
    <div>
      <Link href="/admin/skills" className="text-sm text-orange-400 hover:underline">
        ← Skills
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-50">Add skill</h1>
      <p className="mt-2 text-sm text-zinc-400">
        One technology or tool per row (e.g. <code className="text-zinc-300">TypeScript</code>).
      </p>

      <form action={createSkill} className="mt-8 max-w-xl space-y-6">
        <div>
          <label className="block text-sm text-zinc-400">Name</label>
          <input
            name="name"
            required
            placeholder="TypeScript"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">About card group (optional)</label>
          <input
            name="category"
            list="skill-category-presets"
            placeholder="e.g. Frontend"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
          <datalist id="skill-category-presets">
            {SKILL_CATEGORY_PRESETS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <p className="mt-1 text-xs text-zinc-600">
            Skills with the same group appear together on the About section. Leave empty for one
            combined card.
          </p>
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
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-400"
        >
          Create skill
        </AdminFormSubmitButton>
      </form>
    </div>
  );
}
