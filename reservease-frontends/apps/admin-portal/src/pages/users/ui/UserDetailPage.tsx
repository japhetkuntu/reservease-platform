import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import {
  ChevronLeft, Mail, Phone, MapPin, Calendar,
  ShieldAlert, UserCheck, Trash2, History, Building2,
  Heart, CreditCard, ExternalLink
} from 'lucide-react'
import { MOCK_USERS } from '@/data/users'
import { Button } from '@/components/ui/button'
import { PulseBackground } from "@/components/layout/PulseBackground"
import { motion } from "framer-motion"

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const foundUser = MOCK_USERS.find(u => u.id === id);
    setTimeout(() => {
      setUser(foundUser ? { ...foundUser } : null);
      setLoading(false);
    }, 500);
  }, [id])

  const toggleStatus = () => {
    setUser((prev: any) => ({
      ...prev,
      status: prev.status === 'Active' ? 'Suspended' : 'Active'
    }));
  };

  const handleAction = (action: string) => {
    alert(`${action} protocol executed for ${user.name}`);
  };

  if (loading) return <div className="p-12 text-center text-muted-foreground font-black uppercase tracking-widest animate-pulse">Scanning Neural Registry...</div>
  if (!user) return (
    <div className="p-12 text-center text-destructive space-y-4">
      <h2 className="text-3xl font-black italic tracking-tighter">Entity Not Found</h2>
      <p className="font-medium text-lg leading-relaxed pt-2">The requested neural identity does not exist in the platform registry.</p>
      <Link to="/users" className="mt-4 inline-block text-primary hover:underline font-black uppercase tracking-widest text-[10px]">Back to Registry</Link>
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
          <Link to="/users" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all w-fit group mb-8">
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Registry
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-white/10"
        >
          <div className="flex items-center gap-8">
            <div className="h-32 w-32 rounded-[2.5rem] bg-primary text-white flex items-center justify-center text-5xl font-black shadow-2xl shadow-primary/20 rotate-3 hover:rotate-0 transition-transform cursor-pointer">
              {user.avatar}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <h1 className="text-5xl font-black tracking-tighter leading-none">{user.name}</h1>
                <Badge variant={user.status === 'Active' ? 'default' : 'destructive'} className="rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10">
                  {user.status}
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] opacity-40 italic">Neural Protocol ID: {user.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <Button 
               variant="outline" 
               className="h-14 px-8 rounded-2xl border-white/10 bg-card/40 backdrop-blur-xl font-black uppercase tracking-widest text-[10px] hover:bg-primary/5"
               onClick={() => handleAction('Transit Message')}
             >
                <Mail className="mr-3 h-4 w-4" /> Transit Message
             </Button>
             <Button
               onClick={toggleStatus}
               variant={user.status === 'Active' ? 'destructive' : 'default'}
               className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all"
             >
               {user.status === 'Active' ? (
                 <><ShieldAlert className="mr-3 h-4 w-4" /> Suspend Entity</>
               ) : (
                 <><UserCheck className="mr-3 h-4 w-4" /> Reactivate Entity</>
               )}
             </Button>
          </div>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2 space-y-10">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-10 border border-white/10 bg-card/40 backdrop-blur-3xl rounded-[3rem] shadow-xl space-y-8"
            >
              <h3 className="font-black text-2xl italic tracking-tight flex items-center gap-3">
                <History className="h-6 w-6 text-primary opacity-60" />
                Identity Parameters
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <DetailItem label="Signal Address" value={user.email} />
                <DetailItem label="Contact Frequency" value={user.phone} />
                <DetailItem label="Cluster Origin" value={user.address || 'Unknown Node'} />
                <DetailItem label="Integration Node" value={new Date(user.joinedDate).toLocaleDateString(undefined, { dateStyle: 'long' })} />
              </div>
              <div className="pt-6 space-y-3">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">Entity Narrative</p>
                <p className="text-xl font-medium leading-relaxed italic opacity-80 border-l-4 border-primary/20 pl-6">{user.bio || 'No biography recorded for this entity.'}</p>
              </div>
            </motion.section>

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               <MetricCard icon={<Building2 className="h-6 w-6" />} label="Assets Linked" value="2" index={0} />
               <MetricCard icon={<Heart className="h-6 w-6" />} label="Neural Requests" value="8" index={1} />
               <MetricCard icon={<CreditCard className="h-6 w-6" />} label="Ledger Events" value="12" index={2} />
            </section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-10 border border-white/10 bg-card/40 backdrop-blur-3xl rounded-[3rem] shadow-xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <h3 className="font-black text-2xl italic tracking-tight">Active Pulse Stream</h3>
                <Button variant="ghost" size="sm" className="font-black uppercase tracking-widest text-[10px] text-primary hover:bg-primary/10 rounded-xl px-4 h-10">Terminal History</Button>
              </div>
              <div className="space-y-4 pt-4">
                 <ActivityRow title="System Entry via MacOS Cluster" time="2.4h prior" />
                 <ActivityRow title="Modified Asset: Cozy Kumasi Studio" time="Current Cycle -1" />
                 <ActivityRow title="Financial Settlement: ₵50 Execution" time="Current Cycle -3" />
              </div>
            </motion.section>
          </div>

          <div className="space-y-10">
             <motion.section 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.3 }}
               className="p-8 border border-primary/20 bg-primary/5 backdrop-blur-xl rounded-[2.5rem] space-y-6 shadow-2xl shadow-primary/5"
             >
                <h3 className="font-black text-xl italic tracking-tight">Root Commands</h3>
                <div className="space-y-3">
                   <CommandButton icon={<UserCheck className="h-5 w-5" />} label="Neural Verification" onClick={() => handleAction('Neural Verification')} />
                   <CommandButton icon={<ExternalLink className="h-5 w-5" />} label="Mirror Account" onClick={() => handleAction('Account Mirroring')} />
                   <CommandButton icon={<Trash2 className="h-5 w-5" />} label="Decommission Entity" variant="destructive" onClick={() => handleAction('Decommission')} />
                </div>
             </motion.section>

             <motion.section 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.4 }}
               className="p-8 border border-white/10 bg-card/40 backdrop-blur-3xl rounded-[2.5rem] shadow-xl space-y-6"
             >
                <h3 className="font-black text-xl italic tracking-tight">Observer Notes</h3>
                 <textarea
                   placeholder="Record sensitive entity observations..."
                   className="w-full h-40 p-4 bg-muted/20 border border-white/5 rounded-[1.5rem] text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all placeholder:italic"
                 />
                 <Button 
                   className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary"
                   onClick={() => handleAction('Ledger Note Update')}
                 >
                   Update Ledger Note
                 </Button>
             </motion.section>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">{label}</p>
      <p className="text-base font-black tracking-tight">{value}</p>
    </div>
  )
}

function MetricCard({ icon, label, value, index }: { icon: any, label: string, value: string, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 + (index * 0.1) }}
      className="p-8 border border-white/10 bg-card/40 backdrop-blur-3xl rounded-[2.5rem] shadow-xl text-center space-y-4 group hover:border-primary/50 transition-all cursor-pointer overflow-hidden relative"
    >
       <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
       <div className="inline-flex p-4 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform relative z-10 shadow-lg shadow-primary/5">
         {icon}
       </div>
       <div className="relative z-10">
          <p className="text-4xl font-black tracking-tighter leading-none mb-1">{value}</p>
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] opacity-40 italic">{label}</p>
       </div>
    </motion.div>
  )
}

function ActivityRow({ title, time }: { title: string, time: string }) {
  return (
    <div className="flex items-center justify-between py-4 border-b last:border-0 border-white/5 hover:bg-white/5 transition-colors px-4 -mx-4 rounded-xl">
       <span className="font-black text-sm tracking-tight text-foreground/80 lowercase italic">{title}</span>
       <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40">{time}</span>
    </div>
  )
}

function CommandButton({ icon, label, variant = "outline" }: any) {
  return (
    <button className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-sm active:scale-95 ${
      variant === 'destructive'
        ? 'text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/20 shadow-rose-500/10'
        : 'text-foreground/60 bg-white/5 border border-white/10 hover:bg-primary hover:text-white hover:border-primary shadow-primary/5'
    }`}>
      {icon}
      {label}
    </button>
  )
}
