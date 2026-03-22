/**
 * Homepage Client Component — Full Landing Page
 * Uses CSS classes for proper animations, transitions, and responsive design
 */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { analytics } from "@/components/analytics";
import { LeadForm } from "@/components/lead-form";
import "./home.css";

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
        { q: "Welk materiaal is het beste voor een dakkapel?", a: "Kunststof is het meest populair vanwege de lage onderhoudskosten. Hout biedt een klassieke uitstraling maar vergt meer onderhoud. Polyester is onderhoudsvrij maar duurder." },
    ];

    return (
        <div className="faq-list">
            {items.map((item, i) => (
                <div key={i} className={`faq-item ${open === i ? "faq-item--open" : ""}`}>
                    <button onClick={() => setOpen(open === i ? null : i)} className="faq-question">
                        <span>{item.q}</span>
                        <span className="faq-chevron">▼</span>
                    </button>
                    <div className="faq-answer">
                        <p>{item.a}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ————————————————————————————————————————————
   Main Homepage Component
———————————————————————————————————————————— */
export default function HomeClient() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showStickyCta, setShowStickyCta] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowStickyCta(window.scrollY > 600);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        analytics.formView();
    }, []);

    return (
        <div className="home">
            {/* Header */}
            <header className="site-header">
                <div className="header-inner">
                    <Link href="/" className="site-logo">
                        Dakkapellen<span>Kosten</span>.nl
                    </Link>
                    <nav className="site-nav">
                        <a href="#kosten" className="nav-link">Kosten</a>
                        <a href="#hoe-werkt-het" className="nav-link">Hoe werkt het</a>
                        <Link href="/kenniscentrum" className="nav-link">Kenniscentrum</Link>
                        <a href="#faq" className="nav-link">FAQ</a>
                        <a href="#offerte" className="nav-cta">Gratis offertes →</a>
                    </nav>
                    <button
                        className="mobile-menu-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Menu"
                    >
                        {mobileMenuOpen ? "✕" : "☰"}
                    </button>
                </div>
                {mobileMenuOpen && (
                    <nav className="mobile-nav" onClick={() => setMobileMenuOpen(false)}>
                        <a href="#offerte" className="mobile-nav-link mobile-nav-cta">Gratis offertes →</a>
                        <a href="#kosten" className="mobile-nav-link">Kosten</a>
                        <a href="#hoe-werkt-het" className="mobile-nav-link">Hoe werkt het</a>
                        <Link href="/kenniscentrum" className="mobile-nav-link">Kenniscentrum</Link>
                        <a href="#faq" className="mobile-nav-link">FAQ</a>
                    </nav>
                )}
            </header>

            {/* Hero */}
            <section className="hero">
                <div className="hero-bg-orb" />
                <div className="hero-inner">
                    <div className="hero-content fade-in">
                        <div className="hero-badge">✓ 100% gratis &amp; vrijblijvend</div>
                        <h1 className="hero-title fade-in delay-1">
                            Dakkapel offertes vergelijken?{" "}
                            <span className="text-amber">Ontvang gratis vrijblijvende offertes!</span>
                        </h1>
                        <p className="hero-subtitle fade-in delay-2">
                            Vergelijk prijzen van meerdere dakkapel specialisten in jouw regio.
                            Bespaar tot 35% door offertes te vergelijken.
                        </p>
                        <div className="hero-ctas fade-in delay-3">
                            <a href="#offerte" className="btn btn--primary">Nu gratis offertes vergelijken →</a>
                            <a href="#kosten" className="btn btn--outline">Bekijk gemiddelde kosten</a>
                        </div>
                        <div className="hero-trust fade-in delay-3">
                            <div className="trust-check"><span className="check">✓</span> Vergelijk meerdere offertes</div>
                            <div className="trust-check"><span className="check">✓</span> Snel reactie van specialisten</div>
                            <div className="trust-check"><span className="check">✓</span> Geen verplichtingen</div>
                        </div>
                    </div>
                    <div className="hero-form fade-in delay-2">
                        <LeadForm />
                    </div>
                </div>
            </section>

            {/* Trust Bar */}
            <section className="trust-bar">
                <div className="trust-bar-inner">
                    {[
                        { icon: "✓", text: "100% gratis & vrijblijvend", cls: "trust-icon--green" },
                        { icon: "📋", text: "Vergelijk meerdere offertes", cls: "trust-icon--blue" },
                        { icon: "🏠", text: "Onafhankelijke informatie", cls: "trust-icon--navy" },
                        { icon: "⚡", text: "Snel en eenvoudig geregeld", cls: "trust-icon--amber" },
                    ].map(item => (
                        <div key={item.text} className="trust-item">
                            <div className={`trust-icon ${item.cls}`}>{item.icon}</div>
                            <span className="trust-text">{item.text}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section id="hoe-werkt-het" className="section section--gray">
                <div className="section-inner">
                    <p className="section-label">Hoe werkt het</p>
                    <h2 className="section-title">In 3 stappen naar de beste dakkapel offerte</h2>
                    <p className="section-subtitle">Geen gedoe, geen verplichtingen. Binnen een paar minuten weet je waar je aan toe bent.</p>
                    <div className="steps-grid">
                        {[
                            { num: "1", icon: "📝", title: "Vul je wensen in", desc: "Beantwoord een paar korte vragen over je gewenste dakkapel. Dit kost je minder dan 2 minuten.", cls: "step-num--navy" },
                            { num: "2", icon: "📬", title: "Ontvang gratis offertes", desc: "Na je aanvraag ontvang je vrijblijvende reacties van dakkapel specialisten die actief zijn in jouw regio.", cls: "step-num--amber" },
                            { num: "3", icon: "🏆", title: "Vergelijk prijs & kwaliteit", desc: "Vergelijk de offertes op prijs, materiaal en reviews. Kies de specialist die het beste bij jou past.", cls: "step-num--navy" },
                        ].map(step => (
                            <div key={step.num} className="step-card">
                                <div className={`step-num ${step.cls}`}>{step.num}</div>
                                <div className="step-icon">{step.icon}</div>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-desc">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="section-cta">
                        <a href="#offerte" className="btn btn--primary">Start nu — het is gratis →</a>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="kosten" className="section section--white">
                <div className="section-inner">
                    <p className="section-label">Dakkapel kosten</p>
                    <h2 className="section-title">Wat kost een dakkapel in 2026?</h2>
                    <p className="section-subtitle">Prijzen zijn afhankelijk van type, breedte, materiaal en complexiteit van de plaatsing.</p>
                    <div className="pricing-grid">
                        {[
                            { type: "Prefab dakkapel", badge: "Populair", badgeCls: "badge--green", price: "€4.500 – €7.500", features: ["Snelle plaatsing (1 dag)", "Standaard afmetingen", "Meest gekozen optie"], borderColor: "#2E8B57" },
                            { type: "Traditionele dakkapel", badge: "Maatwerk", badgeCls: "badge--blue", price: "€7.000 – €15.000", features: ["Volledig op maat", "Meer design opties", "3-5 dagen plaatsing"], highlight: true, borderColor: "#24507A" },
                            { type: "Dakkapel 5 meter+", badge: "Extra groot", badgeCls: "badge--amber", price: "€10.000 – €18.000+", features: ["Maximaal extra ruimte", "Vergunning vaak nodig", "Professionele montage"], borderColor: "#F59E0B" },
                        ].map(card => (
                            <div key={card.type} className={`price-card ${card.highlight ? "price-card--highlight" : ""}`} style={{ borderTopColor: card.borderColor }}>
                                <span className={`price-badge ${card.badgeCls}`}>{card.badge}</span>
                                <h3 className="price-type">{card.type}</h3>
                                <div className="price-amount">{card.price}</div>
                                <ul className="price-features">
                                    {card.features.map(f => (
                                        <li key={f}><span className="check">✓</span> {f}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="section-cta">
                        <a href="#offerte" className="btn btn--primary">Vergelijk offertes voor jouw dakkapel →</a>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="section section--gray">
                <div className="section-inner">
                    <p className="section-label">Veelgestelde vragen</p>
                    <h2 className="section-title">Alles wat je wilt weten over dakkapellen</h2>
                    <FAQ />
                </div>
            </section>

            {/* Final CTA */}
            <section className="final-cta">
                <div className="final-cta-glow" />
                <div className="final-cta-inner">
                    <h2 className="final-cta-title">Klaar om dakkapel kosten te vergelijken?</h2>
                    <p className="final-cta-sub">
                        Ontvang binnen 48 uur tot 4 vrijblijvende offertes van betrouwbare dakkapel specialisten.
                        100% gratis, geen verplichtingen.
                    </p>
                    <a href="#offerte" className="btn btn--primary btn--large">Nu gratis offertes vergelijken →</a>
                    <div className="final-cta-checks">
                        {["Gratis & vrijblijvend", "Meerdere offertes", "Geen verborgen kosten"].map(t => (
                            <div key={t} className="trust-check trust-check--light"><span className="check">✓</span> {t}</div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="site-footer">
                <div className="footer-inner">
                    <div className="footer-brand">
                        <div className="site-logo footer-logo">Dakkapellen<span>Kosten</span>.nl</div>
                        <p className="footer-desc">Onafhankelijk platform voor het vergelijken van dakkapel offertes. Altijd gratis en vrijblijvend.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Informatie</h4>
                        <a href="#kosten">Kosten</a>
                        <a href="#hoe-werkt-het">Hoe werkt het</a>
                        <a href="#faq">FAQ</a>
                    </div>
                    <div className="footer-col">
                        <h4>Kenniscentrum</h4>
                        <Link href="/kenniscentrum">Alle artikelen</Link>
                    </div>
                    <div className="footer-col">
                        <h4>Platform</h4>
                        <Link href="/login">Inloggen</Link>
                        <Link href="/signup">Registreren</Link>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} DakkapellenKosten.nl — Alle rechten voorbehouden</p>
                </div>
            </footer>

            {/* Sticky Mobile CTA */}
            <div className={`sticky-cta ${showStickyCta ? "sticky-cta--visible" : ""}`}>
                <a href="#offerte" className="sticky-cta-btn">Gratis offertes vergelijken →</a>
            </div>
        </div>
    );
}
