/**
 * Password Reset — POST /api/auth/forgot-password
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "E-mail is verplicht" }, { status: 400 });
        }

        // Always return success (don't leak whether email exists)
        const user = await db.query.users.findFirst({
            where: eq(schema.users.email, email.toLowerCase()),
        });

        if (user) {
            const resetToken = randomBytes(32).toString("hex");
            const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

            await db.update(schema.users).set({
                resetToken,
                resetTokenExpiry,
                updatedAt: new Date(),
            }).where(eq(schema.users.id, user.id));

            const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

            await sendPasswordResetEmail({
                to: user.email,
                name: user.name,
                resetUrl: `${appUrl}/reset-password?token=${resetToken}`,
            }).catch(err => console.error("[forgot-password] Email failed:", err));
        }

        return NextResponse.json({
            success: true,
            message: "Als dit e-mailadres bij ons bekend is, ontvang je een reset-link.",
        });
    } catch (error) {
        console.error("[forgot-password] Error:", error);
        return NextResponse.json({ error: "Er is iets misgegaan" }, { status: 500 });
    }
}
