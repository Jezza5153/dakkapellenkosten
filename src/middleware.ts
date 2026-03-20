/**
 * Middleware — Auth Protection
 * Protects /dashboard and /admin routes
 */

export { auth as middleware } from "@/lib/auth";

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};
