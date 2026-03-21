/**
 * Admin Layout — Responsive Sidebar + Sticky Header + Breadcrumbs
 * Wraps all /admin/* pages with persistent navigation
 */
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ToastProvider } from "@/components/admin/toast";
import { BreadcrumbProvider, BreadcrumbBar, useBreadcrumbs } from "@/components/admin/breadcrumbs";
import CommandPalette from "@/components/admin/command-palette";

/* ── Navigation items — grouped ────────────────────────── */
const navGroups = [
    {
        items: [
            { href: "/admin", label: "Dashboard", icon: "📊" },
        ],
    },
    {
        label: "Content",
        items: [
            { href: "/admin/articles", label: "Artikelen", icon: "📝" },
            { href: "/admin/pages", label: "Pagina's", icon: "📄" },
            { href: "/admin/media", label: "Media", icon: "🖼️" },
        ],
    },
    {
        label: "CRM",
        items: [
            { href: "/admin/leads", label: "Leads", icon: "👥" },
            { href: "/admin/companies", label: "Bedrijven", icon: "🏢" },
            { href: "/admin/crm", label: "CRM Intelligence", icon: "📈" },
        ],
    },
    {
        label: "SEO",
        items: [
            { href: "/admin/seo", label: "SEO Command Center", icon: "🔍" },
            { href: "/admin/seo-health", label: "SEO Health", icon: "🩺" },
            { href: "/admin/redirects", label: "Redirects", icon: "🔀" },
        ],
    },
    {
        label: "Systeem",
        items: [
            { href: "/admin/audit-log", label: "Audit Log", icon: "📋" },
            { href: "/admin/trash", label: "Prullenbak", icon: "🗑️" },
            { href: "/admin/settings", label: "Instellingen", icon: "⚙️" },
        ],
    },
];

// Flat list for currentPage lookup
const allNavItems = navGroups.flatMap(g => g.items);

/* ── Inner layout (needs breadcrumb context) ──────────── */
function AdminInner({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { crumbs } = useBreadcrumbs();

    // Close sidebar on route change
    useEffect(() => { setSidebarOpen(false); }, [pathname]);

    // Close sidebar on escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSidebarOpen(false);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    function isActive(href: string) {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    }

    const currentPage = allNavItems.find(item =>
        item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
    );

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-60 bg-gray-800 border-r border-gray-700 flex flex-col z-50 transition-transform duration-200 lg:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="px-5 py-4 border-b border-gray-700 flex items-center justify-between">
                    <Link href="/admin" className="flex items-center gap-2">
                        <h1 className="text-lg font-bold">
                            DK<span className="text-amber-400">.nl</span>
                        </h1>
                        <span className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded">
                            CMS
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-white p-1"
                    >
                        ✕
                    </button>
                </div>

                <nav className="flex-1 py-3 px-3 overflow-y-auto">
                    {navGroups.map((group, gi) => (
                        <div key={gi} className={gi > 0 ? "mt-4" : ""}>
                            {group.label && (
                                <div className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                    {group.label}
                                </div>
                            )}
                            <div className="space-y-0.5">
                                {group.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                            isActive(item.href)
                                                ? "bg-gray-700 text-white shadow-sm"
                                                : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                                        }`}
                                    >
                                        <span className="text-base w-5 text-center">{item.icon}</span>
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="px-3 py-3 border-t border-gray-700 space-y-1">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-700/50"
                    >
                        🌐 Website bekijken
                    </a>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-700/50"
                    >
                        ← Dashboard
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:ml-60 min-h-screen flex flex-col">
                {/* Sticky Header */}
                <header className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
                    <div className="flex items-center gap-4 px-4 lg:px-6 h-14">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-400 hover:text-white p-1.5 -ml-1"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div className="flex-1 min-w-0">
                            {crumbs.length > 0 ? (
                                <BreadcrumbBar crumbs={crumbs} />
                            ) : (
                                <span className="text-sm text-gray-400">
                                    {currentPage?.icon} {currentPage?.label || "Admin"}
                                </span>
                            )}
                        </div>
                    </div>
                </header>

                <main className="flex-1">
                    {children}
                </main>
            </div>
            <CommandPalette />
        </div>
    );
}

/* ── Layout ────────────────────────────────────────────── */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <BreadcrumbProvider>
            <ToastProvider>
                <AdminInner>{children}</AdminInner>
            </ToastProvider>
        </BreadcrumbProvider>
    );
}
