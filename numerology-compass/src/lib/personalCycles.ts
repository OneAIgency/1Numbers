import { 
  reduceToSingleDigit,
  calculateLifePathNumber,
  calculateDestinyNumber,
  calculatePersonalYearNumber
} from "./numerology";

// Calculate Personal Month Number
export const calculatePersonalMonthNumber = (
  birthDate: Date, 
  year: number = new Date().getFullYear(),
  month: number = new Date().getMonth() + 1
): number => {
  const day = birthDate.getDate();
  const birthMonth = birthDate.getMonth() + 1;
  
  const reducedDay = reduceToSingleDigit(day, false);
  const reducedBirthMonth = reduceToSingleDigit(birthMonth, false);
  const reducedYear = reduceToSingleDigit(
    String(year).split('').reduce((sum, digit) => sum + parseInt(digit), 0),
    false
  );
  
  // Personal Year
  const personalYear = reduceToSingleDigit(reducedDay + reducedBirthMonth + reducedYear, false);
  
  // Personal Month = Personal Year + Calendar Month
  const reducedMonth = reduceToSingleDigit(month, false);
  return reduceToSingleDigit(personalYear + reducedMonth, false);
};

// Calculate Personal Day Number
export const calculatePersonalDayNumber = (
  birthDate: Date,
  targetDate: Date = new Date()
): number => {
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const dayOfMonth = targetDate.getDate();
  
  // Get Personal Month
  const personalMonth = calculatePersonalMonthNumber(birthDate, year, month);
  
  // Personal Day = Personal Month + Day of Month
  const reducedDay = reduceToSingleDigit(dayOfMonth, false);
  return reduceToSingleDigit(personalMonth + reducedDay, false);
};

// Calculate Universal Year
export const calculateUniversalYear = (year: number = new Date().getFullYear()): number => {
  return reduceToSingleDigit(
    String(year).split('').reduce((sum, digit) => sum + parseInt(digit), 0),
    false
  );
};

// Calculate Universal Month
export const calculateUniversalMonth = (
  year: number = new Date().getFullYear(),
  month: number = new Date().getMonth() + 1
): number => {
  const universalYear = calculateUniversalYear(year);
  return reduceToSingleDigit(universalYear + month, false);
};

// Calculate Universal Day
export const calculateUniversalDay = (date: Date = new Date()): number => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const universalMonth = calculateUniversalMonth(year, month);
  return reduceToSingleDigit(universalMonth + day, false);
};

// Personal cycle meanings
export const PERSONAL_CYCLE_MEANINGS: Record<number, {
  keywords: { ro: string; en: string; ru: string };
  dayMeaning: { ro: string; en: string; ru: string };
  monthMeaning: { ro: string; en: string; ru: string };
}> = {
  1: {
    keywords: { ro: "Începuturi, Inițiativă", en: "Beginnings, Initiative", ru: "Начинания, Инициатива" },
    dayMeaning: {
      ro: "Zi excelentă pentru a începe proiecte noi, a lua inițiativa și a te afirma.",
      en: "Excellent day to start new projects, take initiative, and assert yourself.",
      ru: "Отличный день для начала новых проектов, проявления инициативы и самоутверждения."
    },
    monthMeaning: {
      ro: "Lună de noi începuturi. Plantează semințele pentru ceea ce vrei să crească.",
      en: "Month of new beginnings. Plant seeds for what you want to grow.",
      ru: "Месяц новых начинаний. Сейте семена того, что хотите вырастить."
    }
  },
  2: {
    keywords: { ro: "Cooperare, Răbdare", en: "Cooperation, Patience", ru: "Сотрудничество, Терпение" },
    dayMeaning: {
      ro: "Zi pentru diplomație, parteneriate și detalii. Evită deciziile grăbite.",
      en: "Day for diplomacy, partnerships, and details. Avoid hasty decisions.",
      ru: "День для дипломатии, партнёрства и деталей. Избегайте поспешных решений."
    },
    monthMeaning: {
      ro: "Lună pentru construirea relațiilor și acordarea atenției la detalii.",
      en: "Month for building relationships and paying attention to details.",
      ru: "Месяц для построения отношений и внимания к деталям."
    }
  },
  3: {
    keywords: { ro: "Creativitate, Expresie", en: "Creativity, Expression", ru: "Творчество, Выражение" },
    dayMeaning: {
      ro: "Zi excelentă pentru activități creative, socializare și exprimarea ideilor.",
      en: "Excellent day for creative activities, socializing, and expressing ideas.",
      ru: "Отличный день для творчества, общения и выражения идей."
    },
    monthMeaning: {
      ro: "Lună de exprimare creativă și bucurie. Lasă-ți imaginația să zboare.",
      en: "Month of creative expression and joy. Let your imagination soar.",
      ru: "Месяц творческого самовыражения и радости. Дайте волю воображению."
    }
  },
  4: {
    keywords: { ro: "Muncă, Fundament", en: "Work, Foundation", ru: "Работа, Основа" },
    dayMeaning: {
      ro: "Zi pentru muncă practică, organizare și construirea fundamentelor solide.",
      en: "Day for practical work, organization, and building solid foundations.",
      ru: "День для практической работы, организации и построения прочных основ."
    },
    monthMeaning: {
      ro: "Lună de efort susținut. Construiește cu răbdare și disciplină.",
      en: "Month of sustained effort. Build with patience and discipline.",
      ru: "Месяц устойчивых усилий. Стройте с терпением и дисциплиной."
    }
  },
  5: {
    keywords: { ro: "Schimbare, Aventură", en: "Change, Adventure", ru: "Перемены, Приключения" },
    dayMeaning: {
      ro: "Zi pentru schimbări, călătorii și experiențe noi. Fii flexibil.",
      en: "Day for changes, travel, and new experiences. Be flexible.",
      ru: "День для перемен, путешествий и нового опыта. Будьте гибкими."
    },
    monthMeaning: {
      ro: "Lună de libertate și schimbare. Îmbrățișează oportunitățile neașteptate.",
      en: "Month of freedom and change. Embrace unexpected opportunities.",
      ru: "Месяц свободы и перемен. Используйте неожиданные возможности."
    }
  },
  6: {
    keywords: { ro: "Familie, Responsabilitate", en: "Family, Responsibility", ru: "Семья, Ответственность" },
    dayMeaning: {
      ro: "Zi pentru familie, casă și responsabilități domestice. Arată-ți grija.",
      en: "Day for family, home, and domestic responsibilities. Show your care.",
      ru: "День для семьи, дома и домашних обязанностей. Проявите заботу."
    },
    monthMeaning: {
      ro: "Lună pentru îngrijirea relațiilor și a casei. Armonia este prioritară.",
      en: "Month for nurturing relationships and home. Harmony is a priority.",
      ru: "Месяц для заботы об отношениях и доме. Гармония приоритетна."
    }
  },
  7: {
    keywords: { ro: "Reflecție, Studiu", en: "Reflection, Study", ru: "Размышление, Учёба" },
    dayMeaning: {
      ro: "Zi pentru introspecție, studiu și activități solitare. Caută înțelepciune.",
      en: "Day for introspection, study, and solitary activities. Seek wisdom.",
      ru: "День для самоанализа, учёбы и уединённых занятий. Ищите мудрость."
    },
    monthMeaning: {
      ro: "Lună pentru reflecție și creștere spirituală. Ia-ți timp pentru tine.",
      en: "Month for reflection and spiritual growth. Take time for yourself.",
      ru: "Месяц для размышлений и духовного роста. Уделите время себе."
    }
  },
  8: {
    keywords: { ro: "Realizare, Afaceri", en: "Achievement, Business", ru: "Достижение, Бизнес" },
    dayMeaning: {
      ro: "Zi excelentă pentru afaceri, negocieri și decizii financiare importante.",
      en: "Excellent day for business, negotiations, and important financial decisions.",
      ru: "Отличный день для бизнеса, переговоров и важных финансовых решений."
    },
    monthMeaning: {
      ro: "Lună de realizări și recunoaștere. Concentrează-te pe obiective materiale.",
      en: "Month of achievements and recognition. Focus on material goals.",
      ru: "Месяц достижений и признания. Сосредоточьтесь на материальных целях."
    }
  },
  9: {
    keywords: { ro: "Finalizare, Compasiune", en: "Completion, Compassion", ru: "Завершение, Сострадание" },
    dayMeaning: {
      ro: "Zi pentru finalizarea proiectelor, generozitate și eliberarea a ceea ce nu mai servește.",
      en: "Day for completing projects, generosity, and releasing what no longer serves.",
      ru: "День для завершения проектов, щедрости и освобождения от ненужного."
    },
    monthMeaning: {
      ro: "Lună de încheiere și tranziție. Pregătește-te pentru un nou ciclu.",
      en: "Month of closure and transition. Prepare for a new cycle.",
      ru: "Месяц завершения и перехода. Готовьтесь к новому циклу."
    }
  }
};

/**
 * Calculate detailed 9-year life cycles.
 * Each cycle represents a phase of personal growth and development.
 * @param birthDate - Birth date
 * @param startYear - Starting year for cycles (default: birth year)
 * @returns Array of 9-year cycle information
 */
export interface LifeCycleData {
  cycleNumber: number; // 1-9
  startYear: number;
  endYear: number;
  cycleYear: number; // Personal year within cycle (1-9)
  currentYear: number; // Current year in cycle
  theme: { ro: string; en: string; ru: string };
}

export const calculateLifeCycles = (
  birthDate: Date,
  startYear: number = birthDate.getFullYear()
): LifeCycleData[] => {
  const cycles: LifeCycleData[] = [];
  const lifePath = calculateLifePathNumber(birthDate);
  
  // Each cycle is 9 years
  for (let cycle = 1; cycle <= 9; cycle++) {
    const cycleStartYear = startYear + (cycle - 1) * 9;
    const cycleEndYear = cycleStartYear + 8;
    
    // Calculate current year in cycle (if applicable)
    const currentYear = new Date().getFullYear();
    const currentYearInCycle = currentYear >= cycleStartYear && currentYear <= cycleEndYear
      ? (currentYear - cycleStartYear + 1)
      : 0;
    
    cycles.push({
      cycleNumber: cycle,
      startYear: cycleStartYear,
      endYear: cycleEndYear,
      cycleYear: cycle,
      currentYear: currentYearInCycle,
      theme: getCycleTheme(cycle)
    });
  }
  
  return cycles;
};

/**
 * Get theme for a life cycle number (1-9).
 */
const getCycleTheme = (cycleNum: number): { ro: string; en: string; ru: string } => {
  const themes: Record<number, { ro: string; en: string; ru: string }> = {
    1: {
      ro: "Ciclu de începuturi și inițiativă",
      en: "Cycle of beginnings and initiative",
      ru: "Цикл начинаний и инициативы"
    },
    2: {
      ro: "Ciclu de cooperare și parteneriat",
      en: "Cycle of cooperation and partnership",
      ru: "Цикл сотрудничества и партнёрства"
    },
    3: {
      ro: "Ciclu de creativitate și expresie",
      en: "Cycle of creativity and expression",
      ru: "Цикл творчества и выражения"
    },
    4: {
      ro: "Ciclu de construcție și stabilitate",
      en: "Cycle of building and stability",
      ru: "Цикл строительства и стабильности"
    },
    5: {
      ro: "Ciclu de schimbare și libertate",
      en: "Cycle of change and freedom",
      ru: "Цикл перемен и свободы"
    },
    6: {
      ro: "Ciclu de responsabilitate și armonie",
      en: "Cycle of responsibility and harmony",
      ru: "Цикл ответственности и гармонии"
    },
    7: {
      ro: "Ciclu de introspecție și înțelepciune",
      en: "Cycle of introspection and wisdom",
      ru: "Цикл самоанализа и мудрости"
    },
    8: {
      ro: "Ciclu de realizare și abundență",
      en: "Cycle of achievement and abundance",
      ru: "Цикл достижений и изобилия"
    },
    9: {
      ro: "Ciclu de finalizare și compasiune",
      en: "Cycle of completion and compassion",
      ru: "Цикл завершения и сострадания"
    }
  };
  
  return themes[cycleNum] || themes[1];
};

/**
 * Calculate Peak Years - years of major transformation and achievement.
 * These are years when personal year number matches life path or destiny.
 * @param birthDate - Birth date
 * @param fullName - Full name at birth
 * @param yearsAhead - Number of years to look ahead (default: 20)
 * @returns Array of peak years with their significance
 */
export interface PeakYearData {
  year: number;
  personalYear: number;
  significance: { ro: string; en: string; ru: string };
  type: 'lifePath' | 'destiny' | 'major';
}

export const calculatePeakYears = (
  birthDate: Date,
  fullName: string,
  yearsAhead: number = 20
): PeakYearData[] => {
  const lifePath = calculateLifePathNumber(birthDate);
  const destiny = calculateDestinyNumber(fullName);
  const currentYear = new Date().getFullYear();
  const peakYears: PeakYearData[] = [];
  
  for (let i = 0; i <= yearsAhead; i++) {
    const year = currentYear + i;
    const personalYear = calculatePersonalYearNumber(birthDate, year);
    
    // Check if it's a peak year
    if (personalYear === lifePath) {
      peakYears.push({
        year,
        personalYear,
        significance: {
          ro: `An de aliniere cu Drumul Vieții - oportunități majore pentru împlinirea misiunii tale`,
          en: `Year aligned with Life Path - major opportunities for fulfilling your mission`,
          ru: `Год выравнивания с Путём Жизни — большие возможности для выполнения вашей миссии`
        },
        type: 'lifePath'
      });
    } else if (personalYear === destiny) {
      peakYears.push({
        year,
        personalYear,
        significance: {
          ro: `An de aliniere cu Destinul - dezvoltare a talentelor și abilităților`,
          en: `Year aligned with Destiny - development of talents and abilities`,
          ru: `Год выравнивания с Судьбой — развитие талантов и способностей`
        },
        type: 'destiny'
      });
    } else if (personalYear === 9) {
      peakYears.push({
        year,
        personalYear,
        significance: {
          ro: `An de finalizare și tranziție - închidere cicluri și pregătire pentru noi începuturi`,
          en: `Year of completion and transition - closing cycles and preparing for new beginnings`,
          ru: `Год завершения и перехода — закрытие циклов и подготовка к новым начинаниям`
        },
        type: 'major'
      });
    }
  }
  
  return peakYears;
};

/**
 * Calculate current life stage (1-9) based on age and life cycles.
 * @param birthDate - Birth date
 * @returns Current life stage information
 */
export interface LifeStageData {
  stage: number; // 1-9
  stageName: { ro: string; en: string; ru: string };
  age: number;
  description: { ro: string; en: string; ru: string };
}

export const calculateCurrentLifeStage = (birthDate: Date): LifeStageData => {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  
  // Life stages are typically divided into 9-year cycles
  // Stage is determined by which 9-year period of life you're in
  const stage = Math.min(9, Math.floor(age / 9) + 1);
  
  return {
    stage,
    stageName: getStageName(stage),
    age,
    description: getStageDescription(stage)
  };
};

/**
 * Get stage name for a life stage number (1-9).
 */
const getStageName = (stage: number): { ro: string; en: string; ru: string } => {
  const names: Record<number, { ro: string; en: string; ru: string }> = {
    1: { ro: "Începuturi", en: "Beginnings", ru: "Начала" },
    2: { ro: "Dezvoltare", en: "Development", ru: "Развитие" },
    3: { ro: "Expresie", en: "Expression", ru: "Выражение" },
    4: { ro: "Construcție", en: "Building", ru: "Строительство" },
    5: { ro: "Explorare", en: "Exploration", ru: "Исследование" },
    6: { ro: "Responsabilitate", en: "Responsibility", ru: "Ответственность" },
    7: { ro: "Înțelepciune", en: "Wisdom", ru: "Мудрость" },
    8: { ro: "Realizare", en: "Achievement", ru: "Достижение" },
    9: { ro: "Finalizare", en: "Completion", ru: "Завершение" }
  };
  
  return names[stage] || names[1];
};

/**
 * Get stage description for a life stage number (1-9).
 */
const getStageDescription = (stage: number): { ro: string; en: string; ru: string } => {
  const descriptions: Record<number, { ro: string; en: string; ru: string }> = {
    1: {
      ro: "Prima etapă a vieții - învățare, explorare și formare a identității",
      en: "First stage of life - learning, exploration, and identity formation",
      ru: "Первый этап жизни — обучение, исследование и формирование идентичности"
    },
    2: {
      ro: "Etapa de dezvoltare - construirea relațiilor și învățarea cooperării",
      en: "Development stage - building relationships and learning cooperation",
      ru: "Этап развития — построение отношений и обучение сотрудничеству"
    },
    3: {
      ro: "Etapa de expresie - dezvoltarea creativității și comunicării",
      en: "Expression stage - developing creativity and communication",
      ru: "Этап выражения — развитие творчества и общения"
    },
    4: {
      ro: "Etapa de construcție - stabilizare și organizare",
      en: "Building stage - stabilization and organization",
      ru: "Этап строительства — стабилизация и организация"
    },
    5: {
      ro: "Etapa de explorare - schimbări și libertate",
      en: "Exploration stage - changes and freedom",
      ru: "Этап исследования — перемены и свобода"
    },
    6: {
      ro: "Etapa de responsabilitate - grija pentru alții și armonie",
      en: "Responsibility stage - care for others and harmony",
      ru: "Этап ответственности — забота о других и гармония"
    },
    7: {
      ro: "Etapa de înțelepciune - introspecție și creștere spirituală",
      en: "Wisdom stage - introspection and spiritual growth",
      ru: "Этап мудрости — самоанализ и духовный рост"
    },
    8: {
      ro: "Etapa de realizare - succes material și recunoaștere",
      en: "Achievement stage - material success and recognition",
      ru: "Этап достижений — материальный успех и признание"
    },
    9: {
      ro: "Etapa de finalizare - închidere cicluri și serviciu umanitar",
      en: "Completion stage - closing cycles and humanitarian service",
      ru: "Этап завершения — закрытие циклов и гуманитарное служение"
    }
  };
  
  return descriptions[stage] || descriptions[1];
};
