import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import {
  ChevronLeft, MapPin, User, Tag, Home,
  CheckCircle2, XCircle, AlertCircle, Info,
  Trash2, Edit3, Camera, History, ExternalLink
} from 'lucide-react'
import { MOCK_PROPERTIES } from '@/data/properties'
import { Button } from '@/components/ui/button'
import { PulseBackground } from "@/components/layout/PulseBackground"
import { motion } from "framer-motion"

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const found = MOCK_PROPERTIES.find(p => p.id === id);
    setTimeout(() => {
      setProperty(found ? { ...found } : null);
      setLoading(false);
    }, 500);
  }, [id])

  const updateStatus = (field: 'listingStatus' | 'verificationStatus', value: string) => {
    setProperty((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleAction = (action: string) => {
    alert(`${action} executed for ${property.title}`);
  };

  if (loading) return <div className="p-12 text-center text-muted-foreground font-black uppercase tracking-widest animate-pulse">Scanning Property Database...</div>
  if (!property) return (
    <div className="p-12 text-center text-destructive space-y-4">
      <h2 className="text-3xl font-black italic tracking-tighter">Property Not Found</h2>
      <p className="font-medium text-lg leading-relaxed pt-2">The requested property ID does not exist in our historical records.</p>
      <Link to="/properties" className="mt-4 inline-block text-primary hover:underline font-black uppercase tracking-widest text-[10px]">Back to Inventory Cluster</Link>
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
          <Link to="/properties" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all w-fit group mb-8">
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Inventory
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-white/10"
        >
          <div className="space-y-4">
             <h1 className="text-5xl font-black tracking-tighter leading-none">{property.title}</h1>
             <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-black uppercase tracking-widest text-[10px] opacity-60">
               <div className="flex items-center gap-2">
                 <MapPin className="h-4 w-4 text-primary" />
                 {property.address}, {property.city}
               </div>
               <div className="flex items-center gap-2">
                 <Tag className="h-4 w-4 text-primary" />
                 <span className="italic">Node ID: {property.id}</span>
               </div>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <Badge variant={property.listingStatus === 'Approved' ? 'default' : 'secondary'} className="rounded-full px-6 py-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10 transition-all">
               {property.listingStatus}
             </Badge>
             <Badge variant={property.verificationStatus === 'Verified' ? 'default' : 'secondary'} className="rounded-full px-6 py-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10 transition-all">
               {property.verificationStatus}
             </Badge>
          </div>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2 space-y-10">
            <motion.section 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="aspect-video border border-white/10 rounded-[3rem] bg-card/40 backdrop-blur-3xl flex flex-col items-center justify-center text-muted-foreground group hover:border-primary/30 transition-all cursor-pointer overflow-hidden p-12 shadow-2xl relative"
            >
               <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="p-8 bg-primary/10 rounded-[2.5rem] group-hover:scale-110 group-hover:rotate-6 transition-all relative z-10 shadow-2xl shadow-primary/10">
                  <Camera className="h-16 w-16 text-primary opacity-40" />
               </div>
               <p className="mt-8 font-black text-2xl italic tracking-tight relative z-10">Image Stream Offline</p>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mt-2 relative z-10">Protocol requires 3+ visual confirmations</p>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-10 border border-white/10 bg-card/40 backdrop-blur-3xl rounded-[3rem] shadow-xl space-y-10"
            >
               <div className="space-y-6">
                  <h3 className="font-black text-2xl italic tracking-tight flex items-center gap-3">
                    <Info className="h-6 w-6 text-primary opacity-60" />
                    Asset Narrative
                  </h3>
                  <p className="text-xl leading-relaxed text-foreground/80 font-medium italic border-l-4 border-primary/20 pl-8">
                    {property.description}
                  </p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-6">
                  <div className="space-y-6">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">System Amenities</p>
                     <div className="flex flex-wrap gap-3">
                        {property.amenities.map((a: string) => (
                          <Badge key={a} variant="outline" className="rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-white/10 bg-white/5 shadow-sm">
                            {a}
                          </Badge>
                        ))}
                     </div>
                  </div>
                  <div className="space-y-3">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">Financial Multiplier</p>
                     <p className="text-5xl font-black tracking-tighter leading-none">₵{property.price.toLocaleString()} <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 italic ml-2">/ month</span></p>
                  </div>
               </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-10 border border-white/10 bg-card/40 backdrop-blur-3xl rounded-[3rem] shadow-xl space-y-8"
            >
               <div className="flex items-center justify-between border-b border-white/5 pb-8">
                  <h3 className="font-black text-2xl italic tracking-tight flex items-center gap-3">
                     <History className="h-6 w-6 text-primary opacity-60" />
                     Lifecycle Stream
                  </h3>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 italic">Initialized: {new Date(property.createdAt).toLocaleDateString()}</span>
               </div>
               <div className="space-y-6 pt-2">
                  <LogItem date="2024-03-05" action="listing initialized by entity" />
                  <LogItem date="2024-03-06" action="verification terminal failure: missing protocol" status="warning" />
                  <LogItem date="2024-03-07" action="admin intervention: location cluster flag" status="error" />
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
                <div>
                  <h3 className="font-black text-2xl italic tracking-tight flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary opacity-60" />
                    Review Protocol
                  </h3>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40 mt-2">Elevated clearance required.</p>
                </div>

                <div className="space-y-4 pt-2">
                   <Button 
                     className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary transition-all"
                     onClick={() => updateStatus('listingStatus', 'Approved')}
                   >
                     <CheckCircle2 className="mr-3 h-5 w-5" /> Execute Approval
                   </Button>
                   <Button 
                     variant="outline" 
                     className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] border-emerald-500/20 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white transition-all"
                     onClick={() => updateStatus('verificationStatus', 'Verified')}
                   >
                     <CheckCircle2 className="mr-3 h-5 w-5" /> Grant Neural Badge
                   </Button>
                   <Button 
                     variant="outline" 
                     className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] border-rose-500/20 text-rose-400 bg-rose-500/5 hover:bg-rose-500 hover:text-white transition-all"
                     onClick={() => handleAction('Termination')}
                   >
                     <XCircle className="mr-3 h-5 w-5" /> Terminate Listing
                   </Button>
                </div>
             </motion.section>

             <motion.section 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.4 }}
               className="p-10 border border-white/10 bg-card/40 backdrop-blur-3xl rounded-[3rem] shadow-xl space-y-8"
             >
                <h3 className="font-black text-xl italic tracking-tight flex items-center gap-3">
                  <User className="h-6 w-6 text-primary opacity-60" />
                  Owner Cluster
                </h3>
                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-lg shadow-lg rotate-3">
                         {property.ownerName.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-lg font-black leading-tight tracking-tight">{property.ownerName}</p>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40 italic mt-1 leading-none">Entity ID: {property.ownerId}</p>
                      </div>
                   </div>
                   <Link to={`/users/${property.ownerId}`} className="flex items-center justify-center gap-2 w-full h-12 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 rounded-xl hover:bg-primary hover:text-white transition-all shadow-lg hover:shadow-primary/20">
                      Deep Scan Profile <ExternalLink className="h-4 w-4" />
                   </Link>
                </div>
             </motion.section>

             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5 }}
               className="flex gap-4"
             >
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-[2rem] py-10 h-auto flex-col gap-3 bg-white/5 border-white/10 hover:bg-primary hover:text-white hover:border-primary transition-all group/edit"
                  onClick={() => handleAction('Edit')}
                >
                   <Edit3 className="h-6 w-6 text-muted-foreground group-hover/edit:text-white group-hover/edit:rotate-12 transition-all" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Edit Node</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-[2rem] py-10 h-auto flex-col gap-3 bg-white/5 border-white/10 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all group/purge"
                  onClick={() => handleAction('Purge')}
                >
                   <Trash2 className="h-6 w-6 text-rose-500 group-hover/purge:text-white transition-all" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 group-hover/purge:text-white">Purge</span>
                </Button>
             </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LogItem({ date, action, status = 'default' }: any) {
  const iconMap: any = {
    default: <CheckCircle2 className="h-3.5 w-3.5 text-primary/40" />,
    warning: <AlertCircle className="h-3.5 w-3.5 text-amber-500" />,
    error: <XCircle className="h-3.5 w-3.5 text-rose-500" />
  };

  return (
    <div className="flex items-center gap-4 text-sm border-l border-white/10 pl-6 py-2 relative hover:bg-white/5 transition-colors rounded-r-xl group/log">
       <div className="absolute -left-[7.5px] bg-card p-0.5 group-hover/log:scale-125 transition-transform">{iconMap[status]}</div>
       <span className="text-[10px] font-black font-mono text-muted-foreground/40 shrink-0 uppercase tracking-widest">{date}</span>
       <span className="font-black text-sm tracking-tight text-foreground/70 lowercase italic">{action}</span>
    </div>
  )
}
