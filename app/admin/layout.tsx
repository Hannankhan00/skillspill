import React from "react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
    title: "SkillSpill // Admin Console",
    description: "Admin management console for SkillSpill platform",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    // Not logged in → redirect to login
    if (!session) {
        redirect("/login");
    }

    // Not an admin → redirect to appropriate dashboard
    if (session.role !== "ADMIN") {
        if (session.role === "TALENT") redirect("/dashboard/talent");
        if (session.role === "RECRUITER") redirect("/dashboard/recruiter");
        redirect("/dashboard");
    }

    return <>{children}</>;
}
