"use client";

import { Suspense } from "react";
import MessagesUI from "@/app/components/MessagesUI";

export default function RecruiterMessagesPage() {
    return (
        <div className="flex flex-col" style={{ height: "calc(100dvh - 3.5rem)", background: "var(--theme-bg)" }}>
            <Suspense fallback={
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-[#A855F7] border-t-transparent rounded-full animate-spin" />
                </div>
            }>
                <MessagesUI accent="#A855F7" />
            </Suspense>
        </div>
    );
}
