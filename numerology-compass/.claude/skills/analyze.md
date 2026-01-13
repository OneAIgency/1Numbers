# /analyze

Deep analysis skill - analyzes codebase, performance, or specific areas.

## Usage
```
/analyze [area]
```

## Areas
- `bundle` - Bundle size and dependencies
- `performance` - Runtime performance issues
- `patterns` - Code patterns and consistency
- `translations` - Translation completeness
- `security` - Security audit
- `all` - Complete analysis

## Examples
```
/analyze bundle
/analyze translations
/analyze all
```

## Output by Area

### /analyze bundle
```
═══════════════════════════════════════════
           BUNDLE ANALYSIS
═══════════════════════════════════════════

📦 Total Bundle Size
├── Raw: 1.2MB
├── Gzipped: 380KB
└── Target: < 200KB ⚠️

🔍 Largest Dependencies
├── recharts: 120KB (31%)
├── @radix-ui/*: 85KB (22%)
├── translations.ts: 45KB (12%)
└── react-dom: 40KB (10%)

⚠️ Unused Dependencies
├── vaul (0 imports)
└── @supabase/supabase-js (configured only)

💡 Recommendations
1. Lazy load Recharts (-120KB initial)
2. Split translations by language (-30KB)
3. Remove unused deps (-15KB)

Potential Savings: ~165KB (43%)
```

### /analyze translations
```
═══════════════════════════════════════════
         TRANSLATION ANALYSIS
═══════════════════════════════════════════

📊 Statistics
├── Total Keys: 245
├── Romanian: 245 (100%)
├── English: 245 (100%)
└── Russian: 243 (99.2%)

❌ Missing Translations
├── RU: luckyDates.mirrorDate
└── RU: luckyDates.repeatingDigits

⚠️ Potential Issues
├── EN: "Diplomatull" - typo? (should be "Diplomat")
└── RU: Some keys use English text

✅ Recommendations
1. Add missing Russian translations
2. Review flagged potential issues
```

### /analyze performance
```
═══════════════════════════════════════════
        PERFORMANCE ANALYSIS
═══════════════════════════════════════════

🔥 Hot Spots
├── StarField.tsx
│   └── Re-renders on every state change
│   └── Fix: Memoize or extract
├── NumerologyResults.tsx
│   └── Recalculates all numbers on render
│   └── Fix: useMemo for calculations
└── translations.ts
    └── Object recreation on language change
    └── Fix: Memoize getTranslation

📱 Mobile Performance
├── StarField particles: Consider reducing
├── Charts: Add loading states
└── Images: Add lazy loading

⚡ Recommendations (Priority Order)
1. Add React.memo to NumberCard
2. Memoize compatibility calculations
3. Lazy load chart components
```

### /analyze all
Runs all analyses and provides comprehensive report.
