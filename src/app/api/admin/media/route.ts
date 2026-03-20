/**
 * Media API — GET (list) + POST (upload)
 */

import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";
import { desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

async function requireAdmin() {
    const session = await auth();
    if (!session?.user) return null;
    const role = (session.user as any).role;
    if (role !== "admin" && role !== "editor") return null;
    return { userId: (session.user as any).id || session.user.id };
}

export async function GET() {
    const authResult = await requireAdmin();
    if (!authResult) {
        return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const media = await db.query.media.findMany({
        orderBy: [desc(schema.media.createdAt)],
    });

    return NextResponse.json({ media });
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

    return NextResponse.json({ media: mediaItem }, { status: 201 });
}
