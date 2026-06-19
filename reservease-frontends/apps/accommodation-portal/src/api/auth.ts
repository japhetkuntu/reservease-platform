import { apiClient } from "./client";

export interface ApiUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  isVerified: boolean;
  profilePicture?: string;
  city?: string;
  bio?: string;
}

export interface CustomerTokenResponse {
  accessToken: string;
  refreshToken?: string;
  metaData: ApiUser;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    firstName?: string;
    lastName?: string;
    isVerified: boolean;
    profilePicture?: string;
    city?: string;
    bio?: string;
  };
}

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
      isVerified: meta?.isVerified ?? true,
      profilePicture: meta?.profilePicture,
      city: meta?.city,
      bio: meta?.bio,
    },
  };
}

export const authApi = {
  login: async (data: any): Promise<LoginResponse> => {
    const raw = await apiClient<CustomerTokenResponse>(
      "/customers/login",
      { method: "POST", body: JSON.stringify(data), service: "identity" }
    );
    return toLoginResponse(raw);
  },

  register: async (data: any): Promise<any> => {
    return apiClient<any>(
      "/customers/register",
      { method: "POST", body: JSON.stringify(data), service: "identity" }
    );
  },

  verifyEmail: async (data: any): Promise<any> => {
    const raw = await apiClient<any>(
      "/customers/register/verify-email",
      { method: "POST", body: JSON.stringify(data), service: "identity" }
    );
    return toLoginResponse(raw);
  },

  resendOtp: async (data: any): Promise<any> => {
    return apiClient<any>(
      "/customers/register/resend-otp",
      { method: "POST", body: JSON.stringify(data), service: "identity" }
    );
  },

  getProfile: async (): Promise<ApiUser> => {
    return apiClient<ApiUser>("/customers/me", { service: "identity" });
  },

  updateProfile: async (data: any): Promise<ApiUser> => {
    return apiClient<ApiUser>("/customers/me", { method: "PUT", body: JSON.stringify(data), service: "identity" });
  },

  changePassword: async (data: any): Promise<any> => {
    return apiClient<any>("/customers/change-password", { method: "POST", body: JSON.stringify(data), service: "identity" });
  },

  forgotPassword: async (email: string): Promise<any> => {
    return apiClient<any>(`/customers/reset-password/${encodeURIComponent(email)}`, { service: "identity" });
  },

  resetPassword: async (data: any): Promise<any> => {
    return apiClient<any>("/customers/reset-password", { method: "POST", body: JSON.stringify(data), service: "identity" });
  },

  uploadProfilePhoto: async (file: File): Promise<ApiUser> => {
    const formData = new FormData();
    formData.append("photo", file);

    const token = localStorage.getItem("auth_token");

    const res = await fetch(`${import.meta.env.VITE_IDENTITY_API_URL || "http://localhost:5001/api/v1"}/customers/me/photo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed with status ${res.status}`);
    }

    const data = await res.json();
    // Assuming backend returns { success: true, data: { ... } } or { code: 200, data: { ... } }
    return data.data || data;
  }
};
