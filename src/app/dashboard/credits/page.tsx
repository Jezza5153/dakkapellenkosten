/**
 * Credits Dashboard — /dashboard/credits
 * Buy credits, view balance and transaction history
 */

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { eq, desc } from "drizzle-orm";
import { CREDIT_PACKAGES } from "@/lib/stripe";
import { PurchaseButton } from "./purchase-button";

export default async function CreditsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const membership = await db.query.companyMembers.findFirst({
        where: eq(schema.companyMembers.userId, session.user.id),
        with: { company: { with: { creditBalance: true } } },
    });

    if (!membership?.company) redirect("/login");

    const company = membership.company;
    const balance = company.creditBalance?.balance ?? 0;

    const transactions = await db.query.creditTransactions.findMany({
        where: eq(schema.creditTransactions.companyId, company.id),
        orderBy: [desc(schema.creditTransactions.createdAt)],
        limit: 20,
    });

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
                    <a href="/dashboard/leads" className="py-3 border-b-2 border-transparent text-sm text-gray-500 hover:text-gray-700">Leads</a>
                    <a href="/dashboard/credits" className="py-3 border-b-2 border-emerald-600 text-sm font-medium text-emerald-700">Credits</a>
                    <a href="/dashboard/profile" className="py-3 border-b-2 border-transparent text-sm text-gray-500 hover:text-gray-700">Profiel</a>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Current Balance */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 mb-8 text-white">
                    <div className="text-sm opacity-80 mb-1">Huidig saldo</div>
                    <div className="text-4xl font-bold mb-1">{balance} credits</div>
                    <div className="text-sm opacity-70">
                        Totaal aangekocht: {company.creditBalance?.totalPurchased ?? 0} · Totaal besteed: {company.creditBalance?.totalSpent ?? 0}
                    </div>
                </div>

                {/* Credit Packages */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Credits kopen</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {CREDIT_PACKAGES.map((pkg) => (
                            <div key={pkg.id} className={`bg-white rounded-2xl border p-6 ${pkg.id === "pro" ? "border-emerald-300 ring-2 ring-emerald-100" : "border-gray-200"
                                }`}>
                                {pkg.id === "pro" && (
                                    <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full mb-3">
                                        Populair
                                    </span>
                                )}
                                <div className="text-lg font-bold text-gray-900">{pkg.label}</div>
                                <div className="text-3xl font-bold text-emerald-700 my-2">
                                    €{(pkg.priceCents / 100).toFixed(0)}
                                </div>
                                <div className="text-sm text-gray-500 mb-1">{pkg.credits} credits</div>
                                <div className="text-xs text-gray-400 mb-4">{pkg.pricePerCredit} per credit</div>
                                <PurchaseButton packageId={pkg.id} isPopular={pkg.id === "pro"} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Transaction History */}
                <div className="bg-white rounded-2xl border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Transactiehistorie</h2>
                    </div>
                    {transactions.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-400">
                            <p>Nog geen transacties.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {transactions.map(tx => (
                                <div key={tx.id} className="px-6 py-4 flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-gray-900 text-sm">{tx.description}</div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(tx.createdAt).toLocaleDateString("nl-NL", {
                                                day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`font-medium text-sm ${tx.amount > 0 ? "text-emerald-600" : "text-red-600"
                                            }`}>
                                            {tx.amount > 0 ? "+" : ""}{tx.amount}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            Saldo: {tx.balanceAfter}
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
