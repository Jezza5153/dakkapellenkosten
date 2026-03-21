/**
 * Parse and upsert all 20 geo-pages from the Jeremy-style text file
 * Converts markdown content to HTML and upserts into pages table
 * Usage: npx dotenv -e .env.local -- npx tsx scripts/upsert-all-geo-pages.ts
 */

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../src/db/schema";
import { eq } from "drizzle-orm";
import * as fs from "fs";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

// Simple markdown to HTML converter for the geo-page content
function mdToHtml(md: string): string {
    let html = md
        // H3 before H2
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        // Bold
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // List items
        .replace(/^- (.+)$/gm, '<li>$1</li>');

    // Wrap consecutive <li> in <ul>
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>\n$1</ul>\n');

    // Wrap remaining lines in <p> (skip h2, h3, ul, li, empty)
    html = html.split('\n').map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('<h2') || trimmed.startsWith('<h3') ||
            trimmed.startsWith('<ul') || trimmed.startsWith('</ul') ||
            trimmed.startsWith('<li')) return line;
        return `<p>${trimmed}</p>`;
    }).filter(l => l).join('\n');

    return html;
}

// Parse the text file
function parseGeoFile(filepath: string) {
    const raw = fs.readFileSync(filepath, 'utf-8');
    const pages: any[] = [];

    // Split by page markers
    const pageBlocks = raw.split(/^=====\s+PAGE\s+\d+:.+?=====$/m).filter(b => b.trim());

    for (const block of pageBlocks) {
        if (block.includes('Aantal pagina')) continue; // skip header

        const lines = block.trim().split('\n');
        const data: any = {};

        let contentStart = -1;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith('Title: ')) data.title = line.replace('Title: ', '').trim();
            else if (line.startsWith('Slug: ')) data.slug = line.replace('Slug: ', '').trim();
            else if (line.startsWith('City: ')) data.city = line.replace('City: ', '').trim();
            else if (line.startsWith('Service: ')) data.service = line.replace('Service: ', '').trim();
            else if (line.startsWith('SEO Title: ')) data.seoTitle = line.replace('SEO Title: ', '').trim();
            else if (line.startsWith('SEO Description: ')) data.seoDescription = line.replace('SEO Description: ', '').trim();
            else if (line.startsWith('Content:')) {
                contentStart = i + 1;
                break;
            }
        }

        if (contentStart > 0 && data.slug) {
            const contentMd = lines.slice(contentStart).join('\n').trim();
            data.content = mdToHtml(contentMd);
            pages.push(data);
        }
    }

    return pages;
}

async function main() {
    const pages = parseGeoFile('./scripts/geo-pages-full.txt');
    console.log(`Parsed ${pages.length} geo-pages from file\n`);

    let inserted = 0;
    let updated = 0;

    for (const page of pages) {
        // Check if exists
        const existing = await db.query.pages.findFirst({
            where: eq(schema.pages.slug, page.slug),
            columns: { id: true },
        });

        if (existing) {
            // Update with Jeremy-style content
            await db.update(schema.pages)
                .set({
                    title: page.title,
                    content: page.content,
                    seoTitle: page.seoTitle,
                    seoDescription: page.seoDescription,
                    updatedAt: new Date(),
                })
                .where(eq(schema.pages.slug, page.slug));
            console.log(`🔄 Updated: ${page.city} — /${page.slug}`);
            updated++;
        } else {
            // Insert new
            await db.insert(schema.pages).values({
                title: page.title,
                slug: page.slug,
                city: page.city,
                service: page.service,
                seoTitle: page.seoTitle,
                seoDescription: page.seoDescription,
                content: page.content,
                status: "published",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log(`✅ Inserted: ${page.city} — /${page.slug}`);
            inserted++;
        }
    }

    console.log(`\nDone! ${inserted} inserted, ${updated} updated.`);
}

main().catch(console.error);
