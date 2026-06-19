import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, MessageSquare, ArrowRight, User, MapPin, DollarSign, Clock, CheckCircle2, XCircle, MoreVertical, Loader2 } from 'lucide-react'
import { requestsApi } from '@/api/requests'
import { Button } from '@/components/ui/button'
import { PulseBackground } from "@/components/layout/PulseBackground"
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await requestsApi.listRequests();
        setRequests(data || []);
      } catch (error) {
        console.error("Neural sync failure:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filtered = requests.filter(r =>
    (r.tenantName || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.preferredLocation || "").toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = (id: string | number, status: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const deleteRequest = (id: string | number) => {
     setRequests(prev => prev.filter(r => r.id !== id));
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center font-black uppercase tracking-[0.5em] animate-pulse">
        Fetching Matchmaking Logs...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <PulseBackground />
      
      <div className="relative z-10 space-y-8 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10"
        >
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground leading-none">
              Matchmaking <span className="text-primary italic">Logs</span>
            </h1>
            <p className="text-base text-muted-foreground font-medium mt-2">Monitor and manage tenant accommodation requests and matchmaking.</p>
          </div>
          <Button variant="outline" className="h-12 px-6 rounded-2xl border-white/10 bg-card/40 backdrop-blur-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary/5">Engine Protocols</Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4"
        >
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search tenant or preferred location..."
              className="w-full h-12 pl-12 pr-4 bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 rounded-2xl border-white/10 bg-card/40 backdrop-blur-xl font-black uppercase tracking-widest text-[10px] shrink-0 hover:bg-primary/5">
            <Filter className="mr-2 h-4 w-4" />
            Filter Protocols
          </Button>
        </motion.div>

        <div className="grid gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((req, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                key={req.id} 
                className="group p-8 border border-white/10 bg-card/40 backdrop-blur-3xl rounded-[3rem] shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 p-8 flex items-center gap-3">
                    <Badge variant={req.status === 'Completed' ? 'default' : req.status === 'Pending' ? 'secondary' : 'outline'} className="rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10">
                      {req.status}
                    </Badge>
                    
                    <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl group-hover:bg-white/10 transition-colors">
                             <MoreVertical className="h-5 w-5 text-muted-foreground" />
                          </Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end" className="w-64 rounded-[2rem] bg-card/80 backdrop-blur-3xl shadow-2xl border-white/20 p-2">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-4 py-3">Node Protocols</DropdownMenuLabel>
                          <DropdownMenuItem asChild className="rounded-2xl h-12 font-bold px-4 focus:bg-primary focus:text-white cursor-pointer">
                             <Link to={`/requests/${req.id}`}>
                                <MessageSquare className="mr-3 h-4 w-4" /> Inspect Node
                             </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-2 opacity-10" />
                          <DropdownMenuItem className="cursor-pointer h-12 font-black uppercase tracking-widest text-[10px] text-primary focus:bg-primary focus:text-white rounded-2xl px-4" onClick={() => updateStatus(req.id, 'Completed')}>
                             <CheckCircle2 className="mr-3 h-4 w-4" /> Finalize Cycle
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer h-12 font-black uppercase tracking-widest text-[10px] text-amber-600 focus:bg-amber-500 focus:text-white rounded-2xl px-4" onClick={() => updateStatus(req.id, 'Pending')}>
                             <Clock className="mr-3 h-4 w-4" /> Queue Re-entry
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-2 opacity-10" />
                          <DropdownMenuItem className="text-rose-600 focus:bg-rose-500 focus:text-white cursor-pointer rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] px-4" onClick={() => deleteRequest(req.id)}>
                             <XCircle className="mr-3 h-4 w-4" /> Abort Request
                          </DropdownMenuItem>
                       </DropdownMenuContent>
                    </DropdownMenu>
                 </div>

                 <div className="flex flex-col md:flex-row md:items-center gap-10">
                    <div className="space-y-6 max-w-sm w-full">
                       <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-[1.5rem] bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
                             <User className="h-7 w-7" />
                          </div>
                          <div>
                            <Link to={`/users/${req.tenantId}`} className="font-black text-2xl hover:text-primary transition-colors block leading-none tracking-tight mb-1 text-foreground">
                               {req.tenantName}
                            </Link>
                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] opacity-60 italic">Sequence ID: {req.tenantId}</span>
                          </div>
                       </div>

                       <div className="flex items-center gap-8">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                             <Clock className="h-4 w-4" />
                             {new Date(req.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                             <MessageSquare className="h-4 w-4" />
                             {req.matchCount} Neural Matches
                          </div>
                       </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:border-l md:pl-10 border-border/20">
                       <div className="space-y-2">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">Target Cluster</p>
                          <div className="flex items-center gap-3 font-black text-sm tracking-tight text-foreground">
                             <MapPin className="h-5 w-5 text-primary opacity-60" />
                            {req.preferredLocation}
                          </div>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">Budget Framework</p>
                          <div className="flex items-center gap-3 font-black text-sm tracking-tight text-foreground">
                             <DollarSign className="h-5 w-5 text-primary opacity-60" />
                            {req.budgetRange}
                          </div>
                       </div>
                       <div className="flex items-center justify-end md:col-span-1 lg:col-span-1">
                          <Button asChild variant="ghost" className="rounded-2xl h-14 px-8 hover:bg-primary text-primary hover:text-white font-black uppercase tracking-widest text-[10px] group transition-all shadow-lg hover:shadow-primary/30">
                             <Link to={`/requests/${req.id}`}>
                               Analyze Node
                               <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                             </Link>
                          </Button>
                       </div>
                    </div>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-20 text-center border-2 border-dashed border-white/10 rounded-[3rem] bg-white/5 text-muted-foreground"
            >
               <h3 className="text-2xl font-black italic tracking-tighter mb-2">Sequence Terminal</h3>
               <p className="text-sm font-medium opacity-60 uppercase tracking-widest">No active requests detected in the pulse stream.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
