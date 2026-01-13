import { useState } from 'react';
import { User, Check, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfiles } from '@/hooks/use-profiles';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProfileSwitcherProps {
  className?: string;
  onProfileSwitch?: (profileId: string) => void;
}

export const ProfileSwitcher = ({ className, onProfileSwitch }: ProfileSwitcherProps) => {
  const { t } = useLanguage();
  const { profiles, activeProfile, switchProfile, loading } = useProfiles();
  const { toast } = useToast();
  const [switching, setSwitching] = useState(false);

  const handleSwitch = async (profileId: string) => {
    if (profileId === activeProfile?.id) return;

    setSwitching(true);
    try {
      const result = await switchProfile(profileId);
      if (result.success) {
        toast({
          title: t.profileSwitched,
        });
        onProfileSwitch?.(profileId);
      } else {
        toast({
          title: t.error,
          description: result.error || t.switchProfileError,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: t.error,
        description: t.switchProfileError,
        variant: 'destructive',
      });
    } finally {
      setSwitching(false);
    }
  };

  if (loading) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{t.loading || 'Loading...'}</span>
      </div>
    );
  }

  if (!profiles.length) {
    return null;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <User className="h-4 w-4 text-primary" />
      <Select
        value={activeProfile?.id || ''}
        onValueChange={handleSwitch}
        disabled={switching || profiles.length === 0}
      >
        <SelectTrigger className="w-[200px] input-mystic">
          <SelectValue placeholder={t.selectProfile}>
            {activeProfile ? (
              <div className="flex items-center gap-2">
                <span className="truncate">{activeProfile.fullName}</span>
                {activeProfile.isActive && (
                  <Check className="h-3 w-3 text-primary" />
                )}
              </div>
            ) : (
              t.selectProfile
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {profiles.map((profile) => (
            <SelectItem
              key={profile.id}
              value={profile.id}
              className={cn(
                "cursor-pointer",
                profile.isActive && "bg-primary/10"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className="truncate">{profile.fullName}</span>
                {profile.isActive && (
                  <Check className="h-4 w-4 text-primary ml-2" />
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {switching && (
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
      )}
    </div>
  );
};

