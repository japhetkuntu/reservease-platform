import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, Check, X, RefreshCw, Loader2, Home, MapPin,
  Search as SearchIcon, Users, Calendar, Wallet, CheckCircle2, Sparkles,
  Wifi, Car, Bus, TreePine, GraduationCap, Utensils, Zap, ShieldCheck,
  ChevronRight, Info, Clock, Edit3, BadgeCheck, Smartphone, Users2,
  Building2, Wind, Timer, LayoutTemplate, Droplets, Droplet, Plus,
  Target, Shield, Gauge, Map, Building, DoorOpen, Bed, Crown, Briefcase, Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useRequest } from "@/contexts/RequestContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// ─── Icon map (unchanged) ─────────────────────────────────────────────────────
const iconMap: Record<string, React.ComponentType<any>> = {
  Building2, Home, Building, DoorOpen, Users, Bed, Sparkles, Crown,
  Briefcase, Users2, Heart, Wifi, Zap, Shield, Car, Bus,
};

const TOTAL_STEPS = 8;

// ─── Data (all unchanged) ─────────────────────────────────────────────────────
const propertyTypes = [
  { value: "hostel", label: "Hostel", description: "Shared living with modern amenities", icon: "Building2" },
  { value: "apartment", label: "Apartment", description: "Full private living space", icon: "Home" },
  { value: "hotel-room", label: "Hotel Room", description: "Short-stay private rooms with daily service", icon: "Building" },
  { value: "guest-house", label: "Guest House", description: "Cozy, affordable short-term stays", icon: "Building2" },
  { value: "self-contain", label: "Self-Contain", description: "Private room with own bathroom & kitchen", icon: "DoorOpen" },
  { value: "homestay", label: "Homestay", description: "Share space with a host or roommate", icon: "Users" },
];

const durations = [
  { value: "nightly", label: "Nightly (1-6 nights)" },
  { value: "weekly", label: "Weekly (1-3 weeks)" },
  { value: "monthly", label: "Monthly" },
  { value: "1-semester", label: "1 Semester" },
  { value: "1-year", label: "1 Year or more" },
  { value: "flexible", label: "Flexible" },
];

const urgencyOptions = [
  { value: "urgently", label: "Urgently (Next 48 hrs)", desc: "Need to move in immediately", urgent: true },
  { value: "this-week", label: "Later this week", desc: "Within the next 7 days" },
  { value: "next-week", label: "Next Week", desc: "Between 7 to 14 days" },
  { value: "next-month", label: "Next month or later", desc: "Planning ahead" },
];

const facilitiesList = [
  { value: "wifi", label: "Free WiFi" }, { value: "ac", label: "Air Conditioning" },
  { value: "generator", label: "Backup Generator" }, { value: "parking", label: "Free Parking" },
  { value: "pool", label: "Swimming Pool" }, { value: "kitchen", label: "Kitchen Access" },
  { value: "laundry", label: "Laundry Service" }, { value: "security", label: "24/7 Security" },
  { value: "breakfast", label: "Breakfast Included" }, { value: "furnished", label: "Fully Furnished" },
];

const popularLocations = [
  "Near KNUST", "Legon / East Legon", "Ashesi / Berekuso", "Near UCC",
  "Accra Central", "Osu", "Kumasi", "Tema / Community", "Cape Coast", "Takoradi",
];

const roomTypesByCategory: Record<string, { value: string; icon: string; label: string; desc: string }[]> = {
  hostel: [
    { value: "Single Room", icon: "Bed", label: "Single Room", desc: "Your own room, shared facilities" },
    { value: "Double Room", icon: "Bed", label: "Double Room", desc: "Room for 2, shared or private" },
    { value: "Bed Space", icon: "Bed", label: "Bed Space", desc: "Share a room with others — cheapest option" },
    { value: "Studio Room", icon: "DoorOpen", label: "Studio (En-suite)", desc: "Private ensuite within hostel" },
    { value: "Any", icon: "Sparkles", label: "Any / Flexible", desc: "Open to whichever is available" },
  ],
  apartment: [
    { value: "Studio Apartment", icon: "Home", label: "Studio / Bedsitter", desc: "1-room open plan living" },
    { value: "1-Bedroom", icon: "Bed", label: "1-Bedroom", desc: "Separate bedroom, living area" },
    { value: "2-Bedroom", icon: "Bed", label: "2-Bedroom", desc: "Two bedrooms + living area" },
    { value: "3-Bedroom", icon: "Building2", label: "3-Bedroom+", desc: "3 or more bedroom apartment" },
    { value: "Penthouse", icon: "Crown", label: "Penthouse/Duplex", desc: "Top floor luxury unit" },
  ],
  "hotel-room": [
    { value: "Standard Room", icon: "Bed", label: "Standard Room", desc: "Classic hotel room with basics" },
    { value: "Deluxe Room", icon: "Sparkles", label: "Deluxe Room", desc: "Upgraded amenities & space" },
    { value: "Suite", icon: "Crown", label: "Suite", desc: "Separate sitting area + bedroom" },
    { value: "Executive Room", icon: "Briefcase", label: "Executive Room", desc: "Business traveler focused" },
    { value: "Twin Room", icon: "Bed", label: "Twin Room", desc: "Two separate beds" },
  ],
  "guest-house": [
    { value: "Single Room", icon: "Bed", label: "Single Room", desc: "Basic private room" },
    { value: "Double Room", icon: "Bed", label: "Double Room", desc: "Room for two" },
    { value: "Self-Contain Room", icon: "DoorOpen", label: "Self-Contain", desc: "Private bathroom, own entrance" },
    { value: "Family Room", icon: "Users2", label: "Family Room", desc: "Larger room for families" },
  ],
  "self-contain": [
    { value: "Single Self-Contain", icon: "DoorOpen", label: "Single S/C", desc: "Private room + private bath" },
    { value: "Chamber & Hall", icon: "Home", label: "Chamber & Hall", desc: "Ghana-style 2-room layout" },
    { value: "2-Room Self-Contain", icon: "Bed", label: "2-Room S/C", desc: "Two rooms + own bathroom" },
    { value: "3-Room Self-Contain", icon: "Building2", label: "3-Room S/C", desc: "Three rooms + own facilities" },
  ],
  homestay: [
    { value: "Private Room", icon: "Bed", label: "Private Room", desc: "Your own room in host's home" },
    { value: "Shared Room", icon: "Users2", label: "Shared Room", desc: "Share a room with another guest" },
    { value: "Entire Place", icon: "Home", label: "Entire Place", desc: "Have the whole home to yourself" },
  ],
};

// ─── Step labels for the progress bar ────────────────────────────────────────
const stepLabels = [
  "Who's searching", "Location & type", "Room type", "Timeline",
  "Budget", "Preferences", "Utilities", "Final details",
];

// ─── NEW: Progress bar component ─────────────────────────────────────────────
function WizardProgress({ step, total }: { step: number; total: number }) {
  const pct = Math.round(((step + 1) / total) * 100);
  return (
    <div className="flex-1 flex flex-col items-center gap-1.5 px-4 min-w-0">
      <div className="w-full max-w-xs h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-400 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] font-medium text-muted-foreground truncate max-w-xs text-center">
        Step {step + 1} of {total} — {stepLabels[step]}
      </span>
    </div>
  );
}

// ─── Sub-components (logic unchanged, minor visual tweaks) ────────────────────
function ToggleCard({
  label, desc, icon: Icon, field, formData, updateField,
}: {
  label: string; desc: string; icon: any; field: string;
  formData: any; updateField: (f: string, v: any) => void;
}) {
  const value = !!formData[field];
  // FIX: outer element is a div, not a button — Switch renders a <button> internally
  // and <button> inside <button> is invalid HTML that crashes React.
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => updateField(field, !value)}
      onKeyDown={(e) => e.key === "Enter" && updateField(field, !value)}
      className={cn(
        "p-4 rounded-xl border text-left transition-all flex items-center justify-between gap-4 cursor-pointer select-none",
        value ? "bg-primary/8 border-primary" : "bg-card border-border hover:border-primary/40"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
          value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          {/* FIX: always treat icon as a component — Lucide icons are always functions */}
          {Icon && typeof Icon === "function" ? <Icon className="w-4 h-4" /> : null}
        </div>
        <div>
          <p className="font-semibold text-sm text-foreground leading-tight">{label}</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{desc}</p>
        </div>
      </div>
      {/* stopPropagation so clicking the switch doesn't also fire the div's onClick */}
      <div onClick={(e) => e.stopPropagation()}>
        <Switch
          checked={value}
          onCheckedChange={(v) => updateField(field, v)}
          className="data-[state=checked]:bg-primary shrink-0"
        />
      </div>
    </div>
  );
}

function FieldLabel({ label, icon: Icon, help }: { label: string; icon: any; help?: string }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wide">
        <Icon size={12} className="opacity-60" /> {label}
      </label>
      {help && <span className="text-xs text-muted-foreground/50">{help}</span>}
    </div>
  );
}

function PulseField({ label, icon, help, children }: { label: string; icon: any; help?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <FieldLabel label={label} icon={icon} help={help} />
      {children}
    </div>
  );
}

// ─── Step animation — starts at 0.7 opacity so no blank flash ────────────────
const stepVariants = {
  initial: { opacity: 0.5, x: 24 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0.5, x: -16, transition: { duration: 0.15 } },
};

// ─── Main component ───────────────────────────────────────────────────────────
interface SearchWizardProps { onClose?: () => void; }

export function SearchWizard({ onClose }: SearchWizardProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updateCurrentRequest, submitRequest, getRequest, refineSearch } = useRequest();
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refineRequestId = searchParams.get("refine");
  const existingRequest = refineRequestId ? getRequest(refineRequestId) : null;
  const isRefinementMode = !!refineRequestId && !!existingRequest;

  const getInitialSearchFor = () => {
    if (existingRequest) return existingRequest.searchingFor;
    const forParam = searchParams.get("for");
    return (forParam === "other" || forParam === "others") ? "someone-else" : "self";
  };

  const [formData, setFormData] = useState(() => {
    if (existingRequest) {
      const toArr = (v: string | string[] | undefined) =>
        !v ? [] : Array.isArray(v) ? v : [v];
      return {
        searchingFor: existingRequest.searchingFor as "self" | "someone-else",
        gender: existingRequest.gender as "male" | "female" | "any" | "",
        budget: [existingRequest.budget.min, existingRequest.budget.max],
        locations: toArr(existingRequest.location),
        categories: toArr(existingRequest.roomType),
        roomTypes: [] as string[],
        customRoomTypes: [] as string[],
        durations: toArr(existingRequest.duration),
        moveInUrgencies: toArr(existingRequest.moveInUrgency),
        facilities: existingRequest.facilities,
        notes: existingRequest.notes,
        preferredBackupPower: existingRequest.preferredBackupPower || "any",
        preferredWaterReliability: existingRequest.preferredWaterReliability || "any",
        preferredUtilityMetering: existingRequest.preferredUtilityMetering || "any",
        preferredRoadAccess: existingRequest.preferredRoadAccess || "any",
        maxAdvanceMonths: existingRequest.maxAdvanceMonths || 12,
        maxSecurityDeposit: existingRequest.maxSecurityDeposit || 0,
        preferredBathroomType: existingRequest.preferredBathroomType || "any",
        verificationRequired: existingRequest.verificationRequired || false,
        isInclusiveRequired: existingRequest.isInclusiveRequired || false,
        preferredTransportAccess: existingRequest.preferredTransportAccess || [],
        preferredCompoundType: existingRequest.preferredCompoundType || "any",
        preferredInternetType: existingRequest.preferredInternetType || "any",
        momoPaymentRequired: existingRequest.momoPaymentRequired || false,
        negotiableRequired: existingRequest.negotiableRequired || false,
        cookingRequired: existingRequest.cookingRequired || false,
        childrenAllowedRequired: existingRequest.childrenAllowedRequired || false,
        minCampusProximity: existingRequest.minCampusProximity || "any",
        nearestCampus: existingRequest.nearestCampus || "",
        breakfastRequired: existingRequest.breakfastRequired || false,
        acRequired: existingRequest.acRequired || false,
        parkingRequired: existingRequest.parkingRequired || false,
        preferredFurnishedStatus: existingRequest.preferredFurnishedStatus || "any",
      };
    }
    return {
      searchingFor: getInitialSearchFor() as "self" | "someone-else",
      gender: "" as "male" | "female" | "any" | "",
      budget: [500, 3000],
      locations: [] as string[],
      categories: [] as string[],
      roomTypes: [] as string[],
      customRoomTypes: [] as string[],
      durations: [] as string[],
      moveInUrgencies: [] as string[],
      facilities: [] as string[],
      notes: "",
      preferredBackupPower: "any", preferredWaterReliability: "any",
      preferredUtilityMetering: "any", preferredRoadAccess: "any",
      maxAdvanceMonths: 12, maxSecurityDeposit: 0,
      preferredBathroomType: "any", verificationRequired: false,
      isInclusiveRequired: false, preferredTransportAccess: [] as string[],
      preferredCompoundType: "any", preferredInternetType: "any",
      momoPaymentRequired: false, negotiableRequired: false,
      cookingRequired: false, childrenAllowedRequired: false,
      minCampusProximity: "any", nearestCampus: "",
      breakfastRequired: false, acRequired: false,
      parkingRequired: false, preferredFurnishedStatus: "any",
    };
  });

  useEffect(() => {
    const forParam = searchParams.get("for");
    if ((forParam === "other" || forParam === "others") && formData.searchingFor !== "someone-else")
      setFormData(prev => ({ ...prev, searchingFor: "someone-else" }));
    else if (forParam === "self" && formData.searchingFor !== "self")
      setFormData(prev => ({ ...prev, searchingFor: "self" }));
  }, [searchParams, formData.searchingFor]);

  const updateField = (field: string, value: any) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const toggleMulti = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => {
      const current = prev[field] as string[];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [field]: next };
    });
  };

  const canProceed = () => {
    switch (step) {
      case 0: return formData.searchingFor && formData.gender;
      case 1: return formData.locations.length > 0 && formData.categories.length > 0;
      case 2: return formData.roomTypes.length > 0 || formData.customRoomTypes.length > 0;
      case 3: return formData.durations.length > 0 && formData.moveInUrgencies.length > 0;
      case 4: return formData.budget[0] > 0;
      case 5: case 6: case 7: return true;
      default: return false;
    }
  };

  const handleNext = async () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const requestData = {
        searchingFor: formData.searchingFor as "self" | "someone-else",
        gender: formData.gender as "male" | "female" | "any",
        budget: { min: formData.budget[0], max: formData.budget[1] },
        location: formData.locations,
        roomType: [...formData.categories, ...formData.roomTypes, ...formData.customRoomTypes],
        duration: formData.durations,
        moveInUrgency: formData.moveInUrgencies,
        facilities: formData.facilities,
        notes: formData.notes,
        preferredBackupPower: formData.preferredBackupPower === "any" ? null : formData.preferredBackupPower,
        preferredWaterReliability: formData.preferredWaterReliability === "any" ? null : formData.preferredWaterReliability,
        preferredUtilityMetering: formData.preferredUtilityMetering === "any" ? null : formData.preferredUtilityMetering,
        preferredRoadAccess: formData.preferredRoadAccess === "any" ? null : formData.preferredRoadAccess,
        maxAdvanceMonths: formData.maxAdvanceMonths,
        maxSecurityDeposit: formData.maxSecurityDeposit > 0 ? formData.maxSecurityDeposit : null,
        preferredBathroomType: formData.preferredBathroomType === "any" ? null : formData.preferredBathroomType,
        verificationRequired: formData.verificationRequired,
        isInclusiveRequired: formData.isInclusiveRequired,
        preferredTransportAccess: formData.preferredTransportAccess,
        preferredCompoundType: formData.preferredCompoundType === "any" ? null : formData.preferredCompoundType,
        preferredInternetType: formData.preferredInternetType === "any" ? null : formData.preferredInternetType,
        momoPaymentRequired: formData.momoPaymentRequired || undefined,
        negotiableRequired: formData.negotiableRequired || undefined,
        cookingRequired: formData.cookingRequired || undefined,
        childrenAllowedRequired: formData.childrenAllowedRequired || undefined,
        minCampusProximity: formData.minCampusProximity === "any" ? null : formData.minCampusProximity,
        nearestCampus: formData.nearestCampus || null,
        breakfastRequired: formData.breakfastRequired || undefined,
        acRequired: formData.acRequired || undefined,
        parkingRequired: formData.parkingRequired || undefined,
        preferredFurnishedStatus: formData.preferredFurnishedStatus === "any" ? null : formData.preferredFurnishedStatus,
      };
      try {
        setIsSubmitting(true);
        if (isRefinementMode && refineRequestId) {
          const success = await refineSearch(refineRequestId, requestData);
          if (success) navigate(`/request/${refineRequestId}`);
          else throw new Error("Failed to refine search. You might have run out of free retries.");
        } else {
          updateCurrentRequest(requestData);
          if (!isLoggedIn) {
            localStorage.setItem("pending_request", JSON.stringify(requestData));
            navigate("/signup?returnUrl=/checkout/pending");
            return;
          }
          const createdRequest = await submitRequest(requestData);
          if (createdRequest.status === "processing" || createdRequest.discountApplied)
            navigate(`/request/${createdRequest.id}`);
          else navigate(`/checkout/${createdRequest.id}`);
        }
      } catch (err: any) {
        toast({ variant: "destructive", title: "Request Failed", description: err.message || "An unexpected error occurred." });
      } finally { setIsSubmitting(false); }
    }
  };

  const handleBack = () => {
    if (step > 0) { setStep(step - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else if (isRefinementMode && refineRequestId) navigate(`/request/${refineRequestId}`);
    else if (onClose) onClose();
    else navigate("/");
  };

  const stepTitles = [
    "Who is this search for?", "Where do you want to live?", "What type of room?",
    "When do you need it?", "What's your budget?", "Your preferences",
    "Utilities & infrastructure", "Final details",
  ];

  const isHostelIntent = formData.categories.some(t => ["hostel", "student", "dorm", "campus", "bed-space"].includes(t));
  const isHotelIntent = formData.categories.some(t => ["hotel-room", "guest-house", "short-stay", "airbnb", "lodge", "guesthouse", "motel"].includes(t));
  const isLongTermIntent = formData.categories.some(t => ["apartment", "self-contain", "flat", "studio", "villa", "house", "bungalow", "penthouse", "homestay"].includes(t));

  const uniqueRoomTypes = useMemo(() => {
    const types = formData.categories.flatMap(cat => roomTypesByCategory[cat] || []);
    return types.filter((rt, idx, arr) => arr.findIndex(r => r.value === rt.value) === idx);
  }, [formData.categories]);

  // Inline toggle switch (used in long-term section)
  const ToggleSwitch = ({ field, label, description, icon }: { field: string; label: string; description: string; icon: React.ReactNode }) => {
    const value = formData[field as keyof typeof formData] as boolean;
    return (
      <div onClick={() => updateField(field, !value)} className={cn(
        "p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4",
        value ? "bg-primary/5 border-primary" : "bg-card border-border/60 hover:border-primary/30"
      )}>
        <div className={cn("h-9 w-9 rounded-full flex items-center justify-center shrink-0", value ? "bg-primary/20" : "bg-muted")}>
          <span className={cn(value ? "text-primary" : "text-muted-foreground/50")}>{icon}</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className={cn("w-11 h-6 rounded-full relative transition-colors shrink-0", value ? "bg-primary" : "bg-muted")}>
          <motion.div animate={{ x: value ? 22 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm" />
        </div>
      </div>
    );
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    // FIX: Plain div instead of motion.div with opacity:0 — no blank flash
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── HEADER: new progress bar replaces tiny dots ── */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="h-14 flex items-center justify-between px-4 sm:px-6 max-w-2xl mx-auto w-full">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors min-w-[56px]"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* NEW: Labelled progress bar */}
          <WizardProgress step={step} total={TOTAL_STEPS} />

          <button
            onClick={onClose || (() => navigate("/"))}
            className="flex items-center justify-end text-muted-foreground hover:text-foreground transition-colors min-w-[56px]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Refinement mode banner (unchanged) */}
      {isRefinementMode && existingRequest && (
        <div className="bg-primary/5 border-b border-primary/20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <RefreshCw className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Refining your search</p>
              <p className="text-xs text-muted-foreground">
                {existingRequest.retriesRemaining} free refinement{existingRequest.retriesRemaining !== 1 ? "s" : ""} remaining
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT: tighter max-width, better vertical rhythm ── */}
      <main className="flex-1 pb-28">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <AnimatePresence mode="wait">

            {/* ══ STEP 1: Who ══════════════════════════════════════════════ */}
            {step === 0 && (
              <motion.div key="step0" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                    <Users size={13} /> Get started
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{stepTitles[0]}</h1>
                  <p className="text-base text-muted-foreground max-w-sm mx-auto">We'll personalise results based on who you're searching for.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { value: "self", icon: <Users size={22} />, title: "For Myself", desc: "I'm looking for myself." },
                    { value: "someone-else", icon: <Users2 size={22} />, title: "For Someone Else", desc: "Booking for a friend or family." },
                  ].map((opt) => (
                    <button key={opt.value} onClick={() => updateField("searchingFor", opt.value)}
                      className={cn(
                        "relative p-6 rounded-xl border-2 text-left transition-all",
                        formData.searchingFor === opt.value ? "bg-primary/5 border-primary" : "bg-card border-border hover:border-primary/30"
                      )}>
                      <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center mb-4 transition-colors",
                        formData.searchingFor === opt.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>{opt.icon}</div>
                      <p className="text-base font-semibold text-foreground mb-1">{opt.title}</p>
                      <p className="text-sm text-muted-foreground">{opt.desc}</p>
                      {formData.searchingFor === opt.value && (
                        <div className="absolute top-4 right-4 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                          <Check size={12} className="text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-6 border-t border-border">
                  <PulseField label="Gender" icon={Users} help="Used for gender-specific accommodations.">
                    <div className="grid grid-cols-3 gap-3">
                      {["male", "female", "any"].map((g) => (
                        <button key={g} onClick={() => updateField("gender", g)}
                          className={cn("py-3 rounded-xl text-sm font-medium border-2 capitalize transition-all",
                            formData.gender === g ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/30 text-muted-foreground"
                          )}>{g}</button>
                      ))}
                    </div>
                  </PulseField>
                </div>
              </motion.div>
            )}

            {/* ══ STEP 2: Location & Type ══════════════════════════════════ */}
            {step === 1 && (
              <motion.div key="step1" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                    <MapPin size={13} /> Location
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{stepTitles[1]}</h1>
                  <p className="text-base text-muted-foreground max-w-sm mx-auto">Where would you like to live?</p>
                </div>

                <div className="space-y-6">
                  <PulseField label="Preferred locations" icon={SearchIcon} help="Type & press Enter to add.">
                    <div className="space-y-3">
                      <div className="relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                        <input type="text" placeholder="e.g. Legon, East Legon, Osu..."
                          className="w-full pl-11 pr-4 h-11 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.currentTarget.value.trim()) {
                              toggleMulti("locations", e.currentTarget.value.trim()); e.currentTarget.value = "";
                            }
                          }} />
                      </div>
                      {formData.locations.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-primary/5 border border-primary/15">
                          {formData.locations.map((loc) => (
                            <span key={loc} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-background border border-border text-sm font-medium text-foreground">
                              {loc}
                              <button onClick={() => toggleMulti("locations", loc)} className="p-0.5 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"><X size={11} /></button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {popularLocations.map((loc) => (
                          <button key={loc} onClick={() => toggleMulti("locations", loc)}
                            className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                              formData.locations.includes(loc) ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/30 text-muted-foreground"
                            )}>{loc}</button>
                        ))}
                      </div>
                    </div>
                  </PulseField>

                  <PulseField label="Accommodation type" icon={Home} help="Select all that apply.">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {propertyTypes.map((type) => {
                        const isActive = formData.categories.includes(type.value);
                        const IconComponent = iconMap[type.icon];
                        return (
                          <button key={type.value} onClick={() => toggleMulti("categories", type.value)}
                            className={cn("p-4 rounded-xl border text-left transition-all relative",
                              isActive ? "bg-primary/5 border-primary" : "bg-card border-border hover:border-primary/30"
                            )}>
                            <div className="flex items-center gap-3">
                              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                              )}>
                                {IconComponent ? <IconComponent size={20} /> : null}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={cn("font-semibold text-sm leading-tight", isActive ? "text-primary" : "text-foreground")}>{type.label}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{type.description}</p>
                              </div>
                            </div>
                            {isActive && (
                              <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                <Check size={11} className="text-primary-foreground" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </PulseField>
                </div>
              </motion.div>
            )}

            {/* ══ STEP 3: Room Type ════════════════════════════════════════ */}
            {step === 2 && (
              <motion.div key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                    <Edit3 size={13} /> Room type
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{stepTitles[2]}</h1>
                  <p className="text-base text-muted-foreground max-w-sm mx-auto">Choose specific room types within your selected categories.</p>
                </div>

                <div className="space-y-6">
                  {formData.categories.map(cat => {
                    const options = roomTypesByCategory[cat] || [];
                    if (!options.length) return null;
                    const catLabel = propertyTypes.find(p => p.value === cat)?.label || cat;
                    return (
                      <PulseField key={cat} label={`${catLabel} options`} icon={Home}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {options.map((rt) => {
                            const isActive = formData.roomTypes.includes(rt.value);
                            const IconComponent = iconMap[rt.icon];
                            return (
                              <button key={`${cat}-${rt.value}`} onClick={() => toggleMulti("roomTypes", rt.value)}
                                className={cn("p-3.5 rounded-xl border-2 text-left transition-all relative",
                                  isActive ? "bg-primary/5 border-primary" : "bg-card border-border hover:border-primary/30"
                                )}>
                                <div className="flex items-center gap-3">
                                  <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                    isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                  )}>
                                    {IconComponent ? <IconComponent size={16} /> : null}
                                  </div>
                                  <div className="min-w-0">
                                    <p className={cn("font-medium text-sm leading-tight", isActive ? "text-primary" : "text-foreground")}>{rt.label}</p>
                                    <p className="text-xs text-muted-foreground/60 mt-0.5 line-clamp-1">{rt.desc}</p>
                                  </div>
                                </div>
                                {isActive && (
                                  <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                                    <Check size={9} className="text-primary-foreground" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </PulseField>
                    );
                  })}

                  <div className="pt-4 border-t border-border">
                    <PulseField label="Other room types" icon={Plus} help="Press Enter to add.">
                      <div className="flex gap-2">
                        <input type="text" placeholder="e.g. Penthouse with private lift..."
                          className="flex-1 px-4 h-11 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.currentTarget.value.trim()) {
                              toggleMulti("customRoomTypes", e.currentTarget.value.trim()); e.currentTarget.value = "";
                            }
                          }} />
                        <Button className="h-11 w-11 rounded-xl shrink-0 p-0"><Check size={18} /></Button>
                      </div>
                      {(formData.roomTypes.length > 0 || formData.customRoomTypes.length > 0) && (
                        <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-muted/30 border border-border mt-2">
                          {formData.roomTypes.map(rt => (
                            <span key={rt} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium">
                              {rt} <button onClick={() => toggleMulti("roomTypes", rt)}><X size={11} /></button>
                            </span>
                          ))}
                          {formData.customRoomTypes.map(crt => (
                            <span key={crt} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-background border border-border text-xs font-medium text-foreground">
                              <Sparkles size={11} className="text-primary" /> {crt}
                              <button onClick={() => toggleMulti("customRoomTypes", crt)} className="hover:text-destructive transition-colors"><X size={11} /></button>
                            </span>
                          ))}
                        </div>
                      )}
                    </PulseField>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══ STEP 4: Timeline ════════════════════════════════════════ */}
            {step === 3 && (
              <motion.div key="step3" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                    <Calendar size={13} /> Timeline
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{stepTitles[3]}</h1>
                  <p className="text-base text-muted-foreground max-w-sm mx-auto">When and for how long do you need accommodation?</p>
                </div>

                <div className="space-y-6">
                  <PulseField label="Duration of stay" icon={Calendar} help="Select all that apply.">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {durations.map((opt) => {
                        const isActive = formData.durations.includes(opt.value);
                        return (
                          <button key={opt.value} onClick={() => toggleMulti("durations", opt.value)}
                            className={cn("py-3.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wide border-2 flex flex-col items-center gap-1.5 transition-all",
                              isActive ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/30 text-muted-foreground"
                            )}>
                            {isActive ? <Check size={14} /> : <div className="h-1.5 w-1.5 rounded-full bg-current opacity-30" />}
                            <span className="text-center leading-tight">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </PulseField>

                  <PulseField label="When do you need to move in?" icon={Zap} help="Helps prioritize your request.">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {urgencyOptions.map((opt) => {
                        const isActive = formData.moveInUrgencies.includes(opt.value);
                        return (
                          <button key={opt.value} onClick={() => toggleMulti("moveInUrgencies", opt.value)}
                            className={cn("p-4 rounded-xl border-2 text-left transition-all",
                              isActive ? "bg-primary/8 border-primary" : "bg-card border-border hover:border-primary/30"
                            )}>
                            <div className="flex items-center gap-3 mb-1">
                              <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                                isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                              )}>
                                <Calendar size={16} />
                              </div>
                              <div>
                                <p className={cn("font-semibold text-sm leading-tight", isActive ? "text-primary" : "text-foreground")}>{opt.label}</p>
                                {opt.urgent && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">High Priority</span>}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground pl-12 leading-snug">{opt.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </PulseField>
                </div>
              </motion.div>
            )}

            {/* ══ STEP 5: Budget ════════════════════════════════════════ */}
            {step === 4 && (
              <motion.div key="step4" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                    <Wallet size={13} /> Budget
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{stepTitles[4]}</h1>
                  <p className="text-base text-muted-foreground max-w-sm mx-auto">Set your comfortable price range. We'll filter accordingly.</p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-2xl border border-border bg-card">
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Min</p>
                        <p className="text-3xl font-bold text-foreground">GHS {formData.budget[0].toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Max</p>
                        <p className="text-3xl font-bold text-foreground">GHS {formData.budget[1].toLocaleString()}</p>
                      </div>
                    </div>
                    <Slider value={formData.budget} onValueChange={(v) => updateField("budget", v)} min={100} max={15000} step={100} className="w-full" />
                    <div className="flex justify-between text-xs text-muted-foreground/50 mt-3">
                      <span>GHS 100</span><span>GHS 15,000</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Quick select</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { label: "Economy", range: [100, 1000] }, { label: "Standard", range: [1000, 3000] },
                        { label: "Premium", range: [3000, 7000] }, { label: "Luxury", range: [7000, 15000] },
                      ].map((preset) => (
                        <button key={preset.label} onClick={() => updateField("budget", preset.range)}
                          className={cn("py-2.5 rounded-xl text-sm font-semibold border-2 transition-all",
                            formData.budget[0] === preset.range[0] && formData.budget[1] === preset.range[1]
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card border-border hover:border-primary/30 text-muted-foreground"
                          )}>{preset.label}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══ STEP 6: Preferences ════════════════════════════════════ */}
            {step === 5 && (
              <motion.div key="step5" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                    <Sparkles size={13} /> Preferences
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{stepTitles[5]}</h1>
                  <p className="text-base text-muted-foreground max-w-sm mx-auto">Tell us what matters most to you.</p>
                </div>

                <div className="space-y-6">
                  {isHostelIntent && (
                    <div className="space-y-5 p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900">
                      <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-amber-500" /> Student & hostel preferences
                      </p>
                      <PulseField label="Nearest campus" icon={GraduationCap}>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {["KNUST", "UG Legon", "UCC", "GIMPA", "Ashesi", "UHAS", "UEW", "UMaT"].map(campus => (
                            <button key={campus} onClick={() => updateField("nearestCampus", formData.nearestCampus === campus ? "" : campus)}
                              className={cn("py-2.5 rounded-xl text-xs font-semibold border-2 transition-all",
                                formData.nearestCampus === campus
                                  ? "bg-amber-500 text-white border-amber-500"
                                  : "bg-white dark:bg-card border-border hover:border-amber-400 text-muted-foreground"
                              )}>{campus}</button>
                          ))}
                        </div>
                      </PulseField>
                      <PulseField label="Distance to campus" icon={MapPin}>
                        <div className="grid grid-cols-3 gap-2">
                          {[{ value: "any", label: "Any", icon: "🏠" }, { value: "walking", label: "Walking", icon: "🚶" }, { value: "trotro", label: "Trotro", icon: "🚌" }].map(opt => (
                            <button key={opt.value} onClick={() => updateField("minCampusProximity", opt.value)}
                              className={cn("p-3 rounded-xl border-2 text-center transition-all",
                                formData.minCampusProximity === opt.value ? "bg-amber-500/10 border-amber-500" : "bg-white dark:bg-card border-border hover:border-amber-400"
                              )}>
                              <div className="text-xl mb-1">{opt.icon}</div>
                              <div className={cn("text-xs font-semibold", formData.minCampusProximity === opt.value ? "text-amber-600" : "text-muted-foreground")}>{opt.label}</div>
                            </button>
                          ))}
                        </div>
                      </PulseField>
                      <div className="space-y-2">
                        <ToggleCard field="cookingRequired" formData={formData} updateField={updateField} label="Cooking Permitted" desc="Property must allow indoor/outdoor cooking." icon={Utensils} />
                        <ToggleCard field="childrenAllowedRequired" formData={formData} updateField={updateField} label="Child Friendly" desc="Environment suitable for young children." icon={Users} />
                      </div>
                    </div>
                  )}

                  {isHotelIntent && (
                    <div className="space-y-3 p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900">
                      <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-500" /> Hotel & short-stay preferences
                      </p>
                      <ToggleCard field="breakfastRequired" formData={formData} updateField={updateField} label="Breakfast Inclusive" desc="Continental or local breakfast served." icon={Utensils} />
                      <ToggleCard field="acRequired" formData={formData} updateField={updateField} label="Air Conditioning" desc="Guaranteed functional AC." icon={Wind} />
                      <ToggleCard field="parkingRequired" formData={formData} updateField={updateField} label="Parking" desc="On-site parking for guests." icon={Car} />
                      <ToggleCard field="cookingRequired" formData={formData} updateField={updateField} label="Self-Catering" desc="Kitchenette or shared kitchen access." icon={Timer} />
                    </div>
                  )}

                  {isLongTermIntent && (
                    <div className="space-y-5 p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900">
                      <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Home className="h-4 w-4 text-emerald-500" /> Residential preferences
                      </p>
                      <PulseField label="Max rent advance" icon={Wallet} help="Ghana standard: 1–2 years.">
                        <div className="space-y-2 px-1">
                          <Slider value={[formData.maxAdvanceMonths]} onValueChange={val => updateField("maxAdvanceMonths", val[0])} min={0} max={24} step={6} className="py-2" />
                          <div className="flex justify-between text-xs text-muted-foreground/60">
                            <span>{formData.maxAdvanceMonths === 0 ? "Monthly" : formData.maxAdvanceMonths === 24 ? "2 years+" : `${formData.maxAdvanceMonths} months`}</span>
                            <span>Max advance</span>
                          </div>
                        </div>
                      </PulseField>
                      <PulseField label="Furnishing" icon={LayoutTemplate}>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[{ value: "any", label: "Any" }, { value: "furnished", label: "Furnished" }, { value: "semi-furnished", label: "Semi" }, { value: "unfurnished", label: "Unfurnished" }].map(opt => (
                            <button key={opt.value} onClick={() => updateField("preferredFurnishedStatus", opt.value)}
                              className={cn("py-3 rounded-xl text-xs font-semibold border-2 transition-all",
                                formData.preferredFurnishedStatus === opt.value
                                  ? "bg-emerald-500 text-white border-emerald-500"
                                  : "bg-white dark:bg-card border-border hover:border-emerald-400 text-muted-foreground"
                              )}>{opt.label}</button>
                          ))}
                        </div>
                      </PulseField>
                      <div className="space-y-2">
                        <ToggleCard field="momoPaymentRequired" formData={formData} updateField={updateField} label="MoMo Payment" desc="Landlord accepts MTN/Vodafone Mobile Money." icon={Smartphone} />
                        <ToggleCard field="negotiableRequired" formData={formData} updateField={updateField} label="Negotiable Price" desc="Price or advance period is flexible." icon={CheckCircle2} />
                        <ToggleCard field="acRequired" formData={formData} updateField={updateField} label="Air Conditioning" desc="Functional AC in living/bedroom." icon={Wind} />
                        <ToggleCard field="parkingRequired" formData={formData} updateField={updateField} label="Parking" desc="Dedicated vehicle parking space." icon={Car} />
                      </div>
                    </div>
                  )}

                  {!isHostelIntent && !isHotelIntent && !isLongTermIntent && (
                    <div className="text-center py-12 px-6 rounded-2xl border border-dashed border-border bg-muted/20">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <Home size={18} className="text-muted-foreground/40" />
                      </div>
                      <p className="text-base font-semibold text-foreground mb-1">No extra preferences needed</p>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">Based on your selection, no specialised questions are needed here.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ══ STEP 7: Utilities ════════════════════════════════════════ */}
            {step === 6 && (
              <motion.div key="step6" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                    <Shield size={13} /> Utilities
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{stepTitles[6]}</h1>
                  <p className="text-base text-muted-foreground max-w-sm mx-auto">Power, water, and utility preferences.</p>
                </div>

                <div className="space-y-6">
                  <PulseField label="Backup power" icon={Zap}>
                    <div className="grid grid-cols-3 gap-2">
                      {[{ value: "any", label: "Any", icon: "🔌" }, { value: "Generator", label: "Generator", icon: "🏭" }, { value: "Solar", label: "Solar / Inverter", icon: "☀️" }].map(opt => (
                        <button key={opt.value} onClick={() => updateField("preferredBackupPower", opt.value)}
                          className={cn("py-4 rounded-xl text-xs font-semibold border-2 flex flex-col items-center gap-1.5 transition-all",
                            formData.preferredBackupPower === opt.value ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/30 text-muted-foreground"
                          )}>
                          <span className="text-lg">{opt.icon}</span>{opt.label}
                        </button>
                      ))}
                    </div>
                  </PulseField>

                  <PulseField label="Water reliability" icon={Droplets}>
                    <div className="grid grid-cols-3 gap-2">
                      {[{ value: "any", label: "Any", icon: "🚰" }, { value: "Regular", label: "Regular", icon: "💧" }, { value: "Constant", label: "Constant", icon: "🌊" }].map(opt => (
                        <button key={opt.value} onClick={() => updateField("preferredWaterReliability", opt.value)}
                          className={cn("py-4 rounded-xl text-xs font-semibold border-2 flex flex-col items-center gap-1.5 transition-all",
                            formData.preferredWaterReliability === opt.value ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/30 text-muted-foreground"
                          )}>
                          <span className="text-lg">{opt.icon}</span>{opt.label}
                        </button>
                      ))}
                    </div>
                  </PulseField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <PulseField label="Utility metering" icon={Gauge}>
                      <div className="grid grid-cols-2 gap-2">
                        {[{ v: "Shared", l: "Shared" }, { v: "Private", l: "Private" }].map(m => (
                          <button key={m.v} onClick={() => updateField("preferredUtilityMetering", m.v)}
                            className={cn("py-3 rounded-xl border-2 text-sm font-semibold transition-all",
                              formData.preferredUtilityMetering === m.v ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/30 text-muted-foreground"
                            )}>{m.l}</button>
                        ))}
                      </div>
                    </PulseField>
                    <PulseField label="Road access" icon={Map}>
                      <div className="grid grid-cols-2 gap-2">
                        {[{ v: "Tarred", l: "Tarred" }, { v: "Paved", l: "Paved" }].map(r => (
                          <button key={r.v} onClick={() => updateField("preferredRoadAccess", r.v)}
                            className={cn("py-3 rounded-xl border-2 text-sm font-semibold transition-all",
                              formData.preferredRoadAccess === r.v ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/30 text-muted-foreground"
                            )}>{r.l}</button>
                        ))}
                      </div>
                    </PulseField>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border">
                    <ToggleCard field="verificationRequired" formData={formData} updateField={updateField} label="Verified Properties Only" desc="Only listings inspected by ReservEase." icon={ShieldCheck} />
                    <ToggleCard field="isInclusiveRequired" formData={formData} updateField={updateField} label="Inclusive Utilities" desc="Rent covers water and shared electricity." icon={Droplet} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══ STEP 8: Final details ════════════════════════════════════ */}
            {step === 7 && (
              <motion.div key="step7" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                    <CheckCircle2 size={13} /> Almost done
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{stepTitles[7]}</h1>
                  <p className="text-base text-muted-foreground max-w-sm mx-auto">Select must-have amenities and add any special requests.</p>
                </div>

                <div className="space-y-6">
                  <PulseField label="Must-have amenities" icon={Zap} help="Only select what's essential.">
                    <div className="flex flex-wrap gap-2">
                      {facilitiesList.map((facility) => {
                        const isActive = formData.facilities.includes(facility.value);
                        return (
                          <button key={facility.value} onClick={() => toggleMulti("facilities", facility.value)}
                            className={cn("px-3.5 py-2 rounded-xl text-xs font-semibold border-2 flex items-center gap-1.5 transition-all",
                              isActive ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary/30 text-muted-foreground"
                            )}>
                            {isActive ? <Check size={11} /> : <Plus size={11} className="opacity-40" />}
                            {facility.label}
                          </button>
                        );
                      })}
                    </div>
                  </PulseField>

                  <PulseField label="Notes for our team" icon={Target} help="Any special requests.">
                    <Textarea placeholder="E.g., quiet location, near transport, reliable water, close to work..."
                      value={formData.notes} onChange={(e) => updateField("notes", e.target.value)}
                      className="min-h-[120px] resize-none text-sm p-4 rounded-xl border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40" />
                    <p className="text-xs text-muted-foreground/60">Add any specific requests for our team</p>
                  </PulseField>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* ── BOTTOM BAR: primary colour button, cleaner layout ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-3 pb-1 flex items-center gap-3">
          {step > 0 ? (
            <Button variant="outline" onClick={handleBack}
              className="h-11 px-5 rounded-xl font-semibold border-2 hover:bg-muted shrink-0">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          ) : <div />}

          {/* FIX: button is now always primary-coloured when active, clear grey when disabled */}
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className={cn(
              "flex-1 h-11 rounded-xl font-semibold text-sm transition-all",
              canProceed() && !isSubmitting
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing…</>
            ) : step === TOTAL_STEPS - 1 ? (
              isRefinementMode ? "Search with updated preferences" : "Find My Accommodation"
            ) : (
              <span className="flex items-center gap-1.5 justify-center">
                Next Step <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// SelectCard helper (unchanged from original)
function SelectCard({ selected, onClick, icon, title, description }: {
  selected: boolean; onClick: () => void; icon: React.ReactNode; title: string; description: string;
}) {
  return (
    <button onClick={onClick}
      className={cn("p-5 rounded-xl border text-left transition-all relative overflow-hidden",
        selected ? "border-primary bg-primary/5" : "border-border/60 bg-card hover:border-primary/40"
      )}>
      {selected && (
        <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      <div className={cn("mb-4 inline-flex p-3 rounded-xl", selected ? "bg-primary/10" : "bg-muted")}>{icon}</div>
      <div className="space-y-1">
        <span className="font-semibold text-base text-foreground block">{title}</span>
        <p className="text-sm text-muted-foreground pr-4 leading-relaxed">{description}</p>
      </div>
    </button>
  );
}