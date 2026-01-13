# /build-check

Quick verification skill - runs build and lint to check code health.

## Usage
```
/build-check
```

## What It Does
1. Runs TypeScript compilation check
2. Runs ESLint
3. Reports any errors with file locations

## Commands Executed
```bash
npm run build 2>&1 | head -50
npm run lint 2>&1 | head -50
```

## Expected Output
```
═══════════════════════════════════════════
            BUILD CHECK
═══════════════════════════════════════════

📦 TypeScript Compilation
└── ✅ PASSED (no errors)

🔍 ESLint
└── ✅ PASSED (no warnings)

Status: ALL CHECKS PASSED ✓
```

## On Failure
```
═══════════════════════════════════════════
            BUILD CHECK
═══════════════════════════════════════════

📦 TypeScript Compilation
└── ❌ FAILED

Errors:
├── src/lib/numerology.ts:45
│   └── Type 'string' is not assignable to type 'number'
└── src/components/Form.tsx:12
    └── Property 'value' does not exist on type '{}'

🔍 ESLint
└── ⚠️ 2 warnings

Warnings:
├── src/pages/Index.tsx:5
│   └── 'useState' is defined but never used
└── ...

Status: FAILED - Fix errors before proceeding
```
