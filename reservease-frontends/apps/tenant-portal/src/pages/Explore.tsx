import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BrowseListingCard } from "@/components/browse/BrowseListingCard";
import { BrowseFilterBar } from "@/components/browse/BrowseFilterBar";
import { SmartMatchBannerInline, SmartMatchBannerMobile } from "@/components/browse/SmartMatchBanner";
import { listingsApi } from "@/api/listings";
import type { BrowseParams } from "@/api/types";

const PAGE_LIMIT = 12;

function paramsFromSearch(sp: URLSearchParams): BrowseParams {
  return {
    location:      sp.get("location")      ?? undefined,
    category:      sp.get("category")      ?? undefined,
    roomType:      sp.get("roomType")      ?? undefined,
    genderPolicy:  sp.get("genderPolicy")  ?? undefined,
    nearestCampus: sp.get("nearestCampus") ?? undefined,
    minPrice: sp.get("minPrice") ? Number(sp.get("minPrice")) : undefined,
    maxPrice: sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined,
  };
}

function paramsToSearch(params: BrowseParams): Record<string, string> {
  const q: Record<string, string> = {};
  if (params.location)      q.location      = params.location;
  if (params.category)      q.category      = params.category;
  if (params.roomType)      q.roomType      = params.roomType;
  if (params.genderPolicy)  q.genderPolicy  = params.genderPolicy;
  if (params.nearestCampus) q.nearestCampus = params.nearestCampus;
  if (params.minPrice)      q.minPrice      = String(params.minPrice);
  if (params.maxPrice)      q.maxPrice      = String(params.maxPrice);
  return q;
}

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = paramsFromSearch(searchParams);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, isError, refetch } =
    useInfiniteQuery({
      queryKey: ["listings", "browse", filters],
      queryFn: ({ pageParam = 1 }) =>
        listingsApi.browse({ ...filters, page: pageParam as number, limit: PAGE_LIMIT }),
      getNextPageParam: (last) =>
        last.pageIndex < last.totalPages ? last.pageIndex + 1 : undefined,
      initialPageParam: 1,
    });

  const listings = data?.pages.flatMap((p) => p.results ?? p.data ?? []) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  const handleFilterChange = (next: BrowseParams) =>
    setSearchParams(paramsToSearch(next), { replace: true });

  return (
    <Layout showFooter={false}>
      <div className="min-h-dvh">
        {/* Sticky filter bar */}
        <div className="border-b border-border bg-background sticky top-16 z-30">
          <div className="container py-4">
            <BrowseFilterBar filters={filters} onChange={handleFilterChange} />
          </div>
        </div>

        <div className="container py-6 pb-40 md:pb-10">
          {/* Result count */}
          {!isLoading && !isError && (
            <p className="text-sm text-muted-foreground mb-5">
              {totalCount > 0
                ? `${totalCount.toLocaleString()} verified listing${totalCount !== 1 ? "s" : ""}`
                : "No listings found — try different filters"}
            </p>
          )}

          {/* States */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: PAGE_LIMIT }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-border/40">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center py-24 text-center gap-4">
              <p className="text-muted-foreground">Something went wrong loading listings.</p>
              <Button variant="outline" onClick={() => refetch()}>Try again</Button>
            </div>
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center py-24 text-center gap-4 max-w-sm mx-auto">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl">🏠</div>
              <h3 className="font-semibold text-lg text-foreground">No listings found</h3>
              <p className="text-muted-foreground text-sm">
                Try a different location, remove some filters, or check back soon — new properties are added daily.
              </p>
              <Button variant="outline" onClick={() => handleFilterChange({})}>Clear filters</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {listings.map((listing, i) => (
                  <BrowseListingCard key={listing.id} listing={listing} index={i} />
                ))}
                {/* Smart Match promo after first 8 cards on desktop */}
                {listings.length >= 8 && <SmartMatchBannerInline />}
              </div>

              {hasNextPage && (
                <div className="flex justify-center mt-10">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="px-10"
                  >
                    {isFetchingNextPage ? "Loading…" : "Load more listings"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile sticky Smart Match banner */}
        {listings.length > 0 && <SmartMatchBannerMobile />}
      </div>
    </Layout>
  );
}
