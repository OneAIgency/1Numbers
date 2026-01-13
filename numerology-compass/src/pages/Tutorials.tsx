import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, GraduationCap, ChevronRight, ChevronLeft, CheckCircle, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from '@/components/ui/progress';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';

interface TutorialStep {
  title: string;
  content: string;
  example?: string;
  quiz?: {
    question: string;
    options: string[];
    correct: number;
  };
}

const Tutorials = () => {
  const { language, t } = useLanguage();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  const labels = {
    ro: {
      title: 'Tutoriale Interactive',
      subtitle: 'Învață numerologia pas cu pas cu exerciții practice',
      label: 'Tutoriale',
      backToCalculator: 'Înapoi la Calculator',
      lesson: 'Lecția',
      step: 'Pas',
      of: 'din',
      next: 'Următorul',
      previous: 'Anterior',
      complete: 'Finalizează',
      completed: 'Completat',
      tryAgain: 'Încearcă din nou',
      correct: 'Corect!',
      incorrect: 'Incorect. Încearcă din nou.',
      startLesson: 'Începe lecția',
      lessons: [
        {
          title: 'Introducere în Numerologie',
          steps: [
            {
              title: 'Ce este Numerologia?',
              content: 'Numerologia este studiul semnificației ascunse a numerelor și a modului în care acestea influențează viața noastră. Fiecare număr poartă o vibrație unică ce ne poate ajuta să ne înțelegem mai bine pe noi și lumea din jur.',
              example: 'De exemplu, dacă te-ai născut pe 15, reduci: 1 + 5 = 6. Numărul 6 reprezintă armonia și responsabilitatea familială.'
            },
            {
              title: 'Sistemul Pitagoreic',
              content: 'Folosim sistemul Pitagoreic, cel mai popular în numerologia occidentală. Acesta atribuie valori de la 1 la 9 fiecărei litere: A=1, B=2, C=3... I=9, J=1, K=2... și așa mai departe.',
              quiz: {
                question: 'Ce valoare are litera "E" în sistemul Pitagoreic?',
                options: ['3', '5', '7', '9'],
                correct: 1
              }
            },
            {
              title: 'Reducerea Numerelor',
              content: 'În numerologie, majoritatea numerelor se reduc la o singură cifră (1-9) prin adunarea cifrelor componente. Excepție fac numerele master: 11, 22 și 33.',
              example: 'Exemplu: 1984 → 1+9+8+4 = 22 (număr master, nu se reduce) sau 1985 → 1+9+8+5 = 23 → 2+3 = 5',
              quiz: {
                question: 'La ce se reduce numărul 28?',
                options: ['1', '10', '2', '8'],
                correct: 0
              }
            }
          ]
        },
        {
          title: 'Numărul Drumului Vieții',
          steps: [
            {
              title: 'Ce reprezintă Drumul Vieții?',
              content: 'Numărul Drumului Vieții este cel mai important număr în numerologie. Derivat din data nașterii, el arată calea ta principală în viață, lecțiile de învățat și scopul existenței tale.',
            },
            {
              title: 'Cum se calculează?',
              content: 'Adună toate cifrele din data nașterii și reduce rezultatul. Atenție: reduce separat ziua, luna și anul înainte de a le aduna pentru a păstra numerele master.',
              example: 'Data: 15 noiembrie 1990\n15 → 1+5 = 6\n11 → păstrăm (master)\n1990 → 1+9+9+0 = 19 → 1+9 = 10 → 1+0 = 1\nTotal: 6 + 11 + 1 = 18 → 1+8 = 9\nDrum al Vieții = 9',
              quiz: {
                question: 'Care este Drumul Vieții pentru cineva născut pe 22 martie 1988?',
                options: ['6', '33', '7', '8'],
                correct: 0
              }
            }
          ]
        },
        {
          title: 'Numerele din Nume',
          steps: [
            {
              title: 'Numărul Destinului',
              content: 'Numărul Destinului (sau Expresiei) se calculează din toate literele numelui complet de la naștere. Arată talentele, abilitățile și potențialul tău.',
              example: 'MARIA ELENA POPESCU\nM=4, A=1, R=9, I=9, A=1 = 24 → 6\nE=5, L=3, E=5, N=5, A=1 = 19 → 10 → 1\nP=7, O=6, P=7, E=5, S=1, C=3, U=3 = 32 → 5\nTotal: 6+1+5 = 12 → 3'
            },
            {
              title: 'Numărul Sufletului',
              content: 'Calculat doar din vocalele numelui (A, E, I, O, U), Numărul Sufletului relevă dorințele tale interioare și motivațiile cele mai profunde - ceea ce îți dorești cu adevărat.',
              quiz: {
                question: 'Din ce litere se calculează Numărul Sufletului?',
                options: ['Consoane', 'Vocale', 'Toate literele', 'Prima și ultima literă'],
                correct: 1
              }
            },
            {
              title: 'Numărul Personalității',
              content: 'Calculat din consoanele numelui, Numărul Personalității arată cum te percep alții și masca pe care o porți în lume.',
            }
          ]
        }
      ]
    },
    en: {
      title: 'Interactive Tutorials',
      subtitle: 'Learn numerology step by step with practical exercises',
      label: 'Tutorials',
      backToCalculator: 'Back to Calculator',
      lesson: 'Lesson',
      step: 'Step',
      of: 'of',
      next: 'Next',
      previous: 'Previous',
      complete: 'Complete',
      completed: 'Completed',
      tryAgain: 'Try again',
      correct: 'Correct!',
      incorrect: 'Incorrect. Try again.',
      startLesson: 'Start lesson',
      lessons: [
        {
          title: 'Introduction to Numerology',
          steps: [
            {
              title: 'What is Numerology?',
              content: 'Numerology is the study of the hidden meaning of numbers and how they influence our lives. Each number carries a unique vibration that can help us better understand ourselves and the world around us.',
              example: 'For example, if you were born on the 15th, you reduce: 1 + 5 = 6. The number 6 represents harmony and family responsibility.'
            },
            {
              title: 'The Pythagorean System',
              content: 'We use the Pythagorean system, the most popular in Western numerology. It assigns values from 1 to 9 to each letter: A=1, B=2, C=3... I=9, J=1, K=2... and so on.',
              quiz: {
                question: 'What value does the letter "E" have in the Pythagorean system?',
                options: ['3', '5', '7', '9'],
                correct: 1
              }
            },
            {
              title: 'Reducing Numbers',
              content: 'In numerology, most numbers are reduced to a single digit (1-9) by adding their component digits. The exceptions are master numbers: 11, 22, and 33.',
              example: 'Example: 1984 → 1+9+8+4 = 22 (master number, not reduced) or 1985 → 1+9+8+5 = 23 → 2+3 = 5',
              quiz: {
                question: 'What does the number 28 reduce to?',
                options: ['1', '10', '2', '8'],
                correct: 0
              }
            }
          ]
        },
        {
          title: 'Life Path Number',
          steps: [
            {
              title: 'What does Life Path represent?',
              content: 'The Life Path Number is the most important number in numerology. Derived from your birth date, it shows your main path in life, lessons to learn, and your life purpose.',
            },
            {
              title: 'How is it calculated?',
              content: 'Add all the digits in your birth date and reduce the result. Note: reduce day, month, and year separately before adding them to preserve master numbers.',
              example: 'Date: November 15, 1990\n15 → 1+5 = 6\n11 → keep (master)\n1990 → 1+9+9+0 = 19 → 1+9 = 10 → 1+0 = 1\nTotal: 6 + 11 + 1 = 18 → 1+8 = 9\nLife Path = 9',
              quiz: {
                question: 'What is the Life Path for someone born March 22, 1988?',
                options: ['6', '33', '7', '8'],
                correct: 0
              }
            }
          ]
        },
        {
          title: 'Numbers from Your Name',
          steps: [
            {
              title: 'Destiny Number',
              content: 'The Destiny Number (or Expression Number) is calculated from all letters in your full birth name. It shows your talents, abilities, and potential.',
              example: 'JOHN WILLIAM SMITH\nJ=1, O=6, H=8, N=5 = 20 → 2\nW=5, I=9, L=3, L=3, I=9, A=1, M=4 = 34 → 7\nS=1, M=4, I=9, T=2, H=8 = 24 → 6\nTotal: 2+7+6 = 15 → 6'
            },
            {
              title: 'Soul Urge Number',
              content: 'Calculated only from vowels (A, E, I, O, U), the Soul Urge Number reveals your innermost desires and deepest motivations - what you truly want.',
              quiz: {
                question: 'From which letters is the Soul Urge Number calculated?',
                options: ['Consonants', 'Vowels', 'All letters', 'First and last letter'],
                correct: 1
              }
            },
            {
              title: 'Personality Number',
              content: 'Calculated from consonants in your name, the Personality Number shows how others perceive you and the mask you wear in the world.',
            }
          ]
        }
      ]
    },
    ru: {
      title: 'Интерактивные Уроки',
      subtitle: 'Изучайте нумерологию шаг за шагом с практическими упражнениями',
      label: 'Уроки',
      backToCalculator: 'Назад к Калькулятору',
      lesson: 'Урок',
      step: 'Шаг',
      of: 'из',
      next: 'Далее',
      previous: 'Назад',
      complete: 'Завершить',
      completed: 'Завершено',
      tryAgain: 'Попробуйте снова',
      correct: 'Верно!',
      incorrect: 'Неверно. Попробуйте снова.',
      startLesson: 'Начать урок',
      lessons: [
        {
          title: 'Введение в Нумерологию',
          steps: [
            {
              title: 'Что такое Нумерология?',
              content: 'Нумерология — это изучение скрытого значения чисел и того, как они влияют на нашу жизнь. Каждое число несёт уникальную вибрацию, которая помогает лучше понять себя и мир вокруг.',
              example: 'Например, если вы родились 15-го, сократите: 1 + 5 = 6. Число 6 представляет гармонию и семейную ответственность.'
            },
            {
              title: 'Пифагорейская Система',
              content: 'Мы используем пифагорейскую систему, самую популярную в западной нумерологии. Она присваивает значения от 1 до 9 каждой букве: A=1, B=2, C=3... I=9, J=1, K=2... и так далее.',
              quiz: {
                question: 'Какое значение имеет буква "E" в пифагорейской системе?',
                options: ['3', '5', '7', '9'],
                correct: 1
              }
            },
            {
              title: 'Сокращение Чисел',
              content: 'В нумерологии большинство чисел сокращаются до одной цифры (1-9) путём сложения составляющих цифр. Исключения — мастер-числа: 11, 22 и 33.',
              example: 'Пример: 1984 → 1+9+8+4 = 22 (мастер-число, не сокращается) или 1985 → 1+9+8+5 = 23 → 2+3 = 5',
              quiz: {
                question: 'До чего сокращается число 28?',
                options: ['1', '10', '2', '8'],
                correct: 0
              }
            }
          ]
        },
        {
          title: 'Число Жизненного Пути',
          steps: [
            {
              title: 'Что представляет Жизненный Путь?',
              content: 'Число Жизненного Пути — самое важное число в нумерологии. Полученное из даты рождения, оно показывает ваш главный путь в жизни, уроки и жизненную цель.',
            },
            {
              title: 'Как рассчитывается?',
              content: 'Сложите все цифры даты рождения и сократите результат. Примечание: сокращайте день, месяц и год отдельно перед сложением, чтобы сохранить мастер-числа.',
              example: 'Дата: 15 ноября 1990\n15 → 1+5 = 6\n11 → сохраняем (мастер)\n1990 → 1+9+9+0 = 19 → 1+9 = 10 → 1+0 = 1\nИтого: 6 + 11 + 1 = 18 → 1+8 = 9\nЖизненный Путь = 9',
              quiz: {
                question: 'Каков Жизненный Путь человека, родившегося 22 марта 1988?',
                options: ['6', '33', '7', '8'],
                correct: 0
              }
            }
          ]
        },
        {
          title: 'Числа из Имени',
          steps: [
            {
              title: 'Число Судьбы',
              content: 'Число Судьбы (или Выражения) рассчитывается из всех букв полного имени при рождении. Оно показывает ваши таланты, способности и потенциал.',
              example: 'ИВАН ПЕТРОВ\nИ=9, В=4, А=1, Н=5 = 19 → 10 → 1\nП=7, Е=5, Т=2, Р=9, О=6, В=4 = 33 (мастер)\nИтого: 1+33 = 34 → 7'
            },
            {
              title: 'Число Души',
              content: 'Рассчитывается только из гласных (А, Е, И, О, У), Число Души раскрывает ваши внутренние желания и глубочайшие мотивации — то, чего вы действительно хотите.',
              quiz: {
                question: 'Из каких букв рассчитывается Число Души?',
                options: ['Согласные', 'Гласные', 'Все буквы', 'Первая и последняя буква'],
                correct: 1
              }
            },
            {
              title: 'Число Личности',
              content: 'Рассчитывается из согласных в имени, Число Личности показывает, как другие воспринимают вас и маску, которую вы носите в мире.',
            }
          ]
        }
      ]
    }
  };

  const l = labels[language];
  const lesson = l.lessons[currentLesson];
  const step = lesson?.steps[currentStep] as TutorialStep | undefined;
  const progress = lesson ? ((currentStep + 1) / lesson.steps.length) * 100 : 0;

  const handleNext = () => {
    if (step?.quiz && quizAnswer !== step.quiz.correct) {
      return;
    }
    
    if (currentStep < lesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setQuizAnswer(null);
    } else {
      // Complete lesson
      if (!completedLessons.includes(currentLesson)) {
        setCompletedLessons([...completedLessons, currentLesson]);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setQuizAnswer(null);
    }
  };

  const startLesson = (index: number) => {
    setCurrentLesson(index);
    setCurrentStep(0);
    setQuizAnswer(null);
  };

  return (
    <PageLayout>
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      <PageHeader
        title={l.title}
        subtitle={l.subtitle}
        badge={{
          icon: <GraduationCap className="h-4 w-4 text-primary" />,
          label: l.label
        }}
      />

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Lesson List */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {l.lessons.map((les, index) => (
              <button
                key={index}
                onClick={() => startLesson(index)}
                className={cn(
                  "card-mystic rounded-xl p-5 text-left transition-all duration-300 hover:glow-gold-subtle",
                  currentLesson === index && "ring-2 ring-primary glow-gold-subtle"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs text-muted-foreground">{l.lesson} {index + 1}</span>
                  {completedLessons.includes(index) && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <h3 className="font-cinzel text-foreground mb-2">{les.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {les.steps.length} {l.step.toLowerCase()}s
                </p>
              </button>
            ))}
          </div>

          {/* Current Lesson Content */}
          {lesson && step && (
            <div className="card-mystic rounded-xl p-6 md:p-8">
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>{l.lesson} {currentLesson + 1}: {lesson.title}</span>
                  <span>{l.step} {currentStep + 1} {l.of} {lesson.steps.length}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Step Content */}
              <div className="space-y-6">
                <h2 className="font-cinzel text-2xl text-primary">{step.title}</h2>
                <p className="text-foreground/90 leading-relaxed">{step.content}</p>

                {step.example && (
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <h4 className="font-cinzel text-sm text-primary mb-2">Exemplu:</h4>
                    <pre className="text-sm text-foreground/80 whitespace-pre-wrap font-mono">
                      {step.example}
                    </pre>
                  </div>
                )}

                {step.quiz && (
                  <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                    <h4 className="font-cinzel text-sm text-primary mb-3">Quiz:</h4>
                    <p className="text-foreground mb-4">{step.quiz.question}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {step.quiz.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => setQuizAnswer(idx)}
                          className={cn(
                            "p-3 rounded-lg border text-left transition-all",
                            quizAnswer === idx 
                              ? idx === step.quiz!.correct
                                ? "bg-green-500/20 border-green-500 text-green-400"
                                : "bg-destructive/20 border-destructive text-destructive"
                              : "border-border/50 hover:border-primary/50 text-foreground/80"
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    {quizAnswer !== null && (
                      <p className={cn(
                        "mt-3 text-sm",
                        quizAnswer === step.quiz.correct ? "text-green-400" : "text-destructive"
                      )}>
                        {quizAnswer === step.quiz.correct ? l.correct : l.incorrect}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="border-primary/30 text-foreground hover:bg-primary/10"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {l.previous}
                </Button>
                
                <Button
                  onClick={handleNext}
                  disabled={step.quiz && quizAnswer !== step.quiz.correct}
                  className="btn-mystic"
                >
                  {currentStep === lesson.steps.length - 1 ? l.complete : l.next}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-border/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground font-raleway">{t.footer}</p>
        </div>
      </footer>
    </PageLayout>
  );
};

export default Tutorials;
