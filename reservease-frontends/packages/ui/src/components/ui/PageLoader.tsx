import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = "Loading..." }: PageLoaderProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="flex flex-col items-center space-y-6 max-w-sm w-full"
      >
        <div className="relative flex items-center justify-center">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
          
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center relative backdrop-blur-sm border border-primary/20 shadow-inner">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        </div>

        <div className="space-y-2 text-center w-full">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            {message}
          </h3>
          <p className="text-sm text-muted-foreground animate-pulse">
            Please wait a moment...
          </p>
        </div>
        
        {/* Progress simulator pill */}
        <div className="w-48 h-1.5 bg-muted overflow-hidden rounded-full mt-2">
          <motion.div 
            className="h-full bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
