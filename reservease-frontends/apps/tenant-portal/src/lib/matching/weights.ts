import type { DimensionWeights } from "./types";

/**
 * Default dimension weights used when no tenant-specific signal data is available.
 *
 * Weights are percentages and must sum to 100. They were calibrated against
 * Ghana student-housing search behaviour: location and budget dominate because
 * they are the hardest constraints tenants actually enforce.
 */
export const DEFAULT_WEIGHTS: DimensionWeights = {
  location:   25,
  budget:     22,
  roomType:   15,
  features:   13,
  resilience:  8,
  payment:     7,
  trust:       6,
  lifestyle:   4,
};

// ── Implicit signal event types ───────────────────────────────────────────────

export type SignalType =
  | "view"           // opened listing detail
  | "dwell"          // spent >30s on listing detail
  | "photo_swipe"    // swiped through images
  | "save"           // hearted / saved
  | "dismiss"        // swiped away
  | "compare"        // added to comparison
  | "apply";         // started application

export interface TenantSignal {
  listingId: string;
  type: SignalType;
  /** Which dimensions this signal carries evidence about. */
  dimensionHints: (keyof DimensionWeights)[];
  /** Positive or negative signal. */
  valence: 1 | -1;
  /** Signal strength 0-1. */
  strength: number;
}

/** Map each signal type to its strength and valence. */
const SIGNAL_CONFIG: Record<SignalType, { strength: number; valence: 1 | -1 }> = {
  view:        { strength: 0.1,  valence:  1 },
  dwell:       { strength: 0.25, valence:  1 },
  photo_swipe: { strength: 0.15, valence:  1 },
  save:        { strength: 0.6,  valence:  1 },
  dismiss:     { strength: 0.4,  valence: -1 },
  compare:     { strength: 0.75, valence:  1 },
  apply:       { strength: 1.0,  valence:  1 },
};

/**
 * Adjust weights based on an accumulated set of implicit signals.
 * Called after ≥5 interactions to personalise the scoring for a tenant.
 *
 * Algorithm: for each signal, nudge the hinted dimensions up or down by a
 * small delta (strength × valence × 2 pp), then re-normalise to sum to 100.
 * The adjustment is deliberately slow-moving to avoid wild swings from a
 * single interaction.
 *
 * @param base   - Starting weights (usually DEFAULT_WEIGHTS or stored user weights)
 * @param signals - All signals recorded for this tenant so far
 * @returns New weight set normalised to 100
 */
export function adjustWeights(
  base: DimensionWeights,
  signals: TenantSignal[],
): DimensionWeights {
  if (signals.length < 5) return base;

  const adjusted = { ...base };
  const NUDGE_PER_SIGNAL = 2; // percentage points per unit signal strength

  for (const signal of signals) {
    const { strength, valence } = SIGNAL_CONFIG[signal.type];
    const delta = strength * valence * NUDGE_PER_SIGNAL;

    for (const dim of signal.dimensionHints) {
      adjusted[dim] = Math.max(1, adjusted[dim] + delta);
    }
  }

  // Re-normalise so weights sum to exactly 100
  const total = Object.values(adjusted).reduce((s, v) => s + v, 0);
  const factor = 100 / total;
  const keys = Object.keys(adjusted) as (keyof DimensionWeights)[];
  for (const k of keys) {
    adjusted[k] = adjusted[k] * factor;
  }

  return adjusted;
}
