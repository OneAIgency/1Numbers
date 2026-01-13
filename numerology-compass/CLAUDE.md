# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Numerology Compass is a multilingual (Romanian/English/Russian) numerology web application using the Pythagorean system. It calculates Life Path, Destiny, Soul Urge, and Personality numbers, plus compatibility analysis, karmic debt, personal cycles, and predictions.

## Commands

```bash
npm run dev           # Start dev server on port 8080
npm run build         # Production build
npm run lint          # Run ESLint
npm run preview       # Preview production build
npm run test          # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:coverage # Run tests with coverage report
```

## Architecture

### Tech Stack
- **React 18 + TypeScript + Vite** with SWC compiler
- **shadcn/ui** (Radix primitives) for components
- **Tailwind CSS** with custom mystic theme colors
- **React Router** for navigation
- **React Query** for server state
- **Node.js** - Backend API server
- **PostgreSQL** - Database

### Key Directories

```
src/
├── lib/           # Business logic (numerology calculations)
├── pages/         # Route components
├── components/    # UI components + charts/
├── contexts/      # LanguageContext, AuthContext
├── hooks/         # Custom hooks
└── integrations/  # API client (Node.js backend)
```

### Business Logic (`src/lib/`)

All numerology calculations are pure TypeScript functions in `lib/`:
- `numerology.ts` - Core calculations (Life Path, Destiny, Soul Urge, Personality)
- `compatibility.ts` + `compatibilityMatrix.ts` - Person compatibility scoring
- `karmic.ts` - Karmic debt (13, 14, 16, 19) and lessons
- `personalCycles.ts` - Day/Month/Year cycles
- `pinnacles.ts` - Life pinnacles and challenges
- `predictions.ts` - Daily/monthly forecasts
- `translations.ts` - All UI text in RO/EN/RU

### Component Patterns

- UI primitives in `components/ui/` (shadcn standard)
- Feature components at `components/` root level
- Charts use Recharts in `components/charts/`
- Path alias `@/` maps to `src/`

### Styling

Custom theme extends Tailwind with `mystic-*` colors (purple, indigo, gold, violet). Fonts: Cinzel (headings), Raleway (body). CSS variables in `index.css`.

### Routes

`/` (Index), `/guide`, `/compatibility`, `/predictions`, `/tools`, `/tutorials`, `/faq`, `/auth`

## Conventions

- Master numbers (11, 22, 33) are preserved in reductions via `preserveMaster` flag
- Translation keys follow pattern: `translations[lang][section][key]`
- Form validation uses Zod schemas with react-hook-form

## Multi-Agent System

This project uses an orchestrated multi-agent development system optimized for M4 Pro.

### Agents (`.claude/agents/`)
| Agent | Purpose |
|-------|---------|
| orchestrator | Master coordinator, task decomposition |
| implement | Write production code |
| verify | Validate against app-truth.md |
| test | Create and run tests |
| docs | Update documentation |
| numerology-expert | Domain validation |
| creative | UX/feature innovation |
| optimize | Performance improvements |

### Skills (`.claude/skills/`)
```
/build-check          # Quick TypeScript + ESLint
/new-feature [desc]   # Full feature workflow
/add-translation      # Add i18n keys to all 3 languages
/quick-test [func]    # Test specific function
/analyze [area]       # Deep analysis (bundle, translations, etc.)
```

### Workflow
1. **Orchestrator** analyzes and decomposes tasks
2. **Implement** agents work in parallel (up to 4 threads)
3. **Verify** agent checks after each phase
4. **Docs** agent updates documentation

### Key Files
- `app-truth.md` - Single source of truth (architecture, patterns, constraints)
- `docs/workflow/` - Detailed workflow documentation
