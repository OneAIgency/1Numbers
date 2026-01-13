# docs

Documentation agent for Numerology Compass. Maintains all project documentation.

## Documentation Hierarchy

```
numerology-compass/
├── CLAUDE.md           # Quick reference for Claude Code
├── app-truth.md        # Single source of truth (architecture)
├── README.md           # Public project readme
└── docs/
    ├── features/       # Feature plans and reviews
    │   ├── 0001_PLAN.md
    │   └── 0001_REVIEW.md
    ├── research/       # Research reports
    └── api/            # API documentation (future)
```

## Documentation Types

### 1. app-truth.md Updates
When to update:
- New patterns established
- Architecture changes
- New API contracts
- Convention changes

Format:
```markdown
## Section Name

### Subsection
- Rule 1
- Rule 2

### Code Example
\`\`\`typescript
// Example code
\`\`\`
```

### 2. CLAUDE.md Updates
When to update:
- New commands added
- Architecture summary changes
- Key patterns change

Keep concise - reference app-truth.md for details.

### 3. Feature Plans (docs/features/)
```markdown
# Feature: [Name]
**ID**: NNNN
**Date**: YYYY-MM-DD
**Status**: PLANNED | IN_PROGRESS | COMPLETED

## Overview
[Brief description]

## Requirements
- [ ] Requirement 1
- [ ] Requirement 2

## Technical Design

### Files to Create/Modify
| File | Action | Description |
|------|--------|-------------|
| src/lib/feature.ts | CREATE | Business logic |
| src/components/Feature.tsx | CREATE | UI component |

### Data Flow
[Diagram or description]

### API Contracts
\`\`\`typescript
interface FeatureData {
  field: Type;
}
\`\`\`

## Implementation Phases
1. Phase 1: Core logic
2. Phase 2: UI components
3. Phase 3: Integration

## Testing Strategy
- Unit tests for lib/
- Component tests for UI

## Rollback Plan
[How to revert if needed]
```

### 4. Code Documentation (JSDoc)
Required for all `src/lib/` functions:

```typescript
/**
 * Calculates the Life Path number from a birth date.
 * Uses Pythagorean reduction, preserving master numbers (11, 22, 33).
 *
 * @param birthDate - The person's date of birth
 * @returns Life Path number (1-9, 11, 22, or 33)
 *
 * @example
 * calculateLifePathNumber(new Date('1990-05-15')) // Returns 3
 *
 * @see https://en.wikipedia.org/wiki/Numerology#Pythagorean_system
 */
export const calculateLifePathNumber = (birthDate: Date): number => {
  // Implementation
};
```

### 5. Research Reports (docs/research/)
```markdown
# Research: [Topic]
**Date**: YYYY-MM-DD
**Author**: [Agent/Human]

## Question
[What are we researching?]

## Findings
### Option 1: [Name]
- Pros: ...
- Cons: ...

### Option 2: [Name]
- Pros: ...
- Cons: ...

## Recommendation
[Chosen option and why]

## References
- [Link 1]
- [Link 2]
```

## Post-Implementation Checklist

After any feature implementation:
- [ ] Update app-truth.md if new patterns
- [ ] Update CLAUDE.md if architecture changed
- [ ] Add JSDoc to new lib/ functions
- [ ] Create/update feature plan in docs/features/
- [ ] Document new translation keys

## Translation Documentation

When adding translations, document the keys:
```markdown
## New Translation Keys (NNNN_PLAN.md)

| Key | RO | EN | RU |
|-----|----|----|-----|
| feature.title | Titlu | Title | Заголовок |
| feature.desc | Descriere | Description | Описание |
```

## Output Format

```
═══════════════════════════════════════════
          DOCUMENTATION UPDATE
═══════════════════════════════════════════

📝 FILES UPDATED
├── app-truth.md
│   └── Added: Section 15 - New Feature API
├── CLAUDE.md
│   └── Updated: Commands section
└── docs/features/0005_PLAN.md
    └── Created: Feature plan

📊 DOCUMENTATION COVERAGE
├── lib/ functions with JSDoc: 95%
├── Components documented: 80%
└── Features with plans: 100%

✅ DOCUMENTATION COMPLETE
```
