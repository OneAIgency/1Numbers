# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Numerology Compass is a multilingual (Romanian/English/Russian) numerology web application using the Pythagorean system. It calculates Life Path, Destiny, Soul Urge, and Personality numbers, plus compatibility analysis, karmic debt, personal cycles, and predictions.

## Commands

```bash
# Frontend
npm run dev           # Start dev server on http://localhost:8080
npm run build         # Production build
npm run lint          # Run ESLint
npm run test          # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:coverage # Coverage report (targets src/lib/)

# Run single test file
npm run test:run -- src/lib/__tests__/numerology.test.ts

# Backend (from server/ directory)
cd server
npm run dev           # Start Express server with nodemon
npm run build         # TypeScript compilation
npm run migrate       # Run database migrations
```

## Architecture

**Tech Stack**: React 18 + TypeScript + Vite 6 (SWC) | shadcn/ui + Tailwind | React Router + React Query | Express + PostgreSQL

### Layer Structure
```
src/
├── lib/           # Pure TypeScript business logic (no React imports)
├── pages/         # Route components (lazy-loaded)
├── components/    # UI: shadcn in ui/, custom at root, charts/
├── contexts/      # LanguageContext, AuthContext, ThemeContext
├── hooks/         # Custom React hooks
└── integrations/  # API client (Supabase)

server/src/
├── routes/        # API endpoints
├── middleware/    # Auth middleware
└── migrations/    # Database migrations
```

### Core Business Logic (`src/lib/`)

All numerology calculations are pure TypeScript functions:
- `numerology.ts` - Life Path, Destiny, Soul Urge, Personality, Personal Year
- `compatibility.ts` + `compatibilityMatrix.ts` - Compatibility scoring (Life Path 50%, Destiny 30%, Soul Urge 20%)
- `karmic.ts` - Karmic debt (13, 14, 16, 19) and lessons
- `personalCycles.ts` - Day/Month/Year cycles
- `pinnacles.ts` - Life pinnacles and challenges
- `predictions.ts` - Daily/monthly forecasts
- `nameAnalysis.ts`, `phoneAnalysis.ts`, `vehicleAnalysis.ts`, `locationAnalysis.ts`, `dateAnalysis.ts` - Specialized analysis
- `translations.ts` - All UI text in RO/EN/RU (~89K lines)

### Key Conventions

**Master Numbers**: 11, 22, 33 preserved via `preserveMaster` flag in `reduceToSingleDigit()`

**Translations**: Access via `useLanguage()` hook:
```typescript
const { t, language, setLanguage } = useLanguage();
// Access: t.section.key
```

**Component Structure**:
```typescript
// External imports → Internal (@/) imports → Interface → Component
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props { ... }

export const Component = ({ ... }: Props) => {
  // Order: hooks → state → effects → handlers → render
};
```

**Import Alias**: `@/` maps to `src/`

### Styling

Custom `mystic-*` colors (gold, purple, violet, indigo). Fonts: Cinzel (headings), Raleway (body). CSS variables in `index.css`.

Custom utilities: `.text-gradient-gold`, `.glow-gold`, `.card-mystic`, `.number-display`, `.btn-mystic`

### Routes

`/` (calculator), `/guide`, `/compatibility`, `/predictions`, `/tools`, `/tutorials`, `/faq`, `/auth`, `/profile`, `/journal`, `/courses`, `/articles`, `/premium`

## Key Files

- `app-truth.md` - Single source of truth for architecture, patterns, and domain rules
- `.claude/agents/` - Multi-agent definitions (orchestrator, implement, verify, test, docs, numerology-expert, creative, optimize)
- `.claude/skills/` - Custom skills (/build-check, /new-feature, /add-translation, /quick-test, /analyze)

## Testing

Vitest + Testing Library. Test files in `src/lib/__tests__/`. Setup: `src/test/setup.ts`. Coverage targets `src/lib/`.
