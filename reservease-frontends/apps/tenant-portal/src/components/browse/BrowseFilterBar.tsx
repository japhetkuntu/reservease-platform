import { useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BrowseParams } from "@/api/types";

const CATEGORIES = [
  { value: "hostel", label: "Hostel" },
  { value: "apartment", label: "Apartment" },
  { value: "hotel-room", label: "Hotel Room" },
  { value: "self-contain", label: "Self-Contain" },
  { value: "guest-house", label: "Guest House" },
  { value: "homestay", label: "Homestay" },
];

const ROOM_TYPES = [
  { value: "single", label: "Single" },
  { value: "double", label: "Double" },
  { value: "bed-space", label: "Bed Space" },
  { value: "self-contained", label: "Self-Contained" },
  { value: "chamber-hall", label: "Chamber & Hall" },
  { value: "1br", label: "1 Bedroom" },
  { value: "2br", label: "2 Bedroom" },
  { value: "3br", label: "3 Bedroom" },
];

interface BrowseFilterBarProps {
  filters: BrowseParams;
  onChange: (next: BrowseParams) => void;
}

export function BrowseFilterBar({ filters, onChange }: BrowseFilterBarProps) {
  const [locationInput, setLocationInput] = useState(filters.location ?? "");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange({ ...filters, location: locationInput.trim() || undefined, page: 1 });
  };

  const set = (key: keyof BrowseParams, value: string | number | undefined) =>
    onChange({ ...filters, [key]: value || undefined, page: 1 });

  const clearAll = () => {
    setLocationInput("");
    onChange({});
  };

  const activeCount = [
    filters.location, filters.category, filters.roomType,
    filters.minPrice, filters.maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* Location search row */}
      <form onSubmit={handleLocationSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="Search by location (Accra, Kumasi, Tarkwa…)"
            className="pl-9 h-11"
            aria-label="Filter by location"
          />
          {locationInput && (
            <button
              type="button"
              onClick={() => { setLocationInput(""); onChange({ ...filters, location: undefined, page: 1 }); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear location"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" className="h-11 px-5">Search</Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-11 w-11 shrink-0"
          onClick={() => setShowAdvanced((v) => !v)}
          aria-expanded={showAdvanced}
          aria-label="Toggle advanced filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
      </form>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="flex flex-wrap gap-3 p-4 rounded-xl border border-border bg-muted/30">
          <Select
            value={filters.category ?? ""}
            onValueChange={(v) => set("category", v === "all" ? undefined : v)}
          >
            <SelectTrigger className="h-9 w-[160px]">
              <SelectValue placeholder="Property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.roomType ?? ""}
            onValueChange={(v) => set("roomType", v === "all" ? undefined : v)}
          >
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue placeholder="Room type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All rooms</SelectItem>
              {ROOM_TYPES.map((r) => (
                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min GHS"
              value={filters.minPrice ?? ""}
              onChange={(e) => set("minPrice", e.target.value ? Number(e.target.value) : undefined)}
              className="h-9 w-[100px]"
              min={0}
            />
            <span className="text-muted-foreground text-sm">–</span>
            <Input
              type="number"
              placeholder="Max GHS"
              value={filters.maxPrice ?? ""}
              onChange={(e) => set("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
              className="h-9 w-[100px]"
              min={0}
            />
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {filters.location && (
            <Badge variant="secondary" className="gap-1 text-xs">
              📍 {filters.location}
              <button onClick={() => onChange({ ...filters, location: undefined })} aria-label="Remove location filter">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {CATEGORIES.find((c) => c.value === filters.category)?.label ?? filters.category}
              <button onClick={() => onChange({ ...filters, category: undefined })} aria-label="Remove category filter">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.roomType && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {ROOM_TYPES.find((r) => r.value === filters.roomType)?.label ?? filters.roomType}
              <button onClick={() => onChange({ ...filters, roomType: undefined })} aria-label="Remove room type filter">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {(filters.minPrice || filters.maxPrice) && (
            <Badge variant="secondary" className="gap-1 text-xs">
              GHS {filters.minPrice ?? 0} – {filters.maxPrice ?? "∞"}
              <button onClick={() => onChange({ ...filters, minPrice: undefined, maxPrice: undefined })} aria-label="Remove price filter">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <button
            onClick={clearAll}
            className="text-xs text-primary hover:underline underline-offset-4 ml-1"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
