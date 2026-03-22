import { prisma } from "@/lib/prisma";
import { prismaPortfolioServicesMaybe } from "@/lib/prisma-portfolio-service";
import { prismaPortfolioSkillsMaybe } from "@/lib/prisma-portfolio-skill";
import { Prisma } from "@prisma/client";

/** P2021: table missing (e.g. fresh Supabase DB before `prisma db push`). */
function isMissingTableError(e: unknown): boolean {
  return (
    e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2021"
  );
}

export async function getOrCreateSiteSettings() {
  let row = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });
  if (!row) {
    row = await prisma.siteSettings.create({ data: { id: "default" } });
  }
  return row;
}

export async function getPublishedProjects() {
  return prisma.project.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    include: {
      media: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getPublishedProjectBySlug(slug: string) {
  return prisma.project.findFirst({
    where: { published: true, slug },
    include: {
      media: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getPublishedPosts() {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getPublishedPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { published: true, slug },
  });
}

export async function hasPublishedPosts() {
  const n = await prisma.blogPost.count({ where: { published: true } });
  return n > 0;
}

export async function getPublishedServices() {
  const svc = prismaPortfolioServicesMaybe();
  if (!svc) return [];
  try {
    return await svc.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (e) {
    if (isMissingTableError(e)) return [];
    throw e;
  }
}

export async function hasPublishedServices() {
  const svc = prismaPortfolioServicesMaybe();
  if (!svc) return false;
  try {
    const n = await svc.count({ where: { published: true } });
    return n > 0;
  } catch (e) {
    if (isMissingTableError(e)) return false;
    throw e;
  }
}

export async function getPublishedSkills() {
  const sk = prismaPortfolioSkillsMaybe();
  if (!sk) return [];
  try {
    return await sk.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch (e) {
    if (isMissingTableError(e)) return [];
    throw e;
  }
}

export async function hasPublishedSkills() {
  const sk = prismaPortfolioSkillsMaybe();
  if (!sk) return false;
  try {
    const n = await sk.count({ where: { published: true } });
    return n > 0;
  } catch (e) {
    if (isMissingTableError(e)) return false;
    throw e;
  }
}

export async function getActiveCv() {
  return prisma.cvAsset.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
}
