import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404: attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout showFooter={false}>
      <div className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center px-4 py-20 text-center">
        {/* Illustration */}
        <div className="mb-8 select-none" aria-hidden="true">
          <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="30" width="120" height="80" rx="12" className="fill-muted" />
            <rect x="35" y="48" width="60" height="8" rx="4" className="fill-border" />
            <rect x="35" y="64" width="40" height="6" rx="3" className="fill-border/60" />
            <rect x="35" y="78" width="50" height="6" rx="3" className="fill-border/60" />
            <circle cx="120" cy="88" r="22" className="fill-background stroke-border" strokeWidth="2" />
            <text x="114" y="94" fontSize="18" fontWeight="700" className="fill-muted-foreground" fontFamily="monospace">?</text>
          </svg>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-medium text-muted-foreground mb-4">
          404 — Page not found
        </div>

        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-3">
          Nothing here
        </h1>
        <p className="text-muted-foreground max-w-xs leading-relaxed mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button onClick={() => navigate(-1)} variant="outline" className="h-10 px-5 rounded-xl">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Go back
          </Button>
          <Button asChild className="h-10 px-5 rounded-xl">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" aria-hidden="true" />
              Home
            </Link>
          </Button>
          <Button asChild variant="ghost" className="h-10 px-5 rounded-xl text-muted-foreground">
            <Link to="/search">
              <Search className="mr-2 h-4 w-4" aria-hidden="true" />
              Search
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
