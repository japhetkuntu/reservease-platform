import { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ChevronLeft, Building2, Home, Hotel, MapPin, Zap, Wifi,
  Droplets, Shield, Car, UtensilsCrossed, Baby, Banknote,
  CheckCircle2, ChevronRight, Clock, Camera, Edit3, Sparkles,
  Search, Info, ImagePlus, Layout, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { ImageUploader } from "@/components/property/ImageUploader";
import { getAccommodationById, updateAccommodation, DEFAULT_FORM, getPricePeriodOptions } from "@/data/accommodations";
import type { Accommodation } from "@/data/accommodations";

const STEPS = [
  { id: 0, title: "Property Type",  description: "What are you listing?", icon: Layout      },
  { id: 1, title: "Basic Info",     description: "Name & location",      icon: MapPin      },
  { id: 2, title: "Room Details",   description: "Space & furnishing",   icon: Home        },
  { id: 3, title: "Amenities",      description: "Power & utilities",    icon: Zap         },
  { id: 4, title: "Rules & Access", description: "Tenant policies",      icon: Shield      },
  { id: 5, title: "Pricing",        description: "Rent & payment",       icon: Banknote    },
  { id: 6, title: "Photos",         description: "Property media",       icon: Camera      },
];

const PROPERTY_TYPES = [
  { id: "hostel",       title: "Hostel",       desc: "Dorms & shared rooms",             icon: Building2 },
  { id: "apartment",   title: "Apartment",    desc: "Flats & standalone units",         icon: Home      },
  { id: "self-contain",title: "Self-Contain", desc: "Single room with private bath",    icon: Home      },
  { id: "guest-house", title: "Guest House",  desc: "Short stays & B&Bs",              icon: Hotel     },
  { id: "homestay",    title: "Home Stay",    desc: "Shared house with the owner",      icon: Home      },
  { id: "hotel-room",  title: "Hotels",       desc: "Hotel rooms & suites",             icon: Hotel     },
];

const AMENITIES = [
  { id: "wifi",     label: "Wi-Fi",           icon: Wifi          },
  { id: "cctv",     label: "CCTV",            icon: Shield        },
  { id: "kitchen",  label: "Shared Kitchen",  icon: UtensilsCrossed },
  { id: "laundry",  label: "Laundry Area",    icon: Droplets      },
  { id: "fridge",   label: "Fridge",          icon: Zap           },
  { id: "desk",     label: "Study Desk",      icon: Home          },
  { id: "bed",      label: "Bed",             icon: Home          },
  { id: "wardrobe", label: "Wardrobe",        icon: Home          },
  { id: "tv",       label: "Television",      icon: Zap           },
  { id: "pool",     label: "Swimming Pool",   icon: Sparkles      },
  { id: "gym",      label: "Gym",             icon: Zap           },
  { id: "elevator", label: "Elevator",        icon: Building2     },
  { id: "cleaning", label: "Cleaning Service",icon: Sparkles      },
];

const TRANSPORT_OPTIONS = [
  { id: "Trotro",      label: "Trotro"       },
  { id: "Bus",         label: "Bus"          },
  { id: "Uber/Bolt",   label: "Uber/Bolt"    },
  { id: "Taxi",        label: "Taxi"         },
  { id: "Okada",       label: "Okada"        },
  { id: "Walking Only",label: "Walking Only" },
];

const SECURITY_FEATURES = [
  { id: "CCTV",           label: "CCTV Cameras"  },
  { id: "Guard",          label: "Security Guard" },
  { id: "Electric Fence", label: "Electric Fence" },
  { id: "Gated",          label: "Gated Compound" },
];

export function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialStep = searchParams.get("step");
  const parsedStep = initialStep ? parseInt(initialStep, 10) : 0;
  const [step, setStep] = useState(parsedStep >= 0 && parsedStep < STEPS.length ? parsedStep : 0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveDialog, setSaveDialog] = useState(false);

  const [form, setForm] = useState<Omit<Accommodation, 'id' | 'ownerId' | 'isApproved' | 'isVerified' | 'requests' | 'createdAt' | 'updatedAt' | 'available'>>({ ...DEFAULT_FORM });

  useEffect(() => {
    const fetch = async () => {
      if (id) {
        try {
          setLoading(true);
          const data = await getAccommodationById(id);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id: _id, ownerId, isApproved, isVerified, totalRequests, createdAt, updatedAt, available, ...rest } = data;
          setForm(rest);
        } catch (err: unknown) {
          setError((err as Error).message || "Failed to load property details");
        } finally {
          setLoading(false);
        }
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-background">
        <div className="relative h-24 w-24 mb-6">
           <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
           <div className="relative h-full w-full bg-primary/5 rounded-full flex items-center justify-center border border-primary/20">
              <Building2 className="w-10 h-10 text-primary animate-pulse" />
           </div>
        </div>
        <p className="text-xl font-bold tracking-tight">Syncing details...</p>
        <p className="text-sm text-muted-foreground mt-1">Please wait while we prepare your property data.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-background">
        <div className="h-16 w-16 bg-destructive/10 rounded-2xl flex items-center justify-center mb-6">
           <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-black mb-2">{error}</h2>
        <p className="text-muted-foreground mb-8 max-w-md">We encountered an issue retrieving this property. It may have been moved or you might not have the right permissions.</p>
        <Button asChild className="rounded-full px-8 h-12"><Link to="/dashboard">Back to Dashboard</Link></Button>
      </div>
    );
  }

  const patchForm = (patch: Partial<typeof form>) => setForm(prev => {
    const updated = { ...prev, ...patch };
    if ('price' in patch) updated.numericPrice = parseFloat(patch.price || '0');
    return updated;
  });

  function toggleList(key: "amenities" | "securityFeatures" | "transportAccess", val: string) {
    const list = form[key] as string[];
    patchForm({ [key]: list.includes(val) ? list.filter(x => x !== val) : [...list, val] });
  }

  async function handleSave() {
    try {
      setIsSubmitting(true);
      await updateAccommodation(id!, { ...form });
      setSaveDialog(false);
      navigate("/dashboard");
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to update property");
    } finally {
      setIsSubmitting(false);
    }
  }

  const progress = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex-1 flex flex-col min-h-screen bg-background relative overflow-hidden">

        {/* Decor */}
        <div className="fixed inset-0 pointer-events-none">
           <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/2 rounded-full blur-[120px] -translate-y-1/2" />
           <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary/2 rounded-full blur-[120px] translate-y-1/2" />
        </div>

        {/* ── Top Bar Refresh ──────────────────── */}
        <div className="sticky top-16 z-30 border-b bg-background/50 backdrop-blur-xl transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
            <Button variant="ghost" size="sm" asChild className="rounded-full hover:bg-primary/5 text-muted-foreground transition-all">
              <Link to="/dashboard"><ChevronLeft className="mr-1 h-4 w-4" /> Dashboard</Link>
            </Button>

            <div className="h-4 w-px bg-border/50 hidden sm:block" />

            <div className="flex-1 min-w-0">
               <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 truncate">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary shrink-0">Now Editing</p>
                    <h2 className="text-sm font-black truncate">{form.name || "Untitled Property"}</h2>
                  </div>
                  <p className="text-[10px] font-black tabular-nums">{progress}% READY</p>
               </div>
               <div className="h-1.5 w-full bg-muted/50 rounded-full overflow-hidden border border-border/10">
                  <div className="h-full bg-primary rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(var(--primary),0.3)]" style={{ width: `${progress}%` }} />
               </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
               <Button onClick={() => setSaveDialog(true)} size="sm" className="rounded-full px-6 font-black uppercase tracking-widest text-[10px] h-10 shadow-xl shadow-primary/20">
                  <CheckCircle2 className="w-3 h-3 mr-2" /> Quick Save
               </Button>
            </div>
          </div>
        </div>

        {/* ── Main Content ──────────────────────── */}
        <div className="max-w-7xl mx-auto w-full px-6 py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 items-start">

            {/* Steps Side Nav */}
            <aside className="sticky top-40 space-y-8 hidden lg:block">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-4 px-4">Management Flow</p>
                {STEPS.map(s => {
                  const Icon = s.icon;
                  const active = s.id === step;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setStep(s.id)}
                      className={cn(
                        "w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-300 text-left group",
                        active ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:bg-muted/50"
                      )}
                    >
                      <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300",
                        active ? "bg-primary border-primary text-white scale-110 rotate-3" : "bg-card border-border/50 group-hover:border-primary/20")}>
                         <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                         <p className={cn("text-sm font-black tracking-tight", active ? "text-primary" : "text-foreground/80")}>{s.title}</p>
                         <p className="text-[10px] font-medium text-muted-foreground/60 truncate uppercase tracking-widest">{s.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-6 rounded-[2rem] bg-card border border-border/50 shadow-sm relative overflow-hidden group">
                 <div className="absolute right-0 top-0 p-2 opacity-5"><Edit3 className="w-12 h-12" /></div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Editor's Tip</p>
                 <p className="text-xs text-muted-foreground leading-relaxed">High-quality photos and detailed utility info attract the most serious tenants.</p>
              </div>
            </aside>

            {/* Form Display */}
            <main className="space-y-8 pb-32">
              <Card className="glass border-border/50 rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/5">
                <CardContent className="p-8 sm:p-16">

                  {/* STEP 0: TYPE */}
                  {step === 0 && (
                    <StepWrapper title="Property Identity" description="Update the fundamental category of your listing.">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {PROPERTY_TYPES.map(type => {
                          const Icon = type.icon;
                          const active = form.category === type.id;
                          return (
                            <button key={type.id} onClick={() => patchForm({ category: type.id })}
                              className={cn("flex items-center gap-5 text-left border-2 rounded-[2rem] p-6 transition-all duration-300 group",
                                active ? "border-primary bg-primary/5 shadow-inner" : "border-border/50 hover:border-primary/20")}>
                              <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500",
                                active ? "bg-primary text-white shadow-lg" : "bg-muted text-muted-foreground group-hover:scale-105")}>
                                <Icon className="w-6 h-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={cn("font-black tracking-tight text-lg", active && "text-primary")}>{type.title}</p>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{type.desc}</p>
                              </div>
                              {active && <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 animate-in zoom-in-50 duration-300" />}
                            </button>
                          );
                        })}
                      </div>
                    </StepWrapper>
                  )}

                  {/* STEP 1: BASIC INFO */}
                  {step === 1 && (
                    <StepWrapper title="Core Information" description="How tenants find and identify your property.">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <PulseField label="PROPERTY BRAND NAME" icon={Edit3} help="The catchy or official name of your hostel or building.">
                           <Input value={form.name} onChange={e => patchForm({ name: e.target.value })} className="h-14 rounded-2xl px-6 font-bold tabular-nums" placeholder="e.g. Skyline Apartments" />
                        </PulseField>

                        <PulseField label="PRECISE LOCATION" icon={MapPin} help="Area, neighborhood, or city.">
                           <Input value={form.location} onChange={e => patchForm({ location: e.target.value })} className="h-14 rounded-2xl px-6 font-bold" placeholder="e.g. East Legon, Accra" />
                        </PulseField>

                        {(form.category === 'hostel' || form.category === 'homestay') && (
                          <>
                            <PulseField label="PRIMARY CAMPUS" icon={Building2} help="The main educational hub this property serves.">
                              <Select value={form.nearestCampus} onValueChange={v => patchForm({ nearestCampus: v })}>
                                <SelectTrigger className="h-14 rounded-2xl px-6 font-bold"><SelectValue placeholder="Select Campus" /></SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                  {["KNUST", "UG-Legon", "UCC", "ATU", "UPSA", "GIMPA", "Ashesi", "Pentecost University", "Wisconsin", "UHAS", "UDS", "UEW", "CUCG", "MUCG"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                  <SelectItem value="other">Other Campus</SelectItem>
                                  <SelectItem value="none">Not near a campus</SelectItem>
                                </SelectContent>
                              </Select>
                            </PulseField>

                            <PulseField label="WALKING PROXIMITY" icon={Clock} help="How long does it take to reach the main gate?">
                              <Select value={form.campusProximity} onValueChange={v => patchForm({ campusProximity: v })}>
                                <SelectTrigger className="h-14 rounded-2xl px-6 font-bold"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                  <SelectItem value="walking">Immediate Walking</SelectItem>
                                  <SelectItem value="trotro">Short Commute</SelectItem>
                                  <SelectItem value="far">Needs Vehicle</SelectItem>
                                </SelectContent>
                              </Select>
                            </PulseField>
                          </>
                        )}

                        <div className="sm:col-span-2">
                          <PulseField label="GOOGLE MAPS URL (OPTIONAL)" icon={Search} help="Improves verification speed and helps tenants find you accurately.">
                             <Input
                               value={form.googleMapsUrl}
                               onChange={e => patchForm({ googleMapsUrl: e.target.value })}
                               className="h-14 rounded-2xl px-6 font-bold text-primary"
                               placeholder="https://maps.google.com/..."
                             />
                          </PulseField>
                        </div>
                      </div>
                    </StepWrapper>
                  )}

                  {/* STEP 2: ROOM DETAILS */}
                  {step === 2 && (
                    <StepWrapper title="Living Space" description="Define the configuration and furnishing level.">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <PulseField label="UNIT CONFIGURATION" icon={Layout}>
                           <Select value={form.roomType} onValueChange={v => patchForm({ roomType: v })}>
                             <SelectTrigger className="h-14 rounded-2xl px-6 font-bold"><SelectValue placeholder="Select unit configuration" /></SelectTrigger>
                             <SelectContent className="rounded-2xl">
                               {form.category === 'hostel' ? (
                                 <>
                                   <SelectItem value="1-in-a-room">Private (1-in-a-room)</SelectItem>
                                   <SelectItem value="2-in-a-room">Shared (2-in-a-room)</SelectItem>
                                   <SelectItem value="3-in-a-room">Shared (3-in-a-room)</SelectItem>
                                   <SelectItem value="4-in-a-room">Shared (4-in-a-room)</SelectItem>
                                 </>
                               ) : form.category === 'guest-house' || form.category === 'hotel-room' ? (
                                 <>
                                   <SelectItem value="standard">Standard Room</SelectItem>
                                   <SelectItem value="deluxe">Deluxe Suite</SelectItem>
                                   <SelectItem value="suite">Executive Suite</SelectItem>
                                   <SelectItem value="double">Double Occupancy</SelectItem>
                                 </>
                               ) : (
                                 <>
                                   <SelectItem value="single">Single Room</SelectItem>
                                   <SelectItem value="chamber-hall">Chamber & Hall</SelectItem>
                                   <SelectItem value="one-bedroom">1 Bedroom Flat</SelectItem>
                                   <SelectItem value="two-bedroom">2 Bedroom Apartment</SelectItem>
                                   <SelectItem value="three-bedroom">3+ Bedroom House</SelectItem>
                                   <SelectItem value="studio">Modern Studio</SelectItem>
                                 </>
                               )}
                             </SelectContent>
                           </Select>
                        </PulseField>

                        <PulseField label="SANITATION ARRANGEMENT" icon={Shield}>
                           <Select value={form.bathroomType} onValueChange={v => patchForm({ bathroomType: v })}>
                             <SelectTrigger className="h-14 rounded-2xl px-6 font-bold"><SelectValue /></SelectTrigger>
                             <SelectContent className="rounded-2xl">
                               <SelectItem value="Self-contained">Private (En-suite)</SelectItem>
                               <SelectItem value="Shared">Shared Facilities</SelectItem>
                             </SelectContent>
                           </Select>
                        </PulseField>

                        <PulseField label="FURNISHING TIER" icon={Sparkles}>
                           <Select value={form.furnishedStatus} onValueChange={v => patchForm({ furnishedStatus: v })}>
                             <SelectTrigger className="h-14 rounded-2xl px-6 font-bold"><SelectValue /></SelectTrigger>
                             <SelectContent className="rounded-2xl">
                               <SelectItem value="unfurnished">Base (Unfurnished)</SelectItem>
                               <SelectItem value="semi-furnished">Essential (Semi-furnished)</SelectItem>
                               <SelectItem value="furnished">Premium (Fully Furnished)</SelectItem>
                             </SelectContent>
                           </Select>
                        </PulseField>

                        {form.category === 'hostel' && (
                           <PulseField label="IDENTITY POLICY" icon={Building2}>
                              <Select value={form.genderPolicy} onValueChange={v => patchForm({ genderPolicy: v })}>
                                <SelectTrigger className="h-14 rounded-2xl px-6 font-bold"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                  <SelectItem value="mixed">Mixed Residence</SelectItem>
                                  <SelectItem value="male-only">Men Only</SelectItem>
                                  <SelectItem value="female-only">Women Only</SelectItem>
                                </SelectContent>
                              </Select>
                           </PulseField>
                        )}

                        {(form.category === 'apartment' || form.category === 'self-contain') && (
                          <div className="sm:col-span-2">
                            <PulseField label="COMPOUND STRUCTURE" icon={Home}>
                               <Select value={form.compoundType} onValueChange={v => patchForm({ compoundType: v })}>
                                 <SelectTrigger className="h-14 rounded-2xl px-6 font-bold"><SelectValue /></SelectTrigger>
                                 <SelectContent className="rounded-2xl">
                                   <SelectItem value="standalone">Private Villa/Standalone</SelectItem>
                                   <SelectItem value="compound-shared">Shared Compound House</SelectItem>
                                   <SelectItem value="gated-community">Secured Gated Community</SelectItem>
                                 </SelectContent>
                               </Select>
                            </PulseField>
                          </div>
                        )}
                      </div>
                    </StepWrapper>
                  )}

                  {/* STEP 3: AMENITIES */}
                  {step === 3 && (
                    <StepWrapper title="Utilities & Resilience" description="Describe your property's backup systems and connectivity.">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        <PulseField label="BACKUP POWER" icon={Zap} help="Vital info for professionals and students.">
                           <Select value={form.backupPower} onValueChange={v => patchForm({ backupPower: v })}>
                             <SelectTrigger className="h-14 rounded-2xl px-5 font-bold"><SelectValue /></SelectTrigger>
                             <SelectContent className="rounded-2xl">
                               <SelectItem value="None">No Backup</SelectItem>
                               <SelectItem value="Generator">Gas/Diesel Generator</SelectItem>
                               <SelectItem value="Solar">Eco Solar Setup</SelectItem>
                               <SelectItem value="Inverter">Battery Inverter</SelectItem>
                             </SelectContent>
                           </Select>
                        </PulseField>

                        <PulseField label="WATER FLOW" icon={Droplets}>
                           <Select value={form.waterReliability} onValueChange={v => patchForm({ waterReliability: v })}>
                             <SelectTrigger className="h-14 rounded-2xl px-5 font-bold"><SelectValue /></SelectTrigger>
                             <SelectContent className="rounded-2xl">
                               <SelectItem value="Regular">Municipal Only</SelectItem>
                               <SelectItem value="Polytank">Polytank Reserve</SelectItem>
                               <SelectItem value="Constant">Deep Borehole/Constant</SelectItem>
                             </SelectContent>
                           </Select>
                        </PulseField>

                        <PulseField label="CONNECTIVITY" icon={Wifi}>
                           <Select value={form.internetType} onValueChange={v => patchForm({ internetType: v })}>
                             <SelectTrigger className="h-14 rounded-2xl px-5 font-bold"><SelectValue /></SelectTrigger>
                             <SelectContent className="rounded-2xl">
                               <SelectItem value="None">None Provided</SelectItem>
                               <SelectItem value="basic-wifi">Basic 4G Wi-Fi</SelectItem>
                               <SelectItem value="Fibre">High-Speed Fibre</SelectItem>
                               <SelectItem value="Starlink">Starlink Satellite</SelectItem>
                             </SelectContent>
                           </Select>
                        </PulseField>
                      </div>

                      <div className="space-y-8">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Advanced Features</h4>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ToggleCard label="Air Conditioning" desc="Operational AC in units" icon={Zap} value={form.airConditioning} onChange={v => patchForm({ airConditioning: v })} />
                            <ToggleCard label="Secured Parking" desc="On-site parking available" icon={Car} value={form.parkingAvailable} onChange={v => patchForm({ parkingAvailable: v })} />
                         </div>

                         <div className="pt-6">
                            <PulseField label="GENERAL AMENITIES" icon={Sparkles} help="Select all that apply to your property.">
                               <div className="flex flex-wrap gap-2 mt-4">
                                  {AMENITIES.map(item => {
                                    const Icon = item.icon;
                                    const active = form.amenities.includes(item.id);
                                    return (
                                      <button key={item.id} onClick={() => toggleList("amenities", item.id)}
                                        className={cn("flex items-center gap-2 px-4 py-2.5 rounded-full border text-[11px] font-black uppercase tracking-widest transition-all",
                                          active ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" : "bg-muted/30 border-border/50 text-muted-foreground/60 hover:border-primary/20")}>
                                        <Icon className="w-3.5 h-3.5" /> {item.label}
                                      </button>
                                    );
                                  })}
                               </div>
                            </PulseField>
                         </div>

                         <div className="pt-6">
                            <PulseField label="SAFETY & GOVERNANCE" icon={Shield}>
                               <div className="flex flex-wrap gap-2 mt-4">
                                  {SECURITY_FEATURES.map(item => {
                                    const active = form.securityFeatures.includes(item.id);
                                    return (
                                      <button key={item.id} onClick={() => toggleList("securityFeatures", item.id)}
                                        className={cn("flex items-center gap-2 px-4 py-2.5 rounded-full border text-[11px] font-black uppercase tracking-widest transition-all",
                                          active ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" : "bg-muted/30 border-border/50 text-muted-foreground/60 hover:border-primary/20")}>
                                        {item.label}
                                      </button>
                                    );
                                  })}
                               </div>
                            </PulseField>
                         </div>
                      </div>
                    </StepWrapper>
                  )}

                  {/* STEP 4: RULES */}
                  {step === 4 && (
                    <StepWrapper title="Governance & Access" description="Standard policies for your future tenants.">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                         <ToggleCard label="Cooking Policy" desc="Tenants can prepare meals" icon={UtensilsCrossed} value={form.cookingAllowed} onChange={v => patchForm({ cookingAllowed: v })} />
                         <ToggleCard label="Child Policy" desc="Property is family-friendly" icon={Baby} value={form.childrenAllowed} onChange={v => patchForm({ childrenAllowed: v })} />
                         {(form.category === 'guest-house' || form.category === 'hotel-room') && (
                           <ToggleCard label="Catering" desc="Daily breakfast included" icon={UtensilsCrossed} value={form.breakfastIncluded} onChange={v => patchForm({ breakfastIncluded: v })} />
                         )}
                      </div>

                      <div className="space-y-10">
                         <PulseField label="TRANSPORT GOVERNANCE" icon={Car} help="What options are within 5 mins walk?">
                            <div className="flex flex-wrap gap-2 mt-4">
                               {TRANSPORT_OPTIONS.map(item => {
                                  const active = form.transportAccess.includes(item.id);
                                  return (
                                    <button key={item.id} onClick={() => toggleList("transportAccess", item.id)}
                                      className={cn("flex items-center gap-2 px-4 py-2.5 rounded-full border text-[11px] font-black uppercase tracking-widest transition-all",
                                        active ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-muted/30 border-border/50 text-muted-foreground/60")}>
                                      {item.label}
                                    </button>
                                  );
                               })}
                            </div>
                         </PulseField>

                         <PulseField label="DETAILED HOUSE RULES" icon={Edit3} help="Rules are shown to tenants before they book. Use clear, direct language.">
                            <Textarea
                              value={form.rules.join('\n')}
                              onChange={e => patchForm({ rules: e.target.value.split('\n').filter(x => x.trim() !== '') })}
                              rows={6}
                              className="mt-4 rounded-[2rem] bg-muted/30 border-border/50 p-6 font-bold tabular-nums resize-none text-sm placeholder:italic"
                              placeholder="1. Keep noise levels low after 10 PM&#10;2. No unauthorized guests overnight"
                            />
                         </PulseField>
                      </div>
                    </StepWrapper>
                  )}

                  {/* STEP 5: PRICING */}
                  {step === 5 && (
                    <StepWrapper title="Financial Strategy" description="Define your rent and payment expectations.">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <PulseField label="BASE RENT AMOUNT (GHS)" icon={Banknote}>
                           <div className="relative">
                              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-muted-foreground/40">GH₵</span>
                              <Input type="number" value={form.price} onChange={e => patchForm({ price: e.target.value })} className="h-20 rounded-3xl pl-20 pr-6 text-3xl font-black tabular-nums bg-muted/30 border-border/50" />
                           </div>
                        </PulseField>

                        <PulseField label="BILLING CYCLE" icon={Clock}>
                           <Select value={form.priceUnit} onValueChange={v => patchForm({ priceUnit: v })}>
                             <SelectTrigger className="h-20 rounded-3xl px-8 font-black text-lg"><SelectValue /></SelectTrigger>
                             <SelectContent className="rounded-2xl">
                               {getPricePeriodOptions(form.category).map(o => <SelectItem key={o.value} value={o.value} className="font-bold">{o.label}</SelectItem>)}
                             </SelectContent>
                           </Select>
                        </PulseField>

                        <PulseField label="RENTAL ADVANCE" icon={History} help="Months of rent required upfront.">
                           <Select value={form.advanceMonths} onValueChange={v => patchForm({ advanceMonths: v })}>
                             <SelectTrigger className="h-14 rounded-2xl px-6 font-bold"><SelectValue /></SelectTrigger>
                             <SelectContent className="rounded-2xl">
                               <SelectItem value="1">1 Month</SelectItem>
                               <SelectItem value="6">6 Months</SelectItem>
                               <SelectItem value="12">1 Year</SelectItem>
                               <SelectItem value="24">2 Years</SelectItem>
                             </SelectContent>
                           </Select>
                        </PulseField>

                        <PulseField label="REFUNDABLE DEPOSIT" icon={Shield} help="Secures property against damages.">
                           <div className="relative">
                              <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-muted-foreground/40">GH₵</span>
                              <Input type="number" value={form.securityDeposit} onChange={e => patchForm({ securityDeposit: e.target.value })} className="h-14 rounded-2xl pl-16 pr-6 font-black tabular-nums bg-muted/30 border-border/50" placeholder="0" />
                           </div>
                        </PulseField>
                      </div>

                      <div className="mt-12 space-y-4">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Payment Governance</h4>
                         <div className="divide-y border border-border/50 rounded-[2rem] overflow-hidden">
                           <ToggleCard isRow label="Utility Inclusivity" desc="Rent amount covers all utility costs" icon={Zap} value={form.isInclusive} onChange={v => patchForm({ isInclusive: v })} />
                           <ToggleCard isRow label="Price Flexibility" desc="Open to rent negotiations" icon={Banknote} value={form.negotiableRent} onChange={v => patchForm({ negotiableRent: v })} />
                           <ToggleCard isRow label="Mobile Settlement" desc="Support MTN/Telecel/AirtelTigo MoMo" icon={Banknote} value={form.momoAccepted} onChange={v => patchForm({ momoAccepted: v })} />
                         </div>
                      </div>
                    </StepWrapper>
                  )}

                  {/* STEP 6: PHOTOS */}
                  {step === 6 && (
                    <StepWrapper title="Property Visuals" description="Upload high-resolution media to stand out.">
                      <div className="space-y-8">
                         <div className="flex items-start gap-4 p-6 rounded-[2rem] bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-900/40">
                            <div className="h-12 w-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                               <Camera className="w-6 h-6" />
                            </div>
                            <div>
                               <p className="text-sm font-black text-sky-900 dark:text-sky-300">Visual Quality Matters</p>
                               <p className="text-xs text-sky-700 dark:text-sky-400 font-medium leading-relaxed">The first image is your flagship. We recommend bright, wide-angle shots showing the best features of your property.</p>
                            </div>
                         </div>

                         <div className="p-4 rounded-[2.5rem] border border-dashed border-border/50 bg-muted/5">
                            <ImageUploader
                               images={form.images}
                               onChange={imgs => patchForm({ images: imgs })}
                               maxImages={10}
                            />
                         </div>

                         <Separator className="my-10" />

                         <PulseField label="YOUTUBE CINEMATIC TOUR" icon={Camera} help="Drop a YouTube link for a 360° or video tour.">
                            <Input
                              placeholder="https://www.youtube.com/watch?v=..."
                              value={form.youTubeVideoUrl}
                              onChange={e => patchForm({ youTubeVideoUrl: e.target.value })}
                              className="h-14 rounded-2xl px-6 font-bold text-primary bg-muted/30 border-border/50"
                            />
                            {form.youTubeVideoUrl && (
                              <div className="mt-6 rounded-[2.5rem] overflow-hidden aspect-video border-4 border-background bg-black shadow-2xl ring-1 ring-border/50">
                                 <iframe
                                  className="w-full h-full"
                                  src={`https://www.youtube.com/embed/${form.youTubeVideoUrl.split('v=')[1]?.split('&')[0] || form.youTubeVideoUrl.split('/').pop()}`}
                                  title="YouTube preview"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            )}
                         </PulseField>
                      </div>
                    </StepWrapper>
                  )}

                  {/* ── Footer Nav ─────────────────────── */}
                  <div className="flex items-center justify-between pt-16 mt-12 border-t border-border/50">
                    <Button
                      variant="ghost"
                      onClick={() => setStep(s => Math.max(0, s - 1))}
                      disabled={step === 0}
                      className="h-14 px-8 rounded-full font-black uppercase tracking-widest text-[10px] gap-2 transition-all active:scale-95 disabled:opacity-30"
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous Phase
                    </Button>

                    <div className="flex items-center gap-4">
                       <Button
                         variant="outline"
                         onClick={() => setSaveDialog(true)}
                         className="h-14 px-8 rounded-full font-black uppercase tracking-widest text-[10px] border-border/50 transition-all hover:bg-primary/5 hidden sm:flex"
                       >
                          Save Progress
                       </Button>

                       {step < STEPS.length - 1 ? (
                        <Button
                          onClick={() => setStep(s => s + 1)}
                          className="h-14 px-10 rounded-full font-black uppercase tracking-widest text-[10px] gap-2 shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                        >
                          Advance Phase <ChevronRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setSaveDialog(true)}
                          className="h-14 px-10 rounded-full font-black uppercase tracking-widest text-[10px] gap-2 shadow-2xl shadow-primary/20 bg-emerald-600 hover:bg-emerald-700 text-white transition-all hover:scale-105 active:scale-95"
                        >
                          Sync & Publish <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                </CardContent>
              </Card>
            </main>
          </div>
        </div>

        {/* ── Save Dialog Modals ──────────────── */}
        <AlertDialog open={saveDialog} onOpenChange={setSaveDialog}>
          <AlertDialogContent className="rounded-[2.5rem] p-12">
            <div className="flex flex-col items-center text-center gap-6">
               <div className="h-20 w-20 rounded-[2rem] bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <BadgeCheck className="w-10 h-10" />
               </div>
               <div className="space-y-2">
                 <AlertDialogTitle className="text-3xl font-black">Finalize Updates?</AlertDialogTitle>
                 <AlertDialogDescription className="text-base font-medium">
                   Your synchronized changes for <strong className="text-foreground">{form.name}</strong> will be published immediately to prospective tenants.
                 </AlertDialogDescription>
               </div>
               <div className="flex flex-col w-full gap-3 pt-4">
                 <AlertDialogAction
                  onClick={e => { e.preventDefault(); handleSave(); }}
                  disabled={isSubmitting}
                  className="h-14 rounded-full font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/20"
                 >
                   {isSubmitting ? "Syncing..." : "Publish Changes"}
                 </AlertDialogAction>
                 <AlertDialogCancel disabled={isSubmitting} className="h-14 rounded-full font-black uppercase tracking-widest text-[11px] border-0 hover:bg-muted">Keep Editing</AlertDialogCancel>
               </div>
            </div>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </TooltipProvider>
  );
}

// ── Refined Sub-components ───────────────────────────────────────────────────

function StepWrapper({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700 fill-mode-both">
      <div className="space-y-2">
        <h2 className="text-5xl font-black tracking-tighter leading-none">{title}</h2>
        <p className="text-lg text-muted-foreground font-medium">{description}</p>
      </div>
      {children}
    </div>
  );
}

function PulseField({ label, icon: Icon, help, children }: { label: string; icon: any; help?: string; children: any }) {
  return (
    <div className="space-y-3 group/field">
      <div className="flex items-center justify-between">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 group-focus-within/field:text-primary transition-colors">
           <Icon className="w-3.5 h-3.5 opacity-40 group-focus-within/field:opacity-100 transition-opacity" /> {label}
        </Label>
        {help && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" className="text-muted-foreground/30 hover:text-primary transition-colors"><Info className="w-3.5 h-3.5" /></button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-[11px] font-medium leading-relaxed rounded-xl p-3">{help}</TooltipContent>
          </Tooltip>
        )}
      </div>
      {children}
    </div>
  );
}

function ToggleCard({ label, desc, icon: Icon, value, onChange, isRow }: {
  label: string; desc: string; icon: any; value: boolean; onChange: (v: boolean) => void; isRow?: boolean
}) {
  if (isRow) return (
     <div className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors">
        <div className="flex items-center gap-4">
           <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all", value ? "bg-primary text-white" : "bg-muted text-muted-foreground")}>
              <Icon className="w-5 h-5" />
           </div>
           <div>
              <p className="text-sm font-bold">{label}</p>
              <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest">{desc}</p>
           </div>
        </div>
        <Switch checked={value} onCheckedChange={onChange} className="data-[state=checked]:bg-primary" />
     </div>
  );

  return (
    <div className={cn("p-6 rounded-[2rem] border transition-all duration-300 flex items-center justify-between group",
      value ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-card border-border/50 hover:border-primary/20")}>
      <div className="flex items-center gap-4">
        <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500",
          value ? "bg-primary text-white shadow-lg shadow-primary/20 rotate-6" : "bg-muted text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary")}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="font-black tracking-tight text-sm uppercase">{label}</p>
          <p className="text-[10px] font-medium text-muted-foreground/60 leading-none mt-1">{desc}</p>
        </div>
      </div>
      <Switch checked={value} onCheckedChange={onChange} className="data-[state=checked]:bg-primary" />
    </div>
  );
}

function BadgeCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function AlertTriangle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
