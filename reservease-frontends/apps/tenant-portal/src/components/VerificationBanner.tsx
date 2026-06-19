import { Link } from "react-router-dom";
import { AlertCircle, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function VerificationBanner() {
  const { isLoggedIn, isVerified } = useAuth();

  // Only show for logged in but unverified users
  if (!isLoggedIn || isVerified) return null;

  return (
    <Link
      to="/verify"
      className="block bg-warning/10 border-b border-warning/20"
    >
      <div className="container py-2 px-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4 text-warning flex-shrink-0" />
          <span className="text-foreground">
            <span className="font-medium">Verify your email</span>
            <span className="text-muted-foreground hidden sm:inline"> to unlock all features</span>
          </span>
        </div>
        <ChevronRight className="h-4 w-4 text-warning flex-shrink-0" />
      </div>
    </Link>
  );
}
