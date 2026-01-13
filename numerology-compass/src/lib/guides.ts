/**
 * Detailed guides for numerology numbers, calculations, and interpretations
 */

export interface NumberGuide {
  number: number;
  title: string;
  traits: string[];
  description: string;
  strengths: string[];
  challenges: string[];
  career: string[];
  relationships: string;
  advice: string[];
  lifePath?: string;
  destiny?: string;
  soulUrge?: string;
  personality?: string;
  personalYear?: string;
}

export interface CalculationGuide {
  id: string;
  title: string;
  description: string;
  steps: CalculationStep[];
  examples: string[];
  tips: string[];
}

export interface CalculationStep {
  step: number;
  title: string;
  description: string;
  formula?: string;
}

export interface InterpretationGuide {
  id: string;
  title: string;
  description: string;
  sections: InterpretationSection[];
}

export interface InterpretationSection {
  title: string;
  content: string;
  examples?: string[];
}

/**
 * Get detailed guide for a number
 */
export const getNumberGuide = (number: number, language: 'ro' | 'en' | 'ru'): NumberGuide | null => {
  // This would typically come from translations or a database
  // For now, return a basic structure
  return {
    number,
    title: `Number ${number}`,
    traits: [],
    description: '',
    strengths: [],
    challenges: [],
    career: [],
    relationships: '',
    advice: [],
  };
};

/**
 * Get calculation guide
 */
export const getCalculationGuide = (type: 'lifePath' | 'destiny' | 'soulUrge' | 'personality'): CalculationGuide => {
  const guides: Record<string, CalculationGuide> = {
    lifePath: {
      id: 'life-path',
      title: 'Life Path Number Calculation',
      description: 'Learn how to calculate your Life Path Number from your birth date.',
      steps: [
        {
          step: 1,
          title: 'Reduce the Day',
          description: 'Reduce your birth day to a single digit (1-9) or master number (11, 22, 33).',
          formula: 'Day → Reduce to single digit',
        },
        {
          step: 2,
          title: 'Reduce the Month',
          description: 'Reduce your birth month to a single digit (1-9) or master number.',
          formula: 'Month → Reduce to single digit',
        },
        {
          step: 3,
          title: 'Reduce the Year',
          description: 'Add all digits of your birth year and reduce to single digit.',
          formula: 'Year → Sum digits → Reduce',
        },
        {
          step: 4,
          title: 'Add and Reduce',
          description: 'Add the three reduced numbers and reduce the result.',
          formula: 'Day + Month + Year → Reduce',
        },
      ],
      examples: [
        'Birth Date: November 15, 1990\n15 → 1+5 = 6\n11 → Keep (master)\n1990 → 1+9+9+0 = 19 → 1+9 = 10 → 1+0 = 1\nTotal: 6 + 11 + 1 = 18 → 1+8 = 9\nLife Path = 9',
      ],
      tips: [
        'Always reduce day, month, and year separately before adding',
        'Preserve master numbers (11, 22, 33) during reduction',
        'If final sum is a master number, keep it as is',
      ],
    },
    destiny: {
      id: 'destiny',
      title: 'Destiny Number Calculation',
      description: 'Learn how to calculate your Destiny Number from your full birth name.',
      steps: [
        {
          step: 1,
          title: 'Write Full Name',
          description: 'Use your complete birth name as it appears on your birth certificate.',
        },
        {
          step: 2,
          title: 'Assign Values',
          description: 'Assign Pythagorean values (1-9) to each letter.',
          formula: 'A=1, B=2, C=3... I=9, J=1, K=2...',
        },
        {
          step: 3,
          title: 'Calculate Each Name',
          description: 'Add values for each name separately and reduce.',
        },
        {
          step: 4,
          title: 'Sum and Reduce',
          description: 'Add all name values and reduce to final number.',
        },
      ],
      examples: [
        'MARIA ELENA POPESCU\nM=4, A=1, R=9, I=9, A=1 = 24 → 6\nE=5, L=3, E=5, N=5, A=1 = 19 → 10 → 1\nP=7, O=6, P=7, E=5, S=1, C=3, U=3 = 32 → 5\nTotal: 6+1+5 = 12 → 3',
      ],
      tips: [
        'Use your full legal name at birth',
        'Include all names (first, middle, last)',
        'Reduce each name before adding together',
      ],
    },
    soulUrge: {
      id: 'soul-urge',
      title: 'Soul Urge Number Calculation',
      description: 'Learn how to calculate your Soul Urge Number from vowels in your name.',
      steps: [
        {
          step: 1,
          title: 'Identify Vowels',
          description: 'Find all vowels (A, E, I, O, U) in your full birth name.',
        },
        {
          step: 2,
          title: 'Assign Values',
          description: 'Assign Pythagorean values to each vowel.',
        },
        {
          step: 3,
          title: 'Sum and Reduce',
          description: 'Add all vowel values and reduce to final number.',
        },
      ],
      examples: [
        'MARIA ELENA POPESCU\nVowels: A, I, A, E, E, A, O, E, U\nA=1, I=9, A=1, E=5, E=5, A=1, O=6, E=5, U=3\nTotal: 1+9+1+5+5+1+6+5+3 = 36 → 3+6 = 9',
      ],
      tips: [
        'Only count vowels (A, E, I, O, U)',
        'Include vowels from all names',
        'Y is sometimes considered a vowel',
      ],
    },
    personality: {
      id: 'personality',
      title: 'Personality Number Calculation',
      description: 'Learn how to calculate your Personality Number from consonants in your name.',
      steps: [
        {
          step: 1,
          title: 'Identify Consonants',
          description: 'Find all consonants (non-vowels) in your full birth name.',
        },
        {
          step: 2,
          title: 'Assign Values',
          description: 'Assign Pythagorean values to each consonant.',
        },
        {
          step: 3,
          title: 'Sum and Reduce',
          description: 'Add all consonant values and reduce to final number.',
        },
      ],
      examples: [
        'MARIA ELENA POPESCU\nConsonants: M, R, L, N, P, P, S, C\nM=4, R=9, L=3, N=5, P=7, P=7, S=1, C=3\nTotal: 4+9+3+5+7+7+1+3 = 39 → 3+9 = 12 → 3',
      ],
      tips: [
        'Only count consonants (all letters except A, E, I, O, U)',
        'Include consonants from all names',
        'Y is sometimes considered a consonant',
      ],
    },
  };
  
  return guides[type] || guides.lifePath;
};

/**
 * Get interpretation guide
 */
export const getInterpretationGuide = (type: 'lifePath' | 'destiny' | 'soulUrge' | 'personality' | 'compatibility'): InterpretationGuide => {
  const guides: Record<string, InterpretationGuide> = {
    lifePath: {
      id: 'life-path-interpretation',
      title: 'Life Path Number Interpretation',
      description: 'Understanding what your Life Path Number means for your life journey.',
      sections: [
        {
          title: 'Your Life Purpose',
          content: 'The Life Path Number reveals your primary purpose in this lifetime. It shows the main lessons you need to learn and the path you are meant to walk.',
        },
        {
          title: 'Challenges and Opportunities',
          content: 'Each Life Path Number comes with specific challenges and opportunities. Understanding these helps you navigate your life more effectively.',
        },
        {
          title: 'Career Alignment',
          content: 'Your Life Path Number can guide you toward careers that align with your natural talents and life purpose.',
        },
      ],
    },
    compatibility: {
      id: 'compatibility-interpretation',
      title: 'Compatibility Interpretation',
      description: 'Understanding how numerology numbers interact in relationships.',
      sections: [
        {
          title: 'Life Path Compatibility',
          content: 'Life Path Numbers show how two people\'s life purposes align. Compatible numbers support each other\'s growth.',
        },
        {
          title: 'Destiny Compatibility',
          content: 'Destiny Numbers reveal how talents and abilities complement each other in a relationship.',
        },
        {
          title: 'Soul Urge Compatibility',
          content: 'Soul Urge Numbers show if inner desires and motivations are aligned between partners.',
        },
      ],
    },
  };
  
  return guides[type] || guides.lifePath;
};

