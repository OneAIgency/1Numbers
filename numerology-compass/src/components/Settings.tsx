import { Settings as SettingsIcon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ThemeSelector } from './ThemeSelector';

export const Settings = () => {
  const { displaySettings, updateDisplaySettings } = useTheme();

  return (
    <Card className="card-mystic">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-primary" />
          Setări Afișare
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Selector */}
        <div className="space-y-2">
          <Label>Temă</Label>
          <ThemeSelector />
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <Label>Dimensiune Font</Label>
          <Select
            value={displaySettings.fontSize}
            onValueChange={(value) => updateDisplaySettings({ fontSize: value as 'small' | 'medium' | 'large' })}
          >
            <SelectTrigger className="input-mystic">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Mic</SelectItem>
              <SelectItem value="medium">Mediu</SelectItem>
              <SelectItem value="large">Mare</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Contrast */}
        <div className="space-y-2">
          <Label>Contrast</Label>
          <Select
            value={displaySettings.contrast}
            onValueChange={(value) => updateDisplaySettings({ contrast: value as 'normal' | 'high' })}
          >
            <SelectTrigger className="input-mystic">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">Ridicat</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Animations */}
        <div className="flex items-center justify-between">
          <Label htmlFor="animations">Animații</Label>
          <Switch
            id="animations"
            checked={displaySettings.animations}
            onCheckedChange={(checked) => updateDisplaySettings({ animations: checked })}
          />
        </div>

        {/* Layout */}
        <div className="space-y-2">
          <Label>Layout</Label>
          <Select
            value={displaySettings.layout}
            onValueChange={(value) => updateDisplaySettings({ layout: value as 'compact' | 'comfortable' | 'spacious' })}
          >
            <SelectTrigger className="input-mystic">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="comfortable">Confortabil</SelectItem>
              <SelectItem value="spacious">Spațios</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

