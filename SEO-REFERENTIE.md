# DakkapellenKosten.nl — SEO Master Referentie v2.1

**Gegenereerd:** 21 maart 2026
**Status:** Geüpdatete SEO master referentie
**Live preview:** https://dakkapellenkosten.vercel.app
**Productie domein:** https://dakkapellenkosten.nl

> **Opmerking:** DNS voor productie is nog niet actief. Alle canonicals en metadata moeten wel op productie-URL gericht blijven.

---

## 1. Doel van dit document

Dit document is de centrale SEO-bron voor DakkapellenKosten.nl.
Het beschrijft:

- de huidige SEO-status van de website
- wat technisch al is ingericht
- hoe content gestructureerd is
- welke SEO-richtlijnen voor alle pagina's gelden
- wat het SEO-team hierna nog moet uitvoeren

Dit document moet door AI, contentteam en developers gebruikt worden als **single source of truth**.

---

## 2. SEO-doel van het platform

DakkapellenKosten.nl moet organisch verkeer aantrekken op drie hoofdlagen:

### A. Commerciële zoekintentie

- dakkapel kosten
- wat kost een dakkapel
- dakkapel offerte
- dakkapel offertes vergelijken
- prefab dakkapel kosten
- kunststof dakkapel kosten
- dakkapel specialist

### B. Informatieve zoekintentie

- vergunning dakkapel regels
- dakkapel zonder vergunning
- kunststof of houten dakkapel
- prefab of traditionele dakkapel
- dakkapel in 1 dag plaatsen
- lekkage bij dakkapel
- onderhoud dakkapel

### C. Lokale zoekintentie

- dakkapel amsterdam
- dakkapel utrecht
- dakkapel rotterdam prijzen
- vergunning dakkapel den haag
- dakkapel specialist eindhoven

**Primair businessdoel:** meer offerte-aanvragen genereren.
**Primair SEO-doel:** topical authority opbouwen rond kosten, vergunning, materialen, plaatsing, onderhoud en lokale dakkapel-pagina's.

---

## 3. Huidige SEO-status — samenvatting

### Homepage ✅
- SEO title geüpgraded
- meta description aangescherpt
- JSON-LD: Organization, WebSite, FAQPage, HowTo
- OG metadata aanwezig
- Twitter metadata aanwezig

### Kenniscentrum hub ✅
- omgebouwd van passief archief naar actieve cluster hub
- 6 pillar categorie-links toegevoegd
- "Laatst bijgewerkt" sectie toegevoegd
- artikelen gegroepeerd per categorie
- breadcrumbs, CTA, OG metadata aanwezig

### Artikelpagina's ✅
- gerelateerde artikelen blok toegevoegd
- CTA blok toegevoegd
- BlogPosting JSON-LD aanwezig
- BreadcrumbList JSON-LD aanwezig
- OG article metadata met published/modified timestamps
- breadcrumbs / header / footer aanwezig

### Geo-pages ✅ (technisch)
- route staat technisch klaar
- contentbeheer via `/admin/pages`
- Service JSON-LD, BreadcrumbList, OG/Twitter metadata aanwezig
- **Nog niet inhoudelijk gevuld**

### Technical SEO ✅
- `robots.ts` blokkeert admin/dashboard/API-routes voor crawlers
- sitemap-systeem aanwezig
- SEO referentiebestand opnieuw gegenereerd
- TypeScript status: 0 errors

---

## 4. Homepage SEO

| Veld | Waarde |
|------|--------|
| **URL** | `/` |
| **SEO title** | Dakkapel offertes vergelijken in 2026 \| Gratis offertes aanvragen |
| **Structured data** | Organization, WebSite, FAQPage (6 vragen), HowTo (3 stappen) |
| **Social metadata** | OG + Twitter/X cards |

**SEO-rol:** Primaire commerciële landingspagina. Moet ranken op:
- dakkapel offertes vergelijken
- dakkapel offertes
- dakkapel kosten
- dakkapel vergelijken

**Homepage focus:** vergelijken, vrijblijvende offertes, duidelijke keuzehulp.

---

## 5. Kenniscentrum hub

| Veld | Waarde |
|------|--------|
| **URL** | `/kenniscentrum` |
| **Rol** | SEO cluster hub (niet een simpele blogindex) |

**Aanwezig:**
- 6 pillar category quick-links: 💰 Kosten, 📋 Vergunning, 🔨 Materialen, 🏗️ Plaatsing, 🔧 Onderhoud, 💡 Keuzehulp
- "Laatst bijgewerkt" sectie
- Artikelen per categorie gegroepeerd
- Breadcrumbs, CTA, OG metadata

**Doel:** topical authority versterken, crawlroutes verbeteren, gebruikers naar clusters leiden, interne linkwaarde verdelen.

---

## 6. Artikelpagina's

| Veld | Waarde |
|------|--------|
| **Route** | `/kenniscentrum/[slug]` |
| **Structured data** | BlogPosting + BreadcrumbList |

**Aanwezig op alle artikelpagina's:**
- header, footer, breadcrumbs
- CTA-blok onderaan
- gerelateerde artikelen blok (4 uit dezelfde categorie)
- OG metadata inclusief publish/modified time

**Elke artikelpagina moet minimaal één functie vervullen:**
- informatieve vraag beantwoorden
- keuzehulp bieden
- bezwaar wegnemen
- doorsturen naar offerteflow of verwante money page

---

## 7. Geo-pages

| Veld | Waarde |
|------|--------|
| **Route** | `/[slug]` |
| **Status** | Technisch klaar, content nog aanmaken via `/admin/pages` |
| **Structured data** | Service + BreadcrumbList |

> [!IMPORTANT]
> Geo-pages zijn nog niet inhoudelijk gevuld. De technische basis staat, de SEO-kans ligt open. De contentkwaliteit gaat bepalen of deze pagina's ranking potentie krijgen.

---

## 8. Contentarchitectuur

De site draait op **6 hoofdclusters**:

| Cluster | Pillar slug |
|---------|-------------|
| 💰 Dakkapel kosten | `wat-kost-een-dakkapel` |
| 📋 Vergunning & regels | `vergunning-dakkapel-regels` |
| 🔨 Materialen | `soorten-dakkapellen` |
| 🏗️ Plaatsing & proces | `dakkapel-laten-plaatsen` |
| 🔧 Onderhoud & problemen | `onderhoud-dakkapel` |
| 💡 Keuzehulp / vergelijken | `offerte-dakkapel-vergelijken` |

Deze structuur moet overal terugkomen in: hub-indeling, interne linking, contentbriefings, geo-page context, CTA-logica.

---

## 9. Metadata regels voor alle pagina's

### SEO title regels
- Elke title uniek
- Primaire keyword bevatten
- Natuurlijk lezen
- Geen keyword stuffing
- Zoekintentie reflecteren

**Title formule per type:**

| Type | Format |
|------|--------|
| Homepage | `[Primair keyword] \| [conversiebelofte]` |
| Pillar artikel | `[Hoofdonderwerp] in 2026 \| [duidelijke belofte]` |
| Clusterartikel | `[Long-tail keyword] \| [uitleg of voordeel]` |
| Geo-page | `Dakkapel [stad] \| Prijzen, regels en offertes 2026` |

### Meta description regels
- Uniek, concreet, aansluitend op pagina-intentie
- Gebruik: "Vergelijk", "Lees", "Bekijk", "Ontdek", "Vraag gratis offertes aan"
- Vermijd: overdreven claimtaal, generieke marketingzinnen, herhaalde patronen

### Canonical regels
- Elke indexeerbare pagina: self-referencing canonical
- Altijd op productie-URL
- Consistent formaat
- Niet naar preview-URL verwijzen

---

## 10. Interne linkstrategie

### Verplicht op artikelniveau
- 4 gerelateerde artikelen tonen
- Logisch linken binnen dezelfde categorie
- Gebruiker richting volgende stap sturen

### Gewenste linklagen
1. Clusterintern
2. Naar pillar / hoofdonderwerp
3. Naar conversiepunt
4. Later naar relevante geo-page

### Anchor text regels

| ✅ Goed | ❌ Vermijd |
|---------|---------|
| dakkapel kosten in 2026 | lees meer |
| vergunning voor een dakkapel | klik hier |
| prefab dakkapel kosten | bekijk dit artikel |
| kunststof of houten dakkapel | |

---

## 11. Structured data beleid

| Paginatype | Schemas |
|------------|---------|
| Homepage | Organization, WebSite, FAQPage, HowTo |
| Artikelen | BlogPosting, BreadcrumbList |
| Geo-pages | Service, BreadcrumbList |

> [!WARNING]
> Structured data moet altijd overeenkomen met zichtbare content op de pagina. Geen schema toevoegen voor onderdelen die niet daadwerkelijk zichtbaar zijn.

---

## 12. OG / social metadata beleid

Alle indexeerbare pagina's hebben:
- `og:title`, `og:description`, `og:url`, `og:type`, `og:site_name`
- `twitter:card`, `twitter:title`, `twitter:description`

**Doel:** betere shares, professionelere previews, consistenter merkbeeld.

---

## 13. Technical SEO status

| Item | Status |
|------|--------|
| `robots.ts` | ✅ Blokkeert admin/dashboard/API |
| Sitemap | ✅ Automatisch uit DB |
| Canonicals | ✅ Naar productie-URL |
| TypeScript | ✅ 0 errors |
| Preview vs productie | ⚠️ DNS nog niet actief |

---

## 14. SEO contentregels

### Zoekintentie eerst
Bepaal per pagina: informatief, commercieel, vergelijkend, lokaal, probleemoplossend. Content moet volledig in lijn zijn met die intentie.

### Schrijfstijl
- Helder Nederlands, direct, geen AI-fluff
- Geen lege alinea's, geen overdreven salescopy
- Betrouwbaar en praktisch

### Structuur per artikel
H1 → Direct antwoord in intro → H2-structuur → Praktische uitleg → Vergelijking/voorbeelden → FAQ → CTA → Interne links

### Kwaliteitsgrens
Content moet echt antwoord geven, logisch opgebouwd zijn, leesbaar blijven. Niet alleen bestaan om een keyword te targeten.

---

## 15. Geo-page richtlijnen

### Eerste batch
1. Amsterdam
2. Rotterdam
3. Utrecht
4. Den Haag
5. Eindhoven

### Elke geo-page moet bevatten
- Unieke intro met lokale context
- Prijsindicatie
- Vergunning / lokale toetsing
- Populaire keuzes
- FAQ
- CTA

### Wat niet mag
- ❌ Copy-paste met alleen stadsnaam vervangen
- ❌ Generieke city-swap content
- ❌ Onbewijsbare lokale claims
- ❌ Dunne pagina's zonder echte waarde

### Format

| Veld | Format |
|------|--------|
| H1 | Dakkapel plaatsen in [stad] |
| SEO title | Dakkapel [stad] \| Prijzen, regels en offertes 2026 |
| Meta description | Vergelijk gratis dakkapel offertes in [stad]. Bekijk prijsindicaties, aandachtspunten en informatie over vergunningen en plaatsing. |

---

## 16. Pagina-prioriteiten

### Tier 1 (hoogste prioriteit)
- Homepage
- Kenniscentrum hub
- `wat-kost-een-dakkapel`
- `vergunning-dakkapel-regels`
- `offerte-dakkapel-vergelijken`
- Eerste 5 geo-pages

### Tier 2
- `prefab-dakkapel-kosten`
- `traditionele-dakkapel-kosten`
- `kunststof-dakkapel-kosten`
- `vergunningsvrije-dakkapel-achterkant`
- `vergunning-dakkapel-voorkant`
- `dakkapel-laten-plaatsen`
- `onderhoud-dakkapel`

---

## 17. Wat het SEO-team nu nog moet doen

### 1. Eerste 5 geo-pages aanmaken
Via `/admin/pages`: Amsterdam, Rotterdam, Utrecht, Den Haag, Eindhoven

### 2. SEO fields van artikelen reviewen
Gebruik `SEO-REFERENTIE.md` als checklist voor: SEO titles, meta descriptions, canonicals, category checks, contentkwaliteit

### 3. Sitemap indienen in Google Search Console
Zodra productie live staat: sitemap submitten, indexatie monitoren, prestaties volgen

---

## 18. QA checklist per pagina

### Metadata
- [ ] Unieke SEO title
- [ ] Unieke meta description
- [ ] Correcte canonical
- [ ] OG metadata aanwezig
- [ ] Juiste indexatiestatus

### Content
- [ ] Zoekintentie klopt
- [ ] Hoofdkeyword goed verwerkt
- [ ] Intro beantwoordt de hoofdvraag
- [ ] H-structuur logisch
- [ ] FAQ waar relevant
- [ ] CTA aanwezig

### SEO-structuur
- [ ] Breadcrumbs aanwezig
- [ ] Interne links aanwezig
- [ ] Structured data klopt
- [ ] Categorie klopt
- [ ] Geen duplicate content

### Kwaliteit
- [ ] Leest als mens
- [ ] Niet opgeblazen
- [ ] Niet repetitief
- [ ] Niet juridisch te stellig
- [ ] Niet geschreven als AI-vulling

---

## 19. AI-instructie voor verdere SEO-verbetering

```
AI SEO INSTRUCTION

Je werkt voor DakkapellenKosten.nl.
Je taak is om bestaande en nieuwe pagina's te beoordelen en te verbeteren.

Prioriteiten:
- zoekintentie correct matchen
- title tag verbeteren
- meta description verbeteren
- H-structuur aanscherpen
- interne links verbeteren
- CTA verbeteren
- FAQ uitbreiden waar logisch
- duplicate content vermijden
- commerciële relevantie verhogen zonder spam
- content menselijk, nuttig en betrouwbaar houden

Regels:
- schrijf in helder Nederlands
- geen AI-fluff
- geen keyword stuffing
- geen city-swap spam
- geen overdreven claims
- wees zorgvuldig bij vergunninginformatie
- schrijf vanuit een vergelijkingsplatform

Output per pagina:
- URL / Type / Zoekintentie / Primair keyword / Secundaire keywords
- Huidige problemen
- Verbeterde metadata (SEO title, Meta description, Canonical)
- Aanbevolen H-structuur
- Interne links (anchor text → doelpagina)
- FAQ suggesties
- Conversieverbeteringen
```

---

## 20. Slotconclusie

DakkapellenKosten.nl is niet meer alleen een website met artikelen. De basis staat nu als een echte SEO-structuur:

- ✅ Homepage inhoudelijk en technisch versterkt
- ✅ Kenniscentrum is een cluster hub geworden
- ✅ Artikelpagina's hebben interne linking en conversion paths
- ✅ Geo-page systeem is technisch klaar
- ✅ Technical SEO staat netjes
- ✅ Contentreferentie opnieuw opgebouwd

**De grootste volgende winst zit in:**
1. Geo-pages live zetten
2. Artikelmetadata verder aanscherpen
3. Content per cluster doorontwikkelen
4. Search Console gebruiken zodra productie live is
