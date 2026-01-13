# Numerology Compass - Design System Guide

## Overview

A modern, standardized, and efficient design system built on design tokens, CSS custom properties, and utility classes. The theme maintains the mystical/spiritual aesthetic while providing a cohesive, maintainable, and performant foundation.

## Design Tokens

### Colors

#### Primary (Mystical Gold)
- `--primary`: Main brand color (HSL: 45 85% 58%)
- `--primary-foreground`: Text on primary
- `--primary-hover`: Hover state
- `--primary-light`: Light variant
- `--primary-dark`: Dark variant

#### Secondary (Deep Purple)
- `--secondary`: Secondary brand color (HSL: 260 55% 35%)
- `--secondary-foreground`: Text on secondary
- `--secondary-hover`: Hover state
- `--secondary-light`: Light variant

#### Accent (Celestial Violet)
- `--accent`: Accent color (HSL: 280 50% 45%)
- `--accent-foreground`: Text on accent
- `--accent-hover`: Hover state

#### Semantic Colors
- `--success`: Success states (HSL: 142 71% 45%)
- `--warning`: Warning states (HSL: 38 92% 50%)
- `--error`: Error states (HSL: 0 84% 60%)
- `--info`: Info states (HSL: 199 89% 48%)

### Typography

- **Heading Font**: `Cinzel` (serif) - `var(--font-heading)`
- **Body Font**: `Raleway` (sans-serif) - `var(--font-body)`

### Spacing Scale

- `--space-xs`: 4px
- `--space-sm`: 8px
- `--space-md`: 16px
- `--space-lg`: 24px
- `--space-xl`: 32px
- `--space-2xl`: 48px
- `--space-3xl`: 64px

### Border Radius

- `--radius-sm`: 6px
- `--radius-md`: 8px
- `--radius-lg`: 12px
- `--radius-xl`: 16px
- `--radius-2xl`: 24px
- `--radius-full`: 9999px

## Component Classes

### Buttons

```tsx
// Primary button (main CTA)
<button className="btn-primary">Click Me</button>

// Secondary button
<button className="btn-secondary">Secondary</button>

// Ghost button (minimal)
<button className="btn-ghost">Ghost</button>

// Outline button
<button className="btn-outline">Outline</button>
```

### Cards

```tsx
// Standard card
<div className="card p-6">Content</div>

// Elevated card (with shadow)
<div className="card-elevated p-6">Content</div>

// Glass morphism card
<div className="card-glass p-6">Content</div>

// Mystic card (with glow)
<div className="card-mystic p-6">Content</div>
```

### Inputs

```tsx
// Standard input
<input className="input" placeholder="Enter text" />

// Mystic input (with special styling)
<input className="input-mystic" placeholder="Enter text" />
```

### Number Display

```tsx
// Standard number display
<div className="number-display">7</div>

// Large number display
<div className="number-display-large">11</div>

// Master number (with pulse glow)
<div className="number-display-master">22</div>
```

### Badges

```tsx
// Primary badge
<span className="badge-primary">New</span>

// Secondary badge
<span className="badge-secondary">Featured</span>

// Success badge
<span className="badge-success">Complete</span>

// Warning badge
<span className="badge-warning">Warning</span>
```

### Navigation

```tsx
// Standard nav link
<a className="nav-link">Home</a>

// Active nav link
<a className="nav-link-active">Home</a>
```

## Utility Classes

### Text Gradients

```tsx
<h1 className="text-gradient-primary">Gradient Text</h1>
<h2 className="text-gradient-secondary">Secondary Gradient</h2>
```

### Glow Effects

```tsx
<div className="glow-primary">Primary Glow</div>
<div className="glow-primary-subtle">Subtle Glow</div>
<div className="glow-accent">Accent Glow</div>
<div className="glow-success">Success Glow</div>
```

### Glass Morphism

```tsx
<div className="glass">Glass Effect</div>
<div className="glass-strong">Strong Glass</div>
```

### Animations

```tsx
<div className="animate-float">Floating</div>
<div className="animate-pulse-glow">Pulsing Glow</div>
<div className="animate-fade-in">Fade In</div>
<div className="animate-scale-in">Scale In</div>
<div className="animate-slide-in-right">Slide Right</div>
<div className="animate-slide-in-left">Slide Left</div>

// With delays
<div className="animate-fade-in animate-delay-100">Delayed</div>
<div className="animate-fade-in animate-delay-200">More Delay</div>
```

## Tailwind Extensions

### Custom Colors

```tsx
// Primary variants
<div className="bg-primary">Primary</div>
<div className="bg-primary-light">Light</div>
<div className="bg-primary-dark">Dark</div>
<div className="text-primary-hover">Hover</div>

// Background variants
<div className="bg-background-elevated">Elevated</div>
<div className="bg-background-overlay">Overlay</div>

// Card variants
<div className="bg-card-hover">Card Hover</div>
<div className="border-card-border">Card Border</div>
```

### Custom Spacing

```tsx
<div className="p-xs">Extra Small</div>
<div className="p-sm">Small</div>
<div className="p-md">Medium</div>
<div className="p-lg">Large</div>
<div className="p-xl">Extra Large</div>
```

### Custom Shadows

```tsx
<div className="shadow-glow-primary">Primary Glow</div>
<div className="shadow-glow-primary-subtle">Subtle Glow</div>
<div className="shadow-glow-accent">Accent Glow</div>
<div className="shadow-glow-success">Success Glow</div>
```

### Custom Gradients

```tsx
<div className="bg-gradient-primary">Primary Gradient</div>
<div className="bg-gradient-secondary">Secondary Gradient</div>
<div className="bg-gradient-card">Card Gradient</div>
<div className="bg-gradient-card-elevated">Elevated Card</div>
```

## Best Practices

### 1. Use Design Tokens
Always use CSS custom properties or Tailwind classes that reference tokens, never hardcode values.

```tsx
// ✅ Good
<div className="bg-primary text-primary-foreground">

// ❌ Bad
<div style={{ backgroundColor: '#f59e0b' }}>
```

### 2. Component Composition
Compose components using utility classes and component classes.

```tsx
// ✅ Good
<div className="card-mystic p-6 glow-primary-subtle">
  <h2 className="text-gradient-primary">Title</h2>
</div>
```

### 3. Consistent Spacing
Use the spacing scale consistently.

```tsx
// ✅ Good
<div className="space-y-lg">
  <div className="p-md">Item 1</div>
  <div className="p-md">Item 2</div>
</div>
```

### 4. Animation Performance
Use CSS animations over JavaScript when possible, and respect `prefers-reduced-motion`.

```tsx
// ✅ Good
<div className="animate-fade-in">Content</div>
```

## Migration Guide

### Old Classes → New Classes

- `btn-mystic` → `btn-primary`
- `card-mystic` → `card-mystic` (kept, but enhanced)
- `input-mystic` → `input-mystic` (kept, but enhanced)
- `number-display` → `number-display` (kept, but enhanced)
- `glow-gold` → `glow-primary`
- `glow-gold-subtle` → `glow-primary-subtle`
- `text-gradient-gold` → `text-gradient-primary`

## Accessibility

- All colors meet WCAG 2.1 AA contrast requirements
- Focus states are clearly visible
- Animations respect `prefers-reduced-motion`
- Semantic HTML is encouraged

## Performance

- CSS is optimized and minified
- Custom properties enable efficient theming
- Animations use GPU acceleration where possible
- Minimal repaints and reflows

---

**Last Updated**: 2026-01-01
**Version**: 2.0

