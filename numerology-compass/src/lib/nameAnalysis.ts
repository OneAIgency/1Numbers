import { 
  calculateDestinyNumber, 
  calculateSoulUrgeNumber, 
  calculatePersonalityNumber,
  getNumberMeaning 
} from './numerology';

export interface NameAnalysis {
  destinyNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  destinyMeaning: ReturnType<typeof getNumberMeaning>;
  soulUrgeMeaning: ReturnType<typeof getNumberMeaning>;
  personalityMeaning: ReturnType<typeof getNumberMeaning>;
}

export interface NameChangeComparison {
  before: NameAnalysis;
  after: NameAnalysis;
  changes: {
    destiny: { changed: boolean; improvement: number };
    soulUrge: { changed: boolean; improvement: number };
    personality: { changed: boolean; improvement: number };
  };
  overallImpact: 'positive' | 'negative' | 'neutral' | 'mixed';
  summary: {
    ro: string;
    en: string;
    ru: string;
  };
}

export const analyzeNameNumbers = (name: string): NameAnalysis => {
  const destinyNumber = calculateDestinyNumber(name);
  const soulUrgeNumber = calculateSoulUrgeNumber(name);
  const personalityNumber = calculatePersonalityNumber(name);
  
  return {
    destinyNumber,
    soulUrgeNumber,
    personalityNumber,
    destinyMeaning: getNumberMeaning(destinyNumber),
    soulUrgeMeaning: getNumberMeaning(soulUrgeNumber),
    personalityMeaning: getNumberMeaning(personalityNumber)
  };
};

export const compareNameChange = (originalName: string, newName: string): NameChangeComparison => {
  const before = analyzeNameNumbers(originalName);
  const after = analyzeNameNumbers(newName);
  
  const calculateImprovement = (beforeNum: number, afterNum: number): number => {
    // Master numbers are considered more powerful
    const masterBonus = (num: number) => [11, 22, 33].includes(num) ? 2 : 0;
    const beforeScore = beforeNum + masterBonus(beforeNum);
    const afterScore = afterNum + masterBonus(afterNum);
    return afterScore - beforeScore;
  };
  
  const changes = {
    destiny: {
      changed: before.destinyNumber !== after.destinyNumber,
      improvement: calculateImprovement(before.destinyNumber, after.destinyNumber)
    },
    soulUrge: {
      changed: before.soulUrgeNumber !== after.soulUrgeNumber,
      improvement: calculateImprovement(before.soulUrgeNumber, after.soulUrgeNumber)
    },
    personality: {
      changed: before.personalityNumber !== after.personalityNumber,
      improvement: calculateImprovement(before.personalityNumber, after.personalityNumber)
    }
  };
  
  const totalImprovement = changes.destiny.improvement + changes.soulUrge.improvement + changes.personality.improvement;
  const changesCount = [changes.destiny.changed, changes.soulUrge.changed, changes.personality.changed].filter(Boolean).length;
  
  let overallImpact: 'positive' | 'negative' | 'neutral' | 'mixed';
  if (changesCount === 0) {
    overallImpact = 'neutral';
  } else if (totalImprovement > 0) {
    overallImpact = 'positive';
  } else if (totalImprovement < 0) {
    overallImpact = 'negative';
  } else {
    overallImpact = 'mixed';
  }
  
  const summary = {
    ro: changesCount === 0 
      ? "Noul nume păstrează aceleași numere numerologice. Energia rămâne neschimbată."
      : totalImprovement > 0 
        ? `Schimbarea aduce ${changesCount} modificări pozitive. Energia nouă favorizează creșterea și evoluția.`
        : totalImprovement < 0
          ? `Schimbarea aduce ${changesCount} modificări. Unele energii pot necesita ajustări.`
          : `Schimbarea aduce ${changesCount} modificări mixte. Analizează fiecare aspect cu atenție.`,
    en: changesCount === 0 
      ? "The new name maintains the same numerological numbers. Energy remains unchanged."
      : totalImprovement > 0 
        ? `The change brings ${changesCount} positive modifications. New energy favors growth and evolution.`
        : totalImprovement < 0
          ? `The change brings ${changesCount} modifications. Some energies may need adjustments.`
          : `The change brings ${changesCount} mixed modifications. Analyze each aspect carefully.`,
    ru: changesCount === 0 
      ? "Новое имя сохраняет те же нумерологические числа. Энергия остается неизменной."
      : totalImprovement > 0 
        ? `Изменение приносит ${changesCount} положительных модификаций. Новая энергия способствует росту и эволюции.`
        : totalImprovement < 0
          ? `Изменение приносит ${changesCount} модификаций. Некоторые энергии могут потребовать корректировки.`
          : `Изменение приносит ${changesCount} смешанных модификаций. Внимательно проанализируйте каждый аспект.`
  };
  
  return { before, after, changes, overallImpact, summary };
};

// Business Name Analysis
export interface BusinessNameAnalysis {
  name: string;
  destinyNumber: number;
  vibrationalEnergy: 'strong' | 'moderate' | 'weak';
  suitableFor: string[];
  challenges: string[];
  recommendations: string[];
}

const BUSINESS_NUMBER_QUALITIES = {
  1: {
    vibrationalEnergy: 'strong' as const,
    suitableFor: { 
      ro: ['Startups', 'Consulting', 'Tehnologie', 'Inovație'],
      en: ['Startups', 'Consulting', 'Technology', 'Innovation'],
      ru: ['Стартапы', 'Консалтинг', 'Технологии', 'Инновации']
    },
    challenges: {
      ro: ['Poate părea prea agresiv', 'Dificultăți cu parteneriatele'],
      en: ['May seem too aggressive', 'Partnership difficulties'],
      ru: ['Может казаться слишком агрессивным', 'Трудности с партнерствами']
    },
    recommendations: {
      ro: ['Ideal pentru lideri de piață', 'Perfect pentru afaceri independente'],
      en: ['Ideal for market leaders', 'Perfect for independent businesses'],
      ru: ['Идеально для лидеров рынка', 'Отлично для независимого бизнеса']
    }
  },
  2: {
    vibrationalEnergy: 'moderate' as const,
    suitableFor: {
      ro: ['Parteneriate', 'Servicii diplomatice', 'Mediere', 'Consultanță'],
      en: ['Partnerships', 'Diplomatic services', 'Mediation', 'Counseling'],
      ru: ['Партнерства', 'Дипломатические услуги', 'Медиация', 'Консультирование']
    },
    challenges: {
      ro: ['Poate fi perceput ca slab', 'Decizii lente'],
      en: ['May be perceived as weak', 'Slow decisions'],
      ru: ['Может восприниматься как слабый', 'Медленные решения']
    },
    recommendations: {
      ro: ['Excelent pentru colaborări', 'Bun pentru servicii B2B'],
      en: ['Excellent for collaborations', 'Good for B2B services'],
      ru: ['Отлично для сотрудничества', 'Хорошо для B2B услуг']
    }
  },
  3: {
    vibrationalEnergy: 'strong' as const,
    suitableFor: {
      ro: ['Industrii creative', 'Marketing', 'Entertainment', 'Design'],
      en: ['Creative industries', 'Marketing', 'Entertainment', 'Design'],
      ru: ['Креативные индустрии', 'Маркетинг', 'Развлечения', 'Дизайн']
    },
    challenges: {
      ro: ['Risc de superficialitate', 'Lipsa de focus'],
      en: ['Risk of superficiality', 'Lack of focus'],
      ru: ['Риск поверхностности', 'Отсутствие фокуса']
    },
    recommendations: {
      ro: ['Perfect pentru branding creativ', 'Excelent pentru social media'],
      en: ['Perfect for creative branding', 'Excellent for social media'],
      ru: ['Идеально для креативного брендинга', 'Отлично для соцсетей']
    }
  },
  4: {
    vibrationalEnergy: 'moderate' as const,
    suitableFor: {
      ro: ['Construcții', 'Finanțe', 'Imobiliare', 'Producție'],
      en: ['Construction', 'Finance', 'Real Estate', 'Manufacturing'],
      ru: ['Строительство', 'Финансы', 'Недвижимость', 'Производство']
    },
    challenges: {
      ro: ['Poate părea rigid', 'Inovație limitată'],
      en: ['May seem rigid', 'Limited innovation'],
      ru: ['Может казаться жестким', 'Ограниченные инновации']
    },
    recommendations: {
      ro: ['Ideal pentru afaceri tradiționale', 'Bun pentru servicii stabile'],
      en: ['Ideal for traditional businesses', 'Good for stable services'],
      ru: ['Идеально для традиционного бизнеса', 'Хорошо для стабильных услуг']
    }
  },
  5: {
    vibrationalEnergy: 'strong' as const,
    suitableFor: {
      ro: ['Turism', 'Transport', 'Media', 'Retail dinamic'],
      en: ['Tourism', 'Transportation', 'Media', 'Dynamic retail'],
      ru: ['Туризм', 'Транспорт', 'Медиа', 'Динамичный ритейл']
    },
    challenges: {
      ro: ['Instabilitate percepută', 'Schimbări frecvente'],
      en: ['Perceived instability', 'Frequent changes'],
      ru: ['Воспринимаемая нестабильность', 'Частые изменения']
    },
    recommendations: {
      ro: ['Excelent pentru afaceri adaptive', 'Perfect pentru piețe în schimbare'],
      en: ['Excellent for adaptive businesses', 'Perfect for changing markets'],
      ru: ['Отлично для адаптивного бизнеса', 'Идеально для меняющихся рынков']
    }
  },
  6: {
    vibrationalEnergy: 'moderate' as const,
    suitableFor: {
      ro: ['Sănătate', 'Educație', 'Servicii familiale', 'Design interior'],
      en: ['Healthcare', 'Education', 'Family services', 'Interior design'],
      ru: ['Здравоохранение', 'Образование', 'Семейные услуги', 'Дизайн интерьера']
    },
    challenges: {
      ro: ['Poate fi prea protector', 'Focus exagerat pe alții'],
      en: ['May be too protective', 'Excessive focus on others'],
      ru: ['Может быть слишком защитным', 'Чрезмерный фокус на других']
    },
    recommendations: {
      ro: ['Ideal pentru servicii de îngrijire', 'Perfect pentru comunități'],
      en: ['Ideal for care services', 'Perfect for communities'],
      ru: ['Идеально для услуг по уходу', 'Отлично для сообществ']
    }
  },
  7: {
    vibrationalEnergy: 'moderate' as const,
    suitableFor: {
      ro: ['Cercetare', 'Spiritualitate', 'Tehnologie avansată', 'Consultanță'],
      en: ['Research', 'Spirituality', 'Advanced technology', 'Consulting'],
      ru: ['Исследования', 'Духовность', 'Высокие технологии', 'Консалтинг']
    },
    challenges: {
      ro: ['Poate părea distant', 'Comunicare limitată'],
      en: ['May seem distant', 'Limited communication'],
      ru: ['Может казаться отстраненным', 'Ограниченная коммуникация']
    },
    recommendations: {
      ro: ['Excelent pentru nișe specializate', 'Bun pentru experți'],
      en: ['Excellent for specialized niches', 'Good for experts'],
      ru: ['Отлично для специализированных ниш', 'Хорошо для экспертов']
    }
  },
  8: {
    vibrationalEnergy: 'strong' as const,
    suitableFor: {
      ro: ['Finanțe mari', 'Corporații', 'Investiții', 'Imobiliare de lux'],
      en: ['Big finance', 'Corporations', 'Investments', 'Luxury real estate'],
      ru: ['Большие финансы', 'Корпорации', 'Инвестиции', 'Элитная недвижимость']
    },
    challenges: {
      ro: ['Poate părea materialist', 'Presiune mare'],
      en: ['May seem materialistic', 'High pressure'],
      ru: ['Может казаться материалистичным', 'Высокое давление']
    },
    recommendations: {
      ro: ['Ideal pentru afaceri ambițioase', 'Perfect pentru expansiune'],
      en: ['Ideal for ambitious businesses', 'Perfect for expansion'],
      ru: ['Идеально для амбициозного бизнеса', 'Отлично для расширения']
    }
  },
  9: {
    vibrationalEnergy: 'strong' as const,
    suitableFor: {
      ro: ['ONG-uri', 'Arte', 'Servicii globale', 'Educație'],
      en: ['NGOs', 'Arts', 'Global services', 'Education'],
      ru: ['НКО', 'Искусство', 'Глобальные услуги', 'Образование']
    },
    challenges: {
      ro: ['Poate fi prea idealist', 'Profit secundar'],
      en: ['May be too idealistic', 'Secondary profit'],
      ru: ['Может быть слишком идеалистичным', 'Вторичная прибыль']
    },
    recommendations: {
      ro: ['Excelent pentru misiuni sociale', 'Bun pentru impact global'],
      en: ['Excellent for social missions', 'Good for global impact'],
      ru: ['Отлично для социальных миссий', 'Хорошо для глобального влияния']
    }
  },
  11: {
    vibrationalEnergy: 'strong' as const,
    suitableFor: {
      ro: ['Media spirituală', 'Coaching', 'Artă vizionară', 'Inovație'],
      en: ['Spiritual media', 'Coaching', 'Visionary art', 'Innovation'],
      ru: ['Духовные медиа', 'Коучинг', 'Визионерское искусство', 'Инновации']
    },
    challenges: {
      ro: ['Sensibilitate la critică', 'Așteptări înalte'],
      en: ['Sensitivity to criticism', 'High expectations'],
      ru: ['Чувствительность к критике', 'Высокие ожидания']
    },
    recommendations: {
      ro: ['Perfect pentru lideri inspirționali', 'Ideal pentru branduri vizionare'],
      en: ['Perfect for inspirational leaders', 'Ideal for visionary brands'],
      ru: ['Идеально для вдохновляющих лидеров', 'Отлично для визионерских брендов']
    }
  },
  22: {
    vibrationalEnergy: 'strong' as const,
    suitableFor: {
      ro: ['Construcții mari', 'Infrastructură', 'Corporații globale', 'Proiecte ambițioase'],
      en: ['Major construction', 'Infrastructure', 'Global corporations', 'Ambitious projects'],
      ru: ['Крупное строительство', 'Инфраструктура', 'Глобальные корпорации', 'Амбициозные проекты']
    },
    challenges: {
      ro: ['Presiune enormă', 'Așteptări nerealiste'],
      en: ['Enormous pressure', 'Unrealistic expectations'],
      ru: ['Огромное давление', 'Нереалистичные ожидания']
    },
    recommendations: {
      ro: ['Ideal pentru proiecte transformatoare', 'Perfect pentru empire de afaceri'],
      en: ['Ideal for transformative projects', 'Perfect for business empires'],
      ru: ['Идеально для трансформационных проектов', 'Отлично для бизнес-империй']
    }
  },
  33: {
    vibrationalEnergy: 'strong' as const,
    suitableFor: {
      ro: ['Organizații umanitare', 'Educație spirituală', 'Vindecare', 'Servicii comunitare'],
      en: ['Humanitarian organizations', 'Spiritual education', 'Healing', 'Community services'],
      ru: ['Гуманитарные организации', 'Духовное образование', 'Исцеление', 'Общественные услуги']
    },
    challenges: {
      ro: ['Sacrificiu excesiv', 'Responsabilitate imensă'],
      en: ['Excessive sacrifice', 'Immense responsibility'],
      ru: ['Чрезмерная жертвенность', 'Огромная ответственность']
    },
    recommendations: {
      ro: ['Perfect pentru misiuni de vindecare globală', 'Ideal pentru lideri spirituali'],
      en: ['Perfect for global healing missions', 'Ideal for spiritual leaders'],
      ru: ['Идеально для глобальных миссий исцеления', 'Отлично для духовных лидеров']
    }
  }
};

export const analyzeBusinessName = (name: string, language: 'ro' | 'en' | 'ru'): BusinessNameAnalysis => {
  const destinyNumber = calculateDestinyNumber(name);
  const qualities = BUSINESS_NUMBER_QUALITIES[destinyNumber as keyof typeof BUSINESS_NUMBER_QUALITIES] || BUSINESS_NUMBER_QUALITIES[9];
  
  return {
    name,
    destinyNumber,
    vibrationalEnergy: qualities.vibrationalEnergy,
    suitableFor: qualities.suitableFor[language],
    challenges: qualities.challenges[language],
    recommendations: qualities.recommendations[language]
  };
};

// Name Optimizer - suggest variations
export interface NameSuggestion {
  name: string;
  destinyNumber: number;
  improvement: number;
  reason: string;
}

const VOWELS = ['a', 'e', 'i', 'o', 'u', 'y'];
const COMMON_ADDITIONS = ['a', 'e', 'i', 'o', 'n', 's', 'h', 'y'];

export const generateNameSuggestions = (
  originalName: string, 
  targetNumbers: number[],
  language: 'ro' | 'en' | 'ru'
): NameSuggestion[] => {
  const suggestions: NameSuggestion[] = [];
  const originalDestiny = calculateDestinyNumber(originalName);
  
  const reasons = {
    ro: {
      masterNumber: 'Număr Master - energie spirituală intensificată',
      targetMatch: 'Potrivire cu numărul țintă dorit',
      balancedEnergy: 'Energie mai echilibrată'
    },
    en: {
      masterNumber: 'Master Number - intensified spiritual energy',
      targetMatch: 'Match with desired target number',
      balancedEnergy: 'More balanced energy'
    },
    ru: {
      masterNumber: 'Мастер-число - усиленная духовная энергия',
      targetMatch: 'Совпадение с желаемым целевым числом',
      balancedEnergy: 'Более сбалансированная энергия'
    }
  };
  
  // Try adding single letters
  for (const letter of COMMON_ADDITIONS) {
    const newName = originalName + letter;
    const newDestiny = calculateDestinyNumber(newName);
    
    if (targetNumbers.includes(newDestiny) || [11, 22, 33].includes(newDestiny)) {
      suggestions.push({
        name: newName,
        destinyNumber: newDestiny,
        improvement: [11, 22, 33].includes(newDestiny) ? 3 : 1,
        reason: [11, 22, 33].includes(newDestiny) 
          ? reasons[language].masterNumber 
          : reasons[language].targetMatch
      });
    }
  }
  
  // Try double letters at end
  const lastChar = originalName.slice(-1).toLowerCase();
  if (!VOWELS.includes(lastChar)) {
    const doubledName = originalName + lastChar;
    const doubledDestiny = calculateDestinyNumber(doubledName);
    if (targetNumbers.includes(doubledDestiny) || doubledDestiny !== originalDestiny) {
      suggestions.push({
        name: doubledName,
        destinyNumber: doubledDestiny,
        improvement: 1,
        reason: reasons[language].balancedEnergy
      });
    }
  }
  
  // Sort by improvement and remove duplicates
  const unique = suggestions.filter((s, i, arr) => 
    arr.findIndex(x => x.name.toLowerCase() === s.name.toLowerCase()) === i
  );
  
  return unique.sort((a, b) => b.improvement - a.improvement).slice(0, 5);
};

// Extended Name Analysis Functions

/**
 * Analyze each individual letter in the name.
 * @param fullName - Full name at birth
 * @returns Analysis of each letter with its numerological value
 */
export interface LetterAnalysis {
  letter: string;
  position: number;
  value: number;
  isVowel: boolean;
  isConsonant: boolean;
  meaning: { ro: string; en: string; ru: string };
}

export const analyzeIndividualLetters = (fullName: string): LetterAnalysis[] => {
  const PYTHAGOREAN_VALUES: Record<string, number> = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
    J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
    S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
  };
  
  const VOWELS = ['A', 'E', 'I', 'O', 'U'];
  const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  const analysis: LetterAnalysis[] = [];
  
  let position = 1;
  for (const letter of cleanName) {
    const value = PYTHAGOREAN_VALUES[letter] || 0;
    const isVowel = VOWELS.includes(letter);
    const isConsonant = !isVowel && value > 0;
    
    analysis.push({
      letter,
      position: position++,
      value,
      isVowel,
      isConsonant,
      meaning: getLetterMeaning(value, isVowel)
    });
  }
  
  return analysis;
};

/**
 * Analyze vowels separately from the name.
 * @param fullName - Full name at birth
 * @returns Vowel analysis with detailed information
 */
export interface VowelAnalysis {
  vowels: LetterAnalysis[];
  totalValue: number;
  reducedValue: number;
  soulUrgeNumber: number;
  interpretation: { ro: string; en: string; ru: string };
  strengths: { ro: string[]; en: string[]; ru: string[] };
}

export const analyzeVowelsSeparately = (fullName: string): VowelAnalysis => {
  const allLetters = analyzeIndividualLetters(fullName);
  const vowels = allLetters.filter(l => l.isVowel);
  
  const totalValue = vowels.reduce((sum, v) => sum + v.value, 0);
  const reducedValue = calculateDestinyNumber(fullName); // This uses vowels internally
  const soulUrgeNumber = calculateSoulUrgeNumber(fullName);
  
  return {
    vowels,
    totalValue,
    reducedValue,
    soulUrgeNumber,
    interpretation: getVowelInterpretation(soulUrgeNumber, vowels.length),
    strengths: getVowelStrengths(soulUrgeNumber)
  };
};

/**
 * Analyze consonants separately from the name.
 * @param fullName - Full name at birth
 * @returns Consonant analysis with detailed information
 */
export interface ConsonantAnalysis {
  consonants: LetterAnalysis[];
  totalValue: number;
  reducedValue: number;
  personalityNumber: number;
  interpretation: { ro: string; en: string; ru: string };
  characteristics: { ro: string[]; en: string[]; ru: string[] };
}

export const analyzeConsonantsSeparately = (fullName: string): ConsonantAnalysis => {
  const allLetters = analyzeIndividualLetters(fullName);
  const consonants = allLetters.filter(l => l.isConsonant);
  
  const totalValue = consonants.reduce((sum, c) => sum + c.value, 0);
  const reducedValue = calculateDestinyNumber(fullName); // This uses all letters
  const personalityNumber = calculatePersonalityNumber(fullName);
  
  return {
    consonants,
    totalValue,
    reducedValue,
    personalityNumber,
    interpretation: getConsonantInterpretation(personalityNumber, consonants.length),
    characteristics: getConsonantCharacteristics(personalityNumber)
  };
};

/**
 * Find hidden numbers in the name (numbers that appear but aren't the main numbers).
 * @param fullName - Full name at birth
 * @returns Array of hidden numbers with their significance
 */
export interface HiddenNumber {
  number: number;
  frequency: number;
  significance: { ro: string; en: string; ru: string };
  influence: 'strong' | 'moderate' | 'weak';
}

export const findHiddenNumbers = (fullName: string): HiddenNumber[] => {
  const allLetters = analyzeIndividualLetters(fullName);
  const frequencyMap = new Map<number, number>();
  
  // Count frequency of each number
  for (const letter of allLetters) {
    if (letter.value > 0) {
      frequencyMap.set(letter.value, (frequencyMap.get(letter.value) || 0) + 1);
    }
  }
  
  // Get main numbers to exclude
  const destinyNumber = calculateDestinyNumber(fullName);
  const soulUrgeNumber = calculateSoulUrgeNumber(fullName);
  const personalityNumber = calculatePersonalityNumber(fullName);
  const mainNumbers = new Set([destinyNumber, soulUrgeNumber, personalityNumber]);
  
  // Find hidden numbers (appear but aren't main numbers)
  const hiddenNumbers: HiddenNumber[] = [];
  for (const [number, frequency] of frequencyMap.entries()) {
    if (!mainNumbers.has(number)) {
      hiddenNumbers.push({
        number,
        frequency,
        significance: getHiddenNumberSignificance(number, frequency),
        influence: getInfluenceLevel(frequency)
      });
    }
  }
  
  // Sort by frequency (highest first)
  return hiddenNumbers.sort((a, b) => b.frequency - a.frequency);
};

/**
 * Get name optimization suggestions based on desired numbers.
 * @param fullName - Current full name
 * @param targetNumbers - Desired numerological numbers (e.g., [1, 8] for leadership and success)
 * @param language - Language for suggestions
 * @returns Detailed optimization suggestions
 */
export interface NameOptimizationSuggestion {
  currentAnalysis: NameAnalysis;
  targetNumbers: number[];
  suggestions: {
    name: string;
    newAnalysis: NameAnalysis;
    improvements: {
      destiny: { changed: boolean; improvement: number };
      soulUrge: { changed: boolean; improvement: number };
      personality: { changed: boolean; improvement: number };
    };
    overallScore: number;
    reason: { ro: string; en: string; ru: string };
  }[];
  recommendations: { ro: string; en: string; ru: string };
}

export const getNameOptimizationSuggestions = (
  fullName: string,
  targetNumbers: number[],
  language: 'ro' | 'en' | 'ru' = 'ro'
): NameOptimizationSuggestion => {
  const currentAnalysis = analyzeNameNumbers(fullName);
  const baseSuggestions = generateNameSuggestions(fullName, targetNumbers, language);
  
  // Convert to detailed suggestions
  const detailedSuggestions = baseSuggestions.map(suggestion => {
    const newAnalysis = analyzeNameNumbers(suggestion.name);
    
    const improvements = {
      destiny: {
        changed: currentAnalysis.destinyNumber !== newAnalysis.destinyNumber,
        improvement: calculateNumberImprovement(
          currentAnalysis.destinyNumber,
          newAnalysis.destinyNumber,
          targetNumbers
        )
      },
      soulUrge: {
        changed: currentAnalysis.soulUrgeNumber !== newAnalysis.soulUrgeNumber,
        improvement: calculateNumberImprovement(
          currentAnalysis.soulUrgeNumber,
          newAnalysis.soulUrgeNumber,
          targetNumbers
        )
      },
      personality: {
        changed: currentAnalysis.personalityNumber !== newAnalysis.personalityNumber,
        improvement: calculateNumberImprovement(
          currentAnalysis.personalityNumber,
          newAnalysis.personalityNumber,
          targetNumbers
        )
      }
    };
    
    const overallScore = 
      improvements.destiny.improvement +
      improvements.soulUrge.improvement +
      improvements.personality.improvement;
    
    return {
      name: suggestion.name,
      newAnalysis,
      improvements,
      overallScore,
      reason: {
        ro: suggestion.reason,
        en: suggestion.reason.replace('Număr Master', 'Master Number'),
        ru: suggestion.reason.replace('Număr Master', 'Мастер-число')
      }
    };
  });
  
  // Sort by overall score
  const sortedSuggestions = detailedSuggestions.sort((a, b) => b.overallScore - a.overallScore);
  
  return {
    currentAnalysis,
    targetNumbers,
    suggestions: sortedSuggestions,
    recommendations: getOptimizationRecommendations(
      currentAnalysis,
      targetNumbers,
      sortedSuggestions.length > 0 ? sortedSuggestions[0].overallScore : 0,
      language
    )
  };
};

// Helper functions

/**
 * Get letter meaning based on its value.
 */
const getLetterMeaning = (
  value: number,
  isVowel: boolean
): { ro: string; en: string; ru: string } => {
  const meanings: Record<number, { ro: string; en: string; ru: string }> = {
    1: {
      ro: isVowel ? "Vocală de independență și leadership" : "Consoană de inițiativă",
      en: isVowel ? "Vowel of independence and leadership" : "Consonant of initiative",
      ru: isVowel ? "Гласная независимости и лидерства" : "Согласная инициативы"
    },
    2: {
      ro: isVowel ? "Vocală de cooperare" : "Consoană de sensibilitate",
      en: isVowel ? "Vowel of cooperation" : "Consonant of sensitivity",
      ru: isVowel ? "Гласная сотрудничества" : "Согласная чувствительности"
    },
    3: {
      ro: isVowel ? "Vocală de creativitate" : "Consoană de expresie",
      en: isVowel ? "Vowel of creativity" : "Consonant of expression",
      ru: isVowel ? "Гласная творчества" : "Согласная выражения"
    },
    4: {
      ro: isVowel ? "Vocală de stabilitate" : "Consoană de organizare",
      en: isVowel ? "Vowel of stability" : "Consonant of organization",
      ru: isVowel ? "Гласная стабильности" : "Согласная организации"
    },
    5: {
      ro: isVowel ? "Vocală de libertate" : "Consoană de versatilitate",
      en: isVowel ? "Vowel of freedom" : "Consonant of versatility",
      ru: isVowel ? "Гласная свободы" : "Согласная универсальности"
    },
    6: {
      ro: isVowel ? "Vocală de responsabilitate" : "Consoană de armonie",
      en: isVowel ? "Vowel of responsibility" : "Consonant of harmony",
      ru: isVowel ? "Гласная ответственности" : "Согласная гармонии"
    },
    7: {
      ro: isVowel ? "Vocală de înțelepciune" : "Consoană de analiză",
      en: isVowel ? "Vowel of wisdom" : "Consonant of analysis",
      ru: isVowel ? "Гласная мудрости" : "Согласная анализа"
    },
    8: {
      ro: isVowel ? "Vocală de realizare" : "Consoană de putere",
      en: isVowel ? "Vowel of achievement" : "Consonant of power",
      ru: isVowel ? "Гласная достижений" : "Согласная силы"
    },
    9: {
      ro: isVowel ? "Vocală de compasiune" : "Consoană de serviciu",
      en: isVowel ? "Vowel of compassion" : "Consonant of service",
      ru: isVowel ? "Гласная сострадания" : "Согласная служения"
    }
  };
  
  return meanings[value] || {
    ro: "Valoare numerologică",
    en: "Numerological value",
    ru: "Нумерологическое значение"
  };
};

/**
 * Get vowel interpretation.
 */
const getVowelInterpretation = (
  soulUrgeNumber: number,
  vowelCount: number
): { ro: string; en: string; ru: string } => {
  const base = {
    ro: `Numărul Sufletului ${soulUrgeNumber} derivat din ${vowelCount} vocale`,
    en: `Soul Urge Number ${soulUrgeNumber} derived from ${vowelCount} vowels`,
    ru: `Число Души ${soulUrgeNumber}, полученное из ${vowelCount} гласных`
  };
  
  if (vowelCount === 0) {
    return {
      ro: "Nume fără vocale - dorințe interioare ascunse",
      en: "Name without vowels - hidden inner desires",
      ru: "Имя без гласных — скрытые внутренние желания"
    };
  }
  
  return base;
};

/**
 * Get vowel strengths.
 */
const getVowelStrengths = (soulUrgeNumber: number): { ro: string[]; en: string[]; ru: string[] } => {
  const strengths: Record<number, { ro: string[]; en: string[]; ru: string[] }> = {
    1: {
      ro: ["Independență", "Leadership", "Inițiativă"],
      en: ["Independence", "Leadership", "Initiative"],
      ru: ["Независимость", "Лидерство", "Инициатива"]
    },
    2: {
      ro: ["Cooperare", "Diplomație", "Sensibilitate"],
      en: ["Cooperation", "Diplomacy", "Sensitivity"],
      ru: ["Сотрудничество", "Дипломатия", "Чувствительность"]
    },
    3: {
      ro: ["Creativitate", "Expresie", "Bucurie"],
      en: ["Creativity", "Expression", "Joy"],
      ru: ["Творчество", "Выражение", "Радость"]
    }
  };
  
  return strengths[soulUrgeNumber] || {
    ro: ["Energie spirituală"],
    en: ["Spiritual energy"],
    ru: ["Духовная энергия"]
  };
};

/**
 * Get consonant interpretation.
 */
const getConsonantInterpretation = (
  personalityNumber: number,
  consonantCount: number
): { ro: string; en: string; ru: string } => {
  return {
    ro: `Numărul Personalității ${personalityNumber} derivat din ${consonantCount} consoane`,
    en: `Personality Number ${personalityNumber} derived from ${consonantCount} consonants`,
    ru: `Число Личности ${personalityNumber}, полученное из ${consonantCount} согласных`
  };
};

/**
 * Get consonant characteristics.
 */
const getConsonantCharacteristics = (personalityNumber: number): { ro: string[]; en: string[]; ru: string[] } => {
  const characteristics: Record<number, { ro: string[]; en: string[]; ru: string[] }> = {
    1: {
      ro: ["Assertiv", "Direct", "Convingător"],
      en: ["Assertive", "Direct", "Persuasive"],
      ru: ["Напористый", "Прямой", "Убедительный"]
    },
    2: {
      ro: ["Diplomatic", "Sensibil", "Cooperant"],
      en: ["Diplomatic", "Sensitive", "Cooperative"],
      ru: ["Дипломатичный", "Чувствительный", "Сотрудничающий"]
    },
    3: {
      ro: ["Expresiv", "Creativ", "Sociabil"],
      en: ["Expressive", "Creative", "Sociable"],
      ru: ["Выразительный", "Творческий", "Общительный"]
    }
  };
  
  return characteristics[personalityNumber] || {
    ro: ["Caracteristici unice"],
    en: ["Unique characteristics"],
    ru: ["Уникальные характеристики"]
  };
};

/**
 * Get hidden number significance.
 */
const getHiddenNumberSignificance = (
  number: number,
  frequency: number
): { ro: string; en: string; ru: string } => {
  return {
    ro: `Numărul ${number} apare ${frequency} ${frequency === 1 ? 'dată' : 'ori'} în nume - energie ascunsă`,
    en: `Number ${number} appears ${frequency} ${frequency === 1 ? 'time' : 'times'} in name - hidden energy`,
    ru: `Число ${number} встречается ${frequency} ${frequency === 1 ? 'раз' : 'раза'} в имени — скрытая энергия`
  };
};

/**
 * Get influence level based on frequency.
 */
const getInfluenceLevel = (frequency: number): 'strong' | 'moderate' | 'weak' => {
  if (frequency >= 3) return 'strong';
  if (frequency === 2) return 'moderate';
  return 'weak';
};

/**
 * Calculate number improvement score.
 */
const calculateNumberImprovement = (
  current: number,
  newNum: number,
  targetNumbers: number[]
): number => {
  // Perfect match with target
  if (targetNumbers.includes(newNum)) return 10;
  
  // Master number bonus
  if ([11, 22, 33].includes(newNum)) return 8;
  
  // Same as current (no change)
  if (current === newNum) return 0;
  
  // Check if closer to target
  const currentDistance = Math.min(...targetNumbers.map(t => Math.abs(current - t)));
  const newDistance = Math.min(...targetNumbers.map(t => Math.abs(newNum - t)));
  
  if (newDistance < currentDistance) return 5;
  if (newDistance > currentDistance) return -2;
  
  return 1; // Neutral change
};

/**
 * Get optimization recommendations.
 */
const getOptimizationRecommendations = (
  currentAnalysis: NameAnalysis,
  targetNumbers: number[],
  bestScore: number,
  language: 'ro' | 'en' | 'ru'
): { ro: string; en: string; ru: string } => {
  const currentMatches = [
    currentAnalysis.destinyNumber,
    currentAnalysis.soulUrgeNumber,
    currentAnalysis.personalityNumber
  ].filter(n => targetNumbers.includes(n)).length;
  
  if (currentMatches === 3) {
    return {
      ro: "Numele tău este deja optimizat! Toate numerele principale corespund țintelor.",
      en: "Your name is already optimized! All main numbers match targets.",
      ru: "Ваше имя уже оптимизировано! Все основные числа соответствуют целям."
    };
  }
  
  if (bestScore > 15) {
    return {
      ro: "Există sugestii excelente pentru optimizare. Consideră variantele propuse.",
      en: "There are excellent suggestions for optimization. Consider the proposed variants.",
      ru: "Есть отличные предложения по оптимизации. Рассмотрите предложенные варианты."
    };
  }
  
  return {
    ro: "Optimizarea numelui poate aduce beneficii moderate. Analizează fiecare sugestie.",
    en: "Name optimization can bring moderate benefits. Analyze each suggestion.",
    ru: "Оптимизация имени может принести умеренные преимущества. Проанализируйте каждое предложение."
  };
};
