import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

// Universal messages router — redirects to the correct role-scoped messages page.
// Used by message notifications so the link works regardless of the recipient's role.
export default async function MessagesRedirectPage({
    searchParams,
}: {
    searchParams: Promise<{ conversation?: string }>;
}) {
    const session = await getSession();
    if (!session) redirect("/login");

    const { conversation } = await searchParams;
    const base = session.role === "RECRUITER" ? "/recruiter/messages" : "/talent/messages";
    redirect(conversation ? `${base}?conversation=${conversation}` : base);
}
