// Pythagorean alphabet values
const PYTHAGOREAN_VALUES: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
};

const VOWELS = ['A', 'E', 'I', 'O', 'U'];
const MASTER_NUMBERS = [11, 22, 33];

// Reduce a number to single digit, preserving master numbers
export const reduceToSingleDigit = (num: number, preserveMaster = true): number => {
  if (preserveMaster && MASTER_NUMBERS.includes(num)) {
    return num;
  }
  
  while (num > 9 && !(preserveMaster && MASTER_NUMBERS.includes(num))) {
    num = String(num).split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  
  return num;
};

// Calculate Life Path Number from birth date
export const calculateLifePathNumber = (birthDate: Date): number => {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();
  
  const reducedDay = reduceToSingleDigit(day);
  const reducedMonth = reduceToSingleDigit(month);
  const reducedYear = reduceToSingleDigit(
    String(year).split('').reduce((sum, digit) => sum + parseInt(digit), 0)
  );
  
  const total = reducedDay + reducedMonth + reducedYear;
  return reduceToSingleDigit(total);
};

// Calculate name number from letters
const calculateNameNumber = (name: string, filterFn?: (char: string) => boolean): number => {
  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
  
  let total = 0;
  for (const char of cleanName) {
    if (!filterFn || filterFn(char)) {
      total += PYTHAGOREAN_VALUES[char] || 0;
    }
  }
  
  return reduceToSingleDigit(total);
};

// Destiny Number (Expression Number) - all letters
export const calculateDestinyNumber = (fullName: string): number => {
  return calculateNameNumber(fullName);
};

// Soul Urge Number (Heart's Desire) - vowels only
export const calculateSoulUrgeNumber = (fullName: string): number => {
  return calculateNameNumber(fullName, (char) => VOWELS.includes(char));
};

// Personality Number - consonants only
export const calculatePersonalityNumber = (fullName: string): number => {
  return calculateNameNumber(fullName, (char) => !VOWELS.includes(char));
};

// Personal Year Number
export const calculatePersonalYearNumber = (birthDate: Date, year: number = new Date().getFullYear()): number => {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  
  const reducedDay = reduceToSingleDigit(day, false);
  const reducedMonth = reduceToSingleDigit(month, false);
  const reducedYear = reduceToSingleDigit(
    String(year).split('').reduce((sum, digit) => sum + parseInt(digit), 0),
    false
  );
  
  const total = reducedDay + reducedMonth + reducedYear;
  return reduceToSingleDigit(total, false);
};

// Number interpretations
export const NUMBER_MEANINGS: Record<number, { title: string; traits: string[]; description: string }> = {
  1: {
    title: "Liderul",
    traits: ["Independent", "Ambițios", "Inovator", "Curajos"],
    description: "Ești un pionier natural, cu o dorință puternică de a conduce și de a inova. Energia ta este cea a începuturilor și a independenței."
  },
  2: {
    title: "Diplomatull",
    traits: ["Diplomatic", "Sensibil", "Cooperant", "Intuitiv"],
    description: "Ești un pacificator natural, cu abilități excepționale de a crea armonie. Energia ta este cea a parteneriatului și echilibrului."
  },
  3: {
    title: "Creatorul",
    traits: ["Creativ", "Expresiv", "Optimist", "Sociabil"],
    description: "Ești plin de creativitate și expresie artistică. Energia ta aduce bucurie și inspirație celor din jur."
  },
  4: {
    title: "Constructorul",
    traits: ["Stabil", "Practic", "Disciplinat", "Loial"],
    description: "Ești fundamentul pe care alții se pot baza. Energia ta este cea a stabilității și a construirii pentru viitor."
  },
  5: {
    title: "Aventurierul",
    traits: ["Liber", "Versatil", "Curios", "Dinamic"],
    description: "Ești un spirit liber care tânjește după schimbare și aventură. Energia ta este cea a libertății și explorării."
  },
  6: {
    title: "Protectorul",
    traits: ["Responsabil", "Grijuliu", "Armonios", "Devotat"],
    description: "Ești un protector natural al familiei și comunității. Energia ta este cea a iubirii și responsabilității."
  },
  7: {
    title: "Căutătorul",
    traits: ["Analitic", "Spiritual", "Misterios", "Înțelept"],
    description: "Ești un căutător al adevărului și cunoașterii profunde. Energia ta este cea a introspecției și înțelepciunii."
  },
  8: {
    title: "Realizatorul",
    traits: ["Puternic", "Autoritar", "Abundent", "Ambiția"],
    description: "Ești destinat pentru succes material și putere. Energia ta este cea a abundenței și realizării."
  },
  9: {
    title: "Umanitarul",
    traits: ["Compasiune", "Generozitate", "Vizionar", "Spiritual"],
    description: "Ești un suflet vechi cu o viziune pentru binele umanității. Energia ta este cea a compasiunii universale."
  },
  11: {
    title: "Maestrul Intuitor",
    traits: ["Vizionar", "Inspirațional", "Sensibil", "Iluminat"],
    description: "Porți energia puternică a numărului master 11. Ești un canal pentru inspirație divină și ai abilitatea de a ilumina calea altora."
  },
  22: {
    title: "Maestrul Constructor",
    traits: ["Visător practic", "Puternic", "Disciplinat", "Vizionar"],
    description: "Porți energia numărului master 22. Ai capacitatea de a transforma visele în realitate la scară mare."
  },
  33: {
    title: "Maestrul Învățător",
    traits: ["Compasiune supremă", "Vindecător", "Înțelept", "Spiritual"],
    description: "Porți energia rară a numărului master 33. Ești un maestru spiritual cu o misiune de a vindeca și învăța."
  }
};

export const getNumberMeaning = (num: number) => {
  return NUMBER_MEANINGS[num] || NUMBER_MEANINGS[reduceToSingleDigit(num, false)];
};

/**
 * Calculate Hidden Passions (numbers that appear most frequently in the name).
 * These represent talents and interests that may not be immediately obvious.
 * @param fullName - Full name at birth
 * @returns Array of numbers (1-9) sorted by frequency, representing hidden passions
 */
export const calculateHiddenPassions = (fullName: string): number[] => {
  const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  const frequencyMap = new Map<number, number>();
  
  for (const char of cleanName) {
    const value = PYTHAGOREAN_VALUES[char];
    if (value) {
      frequencyMap.set(value, (frequencyMap.get(value) || 0) + 1);
    }
  }
  
  // Sort by frequency (descending), then by number (ascending)
  const sorted = Array.from(frequencyMap.entries())
    .sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1]; // Higher frequency first
      }
      return a[0] - b[0]; // Lower number first if same frequency
    });
  
  // Return top 3 most frequent numbers
  return sorted.slice(0, 3).map(([num]) => num);
};

/**
 * Calculate Maturity Number (Life Path + Destiny).
 * This number reveals the person you will become as you mature and develop.
 * @param birthDate - Birth date
 * @param fullName - Full name at birth
 * @returns Maturity number (1-9, or master numbers 11, 22, 33)
 */
export const calculateMaturityNumber = (birthDate: Date, fullName: string): number => {
  const lifePath = calculateLifePathNumber(birthDate);
  const destiny = calculateDestinyNumber(fullName);
  
  const total = lifePath + destiny;
  return reduceToSingleDigit(total, true);
};

/**
 * Calculate Balance Number (difference between vowels and consonants).
 * This reveals how balanced you are between inner desires and outer expression.
 * @param fullName - Full name at birth
 * @returns Balance number (0-8), where 0 = perfect balance
 */
export const calculateBalanceNumber = (fullName: string): number => {
  const soulUrge = calculateSoulUrgeNumber(fullName);
  const personality = calculatePersonalityNumber(fullName);
  
  const difference = Math.abs(soulUrge - personality);
  return reduceToSingleDigit(difference, false);
};

/**
 * Analyze letter distribution in the name.
 * Returns detailed statistics about which numbers appear and their frequencies.
 * @param fullName - Full name at birth
 * @returns Object containing letter distribution analysis
 */
export interface LetterDistribution {
  letterCounts: Record<string, number>;
  numberCounts: Record<number, number>;
  vowels: number;
  consonants: number;
  mostFrequentNumber: number;
  leastFrequentNumber: number;
  missingNumbers: number[];
}

export const analyzeLetterDistribution = (fullName: string): LetterDistribution => {
  const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  
  const letterCounts: Record<string, number> = {};
  const numberCounts: Record<number, number> = {};
  let vowels = 0;
  let consonants = 0;
  
  for (const char of cleanName) {
    // Count letters
    letterCounts[char] = (letterCounts[char] || 0) + 1;
    
    // Count numbers
    const value = PYTHAGOREAN_VALUES[char];
    if (value) {
      numberCounts[value] = (numberCounts[value] || 0) + 1;
      
      if (VOWELS.includes(char)) {
        vowels++;
      } else {
        consonants++;
      }
    }
  }
  
  // Find most and least frequent numbers
  const numberEntries = Object.entries(numberCounts).map(([num, count]) => [parseInt(num), count] as [number, number]);
  const mostFrequent = numberEntries.reduce((max, [num, count]) => 
    count > max[1] ? [num, count] : max, 
    [0, 0] as [number, number]
  );
  const leastFrequent = numberEntries.reduce((min, [num, count]) => 
    count < min[1] ? [num, count] : min, 
    [0, Infinity] as [number, number]
  );
  
  // Find missing numbers (1-9)
  const missingNumbers: number[] = [];
  for (let i = 1; i <= 9; i++) {
    if (!numberCounts[i]) {
      missingNumbers.push(i);
    }
  }
  
  return {
    letterCounts,
    numberCounts,
    vowels,
    consonants,
    mostFrequentNumber: mostFrequent[0] || 0,
    leastFrequentNumber: leastFrequent[0] || 0,
    missingNumbers
  };
};
