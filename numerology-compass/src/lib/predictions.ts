// Daily and Monthly Predictions based on Numerology
import { 
  reduceToSingleDigit,
  calculateLifePathNumber,
  calculateDestinyNumber,
  calculatePersonalYearNumber
} from './numerology';
import { calculateLuckyScore } from './luckyDates';

export interface DailyPrediction {
  number: number;
  energy: string;
  focus: string;
  advice: string;
  luckyHours: string[];
  challenges: string;
  opportunities: string;
}

export interface MonthlyPrediction {
  number: number;
  theme: string;
  overview: string;
  career: string;
  relationships: string;
  health: string;
  finances: string;
  spirituality: string;
  keyDays: number[];
}

// Calculate Universal Day Number
export const calculateUniversalDayNumber = (date: Date = new Date()): number => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  const total = day + month + String(year).split('').reduce((sum, d) => sum + parseInt(d), 0);
  return reduceToSingleDigit(total, false);
};

// Calculate Personal Day Number
export const calculatePersonalDayNumber = (birthDate: Date, date: Date = new Date()): number => {
  const birthDay = birthDate.getDate();
  const birthMonth = birthDate.getMonth() + 1;
  const currentDay = date.getDate();
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();
  
  const reducedBirthDay = reduceToSingleDigit(birthDay, false);
  const reducedBirthMonth = reduceToSingleDigit(birthMonth, false);
  const reducedCurrentDay = reduceToSingleDigit(currentDay, false);
  const reducedCurrentMonth = reduceToSingleDigit(currentMonth, false);
  const reducedYear = reduceToSingleDigit(
    String(currentYear).split('').reduce((sum, d) => sum + parseInt(d), 0),
    false
  );
  
  const total = reducedBirthDay + reducedBirthMonth + reducedCurrentDay + reducedCurrentMonth + reducedYear;
  return reduceToSingleDigit(total, false);
};

// Calculate Personal Month Number
export const calculatePersonalMonthNumber = (birthDate: Date, month: number, year: number): number => {
  const birthDay = birthDate.getDate();
  const birthMonth = birthDate.getMonth() + 1;
  
  const reducedBirthDay = reduceToSingleDigit(birthDay, false);
  const reducedBirthMonth = reduceToSingleDigit(birthMonth, false);
  const reducedMonth = reduceToSingleDigit(month, false);
  const reducedYear = reduceToSingleDigit(
    String(year).split('').reduce((sum, d) => sum + parseInt(d), 0),
    false
  );
  
  const total = reducedBirthDay + reducedBirthMonth + reducedMonth + reducedYear;
  return reduceToSingleDigit(total, false);
};

// Daily predictions data
const dailyPredictionsData: Record<number, Omit<DailyPrediction, 'number'>> = {
  1: {
    energy: "leadership",
    focus: "new beginnings",
    advice: "Take initiative today. Start that project you've been postponing.",
    luckyHours: ["9:00", "11:00", "19:00"],
    challenges: "Avoid being too self-centered or impatient with others.",
    opportunities: "Perfect day for launching new ventures or asserting yourself."
  },
  2: {
    energy: "cooperation",
    focus: "partnerships",
    advice: "Focus on collaboration and diplomacy. Listen more than you speak.",
    luckyHours: ["8:00", "14:00", "20:00"],
    challenges: "Don't let indecision hold you back from making necessary choices.",
    opportunities: "Excellent for negotiations, meetings, and deepening relationships."
  },
  3: {
    energy: "creativity",
    focus: "self-expression",
    advice: "Express yourself creatively. Share your ideas with enthusiasm.",
    luckyHours: ["10:00", "15:00", "21:00"],
    challenges: "Avoid scattering your energy on too many projects at once.",
    opportunities: "Great for artistic pursuits, social events, and communication."
  },
  4: {
    energy: "stability",
    focus: "organization",
    advice: "Build solid foundations. Focus on practical matters and planning.",
    luckyHours: ["7:00", "12:00", "16:00"],
    challenges: "Don't become too rigid or resistant to necessary changes.",
    opportunities: "Ideal for detailed work, budgeting, and establishing routines."
  },
  5: {
    energy: "change",
    focus: "freedom",
    advice: "Embrace change and variety. Be open to unexpected opportunities.",
    luckyHours: ["11:00", "17:00", "22:00"],
    challenges: "Avoid impulsive decisions that you might regret later.",
    opportunities: "Perfect for travel, trying new things, and breaking routines."
  },
  6: {
    energy: "harmony",
    focus: "responsibility",
    advice: "Focus on home, family, and nurturing relationships.",
    luckyHours: ["6:00", "13:00", "18:00"],
    challenges: "Don't sacrifice your own needs to please everyone else.",
    opportunities: "Excellent for domestic matters, healing, and community service."
  },
  7: {
    energy: "introspection",
    focus: "spiritual growth",
    advice: "Take time for solitude and reflection. Trust your intuition.",
    luckyHours: ["5:00", "14:00", "23:00"],
    challenges: "Avoid isolation or becoming too lost in your thoughts.",
    opportunities: "Ideal for research, meditation, and deep study."
  },
  8: {
    energy: "abundance",
    focus: "achievement",
    advice: "Focus on professional goals and financial matters with confidence.",
    luckyHours: ["8:00", "16:00", "20:00"],
    challenges: "Don't let material concerns overshadow spiritual or emotional needs.",
    opportunities: "Great for business decisions, investments, and career advancement."
  },
  9: {
    energy: "completion",
    focus: "humanitarianism",
    advice: "Let go of what no longer serves you. Give back to others.",
    luckyHours: ["9:00", "15:00", "21:00"],
    challenges: "Avoid holding onto the past or unresolved emotions.",
    opportunities: "Perfect for charitable work, endings, and spiritual practices."
  }
};

// Monthly predictions data
const monthlyPredictionsData: Record<number, Omit<MonthlyPrediction, 'number' | 'keyDays'>> = {
  1: {
    theme: "New Beginnings",
    overview: "A month of fresh starts and new opportunities. Take initiative and plant seeds for future growth.",
    career: "Excellent for launching new projects or seeking leadership roles. Your confidence attracts success.",
    relationships: "Assert your needs while remaining considerate. New connections may form.",
    health: "High energy levels. Start new fitness routines or health habits now.",
    finances: "Good time for investments and new income streams. Trust your instincts.",
    spirituality: "Connect with your inner purpose. Set intentions for personal growth."
  },
  2: {
    theme: "Partnership & Patience",
    overview: "A month for cooperation, patience, and building relationships. Success comes through collaboration.",
    career: "Focus on teamwork and diplomatic solutions. Avoid forcing issues.",
    relationships: "Deep connections form through understanding and compromise. Listen actively.",
    health: "Pay attention to emotional well-being. Balance and rest are essential.",
    finances: "Patience with financial matters. Avoid major decisions; gather information instead.",
    spirituality: "Develop intuition through meditation. Trust the universe's timing."
  },
  3: {
    theme: "Creative Expression",
    overview: "A vibrant month for creativity, socializing, and self-expression. Joy and inspiration abound.",
    career: "Creative solutions lead to success. Communication and networking flourish.",
    relationships: "Social activities bring happiness. Express love and appreciation openly.",
    health: "Mental health improves through creative outlets. Avoid overindulgence.",
    finances: "Opportunities through creative ventures. Avoid scattered spending.",
    spirituality: "Express gratitude. Find the divine in beauty and art."
  },
  4: {
    theme: "Building Foundations",
    overview: "A month for hard work, organization, and creating stability. Discipline brings lasting results.",
    career: "Focus on structure and long-term planning. Details matter now.",
    relationships: "Build trust through reliability. Address practical matters together.",
    health: "Establish consistent routines. Address any neglected health issues.",
    finances: "Budget and save. This is a foundation-building period for wealth.",
    spirituality: "Ground yourself in practice. Consistency in spiritual routines pays off."
  },
  5: {
    theme: "Change & Freedom",
    overview: "An exciting month of change, travel, and new experiences. Flexibility is your greatest asset.",
    career: "Embrace changes in your work environment. Adaptability leads to opportunities.",
    relationships: "Variety and spontaneity refresh connections. Avoid restlessness.",
    health: "Try new forms of exercise. Address addictive patterns.",
    finances: "Unexpected opportunities arise. Balance risk with wisdom.",
    spirituality: "Explore new spiritual practices. Freedom leads to growth."
  },
  6: {
    theme: "Love & Responsibility",
    overview: "A month focused on home, family, and nurturing. Love and beauty guide your path.",
    career: "Service-oriented work thrives. Create harmony in your workplace.",
    relationships: "Deep healing in close relationships. Commitment strengthens.",
    health: "Nurture yourself as you nurture others. Home-based healing works well.",
    finances: "Investments in home and family pay off. Avoid overextending for others.",
    spirituality: "Find the sacred in daily life. Service is a spiritual practice."
  },
  7: {
    theme: "Inner Wisdom",
    overview: "A reflective month for inner work, study, and spiritual development. Trust your intuition.",
    career: "Research and analysis excel. Work independently when possible.",
    relationships: "Quality over quantity in social interactions. Deep conversations satisfy.",
    health: "Mental and spiritual health take priority. Rest and reflection heal.",
    finances: "Analyze before acting. Hidden information may surface.",
    spirituality: "Peak month for spiritual growth. Meditation and study transform."
  },
  8: {
    theme: "Power & Abundance",
    overview: "A powerful month for achievement, recognition, and material success. Step into your power.",
    career: "Authority and leadership are highlighted. Major career advances possible.",
    relationships: "Balance power dynamics. Generosity strengthens bonds.",
    health: "Strong vitality. Address stress from ambitious pursuits.",
    finances: "Peak financial opportunities. Large-scale thinking pays off.",
    spirituality: "Integrate material and spiritual values. Abundance is spiritual."
  },
  9: {
    theme: "Completion & Release",
    overview: "A month of endings, release, and humanitarian focus. Let go to make room for the new.",
    career: "Complete long-term projects. Give back through your work.",
    relationships: "Heal old wounds. Forgiveness opens new chapters.",
    health: "Detox and release. Emotional clearing supports physical health.",
    finances: "Tie up loose ends. Charitable giving brings unexpected returns.",
    spirituality: "Universal love and compassion guide you. Prepare for a new cycle."
  }
};

export const getDailyPrediction = (birthDate: Date, date: Date = new Date()): DailyPrediction => {
  const number = calculatePersonalDayNumber(birthDate, date);
  return {
    number,
    ...dailyPredictionsData[number]
  };
};

export const getMonthlyPrediction = (birthDate: Date, month: number, year: number): MonthlyPrediction => {
  const number = calculatePersonalMonthNumber(birthDate, month, year);
  
  // Calculate key days for this month (days where personal day number matches personal month number)
  const daysInMonth = new Date(year, month, 0).getDate();
  const keyDays: number[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayNumber = calculatePersonalDayNumber(birthDate, date);
    if (dayNumber === number || dayNumber === 1 || dayNumber === 8) {
      keyDays.push(day);
    }
  }
  
  return {
    number,
    keyDays: keyDays.slice(0, 5), // Return top 5 key days
    ...monthlyPredictionsData[number]
  };
};

export const getUniversalDayEnergy = (date: Date = new Date()): { number: number; energy: string } => {
  const number = calculateUniversalDayNumber(date);
  return {
    number,
    energy: dailyPredictionsData[number].energy
  };
};

// ===== PHASE 5.1: Extended Daily Predictions =====

/**
 * Get detailed recommendations for a specific day based on personal day number.
 * @param birthDate - Birth date
 * @param date - Target date (default: today)
 * @returns Array of specific recommendations for the day
 */
export const getDayRecommendations = (birthDate: Date, date: Date = new Date()): string[] => {
  const dayNumber = calculatePersonalDayNumber(birthDate, date);
  const recommendations: Record<number, string[]> = {
    1: [
      "Start new projects or initiatives",
      "Take leadership roles",
      "Make important decisions",
      "Set goals for the future",
      "Express your independence"
    ],
    2: [
      "Focus on partnerships and collaboration",
      "Practice patience and diplomacy",
      "Listen to others' perspectives",
      "Work on details and organization",
      "Nurture relationships"
    ],
    3: [
      "Engage in creative activities",
      "Express yourself through art or writing",
      "Socialize and network",
      "Share your ideas with enthusiasm",
      "Find joy in everyday moments"
    ],
    4: [
      "Focus on practical matters",
      "Organize your workspace",
      "Build solid foundations",
      "Work on long-term projects",
      "Establish routines"
    ],
    5: [
      "Embrace change and new experiences",
      "Try something new or adventurous",
      "Be flexible with plans",
      "Travel or explore new places",
      "Break out of routines"
    ],
    6: [
      "Spend time with family",
      "Focus on home and domestic matters",
      "Help others in need",
      "Create harmony in relationships",
      "Practice self-care"
    ],
    7: [
      "Take time for solitude and reflection",
      "Meditate or practice mindfulness",
      "Study or research topics of interest",
      "Trust your intuition",
      "Seek inner wisdom"
    ],
    8: [
      "Focus on career and financial goals",
      "Make important business decisions",
      "Invest in your future",
      "Take calculated risks",
      "Step into positions of authority"
    ],
    9: [
      "Complete unfinished projects",
      "Let go of what no longer serves you",
      "Help others or volunteer",
      "Practice forgiveness",
      "Prepare for new beginnings"
    ]
  };
  
  return recommendations[dayNumber] || recommendations[1];
};

/**
 * Calculate color associated with a day number for visualization.
 * @param dayNumber - Personal day number (1-9)
 * @returns Color name and hex code
 */
export const calculateDayColor = (dayNumber: number): { name: string; hex: string } => {
  const colors: Record<number, { name: string; hex: string }> = {
    1: { name: "Red", hex: "#EF4444" },      // Leadership, action
    2: { name: "Orange", hex: "#F97316" },   // Cooperation, warmth
    3: { name: "Yellow", hex: "#EAB308" },    // Creativity, joy
    4: { name: "Green", hex: "#22C55E" },     // Stability, growth
    5: { name: "Blue", hex: "#3B82F6" },      // Change, freedom
    6: { name: "Indigo", hex: "#6366F1" },    // Harmony, responsibility
    7: { name: "Violet", hex: "#8B5CF6" },   // Introspection, spirituality
    8: { name: "Gold", hex: "#F59E0B" },      // Abundance, achievement
    9: { name: "Purple", hex: "#A855F7" }     // Completion, compassion
  };
  
  return colors[dayNumber] || colors[1];
};

/**
 * Get music recommendations based on day number energy.
 * @param dayNumber - Personal day number (1-9)
 * @returns Array of music genre/style recommendations
 */
export const getDayMusicRecommendations = (dayNumber: number): string[] => {
  const music: Record<number, string[]> = {
    1: ["Upbeat motivational", "Powerful anthems", "Energetic rock", "Confident pop"],
    2: ["Soft instrumental", "Harmonious melodies", "Peaceful ambient", "Gentle acoustic"],
    3: ["Joyful pop", "Creative jazz", "Expressive classical", "Upbeat dance"],
    4: ["Structured classical", "Steady rhythms", "Organized instrumental", "Grounding beats"],
    5: ["Dynamic electronic", "Adventurous world music", "Varied playlists", "Energetic fusion"],
    6: ["Warm ballads", "Harmonious vocals", "Family-friendly", "Nurturing melodies"],
    7: ["Meditative sounds", "Spiritual chants", "Ambient space music", "Reflective instrumental"],
    8: ["Powerful orchestral", "Success anthems", "Confident beats", "Achievement music"],
    9: ["Transcendent spiritual", "Compassionate melodies", "Completion themes", "Universal harmony"]
  };
  
  return music[dayNumber] || music[1];
};

// ===== PHASE 5.2: Weekly Predictions =====

export interface WeeklyPrediction {
  weekStart: Date;
  weekEnd: Date;
  theme: string;
  overallEnergy: string;
  keyEvents: string[];
  focusAreas: string[];
  advice: string;
}

/**
 * Calculate weekly theme based on personal month and week number.
 * @param birthDate - Birth date
 * @param weekStartDate - Start date of the week
 * @returns Weekly prediction data
 */
export const calculateWeeklyTheme = (
  birthDate: Date,
  weekStartDate: Date = new Date()
): WeeklyPrediction => {
  // Get the week number within the month (1-4 or 5)
  const month = weekStartDate.getMonth() + 1;
  const year = weekStartDate.getFullYear();
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const daysDiff = Math.floor((weekStartDate.getTime() - firstDayOfMonth.getTime()) / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(daysDiff / 7) + 1;
  
  const personalMonth = calculatePersonalMonthNumber(birthDate, month, year);
  
  // Calculate average day numbers for the week
  const weekDays: number[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStartDate);
    day.setDate(weekStartDate.getDate() + i);
    weekDays.push(calculatePersonalDayNumber(birthDate, day));
  }
  const avgDayNumber = Math.round(weekDays.reduce((a, b) => a + b, 0) / 7);
  
  const themes: Record<number, { theme: string; energy: string; events: string[]; focus: string[]; advice: string }> = {
    1: {
      theme: "New Beginnings Week",
      energy: "High initiative and leadership",
      events: ["Project launches", "Important decisions", "New opportunities"],
      focus: ["Starting fresh", "Taking action", "Setting intentions"],
      advice: "This week is perfect for initiating new projects and taking the lead."
    },
    2: {
      theme: "Cooperation Week",
      energy: "Collaborative and diplomatic",
      events: ["Partnerships form", "Team meetings", "Mediation needed"],
      focus: ["Working together", "Listening", "Building relationships"],
      advice: "Focus on collaboration and patience. Success comes through teamwork."
    },
    3: {
      theme: "Creative Expression Week",
      energy: "Joyful and expressive",
      events: ["Social gatherings", "Creative projects", "Communication opportunities"],
      focus: ["Self-expression", "Socializing", "Sharing ideas"],
      advice: "Express yourself creatively and enjoy social connections this week."
    },
    4: {
      theme: "Foundation Building Week",
      energy: "Stable and organized",
      events: ["Planning sessions", "Organizational work", "Structure building"],
      focus: ["Organization", "Planning", "Building foundations"],
      advice: "Focus on creating structure and working systematically."
    },
    5: {
      theme: "Change and Adventure Week",
      energy: "Dynamic and flexible",
      events: ["Unexpected changes", "Travel opportunities", "New experiences"],
      focus: ["Adaptability", "Exploration", "Embracing change"],
      advice: "Be open to change and new experiences. Flexibility is key."
    },
    6: {
      theme: "Harmony and Responsibility Week",
      energy: "Nurturing and caring",
      events: ["Family time", "Home activities", "Community service"],
      focus: ["Family", "Home", "Caring for others"],
      advice: "Focus on creating harmony in relationships and home life."
    },
    7: {
      theme: "Reflection Week",
      energy: "Introspective and spiritual",
      events: ["Quiet time", "Study periods", "Spiritual practices"],
      focus: ["Inner work", "Reflection", "Seeking wisdom"],
      advice: "Take time for solitude and inner reflection this week."
    },
    8: {
      theme: "Achievement Week",
      energy: "Powerful and ambitious",
      events: ["Career opportunities", "Financial decisions", "Major accomplishments"],
      focus: ["Success", "Achievement", "Material goals"],
      advice: "Focus on professional goals and financial matters with confidence."
    },
    9: {
      theme: "Completion Week",
      energy: "Transformative and compassionate",
      events: ["Project completions", "Endings", "Charitable activities"],
      focus: ["Letting go", "Completing cycles", "Service to others"],
      advice: "Complete unfinished business and prepare for new beginnings."
    }
  };
  
  const weekData = themes[avgDayNumber] || themes[1];
  const weekEnd = new Date(weekStartDate);
  weekEnd.setDate(weekStartDate.getDate() + 6);
  
  return {
    weekStart: weekStartDate,
    weekEnd,
    theme: weekData.theme,
    overallEnergy: weekData.energy,
    keyEvents: weekData.events,
    focusAreas: weekData.focus,
    advice: weekData.advice
  };
};

/**
 * Calculate key events for the week based on numerology.
 * @param birthDate - Birth date
 * @param weekStartDate - Start date of the week
 * @returns Array of predicted events/opportunities
 */
export const calculateWeeklyEvents = (
  birthDate: Date,
  weekStartDate: Date = new Date()
): string[] => {
  const weekly = calculateWeeklyTheme(birthDate, weekStartDate);
  return weekly.keyEvents;
};

// ===== PHASE 5.2: Extended Monthly Predictions =====

/**
 * Calculate detailed monthly focus areas.
 * @param birthDate - Birth date
 * @param month - Month number (1-12)
 * @param year - Year
 * @returns Array of focus areas for the month
 */
export const calculateMonthlyFocus = (
  birthDate: Date,
  month: number,
  year: number
): string[] => {
  const personalMonth = calculatePersonalMonthNumber(birthDate, month, year);
  const monthly = getMonthlyPrediction(birthDate, month, year);
  
  const focusAreas: Record<number, string[]> = {
    1: ["New projects", "Leadership", "Independence", "Initiative"],
    2: ["Partnerships", "Cooperation", "Patience", "Details"],
    3: ["Creativity", "Expression", "Socializing", "Communication"],
    4: ["Organization", "Structure", "Foundation", "Discipline"],
    5: ["Change", "Freedom", "Adventure", "Flexibility"],
    6: ["Family", "Home", "Responsibility", "Harmony"],
    7: ["Reflection", "Study", "Spirituality", "Inner work"],
    8: ["Achievement", "Success", "Finances", "Power"],
    9: ["Completion", "Release", "Compassion", "Service"]
  };
  
  return focusAreas[personalMonth] || focusAreas[1];
};

/**
 * Get detailed monthly recommendations.
 * @param birthDate - Birth date
 * @param month - Month number (1-12)
 * @param year - Year
 * @returns Array of specific recommendations for the month
 */
export const getMonthlyRecommendations = (
  birthDate: Date,
  month: number,
  year: number
): string[] => {
  const personalMonth = calculatePersonalMonthNumber(birthDate, month, year);
  const monthly = getMonthlyPrediction(birthDate, month, year);
  
  const recommendations: Record<number, string[]> = {
    1: [
      "Start new projects or initiatives",
      "Take on leadership roles",
      "Set clear goals for the month",
      "Be proactive in pursuing opportunities",
      "Trust your instincts and take action"
    ],
    2: [
      "Focus on building partnerships",
      "Practice patience in all matters",
      "Pay attention to details",
      "Listen more than you speak",
      "Seek collaboration over competition"
    ],
    3: [
      "Express yourself creatively",
      "Engage in social activities",
      "Share your ideas and enthusiasm",
      "Find joy in everyday moments",
      "Communicate openly and honestly"
    ],
    4: [
      "Organize your life and workspace",
      "Build solid foundations",
      "Focus on practical matters",
      "Establish consistent routines",
      "Work systematically toward goals"
    ],
    5: [
      "Embrace change and new experiences",
      "Be flexible with plans",
      "Try new things",
      "Travel or explore",
      "Break out of comfort zones"
    ],
    6: [
      "Spend quality time with family",
      "Focus on home improvements",
      "Nurture relationships",
      "Help others in need",
      "Create harmony in your environment"
    ],
    7: [
      "Take time for solitude",
      "Engage in study or research",
      "Practice meditation or reflection",
      "Trust your intuition",
      "Seek inner wisdom"
    ],
    8: [
      "Focus on career advancement",
      "Make important financial decisions",
      "Take calculated risks",
      "Invest in your future",
      "Step into positions of authority"
    ],
    9: [
      "Complete unfinished projects",
      "Let go of what no longer serves",
      "Practice forgiveness",
      "Help others through service",
      "Prepare for new cycles"
    ]
  };
  
  return recommendations[personalMonth] || recommendations[1];
};

// ===== PHASE 5.3: Annual Predictions =====

/**
 * Calculate annual theme based on personal year number.
 * @param birthDate - Birth date
 * @param year - Year to analyze
 * @returns Annual theme description
 */
export const calculateAnnualTheme = (
  birthDate: Date,
  year: number
): { theme: string; description: string } => {
  const personalYear = calculatePersonalYearNumber(birthDate, year);
  
  const themes: Record<number, { theme: string; description: string }> = {
    1: {
      theme: "New Beginnings Year",
      description: "A year of fresh starts, new opportunities, and taking initiative. Plant seeds for future growth."
    },
    2: {
      theme: "Partnership Year",
      description: "A year focused on cooperation, patience, and building relationships. Success comes through collaboration."
    },
    3: {
      theme: "Creative Expression Year",
      description: "A vibrant year for creativity, socializing, and self-expression. Joy and inspiration abound."
    },
    4: {
      theme: "Foundation Building Year",
      description: "A year for hard work, organization, and creating stability. Discipline brings lasting results."
    },
    5: {
      theme: "Change and Freedom Year",
      description: "An exciting year of change, travel, and new experiences. Flexibility is your greatest asset."
    },
    6: {
      theme: "Love and Responsibility Year",
      description: "A year focused on home, family, and nurturing. Love and harmony guide your path."
    },
    7: {
      theme: "Inner Wisdom Year",
      description: "A reflective year for inner work, study, and spiritual development. Trust your intuition."
    },
    8: {
      theme: "Power and Abundance Year",
      description: "A powerful year for achievement, recognition, and material success. Step into your power."
    },
    9: {
      theme: "Completion and Release Year",
      description: "A year of endings, release, and humanitarian focus. Let go to make room for the new."
    }
  };
  
  return themes[personalYear] || themes[1];
};

/**
 * Calculate annual opportunities based on personal year.
 * @param birthDate - Birth date
 * @param year - Year to analyze
 * @returns Array of opportunities for the year
 */
export const calculateAnnualOpportunities = (
  birthDate: Date,
  year: number
): string[] => {
  const personalYear = calculatePersonalYearNumber(birthDate, year);
  
  const opportunities: Record<number, string[]> = {
    1: [
      "Starting new ventures",
      "Leadership opportunities",
      "Career changes",
      "Personal growth initiatives",
      "Setting new life directions"
    ],
    2: [
      "Forming partnerships",
      "Building strong relationships",
      "Collaborative projects",
      "Diplomatic solutions",
      "Developing patience and understanding"
    ],
    3: [
      "Creative projects",
      "Social networking",
      "Self-expression opportunities",
      "Artistic endeavors",
      "Joyful experiences"
    ],
    4: [
      "Building solid foundations",
      "Long-term planning",
      "Organizational improvements",
      "Stability creation",
      "Systematic progress"
    ],
    5: [
      "Travel and adventure",
      "New experiences",
      "Embracing change",
      "Freedom and flexibility",
      "Unexpected opportunities"
    ],
    6: [
      "Family harmony",
      "Home improvements",
      "Nurturing relationships",
      "Community service",
      "Creating beauty"
    ],
    7: [
      "Spiritual growth",
      "Inner discovery",
      "Study and research",
      "Meditation practices",
      "Wisdom development"
    ],
    8: [
      "Career advancement",
      "Financial success",
      "Material achievements",
      "Recognition and authority",
      "Business opportunities"
    ],
    9: [
      "Completing cycles",
      "Helping others",
      "Charitable work",
      "Transformation",
      "Preparing for new beginnings"
    ]
  };
  
  return opportunities[personalYear] || opportunities[1];
};

/**
 * Calculate annual challenges based on personal year.
 * @param birthDate - Birth date
 * @param year - Year to analyze
 * @returns Array of challenges for the year
 */
export const calculateAnnualChallenges = (
  birthDate: Date,
  year: number
): string[] => {
  const personalYear = calculatePersonalYearNumber(birthDate, year);
  
  const challenges: Record<number, string[]> = {
    1: [
      "Avoiding impulsivity",
      "Balancing independence with cooperation",
      "Managing impatience",
      "Not being too self-centered"
    ],
    2: [
      "Overcoming indecision",
      "Avoiding excessive sensitivity",
      "Balancing cooperation with self-assertion",
      "Managing dependency"
    ],
    3: [
      "Avoiding scattered energy",
      "Balancing social life with personal time",
      "Not being superficial",
      "Managing overindulgence"
    ],
    4: [
      "Avoiding rigidity",
      "Balancing work with rest",
      "Not becoming workaholic",
      "Managing resistance to change"
    ],
    5: [
      "Avoiding impulsivity",
      "Balancing freedom with responsibility",
      "Managing restlessness",
      "Not making hasty decisions"
    ],
    6: [
      "Avoiding overprotectiveness",
      "Balancing care for others with self-care",
      "Not sacrificing personal needs",
      "Managing perfectionism"
    ],
    7: [
      "Avoiding isolation",
      "Balancing solitude with social connection",
      "Not becoming too withdrawn",
      "Managing overthinking"
    ],
    8: [
      "Avoiding materialism",
      "Balancing ambition with compassion",
      "Not becoming power-obsessed",
      "Managing stress from ambition"
    ],
    9: [
      "Letting go of the past",
      "Balancing completion with new beginnings",
      "Avoiding melancholy",
      "Managing emotional attachments"
    ]
  };
  
  return challenges[personalYear] || challenges[1];
};

/**
 * Calculate cycle transitions - when personal year transitions occur.
 * @param birthDate - Birth date
 * @param startYear - Starting year (default: current year)
 * @param yearsAhead - Number of years to look ahead (default: 5)
 * @returns Array of cycle transition years
 */
export const calculateCycleTransitions = (
  birthDate: Date,
  startYear: number = new Date().getFullYear(),
  yearsAhead: number = 5
): Array<{ year: number; fromYear: number; toYear: number; significance: string }> => {
  const transitions: Array<{ year: number; fromYear: number; toYear: number; significance: string }> = [];
  
  for (let i = 0; i < yearsAhead; i++) {
    const year = startYear + i;
    const currentYear = calculatePersonalYearNumber(birthDate, year);
    const nextYear = calculatePersonalYearNumber(birthDate, year + 1);
    
    // Major transitions: 9 to 1, or when year changes significantly
    if (currentYear === 9 && nextYear === 1) {
      transitions.push({
        year: year + 1,
        fromYear: currentYear,
        toYear: nextYear,
        significance: "Major cycle completion - ending a 9-year cycle and beginning a new one"
      });
    } else if (Math.abs(currentYear - nextYear) >= 4) {
      transitions.push({
        year: year + 1,
        fromYear: currentYear,
        toYear: nextYear,
        significance: "Significant energy shift in personal year"
      });
    }
  }
  
  return transitions;
};

// ===== PHASE 5.4: Calendar Functions =====

/**
 * Get favorable days in a date range based on numerology.
 * @param birthDate - Birth date
 * @param startDate - Start date of range
 * @param endDate - End date of range
 * @param minScore - Minimum lucky score (default: 40)
 * @returns Array of favorable dates with their scores
 */
export const getFavorableDays = (
  birthDate: Date,
  startDate: Date,
  endDate: Date,
  minScore: number = 40
): Array<{ date: Date; score: number; reasons: string[] }> => {
  const lifePath = calculateLifePathNumber(birthDate);
  const favorableDays: Array<{ date: Date; score: number; reasons: string[] }> = [];
  
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const personalYear = calculatePersonalYearNumber(birthDate, currentDate.getFullYear());
    const { score, reasons } = calculateLuckyScore(currentDate, lifePath, 0, personalYear);
    
    if (score >= minScore) {
      favorableDays.push({
        date: new Date(currentDate),
        score,
        reasons
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return favorableDays.sort((a, b) => b.score - a.score);
};

/**
 * Get unfavorable days in a date range.
 * @param birthDate - Birth date
 * @param startDate - Start date of range
 * @param endDate - End date of range
 * @param maxScore - Maximum lucky score (default: 20)
 * @returns Array of unfavorable dates
 */
export const getUnfavorableDays = (
  birthDate: Date,
  startDate: Date,
  endDate: Date,
  maxScore: number = 20
): Array<{ date: Date; score: number; reasons: string[] }> => {
  const lifePath = calculateLifePathNumber(birthDate);
  const unfavorableDays: Array<{ date: Date; score: number; reasons: string[] }> = [];
  
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const personalYear = calculatePersonalYearNumber(birthDate, currentDate.getFullYear());
    const { score, reasons } = calculateLuckyScore(currentDate, lifePath, 0, personalYear);
    
    if (score <= maxScore) {
      unfavorableDays.push({
        date: new Date(currentDate),
        score,
        reasons
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return unfavorableDays.sort((a, b) => a.score - b.score);
};

/**
 * Get optimal days for specific actions based on numerology.
 * @param birthDate - Birth date
 * @param actionType - Type of action (e.g., "start_project", "sign_contract", "travel")
 * @param startDate - Start date of range
 * @param endDate - End date of range
 * @returns Array of optimal dates for the action
 */
export const getOptimalDaysForAction = (
  birthDate: Date,
  actionType: string,
  startDate: Date,
  endDate: Date
): Array<{ date: Date; dayNumber: number; reason: string }> => {
  const optimalDays: Array<{ date: Date; dayNumber: number; reason: string }> = [];
  
  // Map action types to preferred day numbers
  const actionPreferences: Record<string, number[]> = {
    start_project: [1, 8],
    sign_contract: [4, 8],
    travel: [5, 3],
    social_event: [3, 6],
    financial_decision: [8, 4],
    creative_work: [3, 7],
    spiritual_practice: [7, 9],
    family_time: [6, 2],
    career_move: [1, 8],
    health_focus: [6, 4]
  };
  
  const preferredNumbers = actionPreferences[actionType] || [1, 8];
  
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dayNumber = calculatePersonalDayNumber(birthDate, currentDate);
    
    if (preferredNumbers.includes(dayNumber)) {
      const reason = dayNumber === 1 
        ? "Day of new beginnings - perfect for starting"
        : dayNumber === 8
        ? "Day of achievement - ideal for important actions"
        : `Day number ${dayNumber} aligns with ${actionType}`;
        
      optimalDays.push({
        date: new Date(currentDate),
        dayNumber,
        reason
      });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return optimalDays;
};

/**
 * Analyze a specific event date for numerology compatibility.
 * @param birthDate - Birth date
 * @param eventDate - Date of the event
 * @param eventType - Type of event (optional)
 * @returns Analysis of the event date
 */
export const analyzeEventDate = (
  birthDate: Date,
  eventDate: Date,
  eventType?: string
): {
  personalDay: number;
  universalDay: number;
  compatibility: "excellent" | "good" | "neutral" | "challenging";
  analysis: string;
  recommendations: string[];
} => {
  const personalDay = calculatePersonalDayNumber(birthDate, eventDate);
  const universalDay = calculateUniversalDayNumber(eventDate);
  const lifePath = calculateLifePathNumber(birthDate);
  const personalYear = calculatePersonalYearNumber(birthDate, eventDate.getFullYear());
  const { score } = calculateLuckyScore(eventDate, lifePath, 0, personalYear);
  
  let compatibility: "excellent" | "good" | "neutral" | "challenging";
  let analysis: string;
  
  if (score >= 60) {
    compatibility = "excellent";
    analysis = "This is an excellent date for your event. The numerological energies are highly favorable.";
  } else if (score >= 40) {
    compatibility = "good";
    analysis = "This is a good date for your event. The energies are generally favorable.";
  } else if (score >= 25) {
    compatibility = "neutral";
    analysis = "This date has neutral energies. Consider if this timing aligns with your intentions.";
  } else {
    compatibility = "challenging";
    analysis = "This date may present challenges. Consider alternative dates or prepare for potential obstacles.";
  }
  
  const recommendations = getDayRecommendations(birthDate, eventDate);
  
  return {
    personalDay,
    universalDay,
    compatibility,
    analysis,
    recommendations
  };
};
