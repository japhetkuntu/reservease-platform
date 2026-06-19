import { adminApiClient } from "./client";

export interface AdminProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export const authApi = {
  login: async (credentials: any): Promise<LoginResponse> => {
    // Identity API URL is handled by adminApiClient using VITE_IDENTITY_API_URL
    return adminApiClient("/admins/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "X-Target-API": "identity", // Special header for our client to route to Identity API
      },
    });
  },

  getProfile: async (): Promise<AdminProfile> => {
    return adminApiClient("/admins/me", {
      headers: {
        "X-Target-API": "identity",
      },
    });
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    return adminApiClient("/admins/refreshtoken", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
      headers: {
        "X-Target-API": "identity",
      },
    });
  },
};
