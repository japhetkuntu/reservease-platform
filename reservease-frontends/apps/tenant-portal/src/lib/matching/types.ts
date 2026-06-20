/**
 * Shared types for the client-side matching module.
 * These mirror the C# backend models so the frontend can compute preview scores
 * (e.g. during the search wizard) and display breakdowns without extra API calls.
 */

// ── Tenant preference profile ─────────────────────────────────────────────────

export interface TenantBudget {
  min: number;
  max: number;
}

/** The subset of tenant preferences that drive scoring. */
export interface TenantProfile {
  budget: TenantBudget;
  locations: string[];
  roomTypes: string[];         // e.g. ["apartment", "self-contain"]
  facilities: string[];        // must-have amenities
  moveInUrgency: string[];     // e.g. ["urgently", "this-week"]
  gender: "male" | "female" | "any";

  // Utility prefs
  preferredBackupPower?: string;
  preferredWaterReliability?: string;
  preferredUtilityMetering?: string;

  // Hard boolean constraints — any violation scores 0 for that property
  acRequired?: boolean;
  parkingRequired?: boolean;
  cookingRequired?: boolean;
  childrenAllowedRequired?: boolean;
  breakfastRequired?: boolean;
  momoPaymentRequired?: boolean;
  verificationRequired?: boolean;
  isInclusiveRequired?: boolean;

  // Campus / lifestyle
  nearestCampus?: string;
  minCampusProximity?: string;
  maxAdvanceMonths?: number;
  preferredFurnishedStatus?: string;
}

// ── Listing profile (what the backend returns per property) ───────────────────

export interface ListingProfile {
  id: string;
  name: string;
  location: string;
  numericPrice: number;
  category: string;          // "apartment" | "hostel" | "hotel-room" | ...
  roomType: string;
  amenities: string[];
  genderPolicy: "mixed" | "male-only" | "female-only";
  isVerified: boolean;
  backupPower?: string;
  waterReliability?: string;
  utilityMetering?: string;
  advanceMonths: number;
  isInclusive: boolean;
  securityFeatures: string[];
  campusProximity?: string;
  nearestCampus?: string;
  furnishedStatus?: string;
  airConditioning?: boolean;
  parkingAvailable?: boolean;
  cookingAllowed?: boolean;
  childrenAllowed?: boolean;
  breakfastIncluded?: boolean;
  momoAccepted?: boolean;
}

// ── Score result ──────────────────────────────────────────────────────────────

export interface ScoreBreakdown {
  location?: number;
  budget?: number;
  roomType?: number;
  features?: number;
  resilience?: number;
  payment?: number;
  trust?: number;
  lifestyle?: number;
}

export interface MatchHighlight {
  text: string;
  type: "positive" | "neutral" | "warning";
}

export interface MatchResult {
  /** Overall 0-100 match score. */
  overall: number;
  /** Per-dimension 0-100 scores. */
  breakdown: ScoreBreakdown;
  /** Human-readable highlights shown in the UI. */
  highlights: MatchHighlight[];
  /** True if this listing failed any hard constraint. */
  failedHardConstraint: boolean;
}

// ── Dimension weight configuration ───────────────────────────────────────────

export interface DimensionWeights {
  location: number;
  budget: number;
  roomType: number;
  features: number;
  resilience: number;
  payment: number;
  trust: number;
  lifestyle: number;
}
