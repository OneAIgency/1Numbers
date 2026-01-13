import { useState } from 'react';
import { Users, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfiles, Profile } from '@/hooks/use-profiles';
import { calculateLifePathNumber, calculateDestinyNumber, calculateSoulUrgeNumber, calculatePersonalityNumber } from '@/lib/numerology';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ProfileComparisonProps {
  className?: string;
}

export const ProfileComparison = ({ className }: ProfileComparisonProps) => {
  const { t } = useLanguage();
  const { profiles } = useProfiles();
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([]);

  const selectedProfiles = profiles.filter(p => selectedProfileIds.includes(p.id));

  const addProfile = (profileId: string) => {
    if (!selectedProfileIds.includes(profileId) && selectedProfileIds.length < 3) {
      setSelectedProfileIds([...selectedProfileIds, profileId]);
    }
  };

  const removeProfile = (profileId: string) => {
    setSelectedProfileIds(selectedProfileIds.filter(id => id !== profileId));
  };

  const calculateProfileNumbers = (profile: Profile) => {
    const birthDate = new Date(profile.birthDate);

    const lifePath = calculateLifePathNumber(birthDate);
    const destiny = calculateDestinyNumber(profile.fullName);
    const soulUrge = calculateSoulUrgeNumber(profile.fullName);
    const personality = calculatePersonalityNumber(profile.fullName);

    return { lifePath, destiny, soulUrge, personality };
  };

  const availableProfiles = profiles.filter(p => !selectedProfileIds.includes(p.id));

  if (profiles.length < 2) {
    return (
      <Card className={cn("card-mystic", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {t.profileComparison}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            {t.noProfiles} {t.selectProfilesToCompare}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("card-mystic", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          {t.profileComparison}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground/90">
            {t.selectProfilesToCompare}
          </label>
          <div className="flex gap-2 flex-wrap">
            {selectedProfiles.map((profile) => (
              <Badge
                key={profile.id}
                variant="secondary"
                className="flex items-center gap-2 px-3 py-1"
              >
                <span>{profile.fullName}</span>
                <button
                  onClick={() => removeProfile(profile.id)}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  aria-label={`Remove ${profile.fullName}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {selectedProfileIds.length < 3 && availableProfiles.length > 0 && (
              <Select
                value=""
                onValueChange={addProfile}
              >
                <SelectTrigger className="w-[200px] input-mystic">
                  <SelectValue placeholder={t.selectProfile} />
                </SelectTrigger>
                <SelectContent>
                  {availableProfiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        {selectedProfiles.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 font-semibold text-sm">{t.fullNameLabel}</th>
                  <th className="text-center p-2 font-semibold text-sm">{t.lifePathTitle}</th>
                  <th className="text-center p-2 font-semibold text-sm">{t.destinyTitle}</th>
                  <th className="text-center p-2 font-semibold text-sm">{t.soulUrgeTitle}</th>
                  <th className="text-center p-2 font-semibold text-sm">{t.personalityTitle}</th>
                </tr>
              </thead>
              <tbody>
                {selectedProfiles.map((profile) => {
                  const numbers = calculateProfileNumbers(profile);
                  return (
                    <tr key={profile.id} className="border-b border-border/50">
                      <td className="p-2">
                        <div className="font-medium">{profile.fullName}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(profile.birthDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="text-center p-2">
                        <Badge variant="outline" className="number-display">
                          {numbers.lifePath}
                        </Badge>
                      </td>
                      <td className="text-center p-2">
                        <Badge variant="outline" className="number-display">
                          {numbers.destiny}
                        </Badge>
                      </td>
                      <td className="text-center p-2">
                        <Badge variant="outline" className="number-display">
                          {numbers.soulUrge}
                        </Badge>
                      </td>
                      <td className="text-center p-2">
                        <Badge variant="outline" className="number-display">
                          {numbers.personality}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {selectedProfiles.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            {t.selectProfilesToCompare}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

