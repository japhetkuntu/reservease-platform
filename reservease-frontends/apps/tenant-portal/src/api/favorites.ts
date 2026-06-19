/**
 * Favorites API Service
 *
 * ┌────────────────────────────────────────────────────────────────┐
 * │ Endpoint             │ Method │ Path                          │
 * ├──────────────────────┼────────┼───────────────────────────────┤
 * │ List Favorites       │ GET    │ /favorites                    │
 * │ Add Favorite         │ POST   │ /favorites                    │
 * │ Remove Favorite      │ DELETE │ /favorites/:id                │
 * └──────────────────────┴────────┴───────────────────────────────┘
 */

import { apiClient, USE_MOCK } from "./client";
import type { ApiFavorite, AddFavoriteRequest, PaginatedResponse } from "./types";

// ─── Public API ──────────────────────────────────────────────

export const favoritesApi = {
  list: async (): Promise<PaginatedResponse<ApiFavorite>> => {
    return apiClient<PaginatedResponse<ApiFavorite>>("/favorites", {
      service: "tenant",
    });
  },

  add: async (data: AddFavoriteRequest): Promise<ApiFavorite> => {
    return apiClient<ApiFavorite>("/favorites", {
      method: "POST",
      body: JSON.stringify(data),
      service: "tenant",
    });
  },

  remove: async (id: string): Promise<void> => {
    return apiClient<void>(`/favorites/${id}`, { method: "DELETE", service: "tenant" });
  },
};
