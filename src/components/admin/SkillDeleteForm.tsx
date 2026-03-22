"use client";

import { deleteSkill } from "@/actions/skills";
import { AdminFormSubmitButton } from "@/components/admin/AdminFormSubmitButton";

export function SkillDeleteForm({ skillId }: { skillId: string }) {
  return (
    <form action={deleteSkill.bind(null, skillId)} className="mt-12 max-w-xl">
      <AdminFormSubmitButton
        pendingLabel="Deleting…"
        className="text-sm text-red-400 hover:underline"
        confirmMessage="Delete this skill?"
      >
        Delete skill
      </AdminFormSubmitButton>
    </form>
  );
}
