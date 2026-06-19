import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Bell, ShieldCheck, AlertCircle, Info, CheckCircle2, MoreVertical, Trash2, Activity, Zap } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PulseBackground } from "@/components/layout/PulseBackground"
import { motion, AnimatePresence } from "framer-motion"

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'critical', title: 'Payment Engine Latency', message: 'The payment gateway is experiencing higher than usual response times.', time: '2 mins ago', read: false },
  { id: 2, type: 'success', title: 'Weekly Payouts Completed', message: 'All scheduled owner payouts for this week have been successfully processed.', time: '1 hour ago', read: true },
  { id: 3, type: 'info', title: 'New Property Listing', message: 'A new luxury villa in Accra has been submitted for verification.', time: '3 hours ago', read: false },
  { id: 4, type: 'warning', title: 'User Verification Pending', message: '12 new users are awaiting ID verification in the gatekeeper queue.', time: '5 hours ago', read: true },
  { id: 5, type: 'info', title: 'System Maintenance Task', message: 'Automated database indexing and backup completed successfully.', time: 'Yesterday', read: true },
]

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  return (
    <div className="relative min-h-screen">
      <PulseBackground />
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-8 pb-20">
        <div 
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border/50"
        >
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-foreground leading-none">
              Notifications
            </h1>
            <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              System alerts and updates.
            </p>
          </div>
          <Button 
            onClick={markAllAsRead} 
            variant="outline" 
            className="h-12 px-6 rounded-lg border-border/50 bg-card font-semibold uppercase tracking-wide text-xs"
          >
            Mark All as Read
          </Button>
        </div>

        <div className="space-y-4">
          {notifications.length > 0 ? notifications.map((notification) => (
              <div
                key={notification.id}
                className={`group p-6 rounded-lg border transition-all flex items-start gap-6 ${
                  notification.read ? 'bg-card border-border/50 opacity-60' : 'bg-primary/5 border-primary/20'
                }`}
              >
                {!notification.read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg" />
                )}

                <div className={`h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  notification.type === 'critical' ? 'bg-rose-500/10 text-rose-500' :
                  notification.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                  notification.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                  'bg-primary/10 text-primary'
                }`}>
                  {notification.type === 'critical' ? <AlertCircle className="h-5 w-5" /> :
                   notification.type === 'warning' ? <ShieldCheck className="h-5 w-5" /> :
                   notification.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> :
                   <Zap className="h-5 w-5" />}
                </div>

                <div className="flex-1 space-y-1 pt-0.5">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-base font-semibold tracking-tight ${notification.read ? 'text-foreground/70' : 'text-foreground'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wide">{notification.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground/80 leading-relaxed">
                    {notification.message}
                  </p>
                </div>

                <div className="flex-shrink-0">
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-muted">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-lg bg-card border-border/50 shadow-lg p-1">
                        <DropdownMenuItem
                          className="text-rose-600 focus:bg-rose-500/10 cursor-pointer font-semibold text-xs h-10 rounded px-3"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                   </DropdownMenu>
                </div>
              </div>
            )) : (
              <div 
                className="py-20 text-center border border-dashed border-border/50 rounded-lg bg-muted/20 space-y-6"
              >
                 <div className="inline-flex p-3 bg-muted rounded-lg text-muted-foreground">
                   <Bell className="h-8 w-8" />
                 </div>
                 <div className="space-y-2">
                   <h2 className="text-xl font-bold tracking-tight">All caught up</h2>
                   <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/60">No notifications at this time.</p>
                 </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
