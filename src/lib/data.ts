import { prisma } from "@/lib/prisma";
import { prismaPortfolioServicesMaybe } from "@/lib/prisma-portfolio-service";
import { prismaPortfolioSkillsMaybe } from "@/lib/prisma-portfolio-skill";

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
  return svc.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function hasPublishedServices() {
  const svc = prismaPortfolioServicesMaybe();
  if (!svc) return false;
  const n = await svc.count({ where: { published: true } });
  return n > 0;
}

export async function getPublishedSkills() {
  const sk = prismaPortfolioSkillsMaybe();
  if (!sk) return [];
  return sk.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function hasPublishedSkills() {
  const sk = prismaPortfolioSkillsMaybe();
  if (!sk) return false;
  const n = await sk.count({ where: { published: true } });
  return n > 0;
}

export async function getActiveCv() {
  return prisma.cvAsset.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
}
