import type { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/** Delegate for `PortfolioService` model (`@@map("Service")`). */
export type PortfolioServiceDb = PrismaClient["portfolioService"];

/**
 * Next.js can bundle Prisma in a way that drops model delegates, or you may run an
 * older generated client (only `service`) vs newer (`portfolioService`). This picks
 * whichever exists.
 */
export function prismaPortfolioServicesMaybe(): PortfolioServiceDb | null {
  const c = prisma as PrismaClient & {
    portfolioService?: PortfolioServiceDb;
    /** Older generated client when the model was named `Service` */
    service?: unknown;
  };
  if (c.portfolioService) return c.portfolioService;
  if (c.service && typeof c.service === "object" && c.service !== null) {
    return c.service as PortfolioServiceDb;
  }
  return null;
}

export function prismaPortfolioServices(): PortfolioServiceDb {
  const d = prismaPortfolioServicesMaybe();
  if (!d) {
    throw new Error(
      "Prisma client has no services model (portfolioService). Stop next dev, run `npx prisma generate`, then start again.",
    );
  }
  return d;
}
