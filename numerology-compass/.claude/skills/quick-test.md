# /quick-test

Run quick tests on specific functions or components.

## Usage
```
/quick-test [function-name]
/quick-test [file-path]
```

## Examples
```
/quick-test calculateLifePathNumber
/quick-test src/lib/numerology.ts
/quick-test compatibility
```

## What It Does
1. Identifies the function/file to test
2. Generates or runs existing tests
3. Reports results with coverage

## For Functions Without Tests
Creates and runs ad-hoc tests:
```typescript
// Generated test for calculateLifePathNumber
describe('calculateLifePathNumber', () => {
  it('calculates correctly for known date', () => {
    expect(calculateLifePathNumber(new Date('1990-05-15'))).toBe(3);
  });

  it('preserves master number 11', () => {
    // Generated based on function analysis
  });
});
```

## Output
```
═══════════════════════════════════════════
            QUICK TEST
═══════════════════════════════════════════

🎯 Target: calculateLifePathNumber
📁 File: src/lib/numerology.ts

📊 Test Results:
├── ✅ calculates correctly for 1990-05-15 → 3
├── ✅ calculates correctly for 1985-12-25 → 7
├── ✅ preserves master number 11
├── ✅ preserves master number 22
└── ✅ preserves master number 33

Coverage: 100% (5/5 branches)
Time: 0.8s

✅ ALL TESTS PASSED
```

## On Failure
```
📊 Test Results:
├── ✅ calculates correctly for 1990-05-15 → 3
├── ❌ preserves master number 11
│   └── Expected: 11, Received: 2
└── ...

🔧 Suggested Fix:
Check preserveMaster flag in reduceToSingleDigit call at line 37
```

## Options
```
/quick-test --generate [function]  # Generate test file
/quick-test --coverage [file]      # Show coverage report
/quick-test --watch [file]         # Watch mode
```
