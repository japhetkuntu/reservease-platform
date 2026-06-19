/**
 * Notifications API Service
 *
 * ┌────────────────────────────────────────────────────────────────────┐
 * │ Endpoint               │ Method │ Path                            │
 * ├────────────────────────┼────────┼─────────────────────────────────┤
 * │ List Notifications     │ GET    │ /notifications                  │
 * │ Mark as Read           │ PUT    │ /notifications/:id/read         │
 * │ Mark All as Read       │ PUT    │ /notifications/read-all         │
 * │ Get Unread Count       │ GET    │ /notifications/unread-count     │
 * └────────────────────────┴────────┴─────────────────────────────────┘
 */

import { apiClient, USE_MOCK } from "./client";
import type { ApiNotification, PaginatedResponse } from "./types";

// ─── Public API ──────────────────────────────────────────────

export const notificationsApi = {
  list: async (page = 1, pageSize = 20): Promise<PaginatedResponse<ApiNotification>> => {
    const response = await apiClient<any>("/notifications", {
      params: { page: String(page), pageSize: String(pageSize) },
      service: "tenant",
    });

    // Map backend 'results' to frontend 'data'
    return {
      ...response,
      data: response.results || response.data || []
    };
  },

  markAsRead: async (id: string): Promise<void> => {
    return apiClient<void>(`/notifications/${id}/read`, { method: "PUT", service: "tenant" });
  },

  markAllAsRead: async (): Promise<void> => {
    return apiClient<void>("/notifications/read-all", { method: "PUT", service: "tenant" });
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const count = await apiClient<number>("/notifications/unread-count", { service: "tenant" });
    return { count };
  },
};
