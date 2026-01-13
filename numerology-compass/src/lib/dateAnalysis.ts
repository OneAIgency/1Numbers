import { 
  calculatePersonalYearNumber,
  calculatePersonalDayNumber,
  calculatePersonalMonthNumber,
  calculateUniversalDay,
  calculateUniversalYear,
  calculateUniversalMonth
} from "./personalCycles";
import { reduceToSingleDigit, calculateLifePathNumber } from "./numerology";

/**
 * Analyze a wedding date numerologically.
 * @param weddingDate - Wedding date
 * @param person1BirthDate - First person's birth date
 * @param person2BirthDate - Second person's birth date (optional)
 * @returns Wedding date analysis
 */
export interface WeddingDateAnalysis {
  weddingDate: Date;
  personalYear1: number;
  personalYear2: number | null;
  personalDay1: number;
  personalDay2: number | null;
  universalDay: number;
  universalYear: number;
  compatibility: number | null;
  recommendation: { ro: string; en: string; ru: string };
  meaning: { ro: string; en: string; ru: string };
}

export const analyzeWeddingDate = (
  weddingDate: Date,
  person1BirthDate: Date,
  person2BirthDate?: Date
): WeddingDateAnalysis => {
  const personalYear1 = calculatePersonalYearNumber(person1BirthDate, weddingDate.getFullYear());
  const personalYear2 = person2BirthDate 
    ? calculatePersonalYearNumber(person2BirthDate, weddingDate.getFullYear())
    : null;
  
  const personalDay1 = calculatePersonalDayNumber(person1BirthDate, weddingDate);
  const personalDay2 = person2BirthDate
    ? calculatePersonalDayNumber(person2BirthDate, weddingDate)
    : null;
  
  const universalDay = calculateUniversalDay(weddingDate);
  const universalYear = calculateUniversalYear(weddingDate.getFullYear());
  
  // Calculate compatibility if both people provided
  const compatibility = person2BirthDate && personalYear2 !== null
    ? calculateDateCompatibility(personalYear1, personalYear2, personalDay1, personalDay2!)
    : null;
  
  return {
    weddingDate,
    personalYear1,
    personalYear2,
    personalDay1,
    personalDay2,
    universalDay,
    universalYear,
    compatibility,
    recommendation: getWeddingRecommendation(personalYear1, personalDay1, universalDay, compatibility),
    meaning: getWeddingMeaning(personalYear1, personalDay1, universalDay)
  };
};

/**
 * Analyze a business launch date numerologically.
 * @param launchDate - Business launch date
 * @param ownerBirthDate - Business owner's birth date
 * @returns Business launch date analysis
 */
export interface BusinessLaunchAnalysis {
  launchDate: Date;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  universalYear: number;
  universalMonth: number;
  universalDay: number;
  businessVibration: number;
  successPotential: { ro: string; en: string; ru: string };
  recommendation: { ro: string; en: string; ru: string };
  challenges: { ro: string[]; en: string[]; ru: string[] };
  opportunities: { ro: string[]; en: string[]; ru: string[] };
}

export const analyzeBusinessLaunchDate = (
  launchDate: Date,
  ownerBirthDate: Date
): BusinessLaunchAnalysis => {
  const year = launchDate.getFullYear();
  const month = launchDate.getMonth() + 1;
  
  const personalYear = calculatePersonalYearNumber(ownerBirthDate, year);
  const personalMonth = calculatePersonalMonthNumber(ownerBirthDate, year, month);
  const personalDay = calculatePersonalDayNumber(ownerBirthDate, launchDate);
  
  const universalYear = calculateUniversalYear(year);
  const universalMonth = calculateUniversalMonth(year, month);
  const universalDay = calculateUniversalDay(launchDate);
  
  // Business vibration combines personal year and universal year
  const businessVibration = reduceToSingleDigit(personalYear + universalYear, true);
  
  return {
    launchDate,
    personalYear,
    personalMonth,
    personalDay,
    universalYear,
    universalMonth,
    universalDay,
    businessVibration,
    successPotential: getBusinessSuccessPotential(businessVibration, personalYear),
    recommendation: getBusinessRecommendation(businessVibration, personalYear, personalDay),
    challenges: getBusinessChallenges(personalYear, universalYear),
    opportunities: getBusinessOpportunities(personalYear, universalYear)
  };
};

/**
 * Analyze a moving date numerologically.
 * @param movingDate - Moving date
 * @param personBirthDate - Person's birth date
 * @param newAddress - New address (optional, for compatibility check)
 * @returns Moving date analysis
 */
export interface MovingDateAnalysis {
  movingDate: Date;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  universalDay: number;
  transitionEnergy: { ro: string; en: string; ru: string };
  recommendation: { ro: string; en: string; ru: string };
  favorable: boolean;
}

export const analyzeMovingDate = (
  movingDate: Date,
  personBirthDate: Date,
  newAddress?: string
): MovingDateAnalysis => {
  const year = movingDate.getFullYear();
  const month = movingDate.getMonth() + 1;
  
  const personalYear = calculatePersonalYearNumber(personBirthDate, year);
  const personalMonth = calculatePersonalMonthNumber(personBirthDate, year, month);
  const personalDay = calculatePersonalDayNumber(personBirthDate, movingDate);
  const universalDay = calculateUniversalDay(movingDate);
  
  // Favorable dates for moving: 1 (new beginnings), 3 (creativity), 5 (change), 8 (material success)
  const favorableNumbers = [1, 3, 5, 8];
  const favorable = favorableNumbers.includes(personalDay) || favorableNumbers.includes(universalDay);
  
  return {
    movingDate,
    personalYear,
    personalMonth,
    personalDay,
    universalDay,
    transitionEnergy: getTransitionEnergy(personalYear, personalDay),
    recommendation: getMovingRecommendation(personalYear, personalDay, universalDay, favorable),
    favorable
  };
};

/**
 * Get optimal date range for important events.
 * @param eventType - Type of event
 * @param startDate - Start date for search
 * @param endDate - End date for search
 * @param personBirthDate - Person's birth date
 * @returns Array of optimal dates sorted by favorability
 */
export type EventType = 'wedding' | 'business' | 'moving' | 'general';

export interface OptimalDate {
  date: Date;
  personalYear: number;
  personalDay: number;
  universalDay: number;
  favorabilityScore: number;
  reason: { ro: string; en: string; ru: string };
}

export const getOptimalDateRange = (
  eventType: EventType,
  startDate: Date,
  endDate: Date,
  personBirthDate: Date
): OptimalDate[] => {
  const optimalDates: OptimalDate[] = [];
  const currentDate = new Date(startDate);
  
  // Define favorable numbers for each event type
  const favorableNumbers: Record<EventType, number[]> = {
    wedding: [2, 6, 9], // Cooperation, harmony, completion
    business: [1, 4, 8], // Leadership, stability, success
    moving: [1, 3, 5, 8], // New beginnings, change, success
    general: [1, 3, 5, 7, 8, 9] // Various favorable numbers
  };
  
  const favorable = favorableNumbers[eventType];
  
  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    
    const personalYear = calculatePersonalYearNumber(personBirthDate, year);
    const personalDay = calculatePersonalDayNumber(personBirthDate, currentDate);
    const universalDay = calculateUniversalDay(currentDate);
    
    // Calculate favorability score
    let score = 0;
    if (favorable.includes(personalDay)) score += 30;
    if (favorable.includes(universalDay)) score += 20;
    if (favorable.includes(personalYear)) score += 10;
    
    // Bonus for master numbers
    if ([11, 22, 33].includes(personalDay)) score += 15;
    if ([11, 22, 33].includes(universalDay)) score += 10;
    
    // Bonus for same numbers (harmony)
    if (personalDay === universalDay) score += 20;
    
    if (score > 0) {
      optimalDates.push({
        date: new Date(currentDate),
        personalYear,
        personalDay,
        universalDay,
        favorabilityScore: score,
        reason: getOptimalDateReason(personalDay, universalDay, eventType)
      });
    }
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Sort by favorability score (highest first)
  return optimalDates.sort((a, b) => b.favorabilityScore - a.favorabilityScore);
};

/**
 * Calculate date compatibility for two people.
 */
const calculateDateCompatibility = (
  year1: number,
  year2: number,
  day1: number,
  day2: number
): number => {
  const reducedYear1 = reduceToSingleDigit(year1, false);
  const reducedYear2 = reduceToSingleDigit(year2, false);
  const reducedDay1 = reduceToSingleDigit(day1, false);
  const reducedDay2 = reduceToSingleDigit(day2, false);
  
  // Perfect match
  if (reducedYear1 === reducedYear2 && reducedDay1 === reducedDay2) {
    return 100;
  }
  
  // Calculate compatibility
  const yearDiff = Math.abs(reducedYear1 - reducedYear2);
  const dayDiff = Math.abs(reducedDay1 - reducedDay2);
  
  const yearScore = 50 - (yearDiff * 5);
  const dayScore = 50 - (dayDiff * 5);
  
  return Math.max(0, Math.min(100, yearScore + dayScore));
};

/**
 * Get wedding recommendation.
 */
const getWeddingRecommendation = (
  personalYear: number,
  personalDay: number,
  universalDay: number,
  compatibility: number | null
): { ro: string; en: string; ru: string } => {
  const favorableDays = [2, 6, 9]; // Cooperation, harmony, completion
  
  if (compatibility !== null && compatibility >= 80) {
    return {
      ro: "Dată excelentă pentru nuntă! Compatibilitate perfectă între parteneri.",
      en: "Excellent date for wedding! Perfect compatibility between partners.",
      ru: "Отличная дата для свадьбы! Идеальная совместимость между партнёрами."
    };
  }
  
  if (favorableDays.includes(personalDay) && favorableDays.includes(universalDay)) {
    return {
      ro: "Dată foarte favorabilă pentru nuntă. Energii de armonie și cooperare.",
      en: "Very favorable date for wedding. Energies of harmony and cooperation.",
      ru: "Очень благоприятная дата для свадьбы. Энергии гармонии и сотрудничества."
    };
  }
  
  if (favorableDays.includes(personalDay) || favorableDays.includes(universalDay)) {
    return {
      ro: "Dată favorabilă pentru nuntă. Consideră această opțiune.",
      en: "Favorable date for wedding. Consider this option.",
      ru: "Благоприятная дата для свадьбы. Рассмотрите этот вариант."
    };
  }
  
  return {
    ro: "Dată acceptabilă, dar nu ideală. Consideră alternative mai favorabile.",
    en: "Acceptable date, but not ideal. Consider more favorable alternatives.",
    ru: "Приемлемая дата, но не идеальная. Рассмотрите более благоприятные альтернативы."
  };
};

/**
 * Get wedding meaning.
 */
const getWeddingMeaning = (
  personalYear: number,
  personalDay: number,
  universalDay: number
): { ro: string; en: string; ru: string } => {
  const reducedYear = reduceToSingleDigit(personalYear, false);
  const reducedDay = reduceToSingleDigit(personalDay, false);
  
  if (reducedDay === 2 || reducedDay === 6) {
    return {
      ro: "Nuntă bazată pe armonie și cooperare. Relație stabilă și durabilă.",
      en: "Wedding based on harmony and cooperation. Stable and lasting relationship.",
      ru: "Свадьба, основанная на гармонии и сотрудничестве. Стабильные и долговечные отношения."
    };
  }
  
  if (reducedDay === 9) {
    return {
      ro: "Nuntă de finalizare și compasiune. Început de nou ciclu de viață.",
      en: "Wedding of completion and compassion. Beginning of new life cycle.",
      ru: "Свадьба завершения и сострадания. Начало нового жизненного цикла."
    };
  }
  
  return {
    ro: "Nuntă cu energie personală specifică. Fiecare cuvânt are semnificație.",
    en: "Wedding with specific personal energy. Each word has meaning.",
    ru: "Свадьба с особой личной энергией. Каждое слово имеет значение."
  };
};

/**
 * Get business success potential.
 */
const getBusinessSuccessPotential = (
  businessVibration: number,
  personalYear: number
): { ro: string; en: string; ru: string } => {
  const reducedVibration = reduceToSingleDigit(businessVibration, false);
  const reducedYear = reduceToSingleDigit(personalYear, false);
  
  if ([1, 4, 8].includes(reducedVibration) && [1, 4, 8].includes(reducedYear)) {
    return {
      ro: "Potențial excelent de succes! Energii puternice de leadership și realizare.",
      en: "Excellent success potential! Strong energies of leadership and achievement.",
      ru: "Отличный потенциал успеха! Сильные энергии лидерства и достижений."
    };
  }
  
  if ([1, 4, 8].includes(reducedVibration) || [1, 4, 8].includes(reducedYear)) {
    return {
      ro: "Potențial bun de succes. Energii favorabile pentru afaceri.",
      en: "Good success potential. Favorable energies for business.",
      ru: "Хороший потенциал успеха. Благоприятные энергии для бизнеса."
    };
  }
  
  return {
    ro: "Potențial moderat. Poate necesita mai mult efort și perseverență.",
    en: "Moderate potential. May require more effort and perseverance.",
    ru: "Умеренный потенциал. Может потребовать больше усилий и настойчивости."
  };
};

/**
 * Get business recommendation.
 */
const getBusinessRecommendation = (
  businessVibration: number,
  personalYear: number,
  personalDay: number
): { ro: string; en: string; ru: string } => {
  const reducedVibration = reduceToSingleDigit(businessVibration, false);
  const reducedDay = reduceToSingleDigit(personalDay, false);
  
  if ([1, 4, 8].includes(reducedVibration) && [1, 4, 8].includes(reducedDay)) {
    return {
      ro: "Dată excelentă pentru lansare! Energii perfecte pentru succes în afaceri.",
      en: "Excellent date for launch! Perfect energies for business success.",
      ru: "Отличная дата для запуска! Идеальные энергии для успеха в бизнесе."
    };
  }
  
  if ([1, 4, 8].includes(reducedVibration) || [1, 4, 8].includes(reducedDay)) {
    return {
      ro: "Dată bună pentru lansare. Consideră această opțiune.",
      en: "Good date for launch. Consider this option.",
      ru: "Хорошая дата для запуска. Рассмотрите этот вариант."
    };
  }
  
  return {
    ro: "Dată acceptabilă, dar nu ideală. Consideră alternative cu energii mai puternice.",
    en: "Acceptable date, but not ideal. Consider alternatives with stronger energies.",
    ru: "Приемлемая дата, но не идеальная. Рассмотрите альтернативы с более сильными энергиями."
  };
};

/**
 * Get business challenges.
 */
const getBusinessChallenges = (
  personalYear: number,
  universalYear: number
): { ro: string[]; en: string[]; ru: string[] } => {
  const reducedPersonal = reduceToSingleDigit(personalYear, false);
  const reducedUniversal = reduceToSingleDigit(universalYear, false);
  
  const challenges: string[] = [];
  
  if (reducedPersonal === 2) {
    challenges.push("Necesită cooperare și parteneriate");
  }
  if (reducedUniversal === 7) {
    challenges.push("Perioadă de reflecție și analiză");
  }
  
  return {
    ro: challenges.length > 0 ? challenges : ["Fără provocări majore identificate"],
    en: challenges.length > 0 ? challenges.map(c => c.replace("Necesită", "Requires").replace("Perioadă", "Period")) : ["No major challenges identified"],
    ru: challenges.length > 0 ? challenges.map(c => c.replace("Necesită", "Требует").replace("Perioadă", "Период")) : ["Не выявлено серьёзных вызовов"]
  };
};

/**
 * Get business opportunities.
 */
const getBusinessOpportunities = (
  personalYear: number,
  universalYear: number
): { ro: string[]; en: string[]; ru: string[] } => {
  const reducedPersonal = reduceToSingleDigit(personalYear, false);
  const reducedUniversal = reduceToSingleDigit(universalYear, false);
  
  const opportunities: string[] = [];
  
  if ([1, 8].includes(reducedPersonal)) {
    opportunities.push("Oportunități de leadership și succes");
  }
  if ([1, 8].includes(reducedUniversal)) {
    opportunities.push("Energie universală favorabilă pentru afaceri");
  }
  if (reducedPersonal === 5) {
    opportunities.push("Oportunități de schimbare și expansiune");
  }
  
  return {
    ro: opportunities.length > 0 ? opportunities : ["Oportunități generale disponibile"],
    en: opportunities.length > 0 ? opportunities.map(o => o.replace("Oportunități", "Opportunities").replace("Energie", "Energy")) : ["General opportunities available"],
    ru: opportunities.length > 0 ? opportunities.map(o => o.replace("Oportunități", "Возможности").replace("Energie", "Энергия")) : ["Доступны общие возможности"]
  };
};

/**
 * Get transition energy for moving.
 */
const getTransitionEnergy = (
  personalYear: number,
  personalDay: number
): { ro: string; en: string; ru: string } => {
  const reducedDay = reduceToSingleDigit(personalDay, false);
  
  if (reducedDay === 1) {
    return {
      ro: "Energie de începuturi noi. Mutarea aduce oportunități de leadership.",
      en: "New beginnings energy. Moving brings leadership opportunities.",
      ru: "Энергия новых начинаний. Переезд приносит возможности лидерства."
    };
  }
  
  if (reducedDay === 5) {
    return {
      ro: "Energie de schimbare și libertate. Mutarea aduce aventură și explorare.",
      en: "Change and freedom energy. Moving brings adventure and exploration.",
      ru: "Энергия перемен и свободы. Переезд приносит приключения и исследования."
    };
  }
  
  return {
    ro: "Energie de tranziție. Mutarea aduce schimbări în viață.",
    en: "Transition energy. Moving brings life changes.",
    ru: "Энергия перехода. Переезд приносит изменения в жизни."
  };
};

/**
 * Get moving recommendation.
 */
const getMovingRecommendation = (
  personalYear: number,
  personalDay: number,
  universalDay: number,
  favorable: boolean
): { ro: string; en: string; ru: string } => {
  if (favorable) {
    return {
      ro: "Dată excelentă pentru mutare! Energii favorabile pentru tranziție.",
      en: "Excellent date for moving! Favorable energies for transition.",
      ru: "Отличная дата для переезда! Благоприятные энергии для перехода."
    };
  }
  
  const reducedDay = reduceToSingleDigit(personalDay, false);
  
  if (reducedDay === 4) {
    return {
      ro: "Dată bună pentru mutare. Energie de stabilitate și organizare.",
      en: "Good date for moving. Energy of stability and organization.",
      ru: "Хорошая дата для переезда. Энергия стабильности и организации."
    };
  }
  
  return {
    ro: "Dată acceptabilă pentru mutare. Consideră alternative dacă este posibil.",
    en: "Acceptable date for moving. Consider alternatives if possible.",
    ru: "Приемлемая дата для переезда. Рассмотрите альтернативы, если возможно."
  };
};

/**
 * Get optimal date reason.
 */
const getOptimalDateReason = (
  personalDay: number,
  universalDay: number,
  eventType: EventType
): { ro: string; en: string; ru: string } => {
  const reducedPersonal = reduceToSingleDigit(personalDay, false);
  const reducedUniversal = reduceToSingleDigit(universalDay, false);
  
  if (reducedPersonal === reducedUniversal) {
    return {
      ro: "Armonie perfectă între energia personală și universală.",
      en: "Perfect harmony between personal and universal energy.",
      ru: "Идеальная гармония между личной и универсальной энергией."
    };
  }
  
  if (eventType === 'wedding' && [2, 6, 9].includes(reducedPersonal)) {
    return {
      ro: "Energie personală favorabilă pentru armonie și cooperare.",
      en: "Personal energy favorable for harmony and cooperation.",
      ru: "Личная энергия благоприятна для гармонии и сотрудничества."
    };
  }
  
  if (eventType === 'business' && [1, 4, 8].includes(reducedPersonal)) {
    return {
      ro: "Energie personală favorabilă pentru succes în afaceri.",
      en: "Personal energy favorable for business success.",
      ru: "Личная энергия благоприятна для успеха в бизнесе."
    };
  }
  
  return {
    ro: "Energie favorabilă pentru acest tip de eveniment.",
    en: "Favorable energy for this type of event.",
    ru: "Благоприятная энергия для этого типа события."
  };
};

