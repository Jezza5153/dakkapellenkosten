/**
 * Redirect Check API — lightweight, edge-compatible
 * Called by middleware to check for redirects
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");
    if (!path) return NextResponse.json({});

    const redirect = await db.query.redirects.findFirst({
        where: eq(schema.redirects.fromPath, path),
    });

    if (!redirect) return NextResponse.json({});

    // Increment hit counter (fire-and-forget)
    db.update(schema.redirects)
        .set({ hitCount: sql`${schema.redirects.hitCount} + 1` })
        .where(eq(schema.redirects.id, redirect.id))
        .then(() => {})
        .catch(() => {});

    return NextResponse.json({
        redirect: {
            toPath: redirect.toPath,
            statusCode: redirect.statusCode,
        },
    });
}
