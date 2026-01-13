# /new-feature

Complete workflow for implementing a new feature using the multi-agent system.

## Usage
```
/new-feature [feature description]
```

## Example
```
/new-feature Add biorhythm calculator with visualization
```

## Workflow Executed

### Step 1: Orchestrator Analysis
```
📋 Analyzing feature request...
├── Reading app-truth.md
├── Checking existing code patterns
└── Decomposing into sub-tasks
```

### Step 2: Task Decomposition
```
📦 DECOMPOSITION
├── T1: Create lib/biorhythm.ts (business logic)
├── T2: Add translations (ro/en/ru)
├── T3: Create BiorhythmChart.tsx (visualization)
├── T4: Create BiorhythmResults.tsx (display)
├── T5: Integrate into Tools.tsx page
└── T6: Update documentation
```

### Step 3: Parallel Execution
```
🚀 EXECUTING (M4 Pro parallel mode)

PHASE 1 [Sequential]:
  implement → T1: lib/biorhythm.ts
  verify → Check T1

PHASE 2 [Parallel - 3 threads]:
  implement → T2: translations
  implement → T3: BiorhythmChart.tsx
  implement → T4: BiorhythmResults.tsx
  verify → Check T2, T3, T4

PHASE 3 [Sequential]:
  implement → T5: Integration
  verify → Final check

PHASE 4 [Parallel]:
  docs → Update app-truth.md
  docs → Update CLAUDE.md
```

### Step 4: Verification
```
✅ VERIFICATION
├── TypeScript: PASSED
├── ESLint: PASSED
├── Translations: Complete (all 3 languages)
├── Patterns: Compliant
└── Tests: Created (if test agent enabled)
```

### Step 5: Report
```
═══════════════════════════════════════════
        FEATURE IMPLEMENTATION COMPLETE
═══════════════════════════════════════════

📁 Files Created/Modified:
├── src/lib/biorhythm.ts (NEW)
├── src/components/BiorhythmChart.tsx (NEW)
├── src/components/BiorhythmResults.tsx (NEW)
├── src/pages/Tools.tsx (MODIFIED)
├── src/lib/translations.ts (MODIFIED)
├── app-truth.md (MODIFIED)
└── CLAUDE.md (MODIFIED)

📊 Stats:
├── Lines Added: ~450
├── Execution Time: 4m 12s
└── Parallel Speedup: 2.1x

✅ Ready for review and testing
```

## Options
```
/new-feature --dry-run [description]   # Show plan only, don't execute
/new-feature --no-docs [description]   # Skip documentation update
/new-feature --verbose [description]   # Show detailed progress
```
