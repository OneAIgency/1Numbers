import { Link } from 'react-router-dom';
import { GraduationCap, Clock, CheckCircle, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Course, CourseProgress, calculateCourseProgress } from '@/lib/education';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: Course;
  progress?: CourseProgress | null;
  className?: string;
}

export const CourseCard = ({ course, progress, className }: CourseCardProps) => {
  const progressPercent = calculateCourseProgress(course, progress || null);
  const isCompleted = progress?.completedLessons.length === course.lessons.length;

  return (
    <Link to={`/courses/${course.id}`}>
      <Card className={cn(
        "card-mystic hover:glow-gold-subtle transition-all duration-300 cursor-pointer h-full",
        isCompleted && "ring-2 ring-primary/50",
        className
      )}>
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <CardTitle className="font-cinzel text-xl text-foreground">
              {course.title}
            </CardTitle>
            {isCompleted && (
              <CheckCircle className="h-5 w-5 text-green-500 shrink-0 ml-2" />
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <GraduationCap className="h-4 w-4" />
              <span>{course.lessons.length} lecții</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.estimatedDuration} min</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={course.difficulty === 'beginner' ? 'default' : 'secondary'}>
              {course.difficulty}
            </Badge>
            <Badge variant="outline">{course.category}</Badge>
          </div>

          {progress && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progres</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            {isCompleted ? (
              <Badge variant="default" className="w-full justify-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completat
              </Badge>
            ) : progress ? (
              <Badge variant="outline" className="w-full justify-center">
                <PlayCircle className="h-3 w-3 mr-1" />
                Continuă
              </Badge>
            ) : (
              <Badge variant="outline" className="w-full justify-center">
                Începe
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

