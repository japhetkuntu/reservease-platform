/**
 * Requests API Service
 *
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ Endpoint             │ Method │ Path                            │
 * ├──────────────────────┼────────┼─────────────────────────────────┤
 * │ Create Request       │ POST   │ /requests                       │
 * │ List My Requests     │ GET    │ /requests                       │
 * │ Get Request Detail   │ GET    │ /requests/:id                   │
 * │ Refine Request       │ PUT    │ /requests/:id/refine            │
 * │ Assign to Agent      │ POST   │ /requests/:id/assign-agent      │
 * │ Cancel Request       │ POST   │ /requests/:id/cancel            │
 * │ Complete Request     │ POST   │ /requests/:id/complete          │
 * └──────────────────────┴────────┴─────────────────────────────────┘
 */

import { apiClient } from "./client";
import type {
  CreateRequestPayload,
  RefineRequestPayload,
  ApiAccommodationRequest,
  PaginatedResponse,
} from "./types";

// ─── Public API ──────────────────────────────────────────────

export const requestsApi = {
  create: (data: CreateRequestPayload): Promise<ApiAccommodationRequest> => {
    return apiClient<ApiAccommodationRequest>("/requests", {
      method: "POST",
      body: JSON.stringify(data),
      service: "tenant",
    });
  },

  list: (page = 1, pageSize = 20, searchQuery?: string): Promise<PaginatedResponse<ApiAccommodationRequest>> => {
    const params: Record<string, string> = { page: String(page), pageSize: String(pageSize) };
    if (searchQuery) params.Search = searchQuery;

    return apiClient<PaginatedResponse<ApiAccommodationRequest>>("/requests", {
      params,
      service: "tenant",
    });
  },

  getById: (id: string): Promise<ApiAccommodationRequest> => {
    return apiClient<ApiAccommodationRequest>(`/requests/${id}`, { service: "tenant" });
  },

  refine: (id: string, data: RefineRequestPayload): Promise<ApiAccommodationRequest> => {
    return apiClient<ApiAccommodationRequest>(`/requests/${id}/refine`, {
      method: "PUT",
      body: JSON.stringify(data),
      service: "tenant",
    });
  },

  assignToAgent: (id: string): Promise<ApiAccommodationRequest> => {
    return apiClient<ApiAccommodationRequest>(`/requests/${id}/assign-agent`, {
      method: "POST",
      service: "tenant",
    });
  },

  cancel: (id: string): Promise<void> => {
    return apiClient<void>(`/requests/${id}/cancel`, { method: "POST", service: "tenant" });
  },

  complete: (id: string): Promise<ApiAccommodationRequest> => {
    return apiClient<ApiAccommodationRequest>(`/requests/${id}/complete`, {
      method: "POST",
      service: "tenant",
    });
  },
};
