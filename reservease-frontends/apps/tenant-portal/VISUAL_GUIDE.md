# 🎨 Visual Design Guide - ReservEase Tenant Portal

## Color Palette Reference

### Primary Colors

```
TEAL - Primary Brand Color
HEX:  #0B7285
RGB:  11, 114, 133
HSL:  186° 87% 28%
```
**Used for:** CTAs, active states, primary links, focus indicators

```
CORAL - Accent Color  
HEX:  #FF5722
RGB:  255, 87, 34
HSL:  17° 88% 56%
```
**Used for:** Secondary CTAs, highlights, notifications

### Semantic Colors

```
SUCCESS - Green
HEX:  #2E9B5B
Used: Confirmations, completed states
      ✓ Success messages
      ✓ Verified badges

WARNING - Amber
HEX:  #F5A623
Used: Warnings, pending states
      ⏳ Processing states
      ⚠️  Attention needed

DESTRUCTIVE - Red
HEX:  #D94545
Used: Errors, deletions, dangers
      ✗ Errors
      🗑️  Delete actions

INFO - Blue
HEX:  #0099FF
Used: Informational messages
      ℹ️  Info tooltips
```

### Neutral Colors (Light Mode)

```
OFF-WHITE Background
HEX:  #FAFBFC
Used: Main background, clean slate

WHITE
HEX:  #FFFFFF
Used: Card backgrounds, content areas

LIGHT GRAY - Muted
HEX:  #E8EAED
Used: Disabled states, subtle backgrounds

MEDIUM GRAY - Border
HEX:  #D6D9E0
Used: Borders, dividers, separators

DARK GRAY - Muted Text
HEX:  #6B7280
Used: Secondary text, captions, hints

CHARCOAL - Foreground
HEX:  #1A2332
Used: Primary text, headings
```

### Dark Mode Colors

```
VERY DARK - Background
HEX:  #0F1419
Used: Main dark background

BRIGHT TEAL - Primary
HEX:  #1FB5DB
Used: CTAs in dark mode (higher contrast)

BRIGHTER CORAL - Accent
HEX:  #FF6B4A
Used: Accents in dark mode

OFF-WHITE - Text
HEX:  #F2F2F2
Used: Primary text in dark mode
```

---

## Typography Hierarchy

```
╔════════════════════════════════════════════════════════════════╗
║                    DISPLAY / HERO (H1)                         ║
║   Size: 2.5rem - 3.5rem  |  Weight: 700-800                   ║
║   Usage: Main page title, hero section, call-to-action         ║
║                                                                 ║
║        Finding your next place should feel like magic           ║
╚════════════════════════════════════════════════════════════════╝

┌────────────────────────────────────────────────────────────────┐
│ HEADING 1 (H1)                                                 │
│ Size: 2rem  |  Weight: 700  |  Line height: 1.2                │
│ Usage: Section titles, major headings                          │
│                                                                 │
│ Start Your Journey With Us Today                               │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ HEADING 2 (H2)                                                 │
│ Size: 1.5rem  |  Weight: 600  |  Line height: 1.2              │
│ Usage: Subsection titles, card headers                         │
│                                                                 │
│ How It Works                                                   │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ HEADING 3 (H3)                                                 │
│ Size: 1.25rem  |  Weight: 600  |  Line height: 1.2             │
│ Usage: Card titles, smaller headers, module titles             │
│                                                                 │
│ Search & Match                                                 │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ BODY TEXT                                                      │
│ Size: 1rem  |  Weight: 400  |  Line height: 1.6                │
│ Usage: Paragraphs, content, descriptions                       │
│                                                                 │
│ ReservEase helps you find the perfect accommodation by          │
│ matching your needs with verified listings in your area.        │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ SMALL TEXT                                                     │
│ Size: 0.875rem  |  Weight: 400-500  |  Line height: 1.5        │
│ Usage: Labels, captions, secondary descriptions                │
│                                                                 │
│ Updated 2 hours ago • 1,234 people viewing                     │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ TINY TEXT / BADGE                                              │
│ Size: 0.75rem  |  Weight: 500-600  |  Uppercase                │
│ Usage: Badges, tags, very small labels                         │
│                                                                 │
│ ✨ NEW FEATURE  •  ✓ VERIFIED  •  ⏳ PENDING                    │
└────────────────────────────────────────────────────────────────┘
```

---

## Component States

### Button States

```
┌──────────────────────────────────────────────────────────────┐
│ PRIMARY CTA BUTTON                                           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ DEFAULT          HOVER              ACTIVE    DISABLED      │
│ ┌──────────┐   ┌──────────┐      ┌──────────┐ ┌────────┐   │
│ │ Get Sta  │   │ Get Star │      │Get Start │ │Get Star│   │
│ │   ted    │   │   ted    │      │   ed     │ │  ted   │   │
│ └──────────┘   └──────────┘      └──────────┘ └────────┘   │
│ Teal bg      Shadow +color      Scale-95    Gray, no       │
│ White text   hover              White text   pointer        │
│              0.2s trans         0.15s trans                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ SECONDARY / GHOST BUTTON                                     │
├──────────────────────────────────────────────────────────────┤
│ Learn More      Learn More      Learn More    Learn More     │
│ Transparent     +bg tint        Slightly      Muted text     │
│ Teal text       Teal text       darker        Disabled       │
│                 0.2s trans      0.15s trans                  │
└──────────────────────────────────────────────────────────────┘
```

### Form Input States

```
┌────────────────────────────────────────────────────────────────┐
│ INPUT FIELD                                                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│ DEFAULT               FOCUS                FILLED             │
│ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ │ you@example.com  │ │ you@example.com  │ │ user@example.com │
│ └──────────────────┘ └──────────────────┘ └──────────────────┘
│ Soft border       Teal border           User's input shown   │
│ Gray text         Focus ring             Input state filled  │
│ Light gray bg     Light blue bg         Normal border        │
│                                                                │
│ ERROR                 SUCCESS                                  │
│ ┌──────────────────┐ ┌──────────────────┐                     │
│ │ invalid@test@    │ │ user@example.com │                     │
│ └──────────────────┘ └──────────────────┘                     │
│ Red border        Green checkmark visible                     │
│ Red text below    Success message shown                       │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Card States

```
┌─────────────────────────────────────────────────────────────┐
│                      CARD COMPONENT                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ STATIC               HOVER              ACTIVE              │
│                                                             │
│ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│ │             │  │             │  │             │         │
│ │   Card      │  │   Card      │  │   Card      │         │
│ │  Content    │  │  Content    │  │  Content    │         │
│ │             │  │             │  │             │         │
│ └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│ Light shadow   Darker shadow   Subtle press               │
│ Soft border    Enhanced depth  Scale: 98%                │
│ Static         Smooth 0.2s     0.15s transition          │
│              transition       Slight color shift         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Spacing Scale

```
4px   - xs  [████]                Very close items
8px   - sm  [████████]            Tight spacing
16px  - md  [████████████████]    Standard spacing
24px  - lg  [████████████████████████]           Comfortable spacing
32px  - xl  [████████████████████████████████]   Large gaps
48px  - 2xl [████████████████████████████████████████████████]  Extra large
```

### Real World Examples

```
Gap between inline items:     gap-2 (8px)
Gap between elements:         gap-4 (16px)
Card padding:                 p-6 (24px)
Section padding:              py-12 md:py-16 (48px/64px)
Container margin:             mx-auto (centered)
Label to input:               space-y-2 (8px)
Form section spacing:         space-y-5 (20px)
```

---

## Shadows & Depth

```
SHADOW XS (hover states)
┌─────────────────────────┐
│  Very subtle shadow     │
│  For small interactions │
└─────────────────────────┘  0px 1px 2px rgba(0,0,0,0.04)


SHADOW SM (cards, small elevation)
┌─────────────────────────┐
│   Subtle shadow         │
│   Cards, dropdowns      │
└─────────────────────────┘  0px 1px 3px rgba(0,0,0,0.05)


SHADOW MD (normal elevation)
┌─────────────────────────┐
│    Card shadow          │
│    Normal elements      │
└─────────────────────────┘  0px 4px 6px rgba(0,0,0,0.06)


SHADOW LG (elevated containers)
┌─────────────────────────┐
│   Strong elevation      │
│   Modals, overlays      │
└─────────────────────────┘  0px 10px 15px rgba(0,0,0,0.08)


SHADOW XL (major modals)
┌─────────────────────────┐
│   Major elevation       │
│   Large modals, overlays│
└─────────────────────────┘  0px 20px 25px rgba(0,0,0,0.10)
```

---

## Border Radius

```
STANDARD RADIUS: 12px (0.75rem)

Fully Rounded (Pills)
┌─────────────────────┐
│  rounded-full       │
│  For badges, pills  │
└─────────────────────┘

Rounded (Buttons, Cards)
┌──────────────────────┐
│  rounded-lg (12px)   │
│  Main components     │
└──────────────────────┘

Slightly rounded (Subtle)
┌──────────────────────┐
│  rounded-md (8px)    │
│  Softer look         │
└──────────────────────┘

More rounded (Cards)
┌────────────────────────┐
│  rounded-xl (16px)     │
│  Large containers      │
└────────────────────────┘
```

---

## Animation Timings

```
TIMING STANDARDS

Fast Interactions        150ms  (quick feedback)
├─ Button press
├─ Menu toggle
└─ Input focus

Standard Transitions    200ms  (smooth, natural)
├─ Hover effects
├─ Color changes
├─ Border animations
└─ Shadow increases

Page Transitions        300ms  (noticeable but quick)
├─ Fade in/out
├─ Slide animations
└─ Stagger delays

Long Animations         500ms+ (should be rare)
├─ Large reveals
├─ Complex transitions
└─ Entrance effects
```

---

## Responsive Breakpoints Visualized

```
┌────────────────────────────────────────────────────────────────────┐
│ MOBILE (375px - 639px)                                             │
│                                                                    │
│ ┌──────┐    Single column                                          │
│ │ Nav  │    Full-width content                                     │
│ ├──────┤    Stacked layout                                         │
│ │ Main │    Bottom navigation                                      │
│ │      │    Touch-friendly buttons                                 │
│ │      │                                                           │
│ └──────┘                                                           │
│ ┌──────┐                                                           │
│ │ Bot  │                                                           │
│ └──────┘                                                           │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│ TABLET (640px - 1023px)                                            │
│                                                                    │
│ ┌──────────────────────────────┐                                   │
│ │ Navigation Bar               │  2 columns                        │
│ ├──────────────────────────────┤  Larger spacing                   │
│ │ Main Content                 │  Readable text                    │
│ │                              │  Desktop nav                      │
│ │                              │                                   │
│ │ ┌────────┐  ┌────────┐      │                                   │
│ │ │ Card 1 │  │ Card 2 │      │                                   │
│ │ └────────┘  └────────┘      │                                   │
│ └──────────────────────────────┘                                   │
│                                                                    │
│ ┌──────────────────────────────┐                                   │
│ │ Footer                       │                                   │
│ └──────────────────────────────┘                                   │
└────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ DESKTOP (1024px - 1439px)                                        │
│                                                                  │
│           ┌─────────────────────────────────────┐                │
│           │ Navigation Bar                      │                │
│           ├─────────────────────────────────────┤                │
│           │                                     │                │
│           │  3 Columns Layout                   │                │
│           │  ┌──────┐ ┌──────┐ ┌──────┐        │                │
│           │  │Card 1│ │Card 2│ │Card 3│        │                │
│           │  └──────┘ └──────┘ └──────┘        │                │
│           │                                     │                │
│           │  Comfortable spacing                │                │
│           │  Max-width containers               │                │
│           │                                     │                │
│           ├─────────────────────────────────────┤                │
│           │ Footer                              │                │
│           └─────────────────────────────────────┘                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ LARGE DESKTOP (1440px+)                                          │
│                                                                  │
│     ┌───────────────────────────────────────────┐                │
│     │ Navigation Bar (centered content)         │                │
│     ├───────────────────────────────────────────┤                │
│     │                                           │                │
│     │  Full-width with max-width constraint     │                │
│     │  Maximum breathing room around content    │                │
│     │                                           │                │
│     │  ┌───────┐  ┌───────┐  ┌───────┐        │                │
│     │  │ Card  │  │ Card  │  │ Card  │        │                │
│     │  └───────┘  └───────┘  └───────┘        │                │
│     │                                           │                │
│     ├───────────────────────────────────────────┤                │
│     │ Footer (organized columns)                │                │
│     └───────────────────────────────────────────┘                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Icons & Imagery

```
ICON SIZES

16px / sm     Labels, badges, small UI elements
18px / base   Form labels, secondary icons
20px / md     Navigation items, menus
24px / lg     Card headers, prominent elements
28px / xl     Feature icons, large displays
32px / 2xl    Hero sections, display elements
```

---

## Accessibility Colors (WCAG AA)

```
✓ meets WCAG AA (4.5:1 contrast ratio)
✓ meets WCAG AAA (7:1 contrast ratio)

Primary Teal (#0B7285) on White
  Contrast: 5.3:1 ✓ AA
  Contrast: 7.1:1 ✓ AAA

White on Primary Teal
  Contrast: 5.3:1 ✓ AA

Red Destructive (#D94545) on White
  Contrast: 4.7:1 ✓ AA

Dark Text (#1A2332) on Light Gray (#E8EAED)
  Contrast: 10.1:1 ✓ AAA
```

---

## Layout Patterns

```
CENTERED CONTENT
┌──────────────────────────────────────────┐
│                                          │
│           ┌──────────────────┐           │
│           │  Content Area    │           │
│           │  Max-width: 100% │           │
│           │  Or centered gap │           │
│           └──────────────────┘           │
│                                          │
└──────────────────────────────────────────┘

SPLIT LAYOUT
┌──────────────────┬──────────────────┐
│                  │                  │
│  Sidebar/Info    │  Main Content    │
│  (30-40%)        │  (60-70%)        │
│                  │                  │
└──────────────────┴──────────────────┘

STACKED SECTIONS
┌──────────────────────────────────────┐
│ Header Section                       │
├──────────────────────────────────────┤
│ Main Content Area                    │
├──────────────────────────────────────┤
│ Secondary Info                       │
├──────────────────────────────────────┤
│ Footer                               │
└──────────────────────────────────────┘
```

---

## Summary

This visual guide ensures consistency across all design applications. Use this as reference when:
- Creating new components
- Implementing designs
- Testing frontend changes
- Reviewing designs

**Key Principles:**
- Clean, modern aesthetic
- Consistent spacing & sizes
- Accessible color contrasts
- Responsive at all breakpoints
- Smooth, purposeful animations

---

Generated: March 12, 2026
