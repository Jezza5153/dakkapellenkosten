/**
 * GeoCTA — Embedded lead form for geo/location pages
 * Client component that renders the LeadForm with city context.
 */
"use client";

import { LeadForm } from "@/components/lead-form";

interface GeoCTAProps {
    city?: string | null;
}

export function GeoCTA({ city }: GeoCTAProps) {
    return (
        <div style={{ maxWidth: 540, margin: "0 auto", padding: "0 24px 48px" }}>
            <LeadForm
                compact
                city={city || undefined}
                ctaLabel={city ? `Offertes aanvragen in ${city} →` : "Gratis offertes aanvragen →"}
            />
        </div>
    );
}
