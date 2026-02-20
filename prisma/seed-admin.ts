/**
 * Seed script: Creates the initial ADMIN user
 * 
 * Email:    admin@gmail.com
 * Password: 1234
 * Role:     ADMIN
 * 
 * Run: npx tsx prisma/seed-admin.ts
 */

import dotenv from "dotenv";
// Load env files (Next.js uses .env.local, .env)
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { PrismaClient } from "../app/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "admin@gmail.com";
    const password = "1234";
    const fullName = "System Admin";
    const username = "admin";

    // Check if admin already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log(`\n⚡ Admin user already exists: ${email}`);
        console.log(`   Role: ${existing.role}`);
        console.log(`   ID:   ${existing.id}`);
        console.log(`\n✓ No changes made.\n`);
        return;
    }

    // Check if username is taken
    const usernameExists = await prisma.user.findUnique({ where: { username } });
    const finalUsername = usernameExists ? `admin_${Date.now()}` : username;

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await prisma.user.create({
        data: {
            email,
            username: finalUsername,
            fullName,
            passwordHash,
            role: "ADMIN",
            emailVerified: true,
            isActive: true,
        },
    });

    console.log(`\n╔══════════════════════════════════════════╗`);
    console.log(`║  ⚡ ADMIN ACCOUNT CREATED SUCCESSFULLY  ║`);
    console.log(`╠══════════════════════════════════════════╣`);
    console.log(`║  Email:    ${email.padEnd(28)}║`);
    console.log(`║  Password: ${"1234".padEnd(28)}║`);
    console.log(`║  Role:     ${"ADMIN".padEnd(28)}║`);
    console.log(`║  Username: ${finalUsername.padEnd(28)}║`);
    console.log(`║  ID:       ${admin.id.padEnd(28)}║`);
    console.log(`╚══════════════════════════════════════════╝`);
    console.log(`\n→ Login at: http://localhost:3000/login`);
    console.log(`→ Dashboard: http://localhost:3000/admin\n`);
}

main()
    .catch((e) => {
        console.error("❌ Failed to seed admin:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
