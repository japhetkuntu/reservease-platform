/**
 * computeMatchScore — the single entry point for client-side match scoring.
 *
 * Takes a tenant profile and a listing, runs all dimension scorers, applies
 * weights, and returns a MatchResult with an overall 0-100 score, per-dimension
 * breakdown, and human-readable highlights.
 *
 * This is a pure function — no side effects, no network calls, no state.
 * The backend runs an equivalent algorithm; this version enables instant
 * preview feedback in the search wizard and client-side sorting.
 */

import type { TenantProfile, ListingProfile, MatchResult } from "./types";
import { DEFAULT_WEIGHTS } from "./weights";
import type { DimensionWeights } from "./types";
import {
  scoreLocation,
  scoreBudget,
  scoreRoomType,
  scoreFeatures,
  scoreResilience,
  scorePayment,
  scoreTrust,
  scoreLifestyle,
  failsHardConstraints,
} from "./dimensions";

export function computeMatchScore(
  tenant: TenantProfile,
  listing: ListingProfile,
  weights: DimensionWeights = DEFAULT_WEIGHTS,
): MatchResult {
  // Hard constraints gate first — a violation zeroes the entire score
  if (failsHardConstraints(tenant, listing)) {
    return {
      overall: 0,
      breakdown: {},
      highlights: [{ text: "Does not meet your requirements", type: "warning" }],
      failedHardConstraint: true,
    };
  }

  const location   = scoreLocation(tenant, listing);
  const budget     = scoreBudget(tenant, listing);
  const roomType   = scoreRoomType(tenant, listing);
  const features   = scoreFeatures(tenant, listing);
  const resilience = scoreResilience(tenant, listing);
  const payment    = scorePayment(tenant, listing);
  const trust      = scoreTrust(tenant, listing);
  const lifestyle  = scoreLifestyle(tenant, listing);

  // Weighted average: each dimension score × its weight%, divided by total weight
  const totalWeight = Object.values(weights).reduce((s, v) => s + v, 0);
  const weighted =
    location.score   * weights.location +
    budget.score     * weights.budget +
    roomType.score   * weights.roomType +
    features.score   * weights.features +
    resilience.score * weights.resilience +
    payment.score    * weights.payment +
    trust.score      * weights.trust +
    lifestyle.score  * weights.lifestyle;

  const overall = Math.round(Math.min(100, Math.max(0, weighted / totalWeight)));

  // Collect all highlights, positives first, limit to 5 most relevant
  const allHighlights = [
    ...location.highlights,
    ...budget.highlights,
    ...roomType.highlights,
    ...features.highlights,
    ...resilience.highlights,
    ...payment.highlights,
    ...trust.highlights,
    ...lifestyle.highlights,
  ];

  const positives = allHighlights.filter((h) => h.type === "positive").slice(0, 3);
  const warnings  = allHighlights.filter((h) => h.type === "warning").slice(0, 2);
  const highlights = [...positives, ...warnings];

  return {
    overall,
    breakdown: {
      location:   location.score,
      budget:     budget.score,
      roomType:   roomType.score,
      features:   features.score,
      resilience: resilience.score,
      payment:    payment.score,
      trust:      trust.score,
      lifestyle:  lifestyle.score,
    },
    highlights,
    failedHardConstraint: false,
  };
}
