/**
 * lib/db.ts — Shared database connection pool for SkillSpill
 *
 * This project uses Prisma ORM which manages its own connection pool
 * internally via the `connection_limit` query-string parameter on DATABASE_URL.
 *
 * Hostinger Shared Hosting typically allows ~5 simultaneous connections per db user.
 * The DATABASE_URL in .env should therefore include:
 *   ?connection_limit=5&pool_timeout=10&connect_timeout=10
 *
 * Example:
 *   DATABASE_URL="mysql://user:pass@host:3306/dbname?connection_limit=5&pool_timeout=10&connect_timeout=10"
 *
 * Re-exporting the shared Prisma singleton from lib/prisma.ts so that all
 * API routes can import from either @/lib/db or @/lib/prisma interchangeably.
 */

export { prisma as default, prisma } from "@/lib/prisma";
