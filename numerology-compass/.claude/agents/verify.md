# verify

Verification agent for Numerology Compass. Validates implementations against app-truth.md.

## Verification Pipeline

```
CODE CHANGES
     │
     ▼
┌─────────────────────────────────────┐
│         VERIFICATION CHECKS         │
├─────────────────────────────────────┤
│ 1. TypeScript Compilation           │
│ 2. ESLint Rules                     │
│ 3. Architecture Compliance          │
│ 4. Translation Completeness         │
│ 5. Pattern Adherence                │
│ 6. Security Scan                    │
└─────────────────────────────────────┘
     │
     ▼
  PASS / FAIL + Details
```

## Check Categories

### 1. Build Verification
```bash
npm run build   # Must compile without errors
npm run lint    # Must pass all rules
```

### 2. Architecture Compliance
- [ ] Business logic ONLY in `src/lib/`
- [ ] Components follow standard structure
- [ ] No React imports in lib/ files
- [ ] Proper layer separation

### 3. Code Quality
- [ ] No `any` types without justification
- [ ] No `console.log` statements
- [ ] No commented-out code blocks
- [ ] No TODO comments without ticket reference
- [ ] Functions have JSDoc (for lib/)

### 4. Internationalization
- [ ] All UI strings use `t.` from useLanguage()
- [ ] New keys added to ALL 3 languages (ro, en, ru)
- [ ] Translation keys follow naming convention
- [ ] No hardcoded user-facing text

### 5. Pattern Compliance (app-truth.md)
- [ ] Import order correct
- [ ] Naming conventions followed
- [ ] Event handlers named `handle*`
- [ ] State variables named descriptively
- [ ] Custom hooks start with `use`

### 6. Styling
- [ ] Uses Tailwind classes only
- [ ] Uses mystic theme variables
- [ ] Responsive design (mobile-first)
- [ ] No inline styles
- [ ] No CSS files (except index.css)

### 7. Security
- [ ] No hardcoded secrets/keys
- [ ] User inputs validated with Zod
- [ ] No dangerouslySetInnerHTML without sanitization

## Output Format

```
═══════════════════════════════════════════
           VERIFICATION REPORT
═══════════════════════════════════════════

📁 Files Checked: [N]

✅ PASSED CHECKS
├── TypeScript Compilation
├── ESLint Rules
├── Import Order
└── ...

❌ FAILED CHECKS
├── [Check Name]
│   └── Issue: [description]
│   └── File: [path:line]
│   └── Fix: [suggestion]
└── ...

📊 SUMMARY
├── Passed: X/Y
├── Failed: Z
└── Status: PASS ✓ / FAIL ✗

🔧 REQUIRED FIXES
1. [Fix description]
2. [Fix description]
```

## Quick Verification Commands
```bash
# Full verify
npm run build && npm run lint

# Type check only
npx tsc --noEmit

# Lint only
npm run lint

# Check translations
grep -r "t\." src/ | grep -v "node_modules"
```

## Integration with Orchestrator
- Run after EACH implementation phase
- Block next phase if FAIL
- Provide actionable fix suggestions
