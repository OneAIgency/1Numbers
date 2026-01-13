import { Calendar, Sun, Moon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  calculatePersonalDayNumber, 
  calculatePersonalMonthNumber, 
  calculateUniversalDay,
  calculateUniversalMonth,
  PERSONAL_CYCLE_MEANINGS 
} from "@/lib/personalCycles";
import { cn } from "@/lib/utils";

interface PersonalCycleCardProps {
  birthDate: Date;
  delay?: number;
}

export const PersonalCycleCard = ({ birthDate, delay = 0 }: PersonalCycleCardProps) => {
  const { language } = useLanguage();
  
  const today = new Date();
  const personalDay = calculatePersonalDayNumber(birthDate, today);
  const personalMonth = calculatePersonalMonthNumber(birthDate);
  const universalDay = calculateUniversalDay(today);
  const universalMonth = calculateUniversalMonth();

  const dayInfo = PERSONAL_CYCLE_MEANINGS[personalDay];
  const monthInfo = PERSONAL_CYCLE_MEANINGS[personalMonth];

  const labels = {
    personalDay: { ro: "Ziua Personală", en: "Personal Day", ru: "Личный День" },
    personalMonth: { ro: "Luna Personală", en: "Personal Month", ru: "Личный Месяц" },
    universalDay: { ro: "Ziua Universală", en: "Universal Day", ru: "Универсальный День" },
    universalMonth: { ro: "Luna Universală", en: "Universal Month", ru: "Универсальный Месяц" },
    keywords: { ro: "Cuvinte cheie", en: "Keywords", ru: "Ключевые слова" },
    todayEnergy: { ro: "Energia zilei", en: "Today's energy", ru: "Энергия дня" },
    monthEnergy: { ro: "Energia lunii", en: "Month's energy", ru: "Энергия месяца" }
  };

  return (
    <div 
      className="p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="font-cinzel text-lg text-foreground">
          {language === 'ro' ? 'Ciclurile Personale' : language === 'ru' ? 'Личные Циклы' : 'Personal Cycles'}
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Personal Day */}
        <div className="text-center p-3 rounded-xl bg-primary/10 border border-primary/20">
          <Sun className="h-4 w-4 mx-auto text-primary mb-1" />
          <p className="text-xs text-muted-foreground">{labels.personalDay[language]}</p>
          <p className="font-cinzel text-2xl text-primary">{personalDay}</p>
          <p className="text-xs text-primary/70">{dayInfo?.keywords[language]}</p>
        </div>

        {/* Personal Month */}
        <div className="text-center p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <Moon className="h-4 w-4 mx-auto text-purple-400 mb-1" />
          <p className="text-xs text-muted-foreground">{labels.personalMonth[language]}</p>
          <p className="font-cinzel text-2xl text-purple-400">{personalMonth}</p>
          <p className="text-xs text-purple-400/70">{monthInfo?.keywords[language]}</p>
        </div>

        {/* Universal Day */}
        <div className="text-center p-3 rounded-xl bg-muted/50 border border-border/50">
          <Sun className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
          <p className="text-xs text-muted-foreground">{labels.universalDay[language]}</p>
          <p className="font-cinzel text-2xl text-foreground">{universalDay}</p>
        </div>

        {/* Universal Month */}
        <div className="text-center p-3 rounded-xl bg-muted/50 border border-border/50">
          <Moon className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
          <p className="text-xs text-muted-foreground">{labels.universalMonth[language]}</p>
          <p className="font-cinzel text-2xl text-foreground">{universalMonth}</p>
        </div>
      </div>

      {/* Daily Energy */}
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
          <p className="text-sm font-medium text-primary mb-2">{labels.todayEnergy[language]}</p>
          <p className="text-sm text-muted-foreground">{dayInfo?.dayMeaning[language]}</p>
        </div>

        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
          <p className="text-sm font-medium text-purple-400 mb-2">{labels.monthEnergy[language]}</p>
          <p className="text-sm text-muted-foreground">{monthInfo?.monthMeaning[language]}</p>
        </div>
      </div>
    </div>
  );
};
