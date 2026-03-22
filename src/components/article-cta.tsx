/**
 * ArticleCTA — Embedded lead form for article pages
 * Client component that renders the compact LeadForm directly
 * so users don't need to navigate to the homepage.
 */
"use client";

import { LeadForm } from "@/components/lead-form";

export function ArticleCTA() {
    return (
        <div style={{ marginTop: 48 }}>
            <div style={{
                background: "linear-gradient(135deg, #16324F, #1a3a5c)",
                borderRadius: 16,
                padding: "32px 24px",
                textAlign: "center",
                marginBottom: 16,
            }}>
                <h3 style={{ color: "white", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
                    Klaar om dakkapel offertes te vergelijken?
                </h3>
                <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: 0, fontSize: 15 }}>
                    Vul hieronder je gegevens in en ontvang binnen 48 uur vrijblijvende offertes.
                </p>
            </div>
            <LeadForm compact ctaLabel="Gratis offertes aanvragen →" />
        </div>
    );
}
