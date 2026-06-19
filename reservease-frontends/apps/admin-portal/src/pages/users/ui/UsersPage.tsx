import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, MoreHorizontal, UserCheck, ShieldAlert, UserCog, UserPlus, Trash2, Edit2 } from 'lucide-react'
import { MOCK_USERS } from '@/data/users'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
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
import { Select, SelectContent,SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PulseBackground } from "@/components/layout/PulseBackground"
import { motion } from "framer-motion"

export function UsersPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Tenant' });
  const [editingUser, setEditingUser] = useState<any>(null);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setUsers(users.map(u =>
      u.id === id
        ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' }
        : u
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user = {
      id: `USR-00${users.length + 1}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      phone: '+233 00 000 0000',
      avatar: newUser.name.split(' ').map(n => n[0]).join(''),
      bio: '',
      address: '',
    };
    setUsers([user, ...users]);
    setIsAddUserOpen(false);
    setNewUser({ name: '', email: '', role: 'Tenant' });
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setIsEditUserOpen(false);
    setEditingUser(null);
  };

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
              User <span className="text-primary italic">Architecture</span>
            </h1>
            <p className="text-base text-muted-foreground font-medium mt-2">Manage platform users, roles, and security statuses.</p>
          </div>

          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0 h-14 px-8 rounded-2xl shadow-primary font-black uppercase tracking-widest text-[10px]">
                <UserPlus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] bg-card/60 backdrop-blur-3xl border-white/20">
              <form onSubmit={handleAddUser}>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black italic">Provision Account</DialogTitle>
                  <DialogDescription className="font-medium">
                    Create a new user account for the platform.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-8">
                  <div className="grid gap-3">
                    <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Full Identity</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="h-12 rounded-xl bg-background/40 border-2 border-border/50 focus:border-primary focus:ring-0 font-bold"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Email Sequence</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="h-12 rounded-xl bg-background/40 border-2 border-border/50 focus:border-primary focus:ring-0 font-bold"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="role" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Access Tier</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(v) => setNewUser({...newUser, role: v})}
                    >
                      <SelectTrigger className="h-12 rounded-xl bg-background/40 border-2 border-border/50 focus:border-primary focus:ring-0 font-bold">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="Tenant">Tenant</SelectItem>
                        <SelectItem value="Owner">Owner</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">Initialize Account</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] bg-card/60 backdrop-blur-3xl border-white/20">
            {editingUser && (
              <form onSubmit={handleEditUser}>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black italic">Modify Entity</DialogTitle>
                  <DialogDescription className="font-medium">
                    Update information for <strong>{editingUser.name}</strong>.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-8">
                  <div className="grid gap-3">
                    <Label htmlFor="edit-name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Full Identity</Label>
                    <Input
                      id="edit-name"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                      className="h-12 rounded-xl bg-background/40 border-2 border-border/50 focus:border-primary focus:ring-0 font-bold"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="edit-email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Email Sequence</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                      className="h-12 rounded-xl bg-background/40 border-2 border-border/50 focus:border-primary focus:ring-0 font-bold"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="edit-role" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">Access Tier</Label>
                    <Select
                      value={editingUser.role}
                      onValueChange={(v) => setEditingUser({...editingUser, role: v})}
                    >
                      <SelectTrigger className="h-12 rounded-xl bg-background/40 border-2 border-border/50 focus:border-primary focus:ring-0 font-bold">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="Tenant">Tenant</SelectItem>
                        <SelectItem value="Owner">Owner</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">Save Manifest</Button>
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
              placeholder="Search entity sequence..."
              className="w-full h-12 pl-12 pr-4 bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 rounded-2xl border-border/50 bg-card/40 backdrop-blur-xl font-black uppercase tracking-widest text-[10px]">
            <Filter className="mr-2 h-4 w-4" />
            Filters
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
                  <th className="px-8 py-6 font-black text-muted-foreground text-[10px] uppercase tracking-[0.2em]">Entity</th>
                  <th className="px-8 py-6 font-black text-muted-foreground text-[10px] uppercase tracking-[0.2em]">Tier</th>
                  <th className="px-8 py-6 font-black text-muted-foreground text-[10px] uppercase tracking-[0.2em]">State</th>
                  <th className="px-8 py-6 font-black text-muted-foreground text-[10px] uppercase tracking-[0.2em]">Synchronized</th>
                  <th className="px-8 py-6 font-black text-muted-foreground text-[10px] uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {filteredUsers.length === 0 ? (
                  <tr><td colSpan={5} className="px-8 py-20 text-center text-muted-foreground font-black uppercase tracking-widest text-xs italic opacity-40">No entities found in pulse stream.</td></tr>
                ) : filteredUsers.map((user, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (idx * 0.05) }}
                    key={user.id} 
                    className="hover:bg-primary/5 transition-colors group/row"
                  >
                    <td className="px-8 py-6 border-b-transparent">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-xs shadow-lg shadow-primary/20 group-hover/row:scale-110 group-hover/row:rotate-6 transition-transform">
                          {user.avatar}
                        </div>
                        <div>
                          <Link to={`/users/${user.id}`} className="font-black text-foreground hover:text-primary transition-colors block text-base tracking-tight leading-none mb-1">
                            {user.name}
                          </Link>
                          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 border-b-transparent font-black text-muted-foreground uppercase text-[10px] tracking-widest">
                      {user.role}
                    </td>
                    <td className="px-8 py-6 border-b-transparent">
                      <Badge variant={user.status === 'Active' ? 'default' : 'destructive'} className="rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10">
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 border-b-transparent text-muted-foreground font-black uppercase text-[10px] tracking-widest italic opacity-60">
                      {new Date(user.joinedDate).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 border-b-transparent text-right">
                      <div className="flex items-center justify-end gap-2 opacity-10 md:opacity-0 group-hover/row:opacity-100 transition-all">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary" asChild>
                          <Link to={`/users/${user.id}`}><MoreHorizontal className="h-5 w-5" /></Link>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                              <UserCog className="h-5 w-5 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-64 rounded-[2rem] bg-card/80 backdrop-blur-3xl shadow-2xl border-white/20 p-2">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-4 py-3">Administrative Protocols</DropdownMenuLabel>
                            <DropdownMenuItem
                              className="cursor-pointer rounded-2xl h-12 font-bold px-4 focus:bg-primary focus:text-white"
                              onClick={() => {
                                setEditingUser(user);
                                setIsEditUserOpen(true);
                              }}
                            >
                              <Edit2 className="mr-3 h-4 w-4" /> Edit Identity
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className={`cursor-pointer rounded-2xl h-12 font-bold px-4 ${user.status === 'Active' ? 'text-destructive focus:bg-destructive focus:text-white' : 'text-emerald-500 focus:bg-emerald-500 focus:text-white'}`}
                              onClick={() => toggleStatus(user.id)}
                            >
                              {user.status === 'Active' ? (
                                <><ShieldAlert className="mr-3 h-4 w-4" /> Suspend Account</>
                              ) : (
                                <><UserCheck className="mr-3 h-4 w-4" /> Reactivate Account</>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-2 opacity-10" />

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" className="w-full justify-start h-12 px-4 rounded-2xl text-xs text-rose-600 hover:text-white hover:bg-rose-500 cursor-pointer font-black uppercase tracking-widest">
                                  <Trash2 className="mr-3 h-4 w-4" /> Purge Entity
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="rounded-[3rem] bg-card/80 backdrop-blur-3xl border-white/20">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-3xl font-black tracking-tighter italic">Confirm Purge</AlertDialogTitle>
                                  <AlertDialogDescription className="font-medium text-lg leading-relaxed pt-2">
                                    This will permanently delete <strong>{user.name}'s</strong> account and all their associated platform data. This process is irreversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="pt-8">
                                  <AlertDialogCancel className="h-14 rounded-2xl font-black uppercase tracking-widest text-[10px]">Abort Process</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="h-14 bg-rose-600 text-white hover:bg-rose-700 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-rose-900/20"
                                    onClick={() => deleteUser(user.id)}
                                  >
                                    Execute Purge
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
