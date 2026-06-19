import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Phone,
  Mail,
  School,
  Wallet,
  Home,
  MapPin,
  Calendar,
  Check,
  Sparkles,
  Crown,
  Copy,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const steps = ["Basic Info", "Preferences", "Service Tier", "Confirmation"];

const roomTypes = ["Single", "Shared (2)", "Shared (3+)", "Studio"];
const facilities = ["WiFi", "AC", "Kitchen", "Laundry", "Gym", "Study Room", "Generator"];
const dealBreakers = ["No Noise", "No Visitors", "Female Only", "Male Only", "No Smoking"];
const budgetRanges = ["Under GHS 500", "GHS 500 - 1000", "GHS 1000 - 2000", "Above GHS 2000"];
const distanceOptions = ["Walking distance", "5-10 min drive", "15-20 min drive", "Any distance"];
const moveInTimelines = ["Immediately", "Within 1 week", "Within 1 month", "Next semester"];

interface FormData {
  name: string;
  phone: string;
  email: string;
  school: string;
  budget: string;
  roomType: string;
  distance: string;
  facilities: string[];
  moveIn: string;
  dealBreakers: string[];
  tier: "standard" | "concierge";
}

export default function Request() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    school: "",
    budget: "",
    roomType: "",
    distance: "",
    facilities: [],
    moveIn: "",
    dealBreakers: [],
    tier: "standard",
  });
  const [requestId] = useState(`REQ-${Date.now().toString(36).toUpperCase()}`);
  const { toast } = useToast();
  const navigate = useNavigate();

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: "facilities" | "dealBreakers", value: string) => {
    const current = formData[field];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateField(field, updated);
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!formData.name || !formData.phone || !formData.email) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
    }
    if (currentStep === 1) {
      if (!formData.budget || !formData.roomType) {
        toast({
          title: "Missing Preferences",
          description: "Please select budget and room type",
          variant: "destructive",
        });
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    toast({
      title: "Request Submitted!",
      description: "We'll get back to you within 24 hours",
    });
    setCurrentStep(3);
  };

  const copyRequestId = () => {
    navigator.clipboard.writeText(requestId);
    toast({ title: "Copied!", description: "Request ID copied to clipboard" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 p-4">
        <div className="container flex items-center justify-between">
          {currentStep < 3 ? (
            <button
              onClick={currentStep === 0 ? () => navigate(-1) : handleBack}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <span className="text-sm font-bold text-primary-foreground">R</span>
            </div>
          </Link>
          <div className="w-16" />
        </div>
      </header>

      {/* Progress */}
      {currentStep < 3 && (
        <div className="container py-4">
          <div className="flex items-center justify-between mb-2">
            {steps.slice(0, 3).map((step, index) => (
              <div
                key={step}
                className={cn(
                  "flex items-center gap-2",
                  index <= currentStep ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                    index < currentStep
                      ? "bg-primary text-primary-foreground"
                      : index === currentStep
                      ? "border-2 border-primary text-primary"
                      : "border-2 border-muted text-muted-foreground"
                  )}
                >
                  {index < currentStep ? <Check size={16} /> : index + 1}
                </div>
                <span className="hidden sm:block text-sm font-medium">{step}</span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-primary"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Form Content */}
      <main className="flex-1 container py-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Info */}
          {currentStep === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-lg mx-auto space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Let's Get Started
                </h1>
                <p className="text-muted-foreground">
                  Tell us a bit about yourself
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0XX XXX XXXX"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school">School / University</Label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="school"
                      placeholder="Your institution"
                      value={formData.school}
                      onChange={(e) => updateField("school", e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Preferences */}
          {currentStep === 1 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-lg mx-auto space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Your Preferences
                </h1>
                <p className="text-muted-foreground">
                  Help us find your perfect match
                </p>
              </div>

              <div className="space-y-6">
                {/* Budget */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" /> Budget Range *
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {budgetRanges.map((range) => (
                      <button
                        key={range}
                        onClick={() => updateField("budget", range)}
                        className={cn(
                          "p-3 rounded-lg border-2 text-sm font-medium transition-all",
                          formData.budget === range
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Room Type */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Home className="h-4 w-4" /> Room Type *
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {roomTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => updateField("roomType", type)}
                        className={cn(
                          "p-3 rounded-lg border-2 text-sm font-medium transition-all",
                          formData.roomType === type
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Distance */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Distance from Campus
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {distanceOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => updateField("distance", option)}
                        className={cn(
                          "p-3 rounded-lg border-2 text-sm font-medium transition-all",
                          formData.distance === option
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Move-in Timeline */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Move-in Timeline
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {moveInTimelines.map((timeline) => (
                      <button
                        key={timeline}
                        onClick={() => updateField("moveIn", timeline)}
                        className={cn(
                          "p-3 rounded-lg border-2 text-sm font-medium transition-all",
                          formData.moveIn === timeline
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {timeline}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Facilities */}
                <div className="space-y-3">
                  <Label>Preferred Facilities</Label>
                  <div className="flex flex-wrap gap-2">
                    {facilities.map((facility) => (
                      <button
                        key={facility}
                        onClick={() => toggleArrayField("facilities", facility)}
                        className={cn(
                          "px-4 py-2 rounded-full border-2 text-sm font-medium transition-all",
                          formData.facilities.includes(facility)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {facility}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deal Breakers */}
                <div className="space-y-3">
                  <Label>Deal Breakers (Optional)</Label>
                  <div className="flex flex-wrap gap-2">
                    {dealBreakers.map((item) => (
                      <button
                        key={item}
                        onClick={() => toggleArrayField("dealBreakers", item)}
                        className={cn(
                          "px-4 py-2 rounded-full border-2 text-sm font-medium transition-all",
                          formData.dealBreakers.includes(item)
                            ? "border-destructive bg-destructive/10 text-destructive"
                            : "border-border hover:border-destructive/50"
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Service Tier */}
          {currentStep === 2 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-lg mx-auto space-y-6"
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Choose Your Service
                </h1>
                <p className="text-muted-foreground">
                  Select the level of support you need
                </p>
              </div>

              <div className="space-y-4">
                {/* Standard */}
                <button
                  onClick={() => updateField("tier", "standard")}
                  className={cn(
                    "w-full p-6 rounded-2xl border-2 text-left transition-all",
                    formData.tier === "standard"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Standard</h3>
                        <p className="text-sm text-muted-foreground">Free</p>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "h-6 w-6 rounded-full border-2 flex items-center justify-center",
                        formData.tier === "standard"
                          ? "border-primary bg-primary"
                          : "border-muted"
                      )}
                    >
                      {formData.tier === "standard" && (
                        <Check className="h-4 w-4 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" /> Up to 3 recommendations
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" /> 48-hour response time
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" /> WhatsApp support
                    </li>
                  </ul>
                </button>

                {/* Concierge */}
                <button
                  onClick={() => updateField("tier", "concierge")}
                  className={cn(
                    "w-full p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden",
                    formData.tier === "concierge"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="absolute top-0 right-0 bg-warning text-warning-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                    PREMIUM
                  </div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                        <Crown className="h-6 w-6 text-warning" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Concierge</h3>
                        <p className="text-sm text-muted-foreground">GHS 50</p>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "h-6 w-6 rounded-full border-2 flex items-center justify-center",
                        formData.tier === "concierge"
                          ? "border-primary bg-primary"
                          : "border-muted"
                      )}
                    >
                      {formData.tier === "concierge" && (
                        <Check className="h-4 w-4 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-warning" /> Unlimited recommendations
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-warning" /> 24-hour priority response
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-warning" /> Dedicated agent
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-warning" /> Virtual tour arrangement
                    </li>
                  </ul>
                </button>
              </div>

              {formData.tier === "concierge" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="p-4 rounded-xl bg-muted/50 border border-border"
                >
                  <p className="text-sm text-muted-foreground mb-3">
                    Payment via Mobile Money (MTN/Vodafone/AirtelTigo)
                  </p>
                  <Button variant="outline" className="w-full">
                    Pay GHS 50 with Hubtel
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 3 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 mx-auto mb-6"
              >
                <Check className="h-10 w-10 text-success" />
              </motion.div>

              <h1 className="text-2xl font-bold text-foreground mb-2">
                Request Submitted!
              </h1>
              <p className="text-muted-foreground mb-8">
                We'll find matching hostels and get back to you within 24-48 hours
              </p>

              <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                <p className="text-sm text-muted-foreground mb-2">Your Request ID</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-mono font-bold text-primary">
                    {requestId}
                  </span>
                  <button
                    onClick={copyRequestId}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <Copy className="h-5 w-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <Button size="lg" className="w-full" asChild>
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <a href="https://wa.me/1234567890">
                    <MessageCircle className="mr-2" />
                    Contact via WhatsApp
                  </a>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Actions */}
      {currentStep < 3 && (
        <div className="sticky bottom-0 bg-background border-t border-border p-4">
          <div className="container max-w-lg mx-auto">
            <Button
              size="lg"
              className="w-full"
              onClick={currentStep === 2 ? handleSubmit : handleNext}
            >
              {currentStep === 2 ? "Submit Request" : "Continue"}
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
