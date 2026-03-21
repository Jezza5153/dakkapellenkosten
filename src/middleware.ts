/**
 * Middleware — Auth Protection + Redirect Handling
 * Protects /admin routes and checks redirects table
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check for redirects (public pages only, not admin/api)
    if (!pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
        try {
            // Use edge-compatible fetch to check redirects
            const redirectUrl = new URL("/api/redirects/check", request.url);
            redirectUrl.searchParams.set("path", pathname);
            const res = await fetch(redirectUrl, { method: "GET" });
            if (res.ok) {
                const data = await res.json();
                if (data.redirect) {
                    const destination = new URL(data.redirect.toPath, request.url);
                    return NextResponse.redirect(destination, data.redirect.statusCode || 301);
                }
            }
        } catch {
            // Silently ignore redirect check failures — don't block the request
        }
    }

    // Auth check for protected routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
        const session = await (auth as any)(request);
        if (!session) {
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
        "/dakkapel/:path*",
        "/kenniscentrum/:path*",
    ],
};
