/**
 * Public Settings API — GET /api/settings/tracking
 * Returns tracking IDs (GA4, etc.) for the frontend script loader.
 * No authentication required — only exposes non-sensitive tracking config.
 */

import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

// Cache for 5 minutes to avoid hitting the DB on every page load
const CACHE_TTL = 5 * 60; // seconds

export async function GET() {
    try {
        const trackingKeys = [
            "seo.googleAnalyticsId",
            "seo.googleSearchConsoleId",
        ];

        const results = await db.query.settings.findMany({
            where: (s, { inArray }) => inArray(s.key, trackingKeys),
            columns: { key: true, value: true },
        });

        const tracking: Record<string, string> = {};
        for (const row of results) {
            if (row.value && typeof row.value === "string" && row.value.trim()) {
                tracking[row.key] = row.value;
            }
        }

        return NextResponse.json({ tracking }, {
            headers: {
                "Cache-Control": `public, s-maxage=${CACHE_TTL}, stale-while-revalidate=${CACHE_TTL * 2}`,
            },
        });
    } catch (error) {
        console.error("[settings/tracking] Error:", error);
        return NextResponse.json({ tracking: {} });
    }
}
