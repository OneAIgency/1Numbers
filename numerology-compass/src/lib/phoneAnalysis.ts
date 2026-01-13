import { reduceToSingleDigit } from "./numerology";

/**
 * Analyze a phone number numerologically.
 * @param phoneNumber - Phone number string (digits only or with formatting)
 * @returns Phone number analysis data
 */
export interface PhoneAnalysis {
  phoneNumber: string;
  numberValue: number;
  mainVibration: number;
  communicationStyle: { ro: string; en: string; ru: string };
  impact: { ro: string; en: string; ru: string };
  recommendation: { ro: string; en: string; ru: string };
}

export const analyzePhoneNumber = (phoneNumber: string): PhoneAnalysis => {
  // Extract only digits
  const digits = phoneNumber.replace(/\D/g, '');
  
  if (digits.length === 0) {
    throw new Error("Phone number must contain at least one digit");
  }
  
  // Calculate sum of all digits
  const sum = digits.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  const numberValue = reduceToSingleDigit(sum, true);
  
  // Main vibration is the reduced number
  const mainVibration = numberValue;
  
  return {
    phoneNumber: digits,
    numberValue,
    mainVibration,
    communicationStyle: getCommunicationStyle(mainVibration),
    impact: getPhoneImpact(mainVibration),
    recommendation: getPhoneRecommendation(mainVibration)
  };
};

/**
 * Analyze a landline (fixed) phone number.
 * Landline numbers often have different energy than mobile numbers.
 * @param phoneNumber - Landline phone number string
 * @returns Landline phone analysis data
 */
export interface LandlineAnalysis extends PhoneAnalysis {
  stability: { ro: string; en: string; ru: string };
  businessSuitability: { ro: string; en: string; ru: string };
}

export const analyzeLandlineNumber = (phoneNumber: string): LandlineAnalysis => {
  const baseAnalysis = analyzePhoneNumber(phoneNumber);
  
  // Landline numbers tend to have more stable energy
  const stabilityScore = reduceToSingleDigit(baseAnalysis.numberValue + 4, false); // Add stability (4)
  
  return {
    ...baseAnalysis,
    stability: getStabilityDescription(stabilityScore),
    businessSuitability: getBusinessSuitability(baseAnalysis.mainVibration)
  };
};

/**
 * Get recommendations for choosing phone numbers based on Life Path compatibility.
 * @param lifePathNumber - User's Life Path number
 * @param phoneOptions - Array of phone number strings to compare
 * @returns Recommendations sorted by compatibility
 */
export interface PhoneRecommendation {
  phoneNumber: string;
  analysis: PhoneAnalysis;
  compatibility: number;
  recommendation: { ro: string; en: string; ru: string };
}

export const getPhoneRecommendations = (
  lifePathNumber: number,
  phoneOptions: string[]
): PhoneRecommendation[] => {
  const recommendations: PhoneRecommendation[] = [];
  
  for (const phone of phoneOptions) {
    const analysis = analyzePhoneNumber(phone);
    const compatibility = calculatePhoneCompatibility(lifePathNumber, analysis.mainVibration);
    
    recommendations.push({
      phoneNumber: phone,
      analysis,
      compatibility,
      recommendation: getPhoneRecommendationText(compatibility, analysis.mainVibration)
    });
  }
  
  // Sort by compatibility (highest first)
  return recommendations.sort((a, b) => b.compatibility - a.compatibility);
};

/**
 * Analyze communication impact of a phone number.
 * @param phoneNumber - Phone number string
 * @param lifePathNumber - User's Life Path number
 * @returns Communication impact analysis
 */
export interface CommunicationImpact {
  phoneAnalysis: PhoneAnalysis;
  compatibility: number;
  communicationStrengths: { ro: string[]; en: string[]; ru: string[] };
  communicationChallenges: { ro: string[]; en: string[]; ru: string[] };
  overallImpact: { ro: string; en: string; ru: string };
}

export const analyzeCommunicationImpact = (
  phoneNumber: string,
  lifePathNumber: number
): CommunicationImpact => {
  const phoneAnalysis = analyzePhoneNumber(phoneNumber);
  const compatibility = calculatePhoneCompatibility(lifePathNumber, phoneAnalysis.mainVibration);
  
  return {
    phoneAnalysis,
    compatibility,
    communicationStrengths: getCommunicationStrengths(phoneAnalysis.mainVibration),
    communicationChallenges: getCommunicationChallenges(phoneAnalysis.mainVibration),
    overallImpact: getOverallCommunicationImpact(compatibility, phoneAnalysis.mainVibration)
  };
};

/**
 * Calculate compatibility between Life Path and phone number.
 */
const calculatePhoneCompatibility = (lifePath: number, phoneVibration: number): number => {
  const reducedLifePath = reduceToSingleDigit(lifePath, false);
  const reducedPhone = reduceToSingleDigit(phoneVibration, false);
  
  // Perfect match
  if (reducedLifePath === reducedPhone) {
    return 100;
  }
  
  // Calculate difference
  const diff = Math.abs(reducedLifePath - reducedPhone);
  
  // Compatibility score
  const baseScore = 100 - (diff * 15);
  
  // Bonus for complementary numbers
  const complementaryPairs: [number, number][] = [
    [1, 9], [2, 8], [3, 7], [4, 6]
  ];
  
  const isComplementary = complementaryPairs.some(
    ([a, b]) => (a === reducedLifePath && b === reducedPhone) || 
                (a === reducedPhone && b === reducedLifePath)
  );
  
  return Math.max(0, Math.min(100, baseScore + (isComplementary ? 15 : 0)));
};

/**
 * Get communication style for a phone number vibration.
 */
const getCommunicationStyle = (num: number): { ro: string; en: string; ru: string } => {
  const reduced = reduceToSingleDigit(num, false);
  
  const styles: Record<number, { ro: string; en: string; ru: string }> = {
    1: {
      ro: "Comunicare directă și assertivă. Preferi să conduci conversațiile.",
      en: "Direct and assertive communication. You prefer to lead conversations.",
      ru: "Прямое и напористое общение. Вы предпочитаете вести разговоры."
    },
    2: {
      ro: "Comunicare diplomatică și sensibilă. Asculți activ și cooperezi.",
      en: "Diplomatic and sensitive communication. You listen actively and cooperate.",
      ru: "Дипломатичное и чувствительное общение. Вы активно слушаете и сотрудничаете."
    },
    3: {
      ro: "Comunicare creativă și expresivă. Folosești umor și creativitate.",
      en: "Creative and expressive communication. You use humor and creativity.",
      ru: "Творческое и выразительное общение. Вы используете юмор и творчество."
    },
    4: {
      ro: "Comunicare practică și organizată. Preferi claritatea și structura.",
      en: "Practical and organized communication. You prefer clarity and structure.",
      ru: "Практичное и организованное общение. Вы предпочитаете ясность и структуру."
    },
    5: {
      ro: "Comunicare dinamică și versatilă. Adaptezi stilul la situație.",
      en: "Dynamic and versatile communication. You adapt style to situation.",
      ru: "Динамичное и универсальное общение. Вы адаптируете стиль к ситуации."
    },
    6: {
      ro: "Comunicare empatică și grijulie. Te concentrezi pe relații.",
      en: "Empathetic and caring communication. You focus on relationships.",
      ru: "Эмпатичное и заботливое общение. Вы сосредоточены на отношениях."
    },
    7: {
      ro: "Comunicare analitică și profundă. Preferi conversații intelectuale.",
      en: "Analytical and deep communication. You prefer intellectual conversations.",
      ru: "Аналитическое и глубокое общение. Вы предпочитаете интеллектуальные беседы."
    },
    8: {
      ro: "Comunicare autoritară și eficientă. Te concentrezi pe rezultate.",
      en: "Authoritative and efficient communication. You focus on results.",
      ru: "Авторитетное и эффективное общение. Вы сосредоточены на результатах."
    },
    9: {
      ro: "Comunicare compasiune și înțelegere. Te concentrezi pe binele comun.",
      en: "Compassionate and understanding communication. You focus on common good.",
      ru: "Сострадательное и понимающее общение. Вы сосредоточены на общем благе."
    }
  };
  
  return styles[reduced] || styles[1];
};

/**
 * Get phone impact description.
 */
const getPhoneImpact = (num: number): { ro: string; en: string; ru: string } => {
  const reduced = reduceToSingleDigit(num, false);
  
  const impacts: Record<number, { ro: string; en: string; ru: string }> = {
    1: {
      ro: "Număr care favorizează leadership și inițiativă în comunicare.",
      en: "Number that favors leadership and initiative in communication.",
      ru: "Число, благоприятствующее лидерству и инициативе в общении."
    },
    2: {
      ro: "Număr care favorizează cooperarea și armonia în relații.",
      en: "Number that favors cooperation and harmony in relationships.",
      ru: "Число, благоприятствующее сотрудничеству и гармонии в отношениях."
    },
    3: {
      ro: "Număr care favorizează creativitatea și expresia în comunicare.",
      en: "Number that favors creativity and expression in communication.",
      ru: "Число, благоприятствующее творчеству и выражению в общении."
    },
    4: {
      ro: "Număr care favorizează stabilitatea și organizarea.",
      en: "Number that favors stability and organization.",
      ru: "Число, благоприятствующее стабильности и организации."
    },
    5: {
      ro: "Număr care favorizează schimbările și adaptabilitatea.",
      en: "Number that favors changes and adaptability.",
      ru: "Число, благоприятствующее переменам и адаптивности."
    },
    6: {
      ro: "Număr care favorizează responsabilitatea și grija pentru alții.",
      en: "Number that favors responsibility and care for others.",
      ru: "Число, благоприятствующее ответственности и заботе о других."
    },
    7: {
      ro: "Număr care favorizează introspecția și înțelepciunea.",
      en: "Number that favors introspection and wisdom.",
      ru: "Число, благоприятствующее самоанализу и мудрости."
    },
    8: {
      ro: "Număr care favorizează succesul material și realizările.",
      en: "Number that favors material success and achievements.",
      ru: "Число, благоприятствующее материальному успеху и достижениям."
    },
    9: {
      ro: "Număr care favorizează compasiunea și serviciul.",
      en: "Number that favors compassion and service.",
      ru: "Число, благоприятствующее состраданию и служению."
    }
  };
  
  return impacts[reduced] || impacts[1];
};

/**
 * Get phone recommendation.
 */
const getPhoneRecommendation = (num: number): { ro: string; en: string; ru: string } => {
  const reduced = reduceToSingleDigit(num, false);
  
  const recommendations: Record<number, { ro: string; en: string; ru: string }> = {
    1: {
      ro: "Excelent pentru leadership și inițiativă. Ideal pentru afaceri.",
      en: "Excellent for leadership and initiative. Ideal for business.",
      ru: "Отлично для лидерства и инициативы. Идеален для бизнеса."
    },
    8: {
      ro: "Excelent pentru succes material și realizări. Ideal pentru afaceri.",
      en: "Excellent for material success and achievements. Ideal for business.",
      ru: "Отлично для материального успеха и достижений. Идеален для бизнеса."
    }
  };
  
  return recommendations[reduced] || {
    ro: "Număr potrivit pentru comunicare generală.",
    en: "Suitable number for general communication.",
    ru: "Подходящий номер для общего общения."
  };
};

/**
 * Get phone recommendation text based on compatibility.
 */
const getPhoneRecommendationText = (
  compatibility: number,
  phoneVibration: number
): { ro: string; en: string; ru: string } => {
  if (compatibility >= 90) {
    return {
      ro: "Număr excelent! Foarte compatibil cu energia ta personală.",
      en: "Excellent number! Very compatible with your personal energy.",
      ru: "Отличный номер! Очень совместим с вашей личной энергией."
    };
  } else if (compatibility >= 70) {
    return {
      ro: "Număr bun. Poate aduce energie pozitivă în comunicare.",
      en: "Good number. Can bring positive energy in communication.",
      ru: "Хороший номер. Может принести положительную энергию в общении."
    };
  } else {
    return {
      ro: "Număr acceptabil, dar nu ideal. Consideră alternative.",
      en: "Acceptable number, but not ideal. Consider alternatives.",
      ru: "Приемлемый номер, но не идеальный. Рассмотрите альтернативы."
    };
  }
};

/**
 * Get stability description for landline.
 */
const getStabilityDescription = (score: number): { ro: string; en: string; ru: string } => {
  if (score >= 7) {
    return {
      ro: "Stabilitate foarte mare. Ideal pentru afaceri și activități de lungă durată.",
      en: "Very high stability. Ideal for business and long-term activities.",
      ru: "Очень высокая стабильность. Идеален для бизнеса и долгосрочной деятельности."
    };
  } else if (score >= 4) {
    return {
      ro: "Stabilitate moderată. Bun pentru uz general.",
      en: "Moderate stability. Good for general use.",
      ru: "Умеренная стабильность. Хорошо для общего использования."
    };
  } else {
    return {
      ro: "Stabilitate scăzută. Poate necesita mai multă atenție.",
      en: "Low stability. May require more attention.",
      ru: "Низкая стабильность. Может потребовать больше внимания."
    };
  }
};

/**
 * Get business suitability for landline.
 */
const getBusinessSuitability = (vibration: number): { ro: string; en: string; ru: string } => {
  const reduced = reduceToSingleDigit(vibration, false);
  
  // Numbers 1, 4, 8 are best for business
  if ([1, 4, 8].includes(reduced)) {
    return {
      ro: "Excelent pentru afaceri. Favorizează succesul profesional.",
      en: "Excellent for business. Favors professional success.",
      ru: "Отлично для бизнеса. Благоприятствует профессиональному успеху."
    };
  } else if ([2, 6].includes(reduced)) {
    return {
      ro: "Bun pentru afaceri bazate pe relații și servicii.",
      en: "Good for relationship and service-based businesses.",
      ru: "Хорошо для бизнеса, основанного на отношениях и услугах."
    };
  } else {
    return {
      ro: "Acceptabil pentru afaceri, dar nu ideal.",
      en: "Acceptable for business, but not ideal.",
      ru: "Приемлемо для бизнеса, но не идеально."
    };
  }
};

/**
 * Get communication strengths.
 */
const getCommunicationStrengths = (num: number): { ro: string[]; en: string[]; ru: string[] } => {
  const reduced = reduceToSingleDigit(num, false);
  
  const strengths: Record<number, { ro: string[]; en: string[]; ru: string[] }> = {
    1: {
      ro: ["Claritate", "Convingere", "Leadership"],
      en: ["Clarity", "Persuasion", "Leadership"],
      ru: ["Ясность", "Убедительность", "Лидерство"]
    },
    2: {
      ro: ["Diplomație", "Empatie", "Cooperare"],
      en: ["Diplomacy", "Empathy", "Cooperation"],
      ru: ["Дипломатия", "Эмпатия", "Сотрудничество"]
    },
    3: {
      ro: ["Creativitate", "Expresivitate", "Energie"],
      en: ["Creativity", "Expressiveness", "Energy"],
      ru: ["Творчество", "Выразительность", "Энергия"]
    }
  };
  
  return strengths[reduced] || {
    ro: ["Comunicare eficientă"],
    en: ["Efficient communication"],
    ru: ["Эффективное общение"]
  };
};

/**
 * Get communication challenges.
 */
const getCommunicationChallenges = (num: number): { ro: string[]; en: string[]; ru: string[] } => {
  const reduced = reduceToSingleDigit(num, false);
  
  const challenges: Record<number, { ro: string[]; en: string[]; ru: string[] }> = {
    1: {
      ro: ["Poate fi prea direct", "Risc de dominare"],
      en: ["May be too direct", "Risk of dominance"],
      ru: ["Может быть слишком прямым", "Риск доминирования"]
    },
    2: {
      ro: ["Poate fi prea pasiv", "Risc de indecisie"],
      en: ["May be too passive", "Risk of indecision"],
      ru: ["Может быть слишком пассивным", "Риск нерешительности"]
    },
    3: {
      ro: ["Poate fi prea expresiv", "Risc de superficialitate"],
      en: ["May be too expressive", "Risk of superficiality"],
      ru: ["Может быть слишком выразительным", "Риск поверхностности"]
    }
  };
  
  return challenges[reduced] || {
    ro: ["Fără provocări majore"],
    en: ["No major challenges"],
    ru: ["Нет серьёзных вызовов"]
  };
};

/**
 * Get overall communication impact.
 */
const getOverallCommunicationImpact = (
  compatibility: number,
  vibration: number
): { ro: string; en: string; ru: string } => {
  if (compatibility >= 80) {
    return {
      ro: "Impact foarte pozitiv asupra comunicării tale. Număr recomandat.",
      en: "Very positive impact on your communication. Recommended number.",
      ru: "Очень положительное влияние на ваше общение. Рекомендуемый номер."
    };
  } else if (compatibility >= 60) {
    return {
      ro: "Impact pozitiv asupra comunicării. Număr potrivit.",
      en: "Positive impact on communication. Suitable number.",
      ru: "Положительное влияние на общение. Подходящий номер."
    };
  } else {
    return {
      ro: "Impact neutru sau negativ. Consideră alternative.",
      en: "Neutral or negative impact. Consider alternatives.",
      ru: "Нейтральное или отрицательное влияние. Рассмотрите альтернативы."
    };
  }
};

