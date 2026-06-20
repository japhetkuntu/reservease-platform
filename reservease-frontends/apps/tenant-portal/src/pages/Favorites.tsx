import { motion } from "framer-motion";
import { Heart, MapPin, Wallet, BedDouble, ChevronRight, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoritesApi } from "@/api/favorites";
import { PageLoader } from "@/components/ui/PageLoader";

export default function Favorites() {
  const { isLoggedIn, isVerified } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favoritesData, isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: favoritesApi.list,
    enabled: isLoggedIn && isVerified,
  });

  const favorites = favoritesData?.data || [];

  const removeMutation = useMutation({
    mutationFn: favoritesApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] })
  });

  const handleUnfavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "Please verify your WhatsApp to manage favorites",
      });
      navigate("/verify");
      return;
    }
    removeMutation.mutate(id);
  };

  // Show sign-in prompt for guests
  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="container py-8 md:py-12 pb-28 md:pb-12 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Favorites</h1>
            <p className="text-muted-foreground text-lg">Places you're keeping an eye on.</p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-6 bg-card border border-border/50 rounded-2xl max-w-md mx-auto"
          >
            <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
              <Heart className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-3">Sign in to see your favorites</h2>
            <p className="text-muted-foreground mb-8">
              Save properties and access them from any device once you're signed in.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild>
                <Link to="/signup">Create Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  // Show verification prompt if logged in but not verified
  if (isLoggedIn && !isVerified) {
    return (
      <Layout>
        <div className="container py-6 pb-24 md:pb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              My Favorites
            </h1>
            <p className="text-muted-foreground">
              Properties you've saved for later
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-6 bg-card border border-border/50 rounded-2xl max-w-md mx-auto"
          >
            <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Unlock Your Favorites
            </h2>
            <p className="text-muted-foreground mb-8">
              Verify your WhatsApp number to seamlessly save and manage your favorite properties across devices.
            </p>
            <Button size="lg" className="w-full sm:w-auto px-8 rounded-full font-medium" asChild>
              <Link to="/verify">Verify Now</Link>
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }



  if (isLoading) {
    return (
      <Layout>
        <PageLoader message="Loading favorites..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 md:py-12 pb-28 md:pb-12 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Favorites
          </h1>
          <p className="text-muted-foreground text-lg">
            Places you're keeping an eye on.
          </p>
        </div>

        {/* Favorites List */}
        <div className="space-y-4">
          {favorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 px-4"
            >
              <div className="bg-muted/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">No favorites yet</h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                Tap the heart icon on any property to save it here for easy access later.
              </p>
              <Button size="lg" className="rounded-full px-8 font-medium" asChild>
                <Link to="/search">Explore Properties</Link>
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex flex-col bg-card border border-border/40 rounded-2xl overflow-hidden hover:border-border transition-all duration-300"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23f1f5f9'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%2394a3b8' font-size='14' font-family='system-ui'%3ENo image%3C/text%3E%3C/svg%3E"; }}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {!property.available && (
                      <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-lg bg-background/90 text-sm font-semibold text-foreground">
                          Unavailable
                        </span>
                      </div>
                    )}
                    <button
                      className="absolute top-4 right-4 p-2.5 rounded-lg bg-background/80 hover:scale-125 active:scale-90 hover:bg-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={(e) => handleUnfavorite(e, property.id)}
                      aria-label="Remove from favorites"
                    >
                      <Heart className="h-4 w-4 text-destructive fill-destructive transition-transform" />
                    </button>
                    <div className="absolute bottom-4 left-4 bg-background/90 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <Wallet className="h-3.5 w-3.5 text-foreground/70" />
                      <span className="text-sm font-semibold text-foreground tracking-tight">{property.price}</span>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-foreground line-clamp-1 leading-tight">
                          {property.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="text-sm line-clamp-1">{property.location}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                        <BedDouble className="h-4 w-4 shrink-0 text-foreground/70" />
                        <span className="text-sm font-medium">{property.roomType}</span>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
