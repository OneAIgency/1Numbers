import { reduceToSingleDigit, calculateLifePathNumber } from "./numerology";

/**
 * Analyze a license plate number numerologically.
 * @param licensePlate - License plate string (e.g., "AB-123-CD" or "123ABC")
 * @returns License plate analysis data
 */
export interface LicensePlateAnalysis {
  licensePlate: string;
  plateNumber: number;
  vibration: number;
  energy: { ro: string; en: string; ru: string };
  characteristics: { ro: string[]; en: string[]; ru: string[] };
  recommendation: { ro: string; en: string; ru: string };
}

export const analyzeLicensePlate = (licensePlate: string): LicensePlateAnalysis => {
  // Extract all alphanumeric characters
  const cleanPlate = licensePlate.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  if (cleanPlate.length === 0) {
    throw new Error("License plate must contain at least one alphanumeric character");
  }
  
  // Pythagorean values for letters
  const PYTHAGOREAN_VALUES: Record<string, number> = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
    J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
    S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
  };
  
  // Calculate sum of all characters
  let sum = 0;
  for (const char of cleanPlate) {
    if (char >= '0' && char <= '9') {
      sum += parseInt(char);
    } else if (PYTHAGOREAN_VALUES[char]) {
      sum += PYTHAGOREAN_VALUES[char];
    }
  }
  
  const plateNumber = sum;
  const vibration = reduceToSingleDigit(sum, true);
  
  return {
    licensePlate: cleanPlate,
    plateNumber,
    vibration,
    energy: getPlateEnergy(vibration),
    characteristics: getPlateCharacteristics(vibration),
    recommendation: getPlateRecommendation(vibration)
  };
};

/**
 * Calculate compatibility between a vehicle's license plate and the owner.
 * @param licensePlate - License plate string
 * @param ownerBirthDate - Owner's birth date
 * @returns Vehicle compatibility analysis
 */
export interface VehicleCompatibility {
  plateAnalysis: LicensePlateAnalysis;
  ownerLifePath: number;
  compatibility: number; // 0-100
  compatibilityLevel: 'excellent' | 'good' | 'moderate' | 'challenging';
  benefits: { ro: string[]; en: string[]; ru: string[] };
  challenges: { ro: string[]; en: string[]; ru: string[] };
  recommendation: { ro: string; en: string; ru: string };
}

export const calculateVehicleCompatibility = (
  licensePlate: string,
  ownerBirthDate: Date
): VehicleCompatibility => {
  const plateAnalysis = analyzeLicensePlate(licensePlate);
  const ownerLifePath = calculateLifePathNumber(ownerBirthDate);
  
  // Calculate compatibility
  const compatibility = calculateCompatibilityScore(
    ownerLifePath,
    plateAnalysis.vibration
  );
  
  const compatibilityLevel = getCompatibilityLevel(compatibility);
  
  return {
    plateAnalysis,
    ownerLifePath,
    compatibility,
    compatibilityLevel,
    benefits: getVehicleBenefits(compatibilityLevel, plateAnalysis.vibration),
    challenges: getVehicleChallenges(compatibilityLevel, plateAnalysis.vibration),
    recommendation: getVehicleRecommendation(compatibility, compatibilityLevel)
  };
};

/**
 * Calculate compatibility score between Life Path and plate vibration.
 */
const calculateCompatibilityScore = (lifePath: number, plateVibration: number): number => {
  const reducedLifePath = reduceToSingleDigit(lifePath, false);
  const reducedPlate = reduceToSingleDigit(plateVibration, false);
  
  // Perfect match
  if (reducedLifePath === reducedPlate) {
    return 100;
  }
  
  // Calculate difference
  const diff = Math.abs(reducedLifePath - reducedPlate);
  
  // Base score decreases with difference
  const baseScore = 100 - (diff * 12);
  
  // Bonus for complementary numbers
  const complementaryPairs: [number, number][] = [
    [1, 9], [2, 8], [3, 7], [4, 6]
  ];
  
  const isComplementary = complementaryPairs.some(
    ([a, b]) => (a === reducedLifePath && b === reducedPlate) ||
                (a === reducedPlate && b === reducedLifePath)
  );
  
  return Math.max(0, Math.min(100, baseScore + (isComplementary ? 12 : 0)));
};

/**
 * Get compatibility level from score.
 */
const getCompatibilityLevel = (score: number): 'excellent' | 'good' | 'moderate' | 'challenging' => {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'moderate';
  return 'challenging';
};

/**
 * Get plate energy description.
 */
const getPlateEnergy = (num: number): { ro: string; en: string; ru: string } => {
  const reduced = reduceToSingleDigit(num, false);
  
  const energies: Record<number, { ro: string; en: string; ru: string }> = {
    1: {
      ro: "Energie de leadership și independență. Mașină pentru pionieri.",
      en: "Leadership and independence energy. Car for pioneers.",
      ru: "Энергия лидерства и независимости. Машина для пионеров."
    },
    2: {
      ro: "Energie de cooperare și armonie. Mașină pentru parteneriate.",
      en: "Cooperation and harmony energy. Car for partnerships.",
      ru: "Энергия сотрудничества и гармонии. Машина для партнёрства."
    },
    3: {
      ro: "Energie creativă și expresivă. Mașină pentru aventură și bucurie.",
      en: "Creative and expressive energy. Car for adventure and joy.",
      ru: "Творческая и выразительная энергия. Машина для приключений и радости."
    },
    4: {
      ro: "Energie de stabilitate și fiabilitate. Mașină practică și durabilă.",
      en: "Stability and reliability energy. Practical and durable car.",
      ru: "Энергия стабильности и надёжности. Практичная и долговечная машина."
    },
    5: {
      ro: "Energie dinamică și versatilă. Mașină pentru schimbări și explorare.",
      en: "Dynamic and versatile energy. Car for changes and exploration.",
      ru: "Динамичная и универсальная энергия. Машина для перемен и исследований."
    },
    6: {
      ro: "Energie de responsabilitate și confort. Mașină pentru familie.",
      en: "Responsibility and comfort energy. Car for family.",
      ru: "Энергия ответственности и комфорта. Машина для семьи."
    },
    7: {
      ro: "Energie de introspecție și eleganță. Mașină pentru reflecție.",
      en: "Introspection and elegance energy. Car for reflection.",
      ru: "Энергия самоанализа и элегантности. Машина для размышлений."
    },
    8: {
      ro: "Energie de succes și prestigiu. Mașină pentru realizări.",
      en: "Success and prestige energy. Car for achievements.",
      ru: "Энергия успеха и престижа. Машина для достижений."
    },
    9: {
      ro: "Energie de compasiune și serviciu. Mașină pentru ajutorarea altora.",
      en: "Compassion and service energy. Car for helping others.",
      ru: "Энергия сострадания и служения. Машина для помощи другим."
    }
  };
  
  return energies[reduced] || energies[1];
};

/**
 * Get plate characteristics.
 */
const getPlateCharacteristics = (num: number): { ro: string[]; en: string[]; ru: string[] } => {
  const reduced = reduceToSingleDigit(num, false);
  
  const characteristics: Record<number, { ro: string[]; en: string[]; ru: string[] }> = {
    1: {
      ro: ["Rapidă", "Dinamică", "Independentă"],
      en: ["Fast", "Dynamic", "Independent"],
      ru: ["Быстрая", "Динамичная", "Независимая"]
    },
    2: {
      ro: ["Comfortabilă", "Armonioasă", "Diplomatică"],
      en: ["Comfortable", "Harmonious", "Diplomatic"],
      ru: ["Комфортная", "Гармоничная", "Дипломатичная"]
    },
    3: {
      ro: ["Expresivă", "Creativă", "Veselă"],
      en: ["Expressive", "Creative", "Joyful"],
      ru: ["Выразительная", "Творческая", "Радостная"]
    },
    4: {
      ro: ["Fiabilă", "Stabilă", "Practică"],
      en: ["Reliable", "Stable", "Practical"],
      ru: ["Надёжная", "Стабильная", "Практичная"]
    },
    5: {
      ro: ["Versatilă", "Adaptabilă", "Aventuroasă"],
      en: ["Versatile", "Adaptable", "Adventurous"],
      ru: ["Универсальная", "Адаптивная", "Авантюрная"]
    },
    6: {
      ro: ["Sigură", "Confortabilă", "Familială"],
      en: ["Safe", "Comfortable", "Family-oriented"],
      ru: ["Безопасная", "Комфортная", "Семейная"]
    },
    7: {
      ro: ["Elegantă", "Rafinată", "Misterioasă"],
      en: ["Elegant", "Refined", "Mysterious"],
      ru: ["Элегантная", "Утончённая", "Загадочная"]
    },
    8: {
      ro: ["Prestigioasă", "Puternică", "Succes"],
      en: ["Prestigious", "Powerful", "Success"],
      ru: ["Престижная", "Мощная", "Успех"]
    },
    9: {
      ro: ["Generoasă", "Serviciu", "Umanitară"],
      en: ["Generous", "Service", "Humanitarian"],
      ru: ["Щедрая", "Служение", "Гуманитарная"]
    }
  };
  
  return characteristics[reduced] || characteristics[1];
};

/**
 * Get plate recommendation.
 */
const getPlateRecommendation = (num: number): { ro: string; en: string; ru: string } => {
  const reduced = reduceToSingleDigit(num, false);
  
  if ([1, 8].includes(reduced)) {
    return {
      ro: "Excelent pentru leadership și succes. Ideală pentru afaceri.",
      en: "Excellent for leadership and success. Ideal for business.",
      ru: "Отлично для лидерства и успеха. Идеален для бизнеса."
    };
  } else if ([4, 6].includes(reduced)) {
    return {
      ro: "Excelentă pentru familie și uz zilnic. Fiabilă și sigură.",
      en: "Excellent for family and daily use. Reliable and safe.",
      ru: "Отлично для семьи и ежедневного использования. Надёжная и безопасная."
    };
  } else {
    return {
      ro: "Potrivită pentru uz general. Consideră compatibilitatea cu Life Path.",
      en: "Suitable for general use. Consider compatibility with Life Path.",
      ru: "Подходит для общего использования. Учитывайте совместимость с Путём Жизни."
    };
  }
};

/**
 * Get vehicle benefits based on compatibility.
 */
const getVehicleBenefits = (
  level: 'excellent' | 'good' | 'moderate' | 'challenging',
  vibration: number
): { ro: string[]; en: string[]; ru: string[] } => {
  const reduced = reduceToSingleDigit(vibration, false);
  
  if (level === 'excellent') {
    return {
      ro: [
        "Armonie perfectă cu energia ta",
        "Succes în călătorii",
        "Siguranță sporită",
        "Binecuvântare pentru vehicul"
      ],
      en: [
        "Perfect harmony with your energy",
        "Success in travels",
        "Increased safety",
        "Blessing for vehicle"
      ],
      ru: [
        "Идеальная гармония с вашей энергией",
        "Успех в поездках",
        "Повышенная безопасность",
        "Благословение для транспортного средства"
      ]
    };
  } else if (level === 'good') {
    return {
      ro: [
        "Compatibilitate bună",
        "Călătorii plăcute",
        "Fiabilitate"
      ],
      en: [
        "Good compatibility",
        "Pleasant travels",
        "Reliability"
      ],
      ru: [
        "Хорошая совместимость",
        "Приятные поездки",
        "Надёжность"
      ]
    };
  }
  
  return {
    ro: ["Compatibilitate moderată"],
    en: ["Moderate compatibility"],
    ru: ["Умеренная совместимость"]
  };
};

/**
 * Get vehicle challenges based on compatibility.
 */
const getVehicleChallenges = (
  level: 'excellent' | 'good' | 'moderate' | 'challenging',
  vibration: number
): { ro: string[]; en: string[]; ru: string[] } => {
  if (level === 'challenging') {
    return {
      ro: [
        "Posibile probleme mecanice",
        "Necesită atenție sporită",
        "Compatibilitate redusă"
      ],
      en: [
        "Possible mechanical issues",
        "Requires increased attention",
        "Reduced compatibility"
      ],
      ru: [
        "Возможные механические проблемы",
        "Требует повышенного внимания",
        "Сниженная совместимость"
      ]
    };
  } else if (level === 'moderate') {
    return {
      ro: [
        "Compatibilitate moderată",
        "Poate necesita mai multă atenție"
      ],
      en: [
        "Moderate compatibility",
        "May require more attention"
      ],
      ru: [
        "Умеренная совместимость",
        "Может потребовать больше внимания"
      ]
    };
  }
  
  return {
    ro: ["Fără provocări majore"],
    en: ["No major challenges"],
    ru: ["Нет серьёзных вызовов"]
  };
};

/**
 * Get vehicle recommendation.
 */
const getVehicleRecommendation = (
  compatibility: number,
  level: 'excellent' | 'good' | 'moderate' | 'challenging'
): { ro: string; en: string; ru: string } => {
  if (level === 'excellent') {
    return {
      ro: "Mașină excelentă pentru tine! Compatibilitate perfectă cu energia ta personală.",
      en: "Excellent car for you! Perfect compatibility with your personal energy.",
      ru: "Отличная машина для вас! Идеальная совместимость с вашей личной энергией."
    };
  } else if (level === 'good') {
    return {
      ro: "Mașină bună pentru tine. Compatibilitate solidă cu energia ta.",
      en: "Good car for you. Solid compatibility with your energy.",
      ru: "Хорошая машина для вас. Прочная совместимость с вашей энергией."
    };
  } else if (level === 'moderate') {
    return {
      ro: "Mașină acceptabilă, dar nu ideală. Consideră alternative dacă este posibil.",
      en: "Acceptable car, but not ideal. Consider alternatives if possible.",
      ru: "Приемлемая машина, но не идеальная. Рассмотрите альтернативы, если возможно."
    };
  } else {
    return {
      ro: "Compatibilitate scăzută. Nu este recomandată această mașină pentru tine.",
      en: "Low compatibility. This car is not recommended for you.",
      ru: "Низкая совместимость. Эта машина не рекомендуется для вас."
    };
  }
};

