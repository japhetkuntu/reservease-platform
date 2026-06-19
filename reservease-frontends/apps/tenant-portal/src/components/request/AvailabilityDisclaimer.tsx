import { motion } from "framer-motion";
import { AlertCircle, Info } from "lucide-react";

interface AvailabilityDisclaimerProps {
  variant?: "card" | "banner";
}

export function AvailabilityDisclaimer({ variant = "banner" }: AvailabilityDisclaimerProps) {
  if (variant === "card") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-info/5 border border-info/20 rounded-xl p-4"
      >
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-info flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Important</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Accommodations can be taken by other students at any time.
              Always confirm availability directly with the owner before making payment.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
      <span>Availability is not guaranteed. Please confirm with the owner before making payment.</span>
    </div>
  );
}
