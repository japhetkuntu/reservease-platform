import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, User, Phone, Mail, School,
  Wallet, Home, MapPin, Calendar, Check, Sparkles,
  Crown, Copy, MessageCircle, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// ── Data ──────────────────────────────────────────────────────────────────────
const steps = ["Basic Info", "Preferences", "Service Tier", "Confirmation"];

const roomTypes = ["Single", "Shared (2)", "Shared (3+)", "Studio"];
const facilities = ["WiFi", "AC", "Kitchen", "Laundry", "Gym", "Study Room", "Generator"];
const dealBreakers = ["No Noise", "No Visitors", "Female Only", "Male Only", "No Smoking"];
const budgetRanges = ["Under GHS 500", "GHS 500 – 1,000", "GHS 1,000 – 2,000", "Above GHS 2,000"];
const distanceOptions = ["Walking distance", "5–10 min drive", "15–20 min drive", "Any distance"];
const moveInTimelines = ["Immediately", "Within 1 week", "Within 1 month", "Next semester"];

interface FormData {
  name: string; phone: string; email: string; school: string;
  budget: string; roomType: string; distance: string;
  facilities: string[]; moveIn: string; dealBreakers: string[];
  tier: "standard" | "concierge";
}

// ── Step slide variants — start visible ───────────────────────────────────────
const slideVariants = {
  initial: { opacity: 0.6, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  exit: { opacity: 0.6, x: -16, transition: { duration: 0.15 } },
};

// ── Progress bar ──────────────────────────────────────────────────────────────
function StepProgress({ current, total }: { current: number; total: number }) {
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-0">
      <div className="flex items-center gap-2 mb-3">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 flex-1 last:flex-none">
            <div className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold border-2 flex-shrink-0 transition-all",
              i < current ? "bg-primary border-primary text-primary-foreground" :
              i === current ? "border-primary text-primary bg-background" :
              "border-border text-muted-foreground bg-background"
            )}>
              {i < current ? <Check size={13} /> : i + 1}
            </div>
            <span className={cn("hidden sm:block text-xs font-medium truncate",
              i <= current ? "text-foreground" : "text-muted-foreground"
            )}>{steps[i]}</span>
            {i < total - 1 && (
              <div className="hidden sm:block flex-1 h-px mx-1 bg-border" />
            )}
          </div>
        ))}
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-400 ease-out"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ── SelectButton helper ───────────────────────────────────────────────────────
function SelectBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn(
      "p-3 rounded-xl border-2 text-sm font-medium transition-all text-left",
      active ? "border-primary bg-primary/8 text-primary" : "border-border hover:border-primary/40 text-foreground bg-card"
    )}>
      {children}
    </button>
  );
}

// ── TagBtn helper ─────────────────────────────────────────────────────────────
function TagBtn({ active, onClick, destructive, children }: { active: boolean; onClick: () => void; destructive?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn(
      "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 text-xs font-semibold transition-all",
      destructive
        ? active ? "border-destructive bg-destructive/10 text-destructive" : "border-border hover:border-destructive/40 text-muted-foreground"
        : active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/40 text-muted-foreground"
    )}>
      {active && !destructive && <Check size={11} />}
      {active && destructive && <X size={11} />}
      {children}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Request() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: "", phone: "", email: "", school: "",
    budget: "", roomType: "", distance: "",
    facilities: [], moveIn: "", dealBreakers: [], tier: "standard",
  });
  const [requestId] = useState(`REQ-${Date.now().toString(36).toUpperCase()}`);
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateField = (field: keyof FormData, value: string | string[]) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const toggleArrayField = (field: "facilities" | "dealBreakers", value: string) => {
    const current = formData[field];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateField(field, updated);
  };

  const handleNext = () => {
    if (currentStep === 0 && (!formData.name || !formData.phone || !formData.email)) {
      toast({ title: "Missing information", description: "Please fill in all required fields", variant: "destructive" }); return;
    }
    if (currentStep === 1 && (!formData.budget || !formData.roomType)) {
      toast({ title: "Missing preferences", description: "Please select budget and room type", variant: "destructive" }); return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = () => {
    toast({ title: "Request submitted!", description: "We'll get back to you within 24 hours" });
    setCurrentStep(3);
  };

  const copyRequestId = () => {
    navigator.clipboard.writeText(requestId);
    toast({ title: "Copied!", description: "Request ID copied to clipboard" });
  };

  return (
    // FIX: plain div, no motion.div with opacity:0
    <div className="min-h-dvh flex flex-col bg-background">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-lg mx-auto h-14 flex items-center justify-between px-4">
          {currentStep < 3 ? (
            <button
              onClick={currentStep === 0 ? () => navigate(-1) : handleBack}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : <div />}

          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary group-hover:opacity-90 transition-opacity">
              <span className="text-sm font-black text-primary-foreground">R</span>
            </div>
            <span className="text-sm font-semibold text-foreground hidden sm:block">ReservEase</span>
          </Link>

          <div className="w-16" />
        </div>
      </header>

      {/* ── Progress bar (steps 0–2 only) ── */}
      {currentStep < 3 && (
        <div className="px-4 pt-5 pb-2">
          <StepProgress current={currentStep} total={3} />
        </div>
      )}

      {/* ── Step content ── */}
      <main className="flex-1 pb-28">
        <div className="max-w-lg mx-auto px-4 py-6">
          <AnimatePresence mode="wait">

            {/* ══ STEP 1: Basic Info ══ */}
            {currentStep === 0 && (
              <motion.div key="step0" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-foreground mb-1.5 tracking-tight">Let's get started</h1>
                  <p className="text-base text-muted-foreground">Tell us a bit about yourself</p>
                </div>

                <div className="space-y-4">
                  {[
                    { id: "name", label: "Full Name", icon: User, placeholder: "Your full name", type: "text", required: true },
                    { id: "phone", label: "Phone Number", icon: Phone, placeholder: "0XX XXX XXXX", type: "tel", required: true },
                    { id: "email", label: "Email Address", icon: Mail, placeholder: "your.email@example.com", type: "email", required: true },
                    { id: "school", label: "School / University", icon: School, placeholder: "Your institution", type: "text", required: false },
                  ].map((field) => (
                    <div key={field.id} className="space-y-1.5">
                      <Label htmlFor={field.id} className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {field.label}{field.required && " *"}
                      </Label>
                      <div className="relative">
                        <field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id={field.id} type={field.type} placeholder={field.placeholder}
                          value={formData[field.id as keyof FormData] as string}
                          onChange={(e) => updateField(field.id as keyof FormData, e.target.value)}
                          className="pl-10 h-11 rounded-xl border-border text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══ STEP 2: Preferences ══ */}
            {currentStep === 1 && (
              <motion.div key="step1" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-7">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-foreground mb-1.5 tracking-tight">Your preferences</h1>
                  <p className="text-base text-muted-foreground">Help us find your perfect match</p>
                </div>

                {/* Budget */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <Wallet className="h-3.5 w-3.5" /> Budget Range *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {budgetRanges.map((r) => <SelectBtn key={r} active={formData.budget === r} onClick={() => updateField("budget", r)}>{r}</SelectBtn>)}
                  </div>
                </div>

                {/* Room Type */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <Home className="h-3.5 w-3.5" /> Room Type *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {roomTypes.map((t) => <SelectBtn key={t} active={formData.roomType === t} onClick={() => updateField("roomType", t)}>{t}</SelectBtn>)}
                  </div>
                </div>

                {/* Distance */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <MapPin className="h-3.5 w-3.5" /> Distance from Campus
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {distanceOptions.map((d) => <SelectBtn key={d} active={formData.distance === d} onClick={() => updateField("distance", d)}>{d}</SelectBtn>)}
                  </div>
                </div>

                {/* Move-in */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    <Calendar className="h-3.5 w-3.5" /> Move-in Timeline
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {moveInTimelines.map((t) => <SelectBtn key={t} active={formData.moveIn === t} onClick={() => updateField("moveIn", t)}>{t}</SelectBtn>)}
                  </div>
                </div>

                {/* Facilities */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Preferred Facilities</label>
                  <div className="flex flex-wrap gap-2">
                    {facilities.map((f) => (
                      <TagBtn key={f} active={formData.facilities.includes(f)} onClick={() => toggleArrayField("facilities", f)}>{f}</TagBtn>
                    ))}
                  </div>
                </div>

                {/* Deal Breakers */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Deal Breakers <span className="normal-case font-normal">(optional)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {dealBreakers.map((d) => (
                      <TagBtn key={d} active={formData.dealBreakers.includes(d)} onClick={() => toggleArrayField("dealBreakers", d)} destructive>{d}</TagBtn>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══ STEP 3: Service Tier ══ */}
            {currentStep === 2 && (
              <motion.div key="step2" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="space-y-5">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-foreground mb-1.5 tracking-tight">Choose your service</h1>
                  <p className="text-base text-muted-foreground">Select the level of support you need</p>
                </div>

                {/* Standard */}
                <button onClick={() => updateField("tier", "standard")}
                  className={cn("w-full p-6 rounded-2xl border-2 text-left transition-all",
                    formData.tier === "standard" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 bg-card"
                  )}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Standard</p>
                        <p className="text-sm text-muted-foreground">Free</p>
                      </div>
                    </div>
                    <div className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                      formData.tier === "standard" ? "border-primary bg-primary" : "border-border"
                    )}>
                      {formData.tier === "standard" && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                  </div>
                  <ul className="space-y-2.5">
                    {["Up to 3 recommendations", "48-hour response time", "WhatsApp support"].map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </button>

                {/* Concierge */}
                <button onClick={() => updateField("tier", "concierge")}
                  className={cn("w-full p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden",
                    formData.tier === "concierge" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 bg-card"
                  )}>
                  <span className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl tracking-widest uppercase">
                    Premium
                  </span>
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
                        <Crown className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Concierge</p>
                        <p className="text-sm text-muted-foreground">GHS 50</p>
                      </div>
                    </div>
                    <div className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                      formData.tier === "concierge" ? "border-primary bg-primary" : "border-border"
                    )}>
                      {formData.tier === "concierge" && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                  </div>
                  <ul className="space-y-2.5">
                    {["Unlimited recommendations", "24-hour priority response", "Dedicated agent", "Virtual tour arrangement"].map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <Check className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </button>

                {formData.tier === "concierge" && (
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <p className="text-sm text-muted-foreground mb-3">Payment via Mobile Money (MTN / Vodafone / AirtelTigo)</p>
                    <Button variant="outline" className="w-full h-11 rounded-xl font-semibold">Pay GHS 50 with Hubtel</Button>
                  </div>
                )}
              </motion.div>
            )}

            {/* ══ STEP 4: Confirmation ══ */}
            {currentStep === 3 && (
              <motion.div key="step3" variants={slideVariants} initial="initial" animate="animate" exit="exit" className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2 tracking-tight">Request submitted!</h1>
                <p className="text-base text-muted-foreground mb-8 max-w-sm mx-auto">
                  We'll find matching options and get back to you within 24–48 hours.
                </p>

                {/* Request ID card */}
                <div className="bg-card border border-border rounded-2xl p-6 mb-6 text-left">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Your Request ID</p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xl font-mono font-bold text-primary tracking-wide">{requestId}</span>
                    <button onClick={copyRequestId}
                      className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">Save this ID to track your request status.</p>
                </div>

                <div className="space-y-3">
                  <Button size="lg" className="w-full h-12 rounded-xl font-semibold" asChild>
                    <Link to="/dashboard">Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                  <Button size="lg" variant="outline" className="w-full h-12 rounded-xl font-semibold" asChild>
                    {/* FIX: real WhatsApp number */}
                    <a href="https://wa.me/233558299409" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" /> Contact via WhatsApp
                    </a>
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* ── Sticky footer CTA (steps 0–2) ── */}
      {currentStep < 3 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
          <div className="max-w-lg mx-auto px-4 pt-3 pb-1">
            <Button size="lg"
              className="w-full h-12 rounded-xl font-semibold text-sm"
              onClick={currentStep === 2 ? handleSubmit : handleNext}>
              {currentStep === 2 ? "Submit Request" : "Continue"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}