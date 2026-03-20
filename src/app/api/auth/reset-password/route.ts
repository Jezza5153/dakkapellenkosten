/**
 * Reset Password — POST /api/auth/reset-password
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, and, gte } from "drizzle-orm";
import { hash } from "bcryptjs";
import { z } from "zod";

const resetSchema = z.object({
    token: z.string().min(1),
    password: z.string().min(8, "Wachtwoord moet minimaal 8 tekens zijn"),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = resetSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Ongeldige invoer" }, { status: 400 });
        }

        const user = await db.query.users.findFirst({
            where: and(
                eq(schema.users.resetToken, parsed.data.token),
                gte(schema.users.resetTokenExpiry, new Date()),
            ),
        });

        if (!user) {
            return NextResponse.json({ error: "Ongeldige of verlopen reset-link" }, { status: 400 });
        }

        const passwordHash = await hash(parsed.data.password, 12);

        await db.update(schema.users).set({
            passwordHash,
            resetToken: null,
            resetTokenExpiry: null,
            updatedAt: new Date(),
        }).where(eq(schema.users.id, user.id));

        return NextResponse.json({
            success: true,
            message: "Wachtwoord is gewijzigd. Je kunt nu inloggen.",
        });
    } catch (error) {
        console.error("[reset-password] Error:", error);
        return NextResponse.json({ error: "Er is iets misgegaan" }, { status: 500 });
    }
}
