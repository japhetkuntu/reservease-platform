import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shield, User, Lock, Bell, Sparkles, ShieldCheck, Fingerprint, Activity } from 'lucide-react'
import { PulseBackground } from "@/components/layout/PulseBackground"
import { motion } from "framer-motion"

export function ProfilePage() {
  const [admin, setAdmin] = useState({
    name: 'ReservEase Admin',
    email: 'admin@reservease.com',
    role: 'Super Administrator',
    avatar: 'AD'
  })

  return (
    <div className="relative min-h-screen">
      <PulseBackground />
      
      <div className="relative z-10 max-w-5xl mx-auto space-y-12 pb-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col md:flex-row items-center gap-10 pb-12 border-b border-white/10"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
            <Avatar className="h-32 w-32 border-4 border-background shadow-2xl relative">
               <AvatarFallback className="text-4xl font-black bg-primary text-white italic">{admin.avatar}</AvatarFallback>
            </Avatar>
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 90 }}
              className="absolute -bottom-2 -right-2 h-12 w-12 bg-card/80 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center shadow-xl cursor-pointer"
            >
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>
          </div>
          
          <div className="space-y-4 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-md"
            >
              <ShieldCheck size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">Identity Verified</span>
            </motion.div>
            <h1 className="text-6xl font-black tracking-tighter text-foreground leading-none">{admin.name}</h1>
            <div className="flex items-center justify-center md:justify-start gap-3 text-muted-foreground">
              <Fingerprint className="h-5 w-5 text-primary opacity-60" />
              <span className="text-sm font-black uppercase tracking-[0.2em] italic opacity-60">{admin.role}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-2">
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-10 border border-white/10 bg-card/40 backdrop-blur-3xl rounded-[3rem] shadow-xl space-y-10"
          >
            <div className="space-y-1">
              <h3 className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                <User className="h-6 w-6 text-primary opacity-60" /> Neural Identity
              </h3>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Core administrative metadata.</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3 group/field">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1 group-focus-within/field:text-primary transition-colors">Manifest Name</Label>
                <Input 
                  id="name" 
                  value={admin.name} 
                  onChange={e => setAdmin({...admin, name: e.target.value})} 
                  className="h-14 rounded-2xl bg-background/40 border-2 border-border/50 focus:border-primary focus:ring-0 font-bold transition-all" 
                />
              </div>
              <div className="space-y-3 group/field">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1 group-focus-within/field:text-primary transition-colors">Communication Sequence</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={admin.email} 
                  onChange={e => setAdmin({...admin, email: e.target.value})} 
                  className="h-14 rounded-2xl bg-background/40 border-2 border-border/50 focus:border-primary focus:ring-0 font-bold transition-all" 
                />
              </div>
              <Button className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">Commit Protocol</Button>
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-10 border border-white/10 bg-card/40 backdrop-blur-3xl rounded-[3rem] shadow-xl space-y-10"
          >
            <div className="space-y-1">
              <h3 className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                <Lock className="h-6 w-6 text-primary opacity-60" /> Security Kernel
              </h3>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Access key management and encryption.</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3 group/field">
                <Label htmlFor="current-password" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1 group-focus-within/field:text-primary transition-colors">Active Access Key</Label>
                <Input id="current-password" type="password" className="h-14 rounded-2xl bg-background/40 border-2 border-border/50 focus:border-primary focus:ring-0 font-bold" placeholder="••••••••" />
              </div>
              <div className="space-y-3 group/field">
                <Label htmlFor="new-password" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-1 group-focus-within/field:text-primary transition-colors">New Sequence</Label>
                <Input id="new-password" type="password" className="h-14 rounded-2xl bg-background/40 border-2 border-border/50 focus:border-primary focus:ring-0 font-bold" />
              </div>
              <Button variant="outline" className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] border-white/10 bg-white/5 hover:bg-primary hover:text-white transition-all">Rotate Keys</Button>
            </div>
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-10 border border-white/10 bg-card/40 backdrop-blur-3xl rounded-[3rem] shadow-xl space-y-10 md:col-span-2"
          >
            <div className="space-y-1">
              <h3 className="text-2xl font-black italic tracking-tight flex items-center gap-3">
                <Bell className="h-6 w-6 text-primary opacity-60" /> Telemetry Preferences
              </h3>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-40">Configure administrative alert flow.</p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-3">
               <PreferenceItem title="System Health" description="Critical engine failures." active />
               <PreferenceItem title="Provision Alerts" description="New property submissions." active />
               <PreferenceItem title="Treasury Reports" description="Weekly financial digests." />
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}

function PreferenceItem({ title, description, active = false }: any) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`p-6 rounded-[2rem] border transition-all flex flex-col justify-between gap-6 cursor-pointer ${active ? 'bg-primary/10 border-primary/30 shadow-lg shadow-primary/5' : 'bg-white/5 border-white/5 opacity-60'}`}
    >
       <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-black text-lg tracking-tight italic">{title}</p>
            <Activity className={`h-4 w-4 ${active ? 'text-primary animate-pulse' : 'text-muted-foreground/40'}`} />
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 leading-relaxed">{description}</p>
       </div>
       <div className={`h-8 w-16 rounded-2xl relative transition-all ${active ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-white/10'}`}>
          <motion.div 
            animate={{ x: active ? 32 : 4 }}
            className="absolute top-1.5 h-5 w-5 rounded-lg bg-white shadow-sm" 
          />
       </div>
    </motion.div>
  )
}
