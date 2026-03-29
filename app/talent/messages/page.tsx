"use client";

import { Suspense } from "react";
import MessagesUI from "@/app/components/MessagesUI";

export default function TalentMessagesPage() {
    return (
        <div className="flex flex-col" style={{ height: "calc(100dvh - 3.5rem)", background: "var(--theme-bg)" }}>
            <Suspense fallback={
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-[#3CF91A] border-t-transparent rounded-full animate-spin" />
                </div>
            }>
                <MessagesUI accent="#3CF91A" />
            </Suspense>
        </div>
    );
}
