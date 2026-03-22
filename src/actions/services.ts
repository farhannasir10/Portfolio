"use server";

import { auth } from "@/auth";
import {
  type ServiceIconKey,
  isServiceIconKey,
} from "@/lib/service-icons";
import { prismaPortfolioServices } from "@/lib/prisma-portfolio-service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function parseIconKey(raw: string): ServiceIconKey {
  const v = String(raw ?? "").trim();
  return isServiceIconKey(v) ? v : "code";
}

export async function createService(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Title required");
  const description = String(formData.get("description") ?? "").trim();
  if (!description) throw new Error("Description required");

  const iconKey = parseIconKey(String(formData.get("iconKey") ?? ""));
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;
  const published = formData.get("published") === "on";

  await prismaPortfolioServices().create({
    data: { title, description, iconKey, sortOrder, published },
  });

  revalidatePath("/");
  revalidatePath("/admin/services");
  redirect("/admin/services?saved=1");
}

export async function updateService(serviceId: string, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Title required");
  const description = String(formData.get("description") ?? "").trim();
  if (!description) throw new Error("Description required");

  const iconKey = parseIconKey(String(formData.get("iconKey") ?? ""));
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;
  const published = formData.get("published") === "on";

  await prismaPortfolioServices().update({
    where: { id: serviceId },
    data: { title, description, iconKey, sortOrder, published },
  });

  revalidatePath("/");
  revalidatePath("/admin/services");
  redirect(`/admin/services/${serviceId}?saved=1`);
}

export async function deleteService(serviceId: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prismaPortfolioServices().delete({ where: { id: serviceId } });
  revalidatePath("/");
  revalidatePath("/admin/services");
  redirect("/admin/services?deleted=1");
}
