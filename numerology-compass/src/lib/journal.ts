/**
 * Journal system for Numerology Compass
 * Handles journal entries, prediction history, and statistics
 */

export interface JournalEntry {
  id: string;
  userId: string;
  entryType: 'journal' | 'prediction';
  title: string;
  content?: string;
  date: string;
  numerologyData?: Record<string, unknown>;
  tags?: string[];
  mood?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalStatistics {
  totalEntries: number;
  entriesByType: Record<string, number>;
  entriesByMood: Array<{ mood: string; count: number }>;
  topTags: Array<{ tag: string; count: number }>;
  entriesPerMonth: Array<{ month: string; count: number }>;
}

export interface PredictionEntry extends JournalEntry {
  entryType: 'prediction';
  numerologyData: {
    personalDay?: number;
    personalMonth?: number;
    personalYear?: number;
    prediction?: string;
    actualOutcome?: string;
    accuracy?: number;
  };
}

/**
 * Calculate personal statistics from journal entries
 */
export const calculatePersonalStatistics = (entries: JournalEntry[]): {
  totalEntries: number;
  journalEntries: number;
  predictions: number;
  averageEntriesPerMonth: number;
  mostActiveMonth: string | null;
  mostCommonMood: string | null;
  mostUsedTags: string[];
} => {
  const totalEntries = entries.length;
  const journalEntries = entries.filter(e => e.entryType === 'journal').length;
  const predictions = entries.filter(e => e.entryType === 'prediction').length;

  // Group by month
  const monthlyCounts: Record<string, number> = {};
  entries.forEach(entry => {
    const month = entry.date.substring(0, 7); // YYYY-MM
    monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
  });

  const months = Object.keys(monthlyCounts);
  const averageEntriesPerMonth = months.length > 0 
    ? totalEntries / months.length 
    : 0;

  const mostActiveMonth = months.length > 0
    ? months.reduce((a, b) => monthlyCounts[a] > monthlyCounts[b] ? a : b)
    : null;

  // Most common mood
  const moodCounts: Record<string, number> = {};
  entries.forEach(entry => {
    if (entry.mood) {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    }
  });

  const mostCommonMood = Object.keys(moodCounts).length > 0
    ? Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b)
    : null;

  // Most used tags
  const tagCounts: Record<string, number> = {};
  entries.forEach(entry => {
    if (entry.tags) {
      entry.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  const mostUsedTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag]) => tag);

  return {
    totalEntries,
    journalEntries,
    predictions,
    averageEntriesPerMonth: Math.round(averageEntriesPerMonth * 10) / 10,
    mostActiveMonth,
    mostCommonMood,
    mostUsedTags,
  };
};

/**
 * Identify patterns in journal entries
 */
export const identifyPatterns = (entries: JournalEntry[]): {
  recurringNumbers: Array<{ number: number; frequency: number }>;
  moodPatterns: Array<{ mood: string; days: string[] }>;
  tagCombinations: Array<{ tags: string[]; frequency: number }>;
} => {
  // Extract numerology numbers from entries
  const numberCounts: Record<number, number> = {};
  entries.forEach(entry => {
    if (entry.numerologyData) {
      Object.values(entry.numerologyData).forEach(value => {
        if (typeof value === 'number' && value >= 1 && value <= 33) {
          numberCounts[value] = (numberCounts[value] || 0) + 1;
        }
      });
    }
  });

  const recurringNumbers = Object.entries(numberCounts)
    .map(([number, frequency]) => ({ number: parseInt(number), frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);

  // Mood patterns by day of week
  const moodByDay: Record<string, Record<string, number>> = {};
  entries.forEach(entry => {
    if (entry.mood && entry.date) {
      const date = new Date(entry.date);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      if (!moodByDay[dayOfWeek]) {
        moodByDay[dayOfWeek] = {};
      }
      moodByDay[dayOfWeek][entry.mood] = (moodByDay[dayOfWeek][entry.mood] || 0) + 1;
    }
  });

  const moodPatterns = Object.entries(moodByDay).map(([day, moods]) => {
    const mostCommonMood = Object.entries(moods).reduce((a, b) => 
      a[1] > b[1] ? a : b
    )[0];
    return { mood: mostCommonMood, days: [day] };
  });

  // Tag combinations
  const tagCombinationCounts: Record<string, number> = {};
  entries.forEach(entry => {
    if (entry.tags && entry.tags.length > 1) {
      const sortedTags = [...entry.tags].sort().join(',');
      tagCombinationCounts[sortedTags] = (tagCombinationCounts[sortedTags] || 0) + 1;
    }
  });

  const tagCombinations = Object.entries(tagCombinationCounts)
    .map(([tags, frequency]) => ({
      tags: tags.split(','),
      frequency,
    }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 5);

  return {
    recurringNumbers,
    moodPatterns,
    tagCombinations,
  };
};

/**
 * Analyze prediction accuracy
 */
export const analyzePredictionAccuracy = (predictions: PredictionEntry[]): {
  totalPredictions: number;
  ratedPredictions: number;
  averageAccuracy: number;
  accuracyDistribution: Array<{ range: string; count: number }>;
  mostAccuratePeriod: string | null;
} => {
  const rated = predictions.filter(p => 
    p.numerologyData?.accuracy !== undefined && p.numerologyData.accuracy !== null
  );

  const totalPredictions = predictions.length;
  const ratedPredictions = rated.length;

  const averageAccuracy = rated.length > 0
    ? rated.reduce((sum, p) => sum + (p.numerologyData?.accuracy || 0), 0) / rated.length
    : 0;

  // Accuracy distribution
  const distribution: Record<string, number> = {
    '0-20': 0,
    '21-40': 0,
    '41-60': 0,
    '61-80': 0,
    '81-100': 0,
  };

  rated.forEach(p => {
    const accuracy = p.numerologyData?.accuracy || 0;
    if (accuracy <= 20) distribution['0-20']++;
    else if (accuracy <= 40) distribution['21-40']++;
    else if (accuracy <= 60) distribution['41-60']++;
    else if (accuracy <= 80) distribution['61-80']++;
    else distribution['81-100']++;
  });

  const accuracyDistribution = Object.entries(distribution).map(([range, count]) => ({
    range,
    count,
  }));

  // Most accurate period (month)
  const monthlyAccuracy: Record<string, number[]> = {};
  rated.forEach(p => {
    const month = p.date.substring(0, 7);
    if (!monthlyAccuracy[month]) {
      monthlyAccuracy[month] = [];
    }
    monthlyAccuracy[month].push(p.numerologyData?.accuracy || 0);
  });

  const mostAccuratePeriod = Object.keys(monthlyAccuracy).length > 0
    ? Object.entries(monthlyAccuracy)
        .map(([month, accuracies]) => ({
          month,
          average: accuracies.reduce((a, b) => a + b, 0) / accuracies.length,
        }))
        .reduce((a, b) => a.average > b.average ? a : b).month
    : null;

  return {
    totalPredictions,
    ratedPredictions,
    averageAccuracy: Math.round(averageAccuracy * 10) / 10,
    accuracyDistribution,
    mostAccuratePeriod,
  };
};

/**
 * Compare time periods
 */
export const compareTimePeriods = (
  entries: JournalEntry[],
  period1: { start: string; end: string },
  period2: { start: string; end: string }
): {
  period1: {
    entries: number;
    averageMood?: string;
    topTags: string[];
  };
  period2: {
    entries: number;
    averageMood?: string;
    topTags: string[];
  };
  differences: {
    entryCountDiff: number;
    moodShift?: string;
  };
} => {
  const period1Entries = entries.filter(e => 
    e.date >= period1.start && e.date <= period1.end
  );
  const period2Entries = entries.filter(e => 
    e.date >= period2.start && e.date <= period2.end
  );

  const getTopTags = (entries: JournalEntry[]) => {
    const tagCounts: Record<string, number> = {};
    entries.forEach(e => {
      e.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([tag]) => tag);
  };

  const getAverageMood = (entries: JournalEntry[]) => {
    const moodCounts: Record<string, number> = {};
    entries.forEach(e => {
      if (e.mood) {
        moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
      }
    });
    if (Object.keys(moodCounts).length === 0) return undefined;
    return Object.entries(moodCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  };

  const period1Data = {
    entries: period1Entries.length,
    averageMood: getAverageMood(period1Entries),
    topTags: getTopTags(period1Entries),
  };

  const period2Data = {
    entries: period2Entries.length,
    averageMood: getAverageMood(period2Entries),
    topTags: getTopTags(period2Entries),
  };

  return {
    period1: period1Data,
    period2: period2Data,
    differences: {
      entryCountDiff: period2Data.entries - period1Data.entries,
      moodShift: period1Data.averageMood && period2Data.averageMood && 
                 period1Data.averageMood !== period2Data.averageMood
        ? `${period1Data.averageMood} → ${period2Data.averageMood}`
        : undefined,
    },
  };
};

