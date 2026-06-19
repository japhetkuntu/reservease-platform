// Component Showcase & Patterns for ReservEase Tenant Portal
// Reference this file when building new components

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────
// CARDS
// ─────────────────────────────────────────────────────────────

// Base Card - Static
export function BaseCardExample() {
  return (
    <div className="card-base p-6 space-y-4">
      <h3 className="text-lg font-600 text-foreground">Card Title</h3>
      <p className="text-sm text-muted-foreground">Card description goes here</p>
    </div>
  );
}

// Interactive Card - Hover Effect
export function InteractiveCardExample() {
  return (
    <div className="card-hover p-6 space-y-4 cursor-pointer">
      <h3 className="text-lg font-600 text-foreground">Clickable Card</h3>
      <p className="text-sm text-muted-foreground">Hover to see the effect</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BUTTONS
// ─────────────────────────────────────────────────────────────

// Primary CTA
export function ButtonPrimaryExample() {
  return (
    <Button className="w-full h-11">
      Primary Action
    </Button>
  );
}

// Secondary Ghost Button
export function ButtonGhostExample() {
  return (
    <Button variant="ghost" className="text-primary">
      Secondary Action
    </Button>
  );
}

// Outlined Button
export function ButtonOutlineExample() {
  return (
    <Button variant="outline">
      Outlined Action
    </Button>
  );
}

// Icon Button
export function ButtonIconExample() {
  return (
    <Button size="sm" variant="ghost">
      📝
    </Button>
  );
}

// ─────────────────────────────────────────────────────────────
// FORMS
// ─────────────────────────────────────────────────────────────

// Simple Input
export function InputExample() {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-500 text-foreground">Email</Label>
      <Input
        type="email"
        placeholder="you@example.com"
        className="h-11 border border-input rounded-lg focus-visible:ring-1 focus-visible:ring-primary/50"
      />
    </div>
  );
}

// Input with Icon
export function InputWithIconExample() {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-500 text-foreground">Location</Label>
      <div className="relative group">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
          📍
        </span>
        <Input
          type="text"
          placeholder="Enter location..."
          className="pl-9 h-11 border border-input rounded-lg focus-visible:ring-1 focus-visible:ring-primary/50"
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────────────────────────

export function TypographyExample() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-700 text-foreground">Heading 1 - Hero Title</h1>
      <h2 className="text-2xl font-700 text-foreground">Heading 2 - Section Title</h2>
      <h3 className="text-xl font-600 text-foreground">Heading 3 - Subsection</h3>
      <p className="text-base text-foreground leading-relaxed">
        Body text - Regular paragraph with standard weight. This is what users read.
      </p>
      <p className="text-sm text-muted-foreground">
        Small text - Used for captions, labels, and secondary information.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BADGES & STATUS
// ─────────────────────────────────────────────────────────────

export function BadgeExample() {
  return (
    <div className="space-y-3 flex flex-col items-start">
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-600">
        ✨ Active
      </span>
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-600">
        ✓ Verified
      </span>
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 text-warning text-xs font-600">
        ⏳ Pending
      </span>
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-xs font-600">
        ✕ Failed
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// LAYOUTS & GRIDS
// ─────────────────────────────────────────────────────────────

// Responsive Grid
export function ResponsiveGridExample() {
  return (
    <div className="grid-responsive">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="card-base p-6 text-center">
          <div className="text-2xl font-700 text-primary mb-2">{i}</div>
          <p className="text-sm text-muted-foreground">Item {i}</p>
        </div>
      ))}
    </div>
  );
}

// Flex Layout (Centered Content)
export function FlexLayoutExample() {
  return (
    <div className="flex-center flex-col gap-4 p-8 rounded-lg bg-muted/50">
      <div className="text-4xl">📦</div>
      <h2 className="text-xl font-600">Centered Content</h2>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        Use flex-center for vertically & horizontally centered layouts
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ANIMATIONS & TRANSITIONS
// ─────────────────────────────────────────────────────────────

export function AnimationExample() {
  return (
    <div className="space-y-4">
      {/* Hover Lift */}
      <div className="bg-card border border-border p-4 rounded-lg transition-all duration-200 hover:border-primary/40 cursor-pointer">
        <p>Hover for lift effect</p>
      </div>

      {/* Active Press */}
      <button className="w-full bg-primary text-primary-foreground p-4 rounded-lg font-600 transition-all duration-150 active:scale-95">
        Click for press feedback
      </button>

      {/* Color Transition */}
      <div className="bg-muted text-muted-foreground p-4 rounded-lg transition-colors duration-200 hover:bg-primary/10 hover:text-primary cursor-pointer">
        Hover for color change
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// RESPONSIVE UTILITIES
// ─────────────────────────────────────────────────────────────

export function ResponsiveExample() {
  return (
    <div className="space-y-4">
      {/* Mobile-first: hidden on mobile, visible on md+ */}
      <div className="hidden md:block p-4 bg-card rounded-lg border border-border">
        This is only visible on medium screens and above
      </div>

      {/* Responsive text size */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-700">
        Responsive Heading
      </h1>

      {/* Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-base p-4">{i}</div>
        ))}
      </div>

      {/* Responsive padding */}
      <div className="p-4 md:p-6 lg:p-8 bg-muted rounded-lg">
        Padding increases on larger screens
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMMON PATTERNS
// ─────────────────────────────────────────────────────────────

// Hero Section Pattern
export function HeroSectionPattern() {
  return (
    <section className="py-12 md:py-20 section-padding">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-600 mb-6">
          ✨ New Feature
        </div>
        <h1 className="text-3xl md:text-5xl font-700 text-foreground mb-4">
          Main Headline Here
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Supporting subheadline with description and value proposition
        </p>
        <Button className="h-12">
          Get Started
        </Button>
      </div>
    </section>
  );
}

// Empty State Pattern
export function EmptyStatePattern() {
  return (
    <div className="flex-center flex-col gap-4 py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-muted flex-center text-3xl">
        📭
      </div>
      <h2 className="text-xl font-600 text-foreground">No items found</h2>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        Try adjusting your filters or create a new item to get started
      </p>
      <Button className="mt-4">Create New Item</Button>
    </div>
  );
}

// Loading Skeleton Pattern
export function LoadingSkeletonPattern() {
  return (
    <div className="card-base p-6 space-y-4">
      <div className="h-6 bg-muted rounded animate-pulse" />
      <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
      <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
      <div className="h-10 bg-muted rounded animate-pulse mt-6" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MOBILE PATTERNS
// ─────────────────────────────────────────────────────────────

// Mobile-friendly dialog/modal
export function MobileDialogPattern() {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center">
      <div className="bg-card w-full md:max-w-md rounded-t-2xl md:rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-600 text-foreground mb-4">Dialog Title</h2>
        <p className="text-sm text-muted-foreground mb-6">Dialog content goes here</p>
        <div className="space-y-2">
          <Button className="w-full">Primary Action</Button>
          <Button variant="outline" className="w-full">Cancel</Button>
        </div>
      </div>
    </div>
  );
}

// Touch-friendly list item
export function TouchFriendlyListItem() {
  return (
    <button className="w-full h-14 flex items-center justify-between px-4 hover:bg-muted transition-colors rounded-lg border border-border">
      <span className="text-base font-500 text-foreground">List Item</span>
      <span className="text-lg">›</span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// SPACING REFERENCE
// ─────────────────────────────────────────────────────────────

export function SpacingReferenceExample() {
  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <h3 className="text-sm font-600 text-muted-foreground">XS Spacing (4px)</h3>
        <div className="flex gap-1">
          <div className="h-6 w-6 bg-primary/20 rounded" />
          <div className="h-6 w-6 bg-primary/20 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-600 text-muted-foreground">SM Spacing (8px)</h3>
        <div className="flex gap-2">
          <div className="h-6 w-6 bg-primary/20 rounded" />
          <div className="h-6 w-6 bg-primary/20 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-600 text-muted-foreground">MD Spacing (16px)</h3>
        <div className="flex gap-4">
          <div className="h-6 w-6 bg-primary/20 rounded" />
          <div className="h-6 w-6 bg-primary/20 rounded" />
        </div>
      </div>
    </div>
  );
}

export default {
  BaseCardExample,
  InteractiveCardExample,
  ButtonPrimaryExample,
  InputExample,
  TypographyExample,
  BadgeExample,
  ResponsiveGridExample,
  HeroSectionPattern,
  EmptyStatePattern,
  LoadingSkeletonPattern,
  MobileDialogPattern,
  TouchFriendlyListItem,
};
