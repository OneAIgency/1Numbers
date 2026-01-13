import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from "date-fns";
import { ro, enUS, ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Star, Sparkles, Sun, Moon, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { calculatePersonalDayNumber, calculateUniversalDay, PERSONAL_CYCLE_MEANINGS } from "@/lib/personalCycles";
import { calculateLuckyScore } from "@/lib/luckyDates";
import { calculateLifePathNumber, calculateDestinyNumber, calculatePersonalYearNumber } from "@/lib/numerology";

interface NumerologyCalendarProps {
  birthDate: Date;
  fullName: string;
}

interface DayData {
  date: Date;
  personalDay: number;
  universalDay: number;
  luckyScore: number;
  reasons: string[];
  isLucky: boolean;
  isMasterDay: boolean;
}

export const NumerologyCalendar = ({ birthDate, fullName }: NumerologyCalendarProps) => {
  const { language } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  const locales = { ro, en: enUS, ru };
  const locale = locales[language as keyof typeof locales] || enUS;

  const t = {
    ro: {
      title: "Calendar Numerologic",
      subtitle: "Energiile zilnice personalizate",
      today: "Azi",
      personalDay: "Zi Personală",
      universalDay: "Zi Universală",
      luckyDay: "Zi Norocoasă",
      masterDay: "Zi Maestru",
      score: "Scor Noroc",
      dayEnergy: "Energia Zilei",
      keywords: "Cuvinte cheie",
      meaning: "Semnificație",
      reasons: "Motive favorabile",
      legend: "Legendă",
      luckyDays: "Zile norocoase",
      masterDays: "Zile maestru (11, 22)",
      highEnergy: "Energie înaltă",
      reasonLabels: {
        lifePathMatch: "Se potrivește cu Life Path",
        lifePathCompatible: "Compatibil cu Life Path",
        destinyMatch: "Se potrivește cu Destiny",
        destinyCompatible: "Compatibil cu Destiny",
        personalYearMatch: "Se potrivește cu Anul Personal",
        dayMatch: "Ziua se potrivește cu numerele tale",
        masterNumber: "Număr Maestru",
        mirrorDate: "Dată oglindă",
        repeatingDigits: "Cifre repetitive"
      },
      weekDays: ["Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"]
    },
    en: {
      title: "Numerology Calendar",
      subtitle: "Personalized daily energies",
      today: "Today",
      personalDay: "Personal Day",
      universalDay: "Universal Day",
      luckyDay: "Lucky Day",
      masterDay: "Master Day",
      score: "Lucky Score",
      dayEnergy: "Day Energy",
      keywords: "Keywords",
      meaning: "Meaning",
      reasons: "Favorable reasons",
      legend: "Legend",
      luckyDays: "Lucky days",
      masterDays: "Master days (11, 22)",
      highEnergy: "High energy",
      reasonLabels: {
        lifePathMatch: "Matches Life Path",
        lifePathCompatible: "Compatible with Life Path",
        destinyMatch: "Matches Destiny",
        destinyCompatible: "Compatible with Destiny",
        personalYearMatch: "Matches Personal Year",
        dayMatch: "Day matches your numbers",
        masterNumber: "Master Number",
        mirrorDate: "Mirror date",
        repeatingDigits: "Repeating digits"
      },
      weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
    },
    ru: {
      title: "Нумерологический Календарь",
      subtitle: "Персонализированные ежедневные энергии",
      today: "Сегодня",
      personalDay: "Личный День",
      universalDay: "Универсальный День",
      luckyDay: "Счастливый День",
      masterDay: "Мастер День",
      score: "Счёт Удачи",
      dayEnergy: "Энергия Дня",
      keywords: "Ключевые слова",
      meaning: "Значение",
      reasons: "Благоприятные причины",
      legend: "Легенда",
      luckyDays: "Счастливые дни",
      masterDays: "Мастер дни (11, 22)",
      highEnergy: "Высокая энергия",
      reasonLabels: {
        lifePathMatch: "Соответствует Life Path",
        lifePathCompatible: "Совместим с Life Path",
        destinyMatch: "Соответствует Destiny",
        destinyCompatible: "Совместим с Destiny",
        personalYearMatch: "Соответствует Личному Году",
        dayMatch: "День соответствует вашим числам",
        masterNumber: "Мастер Число",
        mirrorDate: "Зеркальная дата",
        repeatingDigits: "Повторяющиеся цифры"
      },
      weekDays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
    }
  }[language];

  // Calculate all day data for the current month
  const monthData = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    const lifePathNumber = calculateLifePathNumber(birthDate);
    const destinyNumber = calculateDestinyNumber(fullName);
    const personalYearNumber = calculatePersonalYearNumber(birthDate, currentMonth.getFullYear());

    return days.map((date): DayData => {
      const personalDay = calculatePersonalDayNumber(birthDate, date);
      const universalDay = calculateUniversalDay(date);
      const { score, reasons } = calculateLuckyScore(date, lifePathNumber, destinyNumber, personalYearNumber);
      
      // Check if it's a master day (personal or universal = 11 or 22)
      const isMasterDay = personalDay === 11 || personalDay === 22 || universalDay === 11 || universalDay === 22;
      
      return {
        date,
        personalDay,
        universalDay,
        luckyScore: score,
        reasons,
        isLucky: score >= 40,
        isMasterDay
      };
    });
  }, [currentMonth, birthDate, fullName]);

  // Get days for calendar grid (including padding for start of month)
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const startDay = start.getDay() === 0 ? 6 : start.getDay() - 1; // Adjust for Monday start
    
    const paddingDays: (DayData | null)[] = Array(startDay).fill(null);
    return [...paddingDays, ...monthData];
  }, [currentMonth, monthData]);

  const getDayClasses = (day: DayData) => {
    let classes = "relative p-1 h-12 sm:h-16 md:h-20 flex flex-col items-center justify-start cursor-pointer transition-all duration-200 rounded-lg border ";
    
    if (isToday(day.date)) {
      classes += "ring-2 ring-primary ring-offset-1 ring-offset-background ";
    }
    
    if (day.isLucky && day.isMasterDay) {
      classes += "bg-gradient-to-br from-amber-500/30 to-purple-500/30 border-amber-400/50 hover:from-amber-500/40 hover:to-purple-500/40 ";
    } else if (day.isMasterDay) {
      classes += "bg-purple-500/20 border-purple-400/40 hover:bg-purple-500/30 ";
    } else if (day.isLucky) {
      classes += "bg-amber-500/20 border-amber-400/40 hover:bg-amber-500/30 ";
    } else if (day.luckyScore >= 25) {
      classes += "bg-emerald-500/10 border-emerald-400/20 hover:bg-emerald-500/20 ";
    } else {
      classes += "bg-card/50 border-border/30 hover:bg-card ";
    }
    
    return classes;
  };

  const getScoreColor = (score: number) => {
    if (score >= 60) return "text-amber-400";
    if (score >= 40) return "text-emerald-400";
    if (score >= 25) return "text-blue-400";
    return "text-muted-foreground";
  };

  return (
    <Card className="card-mystic">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-cinzel text-xl md:text-2xl text-gradient-gold flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 md:h-6 md:w-6" />
              {t.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="h-8 w-8 border-primary/30"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-cinzel text-lg min-w-[140px] text-center capitalize">
              {format(currentMonth, "MMMM yyyy", { locale })}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="h-8 w-8 border-primary/30"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-amber-500/40 border border-amber-400/60" />
            <span className="text-muted-foreground">{t.luckyDays}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-purple-500/40 border border-purple-400/60" />
            <span className="text-muted-foreground">{t.masterDays}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-400/40" />
            <span className="text-muted-foreground">{t.highEnergy}</span>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {t.weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div key={index}>
              {day ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <div 
                      className={getDayClasses(day)}
                      onClick={() => setSelectedDay(day)}
                    >
                      <span className={`text-sm font-medium ${isToday(day.date) ? 'text-primary' : 'text-foreground'}`}>
                        {format(day.date, "d")}
                      </span>
                      
                      {/* Day indicators */}
                      <div className="flex gap-0.5 mt-0.5">
                        {day.isMasterDay && (
                          <Sparkles className="h-3 w-3 text-purple-400" />
                        )}
                        {day.isLucky && (
                          <Star className="h-3 w-3 text-amber-400 fill-amber-400/50" />
                        )}
                      </div>
                      
                      {/* Personal/Universal numbers on larger screens */}
                      <div className="hidden sm:flex gap-1 mt-0.5 text-[10px]">
                        <span className="text-primary/80">{day.personalDay}</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-amber-400/80">{day.universalDay}</span>
                      </div>
                    </div>
                  </DialogTrigger>
                  
                  <DialogContent className="sm:max-w-md bg-card border-primary/20">
                    <DialogHeader>
                      <DialogTitle className="font-cinzel text-xl text-gradient-gold">
                        {format(day.date, "EEEE, d MMMM yyyy", { locale })}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      {/* Numbers row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-primary/10 rounded-lg p-3 text-center">
                          <Sun className="h-5 w-5 text-primary mx-auto mb-1" />
                          <div className="text-2xl font-cinzel text-primary font-bold">{day.personalDay}</div>
                          <div className="text-xs text-muted-foreground">{t.personalDay}</div>
                        </div>
                        <div className="bg-amber-500/10 rounded-lg p-3 text-center">
                          <Moon className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                          <div className="text-2xl font-cinzel text-amber-400 font-bold">{day.universalDay}</div>
                          <div className="text-xs text-muted-foreground">{t.universalDay}</div>
                        </div>
                      </div>

                      {/* Lucky Score */}
                      {day.luckyScore > 0 && (
                        <div className="flex items-center justify-between bg-card/50 rounded-lg p-3 border border-border/50">
                          <span className="text-sm text-muted-foreground">{t.score}</span>
                          <span className={`text-xl font-bold ${getScoreColor(day.luckyScore)}`}>
                            {day.luckyScore}%
                          </span>
                        </div>
                      )}

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        {day.isMasterDay && (
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                            <Sparkles className="h-3 w-3 mr-1" />
                            {t.masterDay}
                          </Badge>
                        )}
                        {day.isLucky && (
                          <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30">
                            <Star className="h-3 w-3 mr-1" />
                            {t.luckyDay}
                          </Badge>
                        )}
                      </div>

                      {/* Reasons */}
                      {day.reasons.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-foreground">{t.reasons}</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {day.reasons.map((reason, i) => (
                              <Badge key={i} variant="outline" className="text-xs bg-card/50">
                                {t.reasonLabels[reason as keyof typeof t.reasonLabels] || reason}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Day meaning */}
                      {PERSONAL_CYCLE_MEANINGS[day.personalDay] && (
                        <div className="space-y-2 pt-2 border-t border-border/50">
                          <h4 className="text-sm font-medium text-foreground">{t.dayEnergy}</h4>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              {PERSONAL_CYCLE_MEANINGS[day.personalDay].keywords[language as 'ro' | 'en' | 'ru']}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {PERSONAL_CYCLE_MEANINGS[day.personalDay].dayMeaning[language as 'ro' | 'en' | 'ru']}
                          </p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="h-12 sm:h-16 md:h-20" />
              )}
            </div>
          ))}
        </div>

        {/* Month Summary */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-amber-500/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-amber-400">
                {monthData.filter(d => d.isLucky).length}
              </div>
              <div className="text-xs text-muted-foreground">{t.luckyDays}</div>
            </div>
            <div className="bg-purple-500/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-400">
                {monthData.filter(d => d.isMasterDay).length}
              </div>
              <div className="text-xs text-muted-foreground">{t.masterDays}</div>
            </div>
            <div className="bg-emerald-500/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-emerald-400">
                {monthData.filter(d => d.luckyScore >= 25 && !d.isLucky).length}
              </div>
              <div className="text-xs text-muted-foreground">{t.highEnergy}</div>
            </div>
            <div className="bg-primary/10 rounded-lg p-3">
              <div className="text-2xl font-bold text-primary">
                {Math.max(...monthData.map(d => d.luckyScore))}%
              </div>
              <div className="text-xs text-muted-foreground">{t.score}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
