/**
 * Dynamic Sitemap — Generates sitemap.xml from database
 */

export const dynamic = "force-dynamic";

import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://dakkapellenkosten.nl";

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ];

    // Published articles
    const articles = await db.query.articles.findMany({
        where: eq(schema.articles.status, "published"),
        columns: { slug: true, updatedAt: true },
    });

    const articlePages: MetadataRoute.Sitemap = articles.map(article => ({
        url: `${baseUrl}/kenniscentrum/${article.slug}`,
        lastModified: article.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    // Published pages
    const pages = await db.query.pages.findMany({
        where: eq(schema.pages.status, "published"),
        columns: { slug: true, updatedAt: true },
    });

    const seoPages: MetadataRoute.Sitemap = pages.map(page => ({
        url: `${baseUrl}/${page.slug}`,
        lastModified: page.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
    }));

    return [...staticPages, ...articlePages, ...seoPages];
}
