/**
 * Email Verification — GET /api/auth/verify-email?token=xxx
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, and, gte } from "drizzle-orm";

export async function GET(request: NextRequest) {
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
        return NextResponse.redirect(new URL("/login?error=invalid_token", request.url));
    }

    const user = await db.query.users.findFirst({
        where: and(
            eq(schema.users.emailVerifyToken, token),
            gte(schema.users.emailVerifyTokenExpiry, new Date()),
        ),
    });

    if (!user) {
        return NextResponse.redirect(new URL("/login?error=invalid_token", request.url));
    }

    await db.update(schema.users).set({
        emailVerified: new Date(),
        emailVerifyToken: null,
        emailVerifyTokenExpiry: null,
        updatedAt: new Date(),
    }).where(eq(schema.users.id, user.id));

    return NextResponse.redirect(new URL("/login?verified=true", request.url));
}
