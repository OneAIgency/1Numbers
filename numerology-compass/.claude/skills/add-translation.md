# /add-translation

Helper skill for adding new translation keys to all 3 languages.

## Usage
```
/add-translation [section].[key] "[ro]" "[en]" "[ru]"
```

## Example
```
/add-translation biorhythm.title "Biorhythm" "Biorhythm" "Биоритм"
/add-translation biorhythm.description "Calculează biorhythmul tău" "Calculate your biorhythm" "Рассчитайте ваш биоритм"
```

## What It Does
1. Validates the key format
2. Checks if key already exists
3. Adds to all 3 languages in translations.ts
4. Verifies the file still compiles

## File Modified
`src/lib/translations.ts`

## Output
```
═══════════════════════════════════════════
         TRANSLATION ADDED
═══════════════════════════════════════════

📝 Key: biorhythm.title

🇷🇴 Romanian: "Biorhythm"
🇬🇧 English: "Biorhythm"
🇷🇺 Russian: "Биоритм"

📁 File: src/lib/translations.ts
└── Lines 45, 312, 579 (estimated)

✅ Compilation check: PASSED

Usage in code:
  const { t } = useLanguage();
  <h1>{t.biorhythm.title}</h1>
```

## Batch Mode
```
/add-translation --batch
```
Then provide multiple translations:
```
biorhythm.title: "Biorhythm" | "Biorhythm" | "Биоритм"
biorhythm.physical: "Fizic" | "Physical" | "Физический"
biorhythm.emotional: "Emoțional" | "Emotional" | "Эмоциональный"
biorhythm.intellectual: "Intelectual" | "Intellectual" | "Интеллектуальный"
```

## Validation
- Key must follow pattern: `section.key` or `section.subsection.key`
- All 3 translations required
- No duplicate keys allowed
- Must compile after addition
