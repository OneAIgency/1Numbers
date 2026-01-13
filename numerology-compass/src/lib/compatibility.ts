import {
  reduceToSingleDigit,
  calculateLifePathNumber,
  calculateDestinyNumber,
  calculateSoulUrgeNumber,
} from "./numerology";

export interface CompatibilityResult {
  overallScore: number;
  lifePathCompatibility: {
    score: number;
    person1: number;
    person2: number;
  };
  destinyCompatibility: {
    score: number;
    person1: number;
    person2: number;
  };
  soulUrgeCompatibility: {
    score: number;
    person1: number;
    person2: number;
  };
}

// Compatibility matrix based on numerology principles
const COMPATIBILITY_MATRIX: Record<number, Record<number, number>> = {
  1: { 1: 70, 2: 60, 3: 90, 4: 55, 5: 85, 6: 65, 7: 75, 8: 80, 9: 85, 11: 80, 22: 75, 33: 70 },
  2: { 1: 60, 2: 85, 3: 75, 4: 90, 5: 50, 6: 95, 7: 70, 8: 80, 9: 75, 11: 95, 22: 85, 33: 90 },
  3: { 1: 90, 2: 75, 3: 80, 4: 45, 5: 95, 6: 90, 7: 60, 8: 55, 9: 95, 11: 85, 22: 60, 33: 95 },
  4: { 1: 55, 2: 90, 3: 45, 4: 75, 5: 40, 6: 85, 7: 80, 8: 95, 9: 50, 11: 70, 22: 95, 33: 75 },
  5: { 1: 85, 2: 50, 3: 95, 4: 40, 5: 70, 6: 55, 7: 90, 8: 60, 9: 80, 11: 75, 22: 55, 33: 70 },
  6: { 1: 65, 2: 95, 3: 90, 4: 85, 5: 55, 6: 85, 7: 50, 8: 75, 9: 95, 11: 90, 22: 85, 33: 98 },
  7: { 1: 75, 2: 70, 3: 60, 4: 80, 5: 90, 6: 50, 7: 90, 8: 65, 9: 70, 11: 95, 22: 80, 33: 85 },
  8: { 1: 80, 2: 80, 3: 55, 4: 95, 5: 60, 6: 75, 7: 65, 8: 75, 9: 60, 11: 70, 22: 95, 33: 70 },
  9: { 1: 85, 2: 75, 3: 95, 4: 50, 5: 80, 6: 95, 7: 70, 8: 60, 9: 80, 11: 90, 22: 75, 33: 98 },
  11: { 1: 80, 2: 95, 3: 85, 4: 70, 5: 75, 6: 90, 7: 95, 8: 70, 9: 90, 11: 90, 22: 95, 33: 98 },
  22: { 1: 75, 2: 85, 3: 60, 4: 95, 5: 55, 6: 85, 7: 80, 8: 95, 9: 75, 11: 95, 22: 85, 33: 95 },
  33: { 1: 70, 2: 90, 3: 95, 4: 75, 5: 70, 6: 98, 7: 85, 8: 70, 9: 98, 11: 98, 22: 95, 33: 95 },
};

export const getCompatibilityScore = (num1: number, num2: number): number => {
  const n1 = reduceToSingleDigit(num1);
  const n2 = reduceToSingleDigit(num2);
  
  // Check for master numbers first
  const key1 = [11, 22, 33].includes(num1) ? num1 : n1;
  const key2 = [11, 22, 33].includes(num2) ? num2 : n2;
  
  return COMPATIBILITY_MATRIX[key1]?.[key2] || COMPATIBILITY_MATRIX[n1]?.[n2] || 50;
};

export const calculateCompatibility = (
  person1: { fullName: string; birthDate: Date },
  person2: { fullName: string; birthDate: Date }
): CompatibilityResult => {
  const lifePath1 = calculateLifePathNumber(person1.birthDate);
  const lifePath2 = calculateLifePathNumber(person2.birthDate);
  const destiny1 = calculateDestinyNumber(person1.fullName);
  const destiny2 = calculateDestinyNumber(person2.fullName);
  const soul1 = calculateSoulUrgeNumber(person1.fullName);
  const soul2 = calculateSoulUrgeNumber(person2.fullName);

  const lifePathScore = getCompatibilityScore(lifePath1, lifePath2);
  const destinyScore = getCompatibilityScore(destiny1, destiny2);
  const soulScore = getCompatibilityScore(soul1, soul2);

  // Weighted average: Life Path 50%, Destiny 30%, Soul 20%
  const overallScore = Math.round(lifePathScore * 0.5 + destinyScore * 0.3 + soulScore * 0.2);

  return {
    overallScore,
    lifePathCompatibility: { score: lifePathScore, person1: lifePath1, person2: lifePath2 },
    destinyCompatibility: { score: destinyScore, person1: destiny1, person2: destiny2 },
    soulUrgeCompatibility: { score: soulScore, person1: soul1, person2: soul2 },
  };
};

export const getCompatibilityLevel = (score: number): "excellent" | "good" | "moderate" | "challenging" => {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 55) return "moderate";
  return "challenging";
};

// Extended Compatibility Functions

/**
 * Relationship type for compatibility analysis
 */
export type RelationshipType = 'romantic' | 'friendship' | 'professional' | 'family';

/**
 * Detailed compatibility result with relationship-specific analysis
 */
export interface DetailedCompatibilityResult extends CompatibilityResult {
  relationshipType: RelationshipType;
  strengths: { ro: string[]; en: string[]; ru: string[] };
  challenges: { ro: string[]; en: string[]; ru: string[] };
  recommendations: { ro: string[]; en: string[]; ru: string[] };
  dynamics: {
    communication: { ro: string; en: string; ru: string };
    emotional: { ro: string; en: string; ru: string };
    practical: { ro: string; en: string; ru: string };
  };
}

/**
 * Calculate romantic compatibility with emphasis on emotional connection.
 * Weights: Life Path 40%, Soul Urge 40%, Destiny 20%
 * @param person1 - First person data
 * @param person2 - Second person data
 * @returns Detailed romantic compatibility analysis
 */
export const calculateRomanticCompatibility = (
  person1: { fullName: string; birthDate: Date },
  person2: { fullName: string; birthDate: Date }
): DetailedCompatibilityResult => {
  const baseResult = calculateCompatibility(person1, person2);
  
  // Romantic compatibility emphasizes Soul Urge (emotional connection) more
  const romanticScore = Math.round(
    baseResult.lifePathCompatibility.score * 0.4 +
    baseResult.soulUrgeCompatibility.score * 0.4 +
    baseResult.destinyCompatibility.score * 0.2
  );
  
  return {
    ...baseResult,
    overallScore: romanticScore,
    relationshipType: 'romantic',
    strengths: getRomanticStrengths(
      baseResult.lifePathCompatibility.person1,
      baseResult.lifePathCompatibility.person2,
      baseResult.soulUrgeCompatibility.person1,
      baseResult.soulUrgeCompatibility.person2
    ),
    challenges: getRomanticChallenges(
      baseResult.lifePathCompatibility.person1,
      baseResult.lifePathCompatibility.person2,
      baseResult.soulUrgeCompatibility.person1,
      baseResult.soulUrgeCompatibility.person2
    ),
    recommendations: getRomanticRecommendations(romanticScore),
    dynamics: analyzeRomanticDynamics(
      baseResult.lifePathCompatibility.person1,
      baseResult.lifePathCompatibility.person2,
      baseResult.soulUrgeCompatibility.person1,
      baseResult.soulUrgeCompatibility.person2
    )
  };
};

/**
 * Calculate friendship compatibility with emphasis on shared values.
 * Weights: Life Path 35%, Destiny 35%, Soul Urge 30%
 * @param person1 - First person data
 * @param person2 - Second person data
 * @returns Detailed friendship compatibility analysis
 */
export const calculateFriendshipCompatibility = (
  person1: { fullName: string; birthDate: Date },
  person2: { fullName: string; birthDate: Date }
): DetailedCompatibilityResult => {
  const baseResult = calculateCompatibility(person1, person2);
  
  // Friendship compatibility balances all aspects
  const friendshipScore = Math.round(
    baseResult.lifePathCompatibility.score * 0.35 +
    baseResult.destinyCompatibility.score * 0.35 +
    baseResult.soulUrgeCompatibility.score * 0.30
  );
  
  return {
    ...baseResult,
    overallScore: friendshipScore,
    relationshipType: 'friendship',
    strengths: getFriendshipStrengths(
      baseResult.lifePathCompatibility.person1,
      baseResult.lifePathCompatibility.person2
    ),
    challenges: getFriendshipChallenges(
      baseResult.lifePathCompatibility.person1,
      baseResult.lifePathCompatibility.person2
    ),
    recommendations: getFriendshipRecommendations(friendshipScore),
    dynamics: analyzeFriendshipDynamics(
      baseResult.lifePathCompatibility.person1,
      baseResult.lifePathCompatibility.person2,
      baseResult.destinyCompatibility.person1,
      baseResult.destinyCompatibility.person2
    )
  };
};

/**
 * Calculate professional/business compatibility with emphasis on shared goals.
 * Weights: Life Path 50%, Destiny 40%, Soul Urge 10%
 * @param person1 - First person data
 * @param person2 - Second person data
 * @returns Detailed professional compatibility analysis
 */
export const calculateProfessionalCompatibility = (
  person1: { fullName: string; birthDate: Date },
  person2: { fullName: string; birthDate: Date }
): DetailedCompatibilityResult => {
  const baseResult = calculateCompatibility(person1, person2);
  
  // Professional compatibility emphasizes Life Path and Destiny (goals and talents)
  const professionalScore = Math.round(
    baseResult.lifePathCompatibility.score * 0.5 +
    baseResult.destinyCompatibility.score * 0.4 +
    baseResult.soulUrgeCompatibility.score * 0.1
  );
  
  return {
    ...baseResult,
    overallScore: professionalScore,
    relationshipType: 'professional',
    strengths: getProfessionalStrengths(
      baseResult.lifePathCompatibility.person1,
      baseResult.lifePathCompatibility.person2,
      baseResult.destinyCompatibility.person1,
      baseResult.destinyCompatibility.person2
    ),
    challenges: getProfessionalChallenges(
      baseResult.lifePathCompatibility.person1,
      baseResult.lifePathCompatibility.person2
    ),
    recommendations: getProfessionalRecommendations(professionalScore),
    dynamics: analyzeProfessionalDynamics(
      baseResult.lifePathCompatibility.person1,
      baseResult.lifePathCompatibility.person2,
      baseResult.destinyCompatibility.person1,
      baseResult.destinyCompatibility.person2
    )
  };
};

/**
 * Calculate family compatibility with emphasis on harmony and support.
 * Weights: Life Path 45%, Soul Urge 35%, Destiny 20%
 * @param person1 - First person data
 * @param person2 - Second person data
 * @returns Detailed family compatibility analysis
 */
export const calculateFamilyCompatibility = (
  person1: { fullName: string; birthDate: Date },
  person2: { fullName: string; birthDate: Date }
): DetailedCompatibilityResult => {
  const baseResult = calculateCompatibility(person1, person2);
  
  // Family compatibility emphasizes Life Path and Soul Urge (harmony and emotional support)
  const familyScore = Math.round(
    baseResult.lifePathCompatibility.score * 0.45 +
    baseResult.soulUrgeCompatibility.score * 0.35 +
    baseResult.destinyCompatibility.score * 0.20
  );
  
  return {
    ...baseResult,
    overallScore: familyScore,
    relationshipType: 'family',
    strengths: getFamilyStrengths(
      baseResult.lifePathCompatibility.person1,
      baseResult.lifePathCompatibility.person2,
      baseResult.soulUrgeCompatibility.person1,
      baseResult.soulUrgeCompatibility.person2
    ),
    challenges: getFamilyChallenges(
      baseResult.lifePathCompatibility.person1,
      baseResult.lifePathCompatibility.person2
    ),
    recommendations: getFamilyRecommendations(familyScore),
    dynamics: analyzeFamilyDynamics(
      baseResult.lifePathCompatibility.person1,
      baseResult.lifePathCompatibility.person2,
      baseResult.soulUrgeCompatibility.person1,
      baseResult.soulUrgeCompatibility.person2
    )
  };
};

/**
 * Analyze relationship dynamics in detail.
 * @param person1 - First person data
 * @param person2 - Second person data
 * @param relationshipType - Type of relationship
 * @returns Detailed dynamics analysis
 */
export const analyzeRelationshipDynamics = (
  person1: { fullName: string; birthDate: Date },
  person2: { fullName: string; birthDate: Date },
  relationshipType: RelationshipType
): DetailedCompatibilityResult['dynamics'] => {
  const lifePath1 = calculateLifePathNumber(person1.birthDate);
  const lifePath2 = calculateLifePathNumber(person2.birthDate);
  const soul1 = calculateSoulUrgeNumber(person1.fullName);
  const soul2 = calculateSoulUrgeNumber(person2.fullName);
  const destiny1 = calculateDestinyNumber(person1.fullName);
  const destiny2 = calculateDestinyNumber(person2.fullName);
  
  switch (relationshipType) {
    case 'romantic':
      return analyzeRomanticDynamics(lifePath1, lifePath2, soul1, soul2);
    case 'friendship':
      return analyzeFriendshipDynamics(lifePath1, lifePath2, destiny1, destiny2);
    case 'professional':
      return analyzeProfessionalDynamics(lifePath1, lifePath2, destiny1, destiny2);
    case 'family':
      return analyzeFamilyDynamics(lifePath1, lifePath2, soul1, soul2);
  }
};

/**
 * Get relationship strengths based on compatibility numbers.
 * @param person1 - First person data
 * @param person2 - Second person data
 * @param relationshipType - Type of relationship
 * @returns Array of strengths
 */
export const getRelationshipStrengths = (
  person1: { fullName: string; birthDate: Date },
  person2: { fullName: string; birthDate: Date },
  relationshipType: RelationshipType
): { ro: string[]; en: string[]; ru: string[] } => {
  const lifePath1 = calculateLifePathNumber(person1.birthDate);
  const lifePath2 = calculateLifePathNumber(person2.birthDate);
  const soul1 = calculateSoulUrgeNumber(person1.fullName);
  const soul2 = calculateSoulUrgeNumber(person2.fullName);
  const destiny1 = calculateDestinyNumber(person1.fullName);
  const destiny2 = calculateDestinyNumber(person2.fullName);
  
  switch (relationshipType) {
    case 'romantic':
      return getRomanticStrengths(lifePath1, lifePath2, soul1, soul2);
    case 'friendship':
      return getFriendshipStrengths(lifePath1, lifePath2);
    case 'professional':
      return getProfessionalStrengths(lifePath1, lifePath2, destiny1, destiny2);
    case 'family':
      return getFamilyStrengths(lifePath1, lifePath2, soul1, soul2);
  }
};

/**
 * Get relationship challenges based on compatibility numbers.
 * @param person1 - First person data
 * @param person2 - Second person data
 * @param relationshipType - Type of relationship
 * @returns Array of challenges
 */
export const getRelationshipChallenges = (
  person1: { fullName: string; birthDate: Date },
  person2: { fullName: string; birthDate: Date },
  relationshipType: RelationshipType
): { ro: string[]; en: string[]; ru: string[] } => {
  const lifePath1 = calculateLifePathNumber(person1.birthDate);
  const lifePath2 = calculateLifePathNumber(person2.birthDate);
  const soul1 = calculateSoulUrgeNumber(person1.fullName);
  const soul2 = calculateSoulUrgeNumber(person2.fullName);
  
  switch (relationshipType) {
    case 'romantic':
      return getRomanticChallenges(lifePath1, lifePath2, soul1, soul2);
    case 'friendship':
      return getFriendshipChallenges(lifePath1, lifePath2);
    case 'professional':
      return getProfessionalChallenges(lifePath1, lifePath2);
    case 'family':
      return getFamilyChallenges(lifePath1, lifePath2);
  }
};

/**
 * Get relationship recommendations for improvement.
 * @param compatibilityScore - Overall compatibility score
 * @param relationshipType - Type of relationship
 * @returns Array of recommendations
 */
export const getRelationshipRecommendations = (
  compatibilityScore: number,
  relationshipType: RelationshipType
): { ro: string[]; en: string[]; ru: string[] } => {
  switch (relationshipType) {
    case 'romantic':
      return getRomanticRecommendations(compatibilityScore);
    case 'friendship':
      return getFriendshipRecommendations(compatibilityScore);
    case 'professional':
      return getProfessionalRecommendations(compatibilityScore);
    case 'family':
      return getFamilyRecommendations(compatibilityScore);
  }
};

// Helper functions for romantic compatibility

const getRomanticStrengths = (
  lifePath1: number,
  lifePath2: number,
  soul1: number,
  soul2: number
): { ro: string[]; en: string[]; ru: string[] } => {
  const strengths: string[] = [];
  
  // Check for complementary numbers
  if (Math.abs(lifePath1 - lifePath2) <= 1) {
    strengths.push("Căi de viață similare - înțelegere profundă");
  }
  
  if (Math.abs(soul1 - soul2) <= 1) {
    strengths.push("Dorințe interioare aliniate - conexiune emoțională puternică");
  }
  
  if ([soul1, soul2].includes(2) || [soul1, soul2].includes(6)) {
    strengths.push("Sensibilitate și grijă reciprocă");
  }
  
  return {
    ro: strengths.length > 0 ? strengths : ["Compatibilitate emoțională solidă"],
    en: strengths.length > 0 ? strengths.map(s => s.replace("Căi de viață", "Life paths").replace("Dorințe interioare", "Inner desires").replace("Sensibilitate", "Sensitivity")) : ["Solid emotional compatibility"],
    ru: strengths.length > 0 ? strengths.map(s => s.replace("Căi de viață", "Жизненные пути").replace("Dorințe interioare", "Внутренние желания").replace("Sensibilitate", "Чувствительность")) : ["Прочная эмоциональная совместимость"]
  };
};

const getRomanticChallenges = (
  lifePath1: number,
  lifePath2: number,
  soul1: number,
  soul2: number
): { ro: string[]; en: string[]; ru: string[] } => {
  const challenges: string[] = [];
  
  if (Math.abs(lifePath1 - lifePath2) > 4) {
    challenges.push("Diferente majore în abordarea vieții - necesită compromisuri");
  }
  
  if (Math.abs(soul1 - soul2) > 4) {
    challenges.push("Dorințe interioare diferite - necesită comunicare deschisă");
  }
  
  if ([lifePath1, lifePath2].includes(1) && [lifePath1, lifePath2].includes(2)) {
    challenges.push("Tensiune între independență și cooperare");
  }
  
  return {
    ro: challenges.length > 0 ? challenges : ["Provocări minore de depășit împreună"],
    en: challenges.length > 0 ? challenges.map(c => c.replace("Diferente majore", "Major differences").replace("Dorințe interioare", "Inner desires").replace("Tensiune", "Tension")) : ["Minor challenges to overcome together"],
    ru: challenges.length > 0 ? challenges.map(c => c.replace("Diferente majore", "Крупные различия").replace("Dorințe interioare", "Внутренние желания").replace("Tensiune", "Напряжение")) : ["Небольшие вызовы, которые нужно преодолеть вместе"]
  };
};

const getRomanticRecommendations = (score: number): { ro: string[]; en: string[]; ru: string[] } => {
  if (score >= 85) {
    return {
      ro: [
        "Mențineți comunicarea deschisă",
        "Celebrați conexiunea voastră profundă",
        "Explorați împreună pasiunile comune"
      ],
      en: [
        "Maintain open communication",
        "Celebrate your deep connection",
        "Explore common passions together"
      ],
      ru: [
        "Поддерживайте открытое общение",
        "Празднуйте вашу глубокую связь",
        "Исследуйте общие страсти вместе"
      ]
    };
  } else if (score >= 70) {
    return {
      ro: [
        "Investiți timp în comunicare",
        "Înțelegeți diferențele ca oportunități de creștere",
        "Creați ritualuri romantice regulate"
      ],
      en: [
        "Invest time in communication",
        "Understand differences as growth opportunities",
        "Create regular romantic rituals"
      ],
      ru: [
        "Инвестируйте время в общение",
        "Понимайте различия как возможности роста",
        "Создавайте регулярные романтические ритуалы"
      ]
    };
  } else {
    return {
      ro: [
        "Comunicare deschisă și onestă este esențială",
        "Căutați teren comun în valori și obiective",
        "Considerați consiliere de cuplu dacă este necesar"
      ],
      en: [
        "Open and honest communication is essential",
        "Seek common ground in values and goals",
        "Consider couple counseling if needed"
      ],
      ru: [
        "Открытое и честное общение необходимо",
        "Ищите общую почву в ценностях и целях",
        "Рассмотрите консультирование пар, если необходимо"
      ]
    };
  }
};

const analyzeRomanticDynamics = (
  lifePath1: number,
  lifePath2: number,
  soul1: number,
  soul2: number
): DetailedCompatibilityResult['dynamics'] => {
  return {
    communication: {
      ro: soul1 === soul2 
        ? "Comunicare emoțională armonioasă - înțelegere intuitivă"
        : "Comunicare care necesită efort pentru înțelegere reciprocă",
      en: soul1 === soul2
        ? "Harmonious emotional communication - intuitive understanding"
        : "Communication requiring effort for mutual understanding",
      ru: soul1 === soul2
        ? "Гармоничное эмоциональное общение — интуитивное понимание"
        : "Общение, требующее усилий для взаимопонимания"
    },
    emotional: {
      ro: Math.abs(soul1 - soul2) <= 2
        ? "Conexiune emoțională profundă și stabilă"
        : "Conexiune emoțională care necesită lucru pentru a se dezvolta",
      en: Math.abs(soul1 - soul2) <= 2
        ? "Deep and stable emotional connection"
        : "Emotional connection requiring work to develop",
      ru: Math.abs(soul1 - soul2) <= 2
        ? "Глубокая и стабильная эмоциональная связь"
        : "Эмоциональная связь, требующая работы для развития"
    },
    practical: {
      ro: Math.abs(lifePath1 - lifePath2) <= 2
        ? "Abordare similară a vieții practice - armonie în decizii"
        : "Abordări diferite - necesită compromisuri și negociere",
      en: Math.abs(lifePath1 - lifePath2) <= 2
        ? "Similar approach to practical life - harmony in decisions"
        : "Different approaches - requires compromises and negotiation",
      ru: Math.abs(lifePath1 - lifePath2) <= 2
        ? "Похожий подход к практической жизни — гармония в решениях"
        : "Разные подходы — требуют компромиссов и переговоров"
    }
  };
};

// Helper functions for friendship compatibility

const getFriendshipStrengths = (
  lifePath1: number,
  lifePath2: number
): { ro: string[]; en: string[]; ru: string[] } => {
  const strengths: string[] = [];
  
  if (lifePath1 === lifePath2) {
    strengths.push("Căi de viață identice - înțelegere profundă");
  }
  
  if (Math.abs(lifePath1 - lifePath2) <= 1) {
    strengths.push("Valori și perspective similare");
  }
  
  return {
    ro: strengths.length > 0 ? strengths : ["Prietenie bazată pe respect reciproc"],
    en: strengths.length > 0 ? strengths.map(s => s.replace("Căi de viață", "Life paths").replace("Valori", "Values")) : ["Friendship based on mutual respect"],
    ru: strengths.length > 0 ? strengths.map(s => s.replace("Căi de viață", "Жизненные пути").replace("Valori", "Ценности")) : ["Дружба, основанная на взаимном уважении"]
  };
};

const getFriendshipChallenges = (
  lifePath1: number,
  lifePath2: number
): { ro: string[]; en: string[]; ru: string[] } => {
  const challenges: string[] = [];
  
  if (Math.abs(lifePath1 - lifePath2) > 5) {
    challenges.push("Perspective foarte diferite - necesită toleranță");
  }
  
  return {
    ro: challenges.length > 0 ? challenges : ["Fără provocări majore"],
    en: challenges.length > 0 ? challenges.map(c => c.replace("Perspective", "Perspectives").replace("toleranță", "tolerance")) : ["No major challenges"],
    ru: challenges.length > 0 ? challenges.map(c => c.replace("Perspective", "Перспективы").replace("toleranță", "терпимость")) : ["Нет серьёзных вызовов"]
  };
};

const getFriendshipRecommendations = (score: number): { ro: string[]; en: string[]; ru: string[] } => {
  return {
    ro: [
      "Mențineți comunicarea deschisă",
      "Respectați diferențele",
      "Creați amintiri împreună"
    ],
    en: [
      "Maintain open communication",
      "Respect differences",
      "Create memories together"
    ],
    ru: [
      "Поддерживайте открытое общение",
      "Уважайте различия",
      "Создавайте воспоминания вместе"
    ]
  };
};

const analyzeFriendshipDynamics = (
  lifePath1: number,
  lifePath2: number,
  destiny1: number,
  destiny2: number
): DetailedCompatibilityResult['dynamics'] => {
  return {
    communication: {
      ro: "Comunicare prietenoasă și deschisă",
      en: "Friendly and open communication",
      ru: "Дружелюбное и открытое общение"
    },
    emotional: {
      ro: "Suport emoțional reciproc",
      en: "Mutual emotional support",
      ru: "Взаимная эмоциональная поддержка"
    },
    practical: {
      ro: "Colaborare eficientă în activități comune",
      en: "Efficient collaboration in common activities",
      ru: "Эффективное сотрудничество в общих делах"
    }
  };
};

// Helper functions for professional compatibility

const getProfessionalStrengths = (
  lifePath1: number,
  lifePath2: number,
  destiny1: number,
  destiny2: number
): { ro: string[]; en: string[]; ru: string[] } => {
  const strengths: string[] = [];
  
  if ([lifePath1, lifePath2].includes(1) || [lifePath1, lifePath2].includes(8)) {
    strengths.push("Leadership și ambiție pentru succes");
  }
  
  if ([destiny1, destiny2].includes(4) || [destiny1, destiny2].includes(8)) {
    strengths.push("Talente complementare pentru afaceri");
  }
  
  return {
    ro: strengths.length > 0 ? strengths : ["Colaborare profesională solidă"],
    en: strengths.length > 0 ? strengths.map(s => s.replace("Leadership", "Leadership").replace("Talente", "Talents")) : ["Solid professional collaboration"],
    ru: strengths.length > 0 ? strengths.map(s => s.replace("Leadership", "Лидерство").replace("Talente", "Таланты")) : ["Прочное профессиональное сотрудничество"]
  };
};

const getProfessionalChallenges = (
  lifePath1: number,
  lifePath2: number
): { ro: string[]; en: string[]; ru: string[] } => {
  const challenges: string[] = [];
  
  if ([lifePath1, lifePath2].includes(1) && [lifePath1, lifePath2].includes(1)) {
    challenges.push("Ambele persoane vor leadership - necesită clarificare roluri");
  }
  
  return {
    ro: challenges.length > 0 ? challenges : ["Provocări minore de management"],
    en: challenges.length > 0 ? challenges.map(c => c.replace("Ambele", "Both").replace("leadership", "leadership").replace("roluri", "roles")) : ["Minor management challenges"],
    ru: challenges.length > 0 ? challenges.map(c => c.replace("Ambele", "Оба").replace("leadership", "лидерство").replace("roluri", "роли")) : ["Небольшие управленческие вызовы"]
  };
};

const getProfessionalRecommendations = (score: number): { ro: string[]; en: string[]; ru: string[] } => {
  return {
    ro: [
      "Clarificați rolurile și responsabilitățile",
      "Comunicați obiectivele și așteptările",
      "Construiți încredere prin rezultate"
    ],
    en: [
      "Clarify roles and responsibilities",
      "Communicate goals and expectations",
      "Build trust through results"
    ],
    ru: [
      "Уточните роли и обязанности",
      "Общайтесь о целях и ожиданиях",
      "Стройте доверие через результаты"
    ]
  };
};

const analyzeProfessionalDynamics = (
  lifePath1: number,
  lifePath2: number,
  destiny1: number,
  destiny2: number
): DetailedCompatibilityResult['dynamics'] => {
  return {
    communication: {
      ro: "Comunicare profesională eficientă",
      en: "Efficient professional communication",
      ru: "Эффективное профессиональное общение"
    },
    emotional: {
      ro: "Respect profesional reciproc",
      en: "Mutual professional respect",
      ru: "Взаимное профессиональное уважение"
    },
    practical: {
      ro: "Colaborare orientată spre rezultate",
      en: "Results-oriented collaboration",
      ru: "Ориентированное на результаты сотрудничество"
    }
  };
};

// Helper functions for family compatibility

const getFamilyStrengths = (
  lifePath1: number,
  lifePath2: number,
  soul1: number,
  soul2: number
): { ro: string[]; en: string[]; ru: string[] } => {
  const strengths: string[] = [];
  
  if ([soul1, soul2].includes(6)) {
    strengths.push("Grijă și responsabilitate pentru familie");
  }
  
  if (Math.abs(lifePath1 - lifePath2) <= 2) {
    strengths.push("Valori familiale similare");
  }
  
  return {
    ro: strengths.length > 0 ? strengths : ["Legătură familială puternică"],
    en: strengths.length > 0 ? strengths.map(s => s.replace("Grijă", "Care").replace("Valori", "Values")) : ["Strong family bond"],
    ru: strengths.length > 0 ? strengths.map(s => s.replace("Grijă", "Забота").replace("Valori", "Ценности")) : ["Прочная семейная связь"]
  };
};

const getFamilyChallenges = (
  lifePath1: number,
  lifePath2: number
): { ro: string[]; en: string[]; ru: string[] } => {
  const challenges: string[] = [];
  
  if (Math.abs(lifePath1 - lifePath2) > 4) {
    challenges.push("Generații cu valori diferite - necesită înțelegere");
  }
  
  return {
    ro: challenges.length > 0 ? challenges : ["Provocări normale în familie"],
    en: challenges.length > 0 ? challenges.map(c => c.replace("Generații", "Generations").replace("valori", "values")) : ["Normal family challenges"],
    ru: challenges.length > 0 ? challenges.map(c => c.replace("Generații", "Поколения").replace("valori", "ценности")) : ["Обычные семейные вызовы"]
  };
};

const getFamilyRecommendations = (score: number): { ro: string[]; en: string[]; ru: string[] } => {
  return {
    ro: [
      "Mențineți comunicarea deschisă în familie",
      "Respectați diferențele de generație",
      "Creați tradiții familiale comune"
    ],
    en: [
      "Maintain open communication in family",
      "Respect generational differences",
      "Create common family traditions"
    ],
    ru: [
      "Поддерживайте открытое общение в семье",
      "Уважайте различия поколений",
      "Создавайте общие семейные традиции"
    ]
  };
};

const analyzeFamilyDynamics = (
  lifePath1: number,
  lifePath2: number,
  soul1: number,
  soul2: number
): DetailedCompatibilityResult['dynamics'] => {
  return {
    communication: {
      ro: "Comunicare familială bazată pe respect și înțelegere",
      en: "Family communication based on respect and understanding",
      ru: "Семейное общение, основанное на уважении и понимании"
    },
    emotional: {
      ro: "Suport emoțional și legătură profundă",
      en: "Emotional support and deep bond",
      ru: "Эмоциональная поддержка и глубокая связь"
    },
    practical: {
      ro: "Colaborare în responsabilitățile familiale",
      en: "Collaboration in family responsibilities",
      ru: "Сотрудничество в семейных обязанностях"
    }
  };
};
