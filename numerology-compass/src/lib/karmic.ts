import { reduceToSingleDigit } from "./numerology";

export interface KarmicDebtInfo {
  number: number;
  hasDebt: boolean;
  source: 'lifePath' | 'destiny' | 'soulUrge' | 'personality' | 'birthday';
}

export interface KarmicLessonInfo {
  missingNumber: number;
  description: { ro: string; en: string; ru: string };
}

// Karmic Debt Numbers and their meanings
export const KARMIC_DEBT_NUMBERS = [13, 14, 16, 19];

// Check if a number contains karmic debt (before reduction)
export const hasKarmicDebt = (originalSum: number): number | null => {
  if (KARMIC_DEBT_NUMBERS.includes(originalSum)) {
    return originalSum;
  }
  return null;
};

// Calculate all potential karmic debts from birth date and name
export const calculateKarmicDebts = (
  birthDate: Date,
  fullName: string
): KarmicDebtInfo[] => {
  const debts: KarmicDebtInfo[] = [];
  
  // Check Life Path (from birth date)
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();
  
  const daySum = day;
  const monthSum = month;
  const yearSum = String(year).split('').reduce((sum, d) => sum + parseInt(d), 0);
  const totalSum = reduceToSingleDigit(daySum, false) + reduceToSingleDigit(monthSum, false) + reduceToSingleDigit(yearSum, false);
  
  if (KARMIC_DEBT_NUMBERS.includes(totalSum)) {
    debts.push({ number: totalSum, hasDebt: true, source: 'lifePath' });
  }
  
  // Check Birthday
  if (KARMIC_DEBT_NUMBERS.includes(day)) {
    debts.push({ number: day, hasDebt: true, source: 'birthday' });
  }
  
  // Check name numbers
  const PYTHAGOREAN_VALUES: Record<string, number> = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
    J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
    S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
  };
  const VOWELS = ['A', 'E', 'I', 'O', 'U'];
  
  const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  
  let destinySum = 0;
  let soulUrgeSum = 0;
  let personalitySum = 0;
  
  for (const char of cleanName) {
    const value = PYTHAGOREAN_VALUES[char] || 0;
    destinySum += value;
    if (VOWELS.includes(char)) {
      soulUrgeSum += value;
    } else {
      personalitySum += value;
    }
  }
  
  if (KARMIC_DEBT_NUMBERS.includes(destinySum)) {
    debts.push({ number: destinySum, hasDebt: true, source: 'destiny' });
  }
  if (KARMIC_DEBT_NUMBERS.includes(soulUrgeSum)) {
    debts.push({ number: soulUrgeSum, hasDebt: true, source: 'soulUrge' });
  }
  if (KARMIC_DEBT_NUMBERS.includes(personalitySum)) {
    debts.push({ number: personalitySum, hasDebt: true, source: 'personality' });
  }
  
  return debts;
};

// Calculate Karmic Lessons (missing numbers from name)
export const calculateKarmicLessons = (fullName: string): number[] => {
  const PYTHAGOREAN_VALUES: Record<string, number> = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
    J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
    S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
  };
  
  const presentNumbers = new Set<number>();
  const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  
  for (const char of cleanName) {
    const value = PYTHAGOREAN_VALUES[char];
    if (value) {
      presentNumbers.add(value);
    }
  }
  
  const missingNumbers: number[] = [];
  for (let i = 1; i <= 9; i++) {
    if (!presentNumbers.has(i)) {
      missingNumbers.push(i);
    }
  }
  
  return missingNumbers;
};

/**
 * Calculate Karmic Path - the healing journey based on karmic debts and lessons.
 * This provides a roadmap for spiritual growth and karmic resolution.
 * @param birthDate - Birth date
 * @param fullName - Full name at birth
 * @returns Object containing karmic path information
 */
export interface KarmicPathInfo {
  debts: KarmicDebtInfo[];
  lessons: number[];
  primaryDebt: number | null;
  primaryLesson: number | null;
  healingSteps: { ro: string; en: string; ru: string }[];
  pathNumber: number;
}

export const calculateKarmicPath = (
  birthDate: Date,
  fullName: string
): KarmicPathInfo => {
  const debts = calculateKarmicDebts(birthDate, fullName);
  const lessons = calculateKarmicLessons(fullName);
  
  // Primary debt is the first one found (most significant)
  const primaryDebt = debts.length > 0 ? debts[0].number : null;
  
  // Primary lesson is the first missing number (most important to learn)
  const primaryLesson = lessons.length > 0 ? lessons[0] : null;
  
  // Generate healing steps based on debts and lessons
  const healingSteps: { ro: string; en: string; ru: string }[] = [];
  
  if (primaryDebt) {
    const debtInfo = KARMIC_DEBT_MEANINGS[primaryDebt];
    if (debtInfo) {
      healingSteps.push({
        ro: `Focus: ${debtInfo.healing.ro}`,
        en: `Focus: ${debtInfo.healing.en}`,
        ru: `Фокус: ${debtInfo.healing.ru}`
      });
    }
  }
  
  if (primaryLesson) {
    const lessonInfo = KARMIC_LESSON_MEANINGS[primaryLesson];
    if (lessonInfo) {
      healingSteps.push({
        ro: `Învață: ${lessonInfo.description.ro}`,
        en: `Learn: ${lessonInfo.description.en}`,
        ru: `Изучи: ${lessonInfo.description.ru}`
      });
    }
  }
  
  // Calculate path number (sum of primary debt and lesson, reduced)
  let pathSum = 0;
  if (primaryDebt) {
    pathSum += primaryDebt;
  }
  if (primaryLesson) {
    pathSum += primaryLesson;
  }
  
  const pathNumber = pathSum > 0 
    ? reduceToSingleDigit(pathSum, false) 
    : 0;
  
  return {
    debts,
    lessons,
    primaryDebt,
    primaryLesson,
    healingSteps,
    pathNumber
  };
};

// Karmic Debt interpretations
export const KARMIC_DEBT_MEANINGS: Record<number, {
  title: { ro: string; en: string; ru: string };
  description: { ro: string; en: string; ru: string };
  lesson: { ro: string; en: string; ru: string };
  healing: { ro: string; en: string; ru: string };
}> = {
  13: {
    title: {
      ro: "Datoria Karmică 13/4",
      en: "Karmic Debt 13/4",
      ru: "Кармический Долг 13/4"
    },
    description: {
      ro: "Această datorie karmică indică abuzuri din viețile trecute legate de lene și lipsa efortului. În această viață, munca grea poate părea mai dificilă.",
      en: "This karmic debt indicates past life abuses related to laziness and lack of effort. In this life, hard work may seem more difficult.",
      ru: "Этот кармический долг указывает на злоупотребления в прошлых жизнях, связанные с ленью и отсутствием усилий. В этой жизни упорный труд может казаться труднее."
    },
    lesson: {
      ro: "Lecția este să înveți valoarea muncii constante și a perseverenței, fără a căuta scurtături.",
      en: "The lesson is to learn the value of consistent work and perseverance, without looking for shortcuts.",
      ru: "Урок — научиться ценить постоянную работу и настойчивость, не ища лёгких путей."
    },
    healing: {
      ro: "Concentrează-te pe finalizarea proiectelor, dezvoltă disciplina și celebrează progresul gradual.",
      en: "Focus on completing projects, develop discipline, and celebrate gradual progress.",
      ru: "Сосредоточьтесь на завершении проектов, развивайте дисциплину и празднуйте постепенный прогресс."
    }
  },
  14: {
    title: {
      ro: "Datoria Karmică 14/5",
      en: "Karmic Debt 14/5",
      ru: "Кармический Долг 14/5"
    },
    description: {
      ro: "Această datorie karmică sugerează abuzuri de libertate în viețile trecute - exces, dependențe sau comportament iresponsabil.",
      en: "This karmic debt suggests past life abuses of freedom - excess, addictions, or irresponsible behavior.",
      ru: "Этот кармический долг указывает на злоупотребление свободой в прошлых жизнях — излишества, зависимости или безответственное поведение."
    },
    lesson: {
      ro: "Lecția este să înveți moderația și să folosești libertatea cu responsabilitate și înțelepciune.",
      en: "The lesson is to learn moderation and to use freedom with responsibility and wisdom.",
      ru: "Урок — научиться умеренности и использовать свободу с ответственностью и мудростью."
    },
    healing: {
      ro: "Practică auto-disciplina, evită excesele și găsește aventura în stabilitate.",
      en: "Practice self-discipline, avoid excess, and find adventure in stability.",
      ru: "Практикуйте самодисциплину, избегайте излишеств и находите приключения в стабильности."
    }
  },
  16: {
    title: {
      ro: "Datoria Karmică 16/7",
      en: "Karmic Debt 16/7",
      ru: "Кармический Долг 16/7"
    },
    description: {
      ro: "Cunoscută ca 'Turnul Căzut', această datorie indică ego inflat sau relații distructive în viețile trecute.",
      en: "Known as 'The Fallen Tower', this debt indicates inflated ego or destructive relationships in past lives.",
      ru: "Известный как «Падающая Башня», этот долг указывает на раздутое эго или разрушительные отношения в прошлых жизнях."
    },
    lesson: {
      ro: "Lecția este umilința și reconstrucția sinelui pe fundamente spirituale autentice.",
      en: "The lesson is humility and rebuilding the self on authentic spiritual foundations.",
      ru: "Урок — смирение и восстановление себя на подлинных духовных основах."
    },
    healing: {
      ro: "Acceptă transformările ca oportunități de creștere, practică umilința și dezvoltă viața interioară.",
      en: "Accept transformations as growth opportunities, practice humility, and develop your inner life.",
      ru: "Принимайте трансформации как возможности роста, практикуйте смирение и развивайте внутреннюю жизнь."
    }
  },
  19: {
    title: {
      ro: "Datoria Karmică 19/1",
      en: "Karmic Debt 19/1",
      ru: "Кармический Долг 19/1"
    },
    description: {
      ro: "Această datorie karmică indică abuzuri de putere în viețile trecute - dominație, egoism sau neglijarea altora.",
      en: "This karmic debt indicates past life abuses of power - domination, selfishness, or neglecting others.",
      ru: "Этот кармический долг указывает на злоупотребление властью в прошлых жизнях — доминирование, эгоизм или пренебрежение другими."
    },
    lesson: {
      ro: "Lecția este să înveți să stai pe propriile picioare în timp ce rămâi conectat cu și în serviciul altora.",
      en: "The lesson is to learn to stand on your own while remaining connected to and in service of others.",
      ru: "Урок — научиться стоять на своих ногах, оставаясь связанным с другими и служа им."
    },
    healing: {
      ro: "Dezvoltă independența sănătoasă, practică generozitatea și recunoaște contribuțiile altora.",
      en: "Develop healthy independence, practice generosity, and acknowledge others' contributions.",
      ru: "Развивайте здоровую независимость, практикуйте щедрость и признавайте вклад других."
    }
  }
};

// Karmic Lesson interpretations
export const KARMIC_LESSON_MEANINGS: Record<number, { 
  title: { ro: string; en: string; ru: string }; 
  description: { ro: string; en: string; ru: string } 
}> = {
  1: {
    title: { ro: "Lecția Independenței", en: "Lesson of Independence", ru: "Урок Независимости" },
    description: {
      ro: "Lipsește numărul 1 din nume - trebuie să înveți să fii independent și să îți afirmi individualitatea.",
      en: "Number 1 is missing from your name - you need to learn to be independent and assert your individuality.",
      ru: "Число 1 отсутствует в имени — нужно научиться быть независимым и утверждать свою индивидуальность."
    }
  },
  2: {
    title: { ro: "Lecția Cooperării", en: "Lesson of Cooperation", ru: "Урок Сотрудничества" },
    description: {
      ro: "Lipsește numărul 2 - trebuie să înveți să cooperezi, să ai răbdare și să fii sensibil la nevoile altora.",
      en: "Number 2 is missing - you need to learn to cooperate, be patient, and be sensitive to others' needs.",
      ru: "Число 2 отсутствует — нужно научиться сотрудничать, быть терпеливым и чувствительным к нуждам других."
    }
  },
  3: {
    title: { ro: "Lecția Expresiei", en: "Lesson of Expression", ru: "Урок Выражения" },
    description: {
      ro: "Lipsește numărul 3 - trebuie să înveți să te exprimi creativ și să comunici eficient.",
      en: "Number 3 is missing - you need to learn to express yourself creatively and communicate effectively.",
      ru: "Число 3 отсутствует — нужно научиться творчески выражаться и эффективно общаться."
    }
  },
  4: {
    title: { ro: "Lecția Disciplinei", en: "Lesson of Discipline", ru: "Урок Дисциплины" },
    description: {
      ro: "Lipsește numărul 4 - trebuie să înveți disciplina, organizarea și valoarea muncii consistente.",
      en: "Number 4 is missing - you need to learn discipline, organization, and the value of consistent work.",
      ru: "Число 4 отсутствует — нужно научиться дисциплине, организации и ценности постоянной работы."
    }
  },
  5: {
    title: { ro: "Lecția Libertății", en: "Lesson of Freedom", ru: "Урок Свободы" },
    description: {
      ro: "Lipsește numărul 5 - trebuie să înveți să îmbrățișezi schimbarea și să folosești libertatea constructiv.",
      en: "Number 5 is missing - you need to learn to embrace change and use freedom constructively.",
      ru: "Число 5 отсутствует — нужно научиться принимать перемены и конструктивно использовать свободу."
    }
  },
  6: {
    title: { ro: "Lecția Responsabilității", en: "Lesson of Responsibility", ru: "Урок Ответственности" },
    description: {
      ro: "Lipsește numărul 6 - trebuie să înveți responsabilitatea, grija pentru alții și armonia în relații.",
      en: "Number 6 is missing - you need to learn responsibility, care for others, and harmony in relationships.",
      ru: "Число 6 отсутствует — нужно научиться ответственности, заботе о других и гармонии в отношениях."
    }
  },
  7: {
    title: { ro: "Lecția Înțelepciunii", en: "Lesson of Wisdom", ru: "Урок Мудрости" },
    description: {
      ro: "Lipsește numărul 7 - trebuie să înveți introspecția, analiza și să cauți adevăruri mai profunde.",
      en: "Number 7 is missing - you need to learn introspection, analysis, and to seek deeper truths.",
      ru: "Число 7 отсутствует — нужно научиться самоанализу, анализу и поиску глубоких истин."
    }
  },
  8: {
    title: { ro: "Lecția Puterii", en: "Lesson of Power", ru: "Урок Силы" },
    description: {
      ro: "Lipsește numărul 8 - trebuie să înveți să gestionezi puterea, banii și succesul material.",
      en: "Number 8 is missing - you need to learn to manage power, money, and material success.",
      ru: "Число 8 отсутствует — нужно научиться управлять силой, деньгами и материальным успехом."
    }
  },
  9: {
    title: { ro: "Lecția Compasiunii", en: "Lesson of Compassion", ru: "Урок Сострадания" },
    description: {
      ro: "Lipsește numărul 9 - trebuie să înveți compasiunea universală, generozitatea și eliberarea trecutului.",
      en: "Number 9 is missing - you need to learn universal compassion, generosity, and releasing the past.",
      ru: "Число 9 отсутствует — нужно научиться универсальному состраданию, щедрости и освобождению от прошлого."
    }
  }
};
