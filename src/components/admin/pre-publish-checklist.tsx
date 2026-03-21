/**
 * Pre-Publish Checklist — checks before publishing
 * Validates SEO fields, featured image, content length, etc.
 */
"use client";

import { useState } from "react";

interface CheckItem {
    label: string;
    passed: boolean;
    severity: "error" | "warning";
}

interface PrePublishChecklistProps {
    title: string;
    seoTitle: string;
    seoDescription: string;
    content: string;
    featuredImage: string;
    slug: string;
    onPublish: () => void;
    onCancel: () => void;
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function countWords(html: string): number {
    const text = stripHtml(html);
    if (!text) return 0;
    return text.split(/\s+/).filter(Boolean).length;
}

export default function PrePublishChecklist({
    title,
    seoTitle,
    seoDescription,
    content,
    featuredImage,
    slug,
    onPublish,
    onCancel,
}: PrePublishChecklistProps) {
    const wordCount = countWords(content);

    const checks: CheckItem[] = [
        { label: "Titel ingevuld", passed: title.length > 0, severity: "error" },
        { label: "SEO titel ingevuld", passed: seoTitle.length > 0, severity: "warning" },
        { label: "SEO titel ≤ 60 tekens", passed: seoTitle.length <= 60, severity: "warning" },
        { label: "Meta beschrijving ingevuld", passed: seoDescription.length > 0, severity: "warning" },
        { label: "Meta beschrijving ≤ 160 tekens", passed: seoDescription.length <= 160, severity: "warning" },
        { label: "Uitgelichte afbeelding", passed: !!featuredImage, severity: "warning" },
        { label: "Minimaal 300 woorden", passed: wordCount >= 300, severity: "warning" },
        { label: "Slug ingevuld", passed: slug.length > 0, severity: "error" },
    ];

    const errors = checks.filter(c => !c.passed && c.severity === "error");
    const warnings = checks.filter(c => !c.passed && c.severity === "warning");
    const allPassed = checks.every(c => c.passed);
    const hasErrors = errors.length > 0;

    return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md shadow-2xl p-6">
                <h3 className="text-lg font-semibold mb-1">
                    {allPassed ? "✅ Klaar om te publiceren" : hasErrors ? "❌ Niet klaar" : "⚠️ Aanbevelingen"}
                </h3>
                <p className="text-xs text-gray-400 mb-4">
                    {allPassed
                        ? "Alle checks geslaagd. Je kunt publiceren."
                        : hasErrors
                        ? "Fix de fouten voordat je publiceert."
                        : "Er zijn aanbevelingen, maar je kunt toch publiceren."
                    }
                </p>

                <div className="space-y-1.5 mb-5">
                    {checks.map((check, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                            <span className={check.passed ? "text-emerald-400" : check.severity === "error" ? "text-red-400" : "text-yellow-400"}>
                                {check.passed ? "✓" : check.severity === "error" ? "✕" : "⚠"}
                            </span>
                            <span className={check.passed ? "text-gray-400" : "text-gray-200"}>
                                {check.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600"
                    >
                        Terug
                    </button>
                    <button
                        onClick={onPublish}
                        disabled={hasErrors}
                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {allPassed ? "Publiceren ✓" : "Toch publiceren"}
                    </button>
                </div>
            </div>
        </div>
    );
}
