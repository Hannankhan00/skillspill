// Seed popular hashtags for The Spill feed
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const SEED_TAGS = [
    "opentowork", "hiring", "webdev", "reactjs", "nodejs",
    "python", "javascript", "remotejobs", "skillspill", "techcareers",
    "freelance", "coding", "github", "ai", "css",
];

async function main() {
    for (const tag of SEED_TAGS) {
        await prisma.spillHashtag.upsert({
            where: { tag },
            create: { tag, useCount: 1 },
            update: {},
        });
    }
    console.log(`Seeded ${SEED_TAGS.length} hashtags`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
