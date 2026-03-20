/**
 * Content Migration — Import 70 HTML articles into the CMS database
 * Extracts title, slug, excerpt, content, category, SEO fields from each HTML file
 * 
 * Usage: npx dotenv -e .env.local -- npx tsx scripts/migrate-articles.ts
 */

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../src/db/schema";
import * as fs from "fs";
import * as path from "path";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

const KENNISCENTRUM_DIR = path.join(__dirname, "..", "kenniscentrum");

// Skip these — they are category hub pages, not articles
const SKIP_DIRS = new Set(["kosten", "materialen", "vergunning", "plaatsing", "onderhoud", "bespaartips"]);

function extractBetween(html: string, startTag: string, endTag: string): string {
    const startIdx = html.indexOf(startTag);
    if (startIdx === -1) return "";
    const contentStart = startIdx + startTag.length;
    const endIdx = html.indexOf(endTag, contentStart);
    if (endIdx === -1) return "";
    return html.substring(contentStart, endIdx).trim();
}

function extractMeta(html: string, name: string): string {
    // Match both name= and property= attributes
    const regex = new RegExp(`<meta\\s+(?:name|property)=["']${name}["']\\s+content=["']([^"']*)["']`, "i");
    const match = html.match(regex);
    if (match) return match[1];
    // Try reversed attribute order
    const regex2 = new RegExp(`<meta\\s+content=["']([^"']*)["']\\s+(?:name|property)=["']${name}["']`, "i");
    const match2 = html.match(regex2);
    return match2 ? match2[1] : "";
}

function extractCanonical(html: string): string {
    const match = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
    return match ? match[1] : "";
}

function extractTitle(html: string): string {
    const match = html.match(/<title>([^<]+)<\/title>/i);
    return match ? match[1].trim() : "";
}

function extractArticleContent(html: string): string {
    // Extract everything inside <article class="article-body" ...> ... </article>
    const articleMatch = html.match(/<article[^>]*class=["'][^"']*article-body[^"']*["'][^>]*>([\s\S]*?)<\/article>/i);
    if (!articleMatch) return "";
    
    let content = articleMatch[1];
    
    // Remove table of contents and editorial note divs
    content = content.replace(/<div\s+class=["']article-toc["'][\s\S]*?<\/div>/gi, "");
    content = content.replace(/<div\s+class=["']editorial-note["'][\s\S]*?<\/div>/gi, "");
    // Remove CTA blocks
    content = content.replace(/<div\s+class=["']article-cta["'][\s\S]*?<\/div>/gi, "");
    
    return content.trim();
}

function extractCategory(html: string): string {
    const match = html.match(/<span\s+class=["'][^"']*badge[^"']*["'][^>]*>([^<]+)<\/span>/i);
    return match ? match[1].trim() : "";
}

function extractExcerpt(html: string, metaDesc: string): string {
    if (metaDesc) return metaDesc;
    // Fallback: get first <p> from article body
    const content = extractArticleContent(html);
    const pMatch = content.match(/<p>([^<]+)<\/p>/i);
    return pMatch ? pMatch[1].substring(0, 300) : "";
}

function extractDatePublished(html: string): string | null {
    const match = html.match(/"datePublished"\s*:\s*"([^"]+)"/);
    return match ? match[1] : null;
}

async function main() {
    console.log("🔄 Starting article migration...\n");

    const dirs = fs.readdirSync(KENNISCENTRUM_DIR).filter(d => {
        const fullPath = path.join(KENNISCENTRUM_DIR, d);
        return fs.statSync(fullPath).isDirectory() 
            && !SKIP_DIRS.has(d) 
            && fs.existsSync(path.join(fullPath, "index.html"));
    });

    console.log(`Found ${dirs.length} article directories\n`);

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const dir of dirs) {
        const htmlPath = path.join(KENNISCENTRUM_DIR, dir, "index.html");
        const html = fs.readFileSync(htmlPath, "utf-8");

        const title = extractTitle(html).replace(/ \| DakkapellenKosten\.nl$/i, "").trim();
        const slug = dir; // directory name = slug
        const metaDesc = extractMeta(html, "description");
        const excerpt = extractExcerpt(html, metaDesc);
        const content = extractArticleContent(html);
        const category = extractCategory(html);
        const seoTitle = title;
        const seoDescription = metaDesc;
        const canonicalUrl = extractCanonical(html);
        const datePublished = extractDatePublished(html);

        if (!title || !content) {
            console.log(`  ⚠️  SKIP: ${dir} — missing title or content`);
            skipped++;
            continue;
        }

        try {
            await db.insert(schema.articles).values({
                title,
                slug,
                excerpt,
                content,
                category: category || null,
                seoTitle,
                seoDescription,
                canonicalUrl: canonicalUrl || null,
                status: "published",
                publishedAt: datePublished ? new Date(datePublished) : new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            }).onConflictDoNothing();

            console.log(`  ✅  ${slug} — "${title.substring(0, 60)}..."`);
            imported++;
        } catch (err: any) {
            console.log(`  ❌  ${slug} — ${err.message?.substring(0, 80)}`);
            errors++;
        }
    }

    console.log(`\n📊 Migration complete:`);
    console.log(`   ✅ Imported: ${imported}`);
    console.log(`   ⚠️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors:   ${errors}`);
    console.log(`   📝 Total:    ${dirs.length}`);
}

main().catch(console.error);
