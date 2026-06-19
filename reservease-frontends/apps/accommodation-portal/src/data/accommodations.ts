import { apiClient } from "../api/client";

export type AccommodationImage = string | File;

export interface PagedResult<T> {
  results: T[];
  pageIndex: number;
  pageSize: number;
  count: number;
  totalCount: number;
  totalPages: number;
  lowerBoundSize?: number;
  upperBoundSize?: number;
}

export interface AccommodationOverview {
  totalProperties: number;
  totalRequests: number;
  liveProperties: number;
  hiddenProperties: number;
  verifiedProperties: number;
}

export interface Accommodation {
  id?: string;
  ownerId?: string;
  name: string;
  category: string;
  location: string;
  price: string;
  numericPrice?: number;
  priceUnit: string;
  genderPolicy: string;
  amenities: string[];
  roomType: string;
  images: AccommodationImage[];
  available?: boolean;
  backupPower: string;
  waterReliability: string;
  utilityMetering: string;
  advanceMonths: string;
  securityDeposit: string;
  isInclusive: boolean;
  isVerified?: boolean;
  isApproved?: boolean;
  securityFeatures: string[];
  roadAccess: string;
  bathroomType: string;
  rules: string[];
  transportAccess: string[];
  compoundType: string;
  internetType: string;
  momoAccepted: boolean;
  negotiableRent: boolean;
  cookingAllowed: boolean;
  childrenAllowed: boolean;
  campusProximity: string;
  nearestCampus: string;
  breakfastIncluded: boolean;
  airConditioning: boolean;
  parkingAvailable: boolean;
  furnishedStatus: string;
  googleMapsUrl: string;
  youTubeVideoUrl?: string;
  createdAt: string;
  updatedAt?: string;
  totalRequests?: number;
}

export const DEFAULT_FORM: Omit<Accommodation, 'id' | 'ownerId' | 'isApproved' | 'isVerified' | 'requests' | 'createdAt' | 'updatedAt' | 'available'> = {
  name: '',
  category: 'hostel',
  location: '',
  price: '',
  numericPrice: 0,
  priceUnit: 'month',
  genderPolicy: 'mixed',
  amenities: [],
  roomType: '',
  images: [],
  backupPower: 'None',
  waterReliability: 'Regular',
  utilityMetering: 'Shared',
  advanceMonths: '12',
  securityDeposit: '',
  isInclusive: false,
  securityFeatures: [],
  roadAccess: 'Tarred',
  bathroomType: 'Self-contained',
  rules: [],
  transportAccess: [],
  compoundType: 'compound-shared',
  internetType: 'basic-wifi',
  momoAccepted: true,
  negotiableRent: false,
  cookingAllowed: true,
  childrenAllowed: true,
  campusProximity: 'trotro',
  nearestCampus: '',
  breakfastIncluded: false,
  airConditioning: false,
  parkingAvailable: false,
  furnishedStatus: 'unfurnished',
  googleMapsUrl: '',
  youTubeVideoUrl: '',
};

export const getPricePeriodOptions = (category: string) => {
  const common = [
    { value: 'month', label: 'Per Month' },
    { value: 'year', label: 'Per Year' },
  ];

  if (category === 'hostel' || category === 'hall') {
    return [
      { value: 'semester', label: 'Per Semester' },
      { value: 'academic-year', label: 'Per Academic Year' },
      ...common
    ];
  }

  if (category === 'guest-house' || category === 'hotel') {
    return [
      { value: 'night', label: 'Per Night' },
      ...common
    ];
  }

  return common;
};

/**
 * Ensures an image URL is valid and points to the correct storage host.
 * This handles cases where the backend might return a port that changed.
 */
export const formatImageUrl = (url: string): string => {
 if (!url) return '';
  if (url.startsWith('blob:') || url.startsWith('data:')) return url;

  // If it's a relative path, we might need a base URL (though usually it's absolute from S3/MinIO)
  // If it contains localhost:9900 (old MinIO port), update it to 9000
  if (url.includes('localhost:9900')) {
    return url.replace('localhost:9900', 'localhost:9000');
  }

  return url;
};

// ── API Functions ─────────────────────────────────────────────────────────────

export async function getMyAccommodations(pageIndex = 1, pageSize = 10, status = 'all'): Promise<PagedResult<Accommodation>> {
  const queryParams = new URLSearchParams({
    page: String(pageIndex),
    pageSize: String(pageSize),
    status: status
  });
  const data = await apiClient<PagedResult<Accommodation>>(`/accommodation/me?${queryParams.toString()}`, {
    service: "accommodation"
  });
  return {
    ...data,
    results: (data.results || []).map(acc => ({
      ...acc,
      amenities: acc.amenities || [],
      rules: acc.rules || [],
      securityFeatures: acc.securityFeatures || [],
      transportAccess: acc.transportAccess || [],
      images: acc.images || [],
    }))
  };
}

/**
 * Fetch the owner's accommodation overview statistics.
 */
export async function getAccommodationOverview(): Promise<AccommodationOverview> {
  return apiClient<AccommodationOverview>("/accommodation/me/overview", {
    service: "accommodation"
  });
}

/**
 * Get details for a single accommodation.
 */
export async function getAccommodationById(id: string): Promise<Accommodation> {
  const data = await apiClient<Accommodation>(`/accommodation/${id}`, {
    method: "GET",
    service: "accommodation"
  });
  return {
    ...data,
    amenities: data.amenities || [],
    rules: data.rules || [],
    securityFeatures: data.securityFeatures || [],
    transportAccess: data.transportAccess || [],
    images: data.images || [],
  };
}

/**
 * Add a new accommodation.
 */
export async function addAccommodation(data: Partial<Accommodation>): Promise<Accommodation> {
  const formData = new FormData();

  // Convert object to FormData
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === 'images') {
      const images = value as (string | File)[];
      images.forEach(img => {
        if (img instanceof File) {
          formData.append('Images', img);
        }
      });
    } else if (Array.isArray(value)) {
      value.forEach(item => {
        formData.append(key, String(item));
      });
    } else {
      formData.append(key, String(value));
    }
  });

  const res = await apiClient<Accommodation>("/accommodation", {
    method: "POST",
    body: formData,
    service: "accommodation"
  });
  return {
    ...res,
    amenities: res.amenities || [],
    rules: res.rules || [],
    securityFeatures: res.securityFeatures || [],
    transportAccess: res.transportAccess || [],
    images: res.images || [],
  };
}

/**
 * Update an existing accommodation.
 */
export async function updateAccommodation(id: string, data: Partial<Accommodation>): Promise<Accommodation> {
  const formData = new FormData();

  // Convert object to FormData
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null || key === 'id' || key === 'ownerId') return;

    if (key === 'images') {
      const images = value as (string | File)[];
      images.forEach(img => {
        if (img instanceof File) {
          formData.append('Images', img);
        } else if (typeof img === 'string') {
          formData.append('ExistingImages', img);
        }
      });
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        formData.append(key, "");
      } else {
        value.forEach(item => {
          formData.append(key, String(item));
        });
      }
    } else {
      formData.append(key, String(value));
    }
  });

  const res = await apiClient<Accommodation>(`/accommodation/${id}`, {
    method: "PUT",
    body: formData,
    service: "accommodation"
  });
  return {
    ...res,
    amenities: res.amenities || [],
    rules: res.rules || [],
    securityFeatures: res.securityFeatures || [],
    transportAccess: res.transportAccess || [],
    images: res.images || [],
  };
}

/**
 * Delete an accommodation.
 */
export async function deleteAccommodation(id: string): Promise<void> {
  return apiClient<void>(`/accommodation/${id}`, {
    method: "DELETE",
    service: "accommodation"
  });
}

export async function toggleAccommodationStatus(id: string, isOnline: boolean): Promise<void> {
  return apiClient<void>(`/accommodation/${id}/status?isOnline=${isOnline}`, {
    method: "PATCH",
    service: "accommodation"
  });
}
