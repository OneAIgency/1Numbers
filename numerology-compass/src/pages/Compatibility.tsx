import { useState, useEffect } from "react";
import { Heart, Users, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/hooks/use-profile";
import { 
  calculateCompatibility, 
  getCompatibilityLevel, 
  CompatibilityResult,
  RelationshipType,
  calculateRomanticCompatibility,
  calculateFriendshipCompatibility,
  calculateProfessionalCompatibility,
  calculateFamilyCompatibility,
  DetailedCompatibilityResult
} from "@/lib/compatibility";
import { RelationshipTypeSelector } from "@/components/RelationshipTypeSelector";
import { RelationshipDynamicsCard } from "@/components/RelationshipDynamicsCard";
import { ShareButtons } from "@/components/ShareButtons";
import { generateCompatibilityLink } from "@/lib/sharing";
import { format } from "date-fns";
import { ro, enUS, ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonData {
  fullName: string;
  birthDate: Date | undefined;
}

const locales = { ro, en: enUS, ru };

const Compatibility = () => {
  const { language, t } = useLanguage();
  const { profileData, hasProfile } = useProfile();
  const [person1, setPerson1] = useState<PersonData>({ fullName: "", birthDate: undefined });
  const [person2, setPerson2] = useState<PersonData>({ fullName: "", birthDate: undefined });
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [detailedResult, setDetailedResult] = useState<DetailedCompatibilityResult | null>(null);
  const [relationshipType, setRelationshipType] = useState<RelationshipType>("romantic");
  const [isCalendar1Open, setIsCalendar1Open] = useState(false);
  const [isCalendar2Open, setIsCalendar2Open] = useState(false);

  // Load profile data for person1
  useEffect(() => {
    if (hasProfile && profileData && !person1.fullName && !person1.birthDate) {
      setPerson1({
        fullName: profileData.fullName,
        birthDate: profileData.birthDate,
      });
    }
  }, [hasProfile, profileData, person1]);

  const dateLocale = locales[language];
  const currentYear = new Date().getFullYear();

  const canCalculate = person1.fullName.trim() && person1.birthDate && person2.fullName.trim() && person2.birthDate;

  const handleCalculate = () => {
    if (person1.birthDate && person2.birthDate) {
      const baseCompatibility = calculateCompatibility(
        { fullName: person1.fullName, birthDate: person1.birthDate },
        { fullName: person2.fullName, birthDate: person2.birthDate }
      );
      setResult(baseCompatibility);

      // Calculate detailed compatibility based on relationship type
      let detailed: DetailedCompatibilityResult;
      switch (relationshipType) {
        case "romantic":
          detailed = calculateRomanticCompatibility(
            { fullName: person1.fullName, birthDate: person1.birthDate },
            { fullName: person2.fullName, birthDate: person2.birthDate }
          );
          break;
        case "friendship":
          detailed = calculateFriendshipCompatibility(
            { fullName: person1.fullName, birthDate: person1.birthDate },
            { fullName: person2.fullName, birthDate: person2.birthDate }
          );
          break;
        case "professional":
          detailed = calculateProfessionalCompatibility(
            { fullName: person1.fullName, birthDate: person1.birthDate },
            { fullName: person2.fullName, birthDate: person2.birthDate }
          );
          break;
        case "family":
          detailed = calculateFamilyCompatibility(
            { fullName: person1.fullName, birthDate: person1.birthDate },
            { fullName: person2.fullName, birthDate: person2.birthDate }
          );
          break;
        default:
          detailed = calculateRomanticCompatibility(
            { fullName: person1.fullName, birthDate: person1.birthDate },
            { fullName: person2.fullName, birthDate: person2.birthDate }
          );
      }
      setDetailedResult(detailed);
    }
  };

  const handleReset = () => {
    setPerson1({ fullName: "", birthDate: undefined });
    setPerson2({ fullName: "", birthDate: undefined });
    setResult(null);
    setDetailedResult(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-400";
    if (score >= 70) return "text-primary";
    if (score >= 55) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return "from-green-500/20 to-green-600/10 border-green-500/30";
    if (score >= 70) return "from-primary/20 to-primary/10 border-primary/30";
    if (score >= 55) return "from-amber-500/20 to-amber-600/10 border-amber-500/30";
    return "from-red-500/20 to-red-600/10 border-red-500/30";
  };

  return (
    <PageLayout>
      <PageHeader
        title={t.compatibilityTitle}
        subtitle={t.compatibilitySubtitle}
        badge={{
          icon: <Heart className="h-4 w-4 text-primary" />,
          label: t.compatibilityLabel
        }}
      />

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-16">
        <div className="max-w-4xl mx-auto pt-4">
          {!result ? (
            <div className="card-mystic rounded-2xl p-8 glow-gold-subtle max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Person 1 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <span className="text-primary font-cinzel text-sm">1</span>
                    </div>
                    <h3 className="font-cinzel text-lg text-foreground">{t.person1}</h3>
                  </div>
                  
                  {hasProfile && profileData && (
                    <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          <span className="text-xs text-foreground/80">
                            {t.useProfileData || "Use profile data"}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPerson1({
                            fullName: profileData.fullName,
                            birthDate: profileData.birthDate,
                          })}
                          className="h-7 text-xs"
                        >
                          {t.useProfileData || "Use"}
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label className="text-foreground/90 text-sm">{t.fullNameLabel}</Label>
                    <Input
                      value={person1.fullName}
                      onChange={(e) => setPerson1({ ...person1, fullName: e.target.value })}
                      placeholder={t.fullNamePlaceholder}
                      className="input-mystic"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-foreground/90 text-sm">{t.birthDateLabel}</Label>
                    <Popover open={isCalendar1Open} onOpenChange={setIsCalendar1Open}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal input-mystic",
                            !person1.birthDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                          {person1.birthDate
                            ? format(person1.birthDate, "d MMMM yyyy", { locale: dateLocale })
                            : t.birthDatePlaceholder}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-card border-border z-50">
                        <Calendar
                          mode="single"
                          selected={person1.birthDate}
                          onSelect={(date) => {
                            setPerson1({ ...person1, birthDate: date });
                            setIsCalendar1Open(false);
                          }}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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
                </div>

                {/* Person 2 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
                      <span className="text-accent-foreground font-cinzel text-sm">2</span>
                    </div>
                    <h3 className="font-cinzel text-lg text-foreground">{t.person2}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-foreground/90 text-sm">{t.fullNameLabel}</Label>
                    <Input
                      value={person2.fullName}
                      onChange={(e) => setPerson2({ ...person2, fullName: e.target.value })}
                      placeholder={t.fullNamePlaceholder}
                      className="input-mystic"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-foreground/90 text-sm">{t.birthDateLabel}</Label>
                    <Popover open={isCalendar2Open} onOpenChange={setIsCalendar2Open}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal input-mystic",
                            !person2.birthDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                          {person2.birthDate
                            ? format(person2.birthDate, "d MMMM yyyy", { locale: dateLocale })
                            : t.birthDatePlaceholder}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-card border-border z-50">
                        <Calendar
                          mode="single"
                          selected={person2.birthDate}
                          onSelect={(date) => {
                            setPerson2({ ...person2, birthDate: date });
                            setIsCalendar2Open(false);
                          }}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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
                </div>
              </div>

              {/* Relationship Type Selector */}
              <div className="my-6">
                <RelationshipTypeSelector
                  selectedType={relationshipType}
                  onTypeChange={setRelationshipType}
                />
              </div>

              {/* Heart divider */}
              <div className="flex items-center justify-center my-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <Heart className="mx-4 h-6 w-6 text-primary animate-pulse-glow" />
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              </div>

              <Button
                onClick={handleCalculate}
                disabled={!canCalculate}
                className="btn-mystic w-full h-14 text-lg"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {t.calculateCompatibility}
              </Button>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              {/* Names Header */}
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <span className="font-cinzel text-xl md:text-2xl text-foreground">{person1.fullName}</span>
                  <Heart className="h-6 w-6 text-primary animate-pulse-glow" />
                  <span className="font-cinzel text-xl md:text-2xl text-foreground">{person2.fullName}</span>
                </div>
              </div>

              {/* Overall Score */}
              <div className={cn(
                "card-mystic rounded-2xl p-8 text-center",
                "bg-gradient-to-br border",
                getScoreBg(result.overallScore)
              )}>
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {t.overallCompatibility}
                </span>
                <div className={cn(
                  "font-cinzel text-7xl md:text-8xl font-bold my-4",
                  getScoreColor(result.overallScore)
                )}>
                  {result.overallScore}%
                </div>
                <span className="font-cinzel text-xl text-foreground">
                  {t.compatibilityLevels[getCompatibilityLevel(result.overallScore)]}
                </span>
                <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
                  {t.compatibilityDescriptions[getCompatibilityLevel(result.overallScore)]}
                </p>
              </div>

              {/* Detailed Scores */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { 
                    title: t.lifePathTitle, 
                    data: result.lifePathCompatibility,
                    weight: "50%"
                  },
                  { 
                    title: t.destinyTitle, 
                    data: result.destinyCompatibility,
                    weight: "30%"
                  },
                  { 
                    title: t.soulUrgeTitle, 
                    data: result.soulUrgeCompatibility,
                    weight: "20%"
                  },
                ].map((item, i) => (
                  <div key={i} className="card-mystic rounded-xl p-5 text-center">
                    <span className="text-xs uppercase tracking-[0.15em] text-primary/70">
                      {item.title}
                    </span>
                    <div className="flex items-center justify-center gap-3 my-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center font-cinzel text-lg text-primary">
                        {item.data.person1}
                      </div>
                      <span className="text-muted-foreground">+</span>
                      <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center font-cinzel text-lg text-accent-foreground">
                        {item.data.person2}
                      </div>
                    </div>
                    <div className={cn("font-cinzel text-2xl font-bold", getScoreColor(item.data.score))}>
                      {item.data.score}%
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {t.weight}: {item.weight}
                    </span>
                  </div>
                ))}
              </div>

              {/* Relationship Dynamics Card */}
              {detailedResult && (
                <RelationshipDynamicsCard compatibility={detailedResult} />
              )}

              {/* Share Compatibility */}
              {result && (
                <div className="flex justify-center pt-4">
                  <ShareButtons
                    shareData={{
                      title: `${person1.fullName} & ${person2.fullName} - Compatibility`,
                      text: `Our compatibility score is ${result.overallScore}%!`,
                      url: generateCompatibilityLink({
                        person1Name: person1.fullName,
                        person2Name: person2.fullName,
                        compatibilityScore: result.overallScore
                      })
                    }}
                    compatibilityData={{
                      person1Name: person1.fullName,
                      person2Name: person2.fullName,
                      compatibilityScore: result.overallScore
                    }}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 pt-4">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Users className="mr-2 h-4 w-4" />
                  {t.tryAnotherPair}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      </PageLayout>
  );
};

export default Compatibility;
