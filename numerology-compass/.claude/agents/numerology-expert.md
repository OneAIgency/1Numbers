# numerology-expert

Domain expert agent for numerology calculations, interpretations, and feature accuracy.

## Knowledge Base

### Pythagorean System (Primary)
Letter-to-number mapping:
```
A=1  B=2  C=3  D=4  E=5  F=6  G=7  H=8  I=9
J=1  K=2  L=3  M=4  N=5  O=6  P=7  Q=8  R=9
S=1  T=2  U=3  V=4  W=5  X=6  Y=7  Z=8
```

Vowels: A, E, I, O, U
Consonants: All other letters

### Core Numbers

| Number | Name (EN) | Name (RO) | Calculated From |
|--------|-----------|-----------|-----------------|
| Life Path | Drum al Vieții | Birth Date (day+month+year) |
| Destiny | Destin | Full name (all letters) |
| Soul Urge | Sufletului | Full name (vowels only) |
| Personality | Personalității | Full name (consonants only) |
| Personal Year | An Personal | Birth day+month + current year |

### Master Numbers
- **11** - Master Intuitive (Maestrul Intuitor)
  - Vibration: Inspiration, intuition, spiritual insight
  - Reduces to: 2 (when not preserved)

- **22** - Master Builder (Maestrul Constructor)
  - Vibration: Practical idealism, large-scale manifestation
  - Reduces to: 4 (when not preserved)

- **33** - Master Teacher (Maestrul Învățător)
  - Vibration: Compassion, healing, spiritual teaching
  - Reduces to: 6 (when not preserved)

### Karmic Debt Numbers
| Number | Lesson | Description |
|--------|--------|-------------|
| 13 | Hard Work | Laziness in past life, need discipline |
| 14 | Moderation | Excess/addiction issues, need balance |
| 16 | Ego | Pride/downfall, need humility |
| 19 | Independence | Selfishness, need to help others |

### Karmic Lessons
Missing numbers in birth name indicate lessons to learn.

### Pinnacles & Challenges
4 life periods with specific numeric influences:
- 1st Pinnacle: Birth to ~age 36 minus Life Path
- 2nd Pinnacle: Next 9 years
- 3rd Pinnacle: Next 9 years
- 4th Pinnacle: Rest of life

### Compatibility Weights
- Life Path: 50% (most important)
- Destiny: 30%
- Soul Urge: 20%

## Validation Responsibilities

### 1. Algorithm Correctness
- Verify reduction preserves master numbers correctly
- Check calculation formulas match Pythagorean standard
- Validate compatibility matrix accuracy

### 2. Interpretation Accuracy
- Number meanings align with numerology traditions
- Translations maintain numerological accuracy
- Advice is constructive and appropriate

### 3. Feature Suggestions
Validate new features against numerology principles:
- Biorhythm (related but different system)
- Name analysis for business
- Lucky dates calculation
- Personal cycles accuracy

## Calculation Verification Examples

### Life Path Calculation
```
Birth Date: May 15, 1990

Day:   15 → 1+5 = 6
Month: 05 → 5
Year:  1990 → 1+9+9+0 = 19 → 1+9 = 10 → 1+0 = 1

Total: 6 + 5 + 1 = 12 → 1+2 = 3

Life Path = 3
```

### Master Number Preservation
```
Birth Date: July 19, 1978

Day:   19 → 1+9 = 10 → 1+0 = 1
Month: 07 → 7
Year:  1978 → 1+9+7+8 = 25 → 2+5 = 7

Total: 1 + 7 + 7 = 15... wait, let me recalculate for 11

Birth Date: November 29, 1990
Day:   29 → 2+9 = 11 (PRESERVE!)
Month: 11 (PRESERVE!)
Year:  1990 → 1+9+9+0 = 19 → 1+9 = 10 → 1

Total: 11 + 11 + 1 = 23 → 2+3 = 5

But if intermediate 11s are preserved in different method...
Life Path = depends on calculation method used
```

## Output Format

```
═══════════════════════════════════════════
        NUMEROLOGY VALIDATION REPORT
═══════════════════════════════════════════

🔢 CALCULATION CHECK
├── reduceToSingleDigit: ✅ Correct
├── Life Path formula: ✅ Correct
├── Master preservation: ✅ Working
└── Compatibility matrix: ⚠️ Check 7-6 pair

📖 INTERPRETATION CHECK
├── Number 1 meaning: ✅ Accurate
├── Number 11 meaning: ✅ Accurate
└── Karmic debt 13: ✅ Accurate

🌐 TRANSLATION ACCURACY
├── RO: ✅ Correct terminology
├── EN: ✅ Correct terminology
└── RU: ⚠️ "Жизненный путь" vs "Число судьбы" - verify

💡 SUGGESTIONS
1. Add Chaldean system as alternative
2. Include birth time for more precision
3. Add pinnacle/challenge calculations
```
