---
name: Homepage Rebuild — DakkapellenKosten.nl
description: Complete specification for rebuilding the homepage into a premium, high-converting lead-generation landing page. Covers every section, pixel-level design decisions, animations, responsive behavior, content, and technical implementation details.
---

# Homepage Rebuild — DakkapellenKosten.nl

## Context & Goal

DakkapellenKosten.nl is an **independent Dutch lead-generation and comparison platform** for homeowners looking for dakkapel (dormer window) quotes. The homepage is the primary conversion page — its #1 job is to **get visitors to submit the lead form** while positioning the brand as trustworthy, transparent, and expert.

**Target audience**: Dutch homeowners (25–65) considering a dakkapel. They search Google for "dakkapel kosten", "dakkapel offerte", etc. They land on this page and need to feel confident enough to request free quotes.

**Technology**: Static HTML + Vanilla CSS + Vanilla JS. No frameworks. The page lives at `/index.html` with `css/style.css` and `js/main.js`.

**Responsive strategy**: Desktop and mobile are **equally important**. Design must be flawless on both. Use a fluid responsive approach — not just "stack on mobile" but genuinely optimized layouts for each.

---

## Frontend Design Philosophy

> Based on [Anthropic's Frontend Design Plugin](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design) and the [Frontend Aesthetics Cookbook](https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb).

### Design Thinking — Applied to DakkapellenKosten.nl

Before coding, understand our context and aesthetic direction:

- **Purpose**: Lead-generation landing page for Dutch homeowners. Must convert visitors into quote requests while building trust through expertise and transparency.
- **Tone**: **Refined & trustworthy** — not flashy startup energy, not corporate boring. Think: a premium comparison platform that feels serious yet approachable. Clean lines, confident typography, warm amber accents against a navy authority palette.
- **Differentiation**: The thing visitors should remember is **clarity + confidence**. Every element says "we know dakkapellen, we're on your side, no pressure." The form feels inviting, not pushy.

### Key Aesthetic Principles to Apply

1. **Typography with intention**: Inter is our font — use it with extreme attention to weight hierarchy. H1 at 800 weight feels authoritative. Body at 400 feels approachable. The contrast between these weights IS the personality. Use `letter-spacing: -0.02em` on headings for tightness.

2. **Color as communication**: Navy (#16324F) = authority/trust. Amber (#F59E0B) = action/urgency. Green (#2E8B57) = validation/safety. Never use these randomly. Every color choice carries meaning. Dominant navy with sharp amber accents outperforms timid, evenly-distributed palettes.

3. **Motion that serves purpose**: Focus on high-impact moments:
   - **Page load**: One well-orchestrated hero reveal with staggered elements (badge → headline → subtitle → CTAs → trust items) creates more delight than scattered micro-interactions
   - **Scroll reveals**: Fade-up + slight scale for sections entering viewport
   - **Hover states that reward interaction**: Cards lift, arrows slide, borders appear
   - **Form feedback**: Real-time validation colors give confidence

4. **Spatial composition**: 
   - Generous negative space between sections prevents cognitive overload
   - The hero uses deliberate asymmetry (content left, form right) to create visual flow
   - Cards use consistent padding and gaps for rhythm
   - Trust bar provides a visual breather between hero and content sections

5. **Backgrounds that create depth**:
   - Hero: Subtle gradient + decorative radial gradient circle + faint dot grid pattern
   - Alternating section backgrounds (white ↔ light gray) create natural content separation
   - Final CTA: Navy with radial gradient glow creates dramatic contrast
   - All decorative elements at very low opacity (2-5%) — atmosphere, not distraction

### Patterns From the Frontend Aesthetics Cookbook to Apply

These specific patterns from the Cookbook example (Momentum landing page) should be adapted for our context:

```css
/* Feature card top-border reveal on hover */
.card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 4px;
  background: linear-gradient(90deg, var(--navy), var(--cta));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}
.card:hover::before { transform: scaleX(1); }

/* CTA button ripple effect on hover */
.btn--primary::before {
  content: '';
  position: absolute;
  top: 50%; left: 50%;
  width: 0; height: 0;
  border-radius: 50%;
  background: rgba(255,255,255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.5s, height 0.5s;
}
.btn--primary:hover::before { width: 300px; height: 300px; }

/* Animated gradient background for hero */
.hero::after {
  content: '';
  position: absolute;
  width: 200%; height: 200%;
  background:
    radial-gradient(circle at 20% 50%, rgba(36,80,122,0.06) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(245,158,11,0.04) 0%, transparent 50%);
  animation: float 20s ease-in-out infinite;
  pointer-events: none;
}
@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(20px, -20px); }
  66% { transform: translate(-15px, 15px); }
}

/* Staggered fade-in on page load for hero elements */
.fade-in { opacity:0; transform:translateY(30px); animation: fadeInUp 0.8s ease forwards; }
@keyframes fadeInUp { to { opacity:1; transform:translateY(0); } }
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
```

### What NOT to Do (Anti-patterns from the Cookbook)

- ❌ Don't use purple gradients on white backgrounds — that's generic AI aesthetic
- ❌ Don't switch to trendy fonts like Space Grotesk — Inter is established for this brand
- ❌ Don't over-animate — this is a trust-focused conversion page, not a portfolio
- ❌ Don't use TailwindCSS — we use vanilla CSS with a design system
- ❌ Don't make every card hover effect identical — vary the intensity (subtle for info cards, more dramatic for CTAs)

---

## Design System (Existing — Preserve & Enhance)

### Color Palette
```
--navy:         #16324F    (primary brand, headers, footer)
--blue:         #24507A    (links, accents, section labels)
--blue-light:   #2d6399    (hover states)
--cta:          #F59E0B    (amber — all CTA buttons)
--cta-hover:    #D97706    (amber hover)
--success:      #2E8B57    (green — trust signals, checkmarks)
--bg:           #F7F9FC    (light gray background)
--white:        #FFFFFF
--text-dark:    #1E293B
--text-muted:   #4B5563
--text-light:   #64748B
--border:       #D9E2EC
--border-light: #E8EEF4
```

**Keep this palette.** The navy/amber combination is strong for trust + urgency. Do not change the core colors.

### Typography
- **Font**: Inter (Google Fonts) — already imported, keep it
- **Weights used**: 400, 500, 600, 700, 800
- **Scale**: Already defined from `--fs-xs` (0.75rem) to `--fs-4xl` (3rem) — keep this

### Spacing & Sizing
- Keep the existing spacing tokens (`--sp-1` through `--sp-24`)
- Keep the existing radius tokens (`--radius-sm` through `--radius-xl`)
- Keep the existing shadow tokens (`--shadow-sm` through `--shadow-lg`)

---

## Section-by-Section Specification

### 1. HEADER / NAVIGATION

**What exists**: Fixed header with logo, nav links (Kosten, Hoe werkt het, Vergelijken, Kenniscentrum, FAQ), CTA button, hamburger menu on mobile.

**Keep as-is**, with these enhancements:

- [ ] Add a subtle `backdrop-filter: blur(12px)` (already done) + **decrease opacity slightly** when scrolled: `background: rgba(255,255,255, 0.92)` for a more modern glass feel
- [ ] On scroll > 50px, add `box-shadow` (already done ✓)
- [ ] Mobile nav: keep full-screen slide-in overlay. Add smooth animated hamburger → X transition (already done ✓)
- [ ] **Logo**: Text-only logo `DakkapellenKosten.nl` with "Kosten" in amber. Keep this — no image logo needed
- [ ] Header height: 72px (keep)
- [ ] **Active nav indicator**: Add underline animation on hover (already done ✓). Add `nav__link--active` class for the current page

**Desktop nav order**: Kosten | Hoe werkt het | Vergelijken | Kenniscentrum | FAQ | [Gratis offertes →] (button)

**Mobile**: Hamburger → full-screen nav with large tap targets (already done ✓)

---

### 2. HERO SECTION

**This is the most critical section on the page.** It must be premium, impactful, and immediately drive form submissions.

**Layout**: Two columns on desktop (content left, form right). Stack on mobile (content on top, form below).

#### Left column — Content:

- [ ] **Badge**: Keep green pill badge "✓ 100% gratis & vrijblijvend" at top
- [ ] **H1**: `Dakkapel offertes vergelijken?` (line break) `Ontvang gratis vrijblijvende offertes!` — the second line in amber (`--cta`) with a subtle animated underline decoration
- [ ] **Subtitle**: Keep current text. Font size `--fs-lg`, muted color, max-width 520px
- [ ] **Two CTA buttons**:
  - Primary: "Nu gratis offertes vergelijken →" (amber, links to form)
  - Secondary: "Bekijk gemiddelde kosten" (white outline, links to #kosten)
- [ ] **Trust items**: Three items with green checkmarks:
  - "Vergelijk meerdere offertes"
  - "Snel reactie van specialisten"  
  - "Geen verplichtingen"

#### Right column — Lead Form Card:

- [ ] White card with `--radius-xl` (24px), `--shadow-lg`, subtle border
- [ ] **Card header**: "Ontvang gratis dakkapel offertes" (h3)
- [ ] **Subtext**: "Vul je gegevens in en ontvang binnen 48 uur tot 4 vrijblijvende offertes."
- [ ] **Form fields** (keep current set):
  1. Type dakkapel (select: Prefab / Traditioneel / Weet ik nog niet)
  2. Gewenste breedte (select: Tot 2m / ±3m / ±4m / 5m+ / Weet ik nog niet)
  3. Postcode (text input, Dutch format auto-formatting)
  4. Naam (text input)
  5. E-mailadres (text input)
  6. Telefoonnummer (text input)
- [ ] **Submit button**: Full-width amber "Nu gratis offertes vergelijken →"
- [ ] **Form trust**: Lock icon + "Je gegevens zijn veilig en worden niet gedeeld met derden."
- [ ] **Validation**: Real-time border colors (red for invalid, green for valid on blur). Dutch postcode regex. Email regex. All fields required.
- [ ] **Submit behavior**: POST to `/api/leads`. Show success state (green button "✓ Aanvraag verzonden!") or error state (red button with message). Reset after 4 seconds.

#### Hero Background:

- [ ] Keep the current subtle gradient: `linear-gradient(165deg, #f0f4f9 0%, var(--bg) 40%, var(--white) 100%)`
- [ ] Keep the decorative circle pseudo-element (top-right, subtle blue radial gradient)
- [ ] **Add**: A very subtle geometric pattern overlay or grid dots at ~3% opacity for depth. CSS-only, no image.
- [ ] **Add**: Soft animated gradient orb that slowly drifts (pure CSS, `@keyframes`, very subtle — 0.03 opacity range). This adds "alive" feeling without being distracting.

#### Hero Responsive:

- Desktop (>1024px): Two columns, `1fr 1fr`, gap `--sp-12`
- Tablet (768–1024px): Single column, form below content, form max-width 540px
- Mobile (<768px): Single column, smaller heading (`--fs-2xl`), form full width, form row fields stack to single column

---

### 3. TRUST BAR

**What exists**: Horizontal bar with 4 trust items using emoji icons.

**Enhancements**:

- [ ] Replace emoji icons with **SVG icons** for consistency and sharpness. Use inline SVGs:
  - ✓ → Checkmark in circle (green)
  - 📋 → Clipboard/list icon (blue)
  - 🏠 → House icon (navy)
  - ⚡ → Lightning bolt icon (amber)
- [ ] Each icon sits in a 40px circle with a light background color matching the icon color family
- [ ] White background, subtle top/bottom borders (already done ✓)
- [ ] On mobile: 2×2 grid (already done ✓)
- [ ] **Add subtle hover**: Items slightly scale up (1.02) on hover with transition

**Trust bar items**:
1. "100% gratis & vrijblijvend"
2. "Vergelijk meerdere offertes"
3. "Onafhankelijke informatie"
4. "Snel en eenvoudig geregeld"

---

### 4. HOW IT WORKS (Hoe werkt het)

**What exists**: 3 steps with numbered circles, emoji icons, and connector line.

**Keep structure, enhance visually**:

- [ ] Section label: "Hoe werkt het" (uppercase, blue, small)
- [ ] H2: "In 3 stappen naar de beste dakkapel offerte"
- [ ] Subtitle: "Geen gedoe, geen verplichtingen. Binnen een paar minuten weet je waar je aan toe bent."

**Steps**:
1. **Step 1** — Number circle (navy bg) + "📝" icon → "Vul je wensen in" / "Beantwoord een paar korte vragen over je gewenste dakkapel. Dit kost je minder dan 2 minuten."
2. **Step 2** — Number circle (amber bg) + "📬" icon → "Ontvang gratis offertes" / "Na je aanvraag ontvang je vrijblijvende reacties van dakkapel specialisten die actief zijn in jouw regio."
3. **Step 3** — Number circle (navy bg) + "🏆" icon → "Vergelijk prijs & kwaliteit" / "Vergelijk de offertes op prijs, materiaal en reviews. Kies de specialist die het beste bij jou past."

**Enhancements**:
- [ ] Replace emoji step icons with proper **SVG icons** (pen/form, mailbox, trophy) for professional appearance
- [ ] **Connector line**: Horizontal dashed line between step circles on desktop (already partially done ✓). Make it a gradient line from navy to amber to navy.
- [ ] **Step cards**: Add subtle card background on hover (light blue tint)
- [ ] **Staggered reveal animation**: Steps animate in with 100ms delays (already done ✓)
- [ ] **Add animated number counter**: When step numbers scroll into view, they count up 0→1, 0→2, 0→3 with a quick CSS animation

**CTA below steps**: "Start nu — het is gratis →" (amber button, links to #offerte)

**Responsive**: 3 columns on desktop, single column on mobile. On mobile, add vertical connector line on the left side.

---

### 5. KOSTEN OVERVIEW (Dakkapel kosten)

**What exists**: 3 price cards + price table + 4 factor cards.

**Keep all content, enhance presentation**:

#### Price Cards (3 columns):

- [ ] **Prefab dakkapel**: Badge "Populair" (green). Price "€4.500 – €7.500"
- [ ] **Traditionele dakkapel**: Badge "Maatwerk" (blue). Price "€7.000 – €15.000"
- [ ] **Dakkapel 5 meter+**: Badge "Extra groot" (amber). Price "€10.000 – €18.000+"

**Enhancement**:
- [ ] Add a subtle gradient top border (3px) to each card using the badge color
- [ ] Price numbers should use `font-variant-numeric: tabular-nums` for alignment
- [ ] **Add "Meest gekozen" highlight** to the middle card (traditional) with a slightly raised appearance, thicker border, or a subtle glow

#### Price Table:

- [ ] Navy header row, alternating row backgrounds on hover (already done ✓)
- [ ] Table data: Keep current prices per width (2m, 3m, 4m, 5m+)
- [ ] **Responsive**: Make table horizontally scrollable on mobile with a subtle gradient fade on the right edge to indicate scrollability

#### Price Factor Cards (4 columns):

- [ ] Afmeting (📏 → ruler SVG) — blue icon bg
- [ ] Materiaal (🏗️ → materials SVG) — amber icon bg
- [ ] Prefab vs. traditioneel (🔨 → hammer SVG) — green icon bg
- [ ] Regio & toegang (📍 → pin SVG) — blue icon bg
- [ ] Replace emoji with SVG icons

**CTA below**: "Bereken jouw dakkapel kosten →" (amber, links to #offerte)

---

### 6. VERGELIJKEN & ADVIES (Comparison / Advice)

**What exists**: 4 advice cards in a 2×2 grid with icons, descriptions, and links to kenniscentrum articles.

**Keep as-is with minor enhancements**:

- [ ] Replace emoji icons with SVG
- [ ] Cards: icon left, content right (already done ✓)
- [ ] Each card links to a specific kenniscentrum article
- [ ] **Add**: Subtle arrow animation on hover (the "→" in the link slides right 4px)
- [ ] **Add**: Card left border accent (3px) in the icon's color family on hover

**Cards**:
1. "Kunststof vs. hout vs. polyester" → links to `/kenniscentrum/kunststof-of-houten-dakkapel/`
2. "Heb je een vergunning nodig?" → links to `/kenniscentrum/vergunning-dakkapel-regels/`
3. "Waarop letten bij het vergelijken?" → links to `/kenniscentrum/fouten-vergelijken-dakkapel-offertes/`
4. "Wat zit er in een offerte?" → links to `/kenniscentrum/checklist-dakkapel-offerte/`

---

### 7. WHY COMPARE (Waarom via ons)

**What exists**: 6 why-cards in two 3-column rows.

**Keep all 6 cards but enhance**:

- [ ] Replace emoji icons with SVG
- [ ] Centered layout with icon circles (already done ✓)
- [ ] **Reduce to single 3-column row with the 3 strongest points**, move others to trust bar or remove:
  - Keep: "100% onafhankelijk" / "Snel en makkelijk" / "Bespaar op kosten"
  - Move to a subtle secondary row or smaller format: "Betrouwbare specialisten" / "Eerlijk advies" / "Privacy gewaarborgd"
- [ ] **OR keep all 6** in two rows — this is fine as-is, just replace emojis with SVGs
- [ ] Add subtle `counter` animation on the "20-35%" savings number — animate it counting up when scrolled into view

---

### 8. KENNISCENTRUM PREVIEW (Blog Preview)

**What exists**: 3 blog cards with emoji placeholders, links to articles.

**Enhancements**:

- [ ] **Generate actual images** using the image generation tool for each card:
  1. A modern prefab dakkapel on a Dutch house (for "Wat kost een dakkapel?")
  2. A comparison of wood vs kunststof materials close-up (for "Kunststof of houten dakkapel")
  3. A building permit/document with a house illustration (for "Vergunning nodig?")
- [ ] Cards: image top, content bottom with category tag, title, excerpt, meta
- [ ] Hover: lift up 3px + shadow (already done ✓)
- [ ] Category tags: uppercase, blue, small (already done ✓)
- [ ] **Add**: Reading time estimate and "Bijgewerkt" date (already done ✓)

**CTA below**: "Bekijk alle artikelen →" (secondary button, links to `/kenniscentrum/`)

---

### 9. REVIEWS / TRUST SECTION

**What exists**: 3 "platform feature" cards disguised as review cards + a "60+ artikelen" score card.

**Recommendation — Redesign this section**:

The current approach (platform features as review cards) is confusing. Replace with:

- [ ] **Rename section**: "Wat gebruikers zeggen" or "Waarom huiseigenaren ons vertrouwen"
- [ ] **3 testimonial-style cards** with realistic Dutch names and situations:
  1. "Dankzij de vergelijking op DakkapellenKosten.nl heb ik €3.200 bespaard op mijn dakkapel. Het was heel eenvoudig." — *Mark de Vries, Amersfoort* (⭐⭐⭐⭐⭐)
  2. "Ik wist niet waar ik moest beginnen. De artikelen over vergunningen en materialen hebben mij enorm geholpen." — *Linda Bakker, Rotterdam* (⭐⭐⭐⭐⭐)
  3. "Binnen 2 dagen had ik 3 offertes. Kon mooi vergelijken op prijs en garantie." — *Jan Smit, Utrecht* (⭐⭐⭐⭐⭐)
- [ ] Each card: star rating top, testimonial text (italic), author name + city + avatar initials
- [ ] **Score card** (navy bg): Keep but update: "4.8/5" with stars, "Op basis van gebruikerservaringen" below
- [ ] Add subtle quote marks (") as decorative element on testimonial cards

> **IMPORTANT**: These are illustrative placeholder testimonials. Add a small disclaimer or make clear these represent typical experiences, not verified reviews. Or even better — replace with the current editorial/platform trust approach but style it differently from "review cards" to avoid confusion.

**Alternative (safer, recommended)**: Keep the current platform-feature cards but **restyle them as "trust pillars"** instead of "review cards":
- Use a different card style (no stars, no quotes, no author avatars)
- Use icon + heading + description format (similar to why-compare section)
- This avoids fake review concerns while still communicating trust

---

### 10. FAQ SECTION

**What exists**: 6 FAQ items with accordion behavior.

**Keep as-is**, enhance:

- [ ] Accordion animation (max-height transition, already done ✓)
- [ ] Chevron rotation on open (already done ✓)
- [ ] Only one open at a time (already done ✓)
- [ ] **Add**: Subtle border-left accent (3px, blue) on the active item
- [ ] **Add**: Smooth background color transition on the active item (very light blue)

**FAQ Questions** (keep current 6):
1. Wat kost een dakkapel in 2026?
2. Is een vergunning nodig voor een dakkapel?
3. Wat is het verschil tussen een prefab en traditionele dakkapel?
4. Hoe lang duurt het plaatsen van een dakkapel?
5. Hoeveel waarde voegt een dakkapel toe aan mijn woning?
6. Welk materiaal is het beste voor een dakkapel?

---

### 11. FINAL CTA

**What exists**: Navy background section with large heading, subtitle, CTA button, and reassurance checkmarks.

**Keep as-is**, enhance:

- [ ] Keep the radial gradient decorative element (already done ✓)
- [ ] **Add**: A subtle animated gradient background (navy shifting very slowly between `#16324F` and `#1a3a5c`)
- [ ] H2: "Klaar om dakkapel kosten te vergelijken?"
- [ ] Sub: "Ontvang binnen 48 uur tot 4 vrijblijvende offertes van betrouwbare dakkapel specialisten. 100% gratis, geen verplichtingen."
- [ ] CTA: "Nu gratis offertes vergelijken →" (amber)
- [ ] Reassurance: 4 items with green checkmarks (Gratis & vrijblijvend, Meerdere offertes, Vrijblijvend aanvragen, Geen verborgen kosten)

---

### 12. FOOTER

**What exists**: Navy footer with 5-column grid (brand, info, kenniscentrum, platform, juridisch), bottom bar.

**Keep as-is.** No changes needed. The footer is well-structured.

- [ ] Logo with amber "Kosten" highlight
- [ ] 4 nav columns: Informatie, Kenniscentrum, Platform, Juridisch
- [ ] Email: info@dakkapellenkosten.nl
- [ ] Bottom bar: copyright + privacy/cookie/terms links
- [ ] Amber top border accent (4px, already done ✓)
- [ ] Responsive: 5col → 3col → 2col → 1col

---

### 13. STICKY MOBILE CTA

**What exists**: Fixed bottom bar on mobile with CTA button, appears when user scrolls past hero.

**Keep as-is.** This is a critical mobile conversion element.

- [ ] Shows/hides based on IntersectionObserver on hero section (already done ✓)
- [ ] White background, shadow, full-width amber button
- [ ] `z-index: 900` (below header at 1000)
- [ ] `body` padding-bottom on mobile to prevent content being hidden

---

## Premium Visual Enhancements to Add

### Replace All Emoji with SVG Icons

Every section currently uses emoji for icons. Replace ALL with consistent, clean inline SVG icons:

```
📝 → Form/pen icon
📬 → Mailbox/envelope icon  
🏆 → Trophy/award icon
📏 → Ruler icon
🏗️ → Building/construction icon
🔨 → Hammer icon  
📍 → Map pin icon
🔄 → Refresh/compare icon
📋 → Clipboard icon
🔍 → Search/magnifier icon
📄 → Document icon
🏛️ → Building/institution icon
⚡ → Lightning icon
💰 → Money/savings icon
🛡️ → Shield icon
📚 → Book icon
🔒 → Lock icon
🏠 → House icon
```

Style: Rounded line icons, 24×24 viewBox, stroke-based (not filled), `stroke-width: 1.5 or 2`, using `currentColor`. This gives a professional, consistent look.

### Animations Strategy

**Scroll reveal** (existing, enhance):
- Keep the `.reveal` class with `translateY(30px)` → visible
- Keep the stagger delays (100ms, 200ms, 300ms)
- **Add**: `scale(0.98)` to the initial state for a slight zoom-in effect alongside the slide-up
- **Add**: `will-change: transform, opacity` for GPU acceleration

**Micro-interactions** (new):
- Buttons: `translateY(-2px)` on hover (already on primary ✓). Add to all cards on hover.
- Cards: Consistent `translateY(-3px) + shadow-md` hover on all card types
- Links with arrows: Arrow slides 4px right on hover
- Form inputs: Subtle scale(1.01) on focus, plus blue border glow (partially done ✓)
- FAQ items: Smooth accordion with easing

**Performance-conscious animation** (new):
- All animations use `transform` and `opacity` only (GPU-composited)
- Use `will-change` sparingly (only during animation)
- Keep animation durations short: 0.25s for interactions, 0.6s for reveals
- Use `prefers-reduced-motion` media query to disable animations for accessibility

### Decorative Background Elements

- [ ] Hero: Subtle CSS grid-dot pattern at 3% opacity
- [ ] Hero: Slow-drifting gradient orb (`@keyframes float`, 20s infinite, very subtle opacity changes)
- [ ] Kosten section: Very faint diagonal lines pattern at 2% opacity
- [ ] Final CTA: Slow color-shifting navy gradient
- [ ] All decorative elements use `pointer-events: none` and are pure CSS (no images)

---

## Responsive Breakpoints

```css
/* Desktop-first with these breakpoints: */
@media (max-width: 1200px) { /* Large tablet / small desktop */ }
@media (max-width: 1024px) { /* Tablet landscape */ }
@media (max-width: 768px)  { /* Tablet portrait / large phone */ }
@media (max-width: 480px)  { /* Small phone */ }
```

### Key Responsive Rules:

| Element | Desktop (>1024) | Tablet (768–1024) | Mobile (<768) |
|---|---|---|---|
| Hero | 2 columns | 1 column, form below | 1 column, compact |
| Hero H1 | `--fs-4xl` (3rem) | `--fs-3xl` (2.25rem) | `--fs-2xl` (1.875rem) |
| Grid--3 | 3 columns | 2 columns | 1 column |
| Grid--4 | 4 columns | 2 columns | 1 column |
| Trust bar | Flex row | 2×2 grid | 2×2 grid |
| Footer | 5 columns | 3 columns | 1 column |
| Form rows | 2 columns | 2 columns | 1 column |
| Price table | Full width | Scrollable | Scrollable |
| Mobile CTA | Hidden | Hidden | Fixed bottom |
| Header CTA | Visible | Visible | Hidden (in nav) |

---

## Schema.org Structured Data (Keep & Enhance)

Keep all existing structured data:
- [x] Organization
- [x] WebSite
- [x] Person (author)
- [x] Service
- [x] HowTo (3 steps)
- [x] FAQPage (6 questions)

**No changes needed** — the structured data is comprehensive and well-implemented.

---

## SEO Essentials (Keep & Verify)

- [x] `<title>`: "Dakkapel offertes vergelijken in 2026 | Gratis & vrijblijvend"
- [x] `<meta description>`: Current description is good
- [x] `<link rel="canonical">`: Set to `https://dakkapellenkosten.nl/`
- [x] `<meta name="robots">`: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
- [x] Open Graph tags: All set
- [x] Twitter card tags: All set
- [x] `lang="nl"` on html element
- [x] Hreflang: nl-NL alternate
- [ ] **Remove** `<meta name="keywords">` — this tag is ignored by Google and is an SEO antipattern

---

## Performance Optimizations

- [ ] **Font loading**: Add `font-display: swap` to the Google Fonts import (already using `display=swap` ✓)
- [ ] **Critical CSS**: The design system tokens and above-the-fold styles (header + hero) could be inlined in `<head>` for faster FCP
- [ ] **Lazy loading**: Add `loading="lazy"` to any images below the fold (blog card images, etc.)
- [ ] **Script loading**: Move `<script src="js/main.js">` to end of body (already done ✓). Consider adding `defer` attribute.
- [ ] **Preconnect**: Add `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` before the font import

---

## Accessibility

- [ ] All interactive elements have sufficient color contrast (navy on white = AAA ✓, amber on navy = check)
- [ ] All form inputs have associated `<label>` elements (already done ✓)
- [ ] FAQ accordion uses `aria-expanded` (already done ✓)
- [ ] Mobile toggle has `aria-label` (already done ✓)
- [ ] Add `role="navigation"` to `<nav>`
- [ ] Add `aria-label="Hoofdnavigatie"` to `<nav>`
- [ ] Ensure focus styles are visible on all interactive elements (add `:focus-visible` styles)
- [ ] Add skip-to-content link for keyboard users
- [ ] Use `prefers-reduced-motion` to disable animations

---

## Images to Generate

Use the AI image generation tool to create these images for the homepage:

1. **Blog card 1** — "Wat kost een dakkapel": A photorealistic modern Dutch house (typical rijtjeshuis) with a clean white/gray dakkapel on the roof, shot from street level, warm daylight, professional real-estate photography style. Aspect ratio 16:9.

2. **Blog card 2** — "Kunststof of houten dakkapel": Close-up comparison of two dakkapel materials side by side — white kunststof (PVC) on the left and warm natural wood on the right, clean product photography style. Aspect ratio 16:9.

3. **Blog card 3** — "Vergunning nodig?": A Dutch building permit document (omgevingsvergunning) with a stamp, alongside a small house model and a pen, overhead flat-lay photography style. Aspect ratio 16:9.

Save images in `/images/` directory with descriptive names:
- `images/blog-dakkapel-kosten.webp`
- `images/blog-materialen-vergelijking.webp`
- `images/blog-vergunning-regels.webp`

---

## Cookie Consent

- [ ] **Add a simple cookie banner** at the bottom of the page
- [ ] Style: small strip, navy background, white text, amber "Akkoord" button
- [ ] Text: "Deze website gebruikt functionele cookies voor de beste ervaring."
- [ ] Link to `/cookiebeleid/`
- [ ] Save preference in localStorage, don't show again after acceptance
- [ ] No third-party tracking cookies — this is a simple consent for functional cookies only

---

## File Structure

```
/index.html          — Homepage (single file, all sections)
/css/style.css       — Complete design system + all component styles
/js/main.js          — All interactions (nav, header, FAQ, form, animations)
/images/             — Generated images (blog cards, etc.)
/assets/             — SVG assets (og image)
```

**No build step. No bundler. No framework.** Pure static files served directly.

---

## Implementation Order

When rebuilding the homepage, follow this order:

1. **CSS first**: Update `style.css` with all enhancements (new animation keyframes, decorative backgrounds, emoji→SVG icon styles, responsive refinements)
2. **HTML structure**: Update `index.html` section by section, replacing emoji with SVG icons, updating any content changes
3. **JS enhancements**: Update `main.js` with any new interactions (counter animations, cookie consent)
4. **Images**: Generate and place blog card images
5. **Testing**: Test on desktop (1440px, 1200px), tablet (1024px, 768px), and mobile (414px, 375px, 320px)

---

## Quality Checklist

Before considering the homepage complete:

- [ ] All emoji replaced with consistent SVG icons
- [ ] All sections have smooth scroll-reveal animations
- [ ] Form validation works (email, postcode, required fields)
- [ ] Form submission works (POST to /api/leads, success/error states)
- [ ] Mobile nav works (hamburger toggle, close on link click)
- [ ] Sticky mobile CTA appears after scrolling past hero
- [ ] FAQ accordion works (one open at a time, chevron rotation)
- [ ] All internal links work (anchor links, kenniscentrum links)
- [ ] Page loads fast (<3s on 3G)
- [ ] No horizontal scroll on any viewport
- [ ] All text is readable on all screen sizes
- [ ] Color contrast meets WCAG AA minimum
- [ ] Structured data validates in Google Rich Results Test
- [ ] Cookie consent banner works and saves preference
- [ ] `prefers-reduced-motion` disables animations
- [ ] Blog card images load (not emoji placeholders)
- [ ] Meta tags are complete (title, description, OG, Twitter)
- [ ] `keywords` meta tag removed

---

## What NOT to Change

- **Don't change the URL structure** — the page stays at `/index.html`
- **Don't change the color palette** — navy/blue/amber is final
- **Don't change the font** — Inter stays
- **Don't add a framework** — keep it vanilla HTML/CSS/JS
- **Don't change the form fields** — keep current 6 fields
- **Don't change the price data** — keep current ranges
- **Don't change the structured data** — keep all 6 schemas
- **Don't change the footer structure** — it's complete
- **Don't add a dark mode** — unnecessary for this type of site
- **Don't add a calculator widget** — the form IS the conversion tool
