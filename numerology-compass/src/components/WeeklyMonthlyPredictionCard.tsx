import { Calendar, TrendingUp, Target, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { WeeklyPrediction, MonthlyPrediction, calculateMonthlyFocus, getMonthlyRecommendations } from '@/lib/predictions';
import { format } from 'date-fns';
import { ro, enUS, ru } from 'date-fns/locale';

const locales = { ro, en: enUS, ru };

interface WeeklyMonthlyPredictionCardProps {
  type: 'weekly' | 'monthly';
  weeklyData?: WeeklyPrediction;
  monthlyData?: MonthlyPrediction;
  birthDate: Date;
  month?: number;
  year?: number;
}

export const WeeklyMonthlyPredictionCard = ({
  type,
  weeklyData,
  monthlyData,
  birthDate,
  month,
  year
}: WeeklyMonthlyPredictionCardProps) => {
  const { language, t } = useLanguage();
  const locale = locales[language];
  
  const labels = {
    ro: {
      weekly: "Previziune Săptămânală",
      monthly: "Previziune Lunară",
      theme: "Temă",
      energy: "Energie",
      events: "Evenimente cheie",
      focus: "Zone de focus",
      recommendations: "Recomandări",
      advice: "Sfat",
      period: "Perioadă"
    },
    en: {
      weekly: "Weekly Prediction",
      monthly: "Monthly Prediction",
      theme: "Theme",
      energy: "Energy",
      events: "Key Events",
      focus: "Focus Areas",
      recommendations: "Recommendations",
      advice: "Advice",
      period: "Period"
    },
    ru: {
      weekly: "Еженедельный Прогноз",
      monthly: "Ежемесячный Прогноз",
      theme: "Тема",
      energy: "Энергия",
      events: "Ключевые события",
      focus: "Области фокуса",
      recommendations: "Рекомендации",
      advice: "Совет",
      period: "Период"
    }
  }[language];
  
  if (type === 'weekly' && weeklyData) {
    const focusAreas = monthlyData && month && year 
      ? calculateMonthlyFocus(birthDate, month, year)
      : [];
    
    return (
      <Card className="card-mystic">
        <CardHeader>
          <CardTitle className="font-cinzel text-xl text-gradient-gold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {labels.weekly}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {format(weeklyData.weekStart, 'd MMM', { locale })} - {format(weeklyData.weekEnd, 'd MMM yyyy', { locale })}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-cinzel text-sm text-primary mb-2">{labels.theme}</h3>
            <p className="text-foreground font-medium">{weeklyData.theme}</p>
          </div>
          
          <div>
            <h3 className="font-cinzel text-sm text-primary mb-2">{labels.energy}</h3>
            <Badge className="bg-primary/20 text-primary border-primary/30">
              {weeklyData.overallEnergy}
            </Badge>
          </div>
          
          {weeklyData.keyEvents.length > 0 && (
            <div>
              <h3 className="font-cinzel text-sm text-primary mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {labels.events}
              </h3>
              <ul className="space-y-1">
                {weeklyData.keyEvents.map((event, index) => (
                  <li key={index} className="text-sm text-foreground/90 flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{event}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {weeklyData.focusAreas.length > 0 && (
            <div>
              <h3 className="font-cinzel text-sm text-primary mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                {labels.focus}
              </h3>
              <div className="flex flex-wrap gap-2">
                {weeklyData.focusAreas.map((area, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <h3 className="font-cinzel text-sm text-primary mb-1">{labels.advice}</h3>
            <p className="text-sm text-foreground/90">{weeklyData.advice}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (type === 'monthly' && monthlyData && month && year) {
    const focusAreas = calculateMonthlyFocus(birthDate, month, year);
    const recommendations = getMonthlyRecommendations(birthDate, month, year);
    
    return (
      <Card className="card-mystic">
        <CardHeader>
          <CardTitle className="font-cinzel text-xl text-gradient-gold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {labels.monthly}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-cinzel text-sm text-primary mb-2">{labels.theme}</h3>
            <p className="text-foreground font-medium">{monthlyData.theme}</p>
          </div>
          
          {focusAreas.length > 0 && (
            <div>
              <h3 className="font-cinzel text-sm text-primary mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                {labels.focus}
              </h3>
              <div className="flex flex-wrap gap-2">
                {focusAreas.map((area, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {recommendations.length > 0 && (
            <div>
              <h3 className="font-cinzel text-sm text-primary mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {labels.recommendations}
              </h3>
              <ul className="space-y-2">
                {recommendations.slice(0, 5).map((rec, index) => (
                  <li key={index} className="text-sm text-foreground/90 flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  return null;
};

