import { adminApiClient } from "./client";

export const requestsApi = {
  listRequests: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return adminApiClient(`/requests${query ? `?${query}` : ""}`);
  },

  deployLiaison: (id: string) => {
    return adminApiClient(`/requests/${id}/deploy-liaison`, {
      method: "POST",
    });
  },

  broadcastMatches: (id: string, matchIds: string[]) => {
    return adminApiClient(`/requests/${id}/broadcast-matches`, {
      method: "POST",
      body: JSON.stringify(matchIds),
    });
  },

  fulfillProtocol: (id: string) => {
    return adminApiClient(`/requests/${id}/fulfill-protocol`, {
      method: "POST",
    });
  },
};
