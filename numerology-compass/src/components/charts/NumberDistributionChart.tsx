import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface NumberDistributionChartProps {
  name: string;
}

// Calculate letter frequency for a name
const calculateLetterDistribution = (name: string) => {
  const PYTHAGOREAN_VALUES: Record<string, number> = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
    J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
    S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
  };

  const distribution: Record<number, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
  };

  const cleanName = name.toUpperCase().replace(/[^A-Z]/g, '');
  
  for (const char of cleanName) {
    const value = PYTHAGOREAN_VALUES[char];
    if (value) {
      distribution[value]++;
    }
  }

  return Object.entries(distribution).map(([number, count]) => ({
    number: parseInt(number),
    count,
    percentage: cleanName.length > 0 ? Math.round((count / cleanName.length) * 100) : 0
  }));
};

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

export const NumberDistributionChart = ({ name }: NumberDistributionChartProps) => {
  const data = calculateLetterDistribution(name);

  return (
    <div className="w-full h-[200px]">
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
              if (name === 'count') return [`${value} letters`, 'Count'];
              return [value, name];
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
