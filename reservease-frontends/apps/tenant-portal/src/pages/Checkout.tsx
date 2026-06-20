import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Shield,
  Check,
  Loader2,
  ArrowRight,
  MapPin,
  Home,
  Wallet,
  Clock,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRequest } from "@/contexts/RequestContext";
import { useAuth } from "@/contexts/AuthContext";
import { paymentsApi } from "@/api/payments";
import { PageLoader } from "@/components/ui/PageLoader";

const PRICING = {
  baseRequestFee: Number(import.meta.env.VITE_SEARCH_FEE || 25),
  processingFee: Number(import.meta.env.VITE_PROCESSING_FEE || 2.5),
  tax: 0,
  discount: 0,
};

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getRequest, refreshRequests, isLoading, submitRequest } = useRequest();
  const { isLoggedIn } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const attemptRef = useRef(false);
  const initialCheckRef = useRef(false);

  const request = getRequest(id || "");
  const total =
    PRICING.baseRequestFee + PRICING.processingFee + PRICING.tax - PRICING.discount;



  useEffect(() => {
    const processPendingRequest = async () => {
      if (id === "pending" && isLoggedIn && !attemptRef.current) {
        attemptRef.current = true;

        const cached = localStorage.getItem("pending_request");
        if (cached) {
          try {
            const requestData = JSON.parse(cached);
            setIsProcessing(true);
            const newRequest = await submitRequest(requestData);
            localStorage.removeItem("pending_request");
            // If the request is already processing (no payment required), skip checkout
            if (newRequest.status === "processing" || newRequest.discountApplied) {
              navigate(`/request/${newRequest.id}`, { replace: true });
            } else {
              navigate(`/checkout/${newRequest.id}`, { replace: true });
            }
          } catch (err) {
            toast({
              variant: "destructive",
              title: "Failed to resume request",
              description: err instanceof Error ? err.message : "An error occurred",
            });
            localStorage.removeItem("pending_request");
            navigate("/", { replace: true });
          } finally {
            setIsProcessing(false);
          }
        } else {
            navigate("/", { replace: true });
        }
      }
    };

    processPendingRequest();
  }, [id, isLoggedIn, submitRequest, navigate, toast]);

  useEffect(() => {
    // Initial verification check when landing on the page with waiting status
    if (request?.status === "waiting-payment-confirmation" && id && !initialCheckRef.current) {
      initialCheckRef.current = true;
      paymentsApi.verifyByRequestId(id)
        .then(() => refreshRequests())
        .catch(() => refreshRequests()); // Refresh anyway to get latest status
    }
  }, [id, request?.status, refreshRequests]);

  useEffect(() => {
    // Use an effect for navigation to avoid 'update while rendering' warning
    if (request && !["draft", "pending-payment", "waiting-payment-confirmation", "payment-failed"].includes(request.status)) {
      navigate(`/request/${request.id}`, { replace: true });
    }
  }, [request, navigate]);

  const handleCheckStatus = async () => {
    if (!id) return;
    setIsVerifying(true);
    try {
      await paymentsApi.verifyByRequestId(id);
      await refreshRequests();
      toast({
        title: "Status Updated",
        description: "Your payment status has been verified.",
      });
    } catch (err: unknown) {
      // If it's a 400 (verification failed at provider), show the message from backend
      const apiError = err as { message?: string };
      const message = apiError?.message || "Could not verify payment. Please try again in a moment.";
      toast({
        variant: "destructive",
        title: "Check Failed",
        description: message,
      });
      // Still refresh requests to be sure
      await refreshRequests();
    } finally {
      // Small delay for UI smoothness
      setTimeout(() => setIsVerifying(false), 1000);
    }
  };

  const handlePayment = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Create an account first",
        description: "Sign up to track your request and receive updates",
      });
      navigate("/signup", { state: { returnTo: `/checkout/${id}` } });
      return;
    }

    setIsProcessing(true);
    try {
      if (!id) throw new Error("No request ID");
      const res = await paymentsApi.initiate({ requestId: id, paymentMethod: "momo" });

      // Redirect seamlessly to the payment provider's checkout page
      if (res.paymentUrl) {
        window.location.href = res.paymentUrl;
      } else {
        throw new Error("No checkout URL returned from server.");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: err instanceof Error ? err.message : "An error occurred",
      });
      setIsProcessing(false);
    }
  };

  if (isLoading || id === "pending") {
    return <PageLoader message="Preparing your secure checkout..." />;
  }

  if (request?.status === "waiting-payment-confirmation") {
    return (
      <div className="min-h-dvh bg-background flex flex-col items-center justify-center p-6 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="max-w-md w-full space-y-8"
        >
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <motion.div
               className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"
               animate={{ rotate: 360 }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
               <Shield className="h-10 w-10 text-primary" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-foreground">Verifying Payment</h1>
            <p className="text-muted-foreground leading-relaxed">
              We're waiting for confirmation from your payment provider. This usually takes less than a minute.
            </p>
          </div>

          <div className="bg-muted/50 rounded-xl p-6 border border-border/50">
            <div className="flex items-center justify-between text-sm mb-4">
              <span className="text-muted-foreground">Status</span>
              <span className="font-bold text-primary flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Awaiting Confirmation
              </span>
            </div>
            <Button
               onClick={handleCheckStatus}
               disabled={isVerifying}
               className="w-full h-12 rounded-lg font-bold"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking Status...
                </>
              ) : (
                "Check Status"
              )}
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">
              Don't worry, your request is safe. You can also find it in your dashboard later.
            </p>
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }


  return (
    <div className="min-h-dvh bg-muted/20 pb-20 selection:bg-primary/20">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/70 transition-all">
        <div className="container max-w-6xl mx-auto flex items-center h-16 px-4 md:px-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 py-2 pl-0 pr-4 rounded-xl group"
          >
            <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            <span>Back</span>
          </button>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 max-w-2xl"
        >
          {request?.status === "payment-failed" ? (
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-destructive/10 text-destructive text-sm font-semibold mb-4">
               <AlertCircle size={14} />
               <span>Action Required</span>
             </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 text-primary text-sm font-semibold mb-4">
              <Sparkles size={14} />
              <span>Final Step</span>
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
            {request?.status === "payment-failed" ? "Retry Payment" : "Review & Checkout"}
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            {request?.status === "payment-failed"
              ? "Your previous payment attempt was unsuccessful. This is usually due to a provider timeout or insufficient funds. Please try again below to start your search."
              : "Review your preferences and complete the payment to start the search process."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* Left Column: Summary */}
          <div className="lg:col-span-7 space-y-8">

            {/* What's Included Card */}
            <motion.section
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-card border border-border/50 rounded-xl p-6 md:p-8"
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <CheckCircle2 className="text-primary h-5 w-5" />
                Service Guarantee
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Up to 3 verified matches",
                  "Dedicated Agent Support",
                  "3 free search refinements",
                  "Real-time WhatsApp updates"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-muted-foreground text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Request Summary Card */}
            {request && (
              <motion.section
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-card border border-border/50 rounded-xl p-6 md:p-8"
              >
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                  <h2 className="text-xl font-semibold">Your Setup</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary hover:bg-primary/5 font-semibold"
                    asChild
                  >
                    <Link to={`/search?refine=${id}`}>
                      Edit
                    </Link>
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">
                  {/* Item */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Location</p>
                      <p className="font-semibold text-foreground text-base">{request.location.join(", ")}</p>
                    </div>
                  </div>
                  {/* Item */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center shrink-0">
                      <Home className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Property Type</p>
                      <p className="font-semibold text-foreground text-base capitalize">
                        {request.roomType.map(t => t.trim().replace(/-/g, " ")).join(", ")}
                      </p>
                    </div>
                  </div>
                  {/* Item */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center shrink-0">
                      <Wallet className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Budget</p>
                      <p className="font-semibold text-foreground text-base">GHS {request.budget?.min?.toLocaleString()} – {request.budget?.max?.toLocaleString()}</p>
                    </div>
                  </div>
                  {/* Item */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium mb-1">Duration & Urgency</p>
                      <p className="font-semibold text-foreground text-sm capitalize mb-1">
                        <span className="text-muted-foreground/70 mr-1">Stay:</span>
                        {request.duration.map(d => d.trim().replace(/-/g, " ")).join(", ")}
                      </p>
                      <p className="font-semibold text-foreground text-sm capitalize">
                        <span className="text-muted-foreground/70 mr-1">Move-in:</span>
                        {request.moveInUrgency.map(u => u.trim().replace(/-/g, " ")).join(", ")}
                      </p>
                    </div>
                  </div>
                </div>

                {request.facilities && request.facilities.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-border/50">
                    <p className="text-sm font-semibold text-foreground mb-3">Required Facilities</p>
                    <div className="flex flex-wrap gap-2">
                      {request.facilities.map(f => (
                        <span key={f} className="px-3 py-1.5 bg-muted rounded-full text-xs font-medium text-foreground">
                          {f.charAt(0).toUpperCase() + f.slice(1)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {request.notes && (
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-foreground mb-2">Additional Notes</p>
                    <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg leading-relaxed">
                      {request.notes}
                    </p>
                  </div>
                )}
              </motion.section>
            )}
          </div>

          {/* Right Column: Sticky Payment Board */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="sticky top-24 bg-card border border-border/50 rounded-xl p-6 md:p-8"
            >
              <h2 className="text-xl font-bold mb-6">
                {request?.status === "payment-failed" ? "Payment Summary" : "Payment Summary"}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground text-sm">Search Service</span>
                  <span className="text-foreground font-semibold">GHS {PRICING.baseRequestFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground text-sm">Processing Fee</span>
                  <span className="text-foreground font-semibold">GHS {PRICING.processingFee.toFixed(2)}</span>
                </div>

                <div className="w-full h-px bg-border/50 my-2" />

                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-semibold text-foreground">Total</span>
                  <motion.span
                    key={total}
                    initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-bold text-foreground"
                  >
                    GHS {total.toFixed(2)}
                  </motion.span>
                </div>
              </div>

              <div className="mb-6">
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  size="lg"
                  className={`w-full h-12 text-base font-semibold rounded-lg ${request?.status === "payment-failed" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}`}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {request?.status === "payment-failed" ? "Restarting..." : "Initializing..."}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {request?.status === "payment-failed" ? <RefreshCw className="mr-2 h-4 w-4" /> : null}
                      {request?.status === "payment-failed" ? "Retry Payment" : "Confirm and Pay"} — GHS {total.toFixed(2)}
                    </span>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/30 py-2.5 rounded-xl border border-border/30">
                  <Shield className="h-4 w-4 text-success" />
                  <span>Secure encrypted payment</span>
                </div>
                <p className="text-center text-xs text-muted-foreground px-2">
                  By clicking pay, you agree to our <Link to="/terms" className="underline hover:text-foreground">Terms</Link> and <Link to="/terms" className="underline hover:text-foreground">Refund Policy</Link>.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

