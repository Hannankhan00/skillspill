import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import RecruiterShell from "./RecruiterShell";

export const metadata = {
    title: "SkillSpill // Recruiter Dashboard",
    description: "Recruiter dashboard for SkillSpill platform",
};

export default async function RecruiterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    // Not logged in → redirect to login
    if (!session) {
        redirect("/login");
    }

    // Check if user is suspended
    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { isActive: true },
    });

    if (user && !user.isActive) {
        redirect("/suspended");
    }

    // Not a recruiter → redirect to appropriate dashboard
    if (session.role !== "RECRUITER") {
        if (session.role === "ADMIN") redirect("/admin");
        if (session.role === "TALENT") redirect("/talent");
        redirect("/dashboard");
    }

    return (
        <RecruiterShell role={session.role} userId={session.userId}>
            {children}
        </RecruiterShell>
    );
}
