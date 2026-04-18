"use client";

/**
 * useSocket — singleton Socket.io client hook.
 *
 * Usage:
 *   const { socket, connected } = useSocket();
 *
 * The socket is shared across all components and only created once per page load.
 */

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

let globalSocket: Socket | null = null;

export function useSocket() {
    const [connected, setConnected] = useState<boolean>(globalSocket?.connected ?? false);
    const socketRef = useRef<Socket | null>(globalSocket);

    useEffect(() => {
        // Reuse existing socket if already connected
        if (globalSocket && globalSocket.connected) {
            socketRef.current = globalSocket;
            setConnected(true);
            return;
        }

        if (!globalSocket) {
            globalSocket = io({
                path: "/api/socket",
                addTrailingSlash: false,
                transports: ["websocket", "polling"],
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                withCredentials: true,
            });
            socketRef.current = globalSocket;
        }

        const socket = globalSocket;

        const onConnect = () => setConnected(true);
        const onDisconnect = () => setConnected(false);

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        if (!socket.connected) {
            socket.connect();
        } else {
            setConnected(true);
        }

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            // Do NOT disconnect — keep the singleton alive
        };
    }, []);

    return { socket: socketRef.current, connected };
}
