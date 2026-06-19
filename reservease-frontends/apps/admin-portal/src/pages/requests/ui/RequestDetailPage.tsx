import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import {
  ChevronLeft, User, MapPin, DollarSign,
  MessageSquare, CheckCircle2, UserPlus,
  Zap, Bell, ShieldCheck, History, Home
} from 'lucide-react'
import { MOCK_REQUESTS } from '@/data/requests'
import { requestsApi } from '@/api/requests'
import { Button } from '@/components/ui/button'
import { PulseBackground } from "@/components/layout/PulseBackground"
import { motion } from "framer-motion"

export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [request, setRequest] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const found = MOCK_REQUESTS.find(r => r.id === id);
    setTimeout(() => {
      setRequest(found ? { ...found } : null);
      setLoading(false);
    }, 500);
  }, [id])

  const handleAction = async (action: string) => {
    if (!id || !request) return;
    try {
      if (action === 'Liaison Deployment') {
        await requestsApi.deployLiaison(id);
        setRequest((prev: any) => ({ ...prev, status: 'Processing' }));
      } else if (action === 'Broadcast Matches') {
        await requestsApi.broadcastMatches(id, ['PROP-101', 'PROP-102']);
        setRequest((prev: any) => ({ ...prev, status: 'Matches Found' }));
      } else if (action === 'Fulfill Protocol') {
        await requestsApi.fulfillProtocol(id);
        setRequest((prev: any) => ({ ...prev, status: 'Completed' }));
      } else {
        alert(`${action} protocol executed for Request #${request.id}`);
      }
    } catch (error) {
      alert('Neural sync failure: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  if (loading) return <div className="p-12 text-center text-muted-foreground font-black uppercase tracking-widest animate-pulse">Accessing Matchmaking Logs...</div>
  if (!request) return (
    <div className="p-12 text-center text-destructive space-y-4">
      <h2 className="text-3xl font-black italic tracking-tighter">Request Log Not Found</h2>
      <p className="font-medium text-lg leading-relaxed pt-2">The requested neural request ID does not exist in our historical logs.</p>
      <Link to="/requests" className="mt-4 inline-block text-primary hover:underline font-black uppercase tracking-widest text-[10px]">Back to Neural Logs</Link>
    </div>
  )

  return (
    <div className="relative min-h-screen">
      <PulseBackground />
      
      <div className="relative z-10 space-y-12 pb-20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link to="/requests" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all w-fit group mb-8">
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Neural Logs
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-white/10"
        >
          <div className="space-y-4">
             <h1 className="text-5xl font-black tracking-tighter leading-none flex items-center gap-4 text-foreground">
                Neural Request <span className="text-primary/40 font-black font-mono text-3xl italic">#{request.id}</span>
             </h1>
             <div className="flex items-center gap-3 text-muted-foreground font-black uppercase tracking-widest text-[10px] opacity-60">
               <User className="h-4 w-4 text-primary" />
               <span className="italic">Initiated by <Link to={`/users/${request.tenantId}`} className="text-foreground hover:text-primary transition-colors underline decoration-primary/20 underline-offset-8 transition-all">{request.tenantName}</Link></span>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={request.status === 'Completed' ? 'default' : request.status === 'Pending' ? 'secondary' : 'outline'} className="rounded-full px-6 py-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10 transition-all">
              {request.status}
            </Badge>
            <Button 
              variant="outline" 
              className="h-14 px-8 rounded-2xl border-white/10 bg-card/40 backdrop-blur-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary/5 transition-all"
              onClick={() => handleAction('Transit Alert')}
            >
               <Bell className="mr-3 h-4 w-4" /> Transit Alert
            </Button>
          </div>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-3">
           <div className="md:col-span-2 space-y-10">
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-10 border border-white/10 bg-card/40 backdrop-blur-3xl rounded-[3rem] shadow-xl space-y-10"
              >
                 <div className="flex items-center justify-between">
                    <h3 className="font-black text-2xl italic tracking-tight flex items-center gap-3">
                      <Zap className="h-6 w-6 text-primary opacity-60" />
                      Demand Matrix
                    </h3>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 italic bg-white/5 px-4 py-2 rounded-xl">Timestamp: {new Date(request.createdAt).toLocaleDateString()}</span>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <ParamItem icon={<DollarSign className="h-6 w-6" />} label="Resource Capacity" value={request.budgetRange} />
                    <ParamItem icon={<MapPin className="h-6 w-6" />} label="Geographic Cluster" value={request.preferredLocation} />
                 </div>

                 <div className="pt-6 space-y-6">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">System Preferences</p>
                    <div className="flex flex-wrap gap-3">
                       {request.preferences.map((p: string) => (
                         <Badge key={p} variant="outline" className="rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest border-white/10 bg-white/5 shadow-sm">
                           {p}
                         </Badge>
                       ))}
                    </div>
                 </div>
              </motion.section>

              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-10 border border-white/10 bg-card/40 backdrop-blur-3xl rounded-[3rem] shadow-xl space-y-8"
              >
                 <div className="flex items-center justify-between border-b border-white/5 pb-8">
                    <h3 className="font-black text-2xl italic tracking-tight flex items-center gap-3">
                      <ShieldCheck className="h-6 w-6 text-emerald-500 opacity-60" />
                      Neural Alignments ({request.matchCount})
                    </h3>
                    <Button variant="ghost" size="sm" className="font-black uppercase tracking-widest text-[10px] text-primary hover:bg-primary/10 rounded-xl px-4 h-10">Reroute Engine</Button>
                 </div>

                 <div className="grid gap-6">
                    {[1, 2, 3].map((i, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + (idx * 0.1) }}
                        key={i} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white/5 border border-white/5 hover:border-primary/30 rounded-[2rem] transition-all group cursor-pointer"
                      >
                         <div className="flex items-center gap-6">
                            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                               <Home className="h-8 w-8 text-primary opacity-60" />
                            </div>
                            <div className="space-y-1">
                               <p className="font-black text-lg tracking-tight">Alignment Protocol #{i}</p>
                               <div className="flex items-center gap-3 mt-1">
                                  <Badge variant="outline" className="text-[10px] font-black px-3 py-0.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-sm shadow-emerald-500/5">95% ACCURACY</Badge>
                                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40 italic">Ready for visualization</span>
                               </div>
                            </div>
                         </div>
                         <Button asChild variant="ghost" className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] mt-4 sm:mt-0 hover:bg-primary hover:text-white transition-all">
                            <Link to="/properties/PROP-101">Scan Node</Link>
                         </Button>
                      </motion.div>
                    ))}
                 </div>
              </motion.section>
           </div>

           <div className="space-y-10">
              <motion.section 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="p-10 border border-primary/20 bg-primary/5 backdrop-blur-xl rounded-[3rem] space-y-8 shadow-2xl shadow-primary/5"
              >
                 <div className="space-y-2">
                   <h3 className="font-black text-2xl italic tracking-tight flex items-center gap-3">
                     <MessageSquare className="h-6 w-6 text-primary opacity-60" />
                     Liaison Protocol
                   </h3>
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 leading-relaxed">Optimization of the entity's search trajectory.</p>
                 </div>

                 <div className="space-y-4 pt-2">
                    <Button 
                      className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary transition-all"
                      onClick={() => handleAction('Liaison Deployment')}
                    >
                      <UserPlus className="mr-3 h-5 w-5" /> Deploy Liaison
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] border-white/10 bg-white/5 hover:bg-primary hover:text-white transition-all"
                      onClick={() => handleAction('Broadcast Matches')}
                    >
                      Broadcast Matches
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] border-white/10 bg-white/5 hover:bg-emerald-500 hover:text-white transition-all"
                      onClick={() => handleAction('Fulfill Protocol')}
                    >
                      Fulfill Protocol
                    </Button>
                 </div>
              </motion.section>

              <motion.section 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="p-10 border border-white/10 bg-card/40 backdrop-blur-3xl rounded-[3rem] shadow-xl space-y-8 overflow-hidden"
              >
                 <h3 className="font-black text-xl italic tracking-tight flex items-center gap-3">
                    <History className="h-6 w-6 text-primary opacity-60" />
                    Neural Timeline
                 </h3>
                 <div className="space-y-10 relative before:absolute before:inset-y-0 before:left-[1.3rem] before:w-[1px] before:bg-white/10">
                    <TimelineNode date="Mar 1, 2024" event="search sequence initialized" active />
                    <TimelineNode date="Mar 2, 2024" event="neural engine matching v1.0" active />
                    <TimelineNode date="Mar 3, 2024" event="owner cluster broadcast" />
                 </div>
              </motion.section>
           </div>
        </div>
      </div>
    </div>
  )
}

function ParamItem({ icon, label, value }: any) {
  return (
    <div className="space-y-4">
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">{label}</p>
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 bg-primary/10 rounded-2xl text-primary flex items-center justify-center shadow-lg shadow-primary/5">{icon}</div>
        <p className="font-black text-2xl tracking-tighter leading-tight italic">{value}</p>
      </div>
    </div>
  )
}

function TimelineNode({ date, event, active = false }: any) {
  return (
    <div className="flex items-start gap-8 relative group/node">
       <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-all shadow-lg ${active ? 'bg-primary text-white rotate-6 scale-110 shadow-primary/20' : 'bg-white/5 text-muted-foreground/40 border border-white/5 opacity-40'}`}>
          <CheckCircle2 className="h-5 w-5" />
       </div>
       <div className="space-y-1">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mt-2 opacity-40 italic">{date}</p>
          <p className={`text-base font-black tracking-tight transition-all lowercase italic ${active ? 'text-foreground/80' : 'text-muted-foreground/40'}`}>{event}</p>
       </div>
    </div>
  )
}
