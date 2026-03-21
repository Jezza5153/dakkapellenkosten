/**
 * Update article SEO fields — priority batch from SEO team
 * Usage: npx dotenv -e .env.local -- npx tsx scripts/update-seo-fields.ts
 */

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../src/db/schema";
import { eq } from "drizzle-orm";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

const updates = [
    // Money pages
    { slug: "wat-kost-een-dakkapel", seoTitle: "Wat kost een dakkapel in 2026? Prijzen en voorbeelden", seoDescription: "Bekijk wat een dakkapel in 2026 kost per type, breedte en materiaal. Inclusief voorbeelden, afwerking en offertetips." },
    { slug: "prefab-dakkapel-kosten", seoTitle: "Prefab dakkapel kosten in 2026 | Prijzen en uitleg", seoDescription: "Bekijk wat een prefab dakkapel kost in 2026, welke prijsverschillen er zijn per breedte en waar je op moet letten bij offertes." },
    { slug: "traditionele-dakkapel-kosten", seoTitle: "Traditionele dakkapel kosten in 2026 | Prijs en maatwerk", seoDescription: "Lees wat een traditionele dakkapel kost, wanneer maatwerk loont en hoe de prijs zich verhoudt tot prefab." },
    { slug: "kunststof-dakkapel-kosten", seoTitle: "Kunststof dakkapel kosten | Prijs, onderhoud en keuzes", seoDescription: "Bekijk wat een kunststof dakkapel kost, welke voordelen kunststof biedt en in welke situaties dit de slimste keuze is." },
    { slug: "houten-dakkapel-kosten", seoTitle: "Houten dakkapel kosten | Prijs, uitstraling en onderhoud", seoDescription: "Lees wat een houten dakkapel kost, wanneer hout aantrekkelijk is en hoe onderhoud en uitstraling meespelen in de keuze." },

    // Vergunning cluster
    { slug: "vergunning-dakkapel-regels", seoTitle: "Dakkapel vergunning regels in 2026 | Complete gids", seoDescription: "Lees wanneer je voor een dakkapel een vergunning nodig hebt, wanneer het vergunningsvrij kan en welke lokale regels meespelen." },
    { slug: "wanneer-is-een-dakkapel-vergunningsvrij", seoTitle: "Wanneer is een dakkapel vergunningsvrij? Uitleg per situatie", seoDescription: "Lees wanneer een dakkapel vergunningsvrij kan zijn en welke voorwaarden vaak gelden voor plaatsing aan achter- of zijkant." },
    { slug: "vergunningsvrije-dakkapel-achterkant", seoTitle: "Vergunningsvrije dakkapel achterkant | Wanneer mag het?", seoDescription: "Ontdek wanneer een dakkapel aan de achterkant vergunningsvrij kan zijn en waar je vooraf op moet letten." },
    { slug: "vergunning-dakkapel-voorkant", seoTitle: "Dakkapel aan voorkant | Wanneer heb je een vergunning nodig?", seoDescription: "Lees waarom een dakkapel aan de voorkant vaak vergunningplichtig is en welke aandachtspunten belangrijk zijn bij de aanvraag." },
    { slug: "omgevingsvergunning-dakkapel-aanvragen", seoTitle: "Omgevingsvergunning dakkapel aanvragen | Stappenplan", seoDescription: "Lees hoe het aanvragen van een omgevingsvergunning voor een dakkapel verloopt en welke documenten vaak nodig zijn." },

    // Vergelijken / keuzehulp
    { slug: "offerte-dakkapel-vergelijken", seoTitle: "Dakkapel offerte vergelijken | Zo vergelijk je eerlijk", seoDescription: "Lees hoe je dakkapel offertes eerlijk vergelijkt op prijs, materiaal, montage, afwerking en planning." },
    { slug: "checklist-dakkapel-offerte", seoTitle: "Checklist dakkapel offerte | Wat moet erin staan?", seoDescription: "Gebruik deze checklist om een dakkapel offerte te controleren op maat, materiaal, montage, afwerking, planning en garantie." },
    { slug: "hoe-kies-je-een-goede-dakkapel-specialist", seoTitle: "Goede dakkapel specialist kiezen | Praktische criteria", seoDescription: "Lees waar je op let bij het kiezen van een dakkapel specialist en hoe je kwaliteit, ervaring en betrouwbaarheid beoordeelt." },
    { slug: "prefab-of-traditionele-dakkapel", seoTitle: "Prefab of traditionele dakkapel | Wat past beter?", seoDescription: "Vergelijk prefab en traditionele dakkapellen op prijs, snelheid, maatwerk en afwerking en ontdek wat beter past bij jouw woning." },
    { slug: "kunststof-of-houten-dakkapel", seoTitle: "Kunststof of houten dakkapel | Wat is slimmer?", seoDescription: "Vergelijk kunststof en houten dakkapellen op prijs, onderhoud, uitstraling en levensduur en maak een betere keuze." },

    // Plaatsing
    { slug: "dakkapel-laten-plaatsen", seoTitle: "Dakkapel laten plaatsen | Van voorbereiding tot oplevering", seoDescription: "Lees stap voor stap hoe een dakkapel laten plaatsen verloopt, van voorbereiding en vergunning tot montage en afwerking." },
    { slug: "dakkapel-in-1-dag-plaatsen", seoTitle: "Dakkapel in 1 dag plaatsen | Wanneer kan dat echt?", seoDescription: "Lees wanneer een dakkapel echt in 1 dag geplaatst kan worden en welke voorwaarden rond prefab en voorbereiding daarvoor gelden." },
    { slug: "hoe-lang-duurt-een-dakkapel-plaatsen", seoTitle: "Hoe lang duurt een dakkapel plaatsen? Tijdlijn en fasen", seoDescription: "Lees hoe lang het plaatsen van een dakkapel duurt en waar het verschil zit tussen voorbereiding, montage en afwerking." },

    // Onderhoud / problemen
    { slug: "onderhoud-dakkapel", seoTitle: "Onderhoud dakkapel | Complete gids voor levensduur", seoDescription: "Lees hoe je een dakkapel goed onderhoudt, welke onderdelen het eerst slijten en hoe de levensduur per materiaal verschilt." },
    { slug: "lekkage-bij-dakkapel-oorzaken", seoTitle: "Lekkage bij dakkapel | Oorzaken, checks en aanpak", seoDescription: "Lees welke oorzaken vaak achter lekkage bij een dakkapel zitten en welke eerste controles je veilig kunt doen." },
    { slug: "condens-bij-dakkapel", seoTitle: "Condens bij dakkapel | Oorzaken en oplossingen", seoDescription: "Lees waardoor condens bij een dakkapel ontstaat, hoe je het onderscheidt van lekkage en welke oplossingen helpen." },
    { slug: "tocht-bij-dakkapel-oplossen", seoTitle: "Tocht bij dakkapel oplossen | Oorzaken en aanpak", seoDescription: "Lees waardoor tocht bij een dakkapel ontstaat en hoe je luchtlekken, rubbers en aansluitingen systematisch beoordeelt." },
];

async function main() {
    console.log(`Updating SEO fields for ${updates.length} articles...\n`);

    let updated = 0;
    let notFound = 0;

    for (const u of updates) {
        const result = await db.update(schema.articles)
            .set({
                seoTitle: u.seoTitle,
                seoDescription: u.seoDescription,
                updatedAt: new Date(),
            })
            .where(eq(schema.articles.slug, u.slug));

        // Check if any row was affected
        const article = await db.query.articles.findFirst({
            where: eq(schema.articles.slug, u.slug),
            columns: { slug: true, seoTitle: true },
        });

        if (article) {
            console.log(`✅ ${u.slug}`);
            updated++;
        } else {
            console.log(`⚠️  ${u.slug} — not found in DB`);
            notFound++;
        }
    }

    console.log(`\nDone! ${updated} updated, ${notFound} not found.`);
}

main().catch(console.error);
