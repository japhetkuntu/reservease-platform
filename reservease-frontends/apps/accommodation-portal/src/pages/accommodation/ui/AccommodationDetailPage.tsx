import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft, Pencil, Trash2, Eye, EyeOff, Clock,
  MapPin, Wifi, Zap, Droplets, Shield, UtensilsCrossed, Baby,
  BedDouble, Bath, Sofa, Users2, Home, Building2,
  X, ChevronRight, ChevronLeft as ChevLeft, ImageIcon,
  Camera, Sparkles, CheckCircle2,
  PlusCircle, CreditCard, MoreVertical, Info, Heart, Share2,
  Search, ShieldCheck, BadgeCheck, Banknote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  getAccommodationById, deleteAccommodation, toggleAccommodationStatus, formatImageUrl
} from "@/data/accommodations";
import type { Accommodation } from "@/data/accommodations";

// ── Lightbox Component ────────────────────────────────────────────────────────
function Lightbox({
  images, startIndex, onClose,
}: {
  images: { url: string; name: string }[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex flex-col backdrop-blur-3xl animate-in fade-in duration-500"
      onClick={onClose}
    >
      <div
        className="flex items-center justify-between px-8 py-6 shrink-0 bg-gradient-to-b from-black/80 to-transparent"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          <p className="text-white text-lg font-black tracking-tight">{images[idx]?.name}</p>
          <div className="flex items-center gap-2">
             <span className="text-primary font-black text-[10px] uppercase tracking-widest">{idx + 1} / {images.length}</span>
             <div className="h-1 w-1 rounded-full bg-white/20" />
             <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Property Asset</span>
          </div>
        </div>
        <button onClick={onClose} className="h-12 w-12 flex items-center justify-center text-white/60 hover:text-white rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-90">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div
        className="flex-1 flex items-center justify-center px-6 relative group"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative group/img-wrapper">
           <img
             src={images[idx]?.url}
             alt={images[idx]?.name}
             className="max-h-[80vh] max-w-[90vw] object-contain rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] select-none animate-in zoom-in-95 slide-in-from-bottom-10 duration-700"
             draggable={false}
           />
           <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-white/10 pointer-events-none" />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-8 h-16 w-16 flex items-center justify-center bg-black/40 hover:bg-primary text-white rounded-[2rem] transition-all backdrop-blur-xl opacity-0 group-hover:opacity-100 -translate-x-8 group-hover:translate-x-0 border border-white/5 shadow-2xl"
            >
              <ChevLeft className="w-8 h-8" />
            </button>
            <button
              onClick={next}
              className="absolute right-8 h-16 w-16 flex items-center justify-center bg-black/40 hover:bg-primary text-white rounded-[2rem] transition-all backdrop-blur-xl opacity-0 group-hover:opacity-100 translate-x-8 group-hover:translate-x-0 border border-white/5 shadow-2xl"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div
          className="flex justify-center gap-4 px-8 py-10 overflow-x-auto shrink-0 bg-gradient-to-t from-black/80 to-transparent no-scrollbar"
          onClick={e => e.stopPropagation()}
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={cn(
                "shrink-0 w-20 h-20 rounded-[1.5rem] overflow-hidden border-2 transition-all duration-500",
                i === idx ? "border-primary scale-110 shadow-[0_0_30px_rgba(var(--primary),0.4)]" : "border-transparent opacity-30 hover:opacity-100 hover:scale-105"
              )}
            >
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Detail Chip Component ─────────────────────────────────────────────────────
function DetailChip({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2 p-5 border border-border/50 rounded-[1.5rem] bg-muted/5 group hover:bg-primary/5 hover:border-primary/20 transition-all duration-300">
      <div className="flex items-center gap-2">
         <div className="p-2 rounded-xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <Icon className="w-4 h-4 shrink-0" />
         </div>
         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{label}</span>
      </div>
      <p className="font-black tracking-tight text-sm truncate px-1 uppercase">{value}</p>
    </div>
  );
}

// ── Section Container ─────────────────────────────────────────────────────────
function Section({ title, description, children, icon: Icon, action }: { title: string; description?: string; children: React.ReactNode; icon?: any; action?: React.ReactNode }) {
  return (
    <div className="relative group p-8 sm:p-12 rounded-[3.5rem] glass border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <Icon className="w-6 h-6" />
              </div>
            )}
            <h2 className="text-3xl font-black tracking-tighter leading-none uppercase">{title}</h2>
          </div>
          {description && <p className="text-muted-foreground text-sm font-medium tracking-tight px-1">{description}</p>}
        </div>
        {action}
      </div>
      <div className="relative z-10">
         {children}
      </div>
    </div>
  );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ isApproved, available }: { isApproved: boolean; available: boolean }) {
  if (!isApproved) {
    return (
      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 px-5 py-2 rounded-full font-black uppercase tracking-widest text-[10px] gap-3 shadow-xl shadow-amber-500/5">
        <Clock className="w-3.5 h-3.5" /> Moderation Pending
      </Badge>
    );
  }
  if (!available) {
    return (
      <Badge variant="outline" className="bg-zinc-500/10 text-zinc-600 border-zinc-500/20 px-5 py-2 rounded-full font-black uppercase tracking-widest text-[10px] gap-3 shadow-xl shadow-zinc-500/5">
        <EyeOff className="w-3.5 h-3.5" /> Hidden from Public
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-5 py-2 rounded-full font-black uppercase tracking-widest text-[10px] gap-3 shadow-xl shadow-emerald-500/10">
      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> Asset Live
    </Badge>
  );
}

// ── Main Page Component ───────────────────────────────────────────────────────
export function AccommodationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [accommodation, setAccommodation] = useState<Accommodation | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [delDialog, setDelDialog] = useState(false);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getAccommodationById(id);
      setAccommodation(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load property details";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleToggleOnline = useCallback(async () => {
    if (!accommodation?.id) return;
    try {
      await toggleAccommodationStatus(accommodation.id, !accommodation.available);
      fetchData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to toggle status";
      alert(message);
    }
  }, [accommodation, fetchData]);

  const handleDelete = useCallback(async () => {
    if (!accommodation?.id) return;
    try {
      await deleteAccommodation(accommodation.id);
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete property";
      alert(message);
    }
  }, [accommodation, navigate]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-background">
        <div className="relative h-24 w-24 mb-6">
           <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
           <div className="relative h-full w-full bg-primary/5 rounded-full flex items-center justify-center border border-primary/20">
              <Building2 className="w-10 h-10 text-primary animate-pulse" />
           </div>
        </div>
        <p className="text-xl font-bold tracking-tight">Synchronizing data...</p>
        <p className="text-sm text-muted-foreground mt-1">Acquiring property state from secure servers.</p>
      </div>
    );
  }

  if (error || !accommodation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-background">
        <div className="h-20 w-20 bg-destructive/10 rounded-[2rem] flex items-center justify-center mb-8">
           <X className="w-10 h-10 text-destructive" />
        </div>
        <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter">Access Refused</h2>
        <p className="text-muted-foreground mb-10 max-w-sm font-medium">{error || "This asset identifier does not exist or has been decommissioned."}</p>
        <Button asChild className="rounded-full px-10 h-14 font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/20 transition-all active:scale-95">
           <Link to="/dashboard"><ChevronLeft className="w-4 h-4 mr-2" /> Return to Command</Link>
        </Button>
      </div>
    );
  }

  const {
    images = [], name = "", location = "", nearestCampus = "none", campusProximity = "",
    roomType = "", bathroomType = "", furnishedStatus = "", genderPolicy = "", compoundType = "",
    backupPower = "", waterReliability = "", internetType = "", amenities = [], securityFeatures = [],
    cookingAllowed = false, childrenAllowed = false, rules = [],
    price = "0", priceUnit = "mo", advanceMonths = "0", securityDeposit = "0", isInclusive = false, negotiableRent = false,
    momoAccepted = false, available = false, isApproved = false, isVerified = false, totalRequests = 0
  } = accommodation;

  const priceLabel = priceUnit === "night" ? "/night" : priceUnit === "yr" ? "/year" : "/month";

  const PROXIMITY_LABELS: Record<string, string> = {
    walking: "Immediate Walk", trotro: "Short Commute", far: "Needs Transport",
  };

  const FURNISH_LABELS: Record<string, string> = {
    unfurnished: "Raw Base", "semi-furnished": "Essential", furnished: "Premium Full",
  };

  const lightboxImages = images.map(img => ({
    url: formatImageUrl(typeof img === 'string' ? img : URL.createObjectURL(img)),
    name: name || 'Property Asset'
  }));

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex-1 flex flex-col min-h-screen bg-background relative overflow-hidden">

        {/* Decor */}
        <div className="fixed inset-0 pointer-events-none">
           <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/2 rounded-full blur-[160px] -translate-y-1/2" />
           <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-primary/2 rounded-full blur-[160px] translate-y-1/2" />
        </div>

        {lightboxIdx !== null && (
          <Lightbox
            images={lightboxImages}
            startIndex={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
          />
        )}

        {/* ── Top Header ──────────────────── */}
        <div className="sticky top-16 z-30 border-b bg-background/50 backdrop-blur-xl transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
            <Button variant="ghost" size="sm" asChild className="rounded-full hover:bg-primary/5 text-muted-foreground transition-all">
              <Link to="/dashboard"><ChevronLeft className="mr-1 h-4 w-4" /> Dashboard</Link>
            </Button>

            <div className="h-4 w-px bg-border/50 hidden sm:block" />

            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-3">
                  <h2 className="text-sm font-black truncate uppercase tracking-tight">{name}</h2>
                  <StatusBadge isApproved={isApproved} available={available} />
               </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
               <Button variant="outline" size="sm" className="rounded-full px-6 font-black uppercase tracking-widest text-[10px] h-10 border-border/50 hover:bg-primary/5" asChild>
                  <Link to={`/edit-property/${id}`}><Pencil className="w-3 h-3 mr-2" /> Modify Asset</Link>
               </Button>
               <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full text-destructive hover:bg-destructive/5 hover:text-destructive" onClick={() => setDelDialog(true)}>
                  <Trash2 className="w-4 h-4" />
               </Button>
            </div>
          </div>
        </div>

        {/* ── Content ──────────────────────── */}
        <div className="max-w-7xl mx-auto w-full px-6 py-12 relative z-10 space-y-12">

          {/* ── Photo Cinematic Wall ───────────────────────── */}
          {images.length > 0 ? (
            <div className="group/gallery relative aspect-[21/9] sm:aspect-[24/10] w-full rounded-[4rem] overflow-hidden bg-muted shadow-[0_40px_100px_rgba(0,0,0,0.12)]">
              <div className="flex h-full gap-2">
                <div
                  className="relative flex-[2] overflow-hidden cursor-pointer h-full"
                  onClick={() => setLightboxIdx(0)}
                >
                  <img
                    src={lightboxImages[0].url}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover/gallery:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {images.length > 1 && (
                  <div className="flex-1 flex flex-col gap-2 h-full">
                    {images.slice(1, 3).map((_, i) => {
                      const idx = i + 1;
                      const isLastShown = idx === 2 && images.length > 3;
                      return (
                        <div
                          key={idx}
                          className="relative flex-1 overflow-hidden cursor-pointer"
                          onClick={() => setLightboxIdx(idx)}
                        >
                          <img
                            src={lightboxImages[idx].url}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-[1500ms] hover:scale-110"
                          />
                          {isLastShown ? (
                            <div className="absolute inset-0 bg-black/80 backdrop-blur-[6px] flex flex-col items-center justify-center gap-1 group/more transition-all hover:bg-black/90">
                              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                              <p className="text-white font-black text-2xl tabular-nums">+{images.length - 3}</p>
                              <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Explore More</p>
                            </div>
                          ) : (
                            <div className="absolute inset-0 bg-black/5 hover:bg-black/20 transition-colors" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="absolute bottom-12 right-12 flex items-center gap-4">
                <button
                  onClick={() => setLightboxIdx(0)}
                  className="glass-dark text-white border border-white/10 rounded-[2rem] px-8 h-16 flex items-center gap-3 font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all hover:scale-105 active:scale-95"
                >
                  <ImageIcon className="w-5 h-5 text-primary" />
                  View Asset Portfolio ({images.length})
                </button>
              </div>

              <div className="absolute top-12 left-12 space-y-4">
                 <h1 className="text-white text-5xl sm:text-7xl font-black tracking-tighter drop-shadow-2xl">{name}</h1>
                 <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-3xl text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                       <MapPin className="w-3.5 h-3.5 text-primary" /> {location}
                    </span>
                    {isVerified && (
                      <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/80 backdrop-blur-3xl text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-400/20">
                         <ShieldCheck className="w-3.5 h-3.5" /> Trusted Entity
                      </span>
                    )}
                 </div>
              </div>
            </div>
          ) : (
            <div className="aspect-[21/9] rounded-[4rem] border-2 border-dashed border-border/50 bg-muted/5 flex flex-col items-center justify-center gap-6 text-muted-foreground p-12">
               <div className="h-24 w-24 rounded-[2.5rem] bg-muted flex items-center justify-center shadow-inner">
                  <Camera className="w-10 h-10 opacity-20" />
               </div>
               <div className="text-center space-y-2">
                  <p className="text-3xl font-black tracking-tight uppercase">Cinematic Gap Detected</p>
                  <p className="font-medium text-muted-foreground max-w-sm mx-auto">Assets without visual representation receive 75% less engagement from prospective tenants.</p>
               </div>
               <Button variant="outline" size="lg" className="h-14 rounded-full px-10 font-black uppercase tracking-widest text-[11px] bg-background shadow-xl hover:bg-primary/5 transition-all" asChild>
                  <Link to={`/edit-property/${id}?step=6`}><PlusCircle className="w-4 h-4 mr-2" /> Inject Visual Data</Link>
               </Button>
            </div>
          )}

          {/* ── Analytics & Stats ──────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <StatCard label="Live Status" value={available ? "Online" : "Paused"} icon={available ? Eye : EyeOff} color={available ? "text-emerald-500" : "text-amber-500"} />
             <StatCard label="Total Interest" value={totalRequests} icon={Users2} />
             <StatCard label="Rental Strategy" value={priceLabel.replace('/', '')} icon={History} />
             <StatCard label="Financial Yield" value={`₵${parseInt(price || '0').toLocaleString()}`} sub={priceLabel} icon={Banknote} color="text-primary" />
          </div>

          <Separator className="opacity-50" />

          {/* ── Main Details Grid ─────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            <Section title="Asset Specification" description="Detailed hardware and configuration parameters of the property." icon={Home}>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <DetailChip icon={BedDouble} label="Configuration" value={(roomType || "").replace(/-/g, " ")} />
                  <DetailChip icon={Bath}      label="Sanitation"    value={bathroomType} />
                  <DetailChip icon={Sofa}      label="Furnishing"    value={FURNISH_LABELS[furnishedStatus] ?? furnishedStatus} />
                  <DetailChip icon={Users2}    label="Identity"      value={(genderPolicy || "").replace(/-/g, " ")} />
                  <DetailChip icon={Building2} label="Structure"     value={(compoundType || "").replace(/-/g, " ")} />
                  <DetailChip icon={Clock}     label="Proximity"     value={PROXIMITY_LABELS[campusProximity] ?? campusProximity} />
               </div>
            </Section>

            <Section title="Resilience & Connectivity" description="Backup infrastructure and digital environment state." icon={Zap}>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                  <DetailChip icon={Zap}      label="Backup Node"   value={backupPower === "None" ? "No Backup" : backupPower} />
                  <DetailChip icon={Droplets} label="Hydraulic"     value={waterReliability} />
                  <DetailChip icon={Wifi}     label="Network"       value={internetType === "None" ? "Offline" : internetType} />
               </div>
               <div className="flex flex-wrap gap-2">
                  {amenities.filter(Boolean).map(a => (
                    <span key={a} className="px-5 py-2.5 bg-muted/30 hover:bg-primary/5 rounded-[1.25rem] text-[10px] font-black text-muted-foreground uppercase tracking-widest border border-border/50 transition-colors">
                      {(a || "").replace(/-/g, " ")}
                    </span>
                  ))}
                  {(securityFeatures ?? []).map(s => (
                    <span key={s} className="px-5 py-2.5 bg-primary/5 rounded-[1.25rem] text-[10px] font-black text-primary uppercase tracking-widest border border-primary/20 transition-all hover:scale-105">
                       <ShieldCheck className="w-3 h-3 mr-1.5 inline-block opacity-60" /> {s}
                    </span>
                  ))}
               </div>
            </Section>

            <Section title="Governance Protocols" description="Operational mandates and tenant behavioral guidelines." icon={Shield}>
               <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <ToggleStateCard label="Culinary Access" active={cookingAllowed} icon={UtensilsCrossed} desc="Kitchen utilities included" />
                     <ToggleStateCard label="Family Compatibility" active={childrenAllowed} icon={Baby} desc="Property allows minors" />
                  </div>

                  {(rules ?? []).length > 0 && (
                    <div className="p-8 rounded-[2.5rem] bg-muted/20 border border-border/50">
                       <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6">Established House Rules</p>
                       <div className="space-y-4">
                          {(rules ?? []).map((rule, idx) => (
                             <div key={idx} className="flex items-start gap-4">
                                <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">{(idx+1)}</div>
                                <p className="text-sm font-bold text-foreground/80 leading-relaxed">{rule}</p>
                             </div>
                          ))}
                       </div>
                    </div>
                  )}
               </div>
            </Section>

            <Section title="Financial Architecture" description="Capital requirements and settlement modalities." icon={Banknote}>
               <div className="p-10 rounded-[3rem] bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 space-y-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-5 -translate-y-4 translate-x-4"><BadgeCheck className="w-64 h-64" /></div>

                  <div className="grid grid-cols-2 gap-10 relative z-10">
                     <div className="space-y-2">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Quantum of Rent</p>
                        <div className="flex items-baseline gap-2">
                           <span className="text-5xl font-black tracking-tighter text-primary">₵{parseInt(price || "0").toLocaleString()}</span>
                           <span className="text-sm font-black text-muted-foreground uppercase tracking-widest">{priceLabel}</span>
                        </div>
                     </div>
                     <div className="space-y-2 text-right">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Advance Cycle</p>
                        <p className="text-2xl font-black uppercase tracking-tight">{advanceMonths} {parseInt(advanceMonths) === 1 ? "Phase" : "Phases"}</p>
                        <p className="text-[10px] font-bold text-muted-foreground italic">({parseInt(advanceMonths) * (priceUnit === 'yr' ? 12 : 1)} Months total)</p>
                     </div>
                  </div>

                  <div className="h-px bg-primary/10 relative z-10" />

                  <div className="grid grid-cols-3 gap-3 relative z-10">
                     <ReviewTile label="Inclusive" active={isInclusive} />
                     <ReviewTile label="Negotiable" active={negotiableRent} />
                     <ReviewTile label="Digital Pay" active={momoAccepted} />
                  </div>

                  {securityDeposit && parseInt(securityDeposit) > 0 && (
                    <div className="flex items-center justify-between p-6 rounded-[2rem] bg-foreground/5 border border-foreground/5 relative z-10">
                       <p className="text-[11px] font-black uppercase tracking-widest">Security Deposit Pool</p>
                       <p className="font-black text-lg tabular-nums tracking-tighter">₵{parseInt(securityDeposit).toLocaleString()}</p>
                    </div>
                  )}
               </div>
            </Section>
          </div>

          {/* ── Fixed Command Center ─────────────────────────── */}
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6 pointer-events-none">
             <div className="glass border border-white/20 dark:border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.3)] rounded-[3rem] p-4 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-20 duration-1000 pointer-events-auto">
                <div className="flex items-center gap-6 pl-6">
                   <div className={cn("h-4 w-4 rounded-full shadow-[0_0_20px_rgba(var(--color),0.5)]", available ? "bg-emerald-500 animate-pulse" : "bg-zinc-400")} />
                   <div className="hidden sm:block min-w-[140px]">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1">Asset Status</p>
                      <p className="text-sm font-black tracking-tight">{available ? "Live & Transmitting" : "Operational Pause"}</p>
                   </div>
                </div>

                <div className="flex items-center gap-2">
                   <Button
                      onClick={handleToggleOnline}
                      disabled={!isApproved}
                      className={cn("h-16 px-10 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] gap-4 transition-all active:scale-95 shadow-2xl",
                        available ? "bg-zinc-900 dark:bg-zinc-100 text-background" : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
                      )}
                   >
                      {available ? <><EyeOff className="w-5 h-5" /> Off-Circuit</> : <><Eye className="w-5 h-5" /> Activate Live</>}
                   </Button>

                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                         <Button variant="outline" className="h-16 w-16 rounded-[2rem] border-border/50 bg-background/50 hover:bg-primary/5">
                            <MoreVertical className="w-6 h-6" />
                         </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64 p-3 rounded-[2rem] border-border/50 shadow-[0_30px_60px_rgba(0,0,0,0.2)]">
                         <DropdownMenuItem className="h-14 rounded-2xl gap-4 font-black uppercase tracking-widest text-[10px] cursor-pointer" onClick={() => navigate(`/edit-property/${id}`)}>
                            <div className="p-2 bg-primary/10 rounded-xl text-primary transition-colors"><Pencil className="h-4 w-4" /></div>
                            Modify Matrix
                         </DropdownMenuItem>
                         <DropdownMenuItem className="h-14 rounded-2xl text-destructive focus:text-destructive focus:bg-destructive/5 font-black uppercase tracking-widest text-[10px] gap-4 mt-1 cursor-pointer" onClick={() => setDelDialog(true)}>
                            <div className="p-2 bg-destructive/10 rounded-xl text-destructive"><Trash2 className="h-4 w-4" /></div>
                            Decommission Asset
                         </DropdownMenuItem>
                      </DropdownMenuContent>
                   </DropdownMenu>
                </div>
             </div>
          </div>
        </div>

        {/* ── Deletion Protocol Dialog ──────────── */}
        <AlertDialog open={delDialog} onOpenChange={setDelDialog}>
          <AlertDialogContent className="rounded-[3rem] p-12 border-destructive/20 shadow-2xl">
            <div className="flex flex-col items-center text-center gap-8">
               <div className="h-24 w-24 rounded-[2.5rem] bg-destructive/10 text-destructive flex items-center justify-center animate-pulse">
                  <Trash2 className="w-12 h-12" />
               </div>
               <div className="space-y-3">
                  <AlertDialogTitle className="text-4xl font-black tracking-tighter uppercase">Initiate Deletion?</AlertDialogTitle>
                  <AlertDialogDescription className="text-base font-medium leading-relaxed">
                    You are about to permanently purge <strong className="text-foreground">{name}</strong> from the ReservEase ecosystem. This action is terminal and cannot be reversed.
                  </AlertDialogDescription>
               </div>
               <div className="flex flex-col w-full gap-3">
                  <AlertDialogAction
                    className="h-16 rounded-full bg-destructive text-white hover:bg-destructive/90 font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-destructive/20 transition-all active:scale-95"
                    onClick={handleDelete}
                  >
                    Authorize Deletion
                  </AlertDialogAction>
                  <AlertDialogCancel className="h-16 rounded-full font-black uppercase tracking-widest text-[11px] border-0 hover:bg-muted transition-all">Abort Protocol</AlertDialogCancel>
               </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </TooltipProvider>
  );
}

// ── Sub-components Continued ──────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, sub, color }: { label: string; value: string | number; icon: any; sub?: string; color?: string }) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-card border border-border/50 group hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden relative">
       <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700"><Icon className="w-16 h-16" /></div>
       <div className="space-y-4 relative z-10 text-center md:text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{label}</p>
          <div className="space-y-0">
             <p className={cn("text-3xl font-black tracking-tighter", color || "text-foreground")}>{value}</p>
             {sub && <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{sub}</p>}
          </div>
       </div>
    </div>
  );
}

function ToggleStateCard({ label, active, icon: Icon, desc }: { label: string; active: boolean; icon: any; desc: string }) {
  return (
    <div className={cn("p-6 rounded-[2rem] border transition-all duration-500 flex items-center justify-between gap-4",
      active ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-muted/5 border-border/50 opacity-60"
    )}>
       <div className="flex items-center gap-4">
          <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500",
            active ? "bg-primary text-white shadow-lg shadow-primary/20 rotate-6" : "bg-muted text-muted-foreground"
          )}>
             <Icon className="w-6 h-6" />
          </div>
          <div>
             <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">{label}</p>
             <p className="text-[10px] font-medium text-muted-foreground/60 leading-none">{desc}</p>
          </div>
       </div>
       <Badge variant={active ? "default" : "secondary"} className={cn("rounded-lg px-2 py-0.5 text-[9px] font-black uppercase border-0 pointer-events-none",
         active ? "bg-primary text-white" : "bg-muted-foreground/10 text-muted-foreground"
       )}>
          {active ? "Allowed" : "Void"}
       </Badge>
    </div>
  );
}

function ReviewTile({ label, active }: { label: string; active: boolean }) {
  return (
    <div className={cn("text-center p-4 rounded-[1.5rem] border transition-all",
       active ? "bg-primary/10 border-primary/20 text-primary" : "bg-card border-border/50 text-muted-foreground/40"
    )}>
       <p className="text-[9px] font-black uppercase tracking-widest mb-1">{label}</p>
       <p className="text-xs font-black uppercase tracking-tighter">{active ? "Active" : "None"}</p>
    </div>
  );
}
