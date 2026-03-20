/**
 * Service Areas API — GET/POST/DELETE /api/company/service-areas
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@/db";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

// GET — list service areas
export async function GET() {
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

        const areas = await db.query.serviceAreas.findMany({
            where: eq(schema.serviceAreas.companyId, membership.companyId),
        });

        return NextResponse.json({ areas });
    } catch (error) {
        console.error("[service-areas] GET error:", error);
        return NextResponse.json({ error: "Er is iets misgegaan" }, { status: 500 });
    }
}

// POST — add service area
const addSchema = z.object({
    postalCodePrefix: z.string().min(2).max(4),
    city: z.string().max(100).optional(),
    province: z.string().max(50).optional(),
});

export async function POST(request: NextRequest) {
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
        const parsed = addSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ error: "Validatie mislukt" }, { status: 400 });
        }

        const [area] = await db.insert(schema.serviceAreas).values({
            companyId: membership.companyId,
            ...parsed.data,
        }).returning();

        return NextResponse.json({ area }, { status: 201 });
    } catch (error) {
        console.error("[service-areas] POST error:", error);
        return NextResponse.json({ error: "Er is iets misgegaan" }, { status: 500 });
    }
}

// DELETE — remove service area
export async function DELETE(request: NextRequest) {
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

        const { id } = await request.json();

        await db.delete(schema.serviceAreas).where(
            and(
                eq(schema.serviceAreas.id, id),
                eq(schema.serviceAreas.companyId, membership.companyId),
            )
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[service-areas] DELETE error:", error);
        return NextResponse.json({ error: "Er is iets misgegaan" }, { status: 500 });
    }
}
