import { useState, useEffect } from "react";
import { RefreshCcw, Building2, TrendingUp, Sparkles, Grid3X3, ChevronRight, ChevronDown, CalendarDays, User, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/hooks/use-profile";
import { compareNameChange, analyzeBusinessName, generateNameSuggestions } from "@/lib/nameAnalysis";
import { generateYearForecast, type YearForecast } from "@/lib/yearForecast";
import { getAllCompatibilities, getCompatibilityDetail } from "@/lib/compatibilityMatrix";
import { calculateLifePathNumber } from "@/lib/numerology";
import { format } from "date-fns";
import { NumerologyCalendar } from "@/components/NumerologyCalendar";

const Tools = () => {
  const { language } = useLanguage();
  const { profileData, hasProfile } = useProfile();
  const [activeTab, setActiveTab] = useState("calendar");
  
  // Name Change State
  const [originalName, setOriginalName] = useState("");
  const [newName, setNewName] = useState("");
  const [nameComparison, setNameComparison] = useState<ReturnType<typeof compareNameChange> | null>(null);
  
  // Business Name State
  const [businessName, setBusinessName] = useState("");
  const [businessAnalysis, setBusinessAnalysis] = useState<ReturnType<typeof analyzeBusinessName> | null>(null);
  
  // Year Forecast State
  const [forecastBirthDate, setForecastBirthDate] = useState("");
  const [forecastYear, setForecastYear] = useState(new Date().getFullYear());
  const [yearForecast, setYearForecast] = useState<YearForecast | null>(null);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);
  
  // Compatibility Matrix State
  const [matrixBirthDate, setMatrixBirthDate] = useState("");
  const [compatibilities, setCompatibilities] = useState<ReturnType<typeof getAllCompatibilities> | null>(null);
  const [selectedCompatNumber, setSelectedCompatNumber] = useState<number | null>(null);
  
  // Name Optimizer State
  const [optimizerName, setOptimizerName] = useState("");
  const [targetNumbers, setTargetNumbers] = useState<number[]>([1, 8, 11, 22]);
  const [nameSuggestions, setNameSuggestions] = useState<ReturnType<typeof generateNameSuggestions> | null>(null);

  // Calendar State
  const [calendarBirthDate, setCalendarBirthDate] = useState("");
  const [calendarName, setCalendarName] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  const t = {
    ro: {
      title: "Instrumente Numerologice",
      subtitle: "Analize avansate pentru decizii importante",
      back: "Înapoi",
      nameChange: "Schimbare Nume",
      businessName: "Nume Afacere",
      yearForecast: "Previziune An",
      nameOptimizer: "Optimizator Nume",
      compatMatrix: "Matrice Compatibilitate",
      calendar: "Calendar",
      showCalendar: "Afișează Calendarul",
      calendarSubtitle: "Introdu datele pentru a vedea calendarul tău personalizat",
      fullName: "Numele complet",
      analyze: "Analizează",
      calculate: "Calculează",
      generate: "Generează",
      original: "Nume original",
      newNameLabel: "Nume nou",
      businessNameLabel: "Numele afacerii",
      birthDate: "Data nașterii",
      year: "Anul",
      yourName: "Numele tău",
      impact: "Impact",
      positive: "Pozitiv",
      negative: "Negativ",
      neutral: "Neutru",
      mixed: "Mixt",
      before: "Înainte",
      after: "După",
      destiny: "Destin",
      soulUrge: "Suflet",
      personality: "Personalitate",
      vibrationalEnergy: "Energie Vibrațională",
      suitableFor: "Potrivit pentru",
      challenges: "Provocări",
      recommendations: "Recomandări",
      strong: "Puternică",
      moderate: "Moderată",
      weak: "Slabă",
      overallTheme: "Tema anului",
      keyMonths: "Luni cheie",
      monthlyForecast: "Previziuni lunare",
      energy: "Energie",
      focus: "Focus",
      opportunities: "Oportunități",
      advice: "Sfat",
      yourLifePath: "Drumul tău de viață",
      compatibilityWith: "Compatibilitate cu",
      score: "Scor",
      strengths: "Puncte forte",
      suggestions: "Sugestii de nume",
      targetNumbersLabel: "Numere țintă (selectează)",
      noSuggestions: "Încearcă alte numere țintă",
      excellent: "Excelentă",
      good: "Bună",
      challenging: "Provocatoare"
    },
    en: {
      title: "Numerology Tools",
      subtitle: "Advanced analysis for important decisions",
      back: "Back",
      nameChange: "Name Change",
      businessName: "Business Name",
      yearForecast: "Year Forecast",
      nameOptimizer: "Name Optimizer",
      compatMatrix: "Compatibility Matrix",
      calendar: "Calendar",
      showCalendar: "Show Calendar",
      calendarSubtitle: "Enter your details to see your personalized calendar",
      fullName: "Full name",
      analyze: "Analyze",
      calculate: "Calculate",
      generate: "Generate",
      original: "Original name",
      newNameLabel: "New name",
      businessNameLabel: "Business name",
      birthDate: "Birth date",
      year: "Year",
      yourName: "Your name",
      impact: "Impact",
      positive: "Positive",
      negative: "Negative",
      neutral: "Neutral",
      mixed: "Mixed",
      before: "Before",
      after: "After",
      destiny: "Destiny",
      soulUrge: "Soul",
      personality: "Personality",
      vibrationalEnergy: "Vibrational Energy",
      suitableFor: "Suitable for",
      challenges: "Challenges",
      recommendations: "Recommendations",
      strong: "Strong",
      moderate: "Moderate",
      weak: "Weak",
      overallTheme: "Year theme",
      keyMonths: "Key months",
      monthlyForecast: "Monthly forecast",
      energy: "Energy",
      focus: "Focus",
      opportunities: "Opportunities",
      advice: "Advice",
      yourLifePath: "Your Life Path",
      compatibilityWith: "Compatibility with",
      score: "Score",
      strengths: "Strengths",
      suggestions: "Name suggestions",
      targetNumbersLabel: "Target numbers (select)",
      noSuggestions: "Try other target numbers",
      excellent: "Excellent",
      good: "Good",
      challenging: "Challenging"
    },
    ru: {
      title: "Нумерологические инструменты",
      subtitle: "Расширенный анализ для важных решений",
      back: "Назад",
      nameChange: "Смена имени",
      businessName: "Название бизнеса",
      yearForecast: "Прогноз на год",
      nameOptimizer: "Оптимизатор имени",
      compatMatrix: "Матрица совместимости",
      calendar: "Календарь",
      showCalendar: "Показать Календарь",
      calendarSubtitle: "Введите данные, чтобы увидеть ваш персонализированный календарь",
      fullName: "Полное имя",
      analyze: "Анализировать",
      calculate: "Рассчитать",
      generate: "Сгенерировать",
      original: "Оригинальное имя",
      newNameLabel: "Новое имя",
      businessNameLabel: "Название бизнеса",
      birthDate: "Дата рождения",
      year: "Год",
      yourName: "Ваше имя",
      impact: "Влияние",
      positive: "Положительное",
      negative: "Отрицательное",
      neutral: "Нейтральное",
      mixed: "Смешанное",
      before: "До",
      after: "После",
      destiny: "Судьба",
      soulUrge: "Душа",
      personality: "Личность",
      vibrationalEnergy: "Вибрационная энергия",
      suitableFor: "Подходит для",
      challenges: "Вызовы",
      recommendations: "Рекомендации",
      strong: "Сильная",
      moderate: "Умеренная",
      weak: "Слабая",
      overallTheme: "Тема года",
      keyMonths: "Ключевые месяцы",
      monthlyForecast: "Месячный прогноз",
      energy: "Энергия",
      focus: "Фокус",
      opportunities: "Возможности",
      advice: "Совет",
      yourLifePath: "Ваш жизненный путь",
      compatibilityWith: "Совместимость с",
      score: "Счёт",
      strengths: "Сильные стороны",
      suggestions: "Предложения имён",
      targetNumbersLabel: "Целевые числа (выберите)",
      noSuggestions: "Попробуйте другие целевые числа",
      excellent: "Отличная",
      good: "Хорошая",
      challenging: "Сложная"
    }
  }[language];

  const handleNameCompare = () => {
    if (originalName && newName) {
      setNameComparison(compareNameChange(originalName, newName));
    }
  };

  const handleBusinessAnalyze = () => {
    if (businessName) {
      setBusinessAnalysis(analyzeBusinessName(businessName, language));
    }
  };

  const handleYearForecast = () => {
    if (forecastBirthDate) {
      setYearForecast(generateYearForecast(new Date(forecastBirthDate), forecastYear, language));
    }
  };

  const handleCompatibilityMatrix = () => {
    if (matrixBirthDate) {
      const lifePath = calculateLifePathNumber(new Date(matrixBirthDate));
      setCompatibilities(getAllCompatibilities(lifePath));
    }
  };

  const handleNameOptimize = () => {
    if (optimizerName && targetNumbers.length > 0) {
      setNameSuggestions(generateNameSuggestions(optimizerName, targetNumbers, language));
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'bg-green-500/20 text-green-400';
      case 'negative': return 'bg-red-500/20 text-red-400';
      case 'mixed': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-emerald-400';
    if (score >= 55) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <PageLayout>
      <PageHeader
        title={t.title}
        subtitle={t.subtitle}
        badge={{
          icon: <Wrench className="h-4 w-4 text-primary" />,
          label: t.tools
        }}
      />

      <main className="relative z-10 px-4 pb-16">
        <div className="max-w-5xl mx-auto pt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-6 mb-8 bg-card/50">
              <TabsTrigger value="calendar" className="text-xs sm:text-sm gap-1">
                <CalendarDays className="h-4 w-4" />
                <span className="hidden sm:inline">{t.calendar}</span>
              </TabsTrigger>
              <TabsTrigger value="name-change" className="text-xs sm:text-sm gap-1">
                <RefreshCcw className="h-4 w-4" />
                <span className="hidden sm:inline">{t.nameChange}</span>
              </TabsTrigger>
              <TabsTrigger value="business" className="text-xs sm:text-sm gap-1">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">{t.businessName}</span>
              </TabsTrigger>
              <TabsTrigger value="forecast" className="text-xs sm:text-sm gap-1">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">{t.yearForecast}</span>
              </TabsTrigger>
              <TabsTrigger value="optimizer" className="text-xs sm:text-sm gap-1">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">{t.nameOptimizer}</span>
              </TabsTrigger>
              <TabsTrigger value="matrix" className="text-xs sm:text-sm gap-1">
                <Grid3X3 className="h-4 w-4" />
                <span className="hidden sm:inline">{t.compatMatrix}</span>
              </TabsTrigger>
            </TabsList>

            {/* Numerology Calendar */}
            <TabsContent value="calendar">
              <Card className="card-mystic">
                <CardHeader>
                  <CardTitle className="font-cinzel text-primary">{t.calendar}</CardTitle>
                  <CardDescription>{t.calendarSubtitle}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hasProfile && profileData && (
                    <div className="mb-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          <span className="text-sm text-foreground/80">
                            {t.useProfileData || "Using profile data"}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCalendarBirthDate(format(profileData.birthDate, 'yyyy-MM-dd'));
                            setCalendarName(profileData.fullName);
                          }}
                          className="h-8"
                        >
                          {t.useProfileData || "Use"}
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>{t.birthDate}</Label>
                      <Input 
                        type="date" 
                        value={calendarBirthDate} 
                        onChange={(e) => setCalendarBirthDate(e.target.value)} 
                        className="input-mystic" 
                      />
                    </div>
                    <div>
                      <Label>{t.fullName}</Label>
                      <Input 
                        value={calendarName} 
                        onChange={(e) => setCalendarName(e.target.value)} 
                        placeholder="Ion Popescu"
                        className="input-mystic" 
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={() => setShowCalendar(true)} 
                    className="btn-mystic w-full"
                    disabled={!calendarBirthDate || !calendarName}
                  >
                    {t.showCalendar}
                  </Button>
                  
                  {showCalendar && calendarBirthDate && calendarName && (
                    <div className="mt-6 animate-fade-in">
                      <NumerologyCalendar 
                        birthDate={new Date(calendarBirthDate)} 
                        fullName={calendarName} 
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Name Change Analyzer */}
            <TabsContent value="name-change">
              <Card className="card-mystic">
                <CardHeader>
                  <CardTitle className="font-cinzel text-primary">{t.nameChange}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>{t.original}</Label>
                      <Input value={originalName} onChange={(e) => setOriginalName(e.target.value)} className="input-mystic" />
                    </div>
                    <div>
                      <Label>{t.newNameLabel}</Label>
                      <Input value={newName} onChange={(e) => setNewName(e.target.value)} className="input-mystic" />
                    </div>
                  </div>
                  <Button onClick={handleNameCompare} className="btn-mystic w-full">{t.analyze}</Button>
                  
                  {nameComparison && (
                    <div className="mt-6 space-y-4 animate-fade-in">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{t.impact}:</span>
                        <Badge className={getImpactColor(nameComparison.overallImpact)}>
                          {t[nameComparison.overallImpact as keyof typeof t]}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground/80">{nameComparison.summary[language]}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-card/50">
                          <CardHeader className="py-3"><CardTitle className="text-sm">{t.before}</CardTitle></CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <div>{t.destiny}: <span className="text-primary font-bold">{nameComparison.before.destinyNumber}</span></div>
                            <div>{t.soulUrge}: <span className="text-primary font-bold">{nameComparison.before.soulUrgeNumber}</span></div>
                            <div>{t.personality}: <span className="text-primary font-bold">{nameComparison.before.personalityNumber}</span></div>
                          </CardContent>
                        </Card>
                        <Card className="bg-card/50">
                          <CardHeader className="py-3"><CardTitle className="text-sm">{t.after}</CardTitle></CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            <div>{t.destiny}: <span className="text-primary font-bold">{nameComparison.after.destinyNumber}</span> {nameComparison.changes.destiny.changed && <Badge variant="outline" className="ml-1 text-xs">!</Badge>}</div>
                            <div>{t.soulUrge}: <span className="text-primary font-bold">{nameComparison.after.soulUrgeNumber}</span> {nameComparison.changes.soulUrge.changed && <Badge variant="outline" className="ml-1 text-xs">!</Badge>}</div>
                            <div>{t.personality}: <span className="text-primary font-bold">{nameComparison.after.personalityNumber}</span> {nameComparison.changes.personality.changed && <Badge variant="outline" className="ml-1 text-xs">!</Badge>}</div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Business Name Analyzer */}
            <TabsContent value="business">
              <Card className="card-mystic">
                <CardHeader>
                  <CardTitle className="font-cinzel text-primary">{t.businessName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>{t.businessNameLabel}</Label>
                    <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="input-mystic" />
                  </div>
                  <Button onClick={handleBusinessAnalyze} className="btn-mystic w-full">{t.analyze}</Button>
                  
                  {businessAnalysis && (
                    <div className="mt-6 space-y-4 animate-fade-in">
                      <div className="flex items-center gap-4">
                        <div className="number-display">{businessAnalysis.destinyNumber}</div>
                        <div>
                          <div className="text-lg font-cinzel text-foreground">{businessAnalysis.name}</div>
                          <Badge className={businessAnalysis.vibrationalEnergy === 'strong' ? 'bg-green-500/20 text-green-400' : businessAnalysis.vibrationalEnergy === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}>
                            {t.vibrationalEnergy}: {t[businessAnalysis.vibrationalEnergy]}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-card/50">
                          <CardHeader className="py-3"><CardTitle className="text-sm text-green-400">{t.suitableFor}</CardTitle></CardHeader>
                          <CardContent><ul className="text-sm space-y-1">{businessAnalysis.suitableFor.map((s, i) => <li key={i}>• {s}</li>)}</ul></CardContent>
                        </Card>
                        <Card className="bg-card/50">
                          <CardHeader className="py-3"><CardTitle className="text-sm text-orange-400">{t.challenges}</CardTitle></CardHeader>
                          <CardContent><ul className="text-sm space-y-1">{businessAnalysis.challenges.map((c, i) => <li key={i}>• {c}</li>)}</ul></CardContent>
                        </Card>
                        <Card className="bg-card/50">
                          <CardHeader className="py-3"><CardTitle className="text-sm text-primary">{t.recommendations}</CardTitle></CardHeader>
                          <CardContent><ul className="text-sm space-y-1">{businessAnalysis.recommendations.map((r, i) => <li key={i}>• {r}</li>)}</ul></CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Year Forecast */}
            <TabsContent value="forecast">
              <Card className="card-mystic">
                <CardHeader>
                  <CardTitle className="font-cinzel text-primary">{t.yearForecast}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hasProfile && profileData && (
                    <div className="mb-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          <span className="text-sm text-foreground/80">
                            {t.useProfileData || "Using profile data"}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setForecastBirthDate(format(profileData.birthDate, 'yyyy-MM-dd'))}
                          className="h-8"
                        >
                          {t.useProfileData || "Use"}
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>{t.birthDate}</Label>
                      <Input type="date" value={forecastBirthDate} onChange={(e) => setForecastBirthDate(e.target.value)} className="input-mystic" />
                    </div>
                    <div>
                      <Label>{t.year}</Label>
                      <Input type="number" value={forecastYear} onChange={(e) => setForecastYear(parseInt(e.target.value))} className="input-mystic" />
                    </div>
                  </div>
                  <Button onClick={handleYearForecast} className="btn-mystic w-full">{t.calculate}</Button>
                  
                  {yearForecast && (
                    <div className="mt-6 space-y-4 animate-fade-in">
                      <div className="flex items-center gap-4">
                        <div className="number-display-large">{yearForecast.personalYearNumber}</div>
                        <div>
                          <div className="text-lg font-cinzel text-foreground">{yearForecast.year}</div>
                          <p className="text-sm text-muted-foreground">{t.overallTheme}</p>
                        </div>
                      </div>
                      <p className="text-foreground/80">{yearForecast.overallTheme}</p>
                      
                      {yearForecast.keyMonths.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          <span className="text-sm text-muted-foreground">{t.keyMonths}:</span>
                          {yearForecast.keyMonths.map(m => (
                            <Badge key={m} className="bg-primary/20 text-primary">{yearForecast.monthlyForecasts[m-1].monthName}</Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <h4 className="font-cinzel text-foreground">{t.monthlyForecast}</h4>
                        {yearForecast.monthlyForecasts.map((month) => (
                          <Card key={month.month} className="bg-card/30 cursor-pointer" onClick={() => setExpandedMonth(expandedMonth === month.month ? null : month.month)}>
                            <CardHeader className="py-3 flex flex-row items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-primary">{month.personalMonthNumber}</Badge>
                                <span className="font-medium">{month.monthName}</span>
                                <span className="text-sm text-muted-foreground">- {month.energy}</span>
                              </div>
                              {expandedMonth === month.month ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </CardHeader>
                            {expandedMonth === month.month && (
                              <CardContent className="pt-0 space-y-2 text-sm animate-fade-in">
                                <div><span className="text-primary">{t.focus}:</span> {month.focus.join(', ')}</div>
                                <div><span className="text-green-400">{t.opportunities}:</span> {month.opportunities.join(', ')}</div>
                                <div><span className="text-orange-400">{t.challenges}:</span> {month.challenges.join(', ')}</div>
                                <div><span className="text-muted-foreground">{t.advice}:</span> {month.advice}</div>
                              </CardContent>
                            )}
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Name Optimizer */}
            <TabsContent value="optimizer">
              <Card className="card-mystic">
                <CardHeader>
                  <CardTitle className="font-cinzel text-primary">{t.nameOptimizer}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>{t.yourName}</Label>
                    <Input value={optimizerName} onChange={(e) => setOptimizerName(e.target.value)} className="input-mystic" />
                  </div>
                  <div>
                    <Label>{t.targetNumbersLabel}</Label>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33].map(num => (
                        <Badge 
                          key={num}
                          variant={targetNumbers.includes(num) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setTargetNumbers(prev => prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num])}
                        >
                          {num}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleNameOptimize} className="btn-mystic w-full">{t.generate}</Button>
                  
                  {nameSuggestions && (
                    <div className="mt-6 space-y-3 animate-fade-in">
                      <h4 className="font-cinzel text-foreground">{t.suggestions}</h4>
                      {nameSuggestions.length === 0 ? (
                        <p className="text-muted-foreground text-sm">{t.noSuggestions}</p>
                      ) : (
                        nameSuggestions.map((s, i) => (
                          <Card key={i} className="bg-card/30">
                            <CardContent className="py-3 flex items-center justify-between">
                              <div>
                                <span className="font-medium text-foreground">{s.name}</span>
                                <span className="text-sm text-muted-foreground ml-2">- {s.reason}</span>
                              </div>
                              <Badge className="bg-primary/20 text-primary">{s.destinyNumber}</Badge>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compatibility Matrix */}
            <TabsContent value="matrix">
              <Card className="card-mystic">
                <CardHeader>
                  <CardTitle className="font-cinzel text-primary">{t.compatMatrix}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hasProfile && profileData && (
                    <div className="mb-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          <span className="text-sm text-foreground/80">
                            {t.useProfileData || "Using profile data"}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setMatrixBirthDate(format(profileData.birthDate, 'yyyy-MM-dd'))}
                          className="h-8"
                        >
                          {t.useProfileData || "Use"}
                        </Button>
                      </div>
                    </div>
                  )}
                  <div>
                    <Label>{t.birthDate}</Label>
                    <Input type="date" value={matrixBirthDate} onChange={(e) => setMatrixBirthDate(e.target.value)} className="input-mystic" />
                  </div>
                  <Button onClick={handleCompatibilityMatrix} className="btn-mystic w-full">{t.calculate}</Button>
                  
                  {compatibilities && (
                    <div className="mt-6 space-y-4 animate-fade-in">
                      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                        {compatibilities.map(({ number, detail }) => (
                          <button
                            key={number}
                            onClick={() => setSelectedCompatNumber(selectedCompatNumber === number ? null : number)}
                            className={`p-3 rounded-lg border transition-all ${selectedCompatNumber === number ? 'border-primary bg-primary/20' : 'border-border/30 bg-card/30 hover:bg-card/50'}`}
                          >
                            <div className="text-2xl font-cinzel text-primary">{number}</div>
                            <div className={`text-sm font-bold ${getScoreColor(detail.score)}`}>{detail.score}%</div>
                          </button>
                        ))}
                      </div>
                      
                      {selectedCompatNumber && (
                        <Card className="bg-card/50 animate-fade-in">
                          <CardHeader>
                            <CardTitle className="text-lg">{t.compatibilityWith} {selectedCompatNumber}</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {(() => {
                              const detail = getCompatibilityDetail(calculateLifePathNumber(new Date(matrixBirthDate)), selectedCompatNumber);
                              return (
                                <>
                                  <div className="flex gap-2">
                                    <Badge className={detail.level === 'excellent' ? 'bg-green-500/20 text-green-400' : detail.level === 'good' ? 'bg-emerald-500/20 text-emerald-400' : detail.level === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-orange-500/20 text-orange-400'}>
                                      {t[detail.level] || detail.level}
                                    </Badge>
                                    <span className={`font-bold ${getScoreColor(detail.score)}`}>{detail.score}%</span>
                                  </div>
                                  <div><span className="text-green-400">{t.strengths}:</span> {detail.strengths[language].join(', ')}</div>
                                  <div><span className="text-orange-400">{t.challenges}:</span> {detail.challenges[language].join(', ')}</div>
                                  <div><span className="text-primary">{t.advice}:</span> {detail.advice[language]}</div>
                                </>
                              );
                            })()}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </PageLayout>
  );
};

export default Tools;
