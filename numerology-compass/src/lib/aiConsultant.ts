// AI Consultant for Premium Users
// This provides AI-powered numerology consultations

import { Language } from './translations';
import {
  calculateLifePathNumber,
  calculateDestinyNumber,
  calculateSoulUrgeNumber,
  calculatePersonalYearNumber
} from './numerology';

export interface NumerologyQuestion {
  question: string;
  context?: {
    fullName?: string;
    birthDate?: Date;
    currentSituation?: string;
  };
  language: Language;
}

export interface AIResponse {
  answer: string;
  relatedNumbers?: number[];
  suggestions?: string[];
  followUpQuestions?: string[];
}

/**
 * Ask a numerology question to the AI consultant
 * In production, this would integrate with an AI API (OpenAI, Anthropic, etc.)
 */
export const askNumerologyQuestion = async (
  question: NumerologyQuestion
): Promise<AIResponse> => {
  // For now, return a structured response based on numerology calculations
  // In production, this would call an AI API with context

  const context = question.context || {};
  let relatedNumbers: number[] = [];
  let answer = '';

  if (context.birthDate) {
    const lifePath = calculateLifePathNumber(context.birthDate);
    const personalYear = calculatePersonalYearNumber(context.birthDate);
    relatedNumbers = [lifePath, personalYear];

    answer = generateContextualAnswer(question.question, {
      lifePath,
      personalYear,
      language: question.language
    });
  } else {
    answer = generateGeneralAnswer(question.question, question.language);
  }

  return {
    answer,
    relatedNumbers,
    suggestions: generateSuggestions(relatedNumbers, question.language),
    followUpQuestions: generateFollowUpQuestions(question.language)
  };
};

/**
 * Get clarifications on numerology concepts
 */
export const getClarifications = (
  concept: string,
  language: Language
): string => {
  const clarifications: Record<Language, Record<string, string>> = {
    ro: {
      'lifePath': 'Numărul Drumului Vieții este cel mai important număr în numerologie, calculat din data nașterii.',
      'destiny': 'Numărul Destinului arată talentele și abilitățile înnăscute, calculat din numele complet.',
      'soulUrge': 'Numărul Sufletului reprezintă dorințele interioare și motivațiile profunde.',
      'personality': 'Numărul Personalității arată cum te percep alții în lume.',
      'masterNumbers': 'Numerele master (11, 22, 33) sunt puternice și nu se reduc la o singură cifră.',
      'karmicDebt': 'Datoriile karmice (13, 14, 16, 19) indică lecții de viață de învățat.'
    },
    en: {
      'lifePath': 'The Life Path Number is the most important number in numerology, calculated from birth date.',
      'destiny': 'The Destiny Number shows innate talents and abilities, calculated from full name.',
      'soulUrge': 'The Soul Urge Number represents inner desires and deep motivations.',
      'personality': 'The Personality Number shows how others perceive you in the world.',
      'masterNumbers': 'Master numbers (11, 22, 33) are powerful and do not reduce to a single digit.',
      'karmicDebt': 'Karmic debts (13, 14, 16, 19) indicate life lessons to learn.'
    },
    ru: {
      'lifePath': 'Число Жизненного Пути - самое важное число в нумерологии, рассчитывается из даты рождения.',
      'destiny': 'Число Судьбы показывает врожденные таланты и способности, рассчитывается из полного имени.',
      'soulUrge': 'Число Души представляет внутренние желания и глубокие мотивации.',
      'personality': 'Число Личности показывает, как вас воспринимают другие в мире.',
      'masterNumbers': 'Мастер-числа (11, 22, 33) мощные и не сводятся к одной цифре.',
      'karmicDebt': 'Кармические долги (13, 14, 16, 19) указывают на жизненные уроки для изучения.'
    }
  };

  const conceptLower = concept.toLowerCase();
  for (const [key, value] of Object.entries(clarifications[language])) {
    if (conceptLower.includes(key.toLowerCase()) || key.includes(conceptLower)) {
      return value;
    }
  }

  return clarifications[language]['lifePath'] || 'Concept not found';
};

/**
 * Get numerology context for AI integration
 * This provides structured data that can be sent to an AI API
 */
export const getNumerologyContext = (
  fullName: string,
  birthDate: Date
): Record<string, unknown> => {
  const lifePath = calculateLifePathNumber(birthDate);
  const destiny = calculateDestinyNumber(fullName);
  const soulUrge = calculateSoulUrgeNumber(fullName);
  const personalYear = calculatePersonalYearNumber(birthDate);

  return {
    lifePath: {
      number: lifePath,
      description: `Life Path ${lifePath} represents the core purpose and path in life`
    },
    destiny: {
      number: destiny,
      description: `Destiny ${destiny} shows natural talents and abilities`
    },
    soulUrge: {
      number: soulUrge,
      description: `Soul Urge ${soulUrge} reveals inner desires and motivations`
    },
    personalYear: {
      number: personalYear,
      description: `Personal Year ${personalYear} indicates the energy for the current year`
    },
    personalInfo: {
      fullName,
      birthDate: birthDate.toISOString()
    }
  };
};

// Helper functions
function generateContextualAnswer(
  question: string,
  context: { lifePath: number; personalYear: number; language: Language }
): string {
  const answers: Record<Language, Record<number, string>> = {
    ro: {
      1: `Bazat pe Numărul Drumului Vieții ${context.lifePath}, ești un lider natural.`,
      2: `Numărul Drumului Vieții ${context.lifePath} indică o natură diplomatică.`,
      // ... more answers
    },
    en: {
      1: `Based on Life Path Number ${context.lifePath}, you are a natural leader.`,
      2: `Life Path Number ${context.lifePath} indicates a diplomatic nature.`,
      // ... more answers
    },
    ru: {
      1: `Основываясь на Числе Жизненного Пути ${context.lifePath}, вы прирожденный лидер.`,
      2: `Число Жизненного Пути ${context.lifePath} указывает на дипломатическую натуру.`,
      // ... more answers
    }
  };

  return answers[context.language][context.lifePath] || 
         `Based on your Life Path ${context.lifePath} and Personal Year ${context.personalYear}, this is a time of growth.`;
}

function generateGeneralAnswer(question: string, language: Language): string {
  const generalAnswers: Record<Language, string> = {
    ro: 'În numerologie, fiecare număr are o semnificație profundă. Poți oferi mai multe detalii despre întrebarea ta?',
    en: 'In numerology, each number has a deep meaning. Can you provide more details about your question?',
    ru: 'В нумерологии каждое число имеет глубокое значение. Можете предоставить больше деталей о вашем вопросе?'
  };

  return generalAnswers[language];
}

function generateSuggestions(numbers: number[], language: Language): string[] {
  const suggestions: Record<Language, string[]> = {
    ro: [
      'Explorează mai multe despre Numărul Drumului Vieții',
      'Vezi previziunile pentru anul personal',
      'Analizează compatibilitatea cu alte persoane'
    ],
    en: [
      'Explore more about your Life Path Number',
      'See predictions for your personal year',
      'Analyze compatibility with other people'
    ],
    ru: [
      'Изучите больше о Числе Жизненного Пути',
      'Посмотрите предсказания для вашего личного года',
      'Проанализируйте совместимость с другими людьми'
    ]
  };

  return suggestions[language] || [];
}

function generateFollowUpQuestions(language: Language): string[] {
  const questions: Record<Language, string[]> = {
    ro: [
      'Cum pot folosi Numărul Drumului Vieții în viața de zi cu zi?',
      'Ce înseamnă Numărul Destinului pentru cariera mea?',
      'Cum pot îmbunătăți compatibilitatea cu partenerul meu?'
    ],
    en: [
      'How can I use my Life Path Number in daily life?',
      'What does my Destiny Number mean for my career?',
      'How can I improve compatibility with my partner?'
    ],
    ru: [
      'Как я могу использовать Число Жизненного Пути в повседневной жизни?',
      'Что означает Число Судьбы для моей карьеры?',
      'Как я могу улучшить совместимость с моим партнером?'
    ]
  };

  return questions[language] || [];
}

