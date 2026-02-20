import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await getSession();
    if (session?.role === "ADMIN") redirect("/admin");
    if (session?.role === "TALENT") redirect("/dashboard/talent");
    if (session?.role === "RECRUITER") redirect("/dashboard/recruiter");

    return (
        <div className="flex bg-[#060608] min-h-screen text-white font-mono items-center justify-center">
            <span className="text-gray-500">Initializing Dashboard Protocol...</span>
        </div>
    );
}
