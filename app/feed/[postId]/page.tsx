import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function PostDetailPage({ params }: { params: Promise<{ postId: string }> }) {
    const { postId } = await params;
    const session = await getSession();
    if (!session) redirect("/login");
    if (session.role === "RECRUITER") redirect(`/recruiter?post=${postId}`);
    redirect(`/talent?post=${postId}`);
}
