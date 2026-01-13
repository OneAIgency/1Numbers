import { reduceToSingleDigit } from "./numerology";

// Pythagorean alphabet values for letter-to-number conversion
const PYTHAGOREAN_VALUES: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
};

/**
 * Extract and sum all numbers and letters from an address string.
 * @param address - Address string (e.g., "Strada Victoriei 10")
 * @returns Sum of all numeric values
 */
const calculateAddressSum = (address: string): number => {
  const cleanAddress = address.toUpperCase().replace(/[^A-Z0-9]/g, '');
  let sum = 0;
  
  for (const char of cleanAddress) {
    if (char >= '0' && char <= '9') {
      sum += parseInt(char);
    } else if (PYTHAGOREAN_VALUES[char]) {
      sum += PYTHAGOREAN_VALUES[char];
    }
  }
  
  return sum;
};

/**
 * Analyze a residential address numerologically.
 * @param address - Full address string
 * @returns Address analysis data
 */
export interface AddressAnalysis {
  addressNumber: number;
  streetNumber: number | null;
  buildingNumber: number | null;
  overallVibration: number;
  meaning: { ro: string; en: string; ru: string };
  compatibility: { ro: string; en: string; ru: string };
}

export const analyzeAddress = (address: string): AddressAnalysis => {
  const totalSum = calculateAddressSum(address);
  const addressNumber = reduceToSingleDigit(totalSum, true);
  
  // Extract street number and building number if present
  const numberMatches = address.match(/\d+/g);
  const streetNumber = numberMatches && numberMatches.length > 0 
    ? reduceToSingleDigit(parseInt(numberMatches[0]), false)
    : null;
  const buildingNumber = numberMatches && numberMatches.length > 1
    ? reduceToSingleDigit(parseInt(numberMatches[1]), false)
    : null;
  
  // Overall vibration is the address number
  const overallVibration = addressNumber;
  
  return {
    addressNumber,
    streetNumber,
    buildingNumber,
    overallVibration,
    meaning: getAddressMeaning(addressNumber),
    compatibility: getAddressCompatibility(addressNumber)
  };
};

/**
 * Analyze an office/business address numerologically.
 * @param address - Office address string
 * @returns Office address analysis data
 */
export interface OfficeAddressAnalysis extends AddressAnalysis {
  businessVibration: number;
  businessMeaning: { ro: string; en: string; ru: string };
}

export const analyzeOfficeAddress = (address: string): OfficeAddressAnalysis => {
  const baseAnalysis = analyzeAddress(address);
  
  // Business vibration is calculated with emphasis on business energy
  const businessSum = calculateAddressSum(address) + 8; // Add business energy (8 = material success)
  const businessVibration = reduceToSingleDigit(businessSum, true);
  
  return {
    ...baseAnalysis,
    businessVibration,
    businessMeaning: getBusinessAddressMeaning(businessVibration)
  };
};

/**
 * Compare two addresses numerologically.
 * @param address1 - First address
 * @param address2 - Second address
 * @returns Comparison data
 */
export interface AddressComparison {
  address1: AddressAnalysis;
  address2: AddressAnalysis;
  compatibility: number; // 0-100
  recommendation: { ro: string; en: string; ru: string };
}

export const compareAddresses = (
  address1: string,
  address2: string
): AddressComparison => {
  const analysis1 = analyzeAddress(address1);
  const analysis2 = analyzeAddress(address2);
  
  // Calculate compatibility based on number harmony
  const compatibility = calculateAddressCompatibility(
    analysis1.addressNumber,
    analysis2.addressNumber
  );
  
  return {
    address1: analysis1,
    address2: analysis2,
    compatibility,
    recommendation: getAddressRecommendation(compatibility, analysis1.addressNumber, analysis2.addressNumber)
  };
};

/**
 * Calculate compatibility between two address numbers.
 * @param num1 - First address number
 * @param num2 - Second address number
 * @returns Compatibility score (0-100)
 */
const calculateAddressCompatibility = (num1: number, num2: number): number => {
  // Reduce to single digits for comparison
  const reduced1 = reduceToSingleDigit(num1, false);
  const reduced2 = reduceToSingleDigit(num2, false);
  
  // Perfect match
  if (reduced1 === reduced2) {
    return 100;
  }
  
  // Calculate difference
  const diff = Math.abs(reduced1 - reduced2);
  
  // Compatibility decreases with difference
  // Same number = 100, difference of 1 = 80, difference of 2 = 60, etc.
  const baseScore = 100 - (diff * 20);
  
  // Bonus for complementary numbers (e.g., 1-9, 2-8, 3-7, 4-6, 5-5)
  const complementaryPairs: [number, number][] = [
    [1, 9], [2, 8], [3, 7], [4, 6], [5, 5]
  ];
  
  const isComplementary = complementaryPairs.some(
    ([a, b]) => (a === reduced1 && b === reduced2) || (a === reduced2 && b === reduced1)
  );
  
  return Math.max(0, Math.min(100, baseScore + (isComplementary ? 10 : 0)));
};

/**
 * Get recommendations for choosing addresses based on Life Path compatibility.
 * @param lifePathNumber - User's Life Path number
 * @param addressOptions - Array of address strings to compare
 * @returns Recommendations sorted by compatibility
 */
export interface AddressRecommendation {
  address: string;
  analysis: AddressAnalysis;
  compatibility: number;
  recommendation: { ro: string; en: string; ru: string };
}

export const getAddressRecommendations = (
  lifePathNumber: number,
  addressOptions: string[]
): AddressRecommendation[] => {
  const recommendations: AddressRecommendation[] = [];
  
  for (const address of addressOptions) {
    const analysis = analyzeAddress(address);
    const compatibility = calculateAddressCompatibility(lifePathNumber, analysis.addressNumber);
    
    recommendations.push({
      address,
      analysis,
      compatibility,
      recommendation: getAddressRecommendation(compatibility, lifePathNumber, analysis.addressNumber)
    });
  }
  
  // Sort by compatibility (highest first)
  return recommendations.sort((a, b) => b.compatibility - a.compatibility);
};

/**
 * Get meaning for an address number.
 */
const getAddressMeaning = (num: number): { ro: string; en: string; ru: string } => {
  const meanings: Record<number, { ro: string; en: string; ru: string }> = {
    1: {
      ro: "Adresă de independență și inițiativă. Ideală pentru începuturi noi și leadership.",
      en: "Address of independence and initiative. Ideal for new beginnings and leadership.",
      ru: "Адрес независимости и инициативы. Идеален для новых начинаний и лидерства."
    },
    2: {
      ro: "Adresă de cooperare și armonie. Favorizează parteneriatele și relațiile.",
      en: "Address of cooperation and harmony. Favors partnerships and relationships.",
      ru: "Адрес сотрудничества и гармонии. Благоприятствует партнёрству и отношениям."
    },
    3: {
      ro: "Adresă creativă și expresivă. Ideală pentru activități artistice și comunicare.",
      en: "Creative and expressive address. Ideal for artistic activities and communication.",
      ru: "Творческий и выразительный адрес. Идеален для художественной деятельности и общения."
    },
    4: {
      ro: "Adresă de stabilitate și construcție. Favorizează muncă și organizare.",
      en: "Address of stability and building. Favors work and organization.",
      ru: "Адрес стабильности и строительства. Благоприятствует работе и организации."
    },
    5: {
      ro: "Adresă dinamică și versatilă. Favorizează schimbările și aventura.",
      en: "Dynamic and versatile address. Favors changes and adventure.",
      ru: "Динамичный и универсальный адрес. Благоприятствует переменам и приключениям."
    },
    6: {
      ro: "Adresă de responsabilitate și armonie familială. Ideală pentru familie.",
      en: "Address of responsibility and family harmony. Ideal for family.",
      ru: "Адрес ответственности и семейной гармонии. Идеален для семьи."
    },
    7: {
      ro: "Adresă de introspecție și înțelepciune. Ideală pentru studiu și reflecție.",
      en: "Address of introspection and wisdom. Ideal for study and reflection.",
      ru: "Адрес самоанализа и мудрости. Идеален для учёбы и размышлений."
    },
    8: {
      ro: "Adresă de realizare materială. Favorizează succesul financiar și afacerile.",
      en: "Address of material achievement. Favors financial success and business.",
      ru: "Адрес материальных достижений. Благоприятствует финансовому успеху и бизнесу."
    },
    9: {
      ro: "Adresă de compasiune și serviciu. Ideală pentru activități umanitare.",
      en: "Address of compassion and service. Ideal for humanitarian activities.",
      ru: "Адрес сострадания и служения. Идеален для гуманитарной деятельности."
    },
    11: {
      ro: "Adresă master de inspirație spirituală. Ideală pentru activități spirituale.",
      en: "Master address of spiritual inspiration. Ideal for spiritual activities.",
      ru: "Мастер-адрес духовного вдохновения. Идеален для духовной деятельности."
    },
    22: {
      ro: "Adresă master de construcție la scară largă. Ideală pentru proiecte mari.",
      en: "Master address of large-scale building. Ideal for large projects.",
      ru: "Мастер-адрес крупномасштабного строительства. Идеален для больших проектов."
    },
    33: {
      ro: "Adresă master de învățătură și vindecare. Ideală pentru activități de serviciu.",
      en: "Master address of teaching and healing. Ideal for service activities.",
      ru: "Мастер-адрес обучения и исцеления. Идеален для служебной деятельности."
    }
  };
  
  return meanings[num] || meanings[reduceToSingleDigit(num, false)];
};

/**
 * Get compatibility description for an address number.
 */
const getAddressCompatibility = (num: number): { ro: string; en: string; ru: string } => {
  const reduced = reduceToSingleDigit(num, false);
  
  const compatibilities: Record<number, { ro: string; en: string; ru: string }> = {
    1: {
      ro: "Compatibilă cu persoanele independente și ambițioase.",
      en: "Compatible with independent and ambitious people.",
      ru: "Совместим с независимыми и амбициозными людьми."
    },
    2: {
      ro: "Compatibilă cu persoanele sensibile și cooperative.",
      en: "Compatible with sensitive and cooperative people.",
      ru: "Совместим с чувствительными и склонными к сотрудничеству людьми."
    },
    3: {
      ro: "Compatibilă cu persoanele creative și expresive.",
      en: "Compatible with creative and expressive people.",
      ru: "Совместим с творческими и выразительными людьми."
    },
    4: {
      ro: "Compatibilă cu persoanele stabile și organizate.",
      en: "Compatible with stable and organized people.",
      ru: "Совместим со стабильными и организованными людьми."
    },
    5: {
      ro: "Compatibilă cu persoanele dinamice și aventuroase.",
      en: "Compatible with dynamic and adventurous people.",
      ru: "Совместим с динамичными и авантюрными людьми."
    },
    6: {
      ro: "Compatibilă cu persoanele responsabile și grijulii.",
      en: "Compatible with responsible and caring people.",
      ru: "Совместим с ответственными и заботливыми людьми."
    },
    7: {
      ro: "Compatibilă cu persoanele analitice și spirituale.",
      en: "Compatible with analytical and spiritual people.",
      ru: "Совместим с аналитическими и духовными людьми."
    },
    8: {
      ro: "Compatibilă cu persoanele ambițioase și orientate spre succes.",
      en: "Compatible with ambitious and success-oriented people.",
      ru: "Совместим с амбициозными и ориентированными на успех людьми."
    },
    9: {
      ro: "Compatibilă cu persoanele compasiune și generoase.",
      en: "Compatible with compassionate and generous people.",
      ru: "Совместим с сострадательными и щедрыми людьми."
    }
  };
  
  return compatibilities[reduced] || compatibilities[1];
};

/**
 * Get business address meaning.
 */
const getBusinessAddressMeaning = (num: number): { ro: string; en: string; ru: string } => {
  const meanings: Record<number, { ro: string; en: string; ru: string }> = {
    1: {
      ro: "Energie de leadership și inovație. Ideală pentru startup-uri și afaceri noi.",
      en: "Leadership and innovation energy. Ideal for startups and new businesses.",
      ru: "Энергия лидерства и инноваций. Идеален для стартапов и новых предприятий."
    },
    8: {
      ro: "Energie de succes material. Ideală pentru afaceri și realizări financiare.",
      en: "Material success energy. Ideal for business and financial achievements.",
      ru: "Энергия материального успеха. Идеален для бизнеса и финансовых достижений."
    }
  };
  
  const reduced = reduceToSingleDigit(num, false);
  return meanings[reduced] || meanings[1];
};

/**
 * Get address recommendation based on compatibility.
 */
const getAddressRecommendation = (
  compatibility: number,
  num1: number,
  num2: number
): { ro: string; en: string; ru: string } => {
  if (compatibility >= 90) {
    return {
      ro: "Compatibilitate excelentă! Această adresă este foarte potrivită pentru tine.",
      en: "Excellent compatibility! This address is very suitable for you.",
      ru: "Отличная совместимость! Этот адрес очень подходит вам."
    };
  } else if (compatibility >= 70) {
    return {
      ro: "Compatibilitate bună. Această adresă poate aduce energie pozitivă.",
      en: "Good compatibility. This address can bring positive energy.",
      ru: "Хорошая совместимость. Этот адрес может принести положительную энергию."
    };
  } else if (compatibility >= 50) {
    return {
      ro: "Compatibilitate moderată. Adresă acceptabilă, dar nu ideală.",
      en: "Moderate compatibility. Acceptable address, but not ideal.",
      ru: "Умеренная совместимость. Приемлемый адрес, но не идеальный."
    };
  } else {
    return {
      ro: "Compatibilitate scăzută. Poate aduce provocări sau energie nepotrivită.",
      en: "Low compatibility. May bring challenges or unsuitable energy.",
      ru: "Низкая совместимость. Может принести вызовы или неподходящую энергию."
    };
  }
};

