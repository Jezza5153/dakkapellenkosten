/**
 * Media API — GET (list) + POST (upload)
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { desc, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { logAudit } from "@/lib/admin/audit";


export async function GET(request: NextRequest) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));
    const offset = (page - 1) * limit;

    const [countResult] = await db.select({ total: sql<number>`count(*)` })
        .from(schema.media)
        .where(sql`${schema.media.deletedAt} IS NULL`);

    const media = await db.query.media.findMany({
        where: sql`${schema.media.deletedAt} IS NULL`,
        orderBy: [desc(schema.media.createdAt)],
        limit,
        offset,
    });

    return NextResponse.json({
        media,
        pagination: {
            page,
            limit,
            total: Number(countResult.total),
            totalPages: Math.ceil(Number(countResult.total) / limit),
        },
    });
}

export async function POST(request: NextRequest) {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
        return NextResponse.json({ error: "Geen bestand ontvangen" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Alleen afbeeldingen toegestaan" }, { status: 400 });
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: "Bestand te groot (max 10MB)" }, { status: 400 });
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const safeName = file.name
        .replace(/[^a-zA-Z0-9.-]/g, "-")
        .toLowerCase();
    const filename = `${timestamp}-${safeName}`;

    // Save to public/uploads
    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const url = `/uploads/${filename}`;

    // Save to database
    const [mediaItem] = await db.insert(schema.media).values({
        url,
        filename: file.name,
        altText: null,
        mimeType: file.type,
        sizeBytes: file.size,
        uploadedById: authResult.userId,
    }).returning();

    // Audit log
    await logAudit({
        actorId: authResult.userId,
        actorName: authResult.userName,
        action: "upload",
        entityType: "media",
        entityId: mediaItem.id,
        entityTitle: file.name,
    });

    return NextResponse.json({ media: mediaItem }, { status: 201 });
}
