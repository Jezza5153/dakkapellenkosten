/**
 * Analytics — GA4 Script Loader + Custom Events
 * Loads Google Analytics from admin-configured Measurement ID.
 * Provides event tracking functions for the lead funnel.
 */
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

// ─── GA4 Script Loader ──────────────────────────

export function AnalyticsLoader() {
    const [gaId, setGaId] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/settings/tracking")
            .then(r => r.ok ? r.json() : null)
            .then(d => {
                const id = d?.tracking?.["seo.googleAnalyticsId"];
                if (id && id.startsWith("G-")) {
                    setGaId(id);
                }
            })
            .catch(() => {}); // Fail silently — tracking is non-critical
    }, []);

    if (!gaId) return null;

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaId}', {
                        page_title: document.title,
                        send_page_view: true,
                    });
                `}
            </Script>
        </>
    );
}

// ─── Event Tracking Helpers ─────────────────────

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
        dataLayer?: unknown[];
    }
}

function trackEvent(eventName: string, params?: Record<string, unknown>) {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", eventName, params);
    }
}

// ─── Funnel Events ──────────────────────────────

export const analytics = {
    /** User sees the lead form */
    formView() {
        trackEvent("form_view", { form_name: "lead_form" });
    },

    /** User starts filling in the first field */
    formStart() {
        trackEvent("form_start", { form_name: "lead_form" });
    },

    /** User interacts with a specific field */
    formFieldInteraction(fieldName: string) {
        trackEvent("form_field_interaction", {
            form_name: "lead_form",
            field_name: fieldName,
        });
    },

    /** Form validation error */
    formError(errorMessage: string, field?: string) {
        trackEvent("form_error", {
            form_name: "lead_form",
            error_message: errorMessage,
            field_name: field,
        });
    },

    /** Form submitted successfully */
    formSubmit(leadType: string) {
        trackEvent("generate_lead", {
            form_name: "lead_form",
            lead_type: leadType,
            currency: "EUR",
        });
    },

    /** Form submission failed */
    formSubmitError(errorMessage: string) {
        trackEvent("form_submit_error", {
            form_name: "lead_form",
            error_message: errorMessage,
        });
    },

    /** CTA button click */
    ctaClick(ctaLabel: string, ctaLocation: string) {
        trackEvent("cta_click", {
            cta_label: ctaLabel,
            cta_location: ctaLocation,
        });
    },

    /** Page view (for SPA navigations) */
    pageView(path: string, title: string) {
        trackEvent("page_view", {
            page_path: path,
            page_title: title,
        });
    },
};
