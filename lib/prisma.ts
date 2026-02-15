import { PrismaClient } from "../app/generated/prisma";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Intialize standard Prisma 5 Client
// Database URL is read from schema.prisma (env("DATABASE_URL"))
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
