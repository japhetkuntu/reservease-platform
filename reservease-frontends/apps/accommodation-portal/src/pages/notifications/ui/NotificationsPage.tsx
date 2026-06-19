import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell, CheckCircle2, Clock, AlertCircle, Info,
  ChevronRight, Trash2, MessageSquare,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'request';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Property Approved",
    message: "Your property 'Elite Suites' has been approved by the admin and is now live.",
    timestamp: "2 hours ago",
    isRead: false,
    link: "/accommodation/1"
  },
  {
    id: "2",
    type: "request",
    title: "New Booking Request",
    message: "A tenant has requested a viewing for 'Sunrise Apartments'.",
    timestamp: "5 hours ago",
    isRead: false,
    link: "/requests/REQ-501"
  },
  {
    id: "3",
    type: "info",
    title: "Profile Verified",
    message: "Your owner profile has been successfully verified. You now have the 'Verified Owner' badge.",
    timestamp: "1 day ago",
    isRead: true,
  },
  {
    id: "4",
    type: "warning",
    title: "Action Required",
    message: "Please update your payment information to avoid delays in receiving payments.",
    timestamp: "2 days ago",
    isRead: true,
    link: "/profile?tab=info"
  }
];

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="flex-1 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 pb-24 sm:pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary animate-pulse-slow">
                <Bell className="w-6 h-6" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-glow">Updates</h1>
            </div>
            <p className="text-muted-foreground font-medium pl-1">
              Stay Informed about your properties and requests
            </p>
          </div>

          <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-2xl border border-border/50">
            <Button
              variant={filter === 'all' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className="rounded-xl font-bold"
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('unread')}
              className="rounded-xl font-bold relative"
            >
              Unread
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-primary text-[10px] items-center justify-center text-primary-foreground font-black tabular-nums">
                    {unreadCount}
                  </span>
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-full px-3 py-1 font-bold bg-muted/30 border-border/50">
              {filteredNotifications.length} Notifications
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="text-primary font-bold hover:bg-primary/5 rounded-full"
          >
            Mark all as read
          </Button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onDelete={() => deleteNotification(n.id)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-20 text-center bg-muted/20 border border-dashed border-border/50 rounded-[3rem] animate-in fade-in zoom-in-95 duration-700">
              <div className="p-6 bg-muted/50 rounded-full mb-6 relative">
                <Bell className="w-12 h-12 text-muted-foreground/30" />
                <div className="absolute top-4 right-4 h-4 w-4 rounded-full bg-primary/20 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold tracking-tight mb-2">Inbox completely clear</h3>
              <p className="text-muted-foreground max-w-xs mx-auto text-sm leading-relaxed">
                You've caught up with everything! New property approvals and tenant requests will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Pro Tip */}
        <div className="p-8 rounded-[3rem] glass border border-white/20 dark:border-white/5 relative overflow-hidden group">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-1000" />
          <div className="relative flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="p-5 bg-primary rounded-[2rem] shadow-2xl shadow-primary/20 rotate-3">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-black tracking-tight uppercase italic">Pro Tip</h4>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                Enable push notifications in your browser settings to get instant updates without refreshing the portal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationCard({ notification: n, onDelete }: { notification: Notification; onDelete: () => void }) {
  const Icon = {
    success: CheckCircle2,
    info: Info,
    warning: AlertCircle,
    request: MessageSquare
  }[n.type];

  const colorClass = {
    success: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    info: "bg-sky-500/10 text-sky-600 border-sky-500/20",
    warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    request: "bg-primary/10 text-primary border-primary/20"
  }[n.type];

  const content = (
    <div className={cn(
      "group relative p-6 rounded-[2.5rem] bg-card border border-border/50 shadow-sm transition-all duration-300 hover:shadow-md hover:border-border",
      !n.isRead && "bg-primary/5 border-primary/20 shadow-primary/5"
    )}>
      <div className="flex items-start gap-5">
        <div className={cn("p-4 rounded-2xl shrink-0 border", colorClass)}>
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0 pr-10">
          <div className="flex items-center gap-3 mb-1">
            <h3 className={cn("font-bold text-lg tracking-tight", !n.isRead && "text-primary")}>
              {n.title}
            </h3>
            {!n.isRead && (
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            )}
          </div>
          <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-4">
            {n.message}
          </p>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Clock className="w-3 h-3" /> {n.timestamp}
          </p>
        </div>

        <div className="absolute right-6 top-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
            className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground/30"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          {n.link && (
            <div className="h-10 w-10 flex items-center justify-center bg-primary/10 text-primary rounded-full animate-in zoom-in-75">
              <ChevronRight className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (n.link) {
    return <Link to={n.link} className="block transition-transform hover:scale-[1.01] active:scale-[0.99]">{content}</Link>;
  }

  return content;
}
