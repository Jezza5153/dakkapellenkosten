/**
 * Dashboard Home — /dashboard
 * Overview: credit balance, subscription status, recent leads
 */

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { eq, desc } from "drizzle-orm";

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const membership = await db.query.companyMembers.findFirst({
        where: eq(schema.companyMembers.userId, session.user.id),
        with: {
            company: {
                with: {
                    subscription: true,
                    creditBalance: true,
                },
            },
        },
    });

    if (!membership?.company) redirect("/login");

    const company = membership.company;
    const balance = company.creditBalance?.balance ?? 0;
    const sub = company.subscription;

    // Recent lead matches
    const recentMatches = await db.query.leadMatches.findMany({
        where: eq(schema.leadMatches.companyId, company.id),
        with: { lead: true },
        orderBy: [desc(schema.leadMatches.createdAt)],
        limit: 5,
    });

    const subStatusLabels: Record<string, string> = {
        active: "Actief",
        trialing: "Proefperiode",
        past_due: "Betaling achterstallig",
        canceled: "Opgezegd",
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-gray-900">
                            Dakkapellen<span className="text-emerald-700">Kosten</span>.nl
                        </h1>
                        <span className="text-sm text-gray-500">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{company.name}</span>
                        <a href="/api/auth/signout" className="text-sm text-gray-500 hover:text-gray-700">Uitloggen</a>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 overflow-x-auto">
                    <a href="/dashboard" className="py-3 border-b-2 border-emerald-600 text-sm font-medium text-emerald-700">Overzicht</a>
                    <a href="/dashboard/leads" className="py-3 border-b-2 border-transparent text-sm text-gray-500 hover:text-gray-700">Leads</a>
                    <a href="/dashboard/credits" className="py-3 border-b-2 border-transparent text-sm text-gray-500 hover:text-gray-700">Credits</a>
                    <a href="/dashboard/profile" className="py-3 border-b-2 border-transparent text-sm text-gray-500 hover:text-gray-700">Profiel</a>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Credit Balance */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="text-sm text-gray-500 mb-1">Credit Saldo</div>
                        <div className="text-3xl font-bold text-emerald-700">{balance}</div>
                        <div className="text-sm text-gray-400 mt-1">credits beschikbaar</div>
                        <a href="/dashboard/credits" className="mt-4 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700">
                            Credits kopen →
                        </a>
                    </div>

                    {/* Subscription */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="text-sm text-gray-500 mb-1">Abonnement</div>
                        <div className="text-xl font-bold text-gray-900">
                            {sub ? subStatusLabels[sub.status] || sub.status : "Geen abonnement"}
                        </div>
                        {sub?.currentPeriodEnd && (
                            <div className="text-sm text-gray-400 mt-1">
                                Verlengt op {new Date(sub.currentPeriodEnd).toLocaleDateString("nl-NL")}
                            </div>
                        )}
                        {!sub || sub.status === "canceled" ? (
                            <a href="/dashboard/subscription" className="mt-4 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700">
                                Abonnement nemen →
                            </a>
                        ) : null}
                    </div>

                    {/* Lead Stats */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="text-sm text-gray-500 mb-1">Leads</div>
                        <div className="text-3xl font-bold text-gray-900">
                            {recentMatches.filter(m => m.status === "accepted").length}
                        </div>
                        <div className="text-sm text-gray-400 mt-1">geaccepteerde leads</div>
                        <a href="/dashboard/leads" className="mt-4 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700">
                            Alle leads bekijken →
                        </a>
                    </div>
                </div>

                {/* Recent Leads */}
                <div className="bg-white rounded-2xl border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Recente leads</h2>
                    </div>
                    {recentMatches.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-400">
                            <p className="text-lg mb-2">Nog geen leads</p>
                            <p className="text-sm">Zodra er een dakkapel aanvraag in jouw regio binnenkomt, zie je die hier.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {recentMatches.map(match => (
                                <div key={match.id} className="px-6 py-4 flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {match.status === "accepted" ? match.lead.naam : `Lead in ${match.lead.postcode.substring(0, 4)}**`}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {match.lead.dakkapelType} dakkapel · {match.lead.breedte}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${match.status === "accepted" ? "bg-emerald-50 text-emerald-700" :
                                                match.status === "notified" ? "bg-blue-50 text-blue-700" :
                                                    match.status === "declined" ? "bg-gray-100 text-gray-500" :
                                                        "bg-gray-100 text-gray-600"
                                            }`}>
                                            {match.status === "accepted" ? "Geaccepteerd" :
                                                match.status === "notified" ? "Nieuw" :
                                                    match.status === "declined" ? "Afgewezen" :
                                                        match.status}
                                        </span>
                                        {match.status === "notified" && (
                                            <a href={`/dashboard/leads`} className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                                                Bekijken →
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
