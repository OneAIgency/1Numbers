import { reduceToSingleDigit, calculateLifePathNumber, calculateDestinyNumber, calculatePersonalYearNumber } from './numerology';

export interface LuckyDate {
  date: Date;
  score: number;
  reasons: string[];
  dayNumber: number;
  universalNumber: number;
}

export interface LuckyDatesResult {
  dates: LuckyDate[];
  bestDates: LuckyDate[];
  personalNumbers: number[];
}

// Calculate the numerological value of a date
export const calculateDateNumber = (date: Date): number => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return reduceToSingleDigit(day + month + year);
};

// Get compatible numbers for a given number
const getCompatibleNumbers = (num: number): number[] => {
  const compatibility: Record<number, number[]> = {
    1: [1, 2, 3, 5, 9],
    2: [1, 2, 6, 8, 9],
    3: [1, 3, 5, 6, 9],
    4: [4, 6, 7, 8],
    5: [1, 3, 5, 6, 9],
    6: [2, 3, 4, 5, 6, 9],
    7: [4, 7],
    8: [2, 4, 8],
    9: [1, 2, 3, 5, 6, 9],
    11: [2, 4, 6, 8, 11, 22],
    22: [4, 6, 8, 11, 22, 33],
    33: [3, 6, 9, 22, 33],
  };
  return compatibility[num] || compatibility[reduceToSingleDigit(num)] || [];
};

// Check if a date is a master number date
const isMasterNumberDate = (date: Date): number | null => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const sum = day + month + year;
  
  if (sum === 11 || sum === 22 || sum === 33) return sum;
  if (day === 11 || day === 22) return day;
  return null;
};

// Calculate lucky score for a date based on personal numbers
export const calculateLuckyScore = (
  date: Date,
  lifePathNumber: number,
  destinyNumber: number,
  personalYearNumber: number
): { score: number; reasons: string[] } => {
  const dateNumber = calculateDateNumber(date);
  const dayOfMonth = date.getDate();
  const dayNumber = reduceToSingleDigit(dayOfMonth);
  const reasons: string[] = [];
  let score = 0;

  // Check Life Path compatibility
  if (dateNumber === lifePathNumber) {
    score += 30;
    reasons.push('lifePathMatch');
  } else if (getCompatibleNumbers(lifePathNumber).includes(dateNumber)) {
    score += 20;
    reasons.push('lifePathCompatible');
  }

  // Check Destiny Number compatibility
  if (dateNumber === destinyNumber) {
    score += 25;
    reasons.push('destinyMatch');
  } else if (getCompatibleNumbers(destinyNumber).includes(dateNumber)) {
    score += 15;
    reasons.push('destinyCompatible');
  }

  // Check Personal Year compatibility
  if (dateNumber === personalYearNumber) {
    score += 20;
    reasons.push('personalYearMatch');
  }

  // Check day of month matches
  if (dayNumber === lifePathNumber || dayNumber === destinyNumber) {
    score += 15;
    reasons.push('dayMatch');
  }

  // Master number bonus
  const masterNum = isMasterNumberDate(date);
  if (masterNum) {
    score += 25;
    reasons.push('masterNumber');
  }

  // Same number pattern bonus
  const day = date.getDate();
  const month = date.getMonth() + 1;
  if (day === month) {
    score += 10;
    reasons.push('mirrorDate');
  }

  // Repeating digits bonus
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  if (/(\d)\1{2,}/.test(dateStr)) {
    score += 10;
    reasons.push('repeatingDigits');
  }

  return { score, reasons };
};

// Find lucky dates in a given range
export const findLuckyDates = (
  birthDate: Date,
  fullName: string,
  startDate: Date,
  endDate: Date,
  minScore: number = 30
): LuckyDatesResult => {
  
  const lifePathNumber = calculateLifePathNumber(birthDate);
  const destinyNumber = calculateDestinyNumber(fullName);
  const personalYearNumber = calculatePersonalYearNumber(birthDate, startDate.getFullYear());
  
  const personalNumbers = [lifePathNumber, destinyNumber, personalYearNumber];
  const dates: LuckyDate[] = [];
  
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const { score, reasons } = calculateLuckyScore(
      currentDate,
      lifePathNumber,
      destinyNumber,
      personalYearNumber
    );
    
    if (score >= minScore) {
      dates.push({
        date: new Date(currentDate),
        score,
        reasons,
        dayNumber: reduceToSingleDigit(currentDate.getDate()),
        universalNumber: calculateDateNumber(currentDate),
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Sort by score descending
  dates.sort((a, b) => b.score - a.score);
  
  // Get top 5 best dates
  const bestDates = dates.slice(0, 5);
  
  return { dates, bestDates, personalNumbers };
};

// Get lucky dates for specific purposes
export const getLuckyDatesForPurpose = (
  birthDate: Date,
  fullName: string,
  purpose: 'business' | 'romance' | 'travel' | 'health' | 'general',
  month: number,
  year: number
): LuckyDatesResult => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  
  // Adjust min score based on purpose
  const purposeMinScore: Record<string, number> = {
    business: 40,
    romance: 35,
    travel: 30,
    health: 35,
    general: 25,
  };
  
  return findLuckyDates(birthDate, fullName, startDate, endDate, purposeMinScore[purpose]);
};

// Get next lucky date from today
export const getNextLuckyDate = (
  birthDate: Date,
  fullName: string,
  daysToSearch: number = 30
): LuckyDate | null => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + daysToSearch);
  
  const result = findLuckyDates(birthDate, fullName, startDate, endDate, 40);
  
  if (result.dates.length === 0) return null;
  
  // Return the earliest high-score date
  const sortedByDate = [...result.dates].sort((a, b) => a.date.getTime() - b.date.getTime());
  return sortedByDate[0];
};
