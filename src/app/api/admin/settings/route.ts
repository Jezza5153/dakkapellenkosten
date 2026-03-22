/**
 * Settings API — GET all settings, PATCH update a setting
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/auth";
import { logAudit } from "@/lib/admin/audit";

const DEFAULT_SETTINGS: Record<string, unknown> = {
    "site.name": "DakkapellenKosten.nl",
    "site.url": "https://dakkapellenkosten.nl",
    "site.language": "nl",
    "seo.defaultOgImage": "",
    "seo.siteDescription": "Vergelijk dakkapel prijzen en vind de beste specialist bij u in de buurt.",
    "seo.googleAnalyticsId": "",
    "seo.googleSearchConsoleId": "",
    "leads.autoExpireDays": 14,
    "leads.maxMatchesPerLead": 3,
    "leads.notificationEmails": "",
    "content.defaultCategory": "kosten",
    "content.defaultAuthor": "",
    "notifications.leadsEmail": "",
    "notifications.matchEmail": "",
    "notifications.adminAlerts": true,
    "notifications.dailyDigest": false,
    "system.trashRetentionDays": 30,
    "system.cronSecret": "",
    "system.maintenanceMode": false,
};


export async function GET(request: NextRequest) {
    const authResult = await requireAdmin();
    if (!authResult) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

    const rows = await db.query.settings.findMany();
    const settings: Record<string, unknown> = { ...DEFAULT_SETTINGS };

    for (const row of rows) {
        settings[row.key] = row.value;
    }

    return NextResponse.json({ settings });
}

export async function PATCH(request: NextRequest) {
    const authResult = await requireAdmin();
    if (!authResult) return NextResponse.json({ error: "Geen toegang" }, { status: 403 });

    const body = await request.json();
    const { key, value } = body;

    if (!key || typeof key !== "string") {
        return NextResponse.json({ error: "Key is verplicht" }, { status: 400 });
    }

    // Upsert
    const existing = await db.query.settings.findFirst({
        where: eq(schema.settings.key, key),
    });

    if (existing) {
        await db.update(schema.settings)
            .set({
                value: value,
                updatedBy: authResult.userId,
                updatedAt: new Date(),
            })
            .where(eq(schema.settings.key, key));
    } else {
        await db.insert(schema.settings).values({
            key,
            value,
            updatedBy: authResult.userId,
        });
    }

    await logAudit({
        actorId: authResult.userId,
        actorName: authResult.userName,
        action: "update",
        entityType: "settings",
        entityTitle: key,
        diff: { [key]: { old: existing?.value ?? null, new: value } },
    });

    return NextResponse.json({ success: true });
}
