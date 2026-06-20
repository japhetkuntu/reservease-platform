import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BrowseListingCard } from "@/components/browse/BrowseListingCard";
import { listingsApi } from "@/api/listings";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "hostel", label: "Hostels" },
  { value: "apartment", label: "Apartments" },
  { value: "hotel-room", label: "Hotels" },
  { value: "self-contain", label: "Self-Contain" },
  { value: "guest-house", label: "Guest Houses" },
];

export function ListingsBrowseSection() {
  const [category, setCategory] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["listings", "home", category],
    queryFn: () => listingsApi.browse({ category: category || undefined, limit: 8 }),
    staleTime: 1000 * 60 * 5,
  });

  const listings = data?.results ?? data?.data ?? [];

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container">
        {/* Header */}
        <div className="flex items-end justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Verified listings
            </h2>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Browse available properties — no account needed.
            </p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex items-center gap-1 text-primary shrink-0">
            <Link to="/explore">
              See all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={[
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-150 shrink-0",
                category === cat.value
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
              ].join(" ")}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
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
        ) : isError || listings.length === 0 ? (
          <div className="rounded-2xl border border-border/40 py-16 text-center text-muted-foreground">
            {isError ? "Could not load listings right now." : "No listings available yet — check back soon."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {listings.map((listing, i) => (
              <BrowseListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        )}

        {/* Mobile see all */}
        <div className="flex justify-center mt-8 sm:hidden">
          <Button asChild variant="outline" size="lg" className="px-8">
            <Link to="/explore">See all listings</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
