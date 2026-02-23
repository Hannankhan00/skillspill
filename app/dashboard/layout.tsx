import React from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
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

    return (
        <DashboardShell role={session.role} userId={session.userId}>
            {children}
        </DashboardShell>
    );
}

