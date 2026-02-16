import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "your-jwt-secret");

// 1. Define protected routes and public routes
const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/signup", "/"];

export async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname;
    const isProtected = protectedRoutes.some((route) => path.startsWith(route));
    const isPublic = publicRoutes.some((route) => path === route || path.startsWith("/signup"));

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

    // 5. Redirect to /dashboard if the user is authenticated on a public route
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

// 6. Routes Middleware should not run on
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
