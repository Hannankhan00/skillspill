import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import TalentShell from "./TalentShell";

export const metadata = {
    title: "SkillSpill // Talent Dashboard",
    description: "Talent dashboard for SkillSpill platform",
};

export default async function TalentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    // Not logged in → redirect to login
    if (!session) {
        redirect("/login");
    }

    // Check if user is suspended — if DB is unreachable, allow access rather than crashing
    try {
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { isActive: true },
        });
        if (user && !user.isActive) {
            redirect("/suspended");
        }
    } catch {
        // DB unreachable — proceed rather than show a white screen
    }

    // Not a talent → redirect to appropriate dashboard
    if (session.role !== "TALENT") {
        if (session.role === "ADMIN") redirect("/admin");
        if (session.role === "RECRUITER") redirect("/recruiter");
        redirect("/dashboard");
    }

    return (
        <TalentShell role={session.role} userId={session.userId}>
            {children}
        </TalentShell>
    );
}
