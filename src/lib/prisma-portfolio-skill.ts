import type { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type PortfolioSkillDb = PrismaClient["portfolioSkill"];

export function prismaPortfolioSkillsMaybe(): PortfolioSkillDb | null {
  const c = prisma as PrismaClient & {
    portfolioSkill?: PortfolioSkillDb;
    skill?: unknown;
  };
  if (c.portfolioSkill) return c.portfolioSkill;
  if (c.skill && typeof c.skill === "object" && c.skill !== null) {
    return c.skill as PortfolioSkillDb;
  }
  return null;
}

export function prismaPortfolioSkills(): PortfolioSkillDb {
  const d = prismaPortfolioSkillsMaybe();
  if (!d) {
    throw new Error(
      "Prisma client has no skills model (portfolioSkill). Stop next dev, run `npx prisma generate`, then start again.",
    );
  }
  return d;
}
