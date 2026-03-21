/**
 * Export all SEO data from the database into a readable file for the SEO team
 * Usage: npx dotenv -e .env.local -- npx tsx scripts/export-seo-data.ts
 */

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../src/db/schema";
import { eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

async function main() {
    // Fetch all articles
    const articles = await db.query.articles.findMany({
        where: eq(schema.articles.status, "published"),
        orderBy: (a, { asc }) => [asc(a.category), asc(a.title)],
    });

    // Fetch all pages
    const pages = await db.query.pages.findMany({
        orderBy: (p, { asc }) => [asc(p.slug)],
    });

    let output = "";

    // ==========================================
    // HEADER
    // ==========================================
    output += `# DakkapellenKosten.nl — SEO & Content Referentie\n\n`;
    output += `**Gegenereerd:** ${new Date().toLocaleDateString("nl-NL", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}\n`;
    output += `**Live URL:** https://dakkapellenkosten.vercel.app\n`;
    output += `**Productie URL:** https://dakkapellenkosten.nl (DNS nog niet actief)\n\n`;
    output += `---\n\n`;

    // ==========================================
    // HOMEPAGE
    // ==========================================
    output += `## 1. Homepage SEO\n\n`;
    output += `| Veld | Waarde |\n|------|--------|\n`;
    output += `| **URL** | \`/\` |\n`;
    output += `| **Title** | Dakkapel offertes vergelijken in 2026 \\| Gratis & vrijblijvend |\n`;
    output += `| **Meta description** | Vergelijk gratis dakkapel offertes van betrouwbare specialisten. Ontvang binnen 48 uur tot 4 vrijblijvende offertes en bespaar tot 35% op je dakkapel. |\n`;
    output += `| **Canonical** | https://dakkapellenkosten.nl/ |\n`;
    output += `| **lang** | nl |\n`;
    output += `| **JSON-LD** | ❌ Nog toe te voegen (Organization, FAQPage, WebSite) |\n`;
    output += `| **OG tags** | ❌ Nog toe te voegen |\n`;
    output += `| **Twitter card** | ❌ Nog toe te voegen |\n\n`;

    // ==========================================
    // KENNISCENTRUM INDEX
    // ==========================================
    output += `## 2. Kenniscentrum Index\n\n`;
    output += `| Veld | Waarde |\n|------|--------|\n`;
    output += `| **URL** | \`/kenniscentrum\` |\n`;
    output += `| **Title** | Kenniscentrum — DakkapellenKosten.nl |\n`;
    output += `| **Meta description** | Alles over dakkapellen: kosten, vergunningen, materialen en meer. |\n\n`;

    // ==========================================
    // ARTICLES
    // ==========================================
    output += `## 3. Artikelen (${articles.length} gepubliceerd)\n\n`;

    // Group by category
    const categories: Record<string, typeof articles> = {};
    for (const a of articles) {
        const cat = a.category || "Overig";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(a);
    }

    for (const [category, catArticles] of Object.entries(categories).sort()) {
        output += `### 📂 ${category} (${catArticles.length} artikelen)\n\n`;

        for (const a of catArticles) {
            output += `#### ${a.title}\n\n`;
            output += `| Veld | Waarde |\n|------|--------|\n`;
            output += `| **Slug** | \`${a.slug}\` |\n`;
            output += `| **URL** | \`/kenniscentrum/${a.slug}\` |\n`;
            output += `| **SEO Title** | ${a.seoTitle || "⚠️ Niet ingesteld — valt terug op article title"} |\n`;
            output += `| **SEO Description** | ${a.seoDescription ? a.seoDescription.substring(0, 160) : "⚠️ Niet ingesteld"} |\n`;
            output += `| **Canonical URL** | ${a.canonicalUrl || "⚠️ Niet ingesteld"} |\n`;
            output += `| **Categorie** | ${a.category || "Geen"} |\n`;
            output += `| **Gepubliceerd** | ${a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("nl-NL") : "Onbekend"} |\n`;
            output += `| **Excerpt** | ${a.excerpt ? a.excerpt.substring(0, 120) + "..." : "⚠️ Geen"} |\n`;
            output += `| **Content lengte** | ${a.content ? a.content.length : 0} karakters |\n\n`;
        }
    }

    // ==========================================
    // GEO-PAGES
    // ==========================================
    output += `## 4. Geo-Pages / SEO Landing Pages (${pages.length} aangemaakt)\n\n`;

    if (pages.length === 0) {
        output += `> **Geen geo-pages aangemaakt.** Gebruik het admin panel op \`/admin/pages\` om stad-specifieke landingspagina's aan te maken.\n\n`;
        output += `### Aanbevolen geo-pages om te maken\n\n`;
        output += `| Stad | Aanbevolen slug | Geschat zoekvolume |\n|------|-----------------|--------------------|\n`;
        const cities = [
            ["Amsterdam", "dakkapel-amsterdam", "320/mnd"],
            ["Rotterdam", "dakkapel-rotterdam", "260/mnd"],
            ["Utrecht", "dakkapel-utrecht", "210/mnd"],
            ["Den Haag", "dakkapel-den-haag", "190/mnd"],
            ["Eindhoven", "dakkapel-eindhoven", "140/mnd"],
            ["Groningen", "dakkapel-groningen", "110/mnd"],
            ["Tilburg", "dakkapel-tilburg", "90/mnd"],
            ["Almere", "dakkapel-almere", "90/mnd"],
            ["Breda", "dakkapel-breda", "80/mnd"],
            ["Nijmegen", "dakkapel-nijmegen", "70/mnd"],
            ["Haarlem", "dakkapel-haarlem", "70/mnd"],
            ["Amersfoort", "dakkapel-amersfoort", "60/mnd"],
            ["Arnhem", "dakkapel-arnhem", "60/mnd"],
            ["Leiden", "dakkapel-leiden", "50/mnd"],
            ["Dordrecht", "dakkapel-dordrecht", "40/mnd"],
            ["Zwolle", "dakkapel-zwolle", "40/mnd"],
            ["Ede", "dakkapel-ede", "40/mnd"],
            ["Zoetermeer", "dakkapel-zoetermeer", "40/mnd"],
            ["Apeldoorn", "dakkapel-apeldoorn", "50/mnd"],
            ["Zaanstad", "dakkapel-zaanstad", "50/mnd"],
        ];
        for (const [city, slug, vol] of cities) {
            output += `| ${city} | \`${slug}\` | ${vol} |\n`;
        }
        output += `\n`;

        output += `### Velden per geo-page (in admin panel)\n\n`;
        output += `| Veld | Beschrijving | Voorbeeld |\n|------|-------------|----------|\n`;
        output += `| **Title** | H1 op de pagina | Dakkapel plaatsen in Amsterdam |\n`;
        output += `| **Slug** | URL path | dakkapel-amsterdam |\n`;
        output += `| **City** | Stad voor lokale targeting | Amsterdam |\n`;
        output += `| **Service** | Type dienst | dakkapel |\n`;
        output += `| **SEO Title** | Title tag (max 60 tekens) | Dakkapel Amsterdam — Prijzen & Offertes 2026 |\n`;
        output += `| **SEO Description** | Meta description (max 155 tekens) | Vergelijk gratis dakkapel offertes in Amsterdam... |\n`;
        output += `| **Content** | Unieke content (min 500 woorden) | Lokale prijzen, gemeente regels, etc. |\n`;
        output += `| **Status** | published / draft | published |\n\n`;
    } else {
        output += `| Slug | Stad | Service | SEO Title | Status |\n|------|------|---------|-----------|--------|\n`;
        for (const p of pages) {
            output += `| \`${p.slug}\` | ${p.city || "—"} | ${p.service || "—"} | ${p.seoTitle || "⚠️"} | ${p.status} |\n`;
        }
        output += `\n`;
    }

    // ==========================================
    // SITEMAP
    // ==========================================
    output += `## 5. Sitemap (\`/sitemap.xml\`)\n\n`;
    output += `De sitemap wordt automatisch gegenereerd uit de database:\n\n`;
    output += `| Bron | Aantal | Priority | Frequency |\n|------|--------|----------|-----------|\n`;
    output += `| Homepage | 1 | 1.0 | weekly |\n`;
    output += `| Artikelen | ${articles.length} | 0.7 | monthly |\n`;
    output += `| Geo-pages | ${pages.filter(p => p.status === "published").length} | 0.8 | monthly |\n\n`;

    // ==========================================
    // TODO LIST
    // ==========================================
    output += `## 6. SEO Team To-Do's\n\n`;
    output += `### Per artikel controleren\n\n`;
    output += `- [ ] Is de **SEO Title** uniek en bevat het primaire keyword? (max 60 tekens)\n`;
    output += `- [ ] Is de **SEO Description** uniek en compelling? (max 155 tekens)\n`;
    output += `- [ ] Is de **Canonical URL** correct ingesteld?\n`;
    output += `- [ ] Bevat het artikel **interne links** naar gerelateerde artikelen?\n`;
    output += `- [ ] Is de **categorie** correct?\n`;
    output += `- [ ] Is de content **minimaal 500 woorden**?\n\n`;

    output += `### Geo-pages opzetten\n\n`;
    output += `- [ ] Eerste 5 steden aanmaken (Amsterdam, Rotterdam, Utrecht, Den Haag, Eindhoven)\n`;
    output += `- [ ] Per stad: unieke content schrijven (geen copy-paste met stad naam swap)\n`;
    output += `- [ ] Per stad: lokale prijsranges researchen\n`;
    output += `- [ ] Per stad: gemeente-specifieke vergunningsregels vermelden\n\n`;

    output += `### Admin panel toegang\n\n`;
    output += `| | |\n|---|---|\n`;
    output += `| **URL** | https://dakkapellenkosten.vercel.app/login |\n`;
    output += `| **Artikelen beheren** | /admin/articles |\n`;
    output += `| **Geo-pages beheren** | /admin/pages |\n`;
    output += `| **Media uploaden** | /admin/media |\n`;
    output += `| **SEO dashboard** | /admin/seo |\n\n`;

    // Write file
    const outPath = path.join(__dirname, "..", "SEO-REFERENTIE.md");
    fs.writeFileSync(outPath, output, "utf-8");
    console.log(`\n✅ SEO referentie geschreven naar: ${outPath}`);
    console.log(`   ${articles.length} artikelen`);
    console.log(`   ${pages.length} geo-pages`);
    console.log(`   ${Object.keys(categories).length} categorieën`);
}

main().catch(console.error);
