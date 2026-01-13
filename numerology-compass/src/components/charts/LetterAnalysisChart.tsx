import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, Legend } from 'recharts';
import { analyzeIndividualLetters } from '@/lib/nameAnalysis';

interface LetterAnalysisChartProps {
  name: string;
}

const COLORS = [
  'hsl(45 80% 55%)',   // 1 - Gold
  'hsl(280 50% 50%)',  // 2 - Purple
  'hsl(200 70% 50%)',  // 3 - Blue
  'hsl(120 50% 45%)',  // 4 - Green
  'hsl(35 90% 55%)',   // 5 - Orange
  'hsl(340 70% 55%)',  // 6 - Pink
  'hsl(260 60% 55%)',  // 7 - Violet
  'hsl(180 60% 45%)',  // 8 - Teal
  'hsl(0 70% 55%)',    // 9 - Red
];

const COLORS_VOWELS = [
  'hsla(45, 80%, 55%, 0.7)',   // 1 - Gold
  'hsla(280, 50%, 50%, 0.7)',  // 2 - Purple
  'hsla(200, 70%, 50%, 0.7)',  // 3 - Blue
  'hsla(120, 50%, 45%, 0.7)',  // 4 - Green
  'hsla(35, 90%, 55%, 0.7)',   // 5 - Orange
  'hsla(340, 70%, 55%, 0.7)',  // 6 - Pink
  'hsla(260, 60%, 55%, 0.7)',  // 7 - Violet
  'hsla(180, 60%, 45%, 0.7)',  // 8 - Teal
  'hsla(0, 70%, 55%, 0.7)',    // 9 - Red
];

const COLORS_CONSONANTS = [
  'hsla(45, 80%, 55%, 0.4)',   // 1 - Gold
  'hsla(280, 50%, 50%, 0.4)',  // 2 - Purple
  'hsla(200, 70%, 50%, 0.4)',  // 3 - Blue
  'hsla(120, 50%, 45%, 0.4)',  // 4 - Green
  'hsla(35, 90%, 55%, 0.4)',   // 5 - Orange
  'hsla(340, 70%, 55%, 0.4)',  // 6 - Pink
  'hsla(260, 60%, 55%, 0.4)',  // 7 - Violet
  'hsla(180, 60%, 45%, 0.4)',  // 8 - Teal
  'hsla(0, 70%, 55%, 0.4)',    // 9 - Red
];

const calculateLetterDistribution = (name: string) => {
  const letters = analyzeIndividualLetters(name);
  const distribution: Record<number, { count: number; vowels: number; consonants: number }> = {
    1: { count: 0, vowels: 0, consonants: 0 },
    2: { count: 0, vowels: 0, consonants: 0 },
    3: { count: 0, vowels: 0, consonants: 0 },
    4: { count: 0, vowels: 0, consonants: 0 },
    5: { count: 0, vowels: 0, consonants: 0 },
    6: { count: 0, vowels: 0, consonants: 0 },
    7: { count: 0, vowels: 0, consonants: 0 },
    8: { count: 0, vowels: 0, consonants: 0 },
    9: { count: 0, vowels: 0, consonants: 0 },
  };

  for (const letter of letters) {
    if (letter.value > 0 && letter.value <= 9) {
      distribution[letter.value].count++;
      if (letter.isVowel) {
        distribution[letter.value].vowels++;
      }
      if (letter.isConsonant) {
        distribution[letter.value].consonants++;
      }
    }
  }

  return Object.entries(distribution).map(([number, data]) => ({
    number: parseInt(number),
    total: data.count,
    vowels: data.vowels,
    consonants: data.consonants,
    percentage: letters.length > 0 ? Math.round((data.count / letters.length) * 100) : 0
  }));
};

export const LetterAnalysisChart = ({ name }: LetterAnalysisChartProps) => {
  const data = calculateLetterDistribution(name);

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
          <XAxis 
            dataKey="number" 
            tick={{ fill: 'hsl(45 30% 95%)', fontSize: 12 }}
            axisLine={{ stroke: 'hsl(260 30% 20%)' }}
          />
          <YAxis 
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
            formatter={(value: number, name: string) => {
              if (name === 'total') return [`${value} litere`, 'Total'];
              if (name === 'vowels') return [`${value} vocale`, 'Vocale'];
              if (name === 'consonants') return [`${value} consoane`, 'Consoane'];
              return [value, name];
            }}
          />
          <Legend 
            wrapperStyle={{ color: 'hsl(45 30% 95%)' }}
            iconType="circle"
          />
          <Bar dataKey="total" name="Total" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-total-${index}`} fill={COLORS[index]} />
            ))}
          </Bar>
          <Bar dataKey="vowels" name="Vocale" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-vowels-${index}`} fill={COLORS_VOWELS[index]} />
            ))}
          </Bar>
          <Bar dataKey="consonants" name="Consoane" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-consonants-${index}`} fill={COLORS_CONSONANTS[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

