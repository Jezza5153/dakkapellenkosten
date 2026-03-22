/**
 * LeadForm — Reusable Lead Capture Component
 * Used on homepage (inline) and article pages (embedded).
 * Includes: optional quality fields, inline validation, UTM capture,
 * reference number display, and social proof.
 */
"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { analytics } from "@/components/analytics";

interface LeadFormProps {
    /** Compact mode for article sidebars */
    compact?: boolean;
    /** Custom CTA label */
    ctaLabel?: string;
    /** City context for geo-pages */
    city?: string;
}

interface FormErrors {
    postcode?: string;
    email?: string;
    telefoon?: string;
    naam?: string;
}

export function LeadForm({ compact = false, ctaLabel, city }: LeadFormProps) {
    const [form, setForm] = useState({
        dakkapelType: "", breedte: "", postcode: "",
        materiaal: "", timeline: "",
        naam: "", email: "", telefoon: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [referenceId, setReferenceId] = useState("");
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Set<string>>(new Set());
    const isSubmitting = useRef(false);
    const formStarted = useRef(false);

    // Capture UTM params from URL
    const utmParams = useRef<Record<string, string>>({});
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const source = params.get("utm_source");
            const medium = params.get("utm_medium");
            const campaign = params.get("utm_campaign");
            if (source) utmParams.current.utmSource = source;
            if (medium) utmParams.current.utmMedium = medium;
            if (campaign) utmParams.current.utmCampaign = campaign;
        }
    }, []);

    function update(field: string, value: string) {
        setForm(prev => ({ ...prev, [field]: value }));
        if (!formStarted.current) {
            formStarted.current = true;
            analytics.formStart();
        }
        analytics.formFieldInteraction(field);
        // Clear error on edit
        if (fieldErrors[field as keyof FormErrors]) {
            setFieldErrors(prev => ({ ...prev, [field]: undefined }));
        }
    }

    function validateField(field: string, value: string): string | undefined {
        switch (field) {
            case "postcode":
                if (value && !/^\d{4}\s?[A-Za-z]{2}$/.test(value)) return "Bijv. 1234 AB";
                break;
            case "email":
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Ongeldig e-mailadres";
                break;
            case "telefoon":
                if (value && value.length < 8) return "Minimaal 8 cijfers";
                break;
            case "naam":
                if (value && value.length < 2) return "Minimaal 2 tekens";
                break;
        }
        return undefined;
    }

    function handleBlur(field: string) {
        setTouched(prev => new Set(prev).add(field));
        const err = validateField(field, form[field as keyof typeof form]);
        if (err) {
            setFieldErrors(prev => ({ ...prev, [field]: err }));
            analytics.formError(err, field);
        } else {
            setFieldErrors(prev => ({ ...prev, [field]: undefined }));
        }
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (isSubmitting.current) return;

        // Validate all required fields
        const errors: FormErrors = {};
        (["postcode", "email", "telefoon", "naam"] as const).forEach(f => {
            const err = validateField(f, form[f]);
            if (err) errors[f] = err;
        });
        if (Object.values(errors).some(Boolean)) {
            setFieldErrors(errors);
            return;
        }

        isSubmitting.current = true;
        setSubmitting(true);
        setError("");
        try {
            // Build payload — only include non-empty optional fields
            const payload: Record<string, string> = {
                dakkapelType: form.dakkapelType,
                breedte: form.breedte,
                postcode: form.postcode,
                naam: form.naam,
                email: form.email,
                telefoon: form.telefoon,
                ...utmParams.current,
            };
            if (form.materiaal) payload.materiaal = form.materiaal;
            if (form.timeline) payload.timeline = form.timeline;

            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                const data = await res.json();
                setReferenceId(data.referenceId || "");
                setSubmitted(true);
                analytics.formSubmit(form.dakkapelType || "unknown");
            } else {
                const data = await res.json();
                const msg = data.error || "Er ging iets mis. Probeer het opnieuw.";
                setError(msg);
                analytics.formSubmitError(msg);
            }
        } catch {
            setError("Er ging iets mis. Probeer het opnieuw.");
            analytics.formSubmitError("network_error");
        }
        setSubmitting(false);
        isSubmitting.current = false;
    }

    function resetForm() {
        setSubmitted(false);
        setReferenceId("");
        setForm({ dakkapelType: "", breedte: "", postcode: "", materiaal: "", timeline: "", naam: "", email: "", telefoon: "" });
        setFieldErrors({});
        setTouched(new Set());
        formStarted.current = false;
    }

    if (submitted) {
        return (
            <div className="lead-form-card" id="offerte">
                <div className="form-success-state">
                    <div className="form-success-icon">✓</div>
                    <h3 className="lead-form-title">Aanvraag ontvangen!</h3>
                    <p className="lead-form-sub">
                        Je ontvangt binnen 48 uur reactie van dakkapel specialisten in jouw regio.
                        Check je inbox voor een bevestiging.
                    </p>
                    <p className="form-trust">📬 Bevestiging gestuurd naar {form.email}</p>
                    {referenceId && (
                        <p className="form-reference">
                            Referentienummer: <strong>{referenceId}</strong>
                        </p>
                    )}
                    <button onClick={resetForm} className="form-submit form-submit--outline">
                        Nieuwe aanvraag indienen
                    </button>
                </div>
            </div>
        );
    }

    const title = city
        ? `Dakkapel offertes in ${city}`
        : compact
            ? "Gratis offertes aanvragen"
            : "Ontvang gratis dakkapel offertes";

    return (
        <div className="lead-form-card" id="offerte">
            <h3 className="lead-form-title">{title}</h3>
            <p className="lead-form-sub">Vul je gegevens in en ontvang binnen 48 uur tot 4 vrijblijvende offertes.</p>

            {/* Social proof */}
            <div className="form-social-proof">
                <span className="social-proof-stars">★★★★★</span>
                <span className="social-proof-text">Al 1.200+ aanvragen via ons platform</span>
            </div>

            <form onSubmit={handleSubmit} className="lead-form">
                {/* Dakkapel info */}
                <div className="form-row">
                    <select required value={form.dakkapelType} onChange={e => update("dakkapelType", e.target.value)} className="form-input">
                        <option value="">Type dakkapel</option>
                        <option value="prefab">Prefab</option>
                        <option value="traditioneel">Traditioneel</option>
                        <option value="weet_niet">Weet ik nog niet</option>
                    </select>
                    <select required value={form.breedte} onChange={e => update("breedte", e.target.value)} className="form-input">
                        <option value="">Gewenste breedte</option>
                        <option value="2m">Tot 2 meter</option>
                        <option value="3m">±3 meter</option>
                        <option value="4m">±4 meter</option>
                        <option value="5m_plus">5 meter+</option>
                        <option value="weet_niet">Weet ik nog niet</option>
                    </select>
                </div>

                {/* Optional quality fields */}
                {!compact && (
                    <div className="form-row">
                        <select value={form.materiaal} onChange={e => update("materiaal", e.target.value)} className="form-input form-input--optional">
                            <option value="">Materiaal (optioneel)</option>
                            <option value="kunststof">Kunststof</option>
                            <option value="hout">Hout</option>
                            <option value="polyester">Polyester</option>
                            <option value="aluminium">Aluminium</option>
                            <option value="weet_niet">Weet ik nog niet</option>
                        </select>
                        <select value={form.timeline} onChange={e => update("timeline", e.target.value)} className="form-input form-input--optional">
                            <option value="">Wanneer starten? (optioneel)</option>
                            <option value="zo_snel_mogelijk">Zo snel mogelijk</option>
                            <option value="1_3_maanden">1-3 maanden</option>
                            <option value="3_6_maanden">3-6 maanden</option>
                            <option value="6_plus_maanden">6+ maanden</option>
                            <option value="weet_niet">Weet ik nog niet</option>
                        </select>
                    </div>
                )}

                {/* Postcode with validation */}
                <div className="form-field-with-hint">
                    <input
                        required type="text" placeholder="Postcode (bijv. 1234 AB)" maxLength={7}
                        value={form.postcode} onChange={e => update("postcode", e.target.value)}
                        onBlur={() => handleBlur("postcode")}
                        className={`form-input ${touched.has("postcode") && fieldErrors.postcode ? "form-input--error" : ""}`}
                    />
                    {touched.has("postcode") && fieldErrors.postcode && (
                        <span className="form-field-error">{fieldErrors.postcode}</span>
                    )}
                </div>

                {/* Trust signal — BEFORE PII fields */}
                <p className="form-trust">🔒 Je gegevens zijn veilig en worden niet gedeeld met derden.</p>

                {/* PII fields with inline validation */}
                <div className="form-field-with-hint">
                    <input
                        required type="text" placeholder="Naam"
                        value={form.naam} onChange={e => update("naam", e.target.value)}
                        onBlur={() => handleBlur("naam")}
                        className={`form-input ${touched.has("naam") && fieldErrors.naam ? "form-input--error" : ""}`}
                    />
                    {touched.has("naam") && fieldErrors.naam && (
                        <span className="form-field-error">{fieldErrors.naam}</span>
                    )}
                </div>

                <div className="form-field-with-hint">
                    <input
                        required type="email" placeholder="E-mailadres"
                        value={form.email} onChange={e => update("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        className={`form-input ${touched.has("email") && fieldErrors.email ? "form-input--error" : ""}`}
                    />
                    {touched.has("email") && fieldErrors.email && (
                        <span className="form-field-error">{fieldErrors.email}</span>
                    )}
                </div>

                <div className="form-field-with-hint">
                    <input
                        required type="tel" placeholder="Telefoonnummer"
                        value={form.telefoon} onChange={e => update("telefoon", e.target.value)}
                        onBlur={() => handleBlur("telefoon")}
                        className={`form-input ${touched.has("telefoon") && fieldErrors.telefoon ? "form-input--error" : ""}`}
                    />
                    <span className="form-field-hint">Zodat specialisten je snel kunnen bereiken</span>
                    {touched.has("telefoon") && fieldErrors.telefoon && (
                        <span className="form-field-error">{fieldErrors.telefoon}</span>
                    )}
                </div>

                <button type="submit" disabled={submitting} className="form-submit">
                    {submitting ? "Verzenden..." : (ctaLabel || "Nu gratis offertes vergelijken →")}
                </button>
                {error && <p className="form-error">{error}</p>}
            </form>
        </div>
    );
}
