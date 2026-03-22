"use server";

import { auth } from "@/auth";
import { addProjectMediaFromForm } from "@/lib/add-project-media-from-form";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
import { redirect } from "next/navigation";

async function uniqueProjectSlug(base: string) {
  let slug = slugify(base) || "project";
  let n = 0;
  for (;;) {
    const candidate = n === 0 ? slug : `${slug}-${n}`;
    const exists = await prisma.project.findUnique({
      where: { slug: candidate },
    });
    if (!exists) return candidate;
    n += 1;
    if (n > 50) {
      slug = `${slugify(base)}-${randomBytes(4).toString("hex")}`;
      n = 0;
    }
  }
}

export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Title required");

  const slug = await uniqueProjectSlug(title);
  const summary = String(formData.get("summary") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "") || null;
  const stack = String(formData.get("stack") ?? "").trim() || null;
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;
  const published = formData.get("published") === "on";

  const created = await prisma.project.create({
    data: {
      title,
      slug,
      summary,
      content,
      stack,
      sortOrder,
      published,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect(`/admin/projects/${created.id}?saved=1`);
}

export async function updateProject(projectId: string, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Title required");

  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug =
    slugInput && slugify(slugInput) === slugInput
      ? slugInput
      : await uniqueProjectSlug(title);

  const summary = String(formData.get("summary") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "") || null;
  const stack = String(formData.get("stack") ?? "").trim() || null;
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;
  const published = formData.get("published") === "on";

  const other = await prisma.project.findFirst({
    where: { slug, NOT: { id: projectId } },
  });
  if (other) throw new Error("Slug already in use");

  await prisma.project.update({
    where: { id: projectId },
    data: {
      title,
      slug,
      summary,
      content,
      stack,
      sortOrder,
      published,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/projects");
  revalidatePath(`/work/${slug}`);
  redirect(`/admin/projects/${projectId}?saved=1`);
}

export async function deleteProject(projectId: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.project.delete({ where: { id: projectId } });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects?deleted=1");
}

/** Prefer POST /api/admin/project-media from forms (Server Actions omit client hidden fields). */
export async function addProjectMedia(
  projectId: string,
  formData: FormData,
) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const { slug } = await addProjectMediaFromForm(projectId, formData);
  revalidatePath("/");
  revalidatePath("/admin/projects");
  revalidatePath(`/work/${slug}`);
}

export async function deleteProjectMedia(mediaId: string) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const row = await prisma.projectMedia.findUnique({ where: { id: mediaId } });
  if (!row) return;

  await prisma.projectMedia.delete({ where: { id: mediaId } });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${row.projectId}`);
  const project = await prisma.project.findUnique({ where: { id: row.projectId } });
  if (project) revalidatePath(`/work/${project.slug}`);
  redirect(`/admin/projects/${row.projectId}?removed=1`);
}

export async function updateProjectMediaSort(
  mediaId: string,
  formData: FormData,
) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const raw = formData.get("sortOrder");
  const sortOrder = Number(raw ?? 0);
  if (!Number.isFinite(sortOrder)) throw new Error("Invalid sort order");

  const row = await prisma.projectMedia.findUnique({ where: { id: mediaId } });
  if (!row) throw new Error("Not found");

  await prisma.projectMedia.update({
    where: { id: mediaId },
    data: { sortOrder },
  });

  const project = await prisma.project.findUnique({
    where: { id: row.projectId },
  });
  revalidatePath("/");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${row.projectId}`);
  if (project) revalidatePath(`/work/${project.slug}`);
  redirect(`/admin/projects/${row.projectId}?saved=1`);
}
