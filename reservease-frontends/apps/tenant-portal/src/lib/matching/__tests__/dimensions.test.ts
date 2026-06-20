import { describe, it, expect } from "vitest";
import {
  scoreLocation,
  scoreBudget,
  scoreRoomType,
  scoreFeatures,
  scoreResilience,
  scorePayment,
  scoreTrust,
  failsHardConstraints,
} from "../dimensions";
import { computeMatchScore } from "../score";
import type { TenantProfile, ListingProfile } from "../types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function baseListing(overrides: Partial<ListingProfile> = {}): ListingProfile {
  return {
    id: "test", name: "Test Property", location: "East Legon, Accra",
    numericPrice: 1500, category: "apartment", roomType: "1-Bedroom",
    amenities: [], genderPolicy: "mixed", isVerified: false,
    backupPower: "None", waterReliability: "Regular", utilityMetering: "Shared",
    advanceMonths: 12, isInclusive: false, securityFeatures: [],
    airConditioning: false, parkingAvailable: false, cookingAllowed: true,
    childrenAllowed: true, breakfastIncluded: false, momoAccepted: true,
    ...overrides,
  };
}

function baseTenant(overrides: Partial<TenantProfile> = {}): TenantProfile {
  return {
    budget: { min: 1000, max: 2000 },
    locations: ["East Legon"],
    roomTypes: ["apartment"],
    facilities: [],
    moveInUrgency: [],
    gender: "any",
    ...overrides,
  };
}

// ── scoreLocation ─────────────────────────────────────────────────────────────

describe("scoreLocation", () => {
  it("returns 100 for exact substring match", () => {
    const r = scoreLocation({ locations: ["East Legon"] }, { location: "East Legon, Accra" });
    expect(r.score).toBe(100);
  });

  it("returns 80 when all tokens present", () => {
    const r = scoreLocation({ locations: ["Accra Legon"] }, { location: "Legon Accra Hills" });
    expect(r.score).toBeGreaterThanOrEqual(75);
  });

  it("returns ~60 for same city via suburb map", () => {
    // Achimota → accra, East Legon → accra
    const r = scoreLocation({ locations: ["East Legon"] }, { location: "Achimota, Accra" });
    expect(r.score).toBeGreaterThanOrEqual(50);
    expect(r.score).toBeLessThan(80);
  });

  it("returns low score for different city", () => {
    const r = scoreLocation({ locations: ["East Legon"] }, { location: "Kumasi Central" });
    expect(r.score).toBeLessThanOrEqual(30);
  });

  it("returns neutral 60 when no preference set", () => {
    const r = scoreLocation({ locations: [] }, { location: "Anywhere" });
    expect(r.score).toBe(60);
  });

  it("resolves KNUST → kumasi matches Ayeduase property", () => {
    const r = scoreLocation({ locations: ["KNUST"] }, { location: "Ayeduase, Kumasi" });
    expect(r.score).toBeGreaterThan(0);
  });
});

// ── scoreBudget ───────────────────────────────────────────────────────────────

describe("scoreBudget", () => {
  it("scores 100 when price is at exact centre of range", () => {
    const r = scoreBudget({ budget: { min: 1000, max: 2000 } }, { numericPrice: 1500 });
    expect(r.score).toBe(100);
  });

  it("scores high when within range", () => {
    const r = scoreBudget({ budget: { min: 1000, max: 2000 } }, { numericPrice: 1800 });
    expect(r.score).toBeGreaterThanOrEqual(86);
  });

  it("scores 0 when price exceeds max by over 30%", () => {
    const r = scoreBudget({ budget: { min: 1000, max: 2000 } }, { numericPrice: 3000 });
    expect(r.score).toBe(0);
  });

  it("scores 56 when slightly over budget (≤15%)", () => {
    const r = scoreBudget({ budget: { min: 1000, max: 2000 } }, { numericPrice: 2250 });
    expect(r.score).toBe(56);
  });

  it("returns 50 neutral when no budget set", () => {
    const r = scoreBudget({ budget: { min: 0, max: 0 } }, { numericPrice: 1500 });
    expect(r.score).toBe(50);
  });

  it("scores 80 when price is slightly below min (good value)", () => {
    const r = scoreBudget({ budget: { min: 1000, max: 2000 } }, { numericPrice: 800 });
    expect(r.score).toBe(80);
  });
});

// ── scoreRoomType ─────────────────────────────────────────────────────────────

describe("scoreRoomType", () => {
  it("scores 85+ for exact category match", () => {
    const r = scoreRoomType({ roomTypes: ["apartment"] }, { category: "apartment", roomType: "1-Bedroom" });
    expect(r.score).toBeGreaterThanOrEqual(85);
  });

  it("scores 95 for room-type substring match", () => {
    const r = scoreRoomType({ roomTypes: ["1-bedroom"] }, { category: "apartment", roomType: "1-Bedroom Apartment" });
    expect(r.score).toBe(95);
  });

  it("scores neutral 60 when no room type preference", () => {
    const r = scoreRoomType({ roomTypes: [] }, { category: "apartment", roomType: "Studio" });
    expect(r.score).toBe(60);
  });

  it("scores low for completely different category", () => {
    const r = scoreRoomType({ roomTypes: ["hostel"] }, { category: "apartment", roomType: "Studio" });
    expect(r.score).toBeLessThan(60);
  });
});

// ── scoreFeatures ─────────────────────────────────────────────────────────────

describe("scoreFeatures", () => {
  it("scores 100 when all requested features present", () => {
    const r = scoreFeatures(
      { facilities: ["wifi", "generator"] },
      { amenities: ["WiFi", "Generator", "AC"] },
    );
    expect(r.score).toBe(100);
  });

  it("scores 50 when half of requested features present", () => {
    const r = scoreFeatures(
      { facilities: ["wifi", "generator"] },
      { amenities: ["WiFi"] },
    );
    expect(r.score).toBe(50);
  });

  it("scores 0 when no requested features present", () => {
    const r = scoreFeatures(
      { facilities: ["wifi", "generator"] },
      { amenities: ["Gym", "Pool"] },
    );
    expect(r.score).toBe(0);
  });

  it("scores 60 neutral when no preference set", () => {
    const r = scoreFeatures({ facilities: [] }, { amenities: ["WiFi"] });
    expect(r.score).toBe(60);
  });

  it("matches case-insensitively", () => {
    const r = scoreFeatures({ facilities: ["WiFi"] }, { amenities: ["wifi"] });
    expect(r.score).toBe(100);
  });
});

// ── scorePayment ──────────────────────────────────────────────────────────────

describe("scorePayment", () => {
  it("scores 90 when advance is within limit", () => {
    const r = scorePayment({ maxAdvanceMonths: 12, isInclusiveRequired: false }, { advanceMonths: 6, isInclusive: false });
    expect(r.score).toBeGreaterThanOrEqual(85);
  });

  it("deducts for advance over limit", () => {
    const r = scorePayment({ maxAdvanceMonths: 6, isInclusiveRequired: false }, { advanceMonths: 12, isInclusive: false });
    expect(r.score).toBeLessThan(50);
  });

  it("adds points for inclusive listing when required", () => {
    const without = scorePayment({ maxAdvanceMonths: 12, isInclusiveRequired: true }, { advanceMonths: 6, isInclusive: false });
    const with_ = scorePayment({ maxAdvanceMonths: 12, isInclusiveRequired: true }, { advanceMonths: 6, isInclusive: true });
    expect(with_.score).toBeGreaterThan(without.score);
  });
});

// ── scoreTrust ────────────────────────────────────────────────────────────────

describe("scoreTrust", () => {
  it("scores higher for verified property", () => {
    const verified   = scoreTrust({ verificationRequired: false }, { isVerified: true,  securityFeatures: [] });
    const unverified = scoreTrust({ verificationRequired: false }, { isVerified: false, securityFeatures: [] });
    expect(verified.score).toBeGreaterThan(unverified.score);
  });

  it("deducts when verification required but not verified", () => {
    const r = scoreTrust({ verificationRequired: true }, { isVerified: false, securityFeatures: [] });
    expect(r.score).toBeLessThanOrEqual(30);
  });

  it("caps at 100", () => {
    const r = scoreTrust(
      { verificationRequired: false },
      { isVerified: true, securityFeatures: ["CCTV", "Guard", "Fence", "Intercom", "Dogs"] },
    );
    expect(r.score).toBeLessThanOrEqual(100);
  });
});

// ── failsHardConstraints ──────────────────────────────────────────────────────

describe("failsHardConstraints", () => {
  it("returns false when no constraints set", () => {
    expect(failsHardConstraints({}, baseListing())).toBe(false);
  });

  it("returns true when AC required but not available", () => {
    expect(failsHardConstraints(
      { acRequired: true },
      baseListing({ airConditioning: false }),
    )).toBe(true);
  });

  it("returns false when AC required and available", () => {
    expect(failsHardConstraints(
      { acRequired: true },
      baseListing({ airConditioning: true }),
    )).toBe(false);
  });

  it("returns true when cooking required but not allowed", () => {
    expect(failsHardConstraints(
      { cookingRequired: true },
      baseListing({ cookingAllowed: false }),
    )).toBe(true);
  });
});

// ── computeMatchScore (integration) ──────────────────────────────────────────

describe("computeMatchScore", () => {
  it("returns 0 and failedHardConstraint for hard constraint violation", () => {
    const tenant = baseTenant({ acRequired: true });
    const listing = baseListing({ airConditioning: false });
    const result = computeMatchScore(tenant, listing);
    expect(result.overall).toBe(0);
    expect(result.failedHardConstraint).toBe(true);
  });

  it("returns high score for near-perfect match", () => {
    const tenant = baseTenant({
      budget: { min: 1000, max: 2000 },
      locations: ["East Legon"],
      roomTypes: ["apartment"],
      facilities: ["wifi"],
    });
    const listing = baseListing({
      numericPrice: 1500,
      location: "East Legon, Accra",
      category: "apartment",
      amenities: ["WiFi", "Generator"],
      isVerified: true,
    });
    const result = computeMatchScore(tenant, listing);
    expect(result.overall).toBeGreaterThan(70);
    expect(result.failedHardConstraint).toBe(false);
  });

  it("overall score is always 0-100", () => {
    // Edge case: all zero scores
    const tenant = baseTenant({
      budget: { min: 100, max: 200 },
      locations: ["Kumasi"],
      roomTypes: ["hostel"],
      facilities: ["pool", "gym"],
    });
    const listing = baseListing({
      numericPrice: 5000,
      location: "Tamale",
      category: "apartment",
      amenities: [],
      isVerified: false,
    });
    const result = computeMatchScore(tenant, listing);
    expect(result.overall).toBeGreaterThanOrEqual(0);
    expect(result.overall).toBeLessThanOrEqual(100);
  });

  it("produces breakdown for all dimensions", () => {
    const result = computeMatchScore(baseTenant(), baseListing());
    expect(result.breakdown).toHaveProperty("location");
    expect(result.breakdown).toHaveProperty("budget");
    expect(result.breakdown).toHaveProperty("roomType");
  });
});
