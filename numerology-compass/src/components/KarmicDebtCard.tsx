import { AlertTriangle, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { KarmicDebtInfo, KARMIC_DEBT_MEANINGS } from "@/lib/karmic";
import { cn } from "@/lib/utils";

interface KarmicDebtCardProps {
  debt: KarmicDebtInfo;
  delay?: number;
}

export const KarmicDebtCard = ({ debt, delay = 0 }: KarmicDebtCardProps) => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  const debtInfo = KARMIC_DEBT_MEANINGS[debt.number];
  if (!debtInfo) return null;

  const sourceLabels = {
    lifePath: { ro: "Drumul Vieții", en: "Life Path", ru: "Жизненный Путь" },
    destiny: { ro: "Destinul", en: "Destiny", ru: "Судьба" },
    soulUrge: { ro: "Impulsul Sufletului", en: "Soul Urge", ru: "Порыв Души" },
    personality: { ro: "Personalitatea", en: "Personality", ru: "Личность" },
    birthday: { ro: "Ziua Nașterii", en: "Birthday", ru: "День Рождения" }
  };

  return (
    <div 
      className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-sm opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-amber-500" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-cinzel text-lg text-amber-400">{debtInfo.title[language]}</h4>
            <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-300">
              {sourceLabels[debt.source][language]}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground mt-2">
            {debtInfo.description[language]}
          </p>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors"
          >
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {language === 'ro' ? 'Vindecarea' : language === 'ru' ? 'Исцеление' : 'Healing'}
          </button>

          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-amber-500/20 space-y-3 animate-fade-in">
              <div>
                <p className="text-xs font-medium text-amber-400 mb-1 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {language === 'ro' ? 'Lecția' : language === 'ru' ? 'Урок' : 'Lesson'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {debtInfo.lesson[language]}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-green-400 mb-1">
                  {language === 'ro' ? 'Vindecarea' : language === 'ru' ? 'Исцеление' : 'Healing'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {debtInfo.healing[language]}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
