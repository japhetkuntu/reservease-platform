import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Share, MoreVertical, Check, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <Layout>
      <section className="py-20 md:py-28">
        <div className="container max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10">
              <Smartphone className="h-10 w-10 text-primary" />
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Install ReservEase
              </h1>
              <p className="text-muted-foreground text-lg">
                Add ReservEase to your home screen for instant access, offline support, and a native app experience.
              </p>
            </div>

            {isInstalled ? (
              <div className="flex items-center justify-center gap-3 text-success">
                <Check className="h-6 w-6" />
                <span className="text-lg font-medium">Already installed!</span>
              </div>
            ) : deferredPrompt ? (
              <Button size="lg" onClick={handleInstall} className="gap-2">
                <Download className="h-5 w-5" />
                Install App
              </Button>
            ) : isIOS ? (
              <div className="bg-muted/50 rounded-2xl p-6 text-left space-y-4">
                <h3 className="font-semibold text-foreground">To install on iPhone/iPad:</h3>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">1</span>
                    <span>Tap the <Share className="inline h-4 w-4 text-primary" /> Share button in Safari</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">2</span>
                    <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">3</span>
                    <span>Tap <strong>"Add"</strong> to confirm</span>
                  </li>
                </ol>
              </div>
            ) : (
              <div className="bg-muted/50 rounded-2xl p-6 text-left space-y-4">
                <h3 className="font-semibold text-foreground">To install on Android:</h3>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">1</span>
                    <span>Tap the <MoreVertical className="inline h-4 w-4 text-primary" /> menu in Chrome</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">2</span>
                    <span>Tap <strong>"Install app"</strong> or <strong>"Add to Home Screen"</strong></span>
                  </li>
                </ol>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { label: "Instant Access", desc: "One tap from home" },
                { label: "Works Offline", desc: "No connection needed" },
                { label: "Fast & Light", desc: "No app store needed" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
