import { Palette, Sun, Moon, Sparkles, Star } from 'lucide-react';
import { useTheme, ThemeName } from '@/contexts/ThemeContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const themeIcons: Record<ThemeName, typeof Sun> = {
  twilight: Sun,
  dawn: Sun,
  midnight: Moon,
  celestial: Sparkles,
  custom: Palette,
};

const themeLabels: Record<ThemeName, string> = {
  twilight: 'Twilight',
  dawn: 'Dawn',
  midnight: 'Midnight',
  celestial: 'Celestial',
  custom: 'Custom',
};

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const Icon = themeIcons[theme];

  return (
    <Select value={theme} onValueChange={(value) => setTheme(value as ThemeName)}>
      <SelectTrigger className="w-[140px] input-mystic">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <SelectValue>{themeLabels[theme]}</SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(themeLabels).map(([value, label]) => {
          const ThemeIcon = themeIcons[value as ThemeName];
          return (
            <SelectItem key={value} value={value}>
              <div className="flex items-center gap-2">
                <ThemeIcon className="h-4 w-4" />
                <span>{label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

