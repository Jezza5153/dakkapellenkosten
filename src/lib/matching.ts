/**
 * Lead Matching Algorithm — DakkapellenKosten.nl
 *
 * Matches a lead to the best companies based on:
 * - Location (distance from lead postcode)
 * - Service capabilities (dakkapel type, materials)
 * - Company rating
 * - Response speed
 * - Credit balance (must have enough)
 * - Active subscription
 *
 * Returns top 3 companies.
 */

import { db, schema } from "@/db";
import { eq, and, gte, isNull } from "drizzle-orm";
import { MAX_COMPANIES_PER_LEAD, LEAD_CREDIT_COST } from "./stripe";

interface MatchResult {
    companyId: string;
    companyName: string;
    companyEmail: string;
    matchScore: number;
    distanceKm: number;
}

/**
 * Find and score the best matching companies for a lead.
 */
export async function matchLeadToCompanies(leadId: string): Promise<MatchResult[]> {
    const lead = await db.query.leads.findFirst({
        where: eq(schema.leads.id, leadId),
    });

    if (!lead) throw new Error(`Lead ${leadId} not found`);

    // Find all non-deleted, verified companies with their subscription/credit info
    const companies = await db.query.companies.findMany({
        where: and(
            isNull(schema.companies.deletedAt),
            eq(schema.companies.isVerified, true),
        ),
        with: {
            subscription: true,
            creditBalance: true,
            members: {
                with: { user: true },
            },
        },
    });

    const scored: MatchResult[] = [];

    for (const company of companies) {
        // Must have active subscription
        if (!company.subscription || !["active", "trialing"].includes(company.subscription.status)) {
            continue;
        }

        // Must have enough credits
        if (!company.creditBalance || company.creditBalance.balance < LEAD_CREDIT_COST) {
            continue;
        }

        // Calculate distance (simple Haversine if coordinates available)
        let distanceKm = 0;
        if (lead.latitude && lead.longitude && company.latitude && company.longitude) {
            distanceKm = haversineDistance(
                Number(lead.latitude), Number(lead.longitude),
                Number(company.latitude), Number(company.longitude)
            );

            // Skip if outside service radius
            if (company.serviceRadiusKm && distanceKm > company.serviceRadiusKm) {
                continue;
            }
        }

        // Score the match (0-100)
        let score = 50; // base score

        // Distance bonus (closer = better)
        if (distanceKm > 0) {
            score += Math.max(0, 20 - distanceKm); // up to +20 for nearby
        }

        // Rating bonus
        if (company.avgRating) {
            score += Number(company.avgRating) * 4; // up to +20 for 5-star
        }

        // Response speed bonus
        if (company.avgResponseHrs) {
            if (company.avgResponseHrs <= 2) score += 10;
            else if (company.avgResponseHrs <= 8) score += 5;
        }

        // Verified bonus
        if (company.isVerified) score += 5;

        // Service match bonus
        if (company.specialisaties && lead.dakkapelType) {
            const typeMap: Record<string, string> = {
                prefab: "prefab",
                traditioneel: "traditioneel",
                weet_niet: "",
            };
            const searchType = typeMap[lead.dakkapelType];
            if (searchType && company.specialisaties.includes(searchType)) {
                score += 10;
            }
        }

        // Material match bonus
        if (company.materialen && lead.materiaal && lead.materiaal !== "weet_niet") {
            if (company.materialen.includes(lead.materiaal)) {
                score += 5;
            }
        }

        // Get primary email from first owner/admin member
        const primaryMember = company.members.find(m => m.role === "owner") || company.members[0];
        const companyEmail = company.email || primaryMember?.user?.email;

        if (!companyEmail) continue;

        scored.push({
            companyId: company.id,
            companyName: company.name,
            companyEmail,
            matchScore: Math.round(score),
            distanceKm: Math.round(distanceKm * 10) / 10,
        });
    }

    // Sort by score descending, take top N
    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored.slice(0, MAX_COMPANIES_PER_LEAD);
}

/**
 * Haversine distance between two lat/lng points in km
 */
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(deg: number): number {
    return deg * (Math.PI / 180);
}
