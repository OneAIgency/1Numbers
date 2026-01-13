import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ro, enUS, ru } from 'date-fns/locale';
import { CalendarIcon, Save, Trash2, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useProfiles } from '@/hooks/use-profiles';
import { ProfileSwitcher } from '@/components/ProfileSwitcher';
import { ProfileComparison } from '@/components/ProfileComparison';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/layout/PageHeader';

const locales = { ro, en: enUS, ru };

interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  birthDate: string;
  birthTime?: string;
  birthPlace?: string;
  createdAt: string;
  updatedAt: string;
}

const Profile = () => {
  const { language, t } = useLanguage();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profiles, activeProfile, createProfile, updateProfile, deleteProfile, refetch } = useProfiles();

  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingProfileId, setDeletingProfileId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: undefined as Date | undefined,
    birthTime: '',
    birthPlace: '',
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const dateLocale = locales[language];

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/auth');
        return;
      }
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (activeProfile) {
      // If editing this profile or no profile is being edited, show active profile data
      if (editingProfileId === activeProfile.id || !editingProfileId) {
        setFormData({
          fullName: activeProfile.fullName,
          birthDate: new Date(activeProfile.birthDate),
          birthTime: activeProfile.birthTime || '',
          birthPlace: activeProfile.birthPlace || '',
        });
        // Set editingProfileId to active profile if not already set
        if (!editingProfileId) {
          setEditingProfileId(activeProfile.id);
        }
      }
    } else if (!editingProfileId) {
      // No active profile and not editing - clear form
      setFormData({
        fullName: '',
        birthDate: undefined,
        birthTime: '',
        birthPlace: '',
      });
    }
  }, [activeProfile, editingProfileId]);

  const startEditing = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      setEditingProfileId(profileId);
      setFormData({
        fullName: profile.fullName,
        birthDate: new Date(profile.birthDate),
        birthTime: profile.birthTime || '',
        birthPlace: profile.birthPlace || '',
      });
    }
  };

  const startCreating = () => {
    setEditingProfileId(null);
    setFormData({
      fullName: '',
      birthDate: undefined,
      birthTime: '',
      birthPlace: '',
    });
  };

  const handleSave = async () => {
    if (!formData.fullName.trim() || !formData.birthDate) {
      toast({
        title: t.error,
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);
      // Format date as YYYY-MM-DD without timezone conversion
      const year = formData.birthDate.getFullYear();
      const month = String(formData.birthDate.getMonth() + 1).padStart(2, '0');
      const day = String(formData.birthDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      const data = {
        fullName: formData.fullName.trim(),
        birthDate: formattedDate,
        birthTime: formData.birthTime || undefined,
        birthPlace: formData.birthPlace || undefined,
      };

      if (editingProfileId) {
        // Update existing profile
        const result = await updateProfile(editingProfileId, data);
        if (result.success) {
          toast({
            title: t.profileSaved,
          });
          setEditingProfileId(null);
          await refetch();
        } else {
          toast({
            title: t.error,
            description: result.error || 'Failed to update profile',
            variant: 'destructive',
          });
        }
      } else {
        // Create new profile (set as active if it's the first one)
        const result = await createProfile({
          ...data,
          setAsActive: profiles.length === 0,
        });
        if (result.success) {
          toast({
            title: t.profileSaved,
          });
          await refetch();
        } else {
          toast({
            title: t.error,
            description: result.error || 'Failed to create profile',
            variant: 'destructive',
          });
        }
      }
    } catch (error: unknown) {
      console.error('Error saving profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save profile';
      toast({
        title: t.error,
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProfileId) return;

    try {
      const result = await deleteProfile(deletingProfileId);
      if (result.success) {
        toast({
          title: t.profileDeleted,
        });
        setShowDeleteDialog(false);
        setDeletingProfileId(null);
        if (editingProfileId === deletingProfileId) {
          setEditingProfileId(null);
          startCreating();
        }
        await refetch();
      } else {
        toast({
          title: t.error,
          description: result.error || 'Failed to delete profile',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast({
        title: t.error,
        description: 'Failed to delete profile',
        variant: 'destructive',
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40" />
          <div className="h-4 w-32 bg-primary/20 rounded" />
        </div>
      </div>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title={t.profilePageTitle}
        subtitle={t.profilePageSubtitle}
        badge={{
          icon: <User className="h-4 w-4 text-primary" />,
          label: t.myProfile
        }}
      />

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-16">
        <div className="max-w-4xl mx-auto pt-4 space-y-6">
          {/* Profile Switcher */}
          {profiles.length > 0 && (
            <div className="card-mystic rounded-2xl p-6 glow-gold-subtle">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t.allProfiles}</h3>
                <ProfileSwitcher onProfileSwitch={(id) => startEditing(id)} />
              </div>
              <div className="space-y-2">
                {profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      profile.isActive
                        ? "bg-primary/10 border-primary/30"
                        : "bg-muted/30 border-border/30"
                    )}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{profile.fullName}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(profile.birthDate).toLocaleDateString()}
                        {profile.isActive && (
                          <Badge variant="secondary" className="ml-2">
                            {t.activeProfile}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditing(profile.id)}
                      >
                        {t.editProfile}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setDeletingProfileId(profile.id);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={startCreating}
              >
                {t.createNewProfile}
              </Button>
            </div>
          )}

          {/* Profile Form */}
          <div className="card-mystic rounded-2xl p-8 glow-gold-subtle">
            {profiles.length === 0 && (
              <div className="mb-6 p-4 rounded-lg bg-muted/30 border border-border/30">
                <p className="text-sm text-muted-foreground text-center">
                  {t.profileNotCreated}
                </p>
              </div>
            )}

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground/90 font-raleway text-sm tracking-wide">
                  {t.fullNameLabel}
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder={t.fullNamePlaceholder}
                  className="input-mystic h-12 text-base"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {t.fullNameHint}
                </p>
              </div>

              {/* Birth Date */}
              <div className="space-y-2">
                <Label className="text-foreground/90 font-raleway text-sm tracking-wide">
                  {t.birthDateLabel}
                </Label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 input-mystic",
                        !formData.birthDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {formData.birthDate ? (
                        format(formData.birthDate, "d MMMM yyyy", { locale: dateLocale })
                      ) : (
                        <span>{t.birthDatePlaceholder}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card border-border z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.birthDate}
                      onSelect={(date) => {
                        setFormData({ ...formData, birthDate: date });
                        setIsCalendarOpen(false);
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className="pointer-events-auto"
                      captionLayout="dropdown-buttons"
                      fromYear={1920}
                      toYear={new Date().getFullYear()}
                      locale={dateLocale}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Birth Time */}
              <div className="space-y-2">
                <Label htmlFor="birthTime" className="text-foreground/90 font-raleway text-sm tracking-wide">
                  {t.birthTimeLabel}
                </Label>
                <Input
                  id="birthTime"
                  type="time"
                  value={formData.birthTime}
                  onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                  placeholder={t.birthTimePlaceholder}
                  className="input-mystic h-12 text-base"
                />
                <p className="text-xs text-muted-foreground">
                  {t.birthTimeHint}
                </p>
              </div>

              {/* Birth Place */}
              <div className="space-y-2">
                <Label htmlFor="birthPlace" className="text-foreground/90 font-raleway text-sm tracking-wide">
                  {t.birthPlaceLabel}
                </Label>
                <Input
                  id="birthPlace"
                  type="text"
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                  placeholder={t.birthPlacePlaceholder}
                  className="input-mystic h-12 text-base"
                />
                <p className="text-xs text-muted-foreground">
                  {t.birthPlaceHint}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="btn-mystic flex-1 h-12"
                  disabled={saving || !formData.fullName.trim() || !formData.birthDate}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : (editingProfileId ? t.editProfile : t.createProfile)}
                </Button>
                {editingProfileId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={startCreating}
                    className="h-12"
                  >
                    {t.cancel}
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Profile Comparison */}
          {profiles.length >= 2 && (
            <ProfileComparison />
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteProfile}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your profile? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteDialog(false);
              setDeletingProfileId(null);
            }}>
              {t.cancel}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              {t.deleteProfile}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};

export default Profile;

