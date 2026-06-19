import { Bell, BellRing, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/api/notifications";
import { formatDistanceToNow } from "date-fns";
import { PageLoader } from "@/components/ui/PageLoader";
import { cn } from "@/lib/utils";

export default function Notifications() {
  const { isLoggedIn } = useAuth();
  const queryClient = useQueryClient();

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsApi.list(1, 50),
    enabled: isLoggedIn,
  });

  const notifications = notificationsData?.data || [];

  const markAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
  });

  const handleMarkAsRead = (id: string, read: boolean) => {
    if (!read) markAsReadMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <Layout>
        <PageLoader message="Loading notifications..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] pb-24">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container h-14 flex items-center justify-between max-w-2xl mx-auto px-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              Dashboard
            </Link>
            <h1 className="font-semibold text-sm">Notifications</h1>
            <div className="w-20" />
          </div>
        </header>

        <main className="container py-8 max-w-2xl mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-1">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              Updates on your accommodation search and account activity.
            </p>
          </div>

          {isLoggedIn ? (
            <div className="space-y-2">
              {notifications.length === 0 ? (
                <div className="bg-card border border-dashed border-border rounded-xl p-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <BellRing className="h-5 w-5 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1">No notifications yet</h3>
                  <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto">
                    Once you start a search or get matched, updates will appear here.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/search">Start a Search</Link>
                  </Button>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      "p-4 rounded-xl border transition-colors cursor-pointer",
                      notif.isRead
                        ? "bg-card border-border/50 hover:bg-muted/30"
                        : "bg-primary/[0.03] border-primary/20 hover:bg-primary/[0.05]"
                    )}
                    onClick={() => handleMarkAsRead(notif.id, notif.isRead)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                        notif.isRead ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                      )}>
                        <BellRing className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-0.5">
                          <h4 className={cn(
                            "font-semibold text-sm",
                            notif.isRead ? "text-foreground/70" : "text-foreground"
                          )}>
                            {notif.title}
                          </h4>
                          {!notif.isRead && (
                            <div className="h-2 w-2 rounded-full bg-primary mt-1 shrink-0" />
                          )}
                        </div>
                        <p className={cn(
                          "text-xs leading-relaxed line-clamp-2 mb-2",
                          notif.isRead ? "text-muted-foreground/60" : "text-muted-foreground"
                        )}>
                          {notif.message}
                        </p>
                        <span className="text-xs text-muted-foreground/50">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1">Sign in to see notifications</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                Create an account or sign in to receive updates on your accommodation search.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link to="/signup">Create Account</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}
