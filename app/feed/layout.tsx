import React from "react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
    title: "The Spill 🌊 | SkillSpill Feed",
    description: "Discover code spills, hiring posts, and developer insights on SkillSpill's social feed.",
};

export default async function FeedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    return <>{children}</>;
}
