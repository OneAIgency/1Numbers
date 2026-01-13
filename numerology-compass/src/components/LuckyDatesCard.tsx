import { useMemo, useState } from "react";
import { Calendar, Sparkles, Star, TrendingUp } from "lucide-react";
import { format, addMonths } from "date-fns";
import { ro, enUS, ru } from "date-fns/locale";
import { useLanguage } from "@/contexts/LanguageContext";
import { findLuckyDates, getNextLuckyDate, LuckyDate } from "@/lib/luckyDates";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LuckyDatesCardProps {
  birthDate: Date;
  fullName: string;
  delay?: number;
}

export const LuckyDatesCard = ({ birthDate, fullName, delay = 0 }: LuckyDatesCardProps) => {
  const { language } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const locales = { ro, en: enUS, ru };
  const locale = locales[language] || enUS;

  const t = {
    ro: {
      title: "Date Norocoase",
      subtitle: "Găsește datele favorabile bazate pe numerele tale",
      nextLucky: "Următoarea dată norocoasă",
      bestDates: "Cele mai bune date",
      score: "Scor",
      reasons: {
        lifePathMatch: "Potrivire Drum al Vieții",
        lifePathCompatible: "Compatibil Drum al Vieții",
        destinyMatch: "Potrivire Destin",
        destinyCompatible: "Compatibil Destin",
        personalYearMatch: "Potrivire An Personal",
        dayMatch: "Potrivire zi",
        masterNumber: "Număr Master",
        mirrorDate: "Dată oglindă",
        repeatingDigits: "Cifre repetate"
      },
      noLuckyDates: "Nu există date norocoase în această lună",
      dayNumber: "Numărul zilei",
      universalNumber: "Nr. universal",
      allDates: "Toate datele norocoase"
    },
    en: {
      title: "Lucky Dates",
      subtitle: "Find favorable dates based on your numbers",
      nextLucky: "Next lucky date",
      bestDates: "Best dates",
      score: "Score",
      reasons: {
        lifePathMatch: "Life Path Match",
        lifePathCompatible: "Life Path Compatible",
        destinyMatch: "Destiny Match",
        destinyCompatible: "Destiny Compatible",
        personalYearMatch: "Personal Year Match",
        dayMatch: "Day Match",
        masterNumber: "Master Number",
        mirrorDate: "Mirror Date",
        repeatingDigits: "Repeating Digits"
      },
      noLuckyDates: "No lucky dates this month",
      dayNumber: "Day number",
      universalNumber: "Universal no.",
      allDates: "All lucky dates"
    },
    ru: {
      title: "Удачные Даты",
      subtitle: "Найдите благоприятные даты на основе ваших чисел",
      nextLucky: "Следующая удачная дата",
      bestDates: "Лучшие даты",
      score: "Оценка",
      reasons: {
        lifePathMatch: "Совпадение с Жизненным Путём",
        lifePathCompatible: "Совместимость с Жизненным Путём",
        destinyMatch: "Совпадение с Судьбой",
        destinyCompatible: "Совместимость с Судьбой",
        personalYearMatch: "Совпадение с Личным Годом",
        dayMatch: "Совпадение дня",
        masterNumber: "Мастер-число",
        mirrorDate: "Зеркальная дата",
        repeatingDigits: "Повторяющиеся цифры"
      },
      noLuckyDates: "Нет удачных дат в этом месяце",
      dayNumber: "Число дня",
      universalNumber: "Универс. число",
      allDates: "Все удачные даты"
    }
  }[language];

  const nextLucky = useMemo(() => getNextLuckyDate(birthDate, fullName), [birthDate, fullName]);
  
  const monthDates = useMemo(() => {
    const startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
    const endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
    return findLuckyDates(birthDate, fullName, startDate, endDate, 25);
  }, [birthDate, fullName, selectedMonth]);

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 50) return "text-amber-400";
    return "text-primary";
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return "bg-green-500/20 border-green-500/30";
    if (score >= 50) return "bg-amber-500/20 border-amber-500/30";
    return "bg-primary/20 border-primary/30";
  };

  const renderDateCard = (luckyDate: LuckyDate, isNext: boolean = false) => (
    <div
      key={luckyDate.date.toISOString()}
      className={cn(
        "p-4 rounded-xl border backdrop-blur-sm transition-all hover:scale-[1.02]",
        isNext ? "bg-primary/10 border-primary/30" : "bg-card/30 border-border/50"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-cinzel text-foreground">
              {format(luckyDate.date, "EEEE, d MMMM", { locale })}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {luckyDate.reasons.map((reason) => (
              <span
                key={reason}
                className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground"
              >
                {t.reasons[reason as keyof typeof t.reasons] || reason}
              </span>
            ))}
          </div>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>{t.dayNumber}: <span className="text-primary font-medium">{luckyDate.dayNumber}</span></span>
            <span>{t.universalNumber}: <span className="text-primary font-medium">{luckyDate.universalNumber}</span></span>
          </div>
        </div>
        <div className={cn("px-3 py-2 rounded-lg border text-center", getScoreBg(luckyDate.score))}>
          <div className={cn("font-cinzel text-lg", getScoreColor(luckyDate.score))}>
            {luckyDate.score}
          </div>
          <div className="text-xs text-muted-foreground">{t.score}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-cinzel text-lg text-foreground">{t.title}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6">{t.subtitle}</p>

      {/* Next Lucky Date */}
      {nextLucky && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-foreground">{t.nextLucky}</span>
          </div>
          {renderDateCard(nextLucky, true)}
        </div>
      )}

      {/* Month Selector */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedMonth(addMonths(selectedMonth, -1))}
          className="border-border/50"
        >
          ←
        </Button>
        <span className="flex-1 text-center font-raleway text-foreground">
          {format(selectedMonth, "MMMM yyyy", { locale })}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
          className="border-border/50"
        >
          →
        </Button>
      </div>

      {/* Best Dates */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{t.bestDates}</span>
          <span className="text-xs text-muted-foreground">({monthDates.bestDates.length})</span>
        </div>
        {monthDates.bestDates.length > 0 ? (
          <div className="space-y-3">
            {monthDates.bestDates.map((date) => renderDateCard(date))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground p-4 rounded-xl bg-muted/20 border border-border/30">
            {t.noLuckyDates}
          </p>
        )}
      </div>

      {/* All Lucky Dates Summary */}
      {monthDates.dates.length > 5 && (
        <div className="pt-4 border-t border-border/30">
          <span className="text-sm text-muted-foreground">
            {t.allDates}: <span className="text-primary font-medium">{monthDates.dates.length}</span>
          </span>
        </div>
      )}
    </div>
  );
};
