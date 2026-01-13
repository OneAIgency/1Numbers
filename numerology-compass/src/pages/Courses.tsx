import { useState, useEffect } from 'react';
import { GraduationCap, Trophy, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CourseCard } from '@/components/CourseCard';
import { Course, CourseProgress } from '@/lib/education';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/layout/PageHeader';

// Mock courses - in production, these would come from API/database
const mockCourses: Course[] = [
  {
    id: 'intro-numerology',
    title: 'Introducere în Numerologie',
    description: 'Învață bazele numerologiei și cum să calculezi numerele tale personale.',
    lessons: [],
    estimatedDuration: 30,
    difficulty: 'beginner',
    category: 'Basics',
  },
  {
    id: 'life-path-mastery',
    title: 'Maestru: Numărul Drumului Vieții',
    description: 'Studiu aprofundat al Numărului Drumului Vieții și semnificația sa.',
    lessons: [],
    estimatedDuration: 45,
    difficulty: 'intermediate',
    category: 'Advanced',
  },
];

const Courses = () => {
  const { t } = useLanguage();
  const [courses] = useState<Course[]>(mockCourses);
  const [progressData, setProgressData] = useState<CourseProgress[]>([]);

  // Load progress from localStorage (in production, from API)
  useEffect(() => {
    const saved = localStorage.getItem('courseProgress');
    if (saved) {
      try {
        setProgressData(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading course progress:', e);
      }
    }
  }, []);

  return (
    <PageLayout>
      <PageHeader
        title="Cursuri Numerologie"
        subtitle="Învață numerologia pas cu pas prin cursuri structurate"
        badge={{
          icon: <GraduationCap className="h-4 w-4 text-primary" />,
          label: 'Cursuri'
        }}
      />

      <main className="relative z-10 px-4 pb-16">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const progress = progressData.find(p => p.courseId === course.id);
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  progress={progress}
                />
              );
            })}
          </div>

          {/* Empty State */}
          {courses.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nu sunt cursuri disponibile momentan</p>
            </div>
          )}
        </div>
      </main>
    </PageLayout>
  );
};

export default Courses;

