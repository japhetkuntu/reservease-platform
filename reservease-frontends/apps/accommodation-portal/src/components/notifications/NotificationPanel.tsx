import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Notification } from "@/data/notifications";
import {
  Bell, CheckCheck, MessageSquare, ShieldCheck,
  Clock, Info, AlertTriangle, CheckCircle2
} from "lucide-react";

// ── Time formatting ───────────────────────────────────────────────────────────
function timeAgo(iso: string): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "—";
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60)    return "Just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ── Icon & colour per type ────────────────────────────────────────────────────
function NotifIcon({ type }: { type: Notification["type"] }) {
  const map = {
    request:  { icon: MessageSquare, bg: "bg-blue-100 dark:bg-blue-900/40",    text: "text-blue-600 dark:text-blue-400"    },
    approved: { icon: CheckCircle2,  bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-600 dark:text-emerald-400" },
    review:   { icon: Clock,         bg: "bg-amber-100 dark:bg-amber-900/40",  text: "text-amber-600 dark:text-amber-400"  },
    message:  { icon: MessageSquare, bg: "bg-violet-100 dark:bg-violet-900/40",text: "text-violet-600 dark:text-violet-400"},
    warning:  { icon: AlertTriangle, bg: "bg-red-100 dark:bg-red-900/40",      text: "text-red-600 dark:text-red-400"      },
    system:   { icon: Info,          bg: "bg-muted",                            text: "text-muted-foreground"               },
  };
  const { icon: Icon, bg, text } = map[type] ?? map.system;
  return (
    <div className={cn("p-2.5 rounded-full flex-shrink-0", bg)}>
      <Icon className={cn("w-4 h-4", text)} />
    </div>
  );
}

// ── Row ───────────────────────────────────────────────────────────────────────
function NotifRow({
  n, onRead, onClose
}: { n: Notification; onRead: (id: string) => void; onClose: () => void }) {
  const handleClick = () => {
    onRead(n.id);
    onClose();
  };

  const inner = (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-colors group",
        n.read ? "hover:bg-muted/50" : "bg-primary/5 hover:bg-primary/10"
      )}
    >
      <NotifIcon type={n.type} />
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm leading-snug", n.read ? "text-foreground" : "font-semibold text-foreground")}>
            {n.title}
          </p>
          <span className="text-[11px] text-muted-foreground flex-shrink-0 mt-0.5">{timeAgo(n.time)}</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{n.body}</p>
      </div>
      {!n.read && (
        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
      )}
    </div>
  );

  return n.actionUrl ? <Link to={n.actionUrl}>{inner}</Link> : inner;
}

// ── Panel ─────────────────────────────────────────────────────────────────────
interface NotificationPanelProps {
  children: ReactNode;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export function NotificationPanel({
  children, notifications = [], onMarkRead, onMarkAllRead
}: NotificationPanelProps) {
  const safeNotifs = Array.isArray(notifications) ? notifications : [];
  const unread = safeNotifs.filter(n => !n.read);
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96 p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-5 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-base font-bold">
              <Bell className="h-5 w-5" />
              Notifications
              {unread.length > 0 && (
                <Badge className="ml-1 text-[10px] py-0 px-1.5 h-5">
                  {unread.length} new
                </Badge>
              )}
            </SheetTitle>
            {unread.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllRead}
                className="text-xs h-8 gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* List */}
        <ScrollArea className="flex-1">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center px-6">
              <div className="p-4 bg-muted rounded-full mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="font-semibold text-sm">All caught up!</p>
              <p className="text-xs text-muted-foreground mt-1">No notifications right now.</p>
            </div>
          ) : (
            <div className="p-3 space-y-0.5">
              {unread.length > 0 && (
                <>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold px-2 pt-2 pb-1">
                    New
                  </p>
                  {unread.map(n => (
                    <NotifRow key={n.id} n={n} onRead={onMarkRead} onClose={() => setOpen(false)} />
                  ))}
                  <Separator className="my-3" />
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold px-2 pb-1">
                    Earlier
                  </p>
                </>
              )}
              {notifications.filter(n => n.read).map(n => (
                <NotifRow key={n.id} n={n} onRead={onMarkRead} onClose={() => setOpen(false)} />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="border-t px-5 py-3 bg-muted/30">
          <p className="text-[11px] text-muted-foreground text-center">
            Notifications are refreshed automatically
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// useState import needed
import { useState } from "react";
