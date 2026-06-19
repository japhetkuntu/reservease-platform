import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { requestsApi } from "@/api/requests";
import {
  ArrowLeft,
  MapPin,
  Wallet,
  Home,
  Calendar,
  AlertCircle,
  Star,
  Edit3,
  CheckCircle,
  Zap,
  Droplet,
  ShieldCheck,
  Shield,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRequest, RequestStatus, AccommodationMatch, SearchAttempt } from "@/contexts/RequestContext";
import { paymentsApi } from "@/api/payments";

import { cn } from "@/lib/utils";
import { RequestStatusCard } from "@/components/request/RequestStatusCard";
import { AccommodationCard } from "@/components/request/AccommodationCard";
import { SearchHistory } from "@/components/request/SearchHistory";
import { Layout } from "@/components/layout/Layout";
import { AvailabilityDisclaimer } from "@/components/request/AvailabilityDisclaimer";
import { PageLoader } from "@/components/ui/PageLoader";

function PulseBackground() {
  return null;
}

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

  // First try to resolve from context cache
  const cachedRequest = getRequest(id || "");

  // If missing from partial pagination cache, fetch directly
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
      budget: { min: 500, max: 1200 },
      roomType: ["Single"],
      location: ["Near KNUST"],
      moveInUrgency: ["Within 2 weeks"],
      facilities: ["WiFi", "Generator"],
      createdAt: new Date().toISOString(),
      preferredBackupPower: "any",
      preferredWaterReliability: "any",
      preferredUtilityMetering: "any",
      preferredRoadAccess: "any",
      maxAdvanceMonths: 12,
      maxSecurityDeposit: 0,
      preferredBathroomType: "any",
      verificationRequired: false,
      isInclusiveRequired: false,
      // Ghana-specific fallback defaults
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
  }, [request]);

  const formattedDate = useMemo(() => {
    try {
      if (!preferences.createdAt) return "Unknown";
      const date = new Date(preferences.createdAt);
      if (isNaN(date.getTime())) return preferences.createdAt;
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return preferences.createdAt || "Unknown";
    }
  }, [preferences.createdAt]);


  const handleSaveOption = (recId: string) => {
    toast({
      title: "Saved",
      description: "Added to your favorites",
    });
  };

  const handleRefineSearch = () => {
    if (!request) return;
    navigate(`/search?refine=${id}`);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refresh both the list in context and the specific detail query
      await Promise.all([
        refreshRequests(),
        refetchDetail()
      ]);
      toast({
        title: "Status Updated",
        description: "Checking for new results...",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Refresh Failed",
        description: "Could not sync with server. Please try again.",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRetryPayment = async () => {
    if (!id) return;
    setIsRetrying(true);
    try {
      const res = await paymentsApi.initiate({ requestId: id, paymentMethod: "momo" });
      if (res.paymentUrl) {
        window.location.href = res.paymentUrl;
      } else {
        throw new Error("No checkout URL returned from server.");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Payment Restart Failed",
        description: err instanceof Error ? err.message : "An error occurred",
      });
      setIsRetrying(false);
    }
  };

  const handleAssignAgent = async () => {
    if (!request) return;
    try {
      await assignToAgent(request.id);
      toast({
        title: "Agent Assigned",
        description: "We'll find an accommodation for you within 24-48 hours",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to assign agent",
        description: err instanceof Error ? err.message : "An error occurred",
      });
    }
  };

  const handleCompleteRequest = async () => {
    if (!request) return;
    try {
      await completeRequest(request.id);
      toast({
        title: "Request Completed",
        description: "Good luck with your accommodation!",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to complete request",
        description: err instanceof Error ? err.message : "An error occurred",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <PulseBackground />
        <PageLoader message="Loading request details..." />
      </Layout>
    );
  }

  if (!request || !effectiveState) {
    return (
      <Layout>
        <PulseBackground />
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
              <Link to="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const hasMatches = effectiveState.matches.length > 0;

  const canRefine = !hasMatches &&
                    (effectiveState.retriesRemaining > 0 || !effectiveState.agentAssigned) &&
                    effectiveState.status !== "no-matches-found" &&
                    effectiveState.status !== "assigned-to-agent" &&
                    effectiveState.status !== "completed" &&
                    effectiveState.status !== "cancelled";

  const showRefineOption = canRefine;

  return (
    <Layout>
      <PulseBackground />
      <div className="min-h-[calc(100vh-4rem)] pb-24">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container h-14 flex items-center justify-between">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Dashboard</span>
            </Link>

            <span className="text-sm font-medium text-foreground capitalize">{effectiveState.status.replace(/-/g, " ")}</span>

            <div className="w-20" />
          </div>
        </header>

        <main className="container py-6 space-y-6 max-w-3xl mx-auto px-4">
        {/* Status Card */}
        <RequestStatusCard
          requestId={id || ""}
          createdAt={formattedDate}
          status={effectiveState.status}
          matches={effectiveState.matches.length}
          retriesRemaining={effectiveState.retriesRemaining}
          agentAssigned={effectiveState.agentAssigned || false}
          showRefineOption={showRefineOption}
          onRefineSearch={handleRefineSearch}
          onAssignAgent={handleAssignAgent}
          onRetryPayment={handleRetryPayment}
          isRetrying={isRetrying}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          agentEscalationEnabled={effectiveState.agentEscalationEnabled}
        />


        {/* Your Preferences */}
        <div className="space-y-0">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setIsPreferencesExpanded(!isPreferencesExpanded)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-foreground">Your Preferences</h2>
                  <ChevronDown size={14} className={cn("text-muted-foreground transition-transform", isPreferencesExpanded && "rotate-180")} />
                </div>
                {!isPreferencesExpanded && (
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground">
                      {preferences.location[0]}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground">
                      GHS {preferences.budget.max.toLocaleString()}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground">
                      {preferences.roomType[0]}
                    </span>
                    {preferences.facilities.length > 0 && (
                      <span className="text-xs px-2 py-0.5 bg-primary/10 rounded text-primary">
                        +{preferences.facilities.length} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {canRefine && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex h-8 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRefineSearch();
                    }}
                  >
                    <Edit3 className="h-3.5 w-3.5 mr-1.5" />
                    Edit
                  </Button>
                )}
              </div>
            </button>

          <AnimatePresence>
            {isPreferencesExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden border-t border-border"
              >
                <div className="px-5 py-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Wallet className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium uppercase tracking-wide">Budget</span>
                      </div>
                      <p className="font-semibold text-foreground">
                        GHS {preferences.budget.min.toLocaleString()} – {preferences.budget.max.toLocaleString()}
                      </p>
                    </div>

                    <div className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Home className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium uppercase tracking-wide">Room Type</span>
                      </div>
                      <p className="font-semibold text-foreground capitalize">
                        {preferences.roomType.map(t => t.trim().replace(/-/g, " ")).join(", ")}
                      </p>
                    </div>

                    <div className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium uppercase tracking-wide">Areas</span>
                      </div>
                      <p className="font-semibold text-foreground leading-snug">{preferences.location.join(", ")}</p>
                    </div>

                    <div className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium uppercase tracking-wide">Move-in</span>
                      </div>
                      <p className="font-semibold text-foreground capitalize">
                        {preferences.moveInUrgency.map(u => u.trim().replace(/-/g, " ")).join(", ")}
                      </p>
                    </div>

                    {preferences.preferredBackupPower && preferences.preferredBackupPower !== 'any' && (
                      <div className="border border-border rounded-lg p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <Zap className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium uppercase tracking-wide">Backup Power</span>
                        </div>
                        <p className="font-semibold text-foreground capitalize">{preferences.preferredBackupPower}</p>
                      </div>
                    )}

                    {preferences.preferredWaterReliability && preferences.preferredWaterReliability !== 'any' && (
                      <div className="border border-border rounded-lg p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <Droplet className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium uppercase tracking-wide">Water</span>
                        </div>
                        <p className="font-semibold text-foreground capitalize">{preferences.preferredWaterReliability}</p>
                      </div>
                    )}

                    {preferences.preferredUtilityMetering && preferences.preferredUtilityMetering !== 'any' && (
                      <div className="border border-border rounded-lg p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <Zap className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium uppercase tracking-wide">Metering</span>
                        </div>
                        <p className="font-semibold text-foreground capitalize">{preferences.preferredUtilityMetering}</p>
                      </div>
                    )}

                    {preferences.preferredRoadAccess && preferences.preferredRoadAccess !== 'any' && (
                      <div className="border border-border rounded-lg p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <MapPin className="h-3.5 w-3.5" />
                          <span className="text-xs font-medium uppercase tracking-wide">Road Access</span>
                        </div>
                        <p className="font-semibold text-foreground capitalize">{preferences.preferredRoadAccess}</p>
                      </div>
                    )}

                    <div className="border border-border rounded-lg p-4">
                       <div className="flex items-center gap-2 text-muted-foreground mb-2">
                         <Calendar className="h-3.5 w-3.5" />
                         <span className="text-xs font-medium uppercase tracking-wide">Max Advance</span>
                       </div>
                       <p className="font-semibold text-foreground">{preferences.maxAdvanceMonths || 12} months</p>
                    </div>

                    <div className="border border-border rounded-lg p-4">
                       <div className="flex items-center gap-2 text-muted-foreground mb-2">
                         <Wallet className="h-3.5 w-3.5" />
                         <span className="text-xs font-medium uppercase tracking-wide">Extra Options</span>
                       </div>
                       <div className="flex flex-wrap gap-1.5">
                         {preferences.verificationRequired && <span className="text-xs font-medium text-primary px-2 py-0.5 bg-primary/10 rounded">Verified Only</span>}
                         {preferences.isInclusiveRequired && <span className="text-xs font-medium text-purple-500 px-2 py-0.5 bg-purple-500/10 rounded">Bills Included</span>}
                         {!preferences.verificationRequired && !preferences.isInclusiveRequired && <span className="text-sm text-muted-foreground">None</span>}
                       </div>
                    </div>

                    {/* Ghana-Specific Preferences */}
                    {(preferences.acRequired || preferences.momoPaymentRequired || preferences.negotiableRequired ||
                      preferences.cookingRequired || preferences.childrenAllowedRequired || preferences.parkingRequired ||
                      preferences.breakfastRequired || preferences.nearestCampus || preferences.minCampusProximity ||
                      preferences.preferredFurnishedStatus || preferences.preferredCompoundType ||
                      preferences.preferredInternetType || (preferences.preferredTransportAccess && preferences.preferredTransportAccess.length > 0)) && (
                      <div className="col-span-1 sm:col-span-2 border border-border rounded-lg p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">Additional Preferences</p>
                        <div className="flex flex-wrap gap-1.5">
                          {preferences.acRequired && <span className="text-xs font-medium px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded border border-blue-500/20">AC Required</span>}
                          {preferences.breakfastRequired && <span className="text-xs font-medium px-2 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded border border-orange-500/20">Breakfast Included</span>}
                          {preferences.parkingRequired && <span className="text-xs font-medium px-2 py-1 bg-muted text-muted-foreground rounded border border-border">Parking</span>}
                          {preferences.momoPaymentRequired && <span className="text-xs font-medium px-2 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded border border-yellow-500/20">MoMo Payment</span>}
                          {preferences.negotiableRequired && <span className="text-xs font-medium px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded border border-green-500/20">Negotiable Price</span>}
                          {preferences.cookingRequired && <span className="text-xs font-medium px-2 py-1 bg-red-500/10 text-red-600 dark:text-red-400 rounded border border-red-500/20">Cooking Allowed</span>}
                          {preferences.childrenAllowedRequired && <span className="text-xs font-medium px-2 py-1 bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded border border-pink-500/20">Children Allowed</span>}
                          {preferences.nearestCampus && <span className="text-xs font-medium px-2 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded border border-indigo-500/20">Near {preferences.nearestCampus}</span>}
                          {preferences.minCampusProximity && preferences.minCampusProximity !== 'any' && <span className="text-xs font-medium px-2 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded border border-indigo-500/20">{preferences.minCampusProximity === 'walking' ? 'Walking Distance' : 'Trotro OK'}</span>}
                          {preferences.preferredFurnishedStatus && preferences.preferredFurnishedStatus !== 'any' && <span className="text-xs font-medium px-2 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded border border-amber-500/20">{preferences.preferredFurnishedStatus.replace(/-/g, ' ')}</span>}
                          {preferences.preferredCompoundType && preferences.preferredCompoundType !== 'any' && <span className="text-xs font-medium px-2 py-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded border border-teal-500/20">{preferences.preferredCompoundType.replace(/-/g, ' ')}</span>}
                          {preferences.preferredInternetType && preferences.preferredInternetType !== 'any' && <span className="text-xs font-medium px-2 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded border border-cyan-500/20">{preferences.preferredInternetType}</span>}
                          {preferences.preferredTransportAccess && preferences.preferredTransportAccess.map(t => (
                            <span key={t} className="text-xs font-medium px-2 py-1 bg-muted text-muted-foreground rounded border border-border">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {canRefine && (
                    <div className="mt-4 md:hidden">
                      <Button variant="outline" className="w-full h-10" onClick={handleRefineSearch}>
                        <Edit3 className="mr-2 h-4 w-4" /> Edit Preferences
                      </Button>
                    </div>
                  )}
                </div>

                {preferences.facilities && preferences.facilities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 px-5 pb-5">
                    {preferences.facilities.map((f) => (
                      <span
                        key={f}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </div>

        {/* Search History */}
        <SearchHistory history={effectiveState.searchHistory} />

        {/* Activity Timeline */}
        {effectiveState.adminHistory && effectiveState.adminHistory.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Activity</h2>
            <div className="border border-border rounded-lg divide-y divide-border overflow-hidden">
               {effectiveState.adminHistory.map((entry, idx) => (
                 <div key={idx} className="flex items-start gap-4 px-4 py-3.5">
                    <div className="mt-0.5 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                       <CheckCircle className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center justify-between gap-2 mb-0.5">
                         <p className="text-sm font-medium text-foreground capitalize">{entry.event}</p>
                         <span className="text-xs text-muted-foreground shrink-0">
                           {new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                         </span>
                       </div>
                       {entry.description && <p className="text-xs text-muted-foreground leading-relaxed">{entry.description}</p>}
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {hasMatches && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">
                {effectiveState.status === "alternatives-suggested"
                  ? "Closest Available Options"
                  : "Matched Accommodations"}
              </h2>
              <span className="text-sm text-muted-foreground">{effectiveState.matches.length} found</span>
            </div>

            {effectiveState.status === "alternatives-suggested" && (
              <p className="text-sm text-muted-foreground">
                We couldn't find exact matches, but here are the closest options based on your criteria.
              </p>
            )}

            <div className="space-y-4">
              {effectiveState.matches.map((match, index) => (
                <AccommodationCard
                  key={match.id}
                  match={match}
                  index={index}
                  onSave={handleSaveOption}
                />
              ))}
            </div>

            {/* Still want more options? - Only show if can refine AND has matches already */}
            {canRefine && hasMatches && (
              <div className="p-4 rounded-lg bg-muted/30 border border-border text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Not quite what you're looking for?
                </p>
                <Button onClick={handleRefineSearch} variant="outline" size="sm">
                  <Edit3 className="mr-2 h-3.5 w-3.5" />
                  Refine search ({effectiveState.retriesRemaining} left)
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Post-Result Actions */}
        {hasMatches && effectiveState.status !== "completed" && (
          <div className="space-y-2 pt-2">
            <Button
              className="w-full"
              onClick={handleCompleteRequest}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Complete
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowFeedback(true)}
            >
              Give Feedback
            </Button>
          </div>
        )}

        {/* Completed State */}
        {effectiveState.status === "completed" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-success/5 border border-success/20 rounded-xl p-5 text-center"
          >
            <CheckCircle className="h-10 w-10 text-success mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-1">Request Completed</h3>
            <p className="text-sm text-muted-foreground">
              Thank you for using ReservEase. Good luck with your accommodation!
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate("/search")}
            >
              Start a New Search
            </Button>
          </motion.div>
        )}

        {/* Feedback Modal */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/50 p-4"
              onClick={() => setShowFeedback(false)}
            >
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-background rounded-t-2xl sm:rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-foreground mb-2">
                  How was your experience?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Rate your search results and share your experience
                </p>

                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setRating(star)} className="p-1">
                      <Star
                        className={cn(
                          "h-8 w-8 transition-colors",
                          star <= rating ? "fill-warning text-warning" : "text-muted"
                        )}
                      />
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() => {
                      toast({ title: "Thank you!", description: "Your feedback has been submitted" });
                      setShowFeedback(false);
                    }}
                  >
                    Submit Feedback
                  </Button>
                  <Button variant="ghost" className="w-full" onClick={() => setShowFeedback(false)}>
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
