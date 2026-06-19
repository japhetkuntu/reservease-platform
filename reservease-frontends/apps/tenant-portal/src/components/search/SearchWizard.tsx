import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  RefreshCw,
  Loader2,
  Home,
  MapPin,
  Search as SearchIcon,
  Users,
  Calendar,
  Wallet,
  CheckCircle2,
  Sparkles,
  Wifi,
  Car,
  Bus,
  TreePine,
  GraduationCap,
  Utensils,
  Zap,
  ShieldCheck,
  ChevronRight,
  Info,
  Clock,
  Edit3,
  BadgeCheck,
  Smartphone,
  Users2,
  Building2,
  Wind,
  Timer,
  LayoutTemplate,
  Droplets,
  Droplet,
  Plus,
  Target,
  Shield,
  Gauge,
  Map,
  Building,
  DoorOpen,
  Bed,
  Crown,
  Briefcase,
  Heart
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

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, React.ComponentType<any>> = {
  Building2,
  Home,
  Building,
  DoorOpen,
  Users,
  Bed,
  Sparkles,
  Crown,
  Briefcase,
  Users2,
  Heart,
  Wifi,
  Zap,
  Shield,
  Car,
  Bus,
};

const TOTAL_STEPS = 8;

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
  { value: "wifi", label: "Free WiFi" },
  { value: "ac", label: "Air Conditioning" },
  { value: "generator", label: "Backup Generator" },
  { value: "parking", label: "Free Parking" },
  { value: "pool", label: "Swimming Pool" },
  { value: "kitchen", label: "Kitchen Access" },
  { value: "laundry", label: "Laundry Service" },
  { value: "security", label: "24/7 Security" },
  { value: "breakfast", label: "Breakfast Included" },
  { value: "furnished", label: "Fully Furnished" },
];

const popularLocations = [
  "Near KNUST", "Legon / East Legon", "Ashesi / Berekuso", "Near UCC",
  "Accra Central", "Osu", "Kumasi", "Tema / Community", "Cape Coast", "Takoradi"
];

// Context-aware room type options per category
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

function PulseBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      <div className="absolute top-[40%] left-[20%] w-[20%] h-[20%] bg-primary/10 rounded-full blur-[100px] animate-pulse delay-500" />
    </div>
  );
}

function ToggleCard({
  label,
  desc,
  icon: Icon,
  field,
  formData,
  updateField
}: {
  label: string;
  desc: string;
  icon: any;
  field: string;
  formData: any;
  updateField: (f: string, v: any) => void;
}) {
  const value = !!formData[field];
  return (
    <button
      onClick={() => updateField(field, !value)}
      className={cn(
        "p-4 rounded-xl border text-left transition-all flex items-center justify-between group relative overflow-hidden",
        value ? "bg-primary/10 border-primary" : "bg-card border-border/50 hover:border-primary/30"
      )}
    >
      <div className="flex items-center gap-4 relative z-10">
        <div className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
          value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
           {typeof Icon === 'function' ? <Icon className="w-5 h-5" /> : Icon}
        </div>
        <div>
          <p className="font-semibold text-sm leading-tight">{label}</p>
          <p className="text-xs text-muted-foreground/70 leading-tight mt-0.5">{desc}</p>
        </div>
      </div>
      <Switch checked={value} onCheckedChange={(v) => updateField(field, v)} className="data-[state=checked]:bg-primary relative z-10" />
    </button>
  );
}

function PulseField({ label, icon: Icon, help, children }: { label: string; icon: any; help?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
           <Icon size={13} className="opacity-60" /> {label}
        </Label>
        {help && (
            <span className="text-xs text-muted-foreground/50">{help}</span>
        )}
      </div>
      {children}
    </div>
  );
}

interface SearchWizardProps {
  onClose?: () => void;
}

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
        // Pulse Fields
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
      preferredBackupPower: "any",
      preferredWaterReliability: "any",
      preferredUtilityMetering: "any",
      preferredRoadAccess: "any",
      maxAdvanceMonths: 12,
      maxSecurityDeposit: 0,
      preferredBathroomType: "any",
      verificationRequired: false,
      isInclusiveRequired: false,
      preferredTransportAccess: [] as string[],
      preferredCompoundType: "any",
      preferredInternetType: "any",
      momoPaymentRequired: false,
      negotiableRequired: false,
      cookingRequired: false,
      childrenAllowedRequired: false,
      minCampusProximity: "any",
      nearestCampus: "",
      breakfastRequired: false,
      acRequired: false,
      parkingRequired: false,
      preferredFurnishedStatus: "any",
    };
  });

  useEffect(() => {
    const forParam = searchParams.get("for");
    if ((forParam === "other" || forParam === "others") && formData.searchingFor !== "someone-else") {
      setFormData(prev => ({ ...prev, searchingFor: "someone-else" }));
    } else if (forParam === "self" && formData.searchingFor !== "self") {
      setFormData(prev => ({ ...prev, searchingFor: "self" }));
    }
  }, [searchParams, formData.searchingFor]);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMulti = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => {
      const current = prev[field] as string[];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [field]: next };
    });
  };

  const getBudgetLabel = () => {
    const d = formData.durations;
    if (d.includes("nightly")) return "Per Night";
    if (d.includes("monthly")) return "Per Month";
    if (d.includes("1-year")) return "Per Year";
    return "Total Budget";
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
          if (createdRequest.status === "processing" || createdRequest.discountApplied) {
            navigate(`/request/${createdRequest.id}`);
          } else {
            navigate(`/checkout/${createdRequest.id}`);
          }
        }
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Request Failed",
          description: err.message || "An unexpected error occurred.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (isRefinementMode && refineRequestId) {
      navigate(`/request/${refineRequestId}`);
    } else if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };

  const stepTitles = [
    "Who is this search for?",
    "Where do you want to live?",
    "What type of room?",
    "When do you need it?",
    "What's your budget?",
    "Your preferences",
    "Utilities & infrastructure",
    "Final details",
  ];

  const isHostelIntent = formData.categories.some(t => ["hostel", "student", "dorm", "campus", "bed-space"].includes(t));
  const isHotelIntent = formData.categories.some(t => ["hotel-room", "guest-house", "short-stay", "airbnb", "lodge", "guesthouse", "motel"].includes(t));
  const isLongTermIntent = formData.categories.some(t => ["apartment", "self-contain", "flat", "studio", "villa", "house", "bungalow", "penthouse", "homestay"].includes(t));

  const uniqueRoomTypes = useMemo(() => {
    const types = formData.categories.flatMap(cat => roomTypesByCategory[cat] || []);
    return types.filter((rt, idx, arr) => arr.findIndex(r => r.value === rt.value) === idx);
  }, [formData.categories]);

  const ToggleSwitch = ({ field, label, description, icon }: { field: string; label: string; description: string; icon: React.ReactNode }) => {
    const value = formData[field as keyof typeof formData] as boolean;
    return (
      <div
        onClick={() => updateField(field, !value)}
        className={cn(
          "p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4",
          value ? "bg-primary/5 border-primary" : "bg-card border-border/60 hover:border-primary/30"
        )}>
        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center shrink-0", value ? "bg-primary/20" : "bg-muted")}>
          <span className={cn(value ? "text-primary" : "text-muted-foreground/50")}>{icon}</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className={cn("w-12 h-6 rounded-full relative transition-colors shrink-0", value ? "bg-primary" : "bg-muted")}>
          <motion.div animate={{ x: value ? 24 : 2 }} className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container h-14 flex items-center justify-between px-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <div className="flex-1 flex flex-col items-center px-4">
            <div className="flex items-center gap-1 mb-1">
               {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                 <div
                   key={i}
                   className={cn(
                     "h-1.5 rounded-full transition-all duration-500",
                     i === step ? "w-8 bg-primary" : i < step ? "w-3 bg-primary/40" : "w-1.5 bg-muted"
                   )}
                 />
               ))}
            </div>
            <span className="text-xs text-muted-foreground/60">
               Step {step + 1} of {TOTAL_STEPS}
            </span>
          </div>

          <button onClick={onClose} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
            <X size={18} />
          </button>
        </div>
      </header>

      {isRefinementMode && existingRequest && (
        <div className="bg-primary/5 border-b border-primary/20">
          <div className="container py-2.5 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <RefreshCw className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Refining your search</p>
              <p className="text-xs text-muted-foreground">
                {existingRequest.retriesRemaining} free refinement{existingRequest.retriesRemaining !== 1 ? 's' : ''} remaining
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 container py-6 pb-28 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {/* STEP 1: Who */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <Users size={14} />
                  <span className="text-xs font-medium">Get started</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight">
                  {stepTitles[0]}
                </h1>
                <p className="text-base text-muted-foreground max-w-md mx-auto">
                  We'll personalize results based on who you're searching for.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => updateField("searchingFor", "self")}
                  className={cn(
                    "relative group p-6 rounded-xl border-2 text-left transition-all overflow-hidden",
                    formData.searchingFor === "self" ? "bg-primary/5 border-primary" : "bg-card border-border/50 hover:border-primary/30"
                  )}
                >
                  <div className={cn(
                    "h-12 w-12 rounded-lg flex items-center justify-center mb-4 transition-all",
                    formData.searchingFor === "self" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    <Users size={24} />
                  </div>
                  <h3 className="text-base font-semibold mb-1">For Myself</h3>
                  <p className="text-sm text-muted-foreground">I'm looking for myself.</p>
                  {formData.searchingFor === "self" && (
                    <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <Check size={14} className="text-primary-foreground" />
                    </div>
                  )}
                </button>

                <button
                  onClick={() => updateField("searchingFor", "someone-else")}
                  className={cn(
                    "relative group p-6 rounded-xl border-2 text-left transition-all overflow-hidden",
                    formData.searchingFor === "someone-else" ? "bg-primary/5 border-primary" : "bg-card border-border/50 hover:border-primary/30"
                  )}
                >
                  <div className={cn(
                    "h-12 w-12 rounded-lg flex items-center justify-center mb-4 transition-all",
                    formData.searchingFor === "someone-else" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    <Users2 size={24} />
                  </div>
                  <h3 className="text-base font-semibold mb-1">For Someone Else</h3>
                  <p className="text-sm text-muted-foreground">Booking for a friend or family.</p>
                  {formData.searchingFor === "someone-else" && (
                    <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <Check size={14} className="text-primary-foreground" />
                    </div>
                  )}
                </button>
              </div>

              <div className="space-y-6 pt-8 border-t border-border/50">
                <PulseField label="Gender" icon={Users} help="Used for gender-specific accommodations.">
                   <div className="grid grid-cols-3 gap-3">
                      {["male", "female", "any"].map((gender) => (
                        <button
                          key={gender}
                          onClick={() => updateField("gender", gender)}
                          className={cn(
                            "py-3 px-4 rounded-lg text-sm font-medium transition-all border-2 capitalize",
                            formData.gender === gender
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card border-border/50 hover:border-primary/30 text-muted-foreground"
                          )}
                        >
                          {gender}
                        </button>
                      ))}
                   </div>
                </PulseField>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Location & Property Type */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <MapPin size={14} />
                  <span className="text-xs font-medium">Location</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight">
                  {stepTitles[1]}
                </h1>
                <p className="text-base text-muted-foreground max-w-md mx-auto">
                  Where would you like to live?
                </p>
              </div>

              <div className="space-y-6">
                <PulseField label="Preferred locations" icon={SearchIcon} help="Type a location and press Enter.">
                  <div className="space-y-4">
                    <div className="relative group">
                      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                      <input
                        type="text"
                        placeholder="e.g. Legon, East Legon, Osu..."
                        className="w-full pl-12 pr-4 h-12 rounded-lg border border-border/60 bg-background text-foreground font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && e.currentTarget.value.trim()) {
                            toggleMulti("locations", e.currentTarget.value.trim());
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                    </div>

                    {formData.locations.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-4 rounded-lg bg-primary/5 border border-primary/10">
                        {formData.locations.map((loc) => (
                          <span
                            key={loc}
                            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-background border border-border/50 text-sm font-medium text-foreground"
                          >
                            {loc}
                            <button
                              onClick={() => toggleMulti("locations", loc)}
                              className="p-0.5 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                       {popularLocations.map((loc) => {
                         const isActive = formData.locations.includes(loc);
                         return (
                           <button
                             key={loc}
                             onClick={() => toggleMulti("locations", loc)}
                             className={cn(
                               "px-3 py-1.5 rounded-lg text-sm font-medium transition-all border",
                               isActive
                                 ? "bg-primary text-primary-foreground border-primary"
                                 : "bg-card border-border/50 hover:border-primary/30 text-muted-foreground"
                             )}
                           >
                             {loc}
                           </button>
                         );
                       })}
                    </div>
                  </div>
                </PulseField>

                <PulseField label="Accommodation type" icon={Home} help="You can select multiple.">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {propertyTypes.map((type) => {
                        const isActive = formData.categories.includes(type.value);
                        const IconComponent = iconMap[type.icon];
                        return (
                          <button
                            key={type.value}
                            onClick={() => toggleMulti("categories", type.value)}
                            className={cn(
                              "p-5 rounded-xl border text-left transition-all relative group overflow-hidden",
                              isActive
                                ? "bg-primary/5 border-primary"
                                : "bg-card border-border/50 hover:border-primary/30"
                            )}
                          >
                            <div className="flex items-start gap-4">
                               <div className={cn(
                                 "h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                 isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                               )}>
                                 {IconComponent ? <IconComponent size={24} /> : null}
                               </div>
                               <div className="flex-1 min-w-0">
                                  <h3 className={cn("font-semibold leading-tight mb-1", isActive ? "text-primary" : "text-foreground")}>{type.label}</h3>
                                  <p className="text-xs text-muted-foreground/70 leading-relaxed line-clamp-2">{type.description}</p>
                               </div>
                            </div>
                            {isActive && (
                               <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                 <Check size={14} className="text-primary-foreground" />
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

          {/* STEP 3: Room Type Selection */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
               <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <Edit3 size={14} />
                  <span className="text-xs font-medium">Room type</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight">
                  {stepTitles[2]}
                </h1>
                <p className="text-base text-muted-foreground max-w-md mx-auto">
                  Choose specific room types within your selected categories.
                </p>
              </div>

              <div className="space-y-8">
                 {formData.categories.map(cat => {
                    const options = roomTypesByCategory[cat] || [];
                    if (options.length === 0) return null;
                    const catLabel = propertyTypes.find(p => p.value === cat)?.label || cat;
                    return (
                      <PulseField key={cat} label={`${catLabel} options`} icon={Home}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                           {options.map((rt) => {
                             const isActive = formData.roomTypes.includes(rt.value);
                             const IconComponent = iconMap[rt.icon];
                             return (
                               <button
                                 key={`${cat}-${rt.value}`}
                                 onClick={() => toggleMulti("roomTypes", rt.value)}
                                 className={cn(
                                   "p-4 rounded-lg border-2 text-left transition-all group relative",
                                   isActive
                                     ? "bg-primary/5 border-primary"
                                     : "bg-card border-border/50 hover:border-primary/30"
                                 )}
                               >
                                  <div className="flex items-center gap-3">
                                     <div className={cn(
                                       "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 transition-all",
                                       isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                     )}>
                                       {IconComponent ? <IconComponent size={18} /> : null}
                                     </div>
                                     <div className="min-w-0">
                                        <p className={cn("font-medium leading-tight text-sm", isActive ? "text-primary" : "text-foreground")}>{rt.label}</p>
                                        <p className="text-xs text-muted-foreground/60 mt-0.5 line-clamp-1">{rt.desc}</p>
                                     </div>
                                  </div>
                                  {isActive && (
                                     <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                       <Check size={10} className="text-primary-foreground" />
                                     </div>
                                  )}
                               </button>
                             );
                           })}
                        </div>
                      </PulseField>
                    );
                 })}

                 <div className="pt-8 border-t border-border space-y-4">
                    <PulseField label="Other room types" icon={Plus} help="Press Enter to add.">
                       <div className="flex gap-3">
                          <input
                            type="text"
                            placeholder="e.g. Penthouse with private lift, Attic studio..."
                            className="flex-1 px-4 h-12 rounded-lg border border-border/60 bg-background text-foreground font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                                toggleMulti("customRoomTypes", e.currentTarget.value.trim());
                                e.currentTarget.value = "";
                              }
                            }}
                          />
                          <Button className="h-12 w-12 rounded-lg shrink-0">
                             <Check size={24} />
                          </Button>
                       </div>

                       {(formData.roomTypes.length > 0 || formData.customRoomTypes.length > 0) && (
                          <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-muted/30 border border-border/50 animate-in fade-in duration-300">
                             {formData.roomTypes.map(rt => (
                               <span key={rt} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium border border-primary/30">
                                 {rt}
                                 <button onClick={() => toggleMulti("roomTypes", rt)} className="hover:scale-125 transition-transform"><X size={12} /></button>
                               </span>
                             ))}
                             {formData.customRoomTypes.map(crt => (
                               <span key={crt} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background border border-border/50 text-xs font-medium text-foreground group/tag">
                                 <Sparkles size={12} className="text-primary" />
                                 {crt}
                                 <button onClick={() => toggleMulti("customRoomTypes", crt)} className="hover:text-destructive hover:scale-125 transition-all"><X size={12} /></button>
                               </span>
                             ))}
                          </div>
                       )}
                    </PulseField>
                 </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Duration */}
          {step === 3 && (
            <motion.div
              key="step4-duration"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <Calendar size={14} />
                  <span className="text-xs font-medium">Timeline</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight">
                  {stepTitles[3]}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-md mx-auto">
                  When and for how long do you need accommodation?
                </p>
              </div>

              <div className="space-y-8">
                <PulseField label="Duration of stay" icon={Calendar} help="Select all that apply.">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {durations.map((option) => {
                      const isActive = formData.durations.includes(option.value);
                      return (
                        <button
                          key={option.value}
                          onClick={() => toggleMulti("durations", option.value)}
                          className={cn(
                            "py-4 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border-2 flex flex-col items-center justify-center gap-2 text-center",
                            isActive
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card border-border/50 hover:border-primary/30 text-muted-foreground"
                          )}
                        >
                          {isActive ? <Check size={16} /> : <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />}
                          <span>{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </PulseField>

                <PulseField label="When do you need to move in?" icon={Zap} help="Helps us prioritize your request.">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {urgencyOptions.map((option) => {
                       const isActive = formData.moveInUrgencies.includes(option.value);
                       return (
                        <button
                          key={option.value}
                          onClick={() => toggleMulti("moveInUrgencies", option.value)}
                          className={cn(
                            "p-4 rounded-lg border text-left transition-colors duration-200",
                            isActive
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-muted/10 border-border text-muted-foreground hover:border-primary"
                          )}
                        >
                          <div className="flex items-center gap-3">
                             <div className={cn(
                               "h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                               isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                             )}>
                               <Calendar size={18} />
                             </div>
                             <div>
                                <h3 className={cn("font-medium leading-none", isActive ? "text-primary" : "text-foreground")}>{option.label}</h3>
                                {option.urgent && (
                                   <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded bg-destructive/10 text-destructive">
                                     High Priority
                                   </span>
                                )}
                             </div>
                          </div>
                          <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{option.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </PulseField>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Budget */}
          {step === 4 && (
            <motion.div
              key="step5-budget"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <Wallet size={14} />
                  <span className="text-xs font-medium">Budget</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight">
                  {stepTitles[4]}
                </h1>
                <p className="text-base text-muted-foreground max-w-md mx-auto">
                  Set your comfortable price range. We'll filter accordingly.
                </p>
              </div>

              <div className="space-y-8">
                <div className="p-5 rounded-xl border border-border/50 bg-card">
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div>
                  <p className="text-xs font-semibold text-muted-foreground/70 mb-1">Min</p>
                      <p className="text-3xl font-bold text-foreground">GHS {formData.budget[0].toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                  <p className="text-xs font-semibold text-muted-foreground/70 mb-1">Max</p>
                      <p className="text-3xl font-bold text-foreground">GHS {formData.budget[1].toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Slider
                      value={formData.budget}
                      onValueChange={(value) => updateField("budget", value)}
                      min={100}
                      max={15000}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground/50">
                      <span>GHS 100</span>
                      <span>GHS 15,000</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-semibold text-muted-foreground/70 mb-2">Quick select</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Economy", range: [100, 1000] },
                      { label: "Standard", range: [1000, 3000] },
                      { label: "Premium", range: [3000, 7000] },
                      { label: "Luxury", range: [7000, 15000] },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => updateField("budget", preset.range)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                          formData.budget[0] === preset.range[0] &&
                            formData.budget[1] === preset.range[1]
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border/50 hover:border-primary/30 text-muted-foreground"
                        )}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 6: Smart Questions */}
          {step === 5 && (
            <motion.div
              key="step6-smart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <Sparkles size={14} />
                  <span className="text-xs font-medium">Preferences</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight">
                  {stepTitles[5]}
                </h1>
                <p className="text-base text-muted-foreground max-w-md mx-auto">
                  Tell us what matters most to you.
                </p>
              </div>

              <div className="space-y-8">
                {isHostelIntent && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-amber-500" /> Student & hostel preferences
                    </p>

                    <PulseField label="Nearest campus" icon={GraduationCap}>
                       <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {["KNUST", "UG Legon", "UCC", "GIMPA", "Ashesi", "UHAS", "UEW", "UMaT"].map(campus => (
                            <button
                              key={campus}
                              onClick={() => updateField("nearestCampus", formData.nearestCampus === campus ? "" : campus)}
                              className={cn(
                                "py-2.5 rounded-lg text-sm font-medium border-2 transition-all",
                                formData.nearestCampus === campus
                                  ? "bg-amber-500 text-white border-amber-500"
                                  : "bg-card border-border/50 hover:border-amber-500/30 text-muted-foreground"
                              )}
                            >{campus}</button>
                          ))}
                       </div>
                    </PulseField>

                    <PulseField label="Distance to campus" icon={MapPin}>
                       <div className="grid grid-cols-3 gap-3">
                          {[
                            { value: "any", label: "Any", icon: "🏠" },
                            { value: "walking", label: "Walking", icon: "🚶" },
                            { value: "trotro", label: "Trotro", icon: "🚌" },
                          ].map(opt => (
                            <button key={opt.value}
                              onClick={() => updateField("minCampusProximity", opt.value)}
                              className={cn(
                                "p-3 rounded-xl border-2 text-center transition-all",
                                formData.minCampusProximity === opt.value
                                  ? "bg-amber-500/10 border-amber-500"
                                  : "bg-card border-border/50 hover:border-amber-500/30"
                              )}>
                              <div className="text-xl mb-1">{opt.icon}</div>
                              <div className={cn("text-xs font-medium", formData.minCampusProximity === opt.value ? "text-amber-600" : "text-muted-foreground")}>{opt.label}</div>
                            </button>
                          ))}
                       </div>
                    </PulseField>

                    <div className="space-y-3">
                      <ToggleCard field="cookingRequired" formData={formData} updateField={updateField} label="Cooking Permitted" desc="Property must allow indoor/outdoor cooking." icon={<Utensils size={18} />} />
                      <ToggleCard field="childrenAllowedRequired" formData={formData} updateField={updateField} label="Child Friendly" desc="Environment suitable for young children." icon={<Users size={18} />} />
                    </div>
                  </div>
                )}

                {isHotelIntent && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-500" /> Hotel & short-stay preferences
                    </p>
                    <div className="space-y-3">
                      <ToggleCard field="breakfastRequired" formData={formData} updateField={updateField} label="Breakfast Inclusive" desc="Continental or local breakfast served." icon={<Utensils size={18} color="#3b82f6" />} />
                      <ToggleCard field="acRequired" formData={formData} updateField={updateField} label="Air Conditioning" desc="Guaranteed functional AC." icon={<Wind size={18} color="#3b82f6" />} />
                      <ToggleCard field="parkingRequired" formData={formData} updateField={updateField} label="Parking" desc="On-site parking for guests." icon={<Car size={18} color="#3b82f6" />} />
                      <ToggleCard field="cookingRequired" formData={formData} updateField={updateField} label="Self-Catering" desc="Kitchenette or shared kitchen access." icon={<Timer size={18} color="#3b82f6" />} />
                    </div>
                  </div>
                )}

                {isLongTermIntent && (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Home className="h-4 w-4 text-emerald-500" /> Residential preferences
                    </p>

                    <PulseField label="Max rent advance" icon={Wallet} help="Ghana standard: 1–2 years.">
                      <div className="space-y-3 px-1">
                        <Slider value={[formData.maxAdvanceMonths]} onValueChange={val => updateField("maxAdvanceMonths", val[0])} min={0} max={24} step={6} className="py-2" />
                        <div className="flex justify-between text-xs text-muted-foreground/60">
                          <span>{formData.maxAdvanceMonths === 0 ? "Monthly" : formData.maxAdvanceMonths === 24 ? "2 years+" : `${formData.maxAdvanceMonths} months`}</span>
                          <span>Max advance</span>
                        </div>
                      </div>
                    </PulseField>

                    <PulseField label="Furnishing" icon={LayoutTemplate}>
                       <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { value: "any", label: "Any" },
                          { value: "furnished", label: "Furnished" },
                          { value: "semi-furnished", label: "Semi" },
                          { value: "unfurnished", label: "Unfurnished" },
                        ].map(opt => (
                          <button key={opt.value}
                            onClick={() => updateField("preferredFurnishedStatus", opt.value)}
                            className={cn(
                              "py-3 rounded-lg text-sm font-medium border-2 transition-all",
                              formData.preferredFurnishedStatus === opt.value
                                ? "bg-emerald-500 text-white border-emerald-500"
                                : "bg-card border-border/50 hover:border-emerald-500/30 text-muted-foreground"
                            )}>{opt.label}</button>
                        ))}
                      </div>
                    </PulseField>

                    <div className="space-y-3">
                      <ToggleCard field="momoPaymentRequired" formData={formData} updateField={updateField} label="MoMo Payment" desc="Landlord accepts MTN/Vodafone Mobile Money." icon={<Smartphone size={18} color="#10b981" />} />
                      <ToggleCard field="negotiableRequired" formData={formData} updateField={updateField} label="Negotiable Price" desc="Price or advance period is flexible." icon={<CheckCircle2 size={18} color="#10b981" />} />
                      <ToggleCard field="acRequired" formData={formData} updateField={updateField} label="Air Conditioning" desc="Functional AC in living/bedroom." icon={<Wind size={18} color="#10b981" />} />
                      <ToggleCard field="parkingRequired" formData={formData} updateField={updateField} label="Parking" desc="Dedicated vehicle parking space." icon={<Car size={18} color="#10b981" />} />
                    </div>
                  </div>
                )}

                {!isHostelIntent && !isHotelIntent && !isLongTermIntent && (
                  <div className="text-center py-10 px-6 rounded-xl border border-dashed border-border bg-muted/20">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                       <Home size={20} className="text-muted-foreground/40" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-2">No extra preferences needed</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-4">Based on your selection, no specialised questions are needed here.</p>
                    <Button variant="outline" size="sm" onClick={handleNext}>Continue</Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 7: Resilience & Utilities */}
          {step === 6 && (
            <motion.div
              key="step7-resilience"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <Shield size={14} />
                  <span className="text-xs font-medium">Utilities</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
                  {stepTitles[6]}
                </h1>
                <p className="text-base text-muted-foreground max-w-md mx-auto">
                  Power, water, and utility preferences for your accommodation.
                </p>
              </div>

              <div className="space-y-10">
                <PulseField label="Backup power" icon={Zap}>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "any", label: "Any", icon: "🔌" },
                      { value: "Generator", label: "Generator", icon: "🏭" },
                      { value: "Solar", label: "Solar / Inverter", icon: "☀️" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateField("preferredBackupPower", option.value)}
                        className={cn(
                          "py-4 px-2 rounded-xl text-sm font-medium transition-all border-2 flex flex-col items-center gap-1.5",
                          formData.preferredBackupPower === option.value
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border/50 hover:border-primary/30 text-muted-foreground"
                        )}
                      >
                        <span className="text-xl">{option.icon}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </PulseField>

                <PulseField label="Water reliability" icon={Droplets}>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "any", label: "Any", icon: "🚰" },
                      { value: "Regular", label: "Regular", icon: "💧" },
                      { value: "Constant", label: "Constant", icon: "🌊" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateField("preferredWaterReliability", option.value)}
                        className={cn(
                          "py-4 px-2 rounded-xl text-sm font-medium transition-all border-2 flex flex-col items-center gap-1.5",
                          formData.preferredWaterReliability === option.value
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card border-border/50 hover:border-primary/30 text-muted-foreground"
                        )}
                      >
                        <span className="text-xl">{option.icon}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                </PulseField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PulseField label="Utility metering" icon={Gauge}>
                    <div className="grid grid-cols-2 gap-2">
                       {[{v:"Shared", l:"Shared"}, {v:"Private", l:"Private"}].map(m => (
                         <button key={m.v} onClick={() => updateField("preferredUtilityMetering", m.v)} className={cn("py-3 rounded-lg border-2 text-sm font-medium transition-all", formData.preferredUtilityMetering === m.v ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/50 hover:border-primary/30")}>
                           {m.l}
                         </button>
                       ))}
                    </div>
                  </PulseField>
                  <PulseField label="Road access" icon={Map}>
                    <div className="grid grid-cols-2 gap-2">
                       {[{v:"Tarred", l:"Tarred"}, {v:"Paved", l:"Paved"}].map(r => (
                         <button key={r.v} onClick={() => updateField("preferredRoadAccess", r.v)} className={cn("py-3 rounded-lg border-2 text-sm font-medium transition-all", formData.preferredRoadAccess === r.v ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border/50 hover:border-primary/30")}>
                           {r.l}
                         </button>
                       ))}
                    </div>
                  </PulseField>
                </div>

                <div className="space-y-4 pt-6 border-t border-border/20">
                   <ToggleCard field="verificationRequired" formData={formData} updateField={updateField} label="Verified Properties" desc="Only show listings inspected by ReservEase." icon={<ShieldCheck size={20} />} />
                   <ToggleCard field="isInclusiveRequired" formData={formData} updateField={updateField} label="Inclusive Utilities" desc="Rent covers water and shared electricity." icon={<Droplet size={20} />} />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 8: Final Requirements */}
          {step === 7 && (
            <motion.div
              key="step8-final"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <CheckCircle2 size={14} />
                  <span className="text-xs font-medium">Almost done</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
                  {stepTitles[7]}
                </h1>
                <p className="text-base text-muted-foreground max-w-md mx-auto">
                  Select must-have amenities and add any special requests.
                </p>
              </div>

              <div className="space-y-8">
                <PulseField label="Must-have amenities" icon={Zap} help="Only select what's essential.">
                  <div className="flex flex-wrap gap-2">
                    {facilitiesList.map((facility) => {
                       const isActive = formData.facilities.includes(facility.value);
                       return (
                        <button
                          key={facility.value}
                          onClick={() => toggleMulti("facilities", facility.value)}
                          className={cn(
                            "px-3 py-2 rounded-lg text-xs font-medium transition-all border flex items-center gap-2",
                            isActive
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card border-border/50 hover:border-primary/30 text-muted-foreground"
                          )}
                        >
                          {isActive ? <Check size={10} /> : <Plus size={10} className="opacity-30" />}
                          {facility.label}
                        </button>
                      );
                    })}
                  </div>
                </PulseField>

                <PulseField label="Notes for our team" icon={Target} help="Any special requests.">
                  <div className="relative group">
                    <Textarea
                      placeholder="E.g., quiet location, near transport, reliable water, close to work..."
                      value={formData.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      className="relative min-h-[120px] resize-none text-sm p-4 rounded-lg border border-border/60 bg-background focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground/60">
                     <p className="text-xs">Add any specific requests for our team</p>
                  </div>
                </PulseField>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div
        className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 z-50"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <div className="px-4 md:px-6 pt-3 pb-1 max-w-xl mx-auto flex items-center justify-between gap-3">
           {step > 0 ? (
             <Button
               variant="outline"
               size="sm"
               onClick={handleBack}
               className="h-12 px-6 rounded-lg font-semibold border-2 hover:bg-muted"
             >
                Back
             </Button>
           ) : <div />}

          <Button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className="flex-1 h-12 rounded-lg font-semibold text-sm transition-all"
            size="sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <span className="flex items-center gap-2 justify-center">
                {step === TOTAL_STEPS - 1
                   ? (isRefinementMode ? "Search with updated preferences" : "Find My Accommodation")
                   : "Next Step"}
                {step < TOTAL_STEPS - 1 && <ArrowRight className="h-4 w-4" />}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SelectCard({
  selected,
  onClick,
  icon,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-5 rounded-xl border text-left transition-all relative overflow-hidden group",
        selected
          ? "border-primary bg-primary/5"
          : "border-border/60 bg-card hover:border-primary/40 text-foreground"
      )}
    >
       {selected && (
          <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
             <Check className="h-4 w-4 text-primary-foreground" />
          </div>
       )}
      <div className={cn("mb-4 inline-flex p-3 rounded-xl", selected ? "bg-primary/10" : "bg-muted")}>
        {icon}
      </div>
      <div className="space-y-1">
        <span className="font-semibold text-base text-foreground block">{title}</span>
        <p className="text-sm text-muted-foreground pr-4 leading-relaxed">{description}</p>
      </div>
    </button>
  );
}
