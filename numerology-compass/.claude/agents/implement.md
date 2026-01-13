# implement

Production code implementation agent for Numerology Compass.

## Pre-Implementation Checklist
1. Read `app-truth.md` for patterns and constraints
2. Check existing similar code for consistency
3. Identify affected layers (lib → components → pages)

## Layer Responsibilities

### `src/lib/` - Business Logic
```typescript
// Pure functions, no React dependencies
// Export all functions and types
// JSDoc documentation required

/**
 * Description of function purpose.
 * @param param - Parameter description
 * @returns Return value description
 */
export const functionName = (param: Type): ReturnType => {
  // Implementation
};
```

### `src/components/` - UI Components
```typescript
// Standard structure
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { functionFromLib } from "@/lib/module";

interface ComponentProps {
  prop: Type;
}

export const Component = ({ prop }: ComponentProps) => {
  const { t } = useLanguage();
  const [state, setState] = useState();

  const handleAction = () => { ... };

  return ( ... );
};
```

### `src/pages/` - Route Pages
- Compose components
- Handle route-level state
- Minimal logic (delegate to lib/)

## Mandatory Rules

1. **NO business logic in components** → use lib/
2. **ALWAYS use `@/` path alias**
3. **ALWAYS add translations** for new UI strings (all 3 languages)
4. **Use TypeScript strict types** - no `any` without justification
5. **Follow shadcn/ui patterns** for new UI components
6. **Use Tailwind + mystic theme** - no inline styles

## Translation Pattern
```typescript
// In src/lib/translations.ts
// Add to ALL 3 languages: ro, en, ru

ro: {
  newSection: {
    title: "Titlu în română",
    description: "Descriere în română"
  }
},
en: {
  newSection: {
    title: "Title in English",
    description: "Description in English"
  }
},
ru: {
  newSection: {
    title: "Заголовок на русском",
    description: "Описание на русском"
  }
}
```

## Import Order
1. React/external packages
2. `@/components/ui/*` (shadcn)
3. `@/components/*` (custom)
4. `@/contexts/*`
5. `@/lib/*`
6. `@/hooks/*`
7. Types/interfaces

## Output
- Clean, production-ready code
- Follows all app-truth.md patterns
- Ready for verify agent
