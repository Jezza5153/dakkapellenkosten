/**
 * Dynamic Blog Route — /kenniscentrum/[slug]
 * Renders articles from CMS database
 */

export const dynamic = "force-dynamic";

import { db, schema } from "@/db";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;

    const article = await db.query.articles.findFirst({
        where: and(
            eq(schema.articles.slug, slug),
            eq(schema.articles.status, "published")
        ),
    });

    if (!article) return {};

    return {
        title: article.seoTitle || article.title,
        description: article.seoDescription || article.excerpt || undefined,
        ...(article.canonicalUrl && {
            alternates: { canonical: article.canonicalUrl },
        }),
    };
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params;

    const article = await db.query.articles.findFirst({
        where: and(
            eq(schema.articles.slug, slug),
            eq(schema.articles.status, "published")
        ),
        with: { author: { columns: { name: true } } },
    });

    if (!article) notFound();

    return (
        <main className="max-w-3xl mx-auto px-4 py-12">
            {/* Article Header */}
            <header className="mb-8">
                {article.category && (
                    <span className="text-sm text-amber-500 font-medium uppercase tracking-wider">
                        {article.category}
                    </span>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 leading-tight">
                    {article.title}
                </h1>
                {article.excerpt && (
                    <p className="text-lg text-gray-600 mt-4 leading-relaxed">
                        {article.excerpt}
                    </p>
                )}
                <div className="flex items-center gap-3 mt-4 text-sm text-gray-400">
                    {article.author?.name && <span>Door {article.author.name}</span>}
                    {article.publishedAt && (
                        <span>
                            {new Date(article.publishedAt).toLocaleDateString("nl-NL", {
                                year: "numeric", month: "long", day: "numeric",
                            })}
                        </span>
                    )}
                </div>
            </header>

            {/* Featured Image */}
            {article.featuredImage && (
                <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full rounded-xl mb-8 shadow-lg"
                />
            )}

            {/* Article Content */}
            <article
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-blue-600"
                dangerouslySetInnerHTML={{ __html: article.content || "" }}
            />
        </main>
    );
}
