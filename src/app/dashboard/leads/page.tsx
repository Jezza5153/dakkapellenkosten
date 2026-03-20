/**
 * Leads Dashboard — /dashboard/leads
 * Browse available + accepted leads
 */

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { eq, desc } from "drizzle-orm";
import { LEAD_CREDIT_COST } from "@/lib/stripe";
import { AcceptLeadButton } from "./accept-button";

export default async function LeadsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const membership = await db.query.companyMembers.findFirst({
        where: eq(schema.companyMembers.userId, session.user.id),
        with: { company: { with: { creditBalance: true } } },
    });

    if (!membership?.company) redirect("/login");

    const company = membership.company;
    const balance = company.creditBalance?.balance ?? 0;

    const leadMatches = await db.query.leadMatches.findMany({
        where: eq(schema.leadMatches.companyId, company.id),
        with: { lead: true },
        orderBy: [desc(schema.leadMatches.createdAt)],
    });

    const newLeads = leadMatches.filter(m => m.status === "notified");
    const acceptedLeads = leadMatches.filter(m => ["accepted", "contacted", "won", "lost"].includes(m.status));

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-gray-900">
                            Dakkapellen<span className="text-emerald-700">Kosten</span>.nl
                        </h1>
                        <span className="text-sm text-gray-500">Dashboard</span>
                    </div>
                    <span className="text-sm text-gray-600">{company.name}</span>
                </div>
            </header>

            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 overflow-x-auto">
                    <a href="/dashboard" className="py-3 border-b-2 border-transparent text-sm text-gray-500 hover:text-gray-700">Overzicht</a>
                    <a href="/dashboard/leads" className="py-3 border-b-2 border-emerald-600 text-sm font-medium text-emerald-700">Leads</a>
                    <a href="/dashboard/credits" className="py-3 border-b-2 border-transparent text-sm text-gray-500 hover:text-gray-700">Credits</a>
                    <a href="/dashboard/profile" className="py-3 border-b-2 border-transparent text-sm text-gray-500 hover:text-gray-700">Profiel</a>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Balance Bar */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-6 py-3 mb-6 flex items-center justify-between">
                    <div className="text-sm text-emerald-800">
                        Saldo: <strong>{balance} credits</strong> · Kosten per lead: {LEAD_CREDIT_COST} credits
                    </div>
                    <a href="/dashboard/credits" className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
                        Credits kopen →
                    </a>
                </div>

                {/* New Leads */}
                <div className="bg-white rounded-2xl border border-gray-200 mb-8">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Nieuwe leads ({newLeads.length})</h2>
                    </div>
                    {newLeads.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-400">
                            <p>Geen nieuwe leads op dit moment. Je ontvangt een e-mail zodra er een match is.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {newLeads.map(match => (
                                <div key={match.id} className="px-6 py-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="font-medium text-gray-900 mb-1">
                                                {match.lead.dakkapelType === "prefab" ? "Prefab" : match.lead.dakkapelType === "traditioneel" ? "Traditioneel" : "Type onbekend"} dakkapel
                                            </div>
                                            <div className="text-sm text-gray-500 space-y-0.5">
                                                <div>📍 Regio {match.lead.postcode.substring(0, 4)}** · {match.distanceKm} km afstand</div>
                                                <div>📏 Breedte: {match.lead.breedte}</div>
                                                {match.lead.materiaal && match.lead.materiaal !== "weet_niet" && (
                                                    <div>🏗️ Materiaal: {match.lead.materiaal}</div>
                                                )}
                                                {match.lead.timeline && match.lead.timeline !== "weet_niet" && (
                                                    <div>⏱️ Planning: {match.lead.timeline.replace(/_/g, " ")}</div>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-2">
                                                Match score: {match.matchScore}% · {new Date(match.createdAt).toLocaleDateString("nl-NL")}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-sm font-medium text-gray-500">{LEAD_CREDIT_COST} credits</span>
                                            <AcceptLeadButton
                                                leadId={match.leadId}
                                                creditCost={LEAD_CREDIT_COST}
                                                hasEnoughCredits={balance >= LEAD_CREDIT_COST}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Accepted Leads */}
                <div className="bg-white rounded-2xl border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Geaccepteerde leads ({acceptedLeads.length})</h2>
                    </div>
                    {acceptedLeads.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-400">
                            <p>Nog geen leads geaccepteerd.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {acceptedLeads.map(match => (
                                <div key={match.id} className="px-6 py-5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="font-medium text-gray-900 mb-1">{match.lead.naam}</div>
                                            <div className="text-sm text-gray-500 space-y-0.5">
                                                <div>📧 {match.lead.email}</div>
                                                <div>📞 {match.lead.telefoon}</div>
                                                <div>📍 {match.lead.postcode} {match.lead.city || ""}</div>
                                                <div>🏠 {match.lead.dakkapelType} dakkapel · {match.lead.breedte}</div>
                                                {match.lead.extraNotes && (
                                                    <div className="mt-2 text-gray-600 italic">&ldquo;{match.lead.extraNotes}&rdquo;</div>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-2">
                                                Geaccepteerd op {match.acceptedAt ? new Date(match.acceptedAt).toLocaleDateString("nl-NL") : "—"}
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${match.status === "accepted" ? "bg-emerald-50 text-emerald-700" :
                                                match.status === "contacted" ? "bg-blue-50 text-blue-700" :
                                                    match.status === "won" ? "bg-green-50 text-green-700" :
                                                        match.status === "lost" ? "bg-red-50 text-red-700" :
                                                            "bg-gray-100 text-gray-600"
                                            }`}>
                                            {match.status === "accepted" ? "Geaccepteerd" :
                                                match.status === "contacted" ? "Benaderd" :
                                                    match.status === "won" ? "Gewonnen" :
                                                        match.status === "lost" ? "Verloren" :
                                                            match.status}
                                        </span>
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
