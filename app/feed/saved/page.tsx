"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SavedRedirect() {
    const router = useRouter();

    useEffect(() => {
        fetch("/api/user/profile")
            .then(r => r.json())
            .then(d => {
                if (d.user?.role === "RECRUITER") {
                    router.replace("/recruiter?tab=Saved");
                } else {
                    router.replace("/talent?tab=Saved");
                }
            })
            .catch(() => router.replace("/talent?tab=Saved"));
    }, [router]);

    return null;
}
