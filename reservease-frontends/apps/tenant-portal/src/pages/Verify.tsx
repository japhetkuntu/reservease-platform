/**
 * /verify is no longer the primary OTP screen.
 *
 * The full registration flow (details → OTP → success) is self-contained
 * inside /signup. This page only handles the edge case where a logged-in
 * but unverified user tries to verify their email later.
 *
 * For now, redirect such users back to /signup so they can restart the flow,
 * or to /dashboard if they are already verified.
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Verify() {
  const navigate = useNavigate();
  const { isLoggedIn, isVerified } = useAuth();

  useEffect(() => {
    if (isVerified) {
      navigate("/dashboard", { replace: true });
    } else if (isLoggedIn) {
      // Logged in but not verified — send back to re-do verification
      navigate("/signup", { replace: true });
    } else {
      navigate("/signup", { replace: true });
    }
  }, [isLoggedIn, isVerified, navigate]);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
