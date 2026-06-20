/**
 * useMatchScore — computes a client-side match score for a listing against
 * the current tenant's stored preferences.
 *
 * Used in two contexts:
 *  1. Listing cards when the backend hasn't returned a score yet (preview mode)
 *  2. The listing detail page breakdown panel
 *
 * The backend score (from `match.matchScore`) is authoritative — this hook
 * only runs the client-side estimate when a backend score isn't available.
 *
 * @param tenantProfile  — tenant preferences (from stored form data or user profile)
 * @param listing        — the ListingProfile to score
 * @returns MatchResult with overall score, breakdown, highlights
 */

import { useMemo } from "react";
import { computeMatchScore } from "@/lib/matching/score";
import { DEFAULT_WEIGHTS }   from "@/lib/matching/weights";
import type { TenantProfile, ListingProfile, MatchResult } from "@/lib/matching/types";
import type { DimensionWeights }                           from "@/lib/matching/types";

export function useMatchScore(
  tenantProfile: TenantProfile | null | undefined,
  listing: ListingProfile | null | undefined,
  weights: DimensionWeights = DEFAULT_WEIGHTS,
): MatchResult | null {
  return useMemo(() => {
    if (!tenantProfile || !listing) return null;
    return computeMatchScore(tenantProfile, listing, weights);
  }, [tenantProfile, listing, weights]);
}
