/**
 * Auth: Signup — POST /api/auth/signup
 * Creates a new company account
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { randomBytes } from "crypto";
import { z } from "zod";
import { sendVerificationEmail } from "@/lib/email";

const signupSchema = z.object({
    name: z.string().min(2, "Naam is verplicht").max(255),
    email: z.string().email("Ongeldig e-mailadres"),
    password: z.string().min(8, "Wachtwoord moet minimaal 8 tekens zijn"),
    companyName: z.string().min(2, "Bedrijfsnaam is verplicht").max(255),
    phone: z.string().min(8).max(30).optional(),
    city: z.string().max(100).optional(),
    postalCode: z.string().max(10).optional(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = signupSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validatie mislukt", details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const data = parsed.data;
        const email = data.email.toLowerCase();

        // Check if email already exists
        const existing = await db.query.users.findFirst({
            where: eq(schema.users.email, email),
        });

        if (existing) {
            return NextResponse.json(
                { error: "Er bestaat al een account met dit e-mailadres" },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await hash(data.password, 12);

        // Create verification token
        const emailVerifyToken = randomBytes(32).toString("hex");
        const emailVerifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        // Create user
        const [user] = await db.insert(schema.users).values({
            email,
            name: data.name,
            passwordHash,
            role: "company",
            emailVerifyToken,
            emailVerifyTokenExpiry,
        }).returning();

        // Create company
        const slug = data.companyName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        const [company] = await db.insert(schema.companies).values({
            name: data.companyName,
            slug: `${slug}-${randomBytes(3).toString("hex")}`,
            phone: data.phone,
            city: data.city,
            postalCode: data.postalCode,
            email,
        }).returning();

        // Link user to company as owner
        await db.insert(schema.companyMembers).values({
            companyId: company.id,
            userId: user.id,
            role: "owner",
        });

        // Create initial credit balance
        await db.insert(schema.creditBalances).values({
            companyId: company.id,
            balance: 0,
            totalPurchased: 0,
            totalSpent: 0,
        });

        // Send verification email
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const verifyUrl = `${appUrl}/api/auth/verify-email?token=${emailVerifyToken}`;

        await sendVerificationEmail({
            to: email,
            name: data.name,
            verifyUrl,
        }).catch(err => console.error("[signup] Verification email failed:", err));

        return NextResponse.json({
            success: true,
            message: "Account aangemaakt! Check je e-mail om je account te verifiëren.",
        }, { status: 201 });

    } catch (error) {
        console.error("[signup] Error:", error);
        return NextResponse.json({ error: "Er is iets misgegaan" }, { status: 500 });
    }
}
