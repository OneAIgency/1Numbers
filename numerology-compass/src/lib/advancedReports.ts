// Advanced Reports for Premium Users
import {
  calculateLifePathNumber,
  calculateDestinyNumber,
  calculateSoulUrgeNumber,
  calculatePersonalityNumber,
  calculatePersonalYearNumber,
  calculateMaturityNumber,
  calculateBalanceNumber,
  calculateHiddenPassions,
  analyzeLetterDistribution,
  getNumberMeaning
} from './numerology';
import { calculatePinnacles, calculateChallenges, calculateAchievements } from './pinnacles';
import { calculateKarmicDebts, calculateKarmicLessons, calculateKarmicPath } from './karmic';
import { calculateLifeCycles, calculatePeakYears, calculateCurrentLifeStage } from './personalCycles';
import { Language } from './translations';

export interface AdvancedReportData {
  fullName: string;
  birthDate: Date;
  birthTime?: string;
  birthPlace?: string;
  language: Language;
}

export interface ProfessionalInterpretation {
  executiveSummary: string;
  careerGuidance: string;
  relationshipInsights: string;
  healthRecommendations: string;
  spiritualGrowth: string;
  actionItems: string[];
}

export interface CustomReportSection {
  id: string;
  title: string;
  content: string;
  charts?: unknown[];
}

/**
 * Generate comprehensive advanced numerology report
 * Includes all calculations, interpretations, and insights
 */
export const generateAdvancedReport = (data: AdvancedReportData): Record<string, unknown> => {
  const {
    lifePath,
    destiny,
    soulUrge,
    personality,
    personalYear,
    maturity,
    balance,
    hiddenPassions,
    letterDistribution
  } = calculateAllNumbers(data);

  const pinnacles = calculatePinnacles(data.birthDate);
  const challenges = calculateChallenges(data.birthDate);
  const achievements = calculateAchievements(data.birthDate, data.fullName);
  const karmicDebts = calculateKarmicDebts(data.birthDate, data.fullName);
  const karmicLessons = calculateKarmicLessons(data.fullName);
  const karmicPath = calculateKarmicPath(data.birthDate, data.fullName);
  const lifeCycles = calculateLifeCycles(data.birthDate);
  const peakYears = calculatePeakYears(data.birthDate, data.fullName);
  const lifeStage = calculateCurrentLifeStage(data.birthDate);

  return {
    personalInfo: {
      fullName: data.fullName,
      birthDate: data.birthDate,
      birthTime: data.birthTime,
      birthPlace: data.birthPlace
    },
    coreNumbers: {
      lifePath: {
        number: lifePath,
        meaning: getNumberMeaning(lifePath)
      },
      destiny: {
        number: destiny,
        meaning: getNumberMeaning(destiny)
      },
      soulUrge: {
        number: soulUrge,
        meaning: getNumberMeaning(soulUrge)
      },
      personality: {
        number: personality,
        meaning: getNumberMeaning(personality)
      },
      personalYear: {
        number: personalYear,
        meaning: getNumberMeaning(personalYear)
      }
    },
    advancedNumbers: {
      maturity: {
        number: maturity,
        meaning: getNumberMeaning(maturity)
      },
      balance: {
        number: balance,
        meaning: getNumberMeaning(balance)
      },
      hiddenPassions: hiddenPassions.map(p => ({
        number: p,
        meaning: getNumberMeaning(p)
      }))
    },
    nameAnalysis: {
      letterDistribution,
      karmicLessons
    },
    lifePath: {
      pinnacles,
      challenges,
      achievements,
      lifeCycles,
      peakYears,
      currentStage: lifeStage
    },
    karmic: {
      debts: karmicDebts,
      lessons: karmicLessons,
      path: karmicPath
    },
    generatedAt: new Date().toISOString(),
    language: data.language
  };
};

/**
 * Generate professional interpretation with actionable insights
 */
export const generateProfessionalInterpretation = (
  data: AdvancedReportData
): ProfessionalInterpretation => {
  const numbers = calculateAllNumbers(data);
  const lifePath = numbers.lifePath;
  const destiny = numbers.destiny;
  const soulUrge = numbers.soulUrge;
  const personality = numbers.personality;
  const balance = numbers.balance;
  const personalYear = numbers.personalYear;
  const karmicPath = calculateKarmicPath(data.birthDate, data.fullName);

  // Generate interpretations based on number combinations
  const executiveSummary = generateExecutiveSummary(numbers, data.language);
  const careerGuidance = generateCareerGuidance(lifePath, destiny, data.language);
  const relationshipInsights = generateRelationshipInsights(soulUrge, personality, data.language);
  const healthRecommendations = generateHealthRecommendations(lifePath, balance, data.language);
  const spiritualGrowth = generateSpiritualGrowth(lifePath, karmicPath.pathNumber, data.language);
  const actionItems = generateActionItems(numbers, data.language);

  return {
    executiveSummary,
    careerGuidance,
    relationshipInsights,
    healthRecommendations,
    spiritualGrowth,
    actionItems
  };
};

/**
 * Create custom report with selected sections
 */
export const createCustomReport = (
  data: AdvancedReportData,
  sections: string[]
): CustomReportSection[] => {
  const report: CustomReportSection[] = [];
  const numbers = calculateAllNumbers(data);

  if (sections.includes('core')) {
    report.push({
      id: 'core',
      title: 'Core Numbers',
      content: generateCoreNumbersSection(numbers, data.language)
    });
  }

  if (sections.includes('advanced')) {
    report.push({
      id: 'advanced',
      title: 'Advanced Numbers',
      content: generateAdvancedNumbersSection(numbers, data.language)
    });
  }

  if (sections.includes('lifePath')) {
    const pinnacles = calculatePinnacles(data.birthDate);
    report.push({
      id: 'lifePath',
      title: 'Life Path Analysis',
      content: generateLifePathSection(pinnacles, data.language)
    });
  }

  if (sections.includes('karmic')) {
    const karmicDebts = calculateKarmicDebts(data.birthDate, data.fullName);
    const karmicLessons = calculateKarmicLessons(data.fullName);
    report.push({
      id: 'karmic',
      title: 'Karmic Analysis',
      content: generateKarmicSection(karmicDebts, karmicLessons, data.language)
    });
  }

  if (sections.includes('predictions')) {
    report.push({
      id: 'predictions',
      title: 'Predictions & Forecasts',
      content: generatePredictionsSection(numbers.personalYear, data.language)
    });
  }

  return report;
};

// Helper functions
function calculateAllNumbers(data: AdvancedReportData) {
  return {
    lifePath: calculateLifePathNumber(data.birthDate),
    destiny: calculateDestinyNumber(data.fullName),
    soulUrge: calculateSoulUrgeNumber(data.fullName),
    personality: calculatePersonalityNumber(data.fullName),
    personalYear: calculatePersonalYearNumber(data.birthDate),
    maturity: calculateMaturityNumber(data.birthDate, data.fullName),
    balance: calculateBalanceNumber(data.fullName),
    hiddenPassions: calculateHiddenPassions(data.fullName),
    letterDistribution: analyzeLetterDistribution(data.fullName)
  };
}

function generateExecutiveSummary(
  numbers: ReturnType<typeof calculateAllNumbers>,
  language: Language
): string {
  // Generate summary based on core numbers
  const summaries: Record<Language, Record<number, string>> = {
    ro: {
      1: 'Lider natural cu putere de inițiere',
      2: 'Diplomat și colaborator excelent',
      3: 'Creativ și expresiv',
      // ... more summaries
    },
    en: {
      1: 'Natural leader with initiative power',
      2: 'Diplomat and excellent collaborator',
      3: 'Creative and expressive',
      // ... more summaries
    },
    ru: {
      1: 'Природный лидер с силой инициативы',
      2: 'Дипломат и отличный сотрудник',
      3: 'Творческий и выразительный',
      // ... more summaries
    }
  };

  return summaries[language][numbers.lifePath] || '';
}

function generateCareerGuidance(
  lifePath: number,
  destiny: number,
  language: Language
): string {
  // Generate career guidance based on number combinations
  return `Career guidance for Life Path ${lifePath} and Destiny ${destiny}`;
}

function generateRelationshipInsights(
  soulUrge: number,
  personality: number,
  language: Language
): string {
  return `Relationship insights based on Soul Urge ${soulUrge} and Personality ${personality}`;
}

function generateHealthRecommendations(
  lifePath: number,
  balance: number,
  language: Language
): string {
  return `Health recommendations for Life Path ${lifePath}`;
}

function generateSpiritualGrowth(
  lifePath: number,
  karmicPath: number,
  language: Language
): string {
  return `Spiritual growth path for Life Path ${lifePath}`;
}

function generateActionItems(
  numbers: ReturnType<typeof calculateAllNumbers>,
  language: Language
): string[] {
  return [
    `Focus on developing Life Path ${numbers.lifePath} qualities`,
    `Work on balancing Destiny ${numbers.destiny} energies`,
    `Explore Soul Urge ${numbers.soulUrge} inner desires`
  ];
}

function generateCoreNumbersSection(
  numbers: ReturnType<typeof calculateAllNumbers>,
  language: Language
): string {
  return `Core Numbers Analysis:\nLife Path: ${numbers.lifePath}\nDestiny: ${numbers.destiny}`;
}

function generateAdvancedNumbersSection(
  numbers: ReturnType<typeof calculateAllNumbers>,
  language: Language
): string {
  return `Advanced Numbers:\nMaturity: ${numbers.maturity}\nBalance: ${numbers.balance}`;
}

function generateLifePathSection(
  pinnacles: ReturnType<typeof calculatePinnacles>,
  language: Language
): string {
  return `Life Path Analysis with ${pinnacles.length} pinnacles`;
}

function generateKarmicSection(
  debts: ReturnType<typeof calculateKarmicDebts>,
  lessons: ReturnType<typeof calculateKarmicLessons>,
  language: Language
): string {
  return `Karmic Analysis: ${debts.length} debts, ${lessons.length} lessons`;
}

function generatePredictionsSection(
  personalYear: number,
  language: Language
): string {
  return `Predictions for Personal Year ${personalYear}`;
}

