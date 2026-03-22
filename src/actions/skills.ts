"use server";

import { auth } from "@/auth";
import { prismaPortfolioSkills } from "@/lib/prisma-portfolio-skill";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createSkill(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Name required");

  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;
  const published = formData.get("published") === "on";

  await prismaPortfolioSkills().create({
    data: { name, sortOrder, published },
  });

  revalidatePath("/");
  revalidatePath("/admin/skills");
  redirect("/admin/skills?saved=1");
}

export async function updateSkill(skillId: string, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Name required");

  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;
  const published = formData.get("published") === "on";

  await prismaPortfolioSkills().update({
    where: { id: skillId },
    data: { name, sortOrder, published },
  });

  revalidatePath("/");
  revalidatePath("/admin/skills");
  redirect(`/admin/skills/${skillId}?saved=1`);
}

export async function deleteSkill(skillId: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prismaPortfolioSkills().delete({ where: { id: skillId } });
  revalidatePath("/");
  revalidatePath("/admin/skills");
  redirect("/admin/skills?deleted=1");
}
