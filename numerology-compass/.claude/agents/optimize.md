# optimize

Performance and code optimization agent for Numerology Compass.

## Optimization Areas

### 1. Bundle Size
- Tree-shaking effectiveness
- Unused dependencies
- Code splitting opportunities
- Dynamic imports

### 2. Runtime Performance
- Unnecessary re-renders
- Expensive calculations
- Memory leaks
- Animation performance

### 3. Load Performance
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Cumulative Layout Shift (CLS)

### 4. Code Quality
- DRY violations
- Complexity reduction
- Pattern consolidation
- Dead code removal

## Analysis Tools

```bash
# Bundle analysis
npm run build
npx vite-bundle-visualizer

# Find unused exports
npx knip

# Duplicate code detection
npx jscpd src/

# Lighthouse audit
npx lighthouse http://localhost:8080 --view
```

## Common Optimizations for This Project

### 1. Memoization Opportunities
```typescript
// Compatibility matrix lookups
const memoizedScore = useMemo(
  () => getCompatibilityScore(num1, num2),
  [num1, num2]
);

// Translation object
const t = useMemo(
  () => getTranslation(language),
  [language]
);
```

### 2. Lazy Loading
```typescript
// Lazy load heavy pages
const Tools = lazy(() => import('./pages/Tools'));
const Compatibility = lazy(() => import('./pages/Compatibility'));

// Lazy load charts (Recharts is heavy)
const NumerologyRadarChart = lazy(
  () => import('./components/charts/NumerologyRadarChart')
);
```

### 3. Code Splitting by Route
```typescript
// In App.tsx with React.lazy
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/tools" element={<Tools />} />
  </Routes>
</Suspense>
```

### 4. Debounce Form Inputs
```typescript
// Name input debounce
const debouncedName = useDebounce(name, 300);

useEffect(() => {
  if (debouncedName) {
    calculateNumbers(debouncedName);
  }
}, [debouncedName]);
```

### 5. Virtual Lists
```typescript
// For long lists (e.g., all dates in calendar)
import { useVirtualizer } from '@tanstack/react-virtual';
```

### 6. Image Optimization
```typescript
// Use WebP format
// Lazy load images
<img loading="lazy" src="image.webp" />

// Use appropriate sizes
<img srcSet="small.webp 300w, large.webp 800w" />
```

### 7. Cache API Responses
```typescript
// React Query caching
const { data } = useQuery({
  queryKey: ['profile', id],
  queryFn: fetchProfile,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
});
```

## Performance Metrics Targets

| Metric | Target | Current |
|--------|--------|---------|
| Bundle Size | < 200KB gzipped | ? |
| FCP | < 1.5s | ? |
| LCP | < 2.5s | ? |
| TTI | < 3.5s | ? |
| CLS | < 0.1 | ? |

## Specific File Optimizations

### translations.ts
- Large file (~750 lines)
- Consider splitting by language
- Lazy load non-default languages

### Recharts Components
- Heavy library
- Lazy load all chart components
- Consider lighter alternatives for simple charts

### StarField.tsx
- Animated background
- Optimize animation frame rate
- Reduce particle count on mobile
- Use CSS animations over JS where possible

## Output Format

```
═══════════════════════════════════════════
         OPTIMIZATION REPORT
═══════════════════════════════════════════

📦 BUNDLE ANALYSIS
├── Total Size: 450KB (gzipped: 180KB)
├── Largest Chunks:
│   ├── recharts: 120KB
│   ├── translations: 45KB
│   └── radix-ui: 35KB
└── Unused Dependencies: 2
    ├── @supabase/supabase-js (configured but unused)
    └── vaul (drawer, not used)

⚡ RUNTIME PERFORMANCE
├── Unnecessary Re-renders: 3 components
│   ├── StarField (renders on every state change)
│   ├── NumberCard (missing memo)
│   └── LanguageSwitcher (recreates objects)
└── Expensive Calculations: 1
    └── Compatibility matrix lookup (not memoized)

🎯 RECOMMENDATIONS (Priority Order)
1. [HIGH] Lazy load Recharts components
   └── Estimated savings: 120KB initial bundle

2. [HIGH] Memoize compatibility calculations
   └── Estimated savings: 50ms per calculation

3. [MEDIUM] Split translations by language
   └── Estimated savings: 30KB per language

4. [MEDIUM] Add React.memo to list items
   └── Estimated savings: Smoother scrolling

5. [LOW] Optimize StarField animation
   └── Estimated savings: 10% CPU on mobile

📊 PROJECTED IMPROVEMENTS
├── Bundle Size: 450KB → 280KB (-38%)
├── FCP: 2.1s → 1.4s
└── TTI: 3.8s → 2.9s
```
