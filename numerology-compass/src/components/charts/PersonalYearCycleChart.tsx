import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { calculatePersonalYearNumber } from '@/lib/numerology';
import { useLanguage } from '@/contexts/LanguageContext';

interface PersonalYearCycleChartProps {
  birthDate: Date;
}

export const PersonalYearCycleChart = ({ birthDate }: PersonalYearCycleChartProps) => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  // Generate data for past 4 years, current year, and next 4 years
  const data = [];
  for (let year = currentYear - 4; year <= currentYear + 4; year++) {
    const personalYear = calculatePersonalYearNumber(birthDate, year);
    data.push({
      year,
      personalYear,
      isCurrent: year === currentYear
    });
  }

  const labels = {
    ro: { year: 'An', personalYear: 'An Personal', current: 'Anul curent' },
    en: { year: 'Year', personalYear: 'Personal Year', current: 'Current year' },
    ru: { year: 'Год', personalYear: 'Личный год', current: 'Текущий год' }
  };

  const l = labels[language];

  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
          <XAxis 
            dataKey="year" 
            tick={{ fill: 'hsl(45 30% 95%)', fontSize: 11 }}
            axisLine={{ stroke: 'hsl(260 30% 20%)' }}
          />
          <YAxis 
            domain={[1, 9]}
            ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
            tick={{ fill: 'hsl(240 10% 60%)', fontSize: 10 }}
            axisLine={{ stroke: 'hsl(260 30% 20%)' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(240 15% 12%)',
              border: '1px solid hsl(260 30% 20%)',
              borderRadius: '8px',
              color: 'hsl(45 30% 95%)'
            }}
            formatter={(value: number) => [value, l.personalYear]}
            labelFormatter={(label) => `${l.year}: ${label}`}
          />
          <ReferenceLine 
            x={currentYear} 
            stroke="hsl(45 80% 55%)" 
            strokeWidth={2}
            strokeDasharray="5 5"
            label={{ 
              value: l.current, 
              position: 'top', 
              fill: 'hsl(45 80% 55%)',
              fontSize: 10
            }}
          />
          <Line 
            type="monotone" 
            dataKey="personalYear" 
            stroke="hsl(280 50% 50%)" 
            strokeWidth={3}
            dot={{ fill: 'hsl(280 50% 50%)', strokeWidth: 2, r: 5 }}
            activeDot={{ fill: 'hsl(45 80% 55%)', strokeWidth: 2, r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
