import { motion } from "framer-motion";
import { Check, Clock, RefreshCw, User, Edit3, Loader2, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RequestStatus } from "@/contexts/RequestContext";

const statusConfig: Record<RequestStatus, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
}> = {
  draft: {
    label: "Draft", color: "text-muted-foreground", bgColor: "bg-muted/50",
    borderColor: "border-border/50", glowColor: "group-hover:border-muted/40"
  },
  "pending-payment": {
    label: "Action Required", color: "text-amber-500", bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20", glowColor: "group-hover:border-amber-500/40"
  },
  "waiting-payment-confirmation": {
    label: "Verifying", color: "text-blue-500", bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20", glowColor: "group-hover:border-blue-500/40"
  },
  "payment-failed": {
    label: "Payment Failed", color: "text-destructive", bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20", glowColor: "group-hover:border-destructive/40"
  },
  paid: {
    label: "Paid", color: "text-emerald-500", bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20", glowColor: "group-hover:border-emerald-500/40"
  },
  processing: {
    label: "Searching", color: "text-primary", bgColor: "bg-primary/10",
    borderColor: "border-primary/20", glowColor: "group-hover:border-primary/40"
  },
  "matches-found": {
    label: "Matches Found", color: "text-emerald-500", bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20", glowColor: "group-hover:border-emerald-500/40"
  },
  "no-matches-found": {
    label: "No Matches", color: "text-destructive", bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20", glowColor: "group-hover:border-destructive/40"
  },
  "alternatives-suggested": {
    label: "Alternatives Available", color: "text-amber-500", bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20", glowColor: "group-hover:border-amber-500/40"
  },
  "assigned-to-agent": {
    label: "Agent Assigned", color: "text-primary", bgColor: "bg-primary/10",
    borderColor: "border-primary/20", glowColor: "group-hover:border-primary/40"
  },
  completed: {
    label: "Completed", color: "text-emerald-500", bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20", glowColor: "group-hover:border-emerald-500/40"
  },
  cancelled: {
    label: "Cancelled", color: "text-muted-foreground", bgColor: "bg-muted/50",
    borderColor: "border-border/50", glowColor: "group-hover:border-muted/40"
  },
};

interface RequestStatusCardProps {
  requestId: string;
  createdAt: string;
  status: RequestStatus;
  matches: number;
  retriesRemaining: number;
  agentAssigned: boolean;
  estimatedDelivery?: string;
  showRefineOption: boolean;
  onRefineSearch: () => void;
  onAssignAgent: () => void;
  onRetryPayment?: () => void;
  isRetrying?: boolean;
  agentEscalationEnabled?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function RequestStatusCard({
  requestId,
  createdAt,
  status,
  matches,
  retriesRemaining,
  agentAssigned,
  estimatedDelivery,
  showRefineOption,
  onRefineSearch,
  onAssignAgent,
  onRetryPayment,
  isRetrying = false,
  agentEscalationEnabled = true,
  onRefresh,
  isRefreshing = false,
}: RequestStatusCardProps) {
  const statusInfo = statusConfig[status] || {
    label: status || "Unknown", color: "text-muted-foreground", bgColor: "bg-muted/50", borderColor: "border-border/50", emoji: "❓", glowColor: "group-hover:border-border/50/20"
  };
  const hasMatches = matches > 0;
  const isLocked = status === "processing" || status === "waiting-payment-confirmation";

  const showNoMatchesState =
    status === "no-matches-found" ||
    (
      !hasMatches &&
      !isLocked &&
      status !== "draft" &&
      status !== "pending-payment" &&
      status !== "payment-failed" &&
      status !== "paid" &&
      status !== "alternatives-suggested" &&
      status !== "assigned-to-agent" &&
      status !== "completed"
    );

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Status Badge & Title */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-2">
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full border",
              statusInfo.bgColor,
              statusInfo.borderColor || "border-border/50"
            )}>
              <div className={cn("w-1.5 h-1.5 rounded-full", statusInfo.color.replace("text-", "bg-"))} />
              <span className={cn("text-xs font-medium", statusInfo.color)}>
                {statusInfo.label}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {createdAt}
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className="font-mono">{requestId.substring(0, 10)}…</span>
            </div>
          </div>

          {status === "processing" && onRefresh && (
            <Button
              onClick={onRefresh}
              variant="outline"
              size="sm"
              className="h-8 text-xs shrink-0"
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", isRefreshing && "animate-spin")} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="px-5 py-4 space-y-4">
          {/* Results Found State */}
          {hasMatches && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Check className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {matches} match{matches > 1 ? 'es' : ''} found
                </p>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                  Review your options below.
                </p>
              </div>
            </div>
          )}

          {/* Payment Failed State */}
          {status === "payment-failed" && (
            <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">Payment failed</h3>
                  <p className="text-sm text-muted-foreground">
                    Something went wrong during checkout. Please retry below.
                  </p>
                </div>
              </div>
              <Button
                onClick={onRetryPayment}
                variant="destructive"
                size="sm"
                className="w-full sm:w-auto"
                disabled={isRetrying}
              >
                {isRetrying ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                {isRetrying ? "Processing..." : "Retry Payment"}
              </Button>
            </div>
          )}

          {/* Search Processing / UI Locked State */}
          {isLocked && !hasMatches && (
            <div className="p-6 rounded-lg bg-muted/30 border border-border text-center">
              <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center mx-auto mb-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">
                {status === "waiting-payment-confirmation" ? "Verifying payment" : "Searching for accommodations"}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {status === "waiting-payment-confirmation"
                  ? "We're confirming your payment. This usually takes less than a minute."
                  : "We're scanning verified listings to find your best match."}
              </p>
            </div>
          )}

          {/* No Matches Yet */}
          {showNoMatchesState && (
            <div className="p-6 rounded-lg bg-muted/30 border border-dashed border-border text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">No matches found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                We couldn't find an exact match. Our team is reviewing your request.
              </p>
              {agentEscalationEnabled && (
                <div className="mt-4">
                  <Button onClick={onAssignAgent} variant="outline" size="sm">
                    <User className="mr-2 h-3.5 w-3.5" />
                    Assign an Agent
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Agent Assigned */}
          {agentAssigned && !hasMatches && status !== "completed" && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Agent assigned</h3>
                  <p className="text-sm text-muted-foreground">
                    Our team is manually sourcing the best options for you. Expected by{" "}
                    <span className="text-primary font-medium">{estimatedDelivery || "48 hours"}</span>.
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>You'll be notified via WhatsApp</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}
