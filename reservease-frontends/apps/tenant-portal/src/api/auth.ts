/**
 * Auth API Service — ReservEase Identity API
 *
 * ┌──────────────────────────┬────────┬─────────────────────────────────────────────────┐
 * │ Endpoint                 │ Method │ Path                                            │
 * ├──────────────────────────┼────────┼─────────────────────────────────────────────────┤
 * │ Login                    │ POST   │ /customers/login                                │
 * │ Register                 │ POST   │ /customers/register                             │
 * │ Resend OTP               │ POST   │ /customers/register/resend-otp                  │
 * │ Verify Email             │ POST   │ /customers/register/verify-email                │
 * │ Get Profile              │ GET    │ /customers/me                                   │
 * │ Refresh Token            │ POST   │ /customers/refreshtoken                         │
 * │ Forgot Password (init)   │ GET    │ /customers/reset-password/{email}               │
 * │ Reset Password           │ POST   │ /customers/reset-password                       │
 * │ Change Password          │ POST   │ /customers/change-password                      │
 * └──────────────────────────┴────────┴─────────────────────────────────────────────────┘
 *
 * All real responses are wrapped: ApiResponse<T> = { message, code, data, subCode?, errors? }
 * Success = code < 400. There is NO isSuccessful field.
 */

import { apiClient, USE_MOCK } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ResendOtpRequest,
  VerifyEmailRequest,
  ApiUser,
  UpdateProfileRequest,
  RefreshTokenResponse,
  ResetPasswordInitResponse,
  ResetPasswordRequest,
  ChangePasswordRequest,
  CustomerTokenResponse,
  ApiResponse,
  OtpResponse,
} from "./types";

// ─── Helpers ─────────────────────────────────────────────────

// `apiClient` now automatically unwraps `ApiResponse<T>` into `T`.

/** Convert the backend CustomerTokenResponse to the internal LoginResponse */
function toLoginResponse(r: CustomerTokenResponse): LoginResponse {
  const meta = r.metaData;
  return {
    token: r.accessToken,
    refreshToken: r.refreshToken ?? "",
    user: {
      id: meta?.id ?? "",
      email: meta?.email ?? "",
      firstName: meta?.firstName,
      lastName: meta?.lastName,
      name: meta?.fullName ?? `${meta?.firstName ?? ""} ${meta?.lastName ?? ""}`.trim(),
      fullName: meta?.fullName,
    },
  };
}

// ─── Public API ──────────────────────────────────────────────

export const authApi = {
  /** POST /customers/login → LoginResponse (normalised) */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const raw = await apiClient<CustomerTokenResponse>(
      "/customers/login",
      { method: "POST", body: JSON.stringify(data) }
    );
    return toLoginResponse(raw);
  },

  /** POST /customers/register → OtpResponse { email, uniqueId } */
  register: async (data: RegisterRequest): Promise<OtpResponse> => {
    const raw = await apiClient<OtpResponse>(
      "/customers/register",
      { method: "POST", body: JSON.stringify(data) }
    );
    return raw;
  },

  /** POST /customers/register/resend-otp */
  resendOtp: async (data: ResendOtpRequest): Promise<void> => {
    await apiClient<unknown>(
      "/customers/register/resend-otp",
      { method: "POST", body: JSON.stringify(data) }
    );
    return;
  },

  /**
   * POST /customers/register/verify-email
   * On success the backend returns a full CustomerTokenResponse (tokens + metaData).
   * We normalise it to LoginResponse so the caller can log the user in immediately.
   */
  verifyEmail: async (data: VerifyEmailRequest): Promise<LoginResponse> => {
    const raw = await apiClient<CustomerTokenResponse>(
      "/customers/register/verify-email",
      { method: "POST", body: JSON.stringify({ OTP: data.otp, UniqueId: data.uniqueId }) }
    );
    return toLoginResponse(raw);
  },

  /** GET /customers/me */
  getProfile: async (): Promise<ApiUser> => {
    const raw = await apiClient<ApiUser>("/customers/me");
    return raw;
  },

  /** PUT/PATCH profile */
  updateProfile: async (data: UpdateProfileRequest): Promise<ApiUser> => {
    const raw = await apiClient<ApiUser>(
      "/customers/me",
      { method: "PUT", body: JSON.stringify(data) }
    );
    return raw;
  },

  /**
   * POST /customers/refreshtoken
   * Called automatically by the 401 interceptor in client.ts.
   * Body: { RefreshToken: string }
   */
  refreshToken: (): Promise<RefreshTokenResponse> => {
    // Body / headers injected by the caller (client.ts refreshAccessToken)
    return apiClient<RefreshTokenResponse>("/customers/refreshtoken", {
      method: "POST",
      _skipRefresh: true,
    } as Parameters<typeof apiClient>[1]);
  },

  /** GET /customers/reset-password/{email} — initiates forgot-password flow */
  forgotPassword: async (email: string): Promise<ResetPasswordInitResponse> => {
    const raw = await apiClient<ResetPasswordInitResponse>(
      `/customers/reset-password/${encodeURIComponent(email)}`
    );
    return raw;
  },

  /** POST /customers/reset-password */
  resetPassword: async (data: ResetPasswordRequest): Promise<LoginResponse> => {
    const raw = await apiClient<CustomerTokenResponse>(
      "/customers/reset-password",
      { method: "POST", body: JSON.stringify(data) }
    );
    return toLoginResponse(raw);
  },

  /** POST /customers/change-password (authenticated) */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient<unknown>(
      "/customers/change-password",
      { method: "POST", body: JSON.stringify(data) }
    );
    return;
  },
};
