/**
 * API Client Configuration
 */

const API_URLS = {
  identity: import.meta.env.VITE_IDENTITY_API_URL || "http://localhost:5001/api/v1",
  accommodation: import.meta.env.VITE_ACCOMMODATION_API_URL || "http://localhost:5073/api/v1",
};

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
  _skipRefresh?: boolean;
  service?: keyof typeof API_URLS;
}

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

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const { token, refreshToken } = getStoredTokens();
    if (!refreshToken) return null;

    try {
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

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers: customHeaders, _skipRefresh, service = "accommodation", ...rest } = options;

  const baseUrl = API_URLS[service];
  const url = new URL(`${baseUrl}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const { token } = getStoredTokens();
  const isFormData = rest.body instanceof FormData || (rest.body && typeof (rest.body as any).append === 'function');

  const buildHeaders = (tok: string | null): Record<string, string> => ({
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(tok ? { Authorization: `Bearer ${tok}` } : {}),
    ...(customHeaders as Record<string, string> || {}),
  });

  let response = await fetch(url.toString(), {
    ...rest,
    headers: buildHeaders(token),
  });

  if (response.status === 401 && !_skipRefresh) {
    const newToken = await refreshAccessToken();
    if (newToken) {
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

  if (response.status === 204) return undefined as any;

  const responseData = await response.json();

  if (
    responseData &&
    typeof responseData === "object" &&
    (("success" in responseData && "data" in responseData) ||
     ("code" in responseData && "data" in responseData))
  ) {
    if ("success" in responseData && !responseData.success) {
      throw new ApiError(400, responseData.message || "Request failed", responseData);
    }
    return responseData.data as T;
  }

  return responseData as T;
}

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}
