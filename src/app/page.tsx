/**
 * Homepage — DakkapellenKosten.nl
 * Premium lead-generation landing page with full SEO metadata + JSON-LD
 */

import type { Metadata } from "next";
import HomeClient from "./home-client";

export const metadata: Metadata = {
    title: "Dakkapel offertes vergelijken in 2026 | Gratis offertes aanvragen",
    description:
        "Vergelijk gratis dakkapel offertes van specialisten in jouw regio. Ontvang binnen 48 uur tot 4 vrijblijvende offertes en vergelijk prijs, materiaal en uitvoering.",
    alternates: { canonical: "https://dakkapellenkosten.nl/" },
    openGraph: {
        title: "Dakkapel offertes vergelijken in 2026 | Gratis offertes aanvragen",
        description: "Vergelijk gratis dakkapel offertes van specialisten in jouw regio. Ontvang binnen 48 uur tot 4 vrijblijvende offertes en vergelijk prijs, materiaal en uitvoering.",
        url: "https://dakkapellenkosten.nl/",
        type: "website",
        locale: "nl_NL",
        siteName: "DakkapellenKosten.nl",
    },
    twitter: {
        card: "summary_large_image",
        title: "Dakkapel offertes vergelijken in 2026 | Gratis offertes aanvragen",
        description: "Vergelijk gratis dakkapel offertes van specialisten in jouw regio. Bespaar door offertes te vergelijken.",
    },
};

const jsonLd = [
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://dakkapellenkosten.nl/#organization",
        name: "DakkapellenKosten.nl",
        url: "https://dakkapellenkosten.nl/",
        email: "info@dakkapellenkosten.nl",
        contactPoint: [{
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "info@dakkapellenkosten.nl",
            availableLanguage: ["Dutch"],
            areaServed: "NL",
        }],
    },
    {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://dakkapellenkosten.nl/#website",
        url: "https://dakkapellenkosten.nl/",
        name: "DakkapellenKosten.nl",
        inLanguage: "nl-NL",
        publisher: { "@id": "https://dakkapellenkosten.nl/#organization" },
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            { "@type": "Question", name: "Wat kost een dakkapel in 2026?", acceptedAnswer: { "@type": "Answer", text: "De kosten variëren van €4.500 voor een kleine prefab dakkapel tot €18.000+ voor een grote traditionele dakkapel. De exacte prijs hangt af van het type, de breedte, het materiaal en de complexiteit van de plaatsing." } },
            { "@type": "Question", name: "Is een vergunning nodig voor een dakkapel?", acceptedAnswer: { "@type": "Answer", text: "Aan de achterkant is een dakkapel vaak vergunningsvrij, mits deze aan bepaalde afmetingen voldoet. Aan de voorkant of bij monumentale panden is vrijwel altijd een omgevingsvergunning nodig." } },
            { "@type": "Question", name: "Wat is het verschil tussen een prefab en traditionele dakkapel?", acceptedAnswer: { "@type": "Answer", text: "Een prefab dakkapel wordt in de fabriek gemaakt en in één dag geplaatst. Een traditionele dakkapel wordt op locatie gebouwd en biedt meer maatwerk mogelijkheden, maar duurt langer en kost meer." } },
            { "@type": "Question", name: "Hoe lang duurt het plaatsen van een dakkapel?", acceptedAnswer: { "@type": "Answer", text: "Een prefab dakkapel kan in 1 dag geplaatst worden. Een traditionele dakkapel duurt gemiddeld 3-5 werkdagen. Inclusief voorbereiding moet je rekenen op 2-6 weken totaal." } },
            { "@type": "Question", name: "Hoeveel waarde voegt een dakkapel toe aan mijn woning?", acceptedAnswer: { "@type": "Answer", text: "Een dakkapel voegt gemiddeld €15.000 tot €25.000 toe aan de woningwaarde, afhankelijk van de grootte, het materiaal en de locatie van je woning." } },
            { "@type": "Question", name: "Welk materiaal is het beste voor een dakkapel?", acceptedAnswer: { "@type": "Answer", text: "Kunststof is het meest populair vanwege de lage onderhoudskosten. Hout biedt een klassieke uitstraling maar vergt meer onderhoud. Polyester is onderhoudsvrij maar duurder." } },
        ],
    },
    {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "Dakkapel offertes vergelijken",
        description: "In 3 stappen naar de beste dakkapel offerte",
        step: [
            { "@type": "HowToStep", position: 1, name: "Vul je wensen in", text: "Beantwoord een paar korte vragen over je gewenste dakkapel. Dit kost je minder dan 2 minuten." },
            { "@type": "HowToStep", position: 2, name: "Ontvang gratis offertes", text: "Na je aanvraag ontvang je vrijblijvende reacties van dakkapel specialisten in jouw regio." },
            { "@type": "HowToStep", position: 3, name: "Vergelijk prijs & kwaliteit", text: "Vergelijk de offertes op prijs, materiaal en reviews. Kies de specialist die het beste bij jou past." },
        ],
    },
];

export default function HomePage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <HomeClient />
        </>
    );
}
