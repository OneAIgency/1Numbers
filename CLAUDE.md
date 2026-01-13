# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Location

The main codebase is in `/numerology-compass/`. All commands should be run from that directory.

## Commands

```bash
cd numerology-compass

# Frontend
npm run dev           # Start dev server on http://localhost:8080
npm run build         # Production build
npm run lint          # Run ESLint
npm run test          # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:coverage # Coverage report (covers src/lib/)

# Backend (server/)
cd server
npm run dev           # Start Express server with nodemon
npm run build         # TypeScript build
npm run migrate       # Run database migrations
```

Run single test file: `npm run test:run -- src/lib/numerology.test.ts`

## Architecture Overview

Numerology Compass is a multilingual (Romanian/English/Russian) numerology web app using the Pythagorean system.

**Tech Stack**: React 18 + TypeScript + Vite (SWC) | shadcn/ui + Tailwind | React Router + React Query | Express + PostgreSQL

### Layer Structure
```
numerology-compass/
├── src/
│   ├── lib/           # Pure TypeScript business logic (numerology calculations)
│   ├── pages/         # Route components
│   ├── components/    # UI (shadcn in ui/, custom at root, charts/)
│   ├── contexts/      # LanguageContext, AuthContext
│   ├── hooks/         # Custom React hooks
│   └── integrations/  # API client
└── server/            # Express backend
    ├── src/
    │   ├── routes/    # API endpoints
    │   ├── middleware/# Auth middleware
    │   └── migrations/# Database migrations
    └── package.json
```

### Core Business Logic (`src/lib/`)
- `numerology.ts` - Life Path, Destiny, Soul Urge, Personality calculations
- `compatibility.ts` + `compatibilityMatrix.ts` - Compatibility scoring (Life Path 50%, Destiny 30%, Soul Urge 20%)
- `karmic.ts` - Karmic debt (13, 14, 16, 19) and lessons
- `personalCycles.ts` - Day/Month/Year cycles
- `pinnacles.ts` - Life pinnacles and challenges
- `predictions.ts` - Daily/monthly forecasts
- `nameAnalysis.ts`, `phoneAnalysis.ts`, `vehicleAnalysis.ts`, `locationAnalysis.ts`, `dateAnalysis.ts` - Specialized analysis modules
- `translations.ts` - All UI text in RO/EN/RU

### Key Conventions

**Master Numbers**: 11, 22, 33 are preserved via `preserveMaster` flag in `reduceToSingleDigit()`

**Translations**: Access via `useLanguage()` hook - `const { t, language, setLanguage } = useLanguage()`. All strings in `translations[lang][section][key]` format.

**Component Structure**: External imports → Internal (`@/`) imports → Interface → Component (hooks first, then state, effects, handlers, render)

**Import Alias**: `@/` maps to `src/`

### Styling

Custom `mystic-*` colors (gold, purple, violet, indigo). Fonts: Cinzel (headings), Raleway (body). CSS variables in `index.css`. Custom utilities: `.text-gradient-gold`, `.glow-gold`, `.card-mystic`, `.number-display`

### Routes

`/` (calculator), `/guide`, `/compatibility`, `/predictions`, `/tools`, `/tutorials`, `/faq`, `/auth`

## Key Files

- `numerology-compass/app-truth.md` - Single source of truth for architecture, patterns, and domain rules
- `numerology-compass/.claude/agents/` - Multi-agent system definitions (orchestrator, implement, verify, test, docs, numerology-expert, creative, optimize)
- `numerology-compass/.claude/skills/` - Custom skills (/build-check, /new-feature, /add-translation, /quick-test, /analyze)

## Testing

Tests use Vitest + Testing Library. Test files: `src/**/*.{test,spec}.{ts,tsx}`. Setup: `src/test/setup.ts`. Coverage targets `src/lib/`.

## Other Projects

The `multi/` directory contains a separate Multi-Agent Orchestrator System (macOS app + CLI). See `multi/CLAUDE.md` for details.
