/**
 * Company Profile API — GET/PUT /api/company/profile
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

// GET — fetch company profile
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
        }

        const membership = await db.query.companyMembers.findFirst({
            where: eq(schema.companyMembers.userId, session.user.id),
            with: {
                company: {
                    with: {
                        photos: true,
                        serviceAreas: true,
                        subscription: true,
                        creditBalance: true,
                    },
                },
            },
        });

        if (!membership?.company) {
            return NextResponse.json({ error: "Geen bedrijf gevonden" }, { status: 404 });
        }

        return NextResponse.json({ company: membership.company });
    } catch (error) {
        console.error("[company/profile] GET error:", error);
        return NextResponse.json({ error: "Er is iets misgegaan" }, { status: 500 });
    }
}

// PUT — update company profile
const updateSchema = z.object({
    name: z.string().min(2).max(255).optional(),
    description: z.string().max(2000).optional(),
    phone: z.string().max(30).optional(),
    email: z.string().email().optional(),
    website: z.string().max(255).optional(),
    address: z.string().max(500).optional(),
    city: z.string().max(100).optional(),
    postalCode: z.string().max(10).optional(),
    kvkNumber: z.string().max(20).optional(),
    serviceRadiusKm: z.number().min(5).max(200).optional(),
    specialisaties: z.array(z.string()).optional(),
    materialen: z.array(z.string()).optional(),
    certificeringen: z.array(z.string()).optional(),
    garantieTermijn: z.string().max(100).optional(),
    foundedYear: z.number().min(1900).max(2030).optional(),
    instagramUrl: z.string().max(255).optional(),
    facebookUrl: z.string().max(255).optional(),
});

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
        }

        const membership = await db.query.companyMembers.findFirst({
            where: eq(schema.companyMembers.userId, session.user.id),
        });

        if (!membership) {
            return NextResponse.json({ error: "Geen bedrijf gevonden" }, { status: 404 });
        }

        const body = await request.json();
        const parsed = updateSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: "Validatie mislukt", details: parsed.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const updateData: Record<string, any> = { ...parsed.data, updatedAt: new Date() };

        // Calculate years of experience from foundedYear
        if (parsed.data.foundedYear) {
            updateData.yearsExperience = new Date().getFullYear() - parsed.data.foundedYear;
        }

        const [updated] = await db.update(schema.companies)
            .set(updateData)
            .where(eq(schema.companies.id, membership.companyId))
            .returning();

        return NextResponse.json({ company: updated });
    } catch (error) {
        console.error("[company/profile] PUT error:", error);
        return NextResponse.json({ error: "Er is iets misgegaan" }, { status: 500 });
    }
}
