/**
 * API Types — Mirroring the ReservEase Identity API (.NET backend).
 *
 * Identity API base: /api/v1/customers/...
 */

// ─── Shared wrapper ──────────────────────────────────────────
/**
 * Maps to: ApiResponse<T> { Message, Code, Data, SubCode, Errors }
 * Serialized by ASP.NET Core to camelCase.
 * Success is indicated by code < 400 (NOT by an isSuccessful flag — that field does NOT exist).
 */
export interface ApiResponse<T> {
  message: string;
  code: number;
  data: T | null;
  subCode?: string;
  errors?: Array<{ field: string; errorMessage: string }>;
}

// ─── Auth ────────────────────────────────────────────────────

// POST /api/v1/customers/login
export interface LoginRequest {
  email: string;
  password: string;
}

/** Metadata included in the login / token response */
export interface CustomerLoginMetaData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  mobileNumber?: string;
}

/** Shape returned by POST /api/v1/customers/login and /refreshtoken */
export interface CustomerTokenResponse {
  accessToken: string;
  refreshToken?: string;
  metaData?: CustomerLoginMetaData;
}

/** Convenience alias used internally in AuthContext */
export interface LoginResponse {
  token: string;           // mapped from accessToken
  refreshToken: string;    // mapped from refreshToken
  user: ApiUser;           // mapped from metaData
}

// POST /api/v1/customers/register
export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  source?: string;
}

/** Historical alias used in the app — maps to RegisterRequest */
export type SignupRequest = RegisterRequest;

/** Response from POST /api/v1/customers/register */
export interface OtpResponse {
  email: string;
  uniqueId: string;
}

/** Same shape, aliased for symmetry */
export type SignupResponse = OtpResponse;

// POST /api/v1/customers/register/verify-email
export interface VerifyEmailRequest {
  otp: string;       // maps to OTP field in backend
  uniqueId: string;  // returned from the register response
}

export interface VerifyEmailResponse {
  verified: boolean;
}

// POST /api/v1/customers/register/resend-otp
export interface ResendOtpRequest {
  email: string;
}

// GET /api/v1/customers/me
export interface ApiUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name?: string;   // convenience — `${firstName} ${lastName}`
  isVerified?: boolean;
  mobileNumber?: string;
  createdAt?: string;
}

// PUT /api/v1/customers/update-profile (or similar)
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
}

// GET /api/v1/customers/reset-password/{email}
export interface ResetPasswordInitResponse {
  email: string;
  uniqueId: string;
}

// POST /api/v1/customers/reset-password
export interface ResetPasswordRequest {
  uniqueId: string;
  otpCode: string;
  password: string;
  confirmPassword: string;
}

// POST /api/v1/customers/change-password
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Token refresh
export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

// ─── Requests / Search ──────────────────────────────────────

export type RequestStatus =
  | "draft"
  | "pending-payment"
  | "waiting-payment-confirmation"
  | "payment-failed"
  | "paid"
  | "processing"
  | "matches-found"
  | "no-matches-found"
  | "alternatives-suggested"
  | "assigned-to-agent"
  | "completed"
  | "cancelled";

export interface CreateRequestPayload {
  searchingFor: "self" | "someone-else";
  gender: "male" | "female" | "any";
  budget: { min: number; max: number };
  location: string[];
  roomType: string[];
  duration: string[];
  moveInUrgency: string[];
  facilities: string[];
  notes: string;
  preferredBackupPower?: string | null;
  preferredWaterReliability?: string | null;
  preferredUtilityMetering?: string | null;
  preferredRoadAccess?: string | null;
  preferredBathroomType?: string | null;
  maxAdvanceMonths?: number | null;
  maxSecurityDeposit?: number | null;
  verificationRequired?: boolean;
  isInclusiveRequired?: boolean;
  // Ghana-Specific Preferences
  preferredTransportAccess?: string[];
  preferredCompoundType?: string | null;
  preferredInternetType?: string | null;
  momoPaymentRequired?: boolean;
  negotiableRequired?: boolean;
  cookingRequired?: boolean;
  childrenAllowedRequired?: boolean;
  minCampusProximity?: string | null;
  nearestCampus?: string | null;
  breakfastRequired?: boolean;
  acRequired?: boolean;
  parkingRequired?: boolean;
  preferredFurnishedStatus?: string | null;
}

export type RefineRequestPayload = Partial<CreateRequestPayload>;

export interface ApiAccommodationLocation {
  address: string;
  landmark?: string;
  coordinates?: { lat: number; lng: number };
  googleMapsUrl?: string;
}

export interface ApiMatchReason {
  label: string;
  value: string;
  type: "positive" | "neutral" | "warning";
}

export interface ApiScoreBreakdown {
  location?: number;
  budget?: number;
  roomType?: number;
  features?: number;
  resilience?: number;
  payment?: number;
  trust?: number;
  lifestyle?: number;
}

export interface ApiAccommodationMatch {
  id: string;
  alias: string;
  price: string;
  priceNote?: string;
  distance: string;
  roomType: string;
  genderPolicy: "male-only" | "female-only" | "mixed";
  matchReasons: ApiMatchReason[];
  images: string[];
  hasVideo: boolean;
  videoUrl?: string;
  youtubeUrl?: string;
  isAlternative?: boolean;
  location: ApiAccommodationLocation;
  paymentInfo?: string;

  // Intelligence fields
  isVerified: boolean;
  backupPower: string;
  waterReliability: string;
  utilityMetering: string;
  roadAccess: string;
  advanceMonths: number;
  isInclusive: boolean;
  bathroomType: string;
  securityFeatures: string[];
  googleMapsUrl?: string;

  // Match score — 0-100 normalised score from backend; breakdown per dimension
  matchScore?: number;
  breakdown?: ApiScoreBreakdown;
}

export interface ApiSearchAttempt {
  attemptNumber: number;
  timestamp: string;
  parameters: CreateRequestPayload;
  matchesFound: number;
}

export interface ApiAccommodationRequest {
  id: string;
  createdAt: string;
  status: RequestStatus;
  searchingFor: "self" | "someone-else";
  gender: "male" | "female" | "any";
  budget: { min: number; max: number };
  location: string[];
  roomType: string[];
  duration: string[];
  moveInUrgency: string[];
  facilities: string[];
  notes: string;
  preferredBackupPower?: string | null;
  preferredWaterReliability?: string | null;
  preferredUtilityMetering?: string | null;
  preferredRoadAccess?: string | null;
  preferredBathroomType?: string | null;
  maxAdvanceMonths?: number | null;
  maxSecurityDeposit?: number | null;
  verificationRequired?: boolean;
  isInclusiveRequired?: boolean;
  // Ghana-Specific Preferences
  preferredTransportAccess?: string[];
  preferredCompoundType?: string | null;
  preferredInternetType?: string | null;
  momoPaymentRequired?: boolean;
  negotiableRequired?: boolean;
  cookingRequired?: boolean;
  childrenAllowedRequired?: boolean;
  minCampusProximity?: string | null;
  nearestCampus?: string | null;
  breakfastRequired?: boolean;
  acRequired?: boolean;
  parkingRequired?: boolean;
  preferredFurnishedStatus?: string | null;
  paidAt?: string;
  discountApplied?: boolean;
  matches: ApiAccommodationMatch[];
  agentAssigned?: boolean;
  estimatedDelivery?: string;
  retriesRemaining: number;
  totalSearches: number;
  searchHistory: ApiSearchAttempt[];
  adminHistory?: ApiAdminHistoryEntry[];
  agentEscalationEnabled: boolean;
}

export interface ApiAdminHistoryEntry {
  event: string;
  description: string;
  timestamp: string;
}

// ─── Payments ────────────────────────────────────────────────

export interface InitiatePaymentRequest {
  requestId: string;
  paymentMethod?: string;
}

export interface InitiatePaymentResponse {
  paymentId: string;
  clientReference: string;
  paymentUrl?: string;
  status: "pending" | "completed" | "failed";
}

export interface PaymentStatusResponse {
  paymentId: string;
  requestId: string;
  status: "pending" | "completed" | "failed";
  amount: number;
  currency: string;
  clientReference: string;
  paidAt?: string;
}

// ─── Favorites ───────────────────────────────────────────────

export interface ApiFavorite {
  id: string;
  accommodationId: string;
  name: string;
  location: string;
  price: string;
  roomType: string;
  images: string[];
  available: boolean;
  createdAt: string;
}

export interface AddFavoriteRequest {
  accommodationId: string;
}

// ─── Notifications ───────────────────────────────────────────

export interface ApiNotification {
  id: string;
  type: "search-started" | "matches-found" | "agent-assigned" | "update" | "system";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  requestId?: string;
}

// ─── Pagination ──────────────────────────────────────────────

export interface PaginatedResponse<T> {
  results: T[];          // backend field name: Results (camelCase: results)
  data?: T[];            // alias — some endpoints may use `data`
  totalCount: number;   // backend: TotalCount
  total?: number;       // alias for compatibility
  pageIndex: number;    // backend: PageIndex
  page?: number;        // alias for compatibility
  pageSize: number;
  totalPages: number;
}
