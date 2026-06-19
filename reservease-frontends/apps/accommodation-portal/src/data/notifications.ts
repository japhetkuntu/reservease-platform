export type NotificationType =
  | "request"      // new tenant request
  | "approved"     // listing approved
  | "review"       // account under review
  | "message"      // message from tenant
  | "warning"      // account warning
  | "system";      // system info

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;   // ISO string
  read: boolean;
  actionUrl?: string;
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "request",
    title: "New Tenant Request",
    body: "Abena Asante has submitted a viewing request for Evandy Hostel (Block A).",
    time: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
    actionUrl: "/dashboard",
  },
  {
    id: "n2",
    type: "request",
    title: "New Tenant Request",
    body: "Kwame Boateng is interested in your Nhyiaeso Apartment.",
    time: new Date(Date.now() - 1000 * 60 * 53).toISOString(),
    read: false,
    actionUrl: "/dashboard",
  },
  {
    id: "n3",
    type: "approved",
    title: "Listing Approved 🎉",
    body: "Evandy Hostel (Block A) has been reviewed and approved by our admin team. It is now live!",
    time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
    actionUrl: "/dashboard",
  },
  {
    id: "n4",
    type: "review",
    title: "Account Under Review",
    body: "Your profile and ID documents have been sent to our verification team. You'll hear from us within 24–48 hours.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    read: true,
  },
  {
    id: "n5",
    type: "message",
    title: "Message from Ama Serwaa",
    body: "\"Hi! Is the studio still available? I'd like to visit this weekend.\"",
    time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
    actionUrl: "/dashboard",
  },
  {
    id: "n6",
    type: "system",
    title: "Welcome to ReservEase Owners",
    body: "Your account has been created. Complete your profile to activate your listings and start receiving tenant requests.",
    time: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true,
    actionUrl: "/profile",
  },
];
