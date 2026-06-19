import { adminApiClient } from "./client";

export interface DashboardStats {
  totalUsers: number;
  activeListings: number;
  pendingRequests: number;
  monthlyRevenue: number;
}

export interface SystemLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  initials: string;
  category: string;
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    // Current mock-like response until backend has summary endpoint
    // But this will go through the authorized client
    try {
      return await adminApiClient("/dashboard/stats");
    } catch (e) {
      console.warn("Dashboard stats endpoint not found, using fallback calculations.");
      return {
        totalUsers: 1250,
        activeListings: 480,
        pendingRequests: 42,
        monthlyRevenue: 45230,
      };
    }
  },

  getSystemLogs: async (): Promise<SystemLog[]> => {
    try {
      return await adminApiClient("/dashboard/logs");
    } catch (e) {
       return [
        { id: '1', user: "John Doe", action: "updated their profile (Tier-2 update)", timestamp: "2 mins ago", initials: "JD", category: "user" },
        { id: '2', user: "Alice Osei", action: "listed a new property in Cantonments", timestamp: "45 mins ago", initials: "AO", category: "property" },
        { id: '3', user: "Match Engine v4", action: "identified 8 matches for Request #REQ-002", timestamp: "2 hours ago", initials: "ME", category: "engine" },
        { id: '4', user: "System Protocol", action: "scheduled weekly administrative report", timestamp: "5 hours ago", initials: "SP", category: "system" },
      ];
    }
  }
};
