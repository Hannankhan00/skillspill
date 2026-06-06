import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Universal profile router — redirects to the correct role-scoped profile view.
// Used by follow notifications so the link works regardless of the viewer's role.
export default async function UniversalProfilePage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const session = await getSession();
    if (!session) redirect("/login");

    const target = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
    });

    if (!target) redirect(session.role === "RECRUITER" ? "/recruiter" : "/talent");

    const viewer = session.role.toLowerCase();        // "recruiter" | "talent"
    const targetRole = target.role.toLowerCase();     // "recruiter" | "talent"

    redirect(`/${viewer}/${targetRole}/${userId}`);
}
