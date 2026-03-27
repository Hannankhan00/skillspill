import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

/**
 * Shared Prisma singleton — reused across hot-reloads in development.
 *
 * Connection pool is configured via DATABASE_URL query params (see .env.example):
 *   connection_limit=5  → Hostinger shared hosting cap
 *   pool_timeout=10     → seconds to wait for a free connection
 *   connect_timeout=10  → TCP connect timeout in seconds
 *
 * Never call `new PrismaClient()` elsewhere in the codebase.
 * Import from @/lib/prisma or @/lib/db (re-export).
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
