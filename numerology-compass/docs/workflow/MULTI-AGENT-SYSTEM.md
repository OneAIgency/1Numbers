# Multi-Agent Development System

## Overview

This project uses a multi-agent orchestration system optimized for **Mac Mini M4 Pro (24GB RAM)** with parallel execution capabilities.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER REQUEST                             │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ORCHESTRATOR AGENT                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  • Analyze task                                          │   │
│  │  • Read app-truth.md constraints                         │   │
│  │  • Decompose into sub-tasks                              │   │
│  │  • Identify dependencies & parallelism                   │   │
│  │  • Create execution plan                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   IMPLEMENT     │ │   IMPLEMENT     │ │   IMPLEMENT     │
│   (Thread 1)    │ │   (Thread 2)    │ │   (Thread 3)    │
│                 │ │                 │ │                 │
│   lib/logic.ts  │ │  Component.tsx  │ │  translations   │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       VERIFY AGENT                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  • TypeScript compilation                                │   │
│  │  • ESLint validation                                     │   │
│  │  • Pattern compliance (app-truth.md)                     │   │
│  │  • Translation completeness                              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
       ┌──────────┐                   ┌──────────────┐
       │   PASS   │                   │     FAIL     │
       └────┬─────┘                   └──────┬───────┘
            │                                │
            ▼                                ▼
    ┌───────────────┐                ┌───────────────┐
    │   DOCS AGENT  │                │  FIX & RETRY  │
    │  Update docs  │                │               │
    └───────────────┘                └───────────────┘
```

---

## Available Agents

| Agent | Purpose | Can Run Parallel |
|-------|---------|------------------|
| **orchestrator** | Master coordinator, task decomposition | NO (controls) |
| **implement** | Write production code | YES (multi-instance) |
| **verify** | Validate against app-truth.md | YES |
| **test** | Create and run tests | YES |
| **docs** | Update documentation | YES |
| **numerology-expert** | Domain validation | YES |
| **creative** | UX/feature innovation | YES |
| **optimize** | Performance improvements | YES |

---

## Available Skills (Commands)

| Skill | Command | Purpose |
|-------|---------|---------|
| Build Check | `/build-check` | Quick TypeScript + ESLint check |
| New Feature | `/new-feature [desc]` | Full feature workflow |
| Add Translation | `/add-translation` | Add i18n keys |
| Quick Test | `/quick-test [func]` | Test specific function |
| Analyze | `/analyze [area]` | Deep code analysis |

---

## Parallel Execution Strategy

### M4 Pro Optimization
- **Max Parallel Agents**: 4 (optimal for 24GB RAM)
- **Thread Allocation**:
  - implement: up to 3 instances
  - verify: 1 instance (aggregates results)
  - docs: 1 instance
  - test: 1 instance

### Execution Phases
1. **Sequential Phase**: Tasks with dependencies
2. **Parallel Phase**: Independent tasks (max 4 threads)
3. **Verification Phase**: After each parallel batch
4. **Integration Phase**: Final assembly
5. **Documentation Phase**: Update docs

---

## Standard Workflow

### 1. Feature Implementation
```
User: "Add biorhythm calculator"
         │
         ▼
┌─ ORCHESTRATOR ─────────────────────────┐
│  Decompose:                            │
│  T1: lib/biorhythm.ts (logic)          │
│  T2: translations                      │
│  T3: BiorhythmChart.tsx                │
│  T4: BiorhythmResults.tsx              │
│  T5: Integration in Tools.tsx          │
│                                        │
│  Dependencies: T3,T4,T5 depend on T1   │
│  Parallel: T2,T3,T4 after T1           │
└────────────────────────────────────────┘
         │
         ▼
┌─ PHASE 1 (Sequential) ─────────────────┐
│  implement → T1: lib/biorhythm.ts      │
│  verify → Check T1                     │
└────────────────────────────────────────┘
         │
         ▼
┌─ PHASE 2 (Parallel - 3 threads) ───────┐
│  implement → T2 ─┐                     │
│  implement → T3 ─┼→ verify all         │
│  implement → T4 ─┘                     │
└────────────────────────────────────────┘
         │
         ▼
┌─ PHASE 3 (Integration) ────────────────┐
│  implement → T5                        │
│  verify → Final check                  │
└────────────────────────────────────────┘
         │
         ▼
┌─ PHASE 4 (Documentation) ──────────────┐
│  docs → Update app-truth.md            │
│  docs → Update CLAUDE.md               │
└────────────────────────────────────────┘
```

### 2. Bug Fix
```
User: "Fix compatibility calculation bug"
         │
         ▼
┌─ ORCHESTRATOR ─────────────────────────┐
│  Analyze: Single file, isolated fix    │
│  No parallelism needed                 │
└────────────────────────────────────────┘
         │
         ▼
┌─ SEQUENTIAL ───────────────────────────┐
│  implement → Fix in compatibility.ts   │
│  verify → Check compilation            │
│  test → Run existing tests             │
│  docs → Update if needed               │
└────────────────────────────────────────┘
```

### 3. Optimization
```
User: "Optimize bundle size"
         │
         ▼
┌─ ORCHESTRATOR ─────────────────────────┐
│  Delegate to: optimize agent           │
└────────────────────────────────────────┘
         │
         ▼
┌─ OPTIMIZE AGENT ───────────────────────┐
│  1. Analyze current bundle             │
│  2. Identify opportunities             │
│  3. Propose changes                    │
│  4. Implement (via implement agent)    │
│  5. Verify improvement                 │
└────────────────────────────────────────┘
```

---

## Quality Gates

### After Every Implementation
- [ ] TypeScript compiles (`npm run build`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Translations complete (all 3 languages)
- [ ] Follows app-truth.md patterns
- [ ] No console.log statements
- [ ] No hardcoded strings

### Before Merge/Commit
- [ ] All verification passes
- [ ] Documentation updated
- [ ] Tests pass (when available)

---

## File Organization

```
numerology-compass/
├── .claude/
│   ├── agents/              # 8 agent definitions
│   │   ├── orchestrator.md  # Master coordinator
│   │   ├── implement.md     # Code implementation
│   │   ├── verify.md        # Verification
│   │   ├── test.md          # Testing
│   │   ├── docs.md          # Documentation
│   │   ├── numerology-expert.md
│   │   ├── creative.md
│   │   └── optimize.md
│   └── skills/              # 5 command skills
│       ├── build-check.md
│       ├── new-feature.md
│       ├── add-translation.md
│       ├── quick-test.md
│       └── analyze.md
├── app-truth.md             # Single source of truth
├── CLAUDE.md                # Quick reference
└── docs/
    └── workflow/            # This documentation
```

---

## Troubleshooting

### Agent Not Found
Ensure `.claude/agents/` exists and contains the agent `.md` file.

### Verification Failing
1. Run `/build-check` for quick diagnosis
2. Check specific error in output
3. Use verify agent for detailed report

### Parallel Execution Issues
Reduce parallel threads if memory pressure:
- Edit orchestrator.md `Max Parallel Agents`
- Or run sequentially for complex tasks

---

## Best Practices

1. **Always start with orchestrator** for complex tasks
2. **Use /build-check** frequently during development
3. **Add translations immediately** when adding UI text
4. **Verify after each phase**, not just at the end
5. **Update documentation** as part of workflow, not afterthought
