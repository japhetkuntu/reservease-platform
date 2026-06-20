/**
 * API Index — Re-exports all services for convenient imports.
 *
 * Usage:
 *   import { authApi, requestsApi, paymentsApi } from "@/api";
 *
 * Configuration:
 *   - Set VITE_API_BASE_URL in .env to your .NET backend URL
 */

export { authApi } from "./auth";
export { requestsApi } from "./requests";
export { paymentsApi } from "./payments";
export { favoritesApi } from "./favorites";
export { listingsApi } from "./listings";
export { notificationsApi } from "./notifications";


export type * from "./types";
