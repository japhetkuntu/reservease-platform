import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Play,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Home,
  Users,
  Wallet,
  Heart,
  Info,
  CheckCircle2,
  Zap,
  Droplet,
  ShieldCheck,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccommodationMatch } from "@/contexts/RequestContext";
import { AvailabilityDisclaimer } from "./AvailabilityDisclaimer";
import { MatchScoreCompact } from "@/components/features/MatchScoreBadge";
import { useSavedListings } from "@/hooks/useSavedListings";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AccommodationCardProps {
  match: AccommodationMatch;
  index: number;
  onSave?: (id: string) => void;
}

export function AccommodationCard({ match, index, onSave }: AccommodationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const { isSaved, toggle: toggleSaved } = useSavedListings();
  const saved = isSaved(match.id);

  const handleSave = () => {
    void toggleSaved(match.id);
    onSave?.(match.id);
  };

  const getGoogleMapsUrl = () => {
    if (match.location?.googleMapsUrl) return match.location.googleMapsUrl;
    if (match.googleMapsUrl) return match.googleMapsUrl;

    // Fallback: Generate a search URL based on address and landmark
    const query = encodeURIComponent(`${match.location?.address || ""} ${match.location?.landmark || ""}`.trim());
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const googleMapsUrl = getGoogleMapsUrl();

  const getYouTubeId = (url: string | undefined) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoUrl = match.videoUrl ?? match.youtubeUrl ?? "";
  const youtubeId = getYouTubeId(videoUrl);

  const genderLabel = {
    "male-only": "Male Only",
    "female-only": "Female Only",
    "mixed": "Mixed Gender"
  }[match.genderPolicy];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % match.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + match.images.length) % match.images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      {/* Image Carousel */}
      <div className="relative h-48 bg-muted group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={match.images[currentImageIndex]}
            alt={`${match.alias} - ${currentImageIndex + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>

        {/* Carousel Controls */}
        {match.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {match.images.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentImageIndex ? 'w-4 bg-primary' : 'w-1.5 bg-background/60 hover:bg-background'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {match.hasVideo && (
          <button
            onClick={(e) => { e.stopPropagation(); setShowVideo(true); }}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:scale-105 transition-all"
          >
            <Play className="h-3.5 w-3.5 fill-current" /> Watch Video
          </button>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {match.isAlternative && (
            <span className="px-3 py-1.5 rounded-full bg-warning text-warning-foreground text-xs font-semibold">
              Alternative
            </span>
          )}
          {match.isVerified && (
            <span className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Verified
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          <span className="px-2 py-1 rounded-lg bg-background/90 text-xs font-mono">
            #{index + 1}
          </span>
          {match.matchScore != null && (
            <MatchScoreCompact score={match.matchScore} className="shadow-sm" />
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={(e) => { e.stopPropagation(); handleSave(); }}
          className="absolute bottom-3 left-3 p-2 rounded-full bg-background/90 hover:bg-background transition-colors"
        >
          <Heart className={`h-4 w-4 ${saved ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
        </button>
      </div>

      {/* Basic Details */}
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-foreground">{match.alias}</h3>
            <p className="text-primary font-bold text-lg">
              {match.price}
              {match.priceNote && (
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  {match.priceNote}
                </span>
              )}
            </p>
            {match.advanceMonths > 0 && (
              <p className="text-[10px] font-black uppercase text-primary tracking-tighter mt-0.5">
                {match.advanceMonths} Months Advance Required
              </p>
            )}
            {match.advanceMonths === 0 && match.price.includes("night") === false && (
              <p className="text-[10px] font-black uppercase text-emerald-500 tracking-tighter mt-0.5">
                Monthly / No Advance
              </p>
            )}
          </div>
          <span className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
            <MapPin className="h-4 w-4" /> {match.distance}
          </span>
        </div>

        {/* Quick Info Pills */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            <Home className="h-3.5 w-3.5" />
            {match.roomType}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {genderLabel}
          </span>
          {match.backupPower && match.backupPower !== "None" && match.backupPower !== "any" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
              <Zap className="h-3.5 w-3.5" />
              {match.backupPower}
            </span>
          )}
          {match.waterReliability && match.waterReliability !== "Regular" && match.waterReliability !== "any" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">
              <Droplet className="h-3.5 w-3.5" />
              {match.waterReliability} Water
            </span>
          )}
          {match.utilityMetering && match.utilityMetering !== "Shared" && match.utilityMetering !== "any" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500">
              <Zap className="h-3.5 w-3.5" />
              {match.utilityMetering} Meter
            </span>
          )}
          {match.roadAccess && match.roadAccess !== "Dirt" && match.roadAccess !== "any" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
              <MapPin className="h-3.5 w-3.5" />
              {match.roadAccess} Road
            </span>
          )}
          {match.isInclusive && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500">
              <Wallet className="h-3.5 w-3.5" />
              Bills Inclusive
            </span>
          )}
        </div>

        {/* Why this matches your preferences */}
        {match.matchReasons && match.matchReasons.length > 0 && (
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <p className="text-xs font-semibold text-primary">Why this matches your preferences</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {match.matchReasons.map((reason, i) => {
                const colors = {
                  positive: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
                  warning: "text-amber-500 bg-amber-500/10 border-amber-500/20",
                  neutral: "text-primary/70 bg-primary/5 border-primary/10"
                }[reason.type || "neutral"];

                return (
                  <div key={i} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border ${colors} transition-colors`}>
                    {reason.type === "positive" ? (
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    ) : reason.type === "warning" ? (
                      <Info className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <Check className="h-3.5 w-3.5 flex-shrink-0" />
                    )}
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-medium opacity-60 leading-none mb-0.5">{reason.label}</span>
                      <span className="text-sm leading-tight">{reason.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {/* Expandable Section */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Contact & Location Details
            </>
          )}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden"
            >
              {/* Payment Information */}
              <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  Payment & Booking Information
                </div>
                <p className="text-sm text-muted-foreground">
                  {match.paymentInfo || "Pay directly to the owner's bank account after inspection. Always inspect the property before making any payment."}
                </p>
              </div>

              {/* Location */}
              {match.location && (
                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Location</p>
                  <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="w-full aspect-[4/3] sm:aspect-video overflow-hidden relative group/map">
                        <iframe
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps?q=${match.location.coordinates ? `${match.location.coordinates.lat},${match.location.coordinates.lng}` : encodeURIComponent(match.location.address)}&output=embed`}
                          className="w-full h-full grayscale-[0.2] contrast-[1.1]"
                        />

                        {/* Overlay for better integration */}
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/40 to-transparent" />

                        {googleMapsUrl && (
                          <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-4 right-4 z-10 bg-background/90 border border-border px-3 py-1.5 rounded-xl text-[10px] font-bold text-foreground flex items-center gap-1.5 hover:bg-background transition-colors"
                          >
                            <MapPin className="h-3 w-3 text-primary" />
                            VIEW ON GOOGLE MAPS
                          </a>
                        )}
                    </div>
                    <div className="p-4">
                      <p className="font-medium text-foreground text-sm">{match.location.address}</p>
                      {match.location.landmark && (
                        <p className="text-sm text-muted-foreground">Near {match.location.landmark}</p>
                      )}
                      {googleMapsUrl && (
                        <Button variant="outline" size="sm" className="w-full mt-3 font-bold rounded-xl border-2" asChild>
                          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                            <Search className="h-4 w-4 mr-2" />
                            Open in Google Maps
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Video Modal */}
      <Dialog open={showVideo} onOpenChange={setShowVideo}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none rounded-3xl">
          <DialogHeader className="p-6 absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
            <DialogTitle className="text-white font-bold flex items-center gap-2">
              <Play className="h-5 w-5 fill-primary text-primary" />
              Viewing Video for {match.alias}
            </DialogTitle>
          </DialogHeader>

          <div className="aspect-video w-full bg-muted flex items-center justify-center">
            {youtubeId ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                title={`Video for ${match.alias}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <div className="text-center p-12 space-y-4">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Play className="h-10 w-10 text-primary opacity-40" />
                </div>
                <p className="text-white font-bold text-lg">Virtual Tour Coming Soon</p>
                <p className="text-muted-foreground max-w-xs mx-auto text-sm">We are still processing the video for this property. Please check back later or contact the agent for a live tour.</p>
                <Button variant="outline" className="text-white border-white/20" onClick={() => setShowVideo(false)}>Close</Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
