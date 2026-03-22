/**
 * Auth Helpers — Server-side role enforcement
 * Import requireAdmin or requireRole in every admin API route.
 */

import { auth } from "@/lib/auth";

export interface AdminSession {
    userId: string;
    userName: string;
    role: "admin" | "editor" | "company";
}

/**
 * Require an authenticated user with one of the specified roles.
 * Throws an object with { status, message } if auth fails.
 */
export async function requireRole(
    allowedRoles: Array<"admin" | "editor" | "company"> = ["admin"]
): Promise<AdminSession> {
    const session = await auth();

    if (!session?.user) {
        throw { status: 401, message: "Niet ingelogd" };
    }

    const user = session.user as any;
    const role = user.role || "company";

    if (!allowedRoles.includes(role)) {
        throw { status: 403, message: "Geen toegang" };
    }

    return {
        userId: user.id,
        userName: user.name || user.email || "Onbekend",
        role,
    };
}

/**
 * Backward-compatible admin auth check.
 * Returns { userId, userName, role } or null (does NOT throw).
 * Use this in admin API routes that check `if (!admin) return 403`.
 */
export async function requireAdmin(): Promise<AdminSession | null> {
    try {
        return await requireRole(["admin", "editor"]);
    } catch {
        return null;
    }
}

/**
 * Try to get admin session. Returns null if not authenticated.
 * Does NOT throw — use for optional auth checks.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
    try {
        return await requireRole(["admin", "editor"]);
    } catch {
        return null;
    }
}

