/**
 * Educational system for Numerology Compass
 * Handles courses, lessons, quizzes, badges, and certificates
 */

export interface Lesson {
  id: string;
  title: string;
  content: string;
  example?: string;
  quiz?: Quiz;
  order: number;
}

export interface Quiz {
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  estimatedDuration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

export interface CourseProgress {
  courseId: string;
  completedLessons: string[];
  currentLessonId: string | null;
  startedAt: string;
  completedAt: string | null;
  score: number; // 0-100
}

export interface QuizResult {
  quizId: string;
  correct: boolean;
  selectedAnswer: number;
  timestamp: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'course' | 'quiz' | 'achievement';
  earnedAt: string | null;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  earnedAt: string;
  score: number;
}

/**
 * Get course progress for a user
 */
export const getCourseProgress = (courseId: string, progressData: CourseProgress[]): CourseProgress | null => {
  return progressData.find(p => p.courseId === courseId) || null;
};

/**
 * Calculate course completion percentage
 */
export const calculateCourseProgress = (course: Course, progress: CourseProgress | null): number => {
  if (!progress) return 0;
  return (progress.completedLessons.length / course.lessons.length) * 100;
};

/**
 * Complete a lesson
 */
export const completeLesson = (
  courseId: string,
  lessonId: string,
  progressData: CourseProgress[]
): CourseProgress[] => {
  const existing = progressData.find(p => p.courseId === courseId);
  
  if (existing) {
    if (!existing.completedLessons.includes(lessonId)) {
      existing.completedLessons.push(lessonId);
    }
    existing.currentLessonId = lessonId;
    
    return progressData.map(p => 
      p.courseId === courseId ? existing : p
    );
  } else {
    // Create new progress
    const newProgress: CourseProgress = {
      courseId,
      completedLessons: [lessonId],
      currentLessonId: lessonId,
      startedAt: new Date().toISOString(),
      completedAt: null,
      score: 0,
    };
    return [...progressData, newProgress];
  }
};

/**
 * Check if course is completed
 */
export const isCourseCompleted = (course: Course, progress: CourseProgress | null): boolean => {
  if (!progress) return false;
  return progress.completedLessons.length === course.lessons.length;
};

/**
 * Calculate course score based on quiz results
 */
export const calculateCourseScore = (course: Course, quizResults: QuizResult[]): number => {
  const courseQuizIds = course.lessons
    .filter(l => l.quiz)
    .map(l => `${course.id}-${l.id}`);
  
  const relevantResults = quizResults.filter(r => 
    courseQuizIds.some(id => r.quizId.startsWith(id))
  );
  
  if (relevantResults.length === 0) return 0;
  
  const correctCount = relevantResults.filter(r => r.correct).length;
  return Math.round((correctCount / relevantResults.length) * 100);
};

/**
 * Generate certificate for completed course
 */
export const getCertificate = (course: Course, progress: CourseProgress, quizResults: QuizResult[]): Certificate | null => {
  if (!isCourseCompleted(course, progress)) {
    return null;
  }
  
  const score = calculateCourseScore(course, quizResults);
  
  return {
    id: `cert-${course.id}-${Date.now()}`,
    courseId: course.id,
    courseName: course.title,
    earnedAt: new Date().toISOString(),
    score,
  };
};

/**
 * Check quiz answer
 */
export const checkQuizAnswer = (quiz: Quiz, selectedAnswer: number): boolean => {
  return selectedAnswer === quiz.correct;
};

/**
 * Get quiz statistics
 */
export const getQuizStatistics = (quizResults: QuizResult[]): {
  total: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  averageTime?: number;
} => {
  const total = quizResults.length;
  const correct = quizResults.filter(r => r.correct).length;
  const incorrect = total - correct;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  return {
    total,
    correct,
    incorrect,
    accuracy,
  };
};

/**
 * Award badge based on achievements
 */
export const awardBadge = (
  badgeId: string,
  earnedBadges: Badge[]
): Badge | null => {
  if (earnedBadges.find(b => b.id === badgeId && b.earnedAt)) {
    return null; // Already earned
  }
  
  const badge: Badge = {
    id: badgeId,
    name: getBadgeName(badgeId),
    description: getBadgeDescription(badgeId),
    icon: getBadgeIcon(badgeId),
    category: getBadgeCategory(badgeId),
    earnedAt: new Date().toISOString(),
  };
  
  return badge;
};

/**
 * Check if user qualifies for a badge
 */
export const checkBadgeQualification = (
  badgeId: string,
  progressData: CourseProgress[],
  quizResults: QuizResult[],
  completedCourses: string[]
): boolean => {
  switch (badgeId) {
    case 'first-lesson':
      return progressData.some(p => p.completedLessons.length > 0);
    case 'first-course':
      return completedCourses.length >= 1;
    case 'quiz-master': {
      const stats = getQuizStatistics(quizResults);
      return stats.total >= 10 && stats.accuracy >= 80;
    }
    case 'perfectionist':
      return quizResults.length > 0 && quizResults.every(r => r.correct);
    case 'dedicated-student':
      return progressData.length >= 3;
    default:
      return false;
  }
};

// Badge definitions
const getBadgeName = (badgeId: string): string => {
  const names: Record<string, string> = {
    'first-lesson': 'Prima Lecție',
    'first-course': 'Primul Curs',
    'quiz-master': 'Maestru Quiz',
    'perfectionist': 'Perfecționist',
    'dedicated-student': 'Student Dedicat',
  };
  return names[badgeId] || 'Badge';
};

const getBadgeDescription = (badgeId: string): string => {
  const descriptions: Record<string, string> = {
    'first-lesson': 'Ai completat prima lecție',
    'first-course': 'Ai finalizat primul curs complet',
    'quiz-master': 'Ai răspuns corect la 80%+ din 10+ quiz-uri',
    'perfectionist': 'Ai răspuns corect la toate quiz-urile',
    'dedicated-student': 'Ai început cel puțin 3 cursuri',
  };
  return descriptions[badgeId] || 'Badge descriere';
};

const getBadgeIcon = (badgeId: string): string => {
  const icons: Record<string, string> = {
    'first-lesson': '🎓',
    'first-course': '🏆',
    'quiz-master': '⭐',
    'perfectionist': '💎',
    'dedicated-student': '📚',
  };
  return icons[badgeId] || '🏅';
};

const getBadgeCategory = (badgeId: string): Badge['category'] => {
  if (badgeId.includes('course')) return 'course';
  if (badgeId.includes('quiz')) return 'quiz';
  return 'achievement';
};

