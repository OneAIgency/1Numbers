import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

interface NumerologyRadarChartProps {
  lifePath: number;
  destiny: number;
  soulUrge: number;
  personality: number;
  personalYear: number;
}

export const NumerologyRadarChart = ({
  lifePath,
  destiny,
  soulUrge,
  personality,
  personalYear
}: NumerologyRadarChartProps) => {
  const { language } = useLanguage();

  const labels = {
    ro: {
      lifePath: 'Drum Viață',
      destiny: 'Destin',
      soulUrge: 'Suflet',
      personality: 'Personalitate',
      personalYear: 'An Personal'
    },
    en: {
      lifePath: 'Life Path',
      destiny: 'Destiny',
      soulUrge: 'Soul Urge',
      personality: 'Personality',
      personalYear: 'Personal Year'
    },
    ru: {
      lifePath: 'Жизн. Путь',
      destiny: 'Судьба',
      soulUrge: 'Душа',
      personality: 'Личность',
      personalYear: 'Личн. Год'
    }
  };

  const l = labels[language];

  const data = [
    { subject: l.lifePath, value: lifePath, fullMark: 33 },
    { subject: l.destiny, value: destiny, fullMark: 33 },
    { subject: l.soulUrge, value: soulUrge, fullMark: 33 },
    { subject: l.personality, value: personality, fullMark: 33 },
    { subject: l.personalYear, value: personalYear, fullMark: 9 },
  ];

  return (
    <div className="w-full h-[300px] md:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke="hsl(45 80% 55% / 0.3)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: 'hsl(45 30% 95%)', fontSize: 11 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 33]} 
            tick={{ fill: 'hsl(240 10% 60%)', fontSize: 10 }}
            axisLine={false}
          />
          <Radar
            name="Numbers"
            dataKey="value"
            stroke="hsl(45 80% 55%)"
            fill="hsl(45 80% 55%)"
            fillOpacity={0.4}
            strokeWidth={2}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(240 15% 12%)',
              border: '1px solid hsl(260 30% 20%)',
              borderRadius: '8px',
              color: 'hsl(45 30% 95%)'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
