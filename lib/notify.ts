import { prisma } from "@/lib/prisma";

interface NotifyOptions {
    userId: string;
    title: string;
    message: string;
    type?: "info" | "application" | "match" | "system" | "alert" | "message";
    link?: string;
}

export async function notify(opts: NotifyOptions): Promise<void> {
    try {
        await prisma.notification.create({
            data: {
                userId:  opts.userId,
                title:   opts.title,
                message: opts.message,
                type:    opts.type ?? "info",
                link:    opts.link ?? null,
            },
        });
    } catch {
        // Non-fatal — never let a notification failure break the main flow
    }
}
