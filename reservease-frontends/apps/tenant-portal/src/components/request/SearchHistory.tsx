import { motion } from "framer-motion";
import { RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { SearchAttempt } from "@/contexts/RequestContext";

interface SearchHistoryProps {
  history: SearchAttempt[];
}

export function SearchHistory({ history }: SearchHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!history || history.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-muted-foreground" />
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">
                  Search History
                </p>
                <p className="text-xs text-muted-foreground">
                  {history.length} attempt{history.length !== 1 ? 's' : ''} made
                </p>
              </div>
            </div>
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-3">
          {history.map((attempt, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl bg-card border border-border"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                    {attempt.attemptNumber}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {attempt.attemptNumber === 1 ? 'Initial Search' : `Refinement ${attempt.attemptNumber - 1}`}
                  </span>
                </div>
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  attempt.matchesFound > 0
                    ? "bg-success/10 text-success"
                    : "bg-muted text-muted-foreground"
                )}>
                  {attempt.matchesFound > 0 ? `${attempt.matchesFound} found` : 'No matches'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-muted-foreground">
                  Budget: <span className="text-foreground">GHS {attempt.parameters.budget.min}-{attempt.parameters.budget.max}</span>
                </div>
                <div className="text-muted-foreground">
                  Location: <span className="text-foreground">{attempt.parameters.location?.join(', ')}</span>
                </div>
                <div className="text-muted-foreground">
                  Room: <span className="text-foreground capitalize">{attempt.parameters.roomType?.map(r => r.replace(/-/g, ' ')).join(', ')}</span>
                </div>
                <div className="text-muted-foreground">
                  Move in: <span className="text-foreground capitalize">{attempt.parameters.moveInUrgency?.map(r => r.replace(/-/g, ' ')).join(', ')}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(attempt.timestamp).toLocaleString()}
              </p>
            </motion.div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
}
