import { 
  calculatePersonalYearNumber, 
  calculateLifePathNumber,
  getNumberMeaning 
} from './numerology';
import { calculatePersonalMonthNumber } from './personalCycles';

export interface MonthForecast {
  month: number;
  monthName: string;
  personalMonthNumber: number;
  energy: string;
  focus: string[];
  opportunities: string[];
  challenges: string[];
  advice: string;
}

export interface YearForecast {
  year: number;
  personalYearNumber: number;
  lifePathNumber: number;
  yearMeaning: ReturnType<typeof getNumberMeaning>;
  overallTheme: string;
  keyMonths: number[];
  monthlyForecasts: MonthForecast[];
}

const MONTH_NAMES = {
  ro: ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
};

const PERSONAL_MONTH_DATA: Record<number, {
  energy: { ro: string; en: string; ru: string };
  focus: { ro: string[]; en: string[]; ru: string[] };
  opportunities: { ro: string[]; en: string[]; ru: string[] };
  challenges: { ro: string[]; en: string[]; ru: string[] };
  advice: { ro: string; en: string; ru: string };
}> = {
  1: {
    energy: { 
      ro: 'Noi începuturi și inițiative', 
      en: 'New beginnings and initiatives', 
      ru: 'Новые начинания и инициативы' 
    },
    focus: { 
      ro: ['Proiecte noi', 'Leadership', 'Independență'], 
      en: ['New projects', 'Leadership', 'Independence'], 
      ru: ['Новые проекты', 'Лидерство', 'Независимость'] 
    },
    opportunities: { 
      ro: ['Lansări de proiecte', 'Promovări', 'Noi parteneriate'], 
      en: ['Project launches', 'Promotions', 'New partnerships'], 
      ru: ['Запуск проектов', 'Повышения', 'Новые партнерства'] 
    },
    challenges: { 
      ro: ['Impulsivitate', 'Conflict cu autoritatea'], 
      en: ['Impulsivity', 'Authority conflicts'], 
      ru: ['Импульсивность', 'Конфликты с властью'] 
    },
    advice: { 
      ro: 'Acționează cu curaj dar și cu înțelepciune.', 
      en: 'Act with courage but also with wisdom.', 
      ru: 'Действуй смело, но мудро.' 
    }
  },
  2: {
    energy: { 
      ro: 'Cooperare și diplomație', 
      en: 'Cooperation and diplomacy', 
      ru: 'Сотрудничество и дипломатия' 
    },
    focus: { 
      ro: ['Relații', 'Răbdare', 'Detalii'], 
      en: ['Relationships', 'Patience', 'Details'], 
      ru: ['Отношения', 'Терпение', 'Детали'] 
    },
    opportunities: { 
      ro: ['Colaborări', 'Mediere', 'Conexiuni profunde'], 
      en: ['Collaborations', 'Mediation', 'Deep connections'], 
      ru: ['Сотрудничество', 'Посредничество', 'Глубокие связи'] 
    },
    challenges: { 
      ro: ['Indecizie', 'Sensibilitate excesivă'], 
      en: ['Indecision', 'Excessive sensitivity'], 
      ru: ['Нерешительность', 'Чрезмерная чувствительность'] 
    },
    advice: { 
      ro: 'Ascultă mai mult decât vorbești.', 
      en: 'Listen more than you speak.', 
      ru: 'Слушай больше, чем говоришь.' 
    }
  },
  3: {
    energy: { 
      ro: 'Creativitate și expresie', 
      en: 'Creativity and expression', 
      ru: 'Творчество и самовыражение' 
    },
    focus: { 
      ro: ['Artă', 'Comunicare', 'Social'], 
      en: ['Art', 'Communication', 'Social'], 
      ru: ['Искусство', 'Коммуникация', 'Общество'] 
    },
    opportunities: { 
      ro: ['Proiecte creative', 'Networking', 'Publicitate'], 
      en: ['Creative projects', 'Networking', 'Publicity'], 
      ru: ['Творческие проекты', 'Нетворкинг', 'Публичность'] 
    },
    challenges: { 
      ro: ['Risipirea energiei', 'Superficialitate'], 
      en: ['Scattered energy', 'Superficiality'], 
      ru: ['Рассеянная энергия', 'Поверхностность'] 
    },
    advice: { 
      ro: 'Exprimă-te autentic dar focalizat.', 
      en: 'Express yourself authentically but focused.', 
      ru: 'Выражайся искренне, но сфокусировано.' 
    }
  },
  4: {
    energy: { 
      ro: 'Muncă și organizare', 
      en: 'Work and organization', 
      ru: 'Работа и организация' 
    },
    focus: { 
      ro: ['Structură', 'Disciplină', 'Fundament'], 
      en: ['Structure', 'Discipline', 'Foundation'], 
      ru: ['Структура', 'Дисциплина', 'Основа'] 
    },
    opportunities: { 
      ro: ['Consolidare', 'Planificare', 'Construcție'], 
      en: ['Consolidation', 'Planning', 'Building'], 
      ru: ['Консолидация', 'Планирование', 'Строительство'] 
    },
    challenges: { 
      ro: ['Rigiditate', 'Workaholic'], 
      en: ['Rigidity', 'Workaholic tendencies'], 
      ru: ['Ригидность', 'Трудоголизм'] 
    },
    advice: { 
      ro: 'Construiește pas cu pas, fără grabă.', 
      en: 'Build step by step, without rush.', 
      ru: 'Строй шаг за шагом, без спешки.' 
    }
  },
  5: {
    energy: { 
      ro: 'Schimbare și libertate', 
      en: 'Change and freedom', 
      ru: 'Изменения и свобода' 
    },
    focus: { 
      ro: ['Aventură', 'Flexibilitate', 'Noutate'], 
      en: ['Adventure', 'Flexibility', 'Novelty'], 
      ru: ['Приключения', 'Гибкость', 'Новизна'] 
    },
    opportunities: { 
      ro: ['Călătorii', 'Noi experiențe', 'Transformări'], 
      en: ['Travel', 'New experiences', 'Transformations'], 
      ru: ['Путешествия', 'Новый опыт', 'Трансформации'] 
    },
    challenges: { 
      ro: ['Instabilitate', 'Impuls exagerat'], 
      en: ['Instability', 'Excessive impulse'], 
      ru: ['Нестабильность', 'Чрезмерная импульсивность'] 
    },
    advice: { 
      ro: 'Îmbrățișează schimbarea cu echilibru.', 
      en: 'Embrace change with balance.', 
      ru: 'Принимай изменения с балансом.' 
    }
  },
  6: {
    energy: { 
      ro: 'Familie și responsabilitate', 
      en: 'Family and responsibility', 
      ru: 'Семья и ответственность' 
    },
    focus: { 
      ro: ['Cămin', 'Relații', 'Armonie'], 
      en: ['Home', 'Relationships', 'Harmony'], 
      ru: ['Дом', 'Отношения', 'Гармония'] 
    },
    opportunities: { 
      ro: ['Reconcilieri', 'Decorare casă', 'Angajamente'], 
      en: ['Reconciliations', 'Home decoration', 'Commitments'], 
      ru: ['Примирения', 'Декор дома', 'Обязательства'] 
    },
    challenges: { 
      ro: ['Supraprotecție', 'Neglijare de sine'], 
      en: ['Overprotection', 'Self-neglect'], 
      ru: ['Сверхзащита', 'Пренебрежение собой'] 
    },
    advice: { 
      ro: 'Echilibrează grija pentru alții cu grija pentru tine.', 
      en: 'Balance caring for others with caring for yourself.', 
      ru: 'Балансируй заботу о других с заботой о себе.' 
    }
  },
  7: {
    energy: { 
      ro: 'Introspecție și spiritualitate', 
      en: 'Introspection and spirituality', 
      ru: 'Интроспекция и духовность' 
    },
    focus: { 
      ro: ['Meditație', 'Studiu', 'Analiză'], 
      en: ['Meditation', 'Study', 'Analysis'], 
      ru: ['Медитация', 'Учёба', 'Анализ'] 
    },
    opportunities: { 
      ro: ['Descoperiri interioare', 'Învățare', 'Vindecare'], 
      en: ['Inner discoveries', 'Learning', 'Healing'], 
      ru: ['Внутренние открытия', 'Обучение', 'Исцеление'] 
    },
    challenges: { 
      ro: ['Izolare', 'Gândire excesivă'], 
      en: ['Isolation', 'Overthinking'], 
      ru: ['Изоляция', 'Чрезмерные размышления'] 
    },
    advice: { 
      ro: 'Caută răspunsuri în liniște interioară.', 
      en: 'Seek answers in inner silence.', 
      ru: 'Ищи ответы во внутренней тишине.' 
    }
  },
  8: {
    energy: { 
      ro: 'Putere și abundență', 
      en: 'Power and abundance', 
      ru: 'Сила и изобилие' 
    },
    focus: { 
      ro: ['Finanțe', 'Carieră', 'Realizări'], 
      en: ['Finances', 'Career', 'Achievements'], 
      ru: ['Финансы', 'Карьера', 'Достижения'] 
    },
    opportunities: { 
      ro: ['Investiții', 'Promovări', 'Succes material'], 
      en: ['Investments', 'Promotions', 'Material success'], 
      ru: ['Инвестиции', 'Повышения', 'Материальный успех'] 
    },
    challenges: { 
      ro: ['Materialism', 'Obsesie pentru control'], 
      en: ['Materialism', 'Control obsession'], 
      ru: ['Материализм', 'Одержимость контролем'] 
    },
    advice: { 
      ro: 'Folosește puterea pentru binele tuturor.', 
      en: 'Use power for the good of all.', 
      ru: 'Используй силу для блага всех.' 
    }
  },
  9: {
    energy: { 
      ro: 'Finalizări și eliberare', 
      en: 'Completions and release', 
      ru: 'Завершения и освобождение' 
    },
    focus: { 
      ro: ['Încheieri', 'Compasiune', 'Transformare'], 
      en: ['Endings', 'Compassion', 'Transformation'], 
      ru: ['Окончания', 'Сострадание', 'Трансформация'] 
    },
    opportunities: { 
      ro: ['Finalizare proiecte', 'Iertare', 'Serviciu'], 
      en: ['Project completion', 'Forgiveness', 'Service'], 
      ru: ['Завершение проектов', 'Прощение', 'Служение'] 
    },
    challenges: { 
      ro: ['Dificultăți în a lăsa trecutul', 'Melancolie'], 
      en: ['Difficulty letting go', 'Melancholy'], 
      ru: ['Трудности с отпусканием', 'Меланхолия'] 
    },
    advice: { 
      ro: 'Eliberează vechiul pentru a face loc noului.', 
      en: 'Release the old to make room for the new.', 
      ru: 'Отпусти старое, чтобы освободить место для нового.' 
    }
  }
};

const YEAR_THEMES: Record<number, { ro: string; en: string; ru: string }> = {
  1: {
    ro: 'Anul noilor începuturi. E momentul să plantezi semințele pentru viitor și să îți urmezi viziunea personală.',
    en: 'A year of new beginnings. It\'s time to plant seeds for the future and follow your personal vision.',
    ru: 'Год новых начинаний. Время сажать семена для будущего и следовать своему личному видению.'
  },
  2: {
    ro: 'Anul parteneriatelor și răbdării. Colaborează, ascultă și lasă lucrurile să se dezvolte organic.',
    en: 'A year of partnerships and patience. Collaborate, listen, and let things develop organically.',
    ru: 'Год партнерств и терпения. Сотрудничай, слушай и позволь вещам развиваться органично.'
  },
  3: {
    ro: 'Anul creativității și expresiei. Exprimă-te, socializează și bucură-te de viață cu entuziasm.',
    en: 'A year of creativity and expression. Express yourself, socialize, and enjoy life with enthusiasm.',
    ru: 'Год творчества и самовыражения. Выражай себя, общайся и наслаждайся жизнью с энтузиазмом.'
  },
  4: {
    ro: 'Anul muncii și construcției. Pune bazele solide pentru viitor prin disciplină și perseverență.',
    en: 'A year of work and building. Lay solid foundations for the future through discipline and perseverance.',
    ru: 'Год работы и строительства. Заложи прочный фундамент для будущего через дисциплину и настойчивость.'
  },
  5: {
    ro: 'Anul schimbărilor și libertății. Adaptează-te, explorează și îmbrățișează oportunitățile neașteptate.',
    en: 'A year of change and freedom. Adapt, explore, and embrace unexpected opportunities.',
    ru: 'Год перемен и свободы. Адаптируйся, исследуй и принимай неожиданные возможности.'
  },
  6: {
    ro: 'Anul familiei și responsabilității. Concentrează-te pe cămin, relații și armonie.',
    en: 'A year of family and responsibility. Focus on home, relationships, and harmony.',
    ru: 'Год семьи и ответственности. Сосредоточься на доме, отношениях и гармонии.'
  },
  7: {
    ro: 'Anul introspecției și creșterii spirituale. Caută răspunsuri în interior și dezvoltă-ți înțelepciunea.',
    en: 'A year of introspection and spiritual growth. Seek answers within and develop your wisdom.',
    ru: 'Год самоанализа и духовного роста. Ищи ответы внутри себя и развивай свою мудрость.'
  },
  8: {
    ro: 'Anul puterii și realizărilor. Concentrează-te pe succes, finanțe și manifestarea obiectivelor.',
    en: 'A year of power and achievement. Focus on success, finances, and manifesting goals.',
    ru: 'Год силы и достижений. Сосредоточься на успехе, финансах и реализации целей.'
  },
  9: {
    ro: 'Anul finalizărilor și transformării. Încheie cicluri, eliberează și pregătește-te pentru noul ciclu.',
    en: 'A year of completions and transformation. Close cycles, release, and prepare for the new cycle.',
    ru: 'Год завершений и трансформации. Закрывай циклы, освобождайся и готовься к новому циклу.'
  }
};

export const generateYearForecast = (
  birthDate: Date, 
  year: number,
  language: 'ro' | 'en' | 'ru'
): YearForecast => {
  const personalYearNumber = calculatePersonalYearNumber(birthDate, year);
  const lifePathNumber = calculateLifePathNumber(birthDate);
  const yearMeaning = getNumberMeaning(personalYearNumber);
  
  const monthlyForecasts: MonthForecast[] = [];
  const keyMonths: number[] = [];
  
  for (let month = 1; month <= 12; month++) {
    const personalMonthNumber = calculatePersonalMonthNumber(birthDate, year, month);
    const monthData = PERSONAL_MONTH_DATA[personalMonthNumber] || PERSONAL_MONTH_DATA[1];
    
    // Key months are when personal month matches life path or personal year
    if (personalMonthNumber === lifePathNumber || personalMonthNumber === personalYearNumber) {
      keyMonths.push(month);
    }
    
    monthlyForecasts.push({
      month,
      monthName: MONTH_NAMES[language][month - 1],
      personalMonthNumber,
      energy: monthData.energy[language],
      focus: monthData.focus[language],
      opportunities: monthData.opportunities[language],
      challenges: monthData.challenges[language],
      advice: monthData.advice[language]
    });
  }
  
  return {
    year,
    personalYearNumber,
    lifePathNumber,
    yearMeaning,
    overallTheme: YEAR_THEMES[personalYearNumber]?.[language] || YEAR_THEMES[1][language],
    keyMonths,
    monthlyForecasts
  };
};
