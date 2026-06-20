import { apiClient } from "./client";
import type { ApiListing, BrowseParams, PaginatedResponse } from "./types";

export const listingsApi = {
  browse: (params: BrowseParams = {}): Promise<PaginatedResponse<ApiListing>> => {
    const q: Record<string, string> = {};
    if (params.location)     q.location     = params.location;
    if (params.minPrice)     q.minPrice     = String(params.minPrice);
    if (params.maxPrice)     q.maxPrice     = String(params.maxPrice);
    if (params.roomType)     q.roomType     = params.roomType;
    if (params.category)     q.category     = params.category;
    if (params.genderPolicy) q.genderPolicy = params.genderPolicy;
    if (params.nearestCampus) q.nearestCampus = params.nearestCampus;
    q.page  = String(params.page  ?? 1);
    q.limit = String(params.limit ?? 12);
    return apiClient<PaginatedResponse<ApiListing>>("/listings/browse", { params: q , service: "tenant"});
  },
};
