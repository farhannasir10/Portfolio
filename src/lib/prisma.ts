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

/**
 * Supabase “Session” pooler allows very few concurrent clients; Prisma’s default
 * pool opens several connections per process and hits `MaxClientsInSessionMode`.
 * Capping to one connection per Node process fixes that for dev and typical
 * serverless deploys. Opt out: `PRISMA_DISABLE_CONNECTION_LIMIT=1`.
 *
 * Prefer Supabase **Transaction** pooler (`:6543`, `?pgbouncer=true`) for higher
 * throughput once you’re off the session endpoint.
 */
function prismaDatabaseUrl(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;
  if (process.env.PRISMA_DISABLE_CONNECTION_LIMIT === "1") return raw;
  if (/[?&]connection_limit=/.test(raw)) return raw;

  try {
    const u = new URL(raw);
    u.searchParams.set("connection_limit", "1");
    if (!u.searchParams.has("pool_timeout")) {
      u.searchParams.set("pool_timeout", "20");
    }
    return u.toString();
  } catch {
    const sep = raw.includes("?") ? "&" : "?";
    return `${raw}${sep}connection_limit=1&pool_timeout=20`;
  }
}

function makeClient() {
  const url = prismaDatabaseUrl();
  return new PrismaClientCtor({
    ...(url ? { datasources: { db: { url } } } : {}),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

/**
 * Single client for the whole Node process. Required in dev: without this, every
 * Turbopack/HMR reload creates a new PrismaClient and new DB connections until the
 * pool hits "MaxClientsInSessionMode" (common with Supabase session pooler).
 *
 * After `prisma generate`, restart `next dev` if delegates look stale.
 */
export const prisma = globalForPrisma.prisma ??= makeClient();
