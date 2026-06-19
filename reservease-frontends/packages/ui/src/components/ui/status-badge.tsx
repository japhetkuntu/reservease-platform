import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      status: {
        submitted: "bg-info/10 text-info",
        "in-review": "bg-warning/10 text-warning",
        "options-sent": "bg-primary/10 text-primary",
        closed: "bg-success/10 text-success",
        cancelled: "bg-muted text-muted-foreground",
        pending: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  showDot?: boolean
}

const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, showDot = true, children, ...props }, ref) => {
    return (
      <span
        className={cn(statusBadgeVariants({ status, className }))}
        ref={ref}
        {...props}
      >
        {showDot && (
          <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-soft" />
        )}
        {children}
      </span>
    )
  }
)
StatusBadge.displayName = "StatusBadge"

export { StatusBadge, statusBadgeVariants }
