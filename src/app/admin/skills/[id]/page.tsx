import { updateSkill } from "@/actions/skills";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { SkillDeleteForm } from "@/components/admin/SkillDeleteForm";
import { prismaPortfolioSkills } from "@/lib/prisma-portfolio-skill";
import { SKILL_CATEGORY_PRESETS } from "@/lib/skill-category-options";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ saved?: string }>;
};

export default async function EditSkillPage({ params, searchParams }: Props) {
  const { id } = await params;
  const q = searchParams ? await searchParams : {};
  const skill = await prismaPortfolioSkills().findUnique({ where: { id } });
  if (!skill) notFound();

  return (
    <div>
      <Link href="/admin/skills" className="text-sm text-orange-400 hover:underline">
        ← Skills
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-50">Edit skill</h1>

      <AdminNotice saved={q.saved === "1"} />

      <form action={updateSkill.bind(null, skill.id)} className="mt-8 max-w-xl space-y-6">
        <div>
          <label className="block text-sm text-zinc-400">Name</label>
          <input
            name="name"
            required
            defaultValue={skill.name}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400">About card group (optional)</label>
          <input
            name="category"
            list="skill-category-presets"
            defaultValue={skill.category ?? ""}
            placeholder="e.g. Frontend"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
          <datalist id="skill-category-presets">
            {SKILL_CATEGORY_PRESETS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="block text-sm text-zinc-400">Sort order</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={skill.sortOrder}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            name="published"
            defaultChecked={skill.published}
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

      <SkillDeleteForm skillId={skill.id} />
    </div>
  );
}
