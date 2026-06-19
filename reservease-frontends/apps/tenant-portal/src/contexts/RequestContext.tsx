import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import { requestsApi } from "../api/requests";
import type {
  ApiAccommodationRequest,
  CreateRequestPayload,
  RefineRequestPayload,
  RequestStatus,
  ApiSearchAttempt,
  ApiAccommodationLocation,
  ApiAccommodationMatch,
  PaginatedResponse
} from "../api/types";

// Re-export types so we don't break existing imports
export type {
  RequestStatus,
  ApiSearchAttempt as SearchAttempt,
  ApiAccommodationLocation as AccommodationLocation,
  ApiAccommodationMatch as AccommodationMatch,
  ApiAccommodationRequest as AccommodationRequest
};

interface RequestContextType {
  currentRequest: Partial<ApiAccommodationRequest> | null;
  requests: ApiAccommodationRequest[];
  isLoading: boolean;

  // Infinite Scroll
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
  totalRequests: number;

  updateCurrentRequest: (data: Partial<ApiAccommodationRequest>) => void;
  submitRequest: (payload: CreateRequestPayload) => Promise<ApiAccommodationRequest>;
  getRequest: (id: string) => ApiAccommodationRequest | undefined;
  clearCurrentRequest: () => void;
  refineSearch: (requestId: string, newPreferences: RefineRequestPayload) => Promise<boolean>;
  assignToAgent: (requestId: string) => Promise<void>;
  completeRequest: (requestId: string) => Promise<void>;
  cancelRequest: (requestId: string) => Promise<void>;
  refreshRequests: () => Promise<void>;
}

const defaultContext: RequestContextType = {
  currentRequest: null,
  requests: [],
  isLoading: false,
  fetchNextPage: () => {},
  hasNextPage: false,
  isFetchingNextPage: false,
  setSearchQuery: () => {},
  searchQuery: "",
  totalRequests: 0,
  updateCurrentRequest: () => {},
  submitRequest: async () => ({} as ApiAccommodationRequest),
  getRequest: () => undefined,
  clearCurrentRequest: () => {},
  refineSearch: async () => false,
  assignToAgent: async () => {},
  completeRequest: async () => {},
  cancelRequest: async () => {},
  refreshRequests: async () => {},
};

const RequestContext = createContext<RequestContextType>(defaultContext);

export function RequestProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Local state for the multi-step request creation form
  const [currentRequest, setCurrentRequest] = useState<Partial<ApiAccommodationRequest> | null>(null);

  // Local state for search
  const [searchQuery, setSearchQuery] = useState("");

  const { isLoggedIn } = useAuth();

  // Fetch the user's active/past requests with Infinite Query
  const {
    data: requestsData,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["requests", searchQuery],
    queryFn: ({ pageParam = 1 }) => requestsApi.list(pageParam as number, 10, searchQuery),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const page = lastPage as PaginatedResponse<ApiAccommodationRequest>;
      // Backend uses pageIndex (1-based) and totalPages
      const pageIndex = page?.pageIndex ?? page?.page;
      const totalPages = page?.totalPages;
      if (typeof pageIndex === 'number' && typeof totalPages === 'number') {
        return pageIndex < totalPages ? pageIndex + 1 : undefined;
      }
      return undefined;
    },
    enabled: isLoggedIn,
  });

  const requests = React.useMemo(() => {
    if (!requestsData) return [];

    return requestsData.pages.flatMap((pageData) => {
      const page = pageData as PaginatedResponse<ApiAccommodationRequest>;
      // Backend returns `results` field (from PagedResult<T>)
      if (Array.isArray(page?.results)) return page.results;
      // Some endpoints may use `data` — check that too
      if (Array.isArray(page?.data)) return page.data;
      // Safety fallback: if it is directly an array
      if (Array.isArray(pageData)) return pageData as ApiAccommodationRequest[];
      return [];
    });
  }, [requestsData]);

  // Compute the true total from the first page metadata (backend returns total in the envelope)
  const totalRequests = React.useMemo(() => {
    if (!requestsData?.pages?.length) return 0;
    const firstPage = requestsData.pages[0] as PaginatedResponse<ApiAccommodationRequest>;
    // Backend returns TotalCount (camelCase: totalCount)
    if (typeof firstPage?.totalCount === 'number') return firstPage.totalCount;
    if (typeof firstPage?.total === 'number') return firstPage.total;
    return requests.length;
  }, [requestsData, requests.length]);

  const updateCurrentRequest = useCallback((data: Partial<ApiAccommodationRequest>) => {
    setCurrentRequest(prev => ({ ...prev, ...data }));
  }, []);

  const clearCurrentRequest = useCallback(() => {
    setCurrentRequest(null);
  }, []);

  const getRequest = useCallback((id: string) => {
    return requests.find(r => r.id === id);
  }, [requests]);

  const refreshRequests = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const { toast } = useToast();
  const previousStatuses = useRef<Record<string, RequestStatus>>({});

  useEffect(() => {
    requests.forEach(req => {
      const prev = previousStatuses.current[req.id];
      if (prev && prev !== req.status) {
        if (req.status === "processing" && prev === "waiting-payment-confirmation") {
          toast({ title: "Payment Successful", description: "Your payment was received. We are searching for your matches!" });
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        } else if (req.status === "matches-found") {
          toast({ title: "Search Completed", description: "We found matches for your request!" });
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        } else if (req.status === "alternatives-suggested") {
          toast({ title: "Search Completed", description: "We couldn't find exact matches, but we suggested alternatives." });
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        } else if (req.status === "assigned-to-agent") {
          toast({ title: "Agent Assigned", description: "Your request has been assigned to an agent." });
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
      }
      previousStatuses.current[req.id] = req.status;
    });
  }, [requests, toast, queryClient]);


  // ─── Mutations ───────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: requestsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });

  const submitRequest = useCallback(async (payload: CreateRequestPayload): Promise<ApiAccommodationRequest> => {
    const result = await createMutation.mutateAsync(payload);
    return result;
  }, [createMutation]);

  const refineMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RefineRequestPayload }) =>
      requestsApi.refine(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      // Since data is wrapped in pages, invalidating is safest unless we want complex cache updates
    },
  });

  const refineSearch = useCallback(async (requestId: string, newPreferences: RefineRequestPayload): Promise<boolean> => {
    try {
      await refineMutation.mutateAsync({ id: requestId, payload: newPreferences });
      return true;
    } catch {
      return false;
    }
  }, [refineMutation]);

  const assignMutation = useMutation({
    mutationFn: requestsApi.assignToAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });

  const assignToAgent = useCallback(async (requestId: string) => {
    await assignMutation.mutateAsync(requestId);
  }, [assignMutation]);

  const completeMutation = useMutation({
    mutationFn: requestsApi.complete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });

  const completeRequest = useCallback(async (requestId: string) => {
    await completeMutation.mutateAsync(requestId);
  }, [completeMutation]);

  const cancelMutation = useMutation({
    mutationFn: requestsApi.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });

  const cancelRequest = useCallback(async (requestId: string) => {
    await cancelMutation.mutateAsync(requestId);
  }, [cancelMutation]);

  return (
    <RequestContext.Provider
      value={{
        currentRequest,
        requests,
        isLoading,
        fetchNextPage: () => fetchNextPage(),
        hasNextPage: !!hasNextPage,
        isFetchingNextPage,
        setSearchQuery,
        searchQuery,
        totalRequests,
        updateCurrentRequest,
        submitRequest,
        getRequest,
        clearCurrentRequest,
        refineSearch,
        assignToAgent,
        completeRequest,
        cancelRequest,
        refreshRequests,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}

export function useRequest() {
  return useContext(RequestContext);
}
