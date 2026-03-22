/**
 * Geocoding Service — DakkapellenKosten.nl
 * Converts Dutch postcodes to lat/lng coordinates.
 *
 * Uses the free PDOK Locatieserver API (Dutch government geocoding).
 * Fallback: Nominatim (OpenStreetMap).
 * No API key required for either service.
 */

interface GeoResult {
    latitude: number;
    longitude: number;
    city?: string;
}

/**
 * Resolve a Dutch postcode (e.g. "1234AB") to lat/lng coordinates.
 * Tries PDOK first, falls back to Nominatim.
 * Returns null if geocoding fails — caller must handle gracefully.
 */
export async function geocodePostcode(postcode: string): Promise<GeoResult | null> {
    // Normalize: remove spaces, uppercase
    const normalized = postcode.replace(/\s/g, "").toUpperCase();

    if (!/^\d{4}[A-Z]{2}$/.test(normalized)) {
        console.warn(`[geocoding] Invalid postcode format: ${postcode}`);
        return null;
    }

    // Try PDOK first (Dutch government API — fast, reliable, no key needed)
    try {
        const result = await geocodePDOK(normalized);
        if (result) return result;
    } catch (err) {
        console.error("[geocoding] PDOK failed:", err);
    }

    // Fallback: Nominatim (OpenStreetMap)
    try {
        const result = await geocodeNominatim(normalized);
        if (result) return result;
    } catch (err) {
        console.error("[geocoding] Nominatim fallback failed:", err);
    }

    console.warn(`[geocoding] All providers failed for postcode: ${normalized}`);
    return null;
}

/**
 * PDOK Locatieserver — Dutch government geocoding API
 * Docs: https://api.pdok.nl/bzk/locatieserver/search/v3_1/ui/
 */
async function geocodePDOK(postcode: string): Promise<GeoResult | null> {
    const url = `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${postcode}&fq=type:postcode&rows=1`;

    const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const docs = data?.response?.docs;

    if (!docs || docs.length === 0) return null;

    const doc = docs[0];
    // PDOK returns centroide_ll as "POINT(lng lat)"
    const point = doc.centroide_ll;
    if (!point) return null;

    const match = point.match(/POINT\(([\d.]+)\s+([\d.]+)\)/);
    if (!match) return null;

    return {
        latitude: parseFloat(match[2]),
        longitude: parseFloat(match[1]),
        city: doc.woonplaatsnaam || undefined,
    };
}

/**
 * Nominatim (OpenStreetMap) — Fallback geocoder
 * Rate limit: 1 req/sec. Only used as fallback.
 */
async function geocodeNominatim(postcode: string): Promise<GeoResult | null> {
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${postcode}&country=Netherlands&format=json&limit=1`;

    const res = await fetch(url, {
        headers: {
            "User-Agent": "DakkapellenKosten.nl/1.0",
            Accept: "application/json",
        },
        signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return null;

    const results = await res.json();
    if (!Array.isArray(results) || results.length === 0) return null;

    const result = results[0];
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    if (isNaN(lat) || isNaN(lng)) return null;

    return {
        latitude: lat,
        longitude: lng,
        city: result.display_name?.split(",")[0] || undefined,
    };
}
