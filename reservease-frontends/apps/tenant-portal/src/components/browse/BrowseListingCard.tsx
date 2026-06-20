import { useState } from "react";
import { Heart, MapPin, ShieldCheck, Zap, Droplets } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSavedListings } from "@/hooks/useSavedListings";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { ApiListing } from "@/api/types";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%2394a3b8' font-size='14' font-family='system-ui'%3ENo image%3C/text%3E%3C/svg%3E";

const SAVE_NUDGE_KEY = "re:save_nudge_shown";

interface BrowseListingCardProps {
  listing: ApiListing;
  index?: number;
}

export function BrowseListingCard({ listing, index = 0 }: BrowseListingCardProps) {
  const { isSaved, toggle } = useSavedListings();
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const [imgIndex, setImgIndex] = useState(0);
  const saved = isSaved(listing.id);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggle(listing.id);
    // Nudge guests to sign in — shown only once per session
    if (!isLoggedIn && !sessionStorage.getItem(SAVE_NUDGE_KEY)) {
      sessionStorage.setItem(SAVE_NUDGE_KEY, "1");
      toast({
        title: "Saved locally",
        description: "Sign in to sync your saves across devices.",
      });
    }
  };

  const images = listing.images?.length ? listing.images : [FALLBACK_IMAGE];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="group relative flex flex-col bg-card border border-border/40 rounded-2xl overflow-hidden hover:border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={images[imgIndex]}
          alt={listing.alias}
          loading="lazy"
          decoding="async"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Image dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {images.slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setImgIndex(i); }}
                aria-label={`Photo ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200",
                  i === imgIndex ? "w-4 bg-white" : "w-1.5 bg-white/60 hover:bg-white/90"
                )}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {listing.isVerified && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-background/90 text-[10px] font-semibold text-foreground">
              <ShieldCheck className="h-3 w-3 text-emerald-500" /> Verified
            </span>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          aria-label={saved ? `Remove ${listing.alias} from saved` : `Save ${listing.alias}`}
          aria-pressed={saved}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background hover:scale-110 active:scale-90 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              saved ? "fill-rose-500 text-rose-500" : "text-foreground/70"
            )}
          />
        </button>

        {/* Price chip */}
        <div className="absolute bottom-3 right-3 bg-background/90 px-2.5 py-1 rounded-lg text-sm font-bold text-foreground">
          {listing.price}
          {listing.priceUnit && (
            <span className="text-[10px] font-normal text-muted-foreground ml-0.5">/{listing.priceUnit}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-base text-foreground line-clamp-1 leading-tight">
          {listing.alias}
        </h3>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="text-xs line-clamp-1">{listing.location}</span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <span className="text-xs font-medium text-foreground/70 bg-muted/60 px-2.5 py-1 rounded-full">
            {listing.roomType}
          </span>
          <div className="flex gap-1.5">
            {listing.backupPower && listing.backupPower !== "None" && (
              <span title={`Backup power: ${listing.backupPower}`}>
                <Zap className="h-3.5 w-3.5 text-amber-500" />
              </span>
            )}
            {listing.waterReliability && listing.waterReliability !== "Regular" && (
              <span title={`Water: ${listing.waterReliability}`}>
                <Droplets className="h-3.5 w-3.5 text-blue-400" />
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
