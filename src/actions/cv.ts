"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function setCvFromUpload(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const storageKey = String(formData.get("storageKey") ?? "").trim();
  const originalName = String(formData.get("originalName") ?? "").trim() || "cv.pdf";
  if (!storageKey) throw new Error("Upload the file first");

  await prisma.cvAsset.updateMany({ data: { isActive: false } });
  await prisma.cvAsset.create({
    data: {
      storageKey,
      originalName,
      isActive: true,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/cv");
  redirect("/admin/cv?saved=1");
}

export async function deleteCvAsset(id: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.cvAsset.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/cv");
  redirect("/admin/cv?saved=1");
}
