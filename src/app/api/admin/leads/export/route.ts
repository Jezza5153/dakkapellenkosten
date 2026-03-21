/**
 * Leads Export API — GET → CSV download
 * With audit logging
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { logAudit } from "@/lib/admin/audit";
import { exportLimiter } from "@/lib/admin/rate-limit";

async function requireAdmin() {
    const session = await auth();
    if (!session?.user) return null;
    const role = (session.user as any).role;
    if (role !== "admin") return null;
    return {
        userId: (session.user as any).id || session.user.id,
        userName: (session.user as any).name || session.user.email || "Onbekend",
    };
}

function escapeCSV(value: string | null | undefined): string {
    if (!value) return "";
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

export async function GET(request: NextRequest) {
    const limited = exportLimiter.check(request);
    if (limited) return limited;

    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const leads = await db.query.leads.findMany({
        orderBy: [desc(schema.leads.createdAt)],
    });

    const headers = [
        "ID", "Naam", "Email", "Telefoon", "Postcode", "Stad",
        "Type", "Breedte", "Materiaal", "Budget Min (€)", "Budget Max (€)",
        "Timeline", "Status", "Matches", "Geaccepteerd",
        "Aangemaakt", "Bijgewerkt",
    ];

    const rows = leads.map(l => [
        l.id,
        escapeCSV(l.naam),
        escapeCSV(l.email),
        escapeCSV(l.telefoon),
        escapeCSV(l.postcode),
        escapeCSV(l.city),
        escapeCSV(l.dakkapelType),
        escapeCSV(l.breedte),
        escapeCSV(l.materiaal),
        l.budgetMinCents ? (l.budgetMinCents / 100).toFixed(2) : "",
        l.budgetMaxCents ? (l.budgetMaxCents / 100).toFixed(2) : "",
        escapeCSV(l.timeline),
        l.status,
        l.matchCount,
        l.acceptCount,
        l.createdAt.toISOString(),
        l.updatedAt.toISOString(),
    ].join(","));

    const csv = [headers.join(","), ...rows].join("\n");

    // Audit log the export
    await logAudit({
        actorId: authResult.userId,
        actorName: authResult.userName,
        action: "export",
        entityType: "lead",
        entityTitle: `CSV export (${leads.length} leads)`,
    });

    return new NextResponse(csv, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="leads-export-${new Date().toISOString().split("T")[0]}.csv"`,
        },
    });
}
