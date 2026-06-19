import { apiClient } from "./client";
import type { Notification } from "@/data/notifications";

export async function getNotifications(portal: 'owner' | 'tenant' = 'owner'): Promise<Notification[]> {
  const resp = await apiClient<any>("/notifications", {
    service: "accommodation",
    params: { portal }
  });

  const results = resp?.results || [];
  return results.map((n: any) => ({
    id: n.id,
    type: n.type || 'system',
    title: n.title,
    body: n.message || '', // Backend "Message" -> Frontend "body"
    time: n.createdAt,    // Backend "CreatedAt" -> Frontend "time"
    read: n.isRead,       // Backend "IsRead" -> Frontend "read"
    actionUrl: n.requestId ? `/dashboard` : undefined
  }));
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiClient(`/notifications/${id}/read`, {
    method: "PUT", // Corrected from POST to PUT to match backend
    service: "accommodation"
  });
}

export async function markAllNotificationsRead(portal: 'owner' | 'tenant' = 'owner'): Promise<void> {
  await apiClient(`/notifications/read-all`, {
    method: "PUT", // Corrected from POST to PUT to match backend
    service: "accommodation",
    params: { portal }
  });
}
