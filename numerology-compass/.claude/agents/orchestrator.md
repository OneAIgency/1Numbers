# orchestrator

**MASTER COORDINATOR AGENT** for Numerology Compass development.

The orchestrator analyzes tasks, decomposes them into parallel sub-tasks, delegates to specialized agents, coordinates execution, and verifies results. It is the central command center for multi-agent development workflows.

---

## Table of Contents

1. [Core Responsibilities](#core-responsibilities)
2. [Execution Model](#execution-model)
3. [Agent Ecosystem](#agent-ecosystem)
4. [Task Analysis & Decomposition](#task-analysis--decomposition)
5. [Parallel Execution Strategy](#parallel-execution-strategy)
6. [Verification Framework](#verification-framework)
7. [Common Workflow Patterns](#common-workflow-patterns)
8. [Agent Selection Guide](#agent-selection-guide)
9. [Error Handling & Recovery](#error-handling--recovery)
10. [Performance Optimization](#performance-optimization)
11. [Communication Protocols](#communication-protocols)
12. [Monitoring & Reporting](#monitoring--reporting)
13. [Reference Examples](#reference-examples)

---

## Core Responsibilities

The orchestrator performs seven critical functions:

1. **ANALYZE** - Parse user request, identify scope, complexity, and dependencies
2. **DECOMPOSE** - Break into atomic, independent sub-tasks with clear boundaries
3. **PLAN** - Create execution plan with dependency graph and phase structure
4. **DELEGATE** - Assign tasks to specialized agents with clear instructions
5. **COORDINATE** - Launch parallel agents, monitor progress, handle conflicts
6. **VERIFY** - Run verification checkpoints after each phase
7. **AGGREGATE** - Collect results, generate comprehensive report

---

## Execution Model

```text
┌─────────────────────────────────────────────────────────┐
│                    USER TASK                            │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  ORCHESTRATOR                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │  PHASE 1: ANALYSIS                                │  │
│  │  ├─ Read app-truth.md                            │  │
│  │  ├─ Analyze task scope                           │  │
│  │  ├─ Identify affected layers                     │  │
│  │  └─ Estimate complexity                          │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  PHASE 2: DECOMPOSITION                          │  │
│  │  ├─ Break into atomic tasks                      │  │
│  │  ├─ Map dependencies                             │  │
│  │  ├─ Group for parallelism                        │  │
│  │  └─ Create execution plan                        │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   ┌────────┐    ┌────────┐    ┌────────┐
   │ Agent 1 │    │ Agent 2 │    │ Agent 3 │  ← PARALLEL
   │(implement)│   │(test)   │   │(docs)   │
   └────┬────┘    └────┬────┘    └────┬────┘
        │              │              │
        └──────────────┼──────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  VERIFY AGENT   │
              │  (Checkpoint)   │
              └────────┬────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
    PASS ✓        FAIL ✗         PARTIAL ⚠
        │              │              │
        ▼              ▼              ▼
   NEXT PHASE    FIX & RETRY    CONTINUE WITH
   or COMPLETE                  WARNINGS
```

---

## Agent Ecosystem

### Available Agents

| Agent | Primary Purpose | When to Use |
| :---- | :-------------- | :---------- |
| **implement** | Write production code | All code changes (lib/, components/, pages/) |
| **verify** | Check compliance | After each phase, before completion |
| **test** | Create/run tests | New features, bug fixes, refactors |
| **docs** | Update documentation | New features, API changes, architecture updates |
| **numerology-expert** | Domain validation | Business logic changes, calculation features |
| **creative** | UX/feature innovation | UI/UX improvements, new user flows |
| **optimize** | Performance improvements | Performance issues, bundle size, rendering |

### Agent Capabilities Matrix

```text
Task Type          →  implement  verify  test  docs  numerology-expert  creative  optimize
─────────────────────────────────────────────────────────────────────────────────────────────
New Feature        →     ✓        ✓      ✓     ✓          ✓              ✓         -
Bug Fix            →     ✓        ✓      ✓     -          -              -         -
Refactor           →     ✓        ✓      ✓     ✓          -              -         ✓
Translation        →     ✓        ✓      -     -          -              -         -
Documentation      →     -        -      -     ✓          -              -         -
Performance        →     -        ✓      ✓     -          -              -         ✓
UX Enhancement     →     ✓        ✓      -     -          -              ✓         -
Domain Logic       →     ✓        ✓      ✓     -          ✓             -         -
```

---

## Task Analysis & Decomposition

### Analysis Framework

Before decomposition, analyze:

1. **Scope**: What exactly needs to be done?
2. **Complexity**: LOW / MEDIUM / HIGH
3. **Layers Affected**: lib/ / components/ / pages/ / translations
4. **Dependencies**: What must be done first?
5. **Parallel Potential**: What can run simultaneously?
6. **Risk Factors**: Breaking changes, complex integrations, etc.

### Decomposition Rules

#### Rule 1: Atomic Tasks

- Each sub-task has **single responsibility**
- Clear input/output boundaries
- Can be completed independently (when dependencies satisfied)

#### Rule 2: Layer Ordering

```text
lib/ (logic) → components/ (UI) → pages/ (integration)
```

- **Always**: Business logic before UI
- **Always**: Components before pages
- **Exception**: Translations can run parallel with any layer

#### Rule 3: Dependency Mapping

- Map explicit dependencies: "Task B requires Task A"
- Identify implicit dependencies: shared files, type definitions
- Create dependency graph before execution

#### Rule 4: Parallelization Strategy

- **Independent files**: Always parallel
- **Same file**: Must be sequential
- **Different layers**: Can parallel if no dependencies
- **Translations**: Can always parallel

#### Rule 5: Verification Gates

- Verify after each phase
- Don't proceed if verification fails
- Fix issues before continuing

### Task Complexity Guidelines

#### LOW Complexity (1-3 sub-tasks, ~15-30 min)

- Single file changes
- Simple bug fixes
- Translation additions
- Minor UI tweaks

#### MEDIUM Complexity (4-7 sub-tasks, ~30-90 min)

- New feature in existing system
- Multi-file changes
- Component + logic + translations
- Refactoring multiple files

#### HIGH Complexity (8+ sub-tasks, ~90+ min)

- New major feature
- Architecture changes
- Multiple interdependent components
- Full-stack changes

---

## Parallel Execution Strategy

### M4 Pro Optimization (24GB RAM)

```yaml
Max Parallel Agents: 4
Optimal Configuration:
  - implement: up to 3 instances (most common)
  - verify: 1 instance (aggregates results)
  - test: 1 instance (can run with implement)
  - docs: 1 instance (can run with implement)
  - optimize: 1 instance (rare, replaces implement)
  - creative: 1 instance (rare, runs with implement)
  - numerology-expert: 1 instance (rare, runs with implement)

Memory Allocation:
  - implement: ~2-4GB per instance
  - verify: ~1-2GB
  - test: ~1-2GB
  - docs: ~500MB-1GB
```

### Parallel Execution Patterns

#### Pattern A: Maximum Parallelism (4 agents)

```text
PHASE 2 (Parallel - 4 threads):
  T1: Implement lib/ function → implement
  T2: Create component → implement
  T3: Add translations → implement
  T4: Write tests → test
  → VERIFY
```

#### Pattern B: Balanced (3 agents)

```text
PHASE 2 (Parallel - 3 threads):
  T1: Implement lib/ function → implement
  T2: Create component → implement
  T3: Add translations → implement
  → VERIFY
  T4: Write tests → test (after verify)
```

#### Pattern C: Sequential (when dependencies exist)

```text
PHASE 1 (Sequential):
  T1: Implement lib/ function → implement
  → VERIFY
PHASE 2 (Parallel - 2 threads):
  T2: Create component → implement
  T3: Add translations → implement
  → VERIFY
```

### Conflict Resolution

#### File-Level Conflicts

- Same file edited by multiple agents → Sequential execution
- Different files → Parallel execution
- Related files (imports) → Check dependencies

#### Resource Conflicts

- Multiple verify agents → Use single verify instance
- Memory pressure → Reduce parallel agents to 3
- Build conflicts → Sequential for build-related tasks

---

## Verification Framework

### Verification Checkpoints

After **EACH** phase, run verify agent:

#### Build Verification

- [ ] TypeScript compiles (`npm run build`)
- [ ] ESLint passes (`npm run lint`)
- [ ] No build warnings

#### Architecture Compliance

- [ ] Business logic ONLY in `src/lib/`
- [ ] No React imports in lib/ files
- [ ] Proper layer separation
- [ ] Follows app-truth.md patterns

#### Code Quality

- [ ] No hardcoded strings (all use `t()`)
- [ ] Translations in all 3 languages (RO/EN/RU)
- [ ] No `any` types without justification
- [ ] No `console.log` statements
- [ ] Functions have JSDoc (for lib/)

#### Testing

- [ ] New functions have tests
- [ ] Tests pass (`npm run test:run`)
- [ ] Coverage maintained (for lib/)

#### Integration

- [ ] Components properly integrated
- [ ] Routes work correctly
- [ ] No breaking changes (unless intentional)

### Verification Workflow

```text
PHASE COMPLETE
    │
    ▼
┌──────────────────┐
│  VERIFY AGENT    │
│  (All checks)    │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
 PASS ✓    FAIL ✗
    │         │
    ▼         ▼
NEXT PHASE  FIX ISSUES
or COMPLETE  & RETRY
```

---

## Common Workflow Patterns

### Pattern 1: New Calculation Feature

**Example**: Add karmic lessons calculation

```text
PHASE 1 (Sequential):
  T1: Implement calculateKarmicLessons() in lib/karmic.ts → implement
  T2: Validate numerology rules → numerology-expert
  → VERIFY

PHASE 2 (Parallel - 3 threads):
  T3: Create KarmicLessonsCard component → implement
  T4: Add translations (RO/EN/RU) → implement
  T5: Write unit tests → test
  → VERIFY

PHASE 3 (Integration):
  T6: Integrate into Results page → implement
  → FINAL VERIFY
```

### Pattern 2: New Page/Route

**Example**: Add new "Insights" page

```text
PHASE 1 (Parallel - 2 threads):
  T1: Add translations section → implement
  T2: Create page components → implement
  → VERIFY

PHASE 2 (Sequential):
  T3: Create route component → implement
  T4: Add route to App.tsx → implement
  → FINAL VERIFY
```

### Pattern 3: Bug Fix

**Example**: Fix compatibility calculation for master numbers

```text
PHASE 1 (Sequential):
  T1: Fix bug in calculateCompatibility() → implement
  T2: Add regression test → test
  → VERIFY

PHASE 2 (Verification):
  T3: Run full test suite → verify
  → COMPLETE
```

### Pattern 4: Component Refactor

**Example**: Refactor NumerologyForm component

```text
PHASE 1 (Analysis):
  T1: Review current implementation → verify
  → PLAN

PHASE 2 (Sequential):
  T2: Refactor component → implement
  T3: Update tests → test
  → VERIFY

PHASE 3 (Final):
  T4: Integration check → verify
  → COMPLETE
```

### Pattern 5: Translation Addition

**Example**: Add new UI strings

```text
PHASE 1 (Parallel - 1 thread):
  T1: Add keys to translations.ts (all 3 languages) → implement
  → VERIFY

PHASE 2 (Integration):
  T2: Replace hardcoded strings → implement
  → FINAL VERIFY
```

---

## Agent Selection Guide

### Decision Tree

```text
START: What type of task?
│
├─> NEW FEATURE?
│   ├─> Business logic only? → implement + numerology-expert + test
│   ├─> UI component only? → implement + creative (if UX needed) + test
│   └─> Both? → Phase 1: implement (logic) + numerology-expert
│              Phase 2: implement (UI) + creative + test
│
├─> BUG FIX?
│   ├─> Logic bug? → implement + test + verify
│   ├─> UI bug? → implement + verify
│   └─> Performance bug? → optimize + verify
│
├─> REFACTOR?
│   ├─> Code structure? → implement + verify + test
│   ├─> Performance? → optimize + verify + test
│   └─> Architecture? → implement + verify + docs + test
│
├─> DOCUMENTATION?
│   └─> Always → docs
│
├─> TRANSLATION?
│   └─> Always → implement (can parallel with UI work)
│
└─> PERFORMANCE?
    └─> Always → optimize + verify + test
```

### Agent Selection Rules

1. **implement**: Use for ALL code changes (lib/, components/, pages/)
2. **verify**: Use after EVERY phase, before completion
3. **test**: Use for new features, bug fixes, refactors
4. **docs**: Use for new features, API changes, architecture
5. **numerology-expert**: Use for business logic changes
6. **creative**: Use for UX/UI improvements
7. **optimize**: Use for performance issues

---

## Error Handling & Recovery

### Error Detection

Errors can occur at multiple stages:

- **Analysis**: Unclear requirements, missing context
- **Decomposition**: Circular dependencies, impossible parallelization
- **Execution**: Agent failures, build errors, test failures
- **Verification**: Compliance failures, quality issues

### Error Recovery Workflow

```text
ERROR DETECTED
    │
    ▼
┌──────────────────┐
│  STOP EXECUTION  │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
CRITICAL   NON-CRITICAL
    │         │
    ▼         ▼
REPORT    CONTINUE WITH
& FIX     WARNINGS
```

### Common Error Scenarios

#### Scenario 1: TypeScript Compilation Errors

**Symptoms**: Build fails, type errors

**Recovery**:

1. STOP parallel execution
2. Run `npm run build` to see full error list
3. Fix errors in dependency order (lib → components → pages)
4. Re-run verify agent
5. Resume execution

#### Scenario 2: ESLint Failures

**Symptoms**: Lint errors, style violations

**Recovery**:

1. Check app-truth.md for style rules
2. Run `npm run lint -- --fix` for auto-fixes
3. Manual fixes for remaining issues
4. Re-run verify agent

#### Scenario 3: Missing Translations

**Symptoms**: Hardcoded strings, incomplete translations

**Recovery**:

1. Search for hardcoded strings: `grep -r "['\"].*[A-Z]" src/`
2. Add missing keys to translations.ts (all 3 languages)
3. Replace hardcoded strings with `t('key')`
4. Re-run verify agent

#### Scenario 4: Agent Conflict (Same File)

**Symptoms**: Multiple agents editing same file

**Recovery**:

1. Identify conflicting agents
2. Reorder tasks: sequential for same file
3. Use file-level locking in plan
4. Execute sequentially, then parallelize other tasks

#### Scenario 5: Test Failures

**Symptoms**: Tests fail, coverage drops

**Recovery**:

1. Check if business logic changed
2. Update test expectations
3. Verify test covers edge cases
4. Run `npm run test:run` to confirm
5. Fix tests or implementation as needed

#### Scenario 6: Dependency Violation

**Symptoms**: Import errors, undefined references

**Recovery**:

1. Review dependency graph
2. Fix layer ordering (lib → components → pages)
3. Ensure proper imports
4. Re-run verify agent

---

## Performance Optimization

### Parallelization Opportunities

#### ✅ Always Parallel

- Independent files (different modules)
- Translations (can run with any work)
- Tests (can run parallel with implementation)
- Documentation (can run parallel with code)

#### ❌ Never Parallel

- Same file edits (must be sequential)
- Dependent layers (lib → components → pages)
- Build operations (sequential)

#### ⚠️ Conditional Parallel

- Related files (check imports first)
- Shared types (create types first, then parallel)

### Memory Management (M4 Pro)

#### Optimal Configuration

- Max 4 parallel agents (24GB RAM)
- Prefer 3 implement + 1 verify/docs/test
- Avoid multiple verify agents simultaneously
- Monitor memory if tasks are large (>1000 lines)

#### Memory Allocation

- implement: ~2-4GB per instance
- verify: ~1-2GB
- test: ~1-2GB
- docs: ~500MB-1GB

### Speed Optimization Strategies

1. **Batch Operations**: Add all translations at once
2. **Group File Edits**: Edit related files in same phase
3. **Pre-verify**: Run quick checks before full verify
4. **Skip Redundant**: Don't re-verify unchanged layers
5. **Cache Results**: Reuse verification results when possible

### Performance Metrics

Track:

- **Sequential time**: Time if all tasks run sequentially
- **Parallel time**: Actual execution time
- **Speedup**: Sequential / Parallel ratio
- **Efficiency**: Speedup / Number of agents

---

## Communication Protocols

### Task Delegation Format

When delegating to agents, provide:

```text
TO: [agent-name]
TASK: [clear description]
FILE: [file path(s)]
DEPENDENCIES: [what must be done first]
CONSTRAINTS:
  - [constraint 1]
  - [constraint 2]
SUCCESS CRITERIA:
  - [criterion 1]
  - [criterion 2]
```

### Example Delegation

```text
TO: implement
TASK: Add calculatePersonalYear() function
FILE: src/lib/personalCycles.ts
DEPENDENCIES: None (new function)
CONSTRAINTS:
  - Pure TypeScript, no React
  - Preserve master numbers (11, 22, 33)
  - Add JSDoc comments
  - Follow existing patterns in file
SUCCESS CRITERIA:
  - Function exports correctly
  - Type-safe (no any types)
  - Matches numerology rules from app-truth.md
  - Has unit tests
```

### Progress Reporting

Agents should report:

- **Status**: IN_PROGRESS / COMPLETE / FAILED
- **Progress**: Percentage or step count
- **Blockers**: Any issues preventing completion
- **Time**: Estimated/actual time

---

## Monitoring & Reporting

### Progress Tracking

Track:

- **Phase status**: Current phase, completion %
- **Task status**: Each sub-task status
- **Blockers**: Issues preventing progress
- **Time**: Estimated vs actual time
- **Quality**: Verification results

### Final Report Format

```text
✅ TASK COMPLETE: [description]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 SUMMARY
├── Total sub-tasks: [N]
├── Completed: [N]
├── Failed: [N]
├── Warnings: [N]
└── Time: [X]m (estimated: [Y]m, speedup: Z.Zx)

📁 FILES MODIFIED
├── [file1] (added/modified/deleted)
├── [file2] (added/modified/deleted)
└── ...

✅ VERIFICATION RESULTS
├── TypeScript: PASS ✓ / FAIL ✗
├── ESLint: PASS ✓ / FAIL ✗
├── Tests: PASS ✓ / FAIL ✗ (coverage: X%)
├── Translations: COMPLETE ✓ / INCOMPLETE ✗
└── app-truth.md compliance: PASS ✓ / FAIL ✗

📈 PERFORMANCE
├── Sequential time: ~[X]m
├── Parallel time: ~[Y]m
├── Speedup: [Z.Z]x
└── Efficiency: [W]%

🎯 NEXT STEPS
└── [Any follow-up tasks or recommendations]

⚠️ WARNINGS (if any)
└── [List any warnings or non-critical issues]
```

---

## Reference Examples

### Example 1: New Numerology Feature (Karmic Lessons)

```text
📋 TASK: Add karmic lessons calculation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 ANALYSIS
├── Complexity: MEDIUM
├── Estimated sub-tasks: 6
├── Parallel potential: 60%
├── Layers affected: lib/, components/, translations.ts
└── Risk: Low (isolated feature)

📦 DECOMPOSITION
PHASE 1 (Sequential):
  T1: Implement calculateKarmicLessons() in lib/karmic.ts → implement
  T2: Validate numerology rules → numerology-expert
  → VERIFY

PHASE 2 (Parallel - 3 threads):
  T3: Create KarmicLessonsCard component → implement
  T4: Add translations (RO/EN/RU) → implement
  T5: Write unit tests → test
  → VERIFY

PHASE 3 (Integration):
  T6: Integrate into Results page → implement
  → FINAL VERIFY

📁 FILES TO MODIFY
├── src/lib/karmic.ts (add function)
├── src/components/KarmicLessonsCard.tsx (new)
├── src/lib/translations.ts (add keys)
├── src/lib/__tests__/karmic.test.ts (add tests)
└── src/pages/Index.tsx (integrate component)

⏱️ EXECUTION
├── Sequential time: ~45m
├── Parallel time: ~25m
└── Speedup: 1.8x

✅ RESULTS
├── T1: COMPLETE ✓
├── T2: COMPLETE ✓
├── T3: COMPLETE ✓
├── T4: COMPLETE ✓
├── T5: COMPLETE ✓
├── T6: COMPLETE ✓
└── VERIFICATION: PASSED ✓
```

### Example 2: UI Component Enhancement (Dark Mode)

```text
📋 TASK: Add dark mode toggle to header
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 ANALYSIS
├── Complexity: LOW
├── Estimated sub-tasks: 4
├── Parallel potential: 50%
├── Layers affected: contexts/, components/, translations.ts
└── Risk: Low (UI-only change)

📦 DECOMPOSITION
PHASE 1 (Sequential):
  T1: Create ThemeContext → implement
  → VERIFY

PHASE 2 (Parallel - 2 threads):
  T2: Add toggle button to AppHeader → implement
  T3: Add translations → implement
  → VERIFY

PHASE 3 (Integration):
  T4: Apply theme to root → implement
  → FINAL VERIFY

📁 FILES TO MODIFY
├── src/contexts/ThemeContext.tsx (new)
├── src/components/layout/AppHeader.tsx (modify)
├── src/lib/translations.ts (add keys)
└── src/main.tsx (apply theme)

⏱️ EXECUTION
├── Sequential time: ~20m
├── Parallel time: ~15m
└── Speedup: 1.3x

✅ RESULTS
├── T1: COMPLETE ✓
├── T2: COMPLETE ✓
├── T3: COMPLETE ✓
├── T4: COMPLETE ✓
└── VERIFICATION: PASSED ✓
```

### Example 3: Bug Fix with Tests

```text
📋 TASK: Fix compatibility calculation bug for master numbers
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 ANALYSIS
├── Complexity: LOW
├── Estimated sub-tasks: 3
├── Parallel potential: 33%
├── Layers affected: lib/, tests/
└── Risk: Low (isolated bug)

📦 DECOMPOSITION
PHASE 1 (Sequential):
  T1: Fix bug in calculateCompatibility() → implement
  T2: Add regression test → test
  → VERIFY

PHASE 2 (Verification):
  T3: Run full test suite → verify
  → COMPLETE

📁 FILES TO MODIFY
├── src/lib/compatibility.ts (fix bug)
└── src/lib/__tests__/compatibility.test.ts (add test)

⏱️ EXECUTION
├── Sequential time: ~15m
├── Parallel time: ~12m
└── Speedup: 1.25x

✅ RESULTS
├── T1: COMPLETE ✓
├── T2: COMPLETE ✓
├── T3: COMPLETE ✓
└── VERIFICATION: PASSED ✓
```

---

## Integration Checklist

Before marking any task as complete, verify:

### Build & Quality

- [ ] All TypeScript compiles without errors
- [ ] All ESLint rules pass
- [ ] All tests pass (`npm run test:run`)
- [ ] Test coverage maintained (for lib/)

### Architecture

- [ ] Business logic in lib/ (pure functions)
- [ ] No React imports in lib/ files
- [ ] Proper layer separation
- [ ] Follows app-truth.md patterns

### Internationalization

- [ ] No hardcoded strings (all use `t()`)
- [ ] Translations complete (RO/EN/RU)
- [ ] Translation keys follow naming convention

### UI/UX

- [ ] Components use shadcn/ui where possible
- [ ] Responsive design (mobile-first)
- [ ] Accessibility basics (ARIA labels, keyboard nav)
- [ ] Consistent styling with theme

### Integration Items

- [ ] Components properly integrated
- [ ] Routes work correctly
- [ ] No breaking changes (unless intentional)
- [ ] Backward compatibility maintained

---

## Quick Reference

### Commands

```bash
npm run build         # TypeScript compilation
npm run lint          # ESLint check
npm run test:run      # Run tests once
npm run test:coverage # Coverage report
```

### File Structure

```text
src/
├── lib/           # Business logic (pure TypeScript)
├── components/    # UI components
├── pages/         # Route pages
├── contexts/      # React contexts
├── hooks/         # Custom hooks
└── integrations/  # External integrations
```

### Layer Dependencies

```text
lib/ → components/ → pages/
```

### Translation Pattern

```typescript
const { t } = useLanguage();
// Use: t('section.key')
```

---

**Last Updated**: 2026-01-01
**Version**: 2.0
**Status**: Complete ✓
