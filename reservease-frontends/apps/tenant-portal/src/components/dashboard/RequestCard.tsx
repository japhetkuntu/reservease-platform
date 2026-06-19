import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Wallet, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

export type RequestStatus = "submitted" | "in-review" | "options-sent" | "closed" | "cancelled";

export interface Request {
  id: string;
  createdAt: string;
  status: RequestStatus;
  budget: string;
  location: string;
  roomType: string;
  tier: "standard" | "concierge";
}

export const statusLabels: Record<RequestStatus, string> = {
  submitted: "Submitted",
  "in-review": "In Review",
  "options-sent": "Options Sent",
  closed: "Closed",
  cancelled: "Cancelled",
};

interface RequestCardProps {
  request: Request;
  index?: number;
}

export function RequestCard({ request, index = 0 }: RequestCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/request/${request.id}`}
        className="block bg-card border border-border rounded-2xl p-4 transition-shadow"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-semibold text-foreground">
                {request.id}
              </span>
              {request.tier === "concierge" && (
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-warning/10 text-warning">
                  Premium
                </span>
              )}
            </div>
            <StatusBadge status={request.status}>
              {statusLabels[request.status]}
            </StatusBadge>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{request.createdAt}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{request.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet className="h-4 w-4" />
            <span>{request.budget}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
