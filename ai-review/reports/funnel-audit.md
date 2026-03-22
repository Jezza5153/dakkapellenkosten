# Full Funnel Audit — DakkapellenKosten.nl

> Pre-launch conversion funnel review | 2026-03-21

---

# 1. Executive Truth

**The funnel technically works end-to-end**, but it has critical conversion weaknesses that will leak leads at scale.

**What works:**
- CTA buttons are correctly wired — all 12 CTAs across homepage, articles, geo-pages point to the right place (`#offerte` / `/#offerte`)
- The lead form submits to the correct API
- The backend validates, stores, geocodes, matches, and sends emails
- Fraud protection (rate limiting, duplicate detection) is solid

**What will leak conversions:**
- **No analytics or tracking whatsoever** — you are flying completely blind. Zero ability to measure funnel performance, CTA effectiveness, or drop-off
- **Frontend form collects 6 fields, backend accepts 10+** — materiaal, budget, timeline, and extraNotes are never collected, weakening lead quality and matching accuracy
- **Success state auto-resets after 4 seconds** — user sees "✓ Aanvraag verzonden!" for 4s, then the form resets to empty. If they blink, they'll think it failed and re-submit
- **No double-submit prevention** — user can spam the submit button
- **No mobile nav** — hamburger menu doesn't exist, nav links are invisible on mobile
- **No sticky CTA on mobile** — the form is only at the top of the page. Once users scroll past it, there's no way to get back without manually scrolling
- **Hero CTA scrolls to itself** — the primary hero `<a href="#offerte">` anchors to the hero section itself (`id="offerte"`), which means clicking it on desktop just... stays there. The form is already visible.
- **No confirmation page or token shown** — user gets a 4-second toast, no email summary visible, no reference number

**Is this safe to launch?**
Functionally yes, but you'll waste paid traffic because you can't measure anything, and mobile UX will lose ~30%+ of mobile visitors.

---

# 2. Funnel Verdict by Stage

| Stage | Status | Confidence |
|---|---|---|
| Homepage CTA layer | ✅ Working | Verified |
| Article CTA layer | ✅ Working | Verified |
| Geo-page CTA layer | ✅ Working | Verified |
| Navbar CTA | ⚠️ Partially working | Verified — hidden on mobile |
| Footer CTA | ✅ Working | Verified |
| Sticky/mobile CTA | ❌ Missing | Verified — does not exist |
| Form open/entry | ⚠️ Misleadingly complete | Verified — hero CTA anchors to itself |
| Form completion flow | ⚠️ Partially working | Verified — missing fields, no field validation feedback |
| Validation UX | ⚠️ Weak | Verified — browser-native `required` only, no inline errors |
| Submit flow | ⚠️ Partially working | Verified — no double-submit guard |
| Lead creation API | ✅ Working | Verified |
| Success state | ⚠️ Weak | Verified — 4s auto-reset, no confirmation page |
| Tracking/analytics | ❌ Broken / Missing | Verified — zero tracking code exists |

---

# 3. CTA Audit

## Homepage CTAs (5 total)

| # | Location | Label | Target | Verdict |
|---|---|---|---|---|
| 1 | Navbar | "Gratis offertes →" | `#offerte` | ⚠️ **Self-referencing** — hero section already has `id="offerte"`, so on homepage this scrolls to the form which is already visible after page load. On mobile, nav is hidden anyway. |
| 2 | Hero | "Nu gratis offertes vergelijken →" | `#offerte` | ⚠️ **Scrolls to itself** — the hero section IS the `#offerte` target. This button does nothing if the form is already in view. |
| 3 | "Hoe werkt het" section | "Start nu — het is gratis →" | `#offerte` | ✅ **Working** — scrolls back up to the form |
| 4 | "Kosten" section | "Bereken jouw dakkapel kosten →" | `#offerte` | ⚠️ **Misleading label** — says "Bereken" (calculate) but the form doesn't calculate anything, it requests quotes. Users expect a calculator. |
| 5 | Final CTA section | "Nu gratis offertes vergelijken →" | `#offerte` | ✅ **Working** — scrolls back up to form |

## Article Page CTAs (3 per page)

| # | Location | Label | Target | Verdict |
|---|---|---|---|---|
| 1 | Header nav | "Gratis offertes →" | `/#offerte` | ✅ **Working** — navigates to homepage form |
| 2 | Sidebar/inline | "Gratis offertes aanvragen →" | `/#offerte` | ✅ **Working** |
| 3 | Bottom CTA | "Nu gratis offertes vergelijken →" | `/#offerte` | ✅ **Working** |

## Geo-page CTAs (3 per page)

| # | Location | Label | Target | Verdict |
|---|---|---|---|---|
| 1 | Header | "Gratis offertes →" | `/#offerte` | ✅ **Working** |
| 2 | Hero | "Vergelijk dakkapel offertes in {city} →" | `/#offerte` | ✅ **Working** — dynamic city name |
| 3 | Bottom CTA | "Nu gratis offertes vergelijken →" | `/#offerte` | ✅ **Working** |

---

# 4. Broken or Mislinked Funnel Logic

### 4.1 Hero CTA anchors to itself
- **What:** `<a href="#offerte">` on hero, but hero section has `id="offerte"` — so the CTA scrolls to the section it's already in
- **Where:** `home-client.tsx:140,154`
- **Impact:** Primary CTA does nothing if user already sees the form
- **Fix:** Move `id="offerte"` to the form container, or have the CTA focus the first form field instead

### 4.2 "Bereken jouw dakkapel kosten" CTA is misleading
- **What:** Label says "Bereken" (calculate) but there's no calculator — it just opens a quote request form
- **Where:** `home-client.tsx:237`
- **Impact:** User intent mismatch → drop-off when they see a form instead of a calculator
- **Fix:** Change to "Vergelijk offertes voor jouw dakkapel →" or actually build a cost estimator

### 4.3 Frontend collects 6 fields, backend accepts 10
- **What:** Form sends `{dakkapelType, breedte, postcode, naam, email, telefoon}`. Backend schema also accepts `materiaal`, `budgetMin`, `budgetMax`, `timeline`, `extraNotes` — all `.optional()` so they don't block submission, but they're never collected.
- **Where:** `home-client.tsx:15-18` vs `api/leads/route.ts:15-28`
- **Impact:** Lead quality is lower than it could be. `materiaal` and `timeline` help matching quality significantly. Companies get thin leads.
- **Fix:** Add materiaal and timeline as optional fields in the form (don't require them — that adds friction)

### 4.4 No double-submit prevention
- **What:** The submit button is only disabled while `submitting` is true (during the fetch), but there's no debounce. Fast double-clicks can fire two requests before the first sets `submitting=true`
- **Where:** `home-client.tsx:27-48`
- **Impact:** Duplicate leads (mitigated by backend dedup, but still creates 409 errors shown to user)
- **Fix:** Add `ref` guard or disable button immediately on click

### 4.5 Success state auto-resets after 4 seconds
- **What:** `setTimeout(() => { setSubmitted(false); setForm({...}); }, 4000)` — success message vanishes after 4 seconds and the form resets to empty
- **Where:** `home-client.tsx:39`
- **Impact:** User uncertainty — "Did it actually work?" They might re-submit. No confirmation number or email summary visible.
- **Fix:** Show persistent success state with: "✓ Aanvraag ontvangen — check je inbox voor bevestiging" and a "Nieuwe aanvraag" button to reset manually

### 4.6 `publicToken` created but never shown
- **What:** Backend creates a `publicToken` for each lead but the frontend never receives or displays it
- **Where:** `api/leads/route.ts:76` — token is generated but the API response (line 169-172) only returns `{success: true, message: ...}`
- **Impact:** User has no reference number. If they call support, there's no way to look up their lead. Wasted infrastructure.
- **Fix:** Return `publicToken` in the API response and show it in the success state

---

# 5. Funnel Efficiency and UX Friction

### Form Field Analysis

| Field | Necessary? | Order | Issue |
|---|---|---|---|
| dakkapelType (select) | ✅ Yes | ✅ Correct (1st) | Good — low-friction opener |
| breedte (select) | ✅ Yes | ✅ Correct (2nd) | Good — progressive engagement |
| postcode (text) | ✅ Yes | ⚠️ Should be 3rd | Good field, correct position |
| naam (text) | ✅ Yes | ⚠️ Could be after email | Fine |
| email (email) | ✅ Yes | ✅ | Fine |
| telefoon (tel) | ⚠️ Friction risk | ✅ Last | Many users will hesitate here — "why do they need my phone number?" No explanation given. |

### Missing Fields (from backend schema)

| Field | Should collect? | Why |
|---|---|---|
| `materiaal` | ✅ Yes (optional) | Helps matching accuracy. Companies want to know if user wants kunststof/hout/polyester |
| `timeline` | ✅ Yes (optional) | "Wanneer wilt u starten?" helps companies prioritize hot leads |
| `extraNotes` | ⚠️ Optional | Low priority — adds length but some users want to specify |
| `budgetMin/Max` | ❌ No | Too much friction — users don't know their budget yet |

### Friction Points

1. **Phone number with no explanation** — users will drop here. Add micro-copy: "Zodat specialisten je snel kunnen bereiken"
2. **No progress indicator** — single-page form looks like a wall of fields on mobile
3. **No field-level validation** — only browser-native `required`. Email/phone don't show inline errors until submit
4. **Trust signal is at the bottom** — "🔒 Je gegevens zijn veilig" appears AFTER the submit button. It should be BEFORE the phone/email fields where trust anxiety peaks
5. **Form title says "tot 4 offertes"** — this is a concrete promise. Does the matching engine actually cap at 4? (Checked: `MAX_COMPANIES_PER_LEAD` env var exists but isn't verified as set)

### Funnel Efficiency Score: **5/10**

The form *works* but it's a minimum viable funnel. No progressive disclosure, no micro-copy, no inline validation, no confirmation, no tracking. Average landing page would outperform this.

---

# 6. Mobile Funnel Audit

| Issue | Severity | Status |
|---|---|---|
| **Nav links hidden on mobile** | 🔴 Critical | Verified — no hamburger menu, `display: none` on `site-nav` at 768px. Users can't navigate |
| **No sticky CTA on mobile** | 🔴 Critical | Verified — once user scrolls past hero, no CTA is accessible without scrolling back to top |
| **Form fields too narrow on small screens** | 🟡 Medium | Verified — `form-row` puts 2 selects side-by-side on all screens, cramped on 320px |
| **No tel-specific keyboard** | 🟡 Medium | Verified — telefoon field is `type="tel"` ✅ but postcode uses `type="text"` instead of `inputMode="numeric"` |
| **CTA buttons have sufficient tap targets** | ✅ OK | Verified — buttons are large enough |
| **Hero text readable on mobile** | ✅ OK | Verified — CSS scales properly |
| **Long page with no way back to form** | 🔴 Critical | Mobile users who scroll to FAQ/pricing have no visible path back to the form |

### Mobile Score: **4/10**

No mobile nav, no sticky CTA, no way to reach the form after scrolling. This will hemorrhage mobile conversions.

---

# 7. Frontend vs Backend Alignment

### Field Matching

| Frontend | Backend Schema | Match? |
|---|---|---|
| `dakkapelType` | `z.enum(["prefab", "traditioneel", "weet_niet"])` | ✅ Exact match |
| `breedte` | `z.enum(["2m", "3m", "4m", "5m_plus", "weet_niet"])` | ✅ Exact match |
| `postcode` | `z.string().regex(/^\d{4}\s?[A-Za-z]{2}$/)` | ✅ Match |
| `naam` | `z.string().min(2).max(255)` | ✅ Match (frontend has `required`) |
| `email` | `z.string().email()` | ✅ Match |
| `telefoon` | `z.string().min(8).max(30)` | ✅ Match |
| — | `materiaal` (optional) | ❌ **Never collected** |
| — | `budgetMin/Max` (optional) | ❌ **Never collected** |
| — | `timeline` (optional) | ❌ **Never collected** |
| — | `extraNotes` (optional) | ❌ **Never collected** |
| — | `city` (optional) | ⚠️ Inferred via geocoding, not collected |

### Frontend Promises vs Backend Reality

| Promise (copy) | Backend reality | Aligned? |
|---|---|---|
| "Binnen 48 uur tot 4 offertes" | Matching runs immediately, `MAX_COMPANIES_PER_LEAD` env var exists | ⚠️ **Partially** — matching works, but the 4-company cap depends on env config being set |
| "Specialisten in jouw regio" | Geocoding + distance matching implemented | ✅ Aligned |
| "100% gratis" | No payment required from homeowners | ✅ Aligned |
| "Vergelijk prijs & kwaliteit" | User has no comparison interface | ❌ **Misleading** — there's no comparison tool. User gets separate phone/email contacts |
| "Snel reactie" | Companies are emailed. Speed depends on their response time | ⚠️ Vague — platform can't guarantee response speed |

---

# 8. Tracking and Optimization Readiness

### Current State: **ZERO TRACKING**

| Event | Tracked? |
|---|---|
| Page views | ❌ No |
| CTA clicks | ❌ No |
| Form impressions | ❌ No |
| Form field interactions | ❌ No |
| Form validation errors | ❌ No |
| Form submissions | ❌ No |
| Form success/failure | ❌ No |
| Source attribution (UTM) | ❌ No |
| Scroll depth | ❌ No |
| Time on page | ❌ No |
| Funnel drop-off | ❌ Impossible to measure |
| CTA performance by page | ❌ Impossible to measure |
| Page-to-lead attribution | ❌ Impossible to measure |

**Verdict:** This funnel is **completely blind**. You cannot run paid traffic into a funnel you can't measure. This is the #1 launch blocker.

### Tracking Score: **0/10**

---

# 9. Critical Blockers Before Launch

### Blocker 1: Zero Analytics
- **Severity:** 🔴 P0
- **Why:** Paid traffic without tracking = burning money. You can't optimize what you can't measure.
- **Fix:** Add Google Analytics 4 + custom events for: `form_view`, `form_start`, `form_submit`, `form_success`, `form_error`. Add UTM parameter capture and store `source` on each lead.

### Blocker 2: No Mobile Navigation
- **Severity:** 🔴 P0
- **Why:** ~60% of traffic is mobile for home improvement queries. Users can't navigate the site.
- **Fix:** Add hamburger menu with off-canvas nav for mobile.

### Blocker 3: No Sticky CTA on Mobile
- **Severity:** 🔴 P0
- **Why:** Users who scroll past the hero section have no CTA visible. They have to scroll back to the top to find the form.
- **Fix:** Add a sticky bottom bar on mobile: "Gratis offertes" button that scrolls to `#offerte` or opens a modal.

### Blocker 4: Success State Too Weak
- **Severity:** 🟡 P1
- **Why:** 4-second auto-reset causes confusion. Users re-submit thinking it failed.
- **Fix:** Persistent success state with email confirmation message and reference number.

---

# 10. Exact Fixes Needed

## P0 — Before Launch

| # | Fix | Where | What Done Looks Like |
|---|---|---|---|
| 1 | **Add analytics** | `layout.tsx` + form | GA4 with `form_view`, `form_start`, `form_submit`, `form_success` events. UTM capture on lead record. |
| 2 | **Mobile hamburger nav** | `home-client.tsx` + `home.css` | Hamburger icon → slide-out menu with nav links + CTA |
| 3 | **Sticky mobile CTA** | `home-client.tsx` + `home.css` | Fixed bottom bar (48px) with amber CTA button, shows after scrolling past hero |
| 4 | **Fix hero CTA self-anchor** | `home-client.tsx:140` | Move `id="offerte"` to the `lead-form-card` div, or make hero CTA focus the first form field |
| 5 | **Double-submit guard** | `home-client.tsx:27` | Add `useRef` flag, set it `true` on first click, prevent re-entry |
| 6 | **Persistent success state** | `home-client.tsx:37-39` | Remove `setTimeout`. Show "✓ Aanvraag ontvangen! Check je inbox." with manual reset button |

## P1 — Immediately After Launch

| # | Fix | Where | What Done Looks Like |
|---|---|---|---|
| 7 | **Add materiaal + timeline fields** | `home-client.tsx` LeadForm | Two optional dropdowns between breedte and postcode. Increases lead quality for matching. |
| 8 | **Phone field micro-copy** | `home-client.tsx:74` | Add "Zodat specialisten je snel kunnen bereiken" below phone input |
| 9 | **Move trust signal before PII fields** | `home-client.tsx:79` | Move "🔒 Je gegevens zijn veilig" above the naam/email/telefoon block |
| 10 | **Fix "Bereken" CTA label** | `home-client.tsx:237` | Change to "Vergelijk offertes voor jouw dakkapel →" |
| 11 | **Return publicToken in API response** | `api/leads/route.ts:169` | Include `referenceId` in response, show in success state |
| 12 | **Inline form validation** | `home-client.tsx` | Show field-level errors on blur (email format, phone length, postcode format) |

## P2 — Optimization Layer

| # | Fix | Where | What Done Looks Like |
|---|---|---|---|
| 13 | **Multi-step form** | LeadForm | Step 1: dakkapel info (low friction). Step 2: contact details. Progress bar. |
| 14 | **UTM parameter capture** | `api/leads/route.ts` | Parse `utm_source`, `utm_medium`, `utm_campaign` from referrer/URL and store on lead |
| 15 | **Social proof / reviews** | `home-client.tsx` | Add "4.6/5 · 1.200+ aanvragen" counter or testimonials near form |
| 16 | **Cost estimator** | New component | Interactive calculator that estimates cost based on type/breedte/materiaal before asking for contact info |
| 17 | **Heatmap integration** | Layout | Add Hotjar/Clarity for session recording and click heatmaps |
| 18 | **Inline form on article pages** | `kenniscentrum/[slug]` | Embed the lead form directly on article pages instead of linking to homepage |

---

# 11. Final Scoring

| Domain | Score |
|---|---|
| CTA correctness | **68/100** — All CTAs go to right destination, but hero CTA self-anchors and one label is misleading |
| Funnel logic health | **72/100** — Flow works end-to-end but success state is weak, no confirmation page |
| Form UX quality | **55/100** — Fields are correct but no inline validation, no micro-copy, no progress, phone field needs explanation |
| Frontend/backend alignment | **70/100** — Core 6 fields match, but 4 optional quality-boosting fields are never collected |
| Mobile conversion readiness | **35/100** — No hamburger, no sticky CTA, form only at top, nav hidden |
| Tracking readiness | **0/100** — Zero analytics, zero event tracking, zero attribution |
| **Overall funnel production readiness** | **48/100** |

---

## Can This Funnel Launch Now?

**No — not with paid traffic.** The funnel technically accepts and processes leads, but:

1. You can't measure anything (tracking: 0/100)
2. Mobile is broken (nav hidden, no sticky CTA: 35/100)
3. You'll get confused re-submissions (4s success auto-reset + no double-submit guard)

### Minimum fixes before launch with paid traffic:
1. Add GA4 + form events (~2 hours)
2. Add mobile hamburger menu (~1 hour)
3. Add sticky mobile CTA (~30 min)
4. Fix success state (persistent) (~15 min)
5. Add double-submit guard (~10 min)
6. Fix hero CTA self-anchor (~5 min)

**After these 6 fixes, score moves to ~72/100 — acceptable for initial launch.**
