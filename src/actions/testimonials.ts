"use server";

import { auth } from "@/auth";
import { prismaPortfolioTestimonials } from "@/lib/prisma-portfolio-testimonial";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTestimonial(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const quote = String(formData.get("quote") ?? "").trim();
  const clientName = String(formData.get("clientName") ?? "").trim();
  if (!quote) throw new Error("Quote required");
  if (!clientName) throw new Error("Client name required");

  const clientRole = String(formData.get("clientRole") ?? "").trim() || null;
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;
  const published = formData.get("published") === "on";

  await prismaPortfolioTestimonials().create({
    data: { quote, clientName, clientRole, sortOrder, published },
  });

  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials?saved=1");
}

export async function updateTestimonial(testimonialId: string, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const quote = String(formData.get("quote") ?? "").trim();
  const clientName = String(formData.get("clientName") ?? "").trim();
  if (!quote) throw new Error("Quote required");
  if (!clientName) throw new Error("Client name required");

  const clientRole = String(formData.get("clientRole") ?? "").trim() || null;
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;
  const published = formData.get("published") === "on";

  await prismaPortfolioTestimonials().update({
    where: { id: testimonialId },
    data: { quote, clientName, clientRole, sortOrder, published },
  });

  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  redirect(`/admin/testimonials/${testimonialId}?saved=1`);
}

export async function deleteTestimonial(testimonialId: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prismaPortfolioTestimonials().delete({ where: { id: testimonialId } });
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials?deleted=1");
}
