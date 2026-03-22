import { createRequire } from "node:module";
import path from "node:path";
import type { PrismaClient } from "@prisma/client";

/**
 * Turbopack can bundle `@prisma/client` in a way that drops model delegates
 * (portfolioSkill, portfolioService, etc.). Loading via createRequire forces the
 * real generated client from node_modules at runtime.
 */
const require = createRequire(path.join(process.cwd(), "package.json"));
const { PrismaClient: PrismaClientCtor } = require("@prisma/client") as {
  PrismaClient: new (args?: ConstructorParameters<typeof import("@prisma/client").PrismaClient>[0]) => PrismaClient;
};

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function makeClient() {
  return new PrismaClientCtor({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

/**
 * Production: one client on global. Development: do not pin on global — otherwise
 * after `prisma generate` the old client stays in memory until you restart `next dev`.
 */
export const prisma =
  process.env.NODE_ENV === "production"
    ? (globalForPrisma.prisma ??= makeClient())
    : makeClient();
