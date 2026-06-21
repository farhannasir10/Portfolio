import type { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type PortfolioTestimonialDb = PrismaClient["portfolioTestimonial"];

export function prismaPortfolioTestimonialsMaybe(): PortfolioTestimonialDb | null {
  const c = prisma as PrismaClient & {
    portfolioTestimonial?: PortfolioTestimonialDb;
    testimonial?: unknown;
  };
  if (c.portfolioTestimonial) return c.portfolioTestimonial;
  if (c.testimonial && typeof c.testimonial === "object" && c.testimonial !== null) {
    return c.testimonial as PortfolioTestimonialDb;
  }
  return null;
}

export function prismaPortfolioTestimonials(): PortfolioTestimonialDb {
  const d = prismaPortfolioTestimonialsMaybe();
  if (!d) {
    throw new Error(
      "Prisma client has no testimonials model (portfolioTestimonial). Stop next dev, run `npx prisma generate`, then start again.",
    );
  }
  return d;
}
