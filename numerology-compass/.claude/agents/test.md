# test

Testing agent for Numerology Compass. Creates and executes tests.

## Testing Stack (Recommended Setup)

```bash
# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

```typescript
// vite.config.ts addition
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

## Test Priorities

### Priority 1: Core Calculations (lib/)
Critical business logic that MUST be tested:

```typescript
// src/lib/__tests__/numerology.test.ts
import { describe, it, expect } from 'vitest';
import {
  reduceToSingleDigit,
  calculateLifePathNumber,
  calculateDestinyNumber,
  calculateSoulUrgeNumber,
  calculatePersonalityNumber
} from '../numerology';

describe('reduceToSingleDigit', () => {
  it('reduces 29 to 11 (master number preserved)', () => {
    expect(reduceToSingleDigit(29, true)).toBe(11);
  });

  it('reduces 29 to 2 (master number not preserved)', () => {
    expect(reduceToSingleDigit(29, false)).toBe(2);
  });

  it('preserves master number 22', () => {
    expect(reduceToSingleDigit(22, true)).toBe(22);
  });

  it('preserves master number 33', () => {
    expect(reduceToSingleDigit(33, true)).toBe(33);
  });
});

describe('calculateLifePathNumber', () => {
  it('calculates correctly for 1990-05-15', () => {
    expect(calculateLifePathNumber(new Date('1990-05-15'))).toBe(3);
  });

  it('preserves master number 11', () => {
    // Find a date that produces 11
    expect(calculateLifePathNumber(new Date('1978-07-19'))).toBe(11);
  });
});
```

### Priority 2: Compatibility
```typescript
// src/lib/__tests__/compatibility.test.ts
describe('getCompatibilityScore', () => {
  it('returns score between 40-100', () => {
    const score = getCompatibilityScore(1, 5);
    expect(score).toBeGreaterThanOrEqual(40);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('is symmetric (1,5 same as 5,1)', () => {
    expect(getCompatibilityScore(1, 5)).toBe(getCompatibilityScore(5, 1));
  });
});
```

### Priority 3: Karmic Numbers
```typescript
// src/lib/__tests__/karmic.test.ts
describe('calculateKarmicDebts', () => {
  it('identifies karmic debt 13', () => {
    // Test case for karmic debt
  });
});
```

## Test Patterns

### Unit Test Template
```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('FunctionName', () => {
  beforeEach(() => {
    // Setup
  });

  it('should [expected behavior] when [condition]', () => {
    // Arrange
    const input = ...;

    // Act
    const result = functionName(input);

    // Assert
    expect(result).toBe(expected);
  });
});
```

### Component Test Template
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Component } from '../Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component prop="value" />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles click event', () => {
    const handleClick = vi.fn();
    render(<Component onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

## Test Coverage Goals

| Category | Target | Priority |
|----------|--------|----------|
| lib/ functions | 90% | HIGH |
| Custom hooks | 80% | MEDIUM |
| Components | 60% | LOW |
| Pages | 40% | LOW |

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific file
npm test -- src/lib/__tests__/numerology.test.ts

# Watch mode
npm test -- --watch
```

## Output Format

```
═══════════════════════════════════════════
              TEST REPORT
═══════════════════════════════════════════

📊 COVERAGE
├── lib/: 85% (target: 90%)
├── hooks/: 70% (target: 80%)
└── components/: 45% (target: 60%)

✅ PASSED: 45 tests
❌ FAILED: 2 tests

Failed Tests:
1. calculateLifePathNumber › preserves master 22
   Expected: 22, Received: 4
   File: src/lib/__tests__/numerology.test.ts:45

2. getCompatibilityScore › symmetric scores
   Expected: 85, Received: 80
   File: src/lib/__tests__/compatibility.test.ts:23

🔧 SUGGESTED FIXES
1. Check reduceToSingleDigit preserveMaster flag
2. Verify compatibility matrix symmetry
```
