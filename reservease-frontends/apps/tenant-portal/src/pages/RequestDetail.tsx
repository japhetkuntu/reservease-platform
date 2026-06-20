import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { requestsApi } from "@/api/requests";
import {
  ArrowLeft, MapPin, Wallet, Home, Calendar, AlertCircle,
  Star, Edit3, CheckCircle, Zap, Droplet, ShieldCheck,
  Shield, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRequest } from "@/contexts/RequestContext";
import { paymentsApi } from "@/api/payments";
import { cn } from "@/lib/utils";
import { RequestStatusCard } from "@/components/request/RequestStatusCard";
import { AccommodationCard } from "@/components/request/AccommodationCard";
import { SearchHistory } from "@/components/request/SearchHistory";
import { Layout } from "@/components/layout/Layout";
import { AvailabilityDisclaimer } from "@/components/request/AvailabilityDisclaimer";
import { PageLoader } from "@/components/ui/PageLoader";

// ── Preference chip helper ────────────────────────────────────────────────────
function Chip({ children, color = "default" }: {
  children: React.ReactNode;
  color?: "default" | "primary" | "blue" | "green" | "amber" | "red" | "purple";
}) {
  const colors = {
    default: "bg-muted text-muted-foreground border-border",
    primary: "bg-primary/10 text-primary border-primary/20",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    green: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    red: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  };
  return (
    <span className={cn("inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-lg border", colors[color])}>
      {children}
    </span>
  );
}

// ── Preference row ────────────────────────────────────────────────────────────
function PrefRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 p-4 rounded-xl border border-border bg-background">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[10px] font-semibold uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getRequest, assignToAgent, completeRequest, refreshRequests, isLoading: isContextLoading } = useRequest();

  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPreferencesExpanded, setIsPreferencesExpanded] = useState(false);

  const cachedRequest = getRequest(id || "");

  const { data: fetchedRequest, isLoading: isDirectFetching, refetch: refetchDetail } = useQuery({
    queryKey: ["requests", id],
    queryFn: () => requestsApi.getById(id!),
    enabled: !!id,
    initialData: cachedRequest,
  });

  const request = fetchedRequest || cachedRequest;
  const isLoading = (isContextLoading && !cachedRequest) || (!!id && isDirectFetching && !fetchedRequest);

  const effectiveState = useMemo(() => {
    if (!request) return null;
    return {
      status: request.status,
      matches: request.matches || [],
      retriesRemaining: request.retriesRemaining || 0,
      totalSearches: request.totalSearches || 0,
      agentAssigned: request.agentAssigned || false,
      estimatedDelivery: request.estimatedDelivery,
      searchHistory: request.searchHistory || [],
      adminHistory: request.adminHistory || [],
      agentEscalationEnabled: request.agentEscalationEnabled || false,
    };
  }, [request]);

  const preferences = useMemo(() => {
    return request || {
      budget: { min: 500, max: 1200 }, roomType: ["Single"], location: ["Near KNUST"],
      moveInUrgency: ["Within 2 weeks"], facilities: ["WiFi", "Generator"],
      createdAt: new Date().toISOString(),
      preferredBackupPower: "any", preferredWaterReliability: "any",
      preferredUtilityMetering: "any", preferredRoadAccess: "any",
      maxAdvanceMonths: 12, maxSecurityDeposit: 0, preferredBathroomType: "any",
      verificationRequired: false, isInclusiveRequired: false,
      preferredTransportAccess: [] as string[], preferredCompoundType: "any",
      preferredInternetType: "any", momoPaymentRequired: false, negotiableRequired: false,
      cookingRequired: false, childrenAllowedRequired: false, minCampusProximity: "any",
      nearestCampus: "", breakfastRequired: false, acRequired: false,
      parkingRequired: false, preferredFurnishedStatus: "any",
    };
  }, [request]);

  const formattedDate = useMemo(() => {
    try {
      if (!preferences.createdAt) return "Unknown";
      const d = new Date(preferences.createdAt);
      if (isNaN(d.getTime())) return preferences.createdAt;
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch { return preferences.createdAt || "Unknown"; }
  }, [preferences.createdAt]);

  const handleRefineSearch = () => { if (request) navigate(`/search?refine=${id}`); };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refreshRequests(), refetchDetail()]);
      toast({ title: "Status updated", description: "Checking for new results…" });
    } catch {
      toast({ variant: "destructive", title: "Refresh failed", description: "Could not sync. Please try again." });
    } finally { setIsRefreshing(false); }
  };

  const handleRetryPayment = async () => {
    if (!id) return;
    setIsRetrying(true);
    try {
      const res = await paymentsApi.initiate({ requestId: id, paymentMethod: "momo" });
      if (res.paymentUrl) window.location.href = res.paymentUrl;
      else throw new Error("No checkout URL returned.");
    } catch (err) {
      toast({ variant: "destructive", title: "Payment failed", description: err instanceof Error ? err.message : "An error occurred" });
      setIsRetrying(false);
    }
  };

  const handleAssignAgent = async () => {
    if (!request) return;
    try {
      await assignToAgent(request.id);
      toast({ title: "Agent assigned", description: "We'll find accommodation within 24–48 hours" });
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to assign agent", description: err instanceof Error ? err.message : "An error occurred" });
    }
  };

  const handleCompleteRequest = async () => {
    if (!request) return;
    try {
      await completeRequest(request.id);
      toast({ title: "Request completed", description: "Good luck with your accommodation!" });
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to complete request", description: err instanceof Error ? err.message : "An error occurred" });
    }
  };

  const handleSaveOption = () => toast({ title: "Saved", description: "Added to your favourites" });

  // ── Loading / error states ─────────────────────────────────────────────────
  if (isLoading) {
    return <Layout><PageLoader message="Loading request details…" /></Layout>;
  }

  if (!request || !effectiveState) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
          <div className="text-center max-w-sm flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground mb-2">Request not found</h1>
              <p className="text-sm text-muted-foreground mb-6">
                This request doesn't exist or you don't have permission to view it.
              </p>
            </div>
            <Button asChild>
              <Link to="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const hasMatches = effectiveState.matches.length > 0;
  const canRefine = !hasMatches &&
    (effectiveState.retriesRemaining > 0 || !effectiveState.agentAssigned) &&
    !["no-matches-found", "assigned-to-agent", "completed", "cancelled"].includes(effectiveState.status);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] pb-24">

        {/* ── Header ── */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
          <div className="container max-w-3xl mx-auto h-14 flex items-center justify-between px-4">
            <Link to="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={16} /> Dashboard
            </Link>
            <span className="text-sm font-semibold text-foreground capitalize">
              {effectiveState.status.replace(/-/g, " ")}
            </span>
            <div className="w-20" />
          </div>
        </header>

        {/* ── Main content ── */}
        <main className="container max-w-3xl mx-auto px-4 py-6 space-y-5">

          {/* Status card (unchanged component) */}
          <RequestStatusCard
            requestId={id || ""} createdAt={formattedDate}
            status={effectiveState.status} matches={effectiveState.matches.length}
            retriesRemaining={effectiveState.retriesRemaining}
            agentAssigned={effectiveState.agentAssigned || false}
            showRefineOption={canRefine} onRefineSearch={handleRefineSearch}
            onAssignAgent={handleAssignAgent} onRetryPayment={handleRetryPayment}
            isRetrying={isRetrying} onRefresh={handleRefresh} isRefreshing={isRefreshing}
            agentEscalationEnabled={effectiveState.agentEscalationEnabled}
          />

          {/* ── Preferences accordion ── */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => setIsPreferencesExpanded(!isPreferencesExpanded)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex flex-col items-start gap-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">Your Preferences</span>
                  <ChevronDown size={14} className={cn("text-muted-foreground transition-transform duration-200", isPreferencesExpanded && "rotate-180")} />
                </div>
                {!isPreferencesExpanded && (
                  <div className="flex flex-wrap gap-1.5">
                    <Chip>{preferences.location[0]}</Chip>
                    <Chip>GHS {preferences.budget.max.toLocaleString()}</Chip>
                    <Chip>{preferences.roomType[0]}</Chip>
                    {preferences.facilities.length > 0 && (
                      <Chip color="primary">+{preferences.facilities.length} more</Chip>
                    )}
                  </div>
                )}
              </div>
              {canRefine && (
                <Button variant="outline" size="sm" className="hidden md:flex h-8 text-xs rounded-lg ml-4 flex-shrink-0"
                  onClick={(e) => { e.stopPropagation(); handleRefineSearch(); }}>
                  <Edit3 className="h-3.5 w-3.5 mr-1.5" /> Edit
                </Button>
              )}
            </button>

            <AnimatePresence>
              {isPreferencesExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0.6 }}
                  animate={{ height: "auto", opacity: 1, transition: { duration: 0.2 } }}
                  exit={{ height: 0, opacity: 0.6, transition: { duration: 0.15 } }}
                  className="overflow-hidden border-t border-border"
                >
                  <div className="px-5 py-5 space-y-4">
                    {/* Core preferences grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <PrefRow icon={Wallet} label="Budget"
                        value={`GHS ${preferences.budget.min.toLocaleString()} – ${preferences.budget.max.toLocaleString()}`} />
                      <PrefRow icon={Home} label="Room Type"
                        value={preferences.roomType.map(t => t.trim().replace(/-/g, " ")).join(", ")} />
                      <PrefRow icon={MapPin} label="Areas"
                        value={preferences.location.join(", ")} />
                      <PrefRow icon={Calendar} label="Move-in"
                        value={preferences.moveInUrgency.map(u => u.trim().replace(/-/g, " ")).join(", ")} />

                      {preferences.preferredBackupPower && preferences.preferredBackupPower !== "any" && (
                        <PrefRow icon={Zap} label="Backup Power" value={<span className="capitalize">{preferences.preferredBackupPower}</span>} />
                      )}
                      {preferences.preferredWaterReliability && preferences.preferredWaterReliability !== "any" && (
                        <PrefRow icon={Droplet} label="Water" value={<span className="capitalize">{preferences.preferredWaterReliability}</span>} />
                      )}
                      {preferences.preferredUtilityMetering && preferences.preferredUtilityMetering !== "any" && (
                        <PrefRow icon={Zap} label="Metering" value={<span className="capitalize">{preferences.preferredUtilityMetering}</span>} />
                      )}
                      {preferences.preferredRoadAccess && preferences.preferredRoadAccess !== "any" && (
                        <PrefRow icon={MapPin} label="Road Access" value={<span className="capitalize">{preferences.preferredRoadAccess}</span>} />
                      )}
                      <PrefRow icon={Calendar} label="Max Advance" value={`${preferences.maxAdvanceMonths || 12} months`} />

                      {/* Extra options */}
                      <PrefRow icon={ShieldCheck} label="Extra Options"
                        value={
                          <div className="flex flex-wrap gap-1.5 mt-0.5">
                            {preferences.verificationRequired && <Chip color="primary">Verified Only</Chip>}
                            {preferences.isInclusiveRequired && <Chip color="purple">Bills Included</Chip>}
                            {!preferences.verificationRequired && !preferences.isInclusiveRequired && (
                              <span className="text-sm text-muted-foreground">None</span>
                            )}
                          </div>
                        }
                      />
                    </div>

                    {/* Ghana-specific chips */}
                    {(preferences.acRequired || preferences.momoPaymentRequired || preferences.negotiableRequired ||
                      preferences.cookingRequired || preferences.childrenAllowedRequired || preferences.parkingRequired ||
                      preferences.breakfastRequired || preferences.nearestCampus ||
                      (preferences.minCampusProximity && preferences.minCampusProximity !== "any") ||
                      (preferences.preferredFurnishedStatus && preferences.preferredFurnishedStatus !== "any") ||
                      (preferences.preferredCompoundType && preferences.preferredCompoundType !== "any") ||
                      (preferences.preferredInternetType && preferences.preferredInternetType !== "any") ||
                      (preferences.preferredTransportAccess && preferences.preferredTransportAccess.length > 0)
                    ) && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Additional Preferences</p>
                        <div className="flex flex-wrap gap-1.5">
                          {preferences.acRequired && <Chip color="blue">AC Required</Chip>}
                          {preferences.breakfastRequired && <Chip color="amber">Breakfast Included</Chip>}
                          {preferences.parkingRequired && <Chip>Parking</Chip>}
                          {preferences.momoPaymentRequired && <Chip color="amber">MoMo Payment</Chip>}
                          {preferences.negotiableRequired && <Chip color="green">Negotiable Price</Chip>}
                          {preferences.cookingRequired && <Chip color="red">Cooking Allowed</Chip>}
                          {preferences.childrenAllowedRequired && <Chip color="red">Children Allowed</Chip>}
                          {preferences.nearestCampus && <Chip color="primary">Near {preferences.nearestCampus}</Chip>}
                          {preferences.minCampusProximity && preferences.minCampusProximity !== "any" && (
                            <Chip color="primary">{preferences.minCampusProximity === "walking" ? "Walking Distance" : "Trotro OK"}</Chip>
                          )}
                          {preferences.preferredFurnishedStatus && preferences.preferredFurnishedStatus !== "any" && (
                            <Chip color="amber">{preferences.preferredFurnishedStatus.replace(/-/g, " ")}</Chip>
                          )}
                          {preferences.preferredCompoundType && preferences.preferredCompoundType !== "any" && (
                            <Chip>{preferences.preferredCompoundType.replace(/-/g, " ")}</Chip>
                          )}
                          {preferences.preferredInternetType && preferences.preferredInternetType !== "any" && (
                            <Chip>{preferences.preferredInternetType}</Chip>
                          )}
                          {preferences.preferredTransportAccess?.map(t => <Chip key={t}>{t}</Chip>)}
                        </div>
                      </div>
                    )}

                    {/* Facilities */}
                    {preferences.facilities && preferences.facilities.length > 0 && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Amenities</p>
                        <div className="flex flex-wrap gap-1.5">
                          {preferences.facilities.map((f) => <Chip key={f} color="primary">{f}</Chip>)}
                        </div>
                      </div>
                    )}

                    {/* Mobile edit button */}
                    {canRefine && (
                      <Button variant="outline" className="w-full h-10 rounded-xl md:hidden" onClick={handleRefineSearch}>
                        <Edit3 className="mr-2 h-4 w-4" /> Edit Preferences
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Search history ── */}
          <SearchHistory history={effectiveState.searchHistory} />

          {/* ── Activity timeline ── */}
          {effectiveState.adminHistory && effectiveState.adminHistory.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-foreground">Activity</h2>
              <div className="rounded-2xl border border-border divide-y divide-border overflow-hidden bg-card">
                {effectiveState.adminHistory.map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-4 px-5 py-4">
                    <div className="mt-0.5 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-foreground capitalize">{entry.event}</p>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {new Date(entry.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      {entry.description && <p className="text-xs text-muted-foreground leading-relaxed">{entry.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Matches ── */}
          {hasMatches && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-foreground">
                  {effectiveState.status === "alternatives-suggested" ? "Closest Available Options" : "Matched Accommodations"}
                </h2>
                <span className="text-sm text-muted-foreground">{effectiveState.matches.length} found</span>
              </div>
              {effectiveState.status === "alternatives-suggested" && (
                <p className="text-sm text-muted-foreground">We couldn't find exact matches, but here are the closest options based on your criteria.</p>
              )}
              <div className="space-y-4">
                {effectiveState.matches.map((match, index) => (
                  <AccommodationCard key={match.id} match={match} index={index} onSave={handleSaveOption} />
                ))}
              </div>
              {canRefine && hasMatches && (
                <div className="p-5 rounded-2xl bg-muted/40 border border-border text-center">
                  <p className="text-sm text-muted-foreground mb-3">Not quite what you're looking for?</p>
                  <Button onClick={handleRefineSearch} variant="outline" size="sm" className="h-9 rounded-xl">
                    <Edit3 className="mr-2 h-3.5 w-3.5" />
                    Refine search ({effectiveState.retriesRemaining} left)
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ── Post-result actions ── */}
          {hasMatches && effectiveState.status !== "completed" && (
            <div className="space-y-2 pt-2">
              <Button className="w-full h-11 rounded-xl font-semibold" onClick={handleCompleteRequest}>
                <CheckCircle className="mr-2 h-4 w-4" /> Mark as Complete
              </Button>
              <Button variant="outline" className="w-full h-11 rounded-xl font-semibold" onClick={() => setShowFeedback(true)}>
                Give Feedback
              </Button>
            </div>
          )}

          {/* ── Completed state ── */}
          {effectiveState.status === "completed" && (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Request Completed</h3>
              <p className="text-sm text-muted-foreground mb-5">Thank you for using ReservEase. Good luck with your accommodation!</p>
              <Button variant="outline" className="h-10 rounded-xl" onClick={() => navigate("/search")}>
                Start a New Search
              </Button>
            </div>
          )}

          {/* ── Feedback modal ── */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/40 p-4"
                onClick={() => setShowFeedback(false)}
              >
                <motion.div
                  initial={{ y: 60, opacity: 0.6 }}
                  animate={{ y: 0, opacity: 1, transition: { duration: 0.2 } }}
                  exit={{ y: 60, opacity: 0.6, transition: { duration: 0.15 } }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-md bg-background rounded-t-2xl sm:rounded-2xl p-7 border border-border shadow-xl"
                >
                  <h3 className="text-xl font-bold text-foreground mb-2">How was your experience?</h3>
                  <p className="text-sm text-muted-foreground mb-7">Rate your search results and share your experience.</p>

                  <div className="flex justify-center gap-2 mb-7">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setRating(star)} className="p-1 transition-transform hover:scale-110">
                        <Star className={cn("h-8 w-8 transition-colors",
                          star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                        )} />
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full h-11 rounded-xl font-semibold" onClick={() => {
                      toast({ title: "Thank you!", description: "Your feedback has been submitted" });
                      setShowFeedback(false);
                    }}>
                      Submit Feedback
                    </Button>
                    <Button variant="ghost" className="w-full h-10 text-muted-foreground" onClick={() => setShowFeedback(false)}>
                      Skip for now
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      </div>
    </Layout>
  );
}