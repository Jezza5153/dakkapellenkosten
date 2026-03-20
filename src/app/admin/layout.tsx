/**
 * Admin Layout — Sidebar Navigation
 * Wraps all /admin/* pages with persistent sidebar
 */
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/articles", label: "Artikelen", icon: "📝" },
    { href: "/admin/pages", label: "Pagina's", icon: "📄" },
    { href: "/admin/media", label: "Media", icon: "🖼️" },
    { href: "/admin/leads", label: "Leads", icon: "👥" },
    { href: "/admin/companies", label: "Bedrijven", icon: "🏢" },
    { href: "/admin/seo", label: "SEO", icon: "🔍" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    function isActive(href: string) {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-56 bg-gray-800 border-r border-gray-700 flex flex-col fixed h-full z-40">
                {/* Logo */}
                <div className="px-5 py-4 border-b border-gray-700">
                    <Link href="/admin" className="flex items-center gap-2">
                        <h1 className="text-lg font-bold">
                            DK<span className="text-amber-400">.nl</span>
                        </h1>
                        <span className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded">
                            CMS
                        </span>
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isActive(item.href)
                                    ? "bg-gray-700 text-white"
                                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-750"
                            }`}
                        >
                            <span className="text-base">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className="px-3 py-3 border-t border-gray-700">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
                    >
                        ← Dashboard
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-56 min-h-screen">
                {children}
            </main>
        </div>
    );
}
