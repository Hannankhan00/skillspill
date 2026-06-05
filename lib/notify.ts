import { prisma } from "@/lib/prisma";
import pusher from "@/lib/pusher";

interface NotifyOptions {
    userId: string;
    title: string;
    message: string;
    type?: "info" | "application" | "match" | "system" | "alert" | "message" | "follow" | "comment";
    link?: string;
}

export async function notify(opts: NotifyOptions): Promise<void> {
    try {
        const notification = await prisma.notification.create({
            data: {
                userId:  opts.userId,
                title:   opts.title,
                message: opts.message,
                type:    opts.type ?? "info",
                link:    opts.link ?? null,
            },
        });

        // Push real-time event — client subscribes on user-{userId} channel
        pusher.trigger(`user-${opts.userId}`, "new-notification", {
            id:        notification.id,
            title:     notification.title,
            message:   notification.message,
            type:      notification.type,
            link:      notification.link,
            createdAt: notification.createdAt,
        }).catch(() => {/* non-fatal */});
    } catch {
        // Non-fatal — never let a notification failure break the main flow
    }
}
