import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ro, enUS, ru } from "date-fns/locale";
import { CalendarIcon, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";

interface NumerologyFormProps {
  onCalculate: (data: { fullName: string; birthDate: Date }) => void;
  profileData?: { fullName: string; birthDate: Date } | null;
}

const locales = { ro, en: enUS, ru };

export const NumerologyForm = ({ onCalculate, profileData }: NumerologyFormProps) => {
  const { language, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (profileData) {
      setFullName(profileData.fullName);
      setBirthDate(profileData.birthDate);
    }
  }, [profileData]);

  const handleUseProfile = () => {
    if (profileData) {
      onCalculate({ fullName: profileData.fullName, birthDate: profileData.birthDate });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim() && birthDate) {
      onCalculate({ fullName: fullName.trim(), birthDate });
    }
  };

  const currentYear = new Date().getFullYear();
  const dateLocale = locales[language];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isAuthenticated && profileData && (
        <div className="mb-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground/80">
                {t.useProfileData || "Use profile data"}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleUseProfile}
              className="h-8"
            >
              {t.useProfileData || "Use"}
            </Button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-foreground/90 font-raleway text-sm tracking-wide">
          {t.fullNameLabel}
        </Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder={t.fullNamePlaceholder}
          className="input-mystic h-12 text-base"
          required
        />
        <p className="text-xs text-muted-foreground">
          {t.fullNameHint}
        </p>
      </div>

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
                !birthDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
              {birthDate ? (
                format(birthDate, "d MMMM yyyy", { locale: dateLocale })
              ) : (
                <span>{t.birthDatePlaceholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-card border-border z-50" align="start">
            <Calendar
              mode="single"
              selected={birthDate}
              onSelect={(date) => {
                setBirthDate(date);
                setIsCalendarOpen(false);
              }}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
              className="pointer-events-auto"
              captionLayout="dropdown-buttons"
              fromYear={1920}
              toYear={currentYear}
              locale={dateLocale}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button
        type="submit"
        className="btn-mystic w-full h-14 text-lg"
        disabled={!fullName.trim() || !birthDate}
      >
        <Sparkles className="mr-2 h-5 w-5" />
        {t.calculateButton}
      </Button>
    </form>
  );
};
