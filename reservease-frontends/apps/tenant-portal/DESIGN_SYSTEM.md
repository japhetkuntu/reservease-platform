# ReservEase Tenant Portal - Modern Design System

## Overview

The tenant portal has been completely revamped with a sleek, professional, and highly responsive design system. The UI is built to feel natural and premium—not AI-generated—with careful attention to:

- **Typography**: Uses Geist font family for modern, clean appearance
- **Colors**: Modern teal (#0B7285) as primary, with coral accent
- **Spacing**: Consistent, breathing-friendly spacing
- **Interactions**: Smooth, meaningful animations
- **Mobile-First**: Excellent UX on all screen sizes
- **Accessibility**: WCAG-compliant, diverse user support

---

## Design Tokens

### Color System

**Light Mode:**
- **Primary**: Modern Teal `#0B7285` (HSL: 186 87% 28%)
- **Accent**: Vibrant Coral `#FF5722` (HSL: 17 88% 56%)
- **Background**: Off-White `#FAFBFC` (99.5% white)
- **Foreground**: Deep Charcoal `#1A2332` (Dark text)
- **Muted**: Subtle Gray `#E8EAED` (Backgrounds)
- **Border**: Light Gray `#D6D9E0`

**Dark Mode:**
- **Primary**: Bright Teal `#1FB5DB` (45% lightness)
- **Background**: Deep Gray `#0F1419` (Dark surfaces)
- **Foreground**: Off-White `#F2F2F2`
- Better contrast and readability

### Typography

```css
Font Family: 'Geist', system-ui, -apple-system, BlinkMacSystemFont
```

- **H1**: 2.5rem, weight 700, letter-spacing -0.032em
- **H2**: 2rem, weight 700
- **H3**: 1.5rem, weight 600
- **Body**: 1rem, weight 400, line-height 1.6
- **Small**: 0.875rem, weight 500
- **Tiny**: 0.75rem, weight 600

### Spacing Scale

```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
```

### Shadows (Premium Depth)

- **xs**: Subtle hover states
- **sm**: Cards, dropdowns
- **md**: Elevated containers
- **lg**: Modal backgrounds
- **xl**: Large overlays
- **primary**: Highlights primary elements

### Border Radius

- Default: `0.75rem` (12px)
- Suits all components - not too sharp, not too rounded

---

## Component Guidelines

### Buttons

**Primary CTA:**
```tsx
<Button>Get Started</Button>
```
- Teal background with white text
- Rounded corners (12px)
- Active state: scale-95 (press feedback)
- Hover: slightly darker background

**Secondary:**
```tsx
<Button variant="ghost">Learn More</Button>
```
- Transparent background, colored text
- Hover: subtle background tint

### Forms

**Input Fields:**
- Clean borders, no shadows
- Focus: ring (1px) + border color change
- Placeholder: muted-foreground
- Icons: left-aligned with proper spacing

**Labels:**
- Small font size (0.875rem)
- Bold weight (600)
- Light color (muted-foreground)

### Cards

**Base Card:**
```tsx
<div className="card-base">
  {/* Content */}
</div>
```
- White background (light mode)
- Subtle border
- Small shadow (sm)
- Rounded 12px

**Interactive Card:**
```tsx
<div className="card-hover">
  {/* Content */}
</div>
```
- Hover: enhanced shadow + border opacity increase
- Smooth 200ms transition

### Navigation

**Navbar:**
- Sticky header with backdrop blur
- Minimal logo (icon + text hidden on mobile)
- Responsive menu (hamburger on mobile)
- User dropdown menu (clean, organized)

**Bottom Navigation (Mobile):**
- Fixed position with safe area inset
- 5 main nav items
- Active indicator w/ background highlight
- Lock icon for auth-required routes

---

## Responsive Design

### Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md/lg)
- **Desktop**: > 1024px (xl+)

### Mobile-First Approach

1. **Start with mobile layout**
2. **Add complexity at larger breakpoints**
3. **Touch-friendly targets** (min 44px height)
4. **Readable font sizes** (min 16px on mobile)

### Key Mobile Optimizations

- Full-width forms with proper padding
- Touch-friendly button sizes (44px minimum)
- Bottom navigation for primary actions
- Collapsible menu on mobile
- Readable heading hierarchy
- Safe area insets for notches/home indicators

---

## Animations & Interactions

### Principles

- **Subtle**: Not overdone or flashy
- **Purposeful**: Every animation has a reason
- **Fast**: 150-300ms for most interactions
- **Smooth**: Ease-out for entrance, ease-in for exit

### Common Animations

**Fade + Slide:**
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4, ease: "easeOut" }}
```

**Hover Lift:**
```tsx
whileHover={{ y: -4 }}
transition={{ type: "spring", bounce: 0.2 }}
```

**Active Press:**
```tsx
active:scale-95
transition-all duration-200
```

---

## Key Files Updated

### Core Styling

- **`src/index.css`**: Design tokens, typography, utilities
- **`src/App.css`**: Root container, scrollbar, global resets
- **`tailwind.config.ts`**: Font family configuration

### Layout Components

- **`src/components/layout/Navbar.tsx`**: Modern minimal navigation
- **`src/components/layout/Footer.tsx`**: Clean footer structure
- **`src/components/layout/BottomNavigation.tsx`**: Mobile-optimized bottom nav

### Pages

- **`src/pages/Login.tsx`**: Clean, focused login with better UX
- **Other pages**: Maintain consistent styling through utility classes

---

## Usage Examples

### Creating a New Component

```tsx
// Use design system utilities
<div className="card-hover p-6 space-y-4">
  <h3 className="text-lg font-600 text-foreground">Title</h3>
  <p className="text-base text-muted-foreground">Description</p>
  <Button className="w-full">Action</Button>
</div>
```

### Responsive Grid

```tsx
<div className="grid-responsive">
  {/* 1 column mobile, 2 tablet, 3 desktop */}
</div>
```

### Safe Area (Mobile Bottom Nav)

```tsx
<div className="safe-area-bottom">
  {/* Content respects notch/home indicator */}
</div>
```

---

## Testing Checklist

- [ ] Mobile (375px - 480px): iOS & Android feel natural
- [ ] Tablet (768px) - 1024px): Proper scaling
- [ ] Desktop (1440px+): Comfortable spacing
- [ ] Dark mode: All colors readable
- [ ] Animations: Smooth at 60fps
- [ ] Touch targets: All 44px or larger
- [ ] Form labels: Always visible
- [ ] Colors: WCAG AA compliant
- [ ] Keyboard navigation: Full support
- [ ] Load time: Fast and responsive

---

## Future Enhancements

1. Add theme switcher (light/dark mode toggle)
2. Implement haptic feedback for mobile
3. Add loading skeletons for better perception
4. Optimize animations for reduced-motion preference
5. Add micro-interactions for form validation
6. Implement gesture support on mobile
7. Add accessibility announcements

---

## Color Palette Preview

```
Primary:        ████████ #0B7285 (Teal)
Accent:         ████████ #FF5722 (Coral)
Success:        ████████ #2E9B5B (Green)
Warning:        ████████ #F5A623 (Amber)
Destructive:    ████████ #D94545 (Red)
```

## Font Weights

- 300: Light (rare)
- 400: Regular (body text)
- 500: Medium (labels)
- 600: Semibold (headings, emphasis)
- 700: Bold (large headings)
- 800: Extrabold (hero text)

---

Generated: March 12, 2026
Designed for: Diverse users, any device, any experience level
