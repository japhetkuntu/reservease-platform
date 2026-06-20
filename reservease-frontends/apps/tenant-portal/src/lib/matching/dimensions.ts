/**
 * Pure scoring functions — one per dimension.
 *
 * Each function returns a 0-100 score and an optional human-readable reason.
 * No side effects, no API calls, no external state. Trivially unit-testable.
 *
 * These mirror the C# backend scorers in AccommodationMatching.Actor.Sdk/Services/Providers/Scorers.cs
 * so the client can compute preview scores without an extra API round-trip.
 */

import type { TenantProfile, ListingProfile, MatchHighlight } from "./types";

// ── Internal helpers ──────────────────────────────────────────────────────────

/** Normalise a string for fuzzy comparison: lowercase, collapse separators to space. */
function norm(s: string | undefined | null): string {
  return (s ?? "").toLowerCase().replace(/[-_.\s]+/g, " ").trim();
}

function normContains(haystack: string | undefined, needle: string): boolean {
  if (!needle || !haystack) return false;
  return norm(haystack).includes(norm(needle));
}

function anyNormEq(list: string[], value: string): boolean {
  const v = norm(value);
  return list.some((item) => norm(item) === v);
}

// Ghanaian suburb → parent city for same-city scoring
const SUBURB_TO_CITY: Record<string, string> = {
  "east legon": "accra", "east-legon": "accra", "adenta": "accra",
  "madina": "accra", "legon": "accra", "haatso": "accra",
  "airport": "accra", "tema": "accra", "teshie": "accra",
  "nungua": "accra", "osu": "accra", "labone": "accra",
  "spintex": "accra", "achimota": "accra", "lapaz": "accra",
  "dansoman": "accra", "dzorwulu": "accra", "abelenkpe": "accra",
  "west legon": "accra", "west-legon": "accra", "north legon": "accra",
  "north-legon": "accra",
  "knust": "kumasi", "ayeduase": "kumasi", "bomso": "kumasi",
  "kotei": "kumasi", "nhyiaeso": "kumasi", "bantama": "kumasi",
  "asokwa": "kumasi", "adum": "kumasi",
  "ucc": "cape coast", "amamoma": "cape coast", "abura": "cape coast",
  "cape coast": "cape coast",
  "takoradi": "sekondi-takoradi", "sekondi": "sekondi-takoradi",
  "tamale": "tamale", "sagnarigu": "tamale",
};

function resolveCity(location: string): string | null {
  const n = norm(location);
  for (const [suburb, city] of Object.entries(SUBURB_TO_CITY)) {
    if (n.includes(suburb)) return city;
  }
  return null;
}

export interface DimensionResult {
  score: number;
  highlights: MatchHighlight[];
}

// ── 1. Location (0-100) ───────────────────────────────────────────────────────

/**
 * Tier 1 (100): Preferred location string found in listing address.
 * Tier 2 (80):  All tokens of preferred location present in address.
 * Tier 3 (60):  Same parent city (via suburb→city map).
 * Tier 4 (20):  Partial token overlap.
 * Tier 0:       No match.
 */
export function scoreLocation(
  tenant: Pick<TenantProfile, "locations">,
  listing: Pick<ListingProfile, "location">,
): DimensionResult {
  if (tenant.locations.length === 0) {
    return { score: 60, highlights: [] }; // no preference = neutral
  }

  const accomNorm = norm(listing.location);
  let best = 0;
  let bestHighlight: MatchHighlight | null = null;

  for (const pref of tenant.locations) {
    if (!pref) continue;
    const prefNorm = norm(pref);
    const prefTokens = prefNorm.split(" ").filter((t) => t.length > 2);
    const accomTokens = new Set(accomNorm.split(/[\s,]+/).filter((t) => t.length > 2));

    // Tier 1: exact substring
    if (accomNorm.includes(prefNorm)) {
      return { score: 100, highlights: [{ text: `In ${pref}`, type: "positive" }] };
    }

    // Tier 2: all tokens present
    if (prefTokens.length > 0 && prefTokens.every((t) => accomTokens.has(t))) {
      if (best < 80) { best = 80; bestHighlight = { text: `Exact area match (${pref})`, type: "positive" }; }
      continue;
    }

    // Tier 3: same city
    const prefCity  = resolveCity(prefNorm);
    const accomCity = resolveCity(accomNorm);
    if (prefCity && accomCity && prefCity === accomCity) {
      if (best < 60) { best = 60; bestHighlight = { text: `Same city as ${pref}`, type: "positive" }; }
      continue;
    }

    // Tier 4: partial token overlap
    const matchCount = prefTokens.filter((t) => accomTokens.has(t)).length;
    if (matchCount > 0 && prefTokens.length > 0) {
      const partial = Math.round(20 + (20 * matchCount / prefTokens.length));
      if (partial > best) { best = partial; bestHighlight = { text: "In your preferred general area", type: "neutral" }; }
    }
  }

  return {
    score: best,
    highlights: bestHighlight ? [bestHighlight] : [{ text: "Outside your preferred area", type: "warning" }],
  };
}

// ── 2. Budget (0-100) ─────────────────────────────────────────────────────────

/**
 * Within range: 100 (perfect centre) → 86 (at edges).
 * 0-15% over max: 56.
 * 15-30% over:    24.
 * >30% over:       0.
 * Below min by <30%: 80 (good value).
 * Below min by >60%: 20 (suspiciously cheap).
 */
export function scoreBudget(
  tenant: Pick<TenantProfile, "budget">,
  listing: Pick<ListingProfile, "numericPrice">,
): DimensionResult {
  const { min, max } = tenant.budget;
  const price = listing.numericPrice;

  if (max <= 0) return { score: 50, highlights: [] };

  if (price >= min && price <= max) {
    const mid = (min + max) / 2;
    const range = max > min ? max - min : 1;
    const distance = Math.abs(price - mid) / range;
    const score = Math.round(100 - 14 * distance);
    return { score, highlights: [{ text: "Within your budget", type: "positive" }] };
  }

  if (price < min) {
    const ratio = min > 0 ? (min - price) / min : 1;
    if (ratio <= 0.3)  return { score: 80, highlights: [{ text: "Good value — slightly below budget", type: "positive" }] };
    if (ratio <= 0.6)  return { score: 50, highlights: [{ text: "Below your budget range", type: "neutral" }] };
    return { score: 20, highlights: [{ text: "Well below your minimum", type: "warning" }] };
  }

  const over = (price - max) / max;
  if (over <= 0.15) return { score: 56, highlights: [{ text: "Slightly over budget", type: "neutral" }] };
  if (over <= 0.30) return { score: 24, highlights: [{ text: "Above your budget", type: "warning" }] };
  return { score: 0, highlights: [{ text: "Exceeds your budget", type: "warning" }] };
}

// ── 3. Room type (0-100) ──────────────────────────────────────────────────────

// Wizard values → canonical backend categories
const WIZARD_TO_CATEGORY: Record<string, string> = {
  hostel: "hostel", apartment: "apartment", "hotel room": "hotel-room",
  "hotel-room": "hotel-room", "guest house": "guest-house",
  "guest-house": "guest-house", "self contain": "self-contain",
  "self-contain": "self-contain", homestay: "homestay",
};

// Category → intent cluster for partial-credit matching
const CATEGORY_TO_INTENT: Record<string, string> = {
  hostel: "student", apartment: "longterm", "hotel-room": "shortterm",
  "guest-house": "shortterm", "self-contain": "longterm", homestay: "longterm",
};

export function scoreRoomType(
  tenant: Pick<TenantProfile, "roomTypes">,
  listing: Pick<ListingProfile, "category" | "roomType">,
): DimensionResult {
  if (tenant.roomTypes.length === 0) {
    return { score: 60, highlights: [] };
  }

  const accomCat  = norm(listing.category);
  const accomRoom = norm(listing.roomType);

  for (const pref of tenant.roomTypes) {
    const prefNorm = norm(pref);
    const targetCat = WIZARD_TO_CATEGORY[prefNorm] ?? prefNorm;

    // Exact room-type match
    if (accomRoom.includes(prefNorm) || prefNorm.includes(accomRoom)) {
      return { score: 95, highlights: [{ text: `Exact match: ${listing.roomType}`, type: "positive" }] };
    }

    // Exact category match
    if (norm(targetCat) === accomCat) {
      return { score: 85, highlights: [{ text: `Matches your preferred type`, type: "positive" }] };
    }

    // Same intent cluster
    const prefIntent  = CATEGORY_TO_INTENT[norm(targetCat)];
    const accomIntent = CATEGORY_TO_INTENT[accomCat];
    if (prefIntent && accomIntent && prefIntent === accomIntent) {
      return { score: 55, highlights: [{ text: `Similar property type`, type: "neutral" }] };
    }
  }

  return { score: 10, highlights: [{ text: "Different property type", type: "warning" }] };
}

// ── 4. Features / amenities (0-100) ──────────────────────────────────────────

/**
 * Each requested facility that is present adds proportional score.
 * Missing any facility deducts proportionally — never below 0.
 * Cap at 100.
 */
export function scoreFeatures(
  tenant: Pick<TenantProfile, "facilities">,
  listing: Pick<ListingProfile, "amenities">,
): DimensionResult {
  if (tenant.facilities.length === 0) return { score: 60, highlights: [] };

  const highlights: MatchHighlight[] = [];
  let matched = 0;

  for (const facility of tenant.facilities) {
    const found = listing.amenities.some(
      (a) => normContains(a, facility) || normContains(facility, a),
    );
    if (found) {
      matched++;
      highlights.push({ text: `Has ${facility}`, type: "positive" });
    } else {
      highlights.push({ text: `Missing: ${facility}`, type: "warning" });
    }
  }

  const score = Math.round((matched / tenant.facilities.length) * 100);
  return { score, highlights };
}

// ── 5. Resilience — power / water (0-100) ────────────────────────────────────

export function scoreResilience(
  tenant: Pick<TenantProfile, "preferredBackupPower" | "preferredWaterReliability" | "preferredUtilityMetering">,
  listing: Pick<ListingProfile, "backupPower" | "waterReliability" | "utilityMetering">,
): DimensionResult {
  const highlights: MatchHighlight[] = [];
  let score = 40; // neutral baseline when no prefs set

  if (tenant.preferredBackupPower) {
    if (norm(listing.backupPower) === norm(tenant.preferredBackupPower)) {
      score += 30;
      highlights.push({ text: `Has ${listing.backupPower} backup power`, type: "positive" });
    } else if (listing.backupPower && listing.backupPower !== "None") {
      score += 15;
      highlights.push({ text: `Has ${listing.backupPower} (not exact match)`, type: "neutral" });
    } else {
      score -= 20;
      highlights.push({ text: "No backup power", type: "warning" });
    }
  }

  if (tenant.preferredWaterReliability) {
    if (norm(listing.waterReliability) === norm(tenant.preferredWaterReliability)) {
      score += 20;
      highlights.push({ text: `${listing.waterReliability} water supply`, type: "positive" });
    }
  }

  if (tenant.preferredUtilityMetering) {
    if (norm(listing.utilityMetering) === norm(tenant.preferredUtilityMetering)) {
      score += 10;
      highlights.push({ text: `${listing.utilityMetering} meter`, type: "positive" });
    }
  }

  return { score: Math.max(0, Math.min(100, score)), highlights };
}

// ── 6. Payment terms (0-100) ─────────────────────────────────────────────────

export function scorePayment(
  tenant: Pick<TenantProfile, "maxAdvanceMonths" | "isInclusiveRequired">,
  listing: Pick<ListingProfile, "advanceMonths" | "isInclusive">,
): DimensionResult {
  const highlights: MatchHighlight[] = [];
  let score = 50;

  if (tenant.maxAdvanceMonths != null) {
    if (listing.advanceMonths <= tenant.maxAdvanceMonths) {
      score += 40;
      highlights.push({ text: `${listing.advanceMonths} month advance — within your limit`, type: "positive" });
    } else {
      const over = listing.advanceMonths - tenant.maxAdvanceMonths;
      score -= Math.min(40, over * 8);
      highlights.push({ text: `${listing.advanceMonths} months advance required`, type: "warning" });
    }
  } else if (listing.advanceMonths <= 3) {
    score += 20;
    highlights.push({ text: `Low advance — only ${listing.advanceMonths} month(s)`, type: "positive" });
  }

  if (tenant.isInclusiveRequired && listing.isInclusive) {
    score += 10;
    highlights.push({ text: "Utilities included in rent", type: "positive" });
  } else if (!tenant.isInclusiveRequired && listing.isInclusive) {
    score += 5;
    highlights.push({ text: "Bonus: bills included", type: "positive" });
  }

  return { score: Math.max(0, Math.min(100, score)), highlights };
}

// ── 7. Trust (0-100) ─────────────────────────────────────────────────────────

export function scoreTrust(
  tenant: Pick<TenantProfile, "verificationRequired">,
  listing: Pick<ListingProfile, "isVerified" | "securityFeatures">,
): DimensionResult {
  const highlights: MatchHighlight[] = [];
  let score = 30;

  if (listing.isVerified) {
    score += 50;
    highlights.push({ text: "ReservEase Verified", type: "positive" });
  } else if (tenant.verificationRequired) {
    score -= 20;
    highlights.push({ text: "Not verified by ReservEase", type: "warning" });
  }

  if (listing.securityFeatures.length > 0) {
    score += Math.min(20, listing.securityFeatures.length * 5);
    highlights.push({ text: `Secured: ${listing.securityFeatures.slice(0, 2).join(", ")}`, type: "positive" });
  }

  return { score: Math.max(0, Math.min(100, score)), highlights };
}

// ── 8. Lifestyle (0-100) ─────────────────────────────────────────────────────

export function scoreLifestyle(
  tenant: Pick<TenantProfile, "nearestCampus" | "minCampusProximity" | "preferredFurnishedStatus">,
  listing: Pick<ListingProfile, "nearestCampus" | "campusProximity" | "furnishedStatus">,
): DimensionResult {
  const highlights: MatchHighlight[] = [];
  let score = 50;

  if (tenant.nearestCampus && listing.nearestCampus) {
    if (anyNormEq([listing.nearestCampus], tenant.nearestCampus)) {
      score += 30;
      highlights.push({ text: `Near ${listing.nearestCampus}`, type: "positive" });

      if (tenant.minCampusProximity && norm(listing.campusProximity) === norm(tenant.minCampusProximity)) {
        score += 10;
        highlights.push({ text: `${listing.campusProximity} distance to campus`, type: "positive" });
      }
    } else {
      score -= 10;
      highlights.push({ text: `Near ${listing.nearestCampus} (different campus)`, type: "neutral" });
    }
  }

  if (tenant.preferredFurnishedStatus && listing.furnishedStatus) {
    if (norm(listing.furnishedStatus) === norm(tenant.preferredFurnishedStatus)) {
      score += 10;
      highlights.push({ text: `${listing.furnishedStatus}`, type: "positive" });
    } else if (norm(tenant.preferredFurnishedStatus) === "furnished" && norm(listing.furnishedStatus) === "unfurnished") {
      score -= 10;
      highlights.push({ text: "Unfurnished (you preferred furnished)", type: "warning" });
    }
  }

  return { score: Math.max(0, Math.min(100, score)), highlights };
}

// ── Hard constraint check ─────────────────────────────────────────────────────

/**
 * Returns true if the listing fails any hard boolean constraint.
 * A property that fails hard constraints scores 0 overall — shown to users
 * as "Does not meet your requirements" rather than a low score.
 */
export function failsHardConstraints(
  tenant: Pick<
    TenantProfile,
    | "acRequired"
    | "parkingRequired"
    | "cookingRequired"
    | "childrenAllowedRequired"
    | "breakfastRequired"
    | "momoPaymentRequired"
  >,
  listing: Pick<
    ListingProfile,
    | "airConditioning"
    | "parkingAvailable"
    | "cookingAllowed"
    | "childrenAllowed"
    | "breakfastIncluded"
    | "momoAccepted"
  >,
): boolean {
  if (tenant.acRequired          && !listing.airConditioning)    return true;
  if (tenant.parkingRequired     && !listing.parkingAvailable)   return true;
  if (tenant.cookingRequired     && !listing.cookingAllowed)     return true;
  if (tenant.childrenAllowedRequired && !listing.childrenAllowed) return true;
  if (tenant.breakfastRequired   && !listing.breakfastIncluded)  return true;
  if (tenant.momoPaymentRequired && !listing.momoAccepted)       return true;
  return false;
}
