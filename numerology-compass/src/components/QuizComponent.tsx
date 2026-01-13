import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Quiz, checkQuizAnswer } from '@/lib/education';
import { cn } from '@/lib/utils';

interface QuizComponentProps {
  quiz: Quiz;
  onAnswer?: (correct: boolean, selectedAnswer: number) => void;
  showExplanation?: boolean;
  className?: string;
}

export const QuizComponent = ({ 
  quiz, 
  onAnswer, 
  showExplanation = true,
  className 
}: QuizComponentProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index: number) => {
    if (showResult) return;
    
    setSelectedAnswer(index);
    const correct = checkQuizAnswer(quiz, index);
    setIsCorrect(correct);
    setShowResult(true);
    
    onAnswer?.(correct, index);
  };

  const reset = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowResult(false);
  };

  return (
    <Card className={cn("card-mystic", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          Quiz
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-foreground/90 font-medium">{quiz.question}</p>
        
        <div className="grid grid-cols-1 gap-2">
          {quiz.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={showResult}
              className={cn(
                "p-4 rounded-lg border text-left transition-all",
                showResult && index === quiz.correct && "bg-green-500/20 border-green-500",
                showResult && selectedAnswer === index && index !== quiz.correct && "bg-destructive/20 border-destructive",
                !showResult && "hover:border-primary/50 border-border/50",
                showResult && "cursor-not-allowed"
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn(
                  "text-foreground/90",
                  showResult && index === quiz.correct && "text-green-400 font-medium",
                  showResult && selectedAnswer === index && index !== quiz.correct && "text-destructive"
                )}>
                  {option}
                </span>
                {showResult && index === quiz.correct && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {showResult && selectedAnswer === index && index !== quiz.correct && (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
            </button>
          ))}
        </div>

        {showResult && (
          <div className={cn(
            "p-4 rounded-lg",
            isCorrect ? "bg-green-500/10 border border-green-500/30" : "bg-destructive/10 border border-destructive/30"
          )}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-green-400">Răspuns corect!</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-destructive" />
                  <span className="font-medium text-destructive">Răspuns incorect</span>
                </>
              )}
            </div>
            {quiz.explanation && showExplanation && (
              <p className="text-sm text-muted-foreground mt-2">{quiz.explanation}</p>
            )}
          </div>
        )}

        {showResult && (
          <Button
            variant="outline"
            onClick={reset}
            className="w-full"
          >
            Încearcă din nou
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

