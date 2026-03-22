"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { redirect } from "next/navigation";

async function uniqueBlogSlug(base: string, excludeId?: string) {
  let slug = slugify(base) || "post";
  let n = 0;
  for (;;) {
    const candidate = n === 0 ? slug : `${slug}-${n}`;
    const exists = await prisma.blogPost.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (!exists) return candidate;
    n += 1;
    if (n > 50) {
      slug = `${slugify(base)}-${randomBytes(4).toString("hex")}`;
      n = 0;
    }
  }
}

export async function createBlogPost(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Title required");

  const slug = await uniqueBlogSlug(title);
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "");
  const coverImage = String(formData.get("coverImage") ?? "").trim() || null;
  const published = formData.get("published") === "on";
  const publishedAt = published ? new Date() : null;

  const created = await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      published,
      publishedAt,
    },
  });

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/blogs");
  redirect(`/admin/blogs/${created.id}?saved=1`);
}

export async function updateBlogPost(postId: string, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Title required");

  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug =
    slugInput && slugify(slugInput) === slugInput
      ? slugInput
      : await uniqueBlogSlug(title, postId);

  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "");
  const coverRaw = String(formData.get("coverImage") ?? "").trim();
  const published = formData.get("published") === "on";

  const existing = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!existing) throw new Error("Not found");

  const coverImage =
    coverRaw.length > 0 ? coverRaw : existing.coverImage ?? null;

  let publishedAt = existing.publishedAt;
  if (published && !existing.publishedAt) {
    publishedAt = new Date();
  }
  if (!published) {
    publishedAt = null;
  }

  await prisma.blogPost.update({
    where: { id: postId },
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      published,
      publishedAt,
    },
  });

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/blogs");
  revalidatePath(`/blog/${slug}`);
  redirect(`/admin/blogs/${postId}?saved=1`);
}

export async function deleteBlogPost(postId: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.blogPost.delete({ where: { id: postId } });
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/admin/blogs");
  redirect("/admin/blogs?deleted=1");
}
