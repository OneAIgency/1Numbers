import { Mountain, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PinnacleData, ChallengeData, PINNACLE_MEANINGS, CHALLENGE_MEANINGS } from "@/lib/pinnacles";
import { cn } from "@/lib/utils";

interface PinnacleCardProps {
  pinnacle: PinnacleData;
  challenge: ChallengeData;
  isCurrentPeriod: boolean;
  delay?: number;
}

export const PinnacleCard = ({ pinnacle, challenge, isCurrentPeriod, delay = 0 }: PinnacleCardProps) => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const pinnacleInfo = PINNACLE_MEANINGS[pinnacle.number] || PINNACLE_MEANINGS[pinnacle.number > 9 ? pinnacle.number : 1];
  const challengeInfo = CHALLENGE_MEANINGS[challenge.number] || CHALLENGE_MEANINGS[0];

  const periodLabels = {
    ro: ["Prima Perioadă", "A Doua Perioadă", "A Treia Perioadă", "A Patra Perioadă"],
    en: ["First Period", "Second Period", "Third Period", "Fourth Period"],
    ru: ["Первый Период", "Второй Период", "Третий Период", "Четвёртый Период"]
  };

  const ageRangeLabel = pinnacle.endAge >= 99 
    ? `${pinnacle.startAge}+` 
    : `${pinnacle.startAge} - ${pinnacle.endAge}`;

  return (
    <div 
      className={cn(
        "p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 opacity-0 animate-fade-in",
        isCurrentPeriod 
          ? "bg-primary/10 border-primary/30 ring-2 ring-primary/20" 
          : "bg-card/50 border-border/50 hover:bg-card/70"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-lg font-cinzel font-bold",
            isCurrentPeriod ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}>
            {pinnacle.number}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {periodLabels[language][pinnacle.period - 1]}
            </p>
            <p className="text-xs text-muted-foreground">
              {language === 'ro' ? 'Vârsta' : language === 'ru' ? 'Возраст' : 'Age'}: {ageRangeLabel}
            </p>
          </div>
        </div>
        {isCurrentPeriod && (
          <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
            {language === 'ro' ? 'Curent' : language === 'ru' ? 'Текущий' : 'Current'}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium text-primary flex items-center gap-1">
            <Mountain className="h-3 w-3" />
            {language === 'ro' ? 'Pinnacle' : language === 'ru' ? 'Пиннакль' : 'Pinnacle'}: {pinnacleInfo?.title[language]}
          </p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-amber-500">
            {language === 'ro' ? 'Provocare' : language === 'ru' ? 'Вызов' : 'Challenge'}: {challengeInfo?.title[language]}
          </p>
        </div>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        {language === 'ro' ? 'Detalii' : language === 'ru' ? 'Подробности' : 'Details'}
      </button>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-border/50 space-y-3 animate-fade-in">
          <div>
            <p className="text-xs font-medium text-primary mb-1">
              {language === 'ro' ? 'Despre Pinnacle' : language === 'ru' ? 'О Пиннакле' : 'About Pinnacle'}
            </p>
            <p className="text-xs text-muted-foreground">
              {pinnacleInfo?.description[language]}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-amber-500 mb-1">
              {language === 'ro' ? 'Despre Provocare' : language === 'ru' ? 'О Вызове' : 'About Challenge'}
            </p>
            <p className="text-xs text-muted-foreground">
              {challengeInfo?.description[language]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
