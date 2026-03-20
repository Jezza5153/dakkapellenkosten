/**
 * Homepage Client Component — Full Landing Page
 * Hero + Lead Form, Trust Bar, How it Works, Pricing, FAQ, CTA, Footer
 */
"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import Link from "next/link";

/* ————————————————————————————————————————————
   Lead Form Component
———————————————————————————————————————————— */
function LeadForm() {
    const [form, setForm] = useState({
        dakkapelType: "", breedte: "", postcode: "",
        naam: "", email: "", telefoon: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    function update(field: string, value: string) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 4000);
            } else {
                const data = await res.json();
                setError(data.error || "Er ging iets mis. Probeer het opnieuw.");
            }
        } catch {
            setError("Er ging iets mis. Probeer het opnieuw.");
        }
        setSubmitting(false);
    }

    return (
        <div style={{
            background: "#fff", borderRadius: 24, padding: "32px 28px",
            boxShadow: "0 20px 60px rgba(22,50,79,0.12), 0 4px 20px rgba(0,0,0,0.06)",
            border: "1px solid #E8EEF4",
        }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1E293B", marginBottom: 4 }}>
                Ontvang gratis dakkapel offertes
            </h3>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 20 }}>
                Vul je gegevens in en ontvang binnen 48 uur tot 4 vrijblijvende offertes.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <select
                        required value={form.dakkapelType} onChange={e => update("dakkapelType", e.target.value)}
                        style={inputStyle}
                    >
                        <option value="">Type dakkapel</option>
                        <option value="prefab">Prefab</option>
                        <option value="traditioneel">Traditioneel</option>
                        <option value="weet_niet">Weet ik nog niet</option>
                    </select>
                    <select
                        required value={form.breedte} onChange={e => update("breedte", e.target.value)}
                        style={inputStyle}
                    >
                        <option value="">Gewenste breedte</option>
                        <option value="2m">Tot 2 meter</option>
                        <option value="3m">±3 meter</option>
                        <option value="4m">±4 meter</option>
                        <option value="5m_plus">5 meter+</option>
                        <option value="weet_niet">Weet ik nog niet</option>
                    </select>
                </div>
                <input
                    required type="text" placeholder="Postcode" maxLength={7}
                    value={form.postcode} onChange={e => update("postcode", e.target.value)}
                    style={inputStyle}
                />
                <input
                    required type="text" placeholder="Naam"
                    value={form.naam} onChange={e => update("naam", e.target.value)}
                    style={inputStyle}
                />
                <input
                    required type="email" placeholder="E-mailadres"
                    value={form.email} onChange={e => update("email", e.target.value)}
                    style={inputStyle}
                />
                <input
                    required type="tel" placeholder="Telefoonnummer"
                    value={form.telefoon} onChange={e => update("telefoon", e.target.value)}
                    style={inputStyle}
                />

                <button
                    type="submit"
                    disabled={submitting}
                    style={{
                        width: "100%", padding: "14px 20px", border: "none", borderRadius: 12,
                        background: submitted ? "#2E8B57" : "#F59E0B",
                        color: submitted ? "#fff" : "#1E293B",
                        fontSize: 16, fontWeight: 700, cursor: "pointer",
                        transition: "all 0.3s ease",
                    }}
                >
                    {submitted ? "✓ Aanvraag verzonden!" : submitting ? "Verzenden..." : "Nu gratis offertes vergelijken →"}
                </button>

                {error && (
                    <p style={{ color: "#dc2626", fontSize: 13, textAlign: "center" }}>{error}</p>
                )}

                <p style={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    🔒 Je gegevens zijn veilig en worden niet gedeeld met derden.
                </p>
            </form>
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", border: "1px solid #D9E2EC",
    borderRadius: 10, fontSize: 14, color: "#1E293B", background: "#F7F9FC",
    outline: "none", transition: "border-color 0.2s",
};

/* ————————————————————————————————————————————
   FAQ Component
———————————————————————————————————————————— */
function FAQ() {
    const [open, setOpen] = useState<number | null>(null);

    const items = [
        { q: "Wat kost een dakkapel in 2026?", a: "De kosten variëren van €4.500 voor een kleine prefab dakkapel tot €18.000+ voor een grote traditionele dakkapel. De exacte prijs hangt af van het type, de breedte, het materiaal en de complexiteit van de plaatsing." },
        { q: "Is een vergunning nodig voor een dakkapel?", a: "Aan de achterkant is een dakkapel vaak vergunningsvrij, mits deze aan bepaalde afmetingen voldoet. Aan de voorkant of bij monumentale panden is vrijwel altijd een omgevingsvergunning nodig." },
        { q: "Wat is het verschil tussen een prefab en traditionele dakkapel?", a: "Een prefab dakkapel wordt in de fabriek gemaakt en in één dag geplaatst. Een traditionele dakkapel wordt op locatie gebouwd en biedt meer maatwerk mogelijkheden, maar duurt langer en kost meer." },
        { q: "Hoe lang duurt het plaatsen van een dakkapel?", a: "Een prefab dakkapel kan in 1 dag geplaatst worden. Een traditionele dakkapel duurt gemiddeld 3-5 werkdagen. Inclusief voorbereiding moet je rekenen op 2-6 weken totaal." },
        { q: "Hoeveel waarde voegt een dakkapel toe aan mijn woning?", a: "Een dakkapel voegt gemiddeld €15.000 tot €25.000 toe aan de woningwaarde, afhankelijk van de grootte, het materiaal en de locatie van je woning." },
        { q: "Welk materiaal is het beste voor een dakkapel?", a: "Kunststof is het meest populair vanwege de lage onderhoudskosten. Hout biedt een klassieke uitstraling maar vergt meer onderhoud. Polyester is onderhoudsvrij maar duurder. Het beste materiaal hangt af van je budget en voorkeur." },
    ];

    return (
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
            {items.map((item, i) => (
                <div
                    key={i}
                    style={{
                        borderBottom: "1px solid #E8EEF4",
                        ...(open === i ? { borderLeft: "3px solid #24507A", paddingLeft: 16, background: "#f0f4f9" } : {}),
                    }}
                >
                    <button
                        onClick={() => setOpen(open === i ? null : i)}
                        style={{
                            width: "100%", textAlign: "left", padding: "18px 0", border: "none",
                            background: "none", cursor: "pointer", display: "flex", justifyContent: "space-between",
                            alignItems: "center", fontSize: 16, fontWeight: 600, color: "#1E293B",
                            ...(open === i ? { paddingLeft: 0, paddingRight: 16 } : { paddingLeft: open === i ? 0 : 16, paddingRight: 16 }),
                        }}
                    >
                        {item.q}
                        <span style={{ transition: "transform 0.3s", transform: open === i ? "rotate(180deg)" : "none", flexShrink: 0, marginLeft: 12 }}>▼</span>
                    </button>
                    {open === i && (
                        <div style={{ padding: "0 16px 18px", fontSize: 14, lineHeight: 1.7, color: "#4B5563" }}>
                            {item.a}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

/* ————————————————————————————————————————————
   Main Homepage Component
———————————————————————————————————————————— */
export default function HomeClient() {
    return (
        <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", color: "#1E293B" }}>

            {/* Header */}
            <header style={{
                position: "sticky", top: 0, zIndex: 1000, background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(12px)", borderBottom: "1px solid #E8EEF4",
            }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Link href="/" style={{ textDecoration: "none", fontSize: 20, fontWeight: 800, color: "#16324F", letterSpacing: "-0.02em" }}>
                        Dakkapellen<span style={{ color: "#F59E0B" }}>Kosten</span>.nl
                    </Link>
                    <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
                        <a href="#kosten" style={navLinkStyle}>Kosten</a>
                        <a href="#hoe-werkt-het" style={navLinkStyle}>Hoe werkt het</a>
                        <Link href="/kenniscentrum" style={navLinkStyle}>Kenniscentrum</Link>
                        <a href="#faq" style={navLinkStyle}>FAQ</a>
                        <a
                            href="#offerte"
                            style={{
                                padding: "10px 20px", background: "#F59E0B", color: "#1E293B",
                                borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none",
                                transition: "all 0.2s",
                            }}
                        >
                            Gratis offertes →
                        </a>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section id="offerte" style={{
                background: "linear-gradient(165deg, #f0f4f9 0%, #F7F9FC 40%, #fff 100%)",
                padding: "80px 24px 60px", position: "relative", overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute", top: -100, right: -100, width: 400, height: 400,
                    background: "radial-gradient(circle, rgba(36,80,122,0.06) 0%, transparent 70%)",
                    borderRadius: "50%", pointerEvents: "none",
                }} />
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
                    {/* Left — Content */}
                    <div>
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px",
                            background: "rgba(46,139,87,0.1)", color: "#2E8B57", borderRadius: 100,
                            fontSize: 13, fontWeight: 600, marginBottom: 20,
                        }}>
                            ✓ 100% gratis &amp; vrijblijvend
                        </div>

                        <h1 style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.15, color: "#16324F", letterSpacing: "-0.02em", marginBottom: 16 }}>
                            Dakkapel offertes vergelijken?{" "}
                            <span style={{ color: "#F59E0B" }}>Ontvang gratis vrijblijvende offertes!</span>
                        </h1>

                        <p style={{ fontSize: 18, color: "#4B5563", lineHeight: 1.6, marginBottom: 28, maxWidth: 520 }}>
                            Vergelijk prijzen van meerdere dakkapel specialisten in jouw regio.
                            Bespaar tot 35% door offertes te vergelijken.
                        </p>

                        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
                            <a href="#offerte" style={{
                                padding: "14px 28px", background: "#F59E0B", color: "#1E293B",
                                borderRadius: 12, fontWeight: 700, fontSize: 16, textDecoration: "none",
                                transition: "all 0.2s", display: "inline-block",
                            }}>
                                Nu gratis offertes vergelijken →
                            </a>
                            <a href="#kosten" style={{
                                padding: "14px 28px", background: "transparent", color: "#16324F",
                                borderRadius: 12, fontWeight: 600, fontSize: 16, textDecoration: "none",
                                border: "2px solid #D9E2EC", transition: "all 0.2s", display: "inline-block",
                            }}>
                                Bekijk gemiddelde kosten
                            </a>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {["Vergelijk meerdere offertes", "Snel reactie van specialisten", "Geen verplichtingen"].map(t => (
                                <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#4B5563" }}>
                                    <span style={{ color: "#2E8B57", fontWeight: 700 }}>✓</span> {t}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Lead Form */}
                    <LeadForm />
                </div>
            </section>

            {/* Trust Bar */}
            <section style={{ background: "#fff", borderTop: "1px solid #E8EEF4", borderBottom: "1px solid #E8EEF4", padding: "24px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
                    {[
                        { icon: "✓", text: "100% gratis & vrijblijvend", color: "#2E8B57" },
                        { icon: "📋", text: "Vergelijk meerdere offertes", color: "#24507A" },
                        { icon: "🏠", text: "Onafhankelijke informatie", color: "#16324F" },
                        { icon: "⚡", text: "Snel en eenvoudig geregeld", color: "#F59E0B" },
                    ].map(item => (
                        <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                background: `${item.color}15`, fontSize: 18,
                            }}>
                                {item.icon}
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>{item.text}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section id="hoe-werkt-het" style={{ padding: "80px 24px", background: "#F7F9FC" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#24507A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                        Hoe werkt het
                    </p>
                    <h2 style={{ fontSize: 32, fontWeight: 800, color: "#16324F", marginBottom: 8, letterSpacing: "-0.02em" }}>
                        In 3 stappen naar de beste dakkapel offerte
                    </h2>
                    <p style={{ fontSize: 16, color: "#64748B", marginBottom: 48, maxWidth: 600, margin: "0 auto 48px" }}>
                        Geen gedoe, geen verplichtingen. Binnen een paar minuten weet je waar je aan toe bent.
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
                        {[
                            { num: "1", icon: "📝", title: "Vul je wensen in", desc: "Beantwoord een paar korte vragen over je gewenste dakkapel. Dit kost je minder dan 2 minuten.", bg: "#16324F" },
                            { num: "2", icon: "📬", title: "Ontvang gratis offertes", desc: "Na je aanvraag ontvang je vrijblijvende reacties van dakkapel specialisten die actief zijn in jouw regio.", bg: "#F59E0B" },
                            { num: "3", icon: "🏆", title: "Vergelijk prijs & kwaliteit", desc: "Vergelijk de offertes op prijs, materiaal en reviews. Kies de specialist die het beste bij jou past.", bg: "#16324F" },
                        ].map(step => (
                            <div key={step.num} style={{ textAlign: "center", padding: 24 }}>
                                <div style={{
                                    width: 56, height: 56, borderRadius: "50%", background: step.bg,
                                    color: step.bg === "#F59E0B" ? "#1E293B" : "#fff",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 22, fontWeight: 800, margin: "0 auto 16px",
                                }}>
                                    {step.num}
                                </div>
                                <div style={{ fontSize: 28, marginBottom: 8 }}>{step.icon}</div>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#16324F", marginBottom: 8 }}>{step.title}</h3>
                                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <a href="#offerte" style={{
                        display: "inline-block", marginTop: 32, padding: "14px 28px",
                        background: "#F59E0B", color: "#1E293B", borderRadius: 12,
                        fontWeight: 700, fontSize: 16, textDecoration: "none",
                    }}>
                        Start nu — het is gratis →
                    </a>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="kosten" style={{ padding: "80px 24px", background: "#fff" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#24507A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                        Dakkapel kosten
                    </p>
                    <h2 style={{ fontSize: 32, fontWeight: 800, color: "#16324F", marginBottom: 8, letterSpacing: "-0.02em" }}>
                        Wat kost een dakkapel in 2026?
                    </h2>
                    <p style={{ fontSize: 16, color: "#64748B", marginBottom: 48, maxWidth: 600, margin: "0 auto 48px" }}>
                        Prijzen zijn afhankelijk van type, breedte, materiaal en complexiteit van de plaatsing.
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 48 }}>
                        {[
                            { type: "Prefab dakkapel", badge: "Populair", badgeColor: "#2E8B57", price: "€4.500 – €7.500", features: ["Snelle plaatsing (1 dag)", "Standaard afmetingen", "Meest gekozen optie"] },
                            { type: "Traditionele dakkapel", badge: "Maatwerk", badgeColor: "#24507A", price: "€7.000 – €15.000", features: ["Volledig op maat", "Meer design opties", "3-5 dagen plaatsing"], highlight: true },
                            { type: "Dakkapel 5 meter+", badge: "Extra groot", badgeColor: "#F59E0B", price: "€10.000 – €18.000+", features: ["Maximaal extra ruimte", "Vergunning vaak nodig", "Professionele montage"] },
                        ].map(card => (
                            <div key={card.type} style={{
                                background: "#fff", borderRadius: 16, padding: 28,
                                border: card.highlight ? "2px solid #24507A" : "1px solid #E8EEF4",
                                boxShadow: card.highlight ? "0 8px 30px rgba(36,80,122,0.1)" : "0 2px 12px rgba(0,0,0,0.04)",
                                position: "relative", textAlign: "left",
                                borderTop: `4px solid ${card.badgeColor}`,
                            }}>
                                <span style={{
                                    display: "inline-block", padding: "4px 10px", borderRadius: 6,
                                    fontSize: 11, fontWeight: 700, color: "#fff", background: card.badgeColor,
                                    marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.04em",
                                }}>
                                    {card.badge}
                                </span>
                                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#16324F", marginBottom: 8 }}>{card.type}</h3>
                                <div style={{ fontSize: 28, fontWeight: 800, color: "#16324F", marginBottom: 16, fontVariantNumeric: "tabular-nums" }}>
                                    {card.price}
                                </div>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                    {card.features.map(f => (
                                        <li key={f} style={{ fontSize: 14, color: "#4B5563", padding: "6px 0", display: "flex", alignItems: "center", gap: 8 }}>
                                            <span style={{ color: "#2E8B57" }}>✓</span> {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <a href="#offerte" style={{
                        display: "inline-block", padding: "14px 28px",
                        background: "#F59E0B", color: "#1E293B", borderRadius: 12,
                        fontWeight: 700, fontSize: 16, textDecoration: "none",
                    }}>
                        Bereken jouw dakkapel kosten →
                    </a>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" style={{ padding: "80px 24px", background: "#F7F9FC" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#24507A", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                        Veelgestelde vragen
                    </p>
                    <h2 style={{ fontSize: 32, fontWeight: 800, color: "#16324F", marginBottom: 40, letterSpacing: "-0.02em" }}>
                        Alles wat je wilt weten over dakkapellen
                    </h2>
                    <FAQ />
                </div>
            </section>

            {/* Final CTA */}
            <section style={{
                padding: "80px 24px", background: "linear-gradient(135deg, #16324F 0%, #1a3a5c 100%)",
                textAlign: "center", position: "relative", overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                    width: 600, height: 600, background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
                    borderRadius: "50%", pointerEvents: "none",
                }} />
                <div style={{ maxWidth: 600, margin: "0 auto", position: "relative" }}>
                    <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 16, letterSpacing: "-0.02em" }}>
                        Klaar om dakkapel kosten te vergelijken?
                    </h2>
                    <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", marginBottom: 32, lineHeight: 1.7 }}>
                        Ontvang binnen 48 uur tot 4 vrijblijvende offertes van betrouwbare dakkapel specialisten.
                        100% gratis, geen verplichtingen.
                    </p>
                    <a href="#offerte" style={{
                        display: "inline-block", padding: "16px 36px",
                        background: "#F59E0B", color: "#1E293B", borderRadius: 12,
                        fontWeight: 700, fontSize: 18, textDecoration: "none",
                    }}>
                        Nu gratis offertes vergelijken →
                    </a>
                    <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 24, flexWrap: "wrap" }}>
                        {["Gratis & vrijblijvend", "Meerdere offertes", "Geen verborgen kosten"].map(t => (
                            <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
                                <span style={{ color: "#2E8B57" }}>✓</span> {t}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: "#16324F", padding: "48px 24px 24px", borderTop: "4px solid #F59E0B" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 32, marginBottom: 32 }}>
                    <div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
                            Dakkapellen<span style={{ color: "#F59E0B" }}>Kosten</span>.nl
                        </div>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                            Onafhankelijk platform voor het vergelijken van dakkapel offertes. Altijd gratis en vrijblijvend.
                        </p>
                    </div>
                    <div>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Informatie</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <a href="#kosten" style={footerLinkStyle}>Kosten</a>
                            <a href="#hoe-werkt-het" style={footerLinkStyle}>Hoe werkt het</a>
                            <a href="#faq" style={footerLinkStyle}>FAQ</a>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Kenniscentrum</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <Link href="/kenniscentrum" style={footerLinkStyle}>Alle artikelen</Link>
                        </div>
                    </div>
                    <div>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Platform</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <Link href="/login" style={footerLinkStyle}>Inloggen</Link>
                            <Link href="/signup" style={footerLinkStyle}>Registreren</Link>
                        </div>
                    </div>
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16, textAlign: "center" }}>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
                        © {new Date().getFullYear()} DakkapellenKosten.nl — Alle rechten voorbehouden
                    </p>
                </div>
            </footer>
        </div>
    );
}

const navLinkStyle: React.CSSProperties = {
    textDecoration: "none", color: "#4B5563", fontSize: 14, fontWeight: 500, transition: "color 0.2s",
};

const footerLinkStyle: React.CSSProperties = {
    textDecoration: "none", color: "rgba(255,255,255,0.5)", fontSize: 13, transition: "color 0.2s",
};
