# Numerology Compass - Application Truth

> **Single Source of Truth** for architecture, patterns, and conventions.
> All agents and developers MUST adhere to these specifications.

---

## 1. Core Identity

**Name**: Numerology Compass
**Domain**: Numerology (Pythagorean System)
**Languages**: Romanian (primary), English, Russian
**Target**: Web browsers (responsive, mobile-first)

---

## 2. Technology Stack

### Frontend Core
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI Library |
| TypeScript | 5.8.3 | Type Safety |
| Vite | 5.4.19 | Build Tool (SWC) |
| React Router | 6.30.1 | Navigation |

### UI Framework
| Technology | Purpose |
|------------|---------|
| shadcn/ui | Component Library (Radix-based) |
| Tailwind CSS 3.4 | Styling |
| Lucide React | Icons |
| Recharts | Data Visualization |

### State & Data
| Technology | Purpose |
|------------|---------|
| React Query 5 | Server State |
| React Context | Global State (Language, Auth) |
| Zod | Schema Validation |
| React Hook Form | Form Management |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | API Server (Express/Fastify) |
| PostgreSQL | Database |
| JWT | Authentication |

### Testing
| Technology | Purpose |
|------------|---------|
| Vitest | Test runner |
| @testing-library/react | Component testing |
| jsdom | DOM simulation |

---

## 3. Architecture Principles

### 3.1 Layer Separation
```
┌─────────────────────────────────────────┐
│           PAGES (Routes)                │  src/pages/
├─────────────────────────────────────────┤
│         COMPONENTS (UI)                 │  src/components/
├─────────────────────────────────────────┤
│       CONTEXTS (Global State)           │  src/contexts/
├─────────────────────────────────────────┤
│         LIB (Business Logic)            │  src/lib/
├─────────────────────────────────────────┤
│      INTEGRATIONS (External)            │  src/integrations/
└─────────────────────────────────────────┘
```

### 3.2 Business Logic Rules

**ALL numerology calculations MUST be:**
- Pure TypeScript functions in `src/lib/`
- Independent of React/UI
- Exportable and testable
- Documented with JSDoc

**Master Numbers (11, 22, 33):**
- Always preserved unless explicitly reduced
- Use `preserveMaster` flag in `reduceToSingleDigit()`
- Display with special styling (gradient, glow)

### 3.3 Component Rules

**Naming:**
- PascalCase for components: `NumerologyForm.tsx`
- camelCase for utilities: `numerology.ts`
- kebab-case for CSS classes via Tailwind

**Structure:**
```typescript
// Standard component structure
import { ... } from "...";  // External imports first
import { ... } from "@/..."; // Internal imports (use @ alias)

interface ComponentProps { ... }

export const Component = ({ ... }: ComponentProps) => {
  // Hooks first
  const { t } = useLanguage();

  // State
  const [state, setState] = useState();

  // Effects
  useEffect(() => { ... }, []);

  // Handlers
  const handleAction = () => { ... };

  // Render
  return ( ... );
};
```

---

## 4. Styling System

### 4.1 Theme Colors (CSS Variables)
```css
/* Primary - Gold */
--primary: 45 80% 55%;
--mystic-gold: 45 80% 55%;
--mystic-gold-light: 45 70% 70%;

/* Secondary - Purple/Violet */
--secondary: 260 40% 25%;
--mystic-purple: 260 60% 30%;
--mystic-violet: 280 45% 35%;
--mystic-indigo: 240 50% 20%;

/* Background - Dark */
--background: 240 20% 6%;
--card: 240 15% 10%;
```

### 4.2 Typography
```css
/* Headings */
font-family: 'Cinzel', serif;

/* Body */
font-family: 'Raleway', sans-serif;
```

### 4.3 Custom Utilities
```css
.text-gradient-gold    /* Gold gradient text */
.glow-gold             /* Strong gold glow */
.glow-gold-subtle      /* Subtle gold glow */
.card-mystic           /* Gradient card background */
.number-display        /* Number circle display */
.btn-mystic            /* Mystical button style */
.input-mystic          /* Mystical input style */
```

---

## 5. Internationalization (i18n)

### 5.1 Languages
- `ro` - Romanian (default)
- `en` - English
- `ru` - Russian

### 5.2 Translation Structure
```typescript
// src/lib/translations.ts
export const translations = {
  ro: { section: { key: "value" } },
  en: { section: { key: "value" } },
  ru: { section: { key: "value" } }
};
```

### 5.3 Usage Pattern
```typescript
const { t, language, setLanguage } = useLanguage();
// Access: t.section.key or t.key
```

### 5.4 Adding New Translations
1. Add to ALL three languages in `translations.ts`
2. Follow existing key naming patterns
3. Test in all languages before commit

---

## 6. Numerology Domain

### 6.1 Core Numbers
| Number | Name | Source |
|--------|------|--------|
| Life Path | Drum al Vieții | Birth Date |
| Destiny | Destin | Full Name (all letters) |
| Soul Urge | Sufletului | Full Name (vowels) |
| Personality | Personalității | Full Name (consonants) |
| Personal Year | An Personal | Birth Date + Current Year |

### 6.2 Pythagorean Letter Values
```
A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9
J=1, K=2, L=3, M=4, N=5, O=6, P=7, Q=8, R=9
S=1, T=2, U=3, V=4, W=5, X=6, Y=7, Z=8
```

### 6.3 Vowels
`A, E, I, O, U`

### 6.4 Master Numbers
- **11** - Master Intuitor (Maestrul Intuitor)
- **22** - Master Builder (Maestrul Constructor)
- **33** - Master Teacher (Maestrul Învățător)

### 6.5 Karmic Debt Numbers
- **13** - Hard work lesson
- **14** - Freedom/moderation lesson
- **16** - Ego/spirituality lesson
- **19** - Independence lesson

### 6.6 Compatibility Scoring
- Life Path: 50% weight
- Destiny: 30% weight
- Soul Urge: 20% weight
- Range: 0-100 (40-98 in matrix)

---

## 7. Routes & Navigation

| Route | Page | Description |
|-------|------|-------------|
| `/` | Index | Main calculator |
| `/guide` | NumerologyGuide | Number meanings |
| `/compatibility` | Compatibility | Pair analysis |
| `/predictions` | Predictions | Daily/monthly forecasts |
| `/tools` | Tools | Advanced instruments |
| `/tutorials` | Tutorials | Learning resources |
| `/faq` | FAQ | Questions & answers |
| `/auth` | Auth | Login/Register |

---

## 8. Data Flow Patterns

### 8.1 Form Submission
```
User Input → Zod Validation → Business Logic (lib/) → State Update → UI Render
```

### 8.2 Calculation Flow
```typescript
// Always follow this pattern
const result = calculateXXX(input);  // Pure function from lib/
setResult(result);                    // Update state
// Component renders based on result
```

### 8.3 Translation Access
```typescript
// Context provides translated strings
const { t } = useLanguage();
return <h1>{t.title}</h1>;
```

---

## 9. File Organization

### 9.1 New Feature Checklist
- [ ] Business logic in `src/lib/newFeature.ts`
- [ ] Types/interfaces exported
- [ ] Component in `src/components/NewFeature.tsx`
- [ ] Translations in ALL 3 languages
- [ ] Route added (if page-level)
- [ ] Tests (when testing is set up)

### 9.2 Import Order
1. React/external packages
2. `@/components/ui/*` (shadcn)
3. `@/components/*` (custom)
4. `@/contexts/*`
5. `@/lib/*`
6. `@/hooks/*`
7. Types/interfaces
8. Assets/styles

---

## 10. API Contracts (Future)

### 10.1 User Profile
```typescript
interface UserProfile {
  id: string;
  fullName: string;
  birthDate: Date;
  email: string;
  language: Language;
  savedCalculations: Calculation[];
}
```

### 10.2 Calculation Result
```typescript
interface NumerologyResult {
  lifePath: number;
  destiny: number;
  soulUrge: number;
  personality: number;
  personalYear: number;
  karmicDebts: number[];
  karmicLessons: number[];
  pinnacles: number[];
  challenges: number[];
}
```

---

## 11. Quality Gates

### 11.1 Pre-Commit Checks
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] All translations present
- [ ] No console.log statements
- [ ] No hardcoded strings (use translations)

### 11.2 Code Review Criteria
- [ ] Follows layer separation
- [ ] Pure functions in lib/
- [ ] Consistent with existing patterns
- [ ] Mobile-responsive
- [ ] Accessible (ARIA labels)

---

## 12. Forbidden Patterns

**DO NOT:**
- Put business logic in components
- Use inline styles (use Tailwind)
- Hardcode strings (use translations)
- Mix contexts (keep separation)
- Skip TypeScript types
- Use `any` type without justification
- Modify shadcn/ui components directly
- Use non-standard date formats

---

## 13. Performance Guidelines

- Lazy load pages with React.lazy()
- Memoize expensive calculations
- Use React Query for API caching
- Optimize images (WebP, lazy loading)
- Minimize bundle with tree-shaking

---

## 14. Security Requirements

- Validate all user inputs with Zod
- Sanitize before database operations
- Use environment variables for secrets
- Implement rate limiting (future)
- HTTPS only in production

---

**Last Updated**: 2026-01-03
**Version**: 1.0.0
