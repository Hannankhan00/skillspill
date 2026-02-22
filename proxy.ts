import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "your-jwt-secret");

// 1. Define protected routes and public routes
const protectedRoutes = ["/dashboard", "/admin"];
const publicRoutes = ["/login", "/signup", "/"];

export default async function proxy(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname;
    const isProtected = protectedRoutes.some((route) => path.startsWith(route));
    const isPublic = publicRoutes.some((route) => path === route || path.startsWith("/signup"));
    const isSuspendedRoute = path.startsWith("/suspended");

    // 3. Decrypt the session from the cookie
    const cookie = req.cookies.get("session")?.value;
    let session = null;

    if (cookie) {
        try {
            const { payload } = await jwtVerify(cookie, SECRET_KEY, {
                algorithms: ["HS256"],
            });
            session = payload;
        } catch (error) {
            console.error("Session verification failed:", error);
        }
    }

    // 4. Redirect to /login if the user is not authenticated on a protected route
    if (isProtected && !session) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    // 5. If on /suspended without a session, redirect to login
    if (isSuspendedRoute && !session) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    // 6. Check suspension status for authenticated users on protected or suspended routes
    if (session && (isProtected || isSuspendedRoute)) {
        try {
            const baseUrl = req.nextUrl.origin;
            const checkRes = await fetch(`${baseUrl}/api/auth/suspension-check`, {
                headers: {
                    Cookie: `session=${cookie}`,
                },
            });

            if (checkRes.ok) {
                const data = await checkRes.json();

                if (data.suspended) {
                    // User IS suspended — redirect away from protected routes to /suspended
                    if (isProtected) {
                        return NextResponse.redirect(new URL("/suspended", req.nextUrl));
                    }
                    // Already on /suspended — allow through
                } else {
                    // User is NOT suspended — if on /suspended, redirect to dashboard
                    if (isSuspendedRoute) {
                        if (session.role === "TALENT") {
                            return NextResponse.redirect(new URL("/dashboard/talent", req.nextUrl));
                        } else if (session.role === "RECRUITER") {
                            return NextResponse.redirect(new URL("/dashboard/recruiter", req.nextUrl));
                        } else if (session.role === "ADMIN") {
                            return NextResponse.redirect(new URL("/admin", req.nextUrl));
                        }
                        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
                    }
                }
            }
        } catch (error) {
            console.error("Suspension check failed:", error);
            // On error, allow access (don't lock users out due to transient errors)
        }
    }

    // 7. Redirect to /dashboard if the user is authenticated on a public route
    if (isPublic && session && path !== "/") {
        // Redirect based on role if possible, otherwise default dashboard
        if (session.role === "TALENT") {
            return NextResponse.redirect(new URL("/dashboard/talent", req.nextUrl));
        } else if (session.role === "RECRUITER") {
            return NextResponse.redirect(new URL("/dashboard/recruiter", req.nextUrl));
        }
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    return NextResponse.next();
}

// 8. Routes proxy should not run on (api routes excluded to prevent infinite loops)
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
