/**
 * Middleware — Auth Protection + Redirect Handling
 * Protects /admin and /dashboard routes.
 * Checks redirects table directly (no self-fetch).
 */

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Auth check for protected routes (using JWT — Edge-compatible)
    if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if (!token) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin/:path*",
    ],
};

