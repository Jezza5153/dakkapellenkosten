/**
 * robots.ts — Next.js native robots.txt route
 */
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin/", "/dashboard/", "/api/", "/login", "/signup"],
            },
        ],
        sitemap: "https://dakkapellenkosten.nl/sitemap.xml",
    };
}
