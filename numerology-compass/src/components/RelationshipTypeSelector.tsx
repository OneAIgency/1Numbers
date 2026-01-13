import { Heart, Users, Briefcase, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { RelationshipType } from "@/lib/compatibility";
import { cn } from "@/lib/utils";

interface RelationshipTypeSelectorProps {
  selectedType: RelationshipType;
  onTypeChange: (type: RelationshipType) => void;
}

const relationshipTypes: {
  type: RelationshipType;
  icon: React.ReactNode;
  label: { ro: string; en: string; ru: string };
}[] = [
  {
    type: "romantic",
    icon: <Heart className="h-4 w-4" />,
    label: { ro: "Romantică", en: "Romantic", ru: "Романтическая" },
  },
  {
    type: "friendship",
    icon: <Users className="h-4 w-4" />,
    label: { ro: "Prietenie", en: "Friendship", ru: "Дружба" },
  },
  {
    type: "professional",
    icon: <Briefcase className="h-4 w-4" />,
    label: { ro: "Profesională", en: "Professional", ru: "Профессиональная" },
  },
  {
    type: "family",
    icon: <Home className="h-4 w-4" />,
    label: { ro: "Familie", en: "Family", ru: "Семейная" },
  },
];

export const RelationshipTypeSelector = ({
  selectedType,
  onTypeChange,
}: RelationshipTypeSelectorProps) => {
  const { language, t } = useLanguage();

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        {t.compatibility?.relationshipType || "Tipul Relației"}
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {relationshipTypes.map(({ type, icon, label }) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            onClick={() => onTypeChange(type)}
            className={cn(
              "flex flex-col items-center gap-2 h-auto py-3",
              selectedType === type
                ? "bg-primary text-primary-foreground border-primary"
                : "hover:bg-primary/10"
            )}
          >
            {icon}
            <span className="text-xs font-medium">{label[language]}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

