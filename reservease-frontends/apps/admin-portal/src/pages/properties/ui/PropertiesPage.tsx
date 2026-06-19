import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Home, CheckCircle2, MoreVertical, AlertCircle, Eye, Plus, Trash2, Edit2, Loader2 } from 'lucide-react'
import { propertiesApi } from '@/api/properties'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PulseBackground } from "@/components/layout/PulseBackground"
import { motion } from "framer-motion"

export function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [newProp, setNewProp] = useState({ title: '', city: '', address: '', price: '' })
  const [editingProp, setEditingProp] = useState<any>(null)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await propertiesApi.listProperties();
        setProperties(data || []);
      } catch (error) {
        console.error("Neural telemetry failure:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filtered = properties.filter(p =>
    (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.city || "").toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = (id: string, field: 'listingStatus' | 'verificationStatus', value: string) => {
    setProperties(properties.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const deleteProperty = (id: string) => {
    setProperties(properties.filter(p => p.id !== id));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = {
      id: `PROP-${100 + properties.length + 1}`,
      title: newProp.title,
      ownerId: "USR-002",
      ownerName: "Jane Smith",
      city: newProp.city,
      address: newProp.address,
      price: parseInt(newProp.price) || 0,
      listingStatus: "Pending",
      verificationStatus: "Unverified",
      createdAt: new Date().toISOString().split('T')[0],
      amenities: [],
      description: "Manually added property.",
      images: []
    };
    setProperties([prop, ...properties]);
    setIsAddOpen(false);
    setNewProp({ title: '', city: '', address: '', price: '' });
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setProperties(properties.map(p => p.id === editingProp.id ? editingProp : p));
    setIsEditOpen(false);
    setEditingProp(null);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center font-black uppercase tracking-[0.5em] animate-pulse">
        Accessing Property Inventory...
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
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border/20"
        >
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground leading-none">
              Property <span className="text-primary italic">Inventory</span>
            </h1>
            <p className="text-base text-muted-foreground font-medium mt-2">Approve, verify, and monitor accommodations system-wide.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="h-12 px-6 rounded-2xl border-border/50 bg-card/40 backdrop-blur-xl font-black uppercase tracking-widest text-[10px]">Export Stream</Button>

             <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
               <DialogTrigger asChild>
                 <Button className="h-12 px-6 rounded-2xl shadow-primary font-black uppercase tracking-widest text-[10px]">
                   <Plus className="mr-2 h-4 w-4" />
                   Create Node
                 </Button>
               </DialogTrigger>
               <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] bg-card/60 backdrop-blur-3xl border-white/20">
                 <form onSubmit={handleAdd}>
                   <DialogHeader>
                     <DialogTitle className="text-2xl font-black italic text-foreground">Provision Property</DialogTitle>
                     <DialogDescription className="font-medium">
                       Manually enter a new listing into the platform cluster.
                     </DialogDescription>
                   </DialogHeader>
                   <div className="grid gap-6 py-8">
                     <div className="grid gap-3">
                       <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Property Title</Label>
                       <Input
                         id="title"
                         placeholder="Luxury Studio Apartment"
                         className="h-12 rounded-xl bg-background/40 border-2 border-border/50 focus:border-primary focus:ring-0 font-bold"
                         value={newProp.title}
                         onChange={(e) => setNewProp({...newProp, title: e.target.value})}
                         required
                       />
                     </div>
                     <div className="grid gap-3">
                       <Label htmlFor="city" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Geographic Node</Label>
                       <Input
                         id="city"
                         placeholder="Accra"
                         className="h-12 rounded-xl bg-background/40 border-2 border-border/50 focus:border-primary focus:ring-0 font-bold"
                         value={newProp.city}
                         onChange={(e) => setNewProp({...newProp, city: e.target.value})}
                         required
                       />
                     </div>
                     <div className="grid gap-3">
                       <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Monthly Yield (GH₵)</Label>
                       <Input
                         id="price"
                         type="number"
                         placeholder="1500"
                         className="h-12 rounded-xl bg-background/40 border-2 border-border/50 focus:border-primary focus:ring-0 font-bold"
                         value={newProp.price}
                         onChange={(e) => setNewProp({...newProp, price: e.target.value})}
                         required
                       />
                     </div>
                   </div>
                   <DialogFooter>
                     <Button type="submit" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">Initialize Node</Button>
                   </DialogFooter>
                 </form>
               </DialogContent>
             </Dialog>
          </div>
        </motion.div>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] bg-card/60 backdrop-blur-3xl border-white/20">
            {editingProp && (
              <form onSubmit={handleEdit}>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black italic text-foreground">Modify Node</DialogTitle>
                  <DialogDescription className="font-medium">
                    Update metadata for <strong>{editingProp.title}</strong>.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-8">
                  <div className="grid gap-3">
                    <Label htmlFor="edit-title" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Node Title</Label>
                    <Input
                      id="edit-title"
                      value={editingProp.title}
                      onChange={(e) => setEditingProp({...editingProp, title: e.target.value})}
                      className="h-12 rounded-xl bg-background/40 border-2 border-border/50 focus:border-primary focus:ring-0 font-bold"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="edit-city" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Geographic Node</Label>
                    <Input
                      id="edit-city"
                      value={editingProp.city}
                      onChange={(e) => setEditingProp({...editingProp, city: e.target.value})}
                      className="h-12 rounded-xl bg-background/40 border-2 border-border/50 focus:border-primary focus:ring-0 font-bold"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="edit-price" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Monthly Yield (GH₵)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      value={editingProp.price}
                      onChange={(e) => setEditingProp({...editingProp, price: parseInt(e.target.value) || 0})}
                      className="h-12 rounded-xl bg-background/40 border-2 border-border/50 focus:border-primary focus:ring-0 font-bold"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">Commit Changes</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4"
        >
          <div className="relative flex-1 max-w-sm group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search node title or city..."
              className="w-full h-12 pl-12 pr-4 bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 rounded-2xl border-border/50 bg-card/40 backdrop-blur-xl font-black uppercase tracking-widest text-[10px]">
            <Filter className="mr-2 h-4 w-4" />
            Status: All Nodes
          </Button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-[3rem] border border-white/10 bg-card/40 backdrop-blur-3xl shadow-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-primary/5 border-b border-border/20">
                <tr>
                  <th className="px-8 py-6 font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground">Property Node</th>
                  <th className="px-8 py-6 font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground">Controller</th>
                  <th className="px-8 py-6 font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground">Coordinates</th>
                  <th className="px-8 py-6 font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground">Listing State</th>
                  <th className="px-8 py-6 font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground">Trust Sequence</th>
                  <th className="px-8 py-6 font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 font-medium">
                {filtered.map((prop, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (idx * 0.05) }}
                    key={prop.id} 
                    className="hover:bg-primary/5 transition-colors group/row"
                  >
                    <td className="px-8 py-6 border-b-transparent">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover/row:scale-110 group-hover/row:rotate-6 transition-transform">
                            <Home className="h-6 w-6" />
                          </div>
                          <div>
                            <Link to={`/properties/${prop.id}`} className="hover:text-primary transition-colors block leading-none font-black text-base tracking-tight mb-1">
                              {prop.title}
                            </Link>
                            <span className="text-[10px] font-black font-mono text-primary/40 uppercase tracking-widest">ID: {prop.id}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6 border-b-transparent">
                       <Link to={`/users/${prop.ownerId}`} className="text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest text-[10px] font-black italic opacity-60">
                         {prop.ownerName}
                       </Link>
                    </td>
                    <td className="px-8 py-6 text-muted-foreground text-[10px] font-black uppercase tracking-widest border-b-transparent italic opacity-60">{prop.address}</td>
                    <td className="px-8 py-6 border-b-transparent">
                      <Badge variant={prop.listingStatus === 'Approved' ? 'default' : prop.listingStatus === 'Rejected' ? 'destructive' : 'secondary'} className="rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10">
                        {prop.listingStatus}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 border-b-transparent">
                       <Badge variant={prop.verificationStatus === 'Verified' ? 'default' : 'secondary'} className="rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10">
                         {prop.verificationStatus === 'Verified' ? <CheckCircle2 className="mr-2 h-3 w-3 inline" /> : <AlertCircle className="mr-2 h-3 w-3 inline" />}
                         {prop.verificationStatus}
                       </Badge>
                    </td>
                    <td className="px-8 py-6 text-right border-b-transparent">
                      <div className="flex items-center justify-end gap-2 opacity-10 md:opacity-0 group-hover/row:opacity-100 transition-all">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl group-hover:bg-primary/10">
                              <MoreVertical className="h-5 w-5 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-64 rounded-[2rem] bg-card/80 backdrop-blur-3xl shadow-2xl border-white/20 p-2">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-4 py-3">Node Protocols</DropdownMenuLabel>
                            <DropdownMenuItem asChild className="rounded-2xl h-12 font-bold px-4 focus:bg-primary focus:text-white">
                              <Link to={`/properties/${prop.id}`} className="cursor-pointer">
                                <Eye className="mr-3 h-4 w-4" /> Inspect Node
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer rounded-2xl h-12 font-bold px-4 focus:bg-primary focus:text-white"
                              onClick={() => {
                                setEditingProp(prop);
                                setIsEditOpen(true);
                              }}
                            >
                              <Edit2 className="mr-3 h-4 w-4" /> Edit Metadata
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-2 opacity-10" />
                            <DropdownMenuItem
                              className="cursor-pointer h-12 font-black uppercase tracking-widest text-[10px] text-primary focus:bg-primary focus:text-white rounded-2xl px-4"
                              onClick={() => updateStatus(prop.id, 'listingStatus', 'Approved')}
                            >
                               <CheckCircle2 className="mr-3 h-4 w-4" /> Approve State
                            </DropdownMenuItem>
                            <DropdownMenuItem
                               className="cursor-pointer h-12 font-black uppercase tracking-widest text-[10px] text-emerald-600 focus:bg-emerald-500 focus:text-white rounded-2xl px-4"
                               onClick={() => updateStatus(prop.id, 'verificationStatus', 'Verified')}
                            >
                               <CheckCircle2 className="mr-3 h-4 w-4" /> Verify Node
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="my-2 opacity-10" />

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" className="w-full justify-start h-12 px-4 rounded-2xl text-[10px] text-rose-600 hover:text-white hover:bg-rose-500 cursor-pointer font-black uppercase tracking-widest">
                                  <Trash2 className="mr-3 h-4 w-4" /> Archive Node
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-[3rem] bg-card/80 backdrop-blur-3xl border-white/20">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-3xl font-black tracking-tighter italic">Archive Property?</AlertDialogTitle>
                                  <AlertDialogDescription className="font-medium text-lg leading-relaxed pt-2">
                                    This will decommission <strong>{prop.title}</strong> from active searches. It will remain in the platform archive for recovery.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="pt-8">
                                  <AlertDialogCancel className="h-14 rounded-2xl font-black uppercase tracking-widest text-[10px]">Abort Archive</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="h-14 bg-rose-600 text-white hover:bg-rose-700 rounded-2xl font-black uppercase tracking-widest text-[10px]"
                                    onClick={() => deleteProperty(prop.id)}
                                  >
                                    Execute Archive
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
