import {
  calculateLifePathNumber,
  calculateDestinyNumber,
  calculateSoulUrgeNumber,
  reduceToSingleDigit
} from "./numerology";
import { getCompatibilityScore, CompatibilityResult } from "./compatibility";

/**
 * Person data for multi-person compatibility analysis
 */
export interface PersonData {
  id: string;
  fullName: string;
  birthDate: Date;
}

/**
 * Pair compatibility result
 */
export interface PairCompatibility {
  person1Id: string;
  person2Id: string;
  compatibility: CompatibilityResult;
}

/**
 * Compare multiple people (3+) and analyze their compatibility.
 * @param people - Array of person data (minimum 3 people)
 * @returns Detailed multi-person comparison
 */
export interface MultiPersonComparison {
  people: PersonData[];
  pairCompatibilities: PairCompatibility[];
  averageCompatibility: number;
  groupHarmony: number;
  strongestPairs: PairCompatibility[];
  weakestPairs: PairCompatibility[];
  recommendations: { ro: string[]; en: string[]; ru: string[] };
}

export const compareMultiplePeople = (
  people: PersonData[]
): MultiPersonComparison => {
  if (people.length < 3) {
    throw new Error("Multi-person comparison requires at least 3 people");
  }
  
  // Calculate compatibility for all pairs
  const pairCompatibilities: PairCompatibility[] = [];
  
  for (let i = 0; i < people.length; i++) {
    for (let j = i + 1; j < people.length; j++) {
      const person1 = people[i];
      const person2 = people[j];
      
      const compatibility = calculatePairCompatibility(person1, person2);
      
      pairCompatibilities.push({
        person1Id: person1.id,
        person2Id: person2.id,
        compatibility
      });
    }
  }
  
  // Calculate average compatibility
  const totalScore = pairCompatibilities.reduce(
    (sum, pair) => sum + pair.compatibility.overallScore,
    0
  );
  const averageCompatibility = Math.round(totalScore / pairCompatibilities.length);
  
  // Calculate group harmony
  const groupHarmony = calculateGroupHarmony(people);
  
  // Sort pairs by compatibility
  const sortedPairs = [...pairCompatibilities].sort(
    (a, b) => b.compatibility.overallScore - a.compatibility.overallScore
  );
  
  const strongestPairs = sortedPairs.slice(0, Math.min(3, sortedPairs.length));
  const weakestPairs = sortedPairs.slice(-Math.min(3, sortedPairs.length));
  
  return {
    people,
    pairCompatibilities,
    averageCompatibility,
    groupHarmony,
    strongestPairs,
    weakestPairs,
    recommendations: getMultiPersonRecommendations(
      averageCompatibility,
      groupHarmony,
      people.length
    )
  };
};

/**
 * Analyze group compatibility (family, team, etc.).
 * @param people - Array of person data
 * @param groupType - Type of group ('family' | 'team' | 'general')
 * @returns Group compatibility analysis
 */
export interface GroupCompatibilityAnalysis {
  groupType: 'family' | 'team' | 'general';
  people: PersonData[];
  groupHarmony: number;
  dominantNumbers: {
    lifePath: number[];
    destiny: number[];
    soulUrge: number[];
  };
  groupEnergy: { ro: string; en: string; ru: string };
  strengths: { ro: string[]; en: string[]; ru: string[] };
  challenges: { ro: string[]; en: string[]; ru: string[] };
  recommendations: { ro: string[]; en: string[]; ru: string[] };
}

export const analyzeGroupCompatibility = (
  people: PersonData[],
  groupType: 'family' | 'team' | 'general' = 'general'
): GroupCompatibilityAnalysis => {
  if (people.length < 2) {
    throw new Error("Group analysis requires at least 2 people");
  }
  
  // Calculate all numbers for each person
  const allLifePaths = people.map(p => calculateLifePathNumber(p.birthDate));
  const allDestinies = people.map(p => calculateDestinyNumber(p.fullName));
  const allSoulUrges = people.map(p => calculateSoulUrgeNumber(p.fullName));
  
  // Find dominant numbers (most frequent)
  const dominantLifePaths = findDominantNumbers(allLifePaths);
  const dominantDestinies = findDominantNumbers(allDestinies);
  const dominantSoulUrges = findDominantNumbers(allSoulUrges);
  
  // Calculate group harmony
  const groupHarmony = calculateGroupHarmony(people);
  
  return {
    groupType,
    people,
    groupHarmony,
    dominantNumbers: {
      lifePath: dominantLifePaths,
      destiny: dominantDestinies,
      soulUrge: dominantSoulUrges
    },
    groupEnergy: getGroupEnergy(dominantLifePaths[0], groupType),
    strengths: getGroupStrengths(dominantLifePaths, dominantDestinies, groupType),
    challenges: getGroupChallenges(dominantLifePaths, groupType),
    recommendations: getGroupRecommendations(groupHarmony, groupType, people.length)
  };
};

/**
 * Calculate group harmony score (0-100).
 * Higher score means better overall harmony in the group.
 * @param people - Array of person data
 * @returns Harmony score
 */
export const calculateGroupHarmony = (people: PersonData[]): number => {
  if (people.length < 2) return 100;
  
  // Calculate compatibility for all pairs
  const pairScores: number[] = [];
  
  for (let i = 0; i < people.length; i++) {
    for (let j = i + 1; j < people.length; j++) {
      const compatibility = calculatePairCompatibility(people[i], people[j]);
      pairScores.push(compatibility.overallScore);
    }
  }
  
  // Group harmony is the average of all pair compatibilities
  const average = pairScores.reduce((sum, score) => sum + score, 0) / pairScores.length;
  
  // Bonus for consistency (lower standard deviation = higher bonus)
  const variance = pairScores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / pairScores.length;
  const stdDev = Math.sqrt(variance);
  const consistencyBonus = Math.max(0, 10 - stdDev / 5);
  
  return Math.min(100, Math.round(average + consistencyBonus));
};

// Helper functions

/**
 * Calculate compatibility for a pair of people.
 */
const calculatePairCompatibility = (
  person1: PersonData,
  person2: PersonData
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
    soulUrgeCompatibility: { score: soulScore, person1: soul1, person2: soul2 }
  };
};

/**
 * Find dominant numbers (most frequent) in an array.
 */
const findDominantNumbers = (numbers: number[]): number[] => {
  const frequencyMap = new Map<number, number>();
  
  for (const num of numbers) {
    const reduced = reduceToSingleDigit(num, false);
    frequencyMap.set(reduced, (frequencyMap.get(reduced) || 0) + 1);
  }
  
  // Sort by frequency
  const sorted = Array.from(frequencyMap.entries())
    .sort((a, b) => b[1] - a[1]);
  
  // Return top 3 most frequent
  return sorted.slice(0, 3).map(([num]) => num);
};

/**
 * Get group energy description.
 */
const getGroupEnergy = (
  dominantLifePath: number,
  groupType: 'family' | 'team' | 'general'
): { ro: string; en: string; ru: string } => {
  const energies: Record<number, { ro: string; en: string; ru: string }> = {
    1: {
      ro: "Energie de leadership și inițiativă",
      en: "Leadership and initiative energy",
      ru: "Энергия лидерства и инициативы"
    },
    2: {
      ro: "Energie de cooperare și armonie",
      en: "Cooperation and harmony energy",
      ru: "Энергия сотрудничества и гармонии"
    },
    3: {
      ro: "Energie creativă și expresivă",
      en: "Creative and expressive energy",
      ru: "Творческая и выразительная энергия"
    },
    4: {
      ro: "Energie de stabilitate și organizare",
      en: "Stability and organization energy",
      ru: "Энергия стабильности и организации"
    },
    5: {
      ro: "Energie dinamică și versatilă",
      en: "Dynamic and versatile energy",
      ru: "Динамичная и универсальная энергия"
    },
    6: {
      ro: "Energie de responsabilitate și grijă",
      en: "Responsibility and care energy",
      ru: "Энергия ответственности и заботы"
    },
    7: {
      ro: "Energie de înțelepciune și analiză",
      en: "Wisdom and analysis energy",
      ru: "Энергия мудрости и анализа"
    },
    8: {
      ro: "Energie de realizare și succes",
      en: "Achievement and success energy",
      ru: "Энергия достижений и успеха"
    },
    9: {
      ro: "Energie de compasiune și serviciu",
      en: "Compassion and service energy",
      ru: "Энергия сострадания и служения"
    }
  };
  
  const baseEnergy = energies[dominantLifePath] || energies[1];
  
  if (groupType === 'family') {
    return {
      ro: `${baseEnergy.ro} - ideală pentru unitate familială`,
      en: `${baseEnergy.en} - ideal for family unity`,
      ru: `${baseEnergy.ru} — идеальна для семейного единства`
    };
  } else if (groupType === 'team') {
    return {
      ro: `${baseEnergy.ro} - favorizează colaborarea în echipă`,
      en: `${baseEnergy.en} - favors team collaboration`,
      ru: `${baseEnergy.ru} — способствует командному сотрудничеству`
    };
  }
  
  return baseEnergy;
};

/**
 * Get group strengths.
 */
const getGroupStrengths = (
  dominantLifePaths: number[],
  dominantDestinies: number[],
  groupType: 'family' | 'team' | 'general'
): { ro: string[]; en: string[]; ru: string[] } => {
  const strengths: string[] = [];
  
  if (dominantLifePaths.length === 1) {
    strengths.push("Căi de viață similare - înțelegere comună");
  }
  
  if (dominantDestinies.length === 1) {
    strengths.push("Talente complementare în grup");
  }
  
  if (groupType === 'family') {
    strengths.push("Legătură familială puternică");
  } else if (groupType === 'team') {
    strengths.push("Colaborare eficientă în echipă");
  }
  
  return {
    ro: strengths.length > 0 ? strengths : ["Grup armonios"],
    en: strengths.length > 0 ? strengths.map(s => s.replace("Căi de viață", "Life paths").replace("Talente", "Talents").replace("Legătură familială", "Family bond").replace("Colaborare", "Collaboration").replace("Grup", "Group")) : ["Harmonious group"],
    ru: strengths.length > 0 ? strengths.map(s => s.replace("Căi de viață", "Жизненные пути").replace("Talente", "Таланты").replace("Legătură familială", "Семейная связь").replace("Colaborare", "Сотрудничество").replace("Grup", "Группа")) : ["Гармоничная группа"]
  };
};

/**
 * Get group challenges.
 */
const getGroupChallenges = (
  dominantLifePaths: number[],
  groupType: 'family' | 'team' | 'general'
): { ro: string[]; en: string[]; ru: string[] } => {
  const challenges: string[] = [];
  
  if (dominantLifePaths.length > 2) {
    challenges.push("Diversitate mare în căi de viață - necesită comunicare");
  }
  
  if (groupType === 'family') {
    challenges.push("Generații diferite pot avea perspective diferite");
  } else if (groupType === 'team') {
    challenges.push("Necesită clarificare roluri și responsabilități");
  }
  
  return {
    ro: challenges.length > 0 ? challenges : ["Provocări minore de gestionat"],
    en: challenges.length > 0 ? challenges.map(c => c.replace("Diversitate", "Diversity").replace("căi de viață", "life paths").replace("Generații", "Generations").replace("perspective", "perspectives").replace("roluri", "roles")) : ["Minor challenges to manage"],
    ru: challenges.length > 0 ? challenges.map(c => c.replace("Diversitate", "Разнообразие").replace("căi de viață", "жизненные пути").replace("Generații", "Поколения").replace("perspective", "перспективы").replace("roluri", "роли")) : ["Небольшие вызовы для управления"]
  };
};

/**
 * Get group recommendations.
 */
const getGroupRecommendations = (
  harmony: number,
  groupType: 'family' | 'team' | 'general',
  groupSize: number
): { ro: string[]; en: string[]; ru: string[] } => {
  const recommendations: string[] = [];
  
  if (harmony >= 80) {
    recommendations.push("Mențineți comunicarea deschisă");
    recommendations.push("Celebrați armonia grupului");
  } else if (harmony >= 60) {
    recommendations.push("Investiți în comunicare și înțelegere");
    recommendations.push("Căutați teren comun");
  } else {
    recommendations.push("Comunicare deschisă este esențială");
    recommendations.push("Considerați activități de team building");
  }
  
  if (groupType === 'family') {
    recommendations.push("Creați tradiții familiale comune");
  } else if (groupType === 'team') {
    recommendations.push("Clarificați obiectivele comune");
  }
  
  return {
    ro: recommendations,
    en: recommendations.map(r => r.replace("Mențineți", "Maintain").replace("Celebrați", "Celebrate").replace("Investiți", "Invest").replace("Căutați", "Seek").replace("Creați", "Create").replace("Clarificați", "Clarify")),
    ru: recommendations.map(r => r.replace("Mențineți", "Поддерживайте").replace("Celebrați", "Празднуйте").replace("Investiți", "Инвестируйте").replace("Căutați", "Ищите").replace("Creați", "Создавайте").replace("Clarificați", "Уточните"))
  };
};

/**
 * Get multi-person recommendations.
 */
const getMultiPersonRecommendations = (
  averageCompatibility: number,
  groupHarmony: number,
  groupSize: number
): { ro: string[]; en: string[]; ru: string[] } => {
  const recommendations: string[] = [];
  
  if (averageCompatibility >= 80 && groupHarmony >= 80) {
    recommendations.push("Grup foarte armonios - mențineți comunicarea");
    recommendations.push("Explorați activități comune care vă unesc");
  } else if (averageCompatibility >= 70) {
    recommendations.push("Compatibilitate bună - investiți în relații");
    recommendations.push("Rezolvați conflictele rapid și constructiv");
  } else {
    recommendations.push("Compatibilitate moderată - comunicare deschisă este esențială");
    recommendations.push("Căutați teren comun și valori comune");
  }
  
  if (groupSize > 5) {
    recommendations.push("Grupuri mari beneficiază de structură și organizare");
  }
  
  return {
    ro: recommendations,
    en: recommendations.map(r => r.replace("Grup", "Group").replace("mențineți", "maintain").replace("Explorați", "Explore").replace("investiți", "invest").replace("Rezolvați", "Resolve").replace("Căutați", "Seek")),
    ru: recommendations.map(r => r.replace("Grup", "Группа").replace("mențineți", "поддерживайте").replace("Explorați", "Исследуйте").replace("investiți", "инвестируйте").replace("Rezolvați", "Решайте").replace("Căutați", "Ищите"))
  };
};

