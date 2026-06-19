import { adminApiClient } from "./client";

export const propertiesApi = {
  listProperties: (params?: any) => {
    const query = new URLSearchParams(params).toString();
    return adminApiClient(`/properties${query ? `?${query}` : ""}`);
  },

  getProperty: (id: string) => {
    return adminApiClient(`/properties/${id}`);
  },

  updateProperty: (id: string, data: any) => {
    return adminApiClient(`/properties/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  approveProperty: (id: string) => {
    return adminApiClient(`/properties/${id}/approve`, {
      method: "POST",
    });
  },

  verifyProperty: (id: string) => {
    return adminApiClient(`/properties/${id}/verify`, {
      method: "POST",
    });
  },

  deleteProperty: (id: string) => {
    return adminApiClient(`/properties/${id}`, {
      method: "DELETE",
    });
  },
};
