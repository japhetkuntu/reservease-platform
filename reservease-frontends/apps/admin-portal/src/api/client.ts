const ADMIN_API_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5073/api/v1';
const IDENTITY_API_URL = import.meta.env.VITE_IDENTITY_API_URL || 'http://localhost:5001/api/v1';

export interface ApiResponse<T> {
  message: string;
  code: number;
  data: T | null;
  subCode?: string;
  errors?: any[];
}

export async function adminApiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const targetApi = (options.headers as any)?.["X-Target-API"];
  const baseUrl = targetApi === "identity" ? IDENTITY_API_URL : ADMIN_API_URL;
  const url = `${baseUrl}${endpoint}`;

  const headers = new Headers(options.headers);
  headers.delete("X-Target-API"); // Remove internal routing header

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = localStorage.getItem('reservease_admin_token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  const result: ApiResponse<T> = await response.json();

  if (result.code >= 400) {
    throw new Error(result.message || 'API error');
  }

  return result.data as T;
}
