import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LabelList } from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

interface CompatibilityChartProps {
  overallScore: number;
  lifePathScore: number;
  destinyScore: number;
  soulUrgeScore: number;
}

export const CompatibilityChart = ({
  overallScore,
  lifePathScore,
  destinyScore,
  soulUrgeScore
}: CompatibilityChartProps) => {
  const { language } = useLanguage();

  const labels = {
    ro: {
      overall: 'Total',
      lifePath: 'Drum Viață',
      destiny: 'Destin',
      soulUrge: 'Suflet'
    },
    en: {
      overall: 'Overall',
      lifePath: 'Life Path',
      destiny: 'Destiny',
      soulUrge: 'Soul Urge'
    },
    ru: {
      overall: 'Общая',
      lifePath: 'Жизн. Путь',
      destiny: 'Судьба',
      soulUrge: 'Душа'
    }
  };

  const l = labels[language];

  const data = [
    { name: l.overall, score: overallScore },
    { name: l.lifePath, score: lifePathScore },
    { name: l.destiny, score: destinyScore },
    { name: l.soulUrge, score: soulUrgeScore },
  ];

  const getColor = (score: number) => {
    if (score >= 85) return 'hsl(120 50% 45%)'; // Green - Excellent
    if (score >= 70) return 'hsl(180 60% 45%)'; // Teal - Good
    if (score >= 50) return 'hsl(45 80% 55%)';  // Gold - Moderate
    return 'hsl(0 70% 55%)';                     // Red - Challenging
  };

  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 40, bottom: 10, left: 70 }}>
          <XAxis 
            type="number" 
            domain={[0, 100]}
            tick={{ fill: 'hsl(240 10% 60%)', fontSize: 10 }}
            axisLine={{ stroke: 'hsl(260 30% 20%)' }}
          />
          <YAxis 
            type="category"
            dataKey="name" 
            tick={{ fill: 'hsl(45 30% 95%)', fontSize: 11 }}
            axisLine={{ stroke: 'hsl(260 30% 20%)' }}
            width={65}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(240 15% 12%)',
              border: '1px solid hsl(260 30% 20%)',
              borderRadius: '8px',
              color: 'hsl(45 30% 95%)'
            }}
            formatter={(value: number) => [`${value}%`, 'Compatibility']}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.score)} />
            ))}
            <LabelList 
              dataKey="score" 
              position="right" 
              fill="hsl(45 30% 95%)"
              fontSize={12}
              formatter={(value: number) => `${value}%`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
