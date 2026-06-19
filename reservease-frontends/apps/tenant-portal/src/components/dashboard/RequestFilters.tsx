import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { RequestStatus } from "./RequestCard";

export type FilterValue = RequestStatus | "all";

interface FilterOption {
  value: FilterValue;
  label: string;
}

const filterOptions: FilterOption[] = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Submitted" },
  { value: "in-review", label: "In Review" },
  { value: "options-sent", label: "Options Sent" },
  { value: "closed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

interface RequestFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: FilterValue;
  onStatusChange: (value: FilterValue) => void;
}

export function RequestFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: RequestFiltersProps) {
  return (
    <div className="space-y-4 mb-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by ID or location..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
        <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              statusFilter === option.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
