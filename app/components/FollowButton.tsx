"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface FollowButtonProps {
    targetUserId: string;
    initialIsFollowing: boolean;
    className?: string;
    onToggle?: (newV: boolean) => void;
}

export default function FollowButton({ targetUserId, initialIsFollowing, className, onToggle }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleToggle = async () => {
        setLoading(true);
        try {
            if (isFollowing) {
                // Unfollow
                const res = await fetch(`/api/user/${targetUserId}/follow`, { method: "DELETE" });
                if (res.ok) {
                    setIsFollowing(false);
                    onToggle?.(false);
                    router.refresh();
                }
            } else {
                // Follow
                const res = await fetch(`/api/user/${targetUserId}/follow`, { method: "POST" });
                if (res.ok) {
                    setIsFollowing(true);
                    onToggle?.(true);
                    router.refresh();
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all border outline-none ${
                isFollowing 
                    ? "bg-transparent text-[var(--theme-text-primary)] border-[var(--theme-border)] hover:border-red-500 hover:text-red-500" 
                    : "bg-[#3CF91A] text-black border-transparent hover:bg-[#3CF91A]/90 hover:scale-105 shadow-[0_0_15px_rgba(60,249,26,0.2)]"
            } ${className || ""}`}
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isFollowing ? "Following" : "Follow+"}
        </button>
    );
}
