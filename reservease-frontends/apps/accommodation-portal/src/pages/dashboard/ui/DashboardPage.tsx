import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle, Home, Building2, MessageSquare,
  Eye, EyeOff, MapPin, Wifi, Zap, Clock,
  Pencil, Trash2, MoreVertical, ImageIcon,
  CheckCircle2, Droplets, Sparkles, Search,
  TrendingUp, Activity, ShieldCheck, LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { getMyAccommodations, deleteAccommodation, toggleAccommodationStatus, getAccommodationOverview, formatImageUrl } from '@/data/accommodations';
import type { Accommodation, AccommodationOverview } from '@/data/accommodations';
import { useAuth } from '@/contexts/AuthContext';

const CATEGORY_LABELS: Record<string, string> = {
  hostel: 'Hostel', apartment: 'Apartment', 'self-contain': 'Self-Contain',
  'guest-house': 'Guest House', homestay: 'Home Stay', 'hotel-room': 'Hotels',
};

export function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<AccommodationOverview | null>(null);

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Observer for infinite scroll
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loadingMore || initialLoad) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loadingMore, initialLoad, hasNextPage]);

  const fetchOverview = useCallback(async () => {
    try {
      const data = await getAccommodationOverview();
      setOverview(data);
    } catch (err) {
      console.error("Failed to fetch overview:", err);
    }
  }, []);

  const fetchData = useCallback(async (currentPage: number) => {
    try {
      if (currentPage === 1) {
        setInitialLoad(true);
      } else {
        setLoadingMore(true);
      }

      const statusMap: Record<string, string> = {
        all: 'all',
        online: 'live',
        offline: 'hidden'
      };

      const result = await getMyAccommodations(currentPage, 6, statusMap[activeTab] || 'all');

      setAccommodations(prev =>
        currentPage === 1 ? result.results : [...prev, ...result.results]
      );
      setHasNextPage(result.pageIndex < result.totalPages);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load properties';
      setError(message);
    } finally {
      setInitialLoad(false);
      setLoadingMore(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData(page);
    if (page === 1) {
      fetchOverview();
    }
  }, [page, fetchData, fetchOverview]);

  const reloadData = useCallback(() => {
    if (page === 1) {
      fetchData(1);
    } else {
      setPage(1);
    }
  }, [page, fetchData]);

  const handleToggleOnline = useCallback(async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const a = accommodations.find(item => item.id === id);
      if (!a) return;
      await toggleAccommodationStatus(id, !a.available);
      reloadData();
      fetchOverview();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to toggle status";
      alert(message);
    }
  }, [accommodations, reloadData, fetchOverview]);

  const handleDelete = useCallback(async (a: Accommodation, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!a.id) return;
    if (!window.confirm(`Are you sure you want to delete "${a.name}"?`)) return;
    try {
      await deleteAccommodation(a.id);
      reloadData();
      fetchOverview();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete";
      alert(message);
    }
  }, [reloadData, fetchOverview]);

  const stats = [
    { label: 'Properties', value: overview?.totalProperties ?? 0, desc: 'Registered Assets', icon: LayoutGrid, color: 'text-primary' },
    { label: 'Active Reach', value: overview?.totalRequests ?? 0, desc: 'Tenant Inquiries', icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Live Market', value: overview?.liveProperties ?? 0, desc: 'Visible Units', icon: Activity, color: 'text-sky-500' },
    { label: 'Trust Score', value: overview?.verifiedProperties ?? 0, desc: 'Verified Badges', icon: ShieldCheck, color: 'text-amber-500' },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background">

      {/* Page Header */}
      <div className="sticky top-16 z-30 border-b border-border/50 bg-background transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight leading-none">
               My Properties
            </h2>
            <p className="text-sm text-muted-foreground font-medium">Manage and monitor all your listings.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button asChild size="lg" className="rounded-lg px-6 h-12 font-semibold uppercase tracking-wide text-xs transition-all">
                <Link to="/add-property"><PlusCircle className="h-4 w-4 mr-2" /> New Property</Link>
             </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative bg-muted/20 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="p-4 rounded-lg border border-border/50 bg-card hover:bg-card/80 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                       <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">{s.label}</p>
                       <div className={cn("h-7 w-7 rounded-lg bg-muted/50 flex items-center justify-center", s.color)}>
                          <Icon className="w-4 h-4" />
                       </div>
                    </div>
                    <div className="space-y-1">
                       <p className={cn("text-3xl sm:text-4xl font-bold tabular-nums tracking-tight", s.color)}>{s.value}</p>
                       <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">{s.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Portfolio View */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
        {initialLoad ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative h-16 w-16">
               <div className="relative h-full w-full bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                  <Building2 className="w-8 h-8 text-primary" />
               </div>
            </div>
            <div className="text-center space-y-1">
               <p className="text-base font-semibold tracking-tight">Loading properties...</p>
               <p className="text-xs text-muted-foreground font-medium">Getting your listings ready</p>
            </div>
          </div>
        ) : error ? (
          <div className="border border-destructive/20 rounded-lg p-12 text-center space-y-6">
            <div className="h-14 w-14 bg-destructive/10 rounded-lg flex items-center justify-center mx-auto">
               <Activity className="w-7 h-7 text-destructive" />
            </div>
            <div className="space-y-2">
               <h3 className="text-lg font-bold text-destructive">Error Loading Properties</h3>
               <p className="text-muted-foreground text-sm max-w-sm mx-auto">{error}</p>
            </div>
            <Button onClick={reloadData} variant="outline" className="h-10 px-6 rounded-lg font-semibold uppercase tracking-wide text-xs border-border/50 hover:bg-muted">
              <Clock className="w-4 h-4 mr-2" /> Try Again
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="all" value={activeTab} onValueChange={(v) => { setActiveTab(v); setPage(1); }} className="w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight leading-none">Properties</h2>
                <p className="text-sm font-medium text-muted-foreground">View and manage all your listings.</p>
              </div>
              <TabsList className="h-12 p-1 border border-border/50 rounded-lg w-full md:w-auto gap-1">
                <TabsTrigger value="all" className="px-6 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white transition-all text-xs font-semibold uppercase tracking-wide gap-2">
                   All <Badge className="bg-background text-foreground border-0 text-xs px-2">{overview?.totalProperties ?? 0}</Badge>
                </TabsTrigger>
                <TabsTrigger value="online" className="px-6 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white transition-all text-xs font-semibold uppercase tracking-wide gap-2">
                   Live <Badge className="bg-background text-foreground border-0 text-xs px-2">{overview?.liveProperties ?? 0}</Badge>
                </TabsTrigger>
                <TabsTrigger value="offline" className="px-6 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white transition-all text-xs font-semibold uppercase tracking-wide gap-2">
                   Paused <Badge className="bg-background text-foreground border-0 text-xs px-2">{overview?.hiddenProperties ?? 0}</Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            {(['all', 'online', 'offline'] as const).map(tab => (
              <TabsContent key={tab} value={tab} className="mt-0 focus-visible:ring-0">
                {accommodations.length === 0 ? (
                  <div className="border border-dashed border-border/50 rounded-lg p-16 text-center space-y-6">
                    <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center mx-auto opacity-50">
                      <LayoutGrid className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-lg font-bold tracking-tight">No properties yet</h3>
                       <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                         Get started by adding your first property to the marketplace.
                       </p>
                    </div>
                    <Button asChild className="h-10 rounded-lg px-6 font-semibold uppercase tracking-wide text-xs">
                      <Link to="/add-property"><PlusCircle className="w-4 h-4 mr-2" /> Add Property</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    {accommodations.map((acc: Accommodation) => {
                      const isLast = accommodations[accommodations.length - 1]?.id === acc.id;
                      return (
                        <div
                          key={acc.id}
                          ref={isLast ? lastElementRef : null}
                        >
                          <PropertyCard
                            accommodation={acc}
                            onToggleOnline={(e) => handleToggleOnline(acc.id!, e)}
                            onDelete={(e) => handleDelete(acc, e)}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {loadingMore && (
                  <div className="py-8 flex justify-center w-full">
                    <div className="flex items-center gap-3 bg-muted/30 px-4 py-2 rounded-lg border border-border/50">
                      <Clock className="w-4 h-4 text-primary animate-spin" />
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Loading more...</span>
                    </div>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}

// ── Property Card Component ───────────────────────────────────────────────────
function PropertyCard({
  accommodation: a, onToggleOnline, onDelete,
}: {
  accommodation: Accommodation;
  onToggleOnline: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const navigate = useNavigate();
  const priceUnit = a.category === 'guest-house' ? '/night' : (a.priceUnit === 'academic-year' ? '/academic yr' : `/${a.priceUnit}`);
  const hasCover  = a.images.length > 0;

  return (
    <div
      onClick={() => navigate(`/accommodation/${a.id}`)}
      className={cn(
        "group relative flex flex-col rounded-lg border border-border/50 bg-card overflow-hidden transition-all duration-300 hover:bg-card/80 cursor-pointer",
        !a.available && "opacity-60"
      )}
    >
      <div className="relative h-48 bg-muted overflow-hidden shrink-0">
        {hasCover ? (
          <img
            src={formatImageUrl(typeof a.images[0] === 'string' ? a.images[0] : '')}
            alt={a.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Building2 className="w-8 h-8 text-muted-foreground/30" />
            <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground/40">No image</p>
          </div>
        )}

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <StatusBadge isApproved={a.isApproved ?? false} available={a.available ?? false} />
          {a.isVerified && (
            <span className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-500 text-white px-2 py-1 rounded-full uppercase tracking-wide">
               <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          )}
        </div>

        {a.images.length > 0 && (
          <div className="absolute top-4 right-4">
            <span className="flex items-center gap-1.5 text-xs font-semibold bg-black/20 text-white px-2 py-1 rounded-lg border border-white/10">
              {a.images.length} photos
            </span>
          </div>
        )}

        {a.totalRequests && a.totalRequests > 0 && (
          <div className="absolute bottom-4 left-4 right-4">
            <span className="flex items-center gap-2 text-xs font-semibold text-white">
               <div className="h-1.5 w-1.5 rounded-full bg-primary" />
               {a.totalRequests} inquiries
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-base leading-none tracking-tight line-clamp-1 flex-1 group-hover:text-primary transition-colors">{a.name}</h3>
            <span className="text-xs font-semibold uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded shrink-0 border border-primary/20">
               {CATEGORY_LABELS[a.category] ?? a.category}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/70 uppercase tracking-wide">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{a.location}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1">
           {[
             { val: a.backupPower, icon: Zap },
             { val: a.internetType, icon: Wifi },
             { val: a.waterReliability, icon: Droplets },
           ].filter(f => f.val && f.val !== 'None').map((f, i) => (
             <span key={i} className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide border border-border/50 bg-muted/30 rounded px-2 py-1 text-muted-foreground/70 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all">
               <f.icon className="w-3 h-3 opacity-60" /> {f.val}
             </span>
           ))}
        </div>

        <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between gap-4" onClick={e => e.stopPropagation()}>
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wide">Price</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight">₵{parseInt(a.price || '0').toLocaleString()}</span>
              <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide">{priceUnit}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Toggle Switch */}
            <button
              className={cn(
                "h-8 w-14 p-1 rounded-full transition-all duration-300 flex border cursor-pointer relative",
                a.available
                  ? "bg-emerald-500 border-emerald-400/30"
                  : "bg-muted/40 border-border/50"
              )}
              onClick={onToggleOnline}
            >
              <div className={cn(
                "h-6 w-6 rounded-full transition-all duration-300 flex items-center justify-center relative z-10",
                a.available
                  ? "translate-x-6 bg-white"
                  : "translate-x-0 bg-muted-foreground/20"
              )}>
                {a.available ? <Eye className="w-2.5 h-2.5 text-emerald-600" /> : <EyeOff className="w-2.5 h-2.5 text-white/40" />}
              </div>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-muted transition-colors">
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 p-2 rounded-lg border-border/50">
                <DropdownMenuItem onClick={() => navigate(`/accommodation/${a.id}`)} className="h-10 rounded gap-3 font-medium uppercase tracking-wide text-xs cursor-pointer">
                  <Eye className="h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/edit-property/${a.id}`)} className="h-10 rounded gap-3 font-medium uppercase tracking-wide text-xs cursor-pointer">
                  <Pencil className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 opacity-50" />
                <DropdownMenuItem
                  className="h-10 rounded text-destructive focus:text-destructive focus:bg-destructive/5 font-medium uppercase tracking-wide text-xs gap-3 cursor-pointer"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Status Badge Component ────────────────────────────────────────────────────
function StatusBadge({ isApproved, available }: { isApproved: boolean; available: boolean }) {
  if (!isApproved) return (
    <span className="flex items-center gap-2.5 text-[10px] font-black bg-amber-500 text-white backdrop-blur-3xl px-4 py-2 rounded-full shadow-2xl tracking-[0.2em] uppercase">
      <Clock className="w-3.5 h-3.5" /> Moderation
    </span>
  );
  if (available) return (
    <span className="flex items-center gap-2.5 text-[10px] font-black bg-emerald-500/90 text-white backdrop-blur-3xl px-4 py-2 rounded-full shadow-2xl tracking-[0.2em] uppercase">
      <div className="w-2 h-2 rounded-full bg-white animate-pulse" /> Live Pulse
    </span>
  );
  return (
    <span className="flex items-center gap-2.5 text-[10px] font-black bg-zinc-600 text-white/60 backdrop-blur-3xl px-4 py-2 rounded-full shadow-2xl tracking-[0.2em] uppercase">
      <EyeOff className="w-3.5 h-3.5" /> Hidden
    </span>
  );
}
