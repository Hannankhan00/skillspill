/**
 * Utility to access the Socket.io server instance from API routes.
 * The server.ts custom server sets `global.io` after initialization.
 */
import { Server as SocketIOServer } from "socket.io";

export function getIO(): SocketIOServer | null {
    const g = global as unknown as Record<string, unknown>;
    return (g.io as SocketIOServer) ?? null;
}
