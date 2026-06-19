/**
 * API Client Configuration
 *
 * Change BASE_URL to your .NET backend when ready.
 */

const API_URLS = {
  identity: import.meta.env.VITE_IDENTITY_API_URL || "/api/v1",
  tenant: import.meta.env.VITE_TENANT_API_URL || "/api/v1",
};


interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
  /** Internal: skip the 401 retry to avoid infinite loops during refresh calls */
  _skipRefresh?: boolean;
  /** Choose which microservice this request should hit. Default: "identity" */
  service?: keyof typeof API_URLS;
}

// ─── Token Storage Helpers ────────────────────────────────────

const STORAGE_KEY = "reservease_user";

export function getStoredTokens(): { token: string | null; refreshToken: string | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, refreshToken: null };
    const parsed = JSON.parse(raw);
    return {
      token: parsed.token ?? null,
      refreshToken: parsed.refreshToken ?? null,
    };
  } catch {
    return { token: null, refreshToken: null };
  }
}

export function patchStoredTokens(token: string, refreshToken: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, token, refreshToken }));
  } catch {
    // noop
  }
}

export function clearStoredTokens() {
  localStorage.removeItem(STORAGE_KEY);
}

// ─── Refresh Mutex ────────────────────────────────────────────
// Prevents multiple concurrent 401s from each triggering a separate refresh.

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const { token, refreshToken } = getStoredTokens();
    if (!refreshToken) {
      console.log("[Refresh] No refresh token found in storage.");
      return null;
    }

    try {
      console.log("[Refresh] Attempting to refresh token...");
      const resp = await fetch(`${API_URLS.identity}/customers/refreshtoken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ RefreshToken: refreshToken }),
      });

      if (!resp.ok) {
        clearStoredTokens();
        // Force re-login by reloading — the AuthContext will detect no stored user
        window.location.href = "/login";
        return null;
      }

      const data = await resp.json();
      const newToken: string = data?.data?.accessToken ?? data?.accessToken ?? data?.data?.token ?? data?.token;
      const newRefreshToken: string = data?.data?.refreshToken ?? data?.refreshToken;
      if (newToken) patchStoredTokens(newToken, newRefreshToken ?? refreshToken);
      return newToken ?? null;
    } catch {
      clearStoredTokens();
      window.location.href = "/login";
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ─── API Client ───────────────────────────────────────────────

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers: customHeaders, _skipRefresh, service = "identity", ...rest } = options;

  const baseUrl = API_URLS[service];
  const url = new URL(`${baseUrl}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const { token } = getStoredTokens();

  const isFormData = rest.body instanceof FormData;

  const buildHeaders = (tok: string | null): Record<string, string> => ({
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(tok ? { Authorization: `Bearer ${tok}` } : {}),
    ...(service === "tenant" ? { "X-Tenant-Portal-Key": import.meta.env.VITE_TENANT_PORTAL_KEY || "dev-secret-key" } : {}),
    ...(customHeaders as Record<string, string> || {}),
  });

  let response = await fetch(url.toString(), {
    ...rest,
    headers: buildHeaders(token),
  });

  // ── 401 Interceptor ──────────────────────────────────────────
  if (response.status === 401 && !_skipRefresh) {
    console.log("[ApiClient] 401 caught, triggering refreshAccessToken...");
    const newToken = await refreshAccessToken();
    console.log("[ApiClient] refreshAccessToken returned:", newToken ? "Success" : "Failed");
    if (newToken) {
      // Retry the original request with the new token
      response = await fetch(url.toString(), {
        ...rest,
        headers: buildHeaders(newToken),
      });
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorBody.message || response.statusText, errorBody);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const responseData = await response.json();

  // Automatically unwrap standard backend ApiResponse wrapper if present
  if (
    responseData &&
    typeof responseData === "object" &&
    "code" in responseData &&
    "data" in responseData
  ) {
    return responseData.data as T;
  }

  return responseData as T;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}
