import { useState, useEffect } from 'react';
import { Sun, Moon, Calendar, TrendingUp, Sparkles, User } from 'lucide-react';
import { format } from 'date-fns';
import { ro, enUS, ru } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/hooks/use-profile';
import { 
  getDailyPrediction, 
  getMonthlyPrediction, 
  getUniversalDayEnergy,
  calculateWeeklyTheme,
  calculateAnnualTheme,
  calculateAnnualOpportunities,
  calculateAnnualChallenges
} from '@/lib/predictions';
import { DailyPredictionCard } from '@/components/DailyPredictionCard';
import { WeeklyMonthlyPredictionCard } from '@/components/WeeklyMonthlyPredictionCard';

const locales = { ro, en: enUS, ru };

const Predictions = () => {
  const { language, t } = useLanguage();
  const { profileData, hasProfile, loading: profileLoading } = useProfile();
  const [birthDate, setBirthDate] = useState<Date>();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Load profile data on mount
  useEffect(() => {
    if (hasProfile && profileData && !birthDate) {
      setBirthDate(profileData.birthDate);
    }
  }, [hasProfile, profileData, birthDate]);

  const dateLocale = locales[language];
  const today = new Date();

  const labels = {
    ro: {
      title: 'Previziuni Numerologice',
      subtitle: 'Descoperă energia zilei și a lunii tale personale',
      label: 'Previziuni',
      enterBirthDate: 'Introdu data nașterii pentru previziuni personalizate',
      selectBirthDate: 'Selectează data nașterii',
      daily: 'Ziua de Azi',
      monthly: 'Luna Curentă',
      universalDay: 'Ziua Universală',
      personalDay: 'Ziua Ta Personală',
      personalMonth: 'Luna Ta Personală',
      energy: 'Energie',
      focus: 'Focus',
      advice: 'Sfat',
      luckyHours: 'Ore Norocoase',
      challenges: 'Provocări',
      opportunities: 'Oportunități',
      theme: 'Temă',
      overview: 'Prezentare',
      career: 'Carieră',
      relationships: 'Relații',
      health: 'Sănătate',
      finances: 'Finanțe',
      spirituality: 'Spiritualitate',
      keyDays: 'Zile Cheie',
      backToCalculator: 'Înapoi la Calculator',
    },
    en: {
      title: 'Numerology Predictions',
      subtitle: 'Discover your personal day and month energy',
      label: 'Predictions',
      enterBirthDate: 'Enter your birth date for personalized predictions',
      selectBirthDate: 'Select birth date',
      daily: 'Today',
      monthly: 'This Month',
      universalDay: 'Universal Day',
      personalDay: 'Your Personal Day',
      personalMonth: 'Your Personal Month',
      energy: 'Energy',
      focus: 'Focus',
      advice: 'Advice',
      luckyHours: 'Lucky Hours',
      challenges: 'Challenges',
      opportunities: 'Opportunities',
      theme: 'Theme',
      overview: 'Overview',
      career: 'Career',
      relationships: 'Relationships',
      health: 'Health',
      finances: 'Finances',
      spirituality: 'Spirituality',
      keyDays: 'Key Days',
      backToCalculator: 'Back to Calculator',
    },
    ru: {
      title: 'Нумерологические Прогнозы',
      subtitle: 'Откройте энергию вашего личного дня и месяца',
      label: 'Прогнозы',
      enterBirthDate: 'Введите дату рождения для персонализированных прогнозов',
      selectBirthDate: 'Выберите дату рождения',
      daily: 'Сегодня',
      monthly: 'Этот месяц',
      universalDay: 'Универсальный День',
      personalDay: 'Ваш Личный День',
      personalMonth: 'Ваш Личный Месяц',
      energy: 'Энергия',
      focus: 'Фокус',
      advice: 'Совет',
      luckyHours: 'Удачные Часы',
      challenges: 'Вызовы',
      opportunities: 'Возможности',
      theme: 'Тема',
      overview: 'Обзор',
      career: 'Карьера',
      relationships: 'Отношения',
      health: 'Здоровье',
      finances: 'Финансы',
      spirituality: 'Духовность',
      keyDays: 'Ключевые Дни',
      backToCalculator: 'Назад к Калькулятору',
    }
  };

  const l = labels[language];
  const universalEnergy = getUniversalDayEnergy(today);
  const dailyPrediction = birthDate ? getDailyPrediction(birthDate, today) : null;
  const monthlyPrediction = birthDate ? getMonthlyPrediction(birthDate, selectedMonth, selectedYear) : null;
  
  // Calculate weekly prediction (start of current week - Monday)
  const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };
  const weekStart = getWeekStart(today);
  const weeklyPrediction = birthDate ? calculateWeeklyTheme(birthDate, weekStart) : null;
  
  // Calculate annual predictions
  const annualTheme = birthDate ? calculateAnnualTheme(birthDate, selectedYear) : null;
  const annualOpportunities = birthDate ? calculateAnnualOpportunities(birthDate, selectedYear) : null;
  const annualChallenges = birthDate ? calculateAnnualChallenges(birthDate, selectedYear) : null;

  return (
    <PageLayout>
      <PageHeader
        title={l.title}
        subtitle={l.subtitle}
        badge={{
          icon: <TrendingUp className="h-4 w-4 text-primary" />,
          label: l.label
        }}
      />

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-8 pt-4">
          
          {/* Universal Day Energy */}
          <div className="card-mystic rounded-xl p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sun className="h-6 w-6 text-primary" />
              <h2 className="font-cinzel text-xl text-foreground">{l.universalDay}</h2>
            </div>
            <div className="number-display mx-auto mb-4">
              {universalEnergy.number}
            </div>
            <p className="text-muted-foreground capitalize">{l.energy}: {universalEnergy.energy}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {format(today, 'EEEE, d MMMM yyyy', { locale: dateLocale })}
            </p>
          </div>

          {/* Birth Date Selector */}
          {!birthDate && (
            <div className="card-mystic rounded-xl p-8 text-center">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-cinzel text-xl text-foreground mb-2">{l.enterBirthDate}</h3>
              {hasProfile && profileData && (
                <div className="mb-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground/80">
                      {t.useProfileData || "Using profile data"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setBirthDate(profileData.birthDate)}
                    className="border-primary/30 text-primary hover:bg-primary/10"
                  >
                    {t.useProfileData || "Use Profile"}
                  </Button>
                </div>
              )}
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="mt-4 border-primary/30 text-foreground hover:bg-primary/10">
                    <Calendar className="mr-2 h-4 w-4 text-primary" />
                    {l.selectBirthDate}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card border-border z-50" align="center">
                  <CalendarComponent
                    mode="single"
                    selected={birthDate}
                    onSelect={(date) => {
                      setBirthDate(date);
                      setIsCalendarOpen(false);
                    }}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                    className="pointer-events-auto"
                    captionLayout="dropdown-buttons"
                    fromYear={1920}
                    toYear={new Date().getFullYear()}
                    locale={dateLocale}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Personal Predictions */}
          {birthDate && (
            <Tabs defaultValue="daily" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-card/50">
                <TabsTrigger value="daily" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Sun className="h-4 w-4 mr-2" />
                  {l.daily}
                </TabsTrigger>
                <TabsTrigger value="monthly" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Moon className="h-4 w-4 mr-2" />
                  {l.monthly}
                </TabsTrigger>
              </TabsList>

              {/* Daily Tab */}
              <TabsContent value="daily" className="space-y-6">
                {dailyPrediction && birthDate && (
                  <>
                    <DailyPredictionCard 
                      prediction={dailyPrediction} 
                      birthDate={birthDate}
                      date={today}
                    />
                    <div className="card-mystic rounded-xl p-6 space-y-6">
                      <div className="text-center">
                        <h3 className="font-cinzel text-lg text-muted-foreground">{l.personalDay}</h3>
                        <div className="number-display-large mx-auto my-4 animate-float">
                          {dailyPrediction.number}
                        </div>
                        <p className="text-primary font-cinzel text-xl capitalize">{dailyPrediction.energy}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                          <h4 className="font-cinzel text-sm text-primary mb-2">{l.focus}</h4>
                          <p className="text-foreground/90 capitalize">{dailyPrediction.focus}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                          <h4 className="font-cinzel text-sm text-primary mb-2">{l.luckyHours}</h4>
                          <p className="text-foreground/90">{dailyPrediction.luckyHours.join(', ')}</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <h4 className="font-cinzel text-sm text-primary mb-2">{l.advice}</h4>
                        <p className="text-foreground/90">{dailyPrediction.advice}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                          <h4 className="font-cinzel text-sm text-destructive/80 mb-2">{l.challenges}</h4>
                          <p className="text-foreground/80 text-sm">{dailyPrediction.challenges}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                          <h4 className="font-cinzel text-sm text-green-500 mb-2">{l.opportunities}</h4>
                          <p className="text-foreground/80 text-sm">{dailyPrediction.opportunities}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              {/* Monthly Tab */}
              <TabsContent value="monthly" className="space-y-6">
                {monthlyPrediction && birthDate && (
                  <>
                    <WeeklyMonthlyPredictionCard
                      type="monthly"
                      monthlyData={monthlyPrediction}
                      birthDate={birthDate}
                      month={selectedMonth}
                      year={selectedYear}
                    />
                    {weeklyPrediction && (
                      <WeeklyMonthlyPredictionCard
                        type="weekly"
                        weeklyData={weeklyPrediction}
                        birthDate={birthDate}
                      />
                    )}
                    {annualTheme && (
                      <div className="card-mystic rounded-xl p-6 space-y-4">
                        <h3 className="font-cinzel text-xl text-gradient-gold">{l.personalMonth} - {selectedYear}</h3>
                        <div>
                          <h4 className="font-cinzel text-sm text-primary mb-2">{annualTheme.theme}</h4>
                          <p className="text-foreground/90">{annualTheme.description}</p>
                        </div>
                        {annualOpportunities && annualOpportunities.length > 0 && (
                          <div>
                            <h4 className="font-cinzel text-sm text-primary mb-2">Oportunități</h4>
                            <ul className="space-y-1">
                              {annualOpportunities.slice(0, 5).map((opp, index) => (
                                <li key={index} className="text-sm text-foreground/90 flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  <span>{opp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {annualChallenges && annualChallenges.length > 0 && (
                          <div>
                            <h4 className="font-cinzel text-sm text-destructive/80 mb-2">Provocări</h4>
                            <ul className="space-y-1">
                              {annualChallenges.slice(0, 5).map((challenge, index) => (
                                <li key={index} className="text-sm text-foreground/80 flex items-start gap-2">
                                  <span className="text-destructive/80 mt-1">•</span>
                                  <span>{challenge}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="card-mystic rounded-xl p-6 space-y-6">
                    <div className="text-center">
                      <h3 className="font-cinzel text-lg text-muted-foreground">{l.personalMonth}</h3>
                      <div className="number-display-large mx-auto my-4 animate-float">
                        {monthlyPrediction.number}
                      </div>
                      <p className="text-primary font-cinzel text-xl">{monthlyPrediction.theme}</p>
                    </div>

                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <h4 className="font-cinzel text-sm text-primary mb-2">{l.overview}</h4>
                      <p className="text-foreground/90">{monthlyPrediction.overview}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                        <h4 className="font-cinzel text-sm text-primary mb-2">{l.career}</h4>
                        <p className="text-foreground/80 text-sm">{monthlyPrediction.career}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                        <h4 className="font-cinzel text-sm text-primary mb-2">{l.relationships}</h4>
                        <p className="text-foreground/80 text-sm">{monthlyPrediction.relationships}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                        <h4 className="font-cinzel text-sm text-primary mb-2">{l.health}</h4>
                        <p className="text-foreground/80 text-sm">{monthlyPrediction.health}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                        <h4 className="font-cinzel text-sm text-primary mb-2">{l.finances}</h4>
                        <p className="text-foreground/80 text-sm">{monthlyPrediction.finances}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                      <h4 className="font-cinzel text-sm text-primary mb-2">{l.spirituality}</h4>
                      <p className="text-foreground/80 text-sm">{monthlyPrediction.spirituality}</p>
                    </div>

                    <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                      <h4 className="font-cinzel text-sm text-primary mb-2">{l.keyDays}</h4>
                      <div className="flex flex-wrap gap-2">
                        {monthlyPrediction.keyDays.map(day => (
                          <span key={day} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-cinzel">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          )}

          {/* Change birth date button */}
          {birthDate && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setBirthDate(undefined)}
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {l.selectBirthDate}
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-border mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-foreground/70 font-raleway">{t.footer}</p>
        </div>
      </footer>
    </PageLayout>
  );
};

export default Predictions;
