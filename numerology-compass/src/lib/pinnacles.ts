import { 
  reduceToSingleDigit,
  calculateLifePathNumber,
  calculateDestinyNumber,
  calculateSoulUrgeNumber,
  calculatePersonalityNumber,
  calculateMaturityNumber
} from "./numerology";

export interface PinnacleData {
  number: number;
  startAge: number;
  endAge: number;
  period: number; // 1-4
}

export interface ChallengeData {
  number: number;
  period: number; // 1-4
}

// Calculate the 4 Pinnacle Numbers
export const calculatePinnacles = (birthDate: Date): PinnacleData[] => {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();

  const reducedDay = reduceToSingleDigit(day, false);
  const reducedMonth = reduceToSingleDigit(month, false);
  const reducedYear = reduceToSingleDigit(
    String(year).split('').reduce((sum, digit) => sum + parseInt(digit), 0),
    false
  );

  // Life Path Number determines the timing
  const lifePath = reduceToSingleDigit(reducedDay + reducedMonth + reducedYear, false);
  
  // First pinnacle ends at age 36 - Life Path Number
  const firstPinnacleEnd = 36 - lifePath;
  
  // Pinnacle calculations
  const pinnacle1 = reduceToSingleDigit(reducedMonth + reducedDay, true);
  const pinnacle2 = reduceToSingleDigit(reducedDay + reducedYear, true);
  const pinnacle3 = reduceToSingleDigit(pinnacle1 + pinnacle2, true);
  const pinnacle4 = reduceToSingleDigit(reducedMonth + reducedYear, true);

  return [
    { number: pinnacle1, startAge: 0, endAge: firstPinnacleEnd, period: 1 },
    { number: pinnacle2, startAge: firstPinnacleEnd + 1, endAge: firstPinnacleEnd + 9, period: 2 },
    { number: pinnacle3, startAge: firstPinnacleEnd + 10, endAge: firstPinnacleEnd + 18, period: 3 },
    { number: pinnacle4, startAge: firstPinnacleEnd + 19, endAge: 99, period: 4 },
  ];
};

// Calculate the 4 Challenge Numbers
export const calculateChallenges = (birthDate: Date): ChallengeData[] => {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();

  const reducedDay = reduceToSingleDigit(day, false);
  const reducedMonth = reduceToSingleDigit(month, false);
  const reducedYear = reduceToSingleDigit(
    String(year).split('').reduce((sum, digit) => sum + parseInt(digit), 0),
    false
  );

  // Challenge calculations (absolute differences)
  const challenge1 = Math.abs(reducedMonth - reducedDay);
  const challenge2 = Math.abs(reducedDay - reducedYear);
  const challenge3 = Math.abs(challenge1 - challenge2);
  const challenge4 = Math.abs(reducedMonth - reducedYear);

  return [
    { number: challenge1, period: 1 },
    { number: challenge2, period: 2 },
    { number: challenge3, period: 3 },
    { number: challenge4, period: 4 },
  ];
};

// Get current pinnacle based on age
export const getCurrentPinnacle = (birthDate: Date): PinnacleData | null => {
  const pinnacles = calculatePinnacles(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  
  return pinnacles.find(p => age >= p.startAge && age <= p.endAge) || pinnacles[3];
};

// Get current challenge based on age
export const getCurrentChallenge = (birthDate: Date): ChallengeData | null => {
  const challenges = calculateChallenges(birthDate);
  const pinnacles = calculatePinnacles(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  
  for (let i = 0; i < pinnacles.length; i++) {
    if (age >= pinnacles[i].startAge && age <= pinnacles[i].endAge) {
      return challenges[i];
    }
  }
  return challenges[3];
};

/**
 * Calculate Achievement Numbers (hidden talents and potential).
 * These numbers reveal talents that may not be immediately obvious but can be developed.
 * @param birthDate - Birth date
 * @param fullName - Full name at birth
 * @returns Array of achievement numbers representing hidden talents
 */
export interface AchievementData {
  number: number;
  source: 'lifePath' | 'destiny' | 'soulUrge' | 'personality' | 'maturity';
  description: { ro: string; en: string; ru: string };
}

export const calculateAchievements = (
  birthDate: Date,
  fullName: string
): AchievementData[] => {
  const lifePath = calculateLifePathNumber(birthDate);
  const destiny = calculateDestinyNumber(fullName);
  const soulUrge = calculateSoulUrgeNumber(fullName);
  const personality = calculatePersonalityNumber(fullName);
  const maturity = calculateMaturityNumber(birthDate, fullName);
  
  // Collect unique numbers
  const numbers = [
    { num: lifePath, source: 'lifePath' as const },
    { num: destiny, source: 'destiny' as const },
    { num: soulUrge, source: 'soulUrge' as const },
    { num: personality, source: 'personality' as const },
    { num: maturity, source: 'maturity' as const }
  ];
  
  // Find numbers that appear multiple times (stronger talents)
  const frequencyMap = new Map<number, { count: number; sources: Array<'lifePath' | 'destiny' | 'soulUrge' | 'personality' | 'maturity'> }>();
  
  for (const { num, source } of numbers) {
    const reduced = reduceToSingleDigit(num, false);
    const existing = frequencyMap.get(reduced) || { count: 0, sources: [] };
    frequencyMap.set(reduced, {
      count: existing.count + 1,
      sources: [...existing.sources, source]
    });
  }
  
  // Convert to achievement data, prioritizing numbers that appear multiple times
  const achievementMap = new Map<number, AchievementData>();
  
  for (const [num, { sources }] of frequencyMap.entries()) {
    if (!achievementMap.has(num)) {
      const meaning = getAchievementMeaning(num);
      achievementMap.set(num, {
        number: num,
        source: sources[0],
        description: meaning
      });
    }
  }
  
  return Array.from(achievementMap.values())
    .sort((a, b) => {
      const aFreq = frequencyMap.get(a.number)?.count || 0;
      const bFreq = frequencyMap.get(b.number)?.count || 0;
      return bFreq - aFreq; // Higher frequency first
    });
};

/**
 * Get achievement meaning for a number.
 * @param num - Number (1-9)
 * @returns Achievement description in all languages
 */
const getAchievementMeaning = (num: number): { ro: string; en: string; ru: string } => {
  const meanings: Record<number, { ro: string; en: string; ru: string }> = {
    1: {
      ro: "Talent pentru leadership și inițiativă. Poți conduce și inova.",
      en: "Talent for leadership and initiative. You can lead and innovate.",
      ru: "Талант к лидерству и инициативе. Вы можете вести и инноваровать."
    },
    2: {
      ro: "Talent pentru cooperare și diplomație. Poți crea armonie.",
      en: "Talent for cooperation and diplomacy. You can create harmony.",
      ru: "Талант к сотрудничеству и дипломатии. Вы можете создавать гармонию."
    },
    3: {
      ro: "Talent creativ și expresiv. Poți inspira prin artă și comunicare.",
      en: "Creative and expressive talent. You can inspire through art and communication.",
      ru: "Творческий и выразительный талант. Вы можете вдохновлять через искусство и общение."
    },
    4: {
      ro: "Talent pentru construcție și organizare. Poți construi fundații solide.",
      en: "Talent for building and organization. You can build solid foundations.",
      ru: "Талант к строительству и организации. Вы можете строить прочные основы."
    },
    5: {
      ro: "Talent pentru adaptare și explorare. Poți prospera în schimbare.",
      en: "Talent for adaptation and exploration. You can thrive in change.",
      ru: "Талант к адаптации и исследованию. Вы можете процветать в переменах."
    },
    6: {
      ro: "Talent pentru îngrijire și responsabilitate. Poți proteja și ajuta.",
      en: "Talent for care and responsibility. You can protect and help.",
      ru: "Талант к заботе и ответственности. Вы можете защищать и помогать."
    },
    7: {
      ro: "Talent pentru analiză și înțelepciune. Poți descoperi adevăruri profunde.",
      en: "Talent for analysis and wisdom. You can discover deep truths.",
      ru: "Талант к анализу и мудрости. Вы можете открывать глубокие истины."
    },
    8: {
      ro: "Talent pentru realizare materială. Poți construi abundență.",
      en: "Talent for material achievement. You can build abundance.",
      ru: "Талант к материальным достижениям. Вы можете создавать изобилие."
    },
    9: {
      ro: "Talent pentru compasiune și serviciu. Poți ajuta umanitatea.",
      en: "Talent for compassion and service. You can help humanity.",
      ru: "Талант к состраданию и служению. Вы можете помогать человечеству."
    }
  };
  
  return meanings[num] || {
    ro: "Talent ascuns care poate fi dezvoltat.",
    en: "Hidden talent that can be developed.",
    ru: "Скрытый талант, который можно развить."
  };
};

// Pinnacle interpretations
export const PINNACLE_MEANINGS: Record<number, { title: { ro: string; en: string; ru: string }; description: { ro: string; en: string; ru: string } }> = {
  1: {
    title: { ro: "Independență și Inițiativă", en: "Independence and Initiative", ru: "Независимость и Инициатива" },
    description: {
      ro: "Această perioadă te cheamă să îți dezvolți independența și să preiei inițiativa în viață. Este timpul să îți urmezi propriile idei și să fii un lider.",
      en: "This period calls you to develop your independence and take initiative in life. It's time to follow your own ideas and be a leader.",
      ru: "Этот период призывает вас развивать независимость и проявлять инициативу в жизни. Время следовать собственным идеям и быть лидером."
    }
  },
  2: {
    title: { ro: "Cooperare și Diplomație", en: "Cooperation and Diplomacy", ru: "Сотрудничество и Дипломатия" },
    description: {
      ro: "Perioada pune accent pe parteneriate, răbdare și sensibilitate. Succesul vine prin colaborare și înțelegerea nevoilor altora.",
      en: "This period emphasizes partnerships, patience, and sensitivity. Success comes through collaboration and understanding others' needs.",
      ru: "Период делает акцент на партнёрстве, терпении и чувствительности. Успех приходит через сотрудничество и понимание потребностей других."
    }
  },
  3: {
    title: { ro: "Expresie Creativă", en: "Creative Expression", ru: "Творческое Выражение" },
    description: {
      ro: "O perioadă de creativitate, bucurie și auto-exprimare. Este momentul să îți dezvolți talentele artistice și să comunici cu lumea.",
      en: "A period of creativity, joy, and self-expression. It's time to develop your artistic talents and communicate with the world.",
      ru: "Период творчества, радости и самовыражения. Время развивать художественные таланты и общаться с миром."
    }
  },
  4: {
    title: { ro: "Construcție și Stabilitate", en: "Building and Stability", ru: "Строительство и Стабильность" },
    description: {
      ro: "Perioadă de muncă asiduă și construire a fundamentelor solide. Disciplina și organizarea sunt esențiale pentru succes.",
      en: "A period of hard work and building solid foundations. Discipline and organization are essential for success.",
      ru: "Период упорной работы и построения прочных основ. Дисциплина и организация необходимы для успеха."
    }
  },
  5: {
    title: { ro: "Schimbare și Libertate", en: "Change and Freedom", ru: "Перемены и Свобода" },
    description: {
      ro: "O perioadă dinamică de schimbări și oportunități noi. Adaptabilitatea și curajul de a explora sunt cheile progresului.",
      en: "A dynamic period of changes and new opportunities. Adaptability and courage to explore are the keys to progress.",
      ru: "Динамичный период перемен и новых возможностей. Адаптивность и смелость исследовать — ключи к прогрессу."
    }
  },
  6: {
    title: { ro: "Responsabilitate și Armonie", en: "Responsibility and Harmony", ru: "Ответственность и Гармония" },
    description: {
      ro: "Perioadă centrată pe familie, responsabilități casnice și serviciu față de alții. Armonia în relații este prioritară.",
      en: "Period centered on family, domestic responsibilities, and service to others. Harmony in relationships is a priority.",
      ru: "Период, сосредоточенный на семье, домашних обязанностях и служении другим. Гармония в отношениях приоритетна."
    }
  },
  7: {
    title: { ro: "Introspecție și Cunoaștere", en: "Introspection and Knowledge", ru: "Самоанализ и Познание" },
    description: {
      ro: "O perioadă de căutare interioară și dezvoltare spirituală. Timpul pentru studiu, reflecție și găsirea sensului profund.",
      en: "A period of inner searching and spiritual development. Time for study, reflection, and finding deeper meaning.",
      ru: "Период внутреннего поиска и духовного развития. Время для учёбы, размышлений и поиска глубокого смысла."
    }
  },
  8: {
    title: { ro: "Realizare și Abundență", en: "Achievement and Abundance", ru: "Достижение и Изобилие" },
    description: {
      ro: "Perioadă de succes material și recunoaștere. Abilitățile de leadership și viziunea de afaceri sunt recompensate.",
      en: "Period of material success and recognition. Leadership abilities and business vision are rewarded.",
      ru: "Период материального успеха и признания. Лидерские способности и деловое видение вознаграждаются."
    }
  },
  9: {
    title: { ro: "Compasiune și Finalizare", en: "Compassion and Completion", ru: "Сострадание и Завершение" },
    description: {
      ro: "O perioadă de generozitate, eliberare și serviciu umanitar. Timpul pentru a încheia cicluri vechi și a ajuta pe alții.",
      en: "A period of generosity, release, and humanitarian service. Time to close old cycles and help others.",
      ru: "Период щедрости, освобождения и гуманитарного служения. Время закрыть старые циклы и помогать другим."
    }
  },
  11: {
    title: { ro: "Iluminare și Inspirație", en: "Illumination and Inspiration", ru: "Просветление и Вдохновение" },
    description: {
      ro: "O perioadă master de intuiție intensificată și inspirație spirituală. Ești chemat să iluminezi calea altora.",
      en: "A master period of heightened intuition and spiritual inspiration. You are called to illuminate the path for others.",
      ru: "Мастер-период обострённой интуиции и духовного вдохновения. Вы призваны освещать путь другим."
    }
  },
  22: {
    title: { ro: "Construcție Maestră", en: "Master Building", ru: "Мастерское Строительство" },
    description: {
      ro: "Perioadă de manifestare la scară largă. Ai potențialul de a crea proiecte care să beneficieze mulți oameni.",
      en: "Period of large-scale manifestation. You have the potential to create projects that benefit many people.",
      ru: "Период крупномасштабного проявления. У вас есть потенциал создавать проекты, которые принесут пользу многим."
    }
  },
  33: {
    title: { ro: "Învățătură și Vindecare", en: "Teaching and Healing", ru: "Обучение и Исцеление" },
    description: {
      ro: "Cea mai înaltă vibrație a pinnacle-urilor. O chemare pentru a fi un ghid spiritual și vindecător pentru umanitate.",
      en: "The highest vibration of pinnacles. A calling to be a spiritual guide and healer for humanity.",
      ru: "Высшая вибрация вершин. Призвание быть духовным наставником и целителем для человечества."
    }
  }
};

// Challenge interpretations (0-8)
export const CHALLENGE_MEANINGS: Record<number, { title: { ro: string; en: string; ru: string }; description: { ro: string; en: string; ru: string } }> = {
  0: {
    title: { ro: "Alegerea Liberă", en: "Free Choice", ru: "Свободный Выбор" },
    description: {
      ro: "Provocarea 0 este rară și specială. Ai de-a face cu toate provocările și niciuna simultan. Libertatea de alegere este și binecuvântare și responsabilitate.",
      en: "Challenge 0 is rare and special. You deal with all challenges and none simultaneously. Freedom of choice is both a blessing and responsibility.",
      ru: "Вызов 0 редкий и особенный. Вы имеете дело со всеми вызовами и ни с одним одновременно. Свобода выбора — благословение и ответственность."
    }
  },
  1: {
    title: { ro: "Încredere în Sine", en: "Self-Confidence", ru: "Уверенность в Себе" },
    description: {
      ro: "Lecția este să îți dezvolți încrederea în sine și independența. Evită extremele de agresivitate sau pasivitate.",
      en: "The lesson is to develop self-confidence and independence. Avoid extremes of aggressiveness or passivity.",
      ru: "Урок — развить уверенность в себе и независимость. Избегайте крайностей агрессивности или пассивности."
    }
  },
  2: {
    title: { ro: "Sensibilitate și Cooperare", en: "Sensitivity and Cooperation", ru: "Чувствительность и Сотрудничество" },
    description: {
      ro: "Provocarea este să găsești echilibrul între sensibilitate și forță. Învață să cooperezi fără a te pierde pe tine.",
      en: "The challenge is to find balance between sensitivity and strength. Learn to cooperate without losing yourself.",
      ru: "Вызов — найти баланс между чувствительностью и силой. Научитесь сотрудничать, не теряя себя."
    }
  },
  3: {
    title: { ro: "Exprimare Autentică", en: "Authentic Expression", ru: "Подлинное Выражение" },
    description: {
      ro: "Lecția este să îți exprimi creativitatea și emoțiile într-un mod sănătos. Evită auto-critica excesivă.",
      en: "The lesson is to express your creativity and emotions in a healthy way. Avoid excessive self-criticism.",
      ru: "Урок — выражать творчество и эмоции здоровым образом. Избегайте чрезмерной самокритики."
    }
  },
  4: {
    title: { ro: "Ordine și Disciplină", en: "Order and Discipline", ru: "Порядок и Дисциплина" },
    description: {
      ro: "Provocarea este să găsești echilibrul între muncă și viață. Învață să construiești fără a deveni rigid.",
      en: "The challenge is to find balance between work and life. Learn to build without becoming rigid.",
      ru: "Вызов — найти баланс между работой и жизнью. Научитесь строить, не становясь жёстким."
    }
  },
  5: {
    title: { ro: "Libertate Responsabilă", en: "Responsible Freedom", ru: "Ответственная Свобода" },
    description: {
      ro: "Lecția este să îți folosești libertatea cu înțelepciune. Evită excesele și impulsivitatea distructivă.",
      en: "The lesson is to use your freedom wisely. Avoid excess and destructive impulsivity.",
      ru: "Урок — мудро использовать свободу. Избегайте излишеств и разрушительной импульсивности."
    }
  },
  6: {
    title: { ro: "Responsabilitate Echilibrată", en: "Balanced Responsibility", ru: "Сбалансированная Ответственность" },
    description: {
      ro: "Provocarea este să ai grijă de alții fără a te neglija pe tine. Evită perfecționismul și controlul excesiv.",
      en: "The challenge is to care for others without neglecting yourself. Avoid perfectionism and excessive control.",
      ru: "Вызов — заботиться о других, не пренебрегая собой. Избегайте перфекционизма и чрезмерного контроля."
    }
  },
  7: {
    title: { ro: "Încredere și Deschidere", en: "Trust and Openness", ru: "Доверие и Открытость" },
    description: {
      ro: "Lecția este să găsești echilibrul între analiză și intuiție. Evită izolarea și scepticismul excesiv.",
      en: "The lesson is to find balance between analysis and intuition. Avoid isolation and excessive skepticism.",
      ru: "Урок — найти баланс между анализом и интуицией. Избегайте изоляции и чрезмерного скептицизма."
    }
  },
  8: {
    title: { ro: "Putere și Integritate", en: "Power and Integrity", ru: "Сила и Честность" },
    description: {
      ro: "Provocarea este să folosești puterea și resursele cu integritate. Evită materialismul și manipularea.",
      en: "The challenge is to use power and resources with integrity. Avoid materialism and manipulation.",
      ru: "Вызов — использовать силу и ресурсы честно. Избегайте материализма и манипуляций."
    }
  }
};
