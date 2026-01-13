# Quick Reference Card

## Agents
| Agent | Trigger Words |
|-------|---------------|
| orchestrator | complex task, multi-step, implement feature |
| implement | write, create, add, build |
| verify | check, validate, verify |
| test | test, coverage |
| docs | document, update docs |
| numerology-expert | calculation, algorithm, numerology |
| creative | improve, suggest, UX, design |
| optimize | performance, bundle, speed |

## Skills
```
/build-check              # Quick TypeScript + ESLint
/new-feature [desc]       # Full feature workflow
/add-translation [key]    # Add i18n
/quick-test [func]        # Test function
/analyze [area]           # Deep analysis
```

## Common Workflows

### New Feature
```
/new-feature Add [description]
```

### Quick Fix
```
1. Make change
2. /build-check
3. Commit
```

### Before Commit
```
/build-check
/analyze translations
```

## Key Files
- `app-truth.md` - Architecture rules
- `CLAUDE.md` - Quick reference
- `src/lib/` - Business logic
- `src/lib/translations.ts` - All UI text

## Layer Rules
```
Pages → Components → Lib
  ↓         ↓         ↓
 UI      Display    Logic
```

## Translation Pattern
```typescript
const { t } = useLanguage();
<h1>{t.section.key}</h1>
```

## Import Order
1. React/external
2. @/components/ui/*
3. @/components/*
4. @/contexts/*
5. @/lib/*
6. Types
