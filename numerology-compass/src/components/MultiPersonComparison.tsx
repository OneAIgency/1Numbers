import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { MultiPersonComparison as MultiPersonComparisonType } from "@/lib/multiPersonCompatibility";
import { Users, TrendingUp, TrendingDown, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiPersonComparisonProps {
  comparison: MultiPersonComparisonType;
}

export const MultiPersonComparison = ({ comparison }: MultiPersonComparisonProps) => {
  const { language, t } = useLanguage();
  const [expandedPairs, setExpandedPairs] = useState<Set<string>>(new Set());

  const togglePair = (pairId: string) => {
    const newExpanded = new Set(expandedPairs);
    if (newExpanded.has(pairId)) {
      newExpanded.delete(pairId);
    } else {
      newExpanded.add(pairId);
    }
    setExpandedPairs(newExpanded);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-400";
    if (score >= 70) return "text-primary";
    if (score >= 55) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 85) return "default";
    if (score >= 70) return "secondary";
    if (score >= 55) return "outline";
    return "destructive";
  };

  const getPersonName = (id: string) => {
    return comparison.people.find(p => p.id === id)?.fullName || id;
  };

  return (
    <Card className="card-mystic">
      <CardHeader>
        <CardTitle className="font-cinzel text-primary flex items-center gap-2">
          <Users className="h-5 w-5" />
          {t.compatibility?.multiPersonComparison || "Comparație Multi-Persoană"}
        </CardTitle>
        <CardDescription>
          {comparison.people.length} {t.compatibility?.people || "persoane"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-card/50 border border-border/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {t.compatibility?.averageCompatibility || "Compatibilitate Medie"}
              </span>
              <Badge variant={getScoreBadgeVariant(comparison.averageCompatibility)} className="text-lg">
                {comparison.averageCompatibility}%
              </Badge>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-card/50 border border-border/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {t.compatibility?.groupHarmony || "Armonie Grup"}
              </span>
              <Badge variant={getScoreBadgeVariant(comparison.groupHarmony)} className="text-lg">
                {comparison.groupHarmony}%
              </Badge>
            </div>
          </div>
        </div>

        {/* Strongest Pairs */}
        {comparison.strongestPairs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-500">
              <TrendingUp className="h-5 w-5" />
              <h3 className="font-cinzel text-lg text-foreground">
                {t.compatibility?.strongestPairs || "Perechi Cele Mai Puternice"}
              </h3>
            </div>
            <div className="space-y-2">
              {comparison.strongestPairs.map((pair, idx) => {
                const pairId = `${pair.person1Id}-${pair.person2Id}`;
                const isExpanded = expandedPairs.has(pairId);
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-card/50 border border-border/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground">
                            {getPersonName(pair.person1Id)} & {getPersonName(pair.person2Id)}
                          </span>
                          <Badge variant={getScoreBadgeVariant(pair.compatibility.overallScore)}>
                            {pair.compatibility.overallScore}%
                          </Badge>
                        </div>
                        {isExpanded && (
                          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">{t.lifePathTitle}: </span>
                              {pair.compatibility.lifePathCompatibility.score}%
                            </div>
                            <div>
                              <span className="font-medium">{t.destinyTitle}: </span>
                              {pair.compatibility.destinyCompatibility.score}%
                            </div>
                            <div>
                              <span className="font-medium">{t.soulUrgeTitle}: </span>
                              {pair.compatibility.soulUrgeCompatibility.score}%
                            </div>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePair(pairId)}
                        className="ml-2"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Weakest Pairs */}
        {comparison.weakestPairs.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-500">
              <TrendingDown className="h-5 w-5" />
              <h3 className="font-cinzel text-lg text-foreground">
                {t.compatibility?.weakestPairs || "Perechi Care Necesită Atenție"}
              </h3>
            </div>
            <div className="space-y-2">
              {comparison.weakestPairs.map((pair, idx) => {
                const pairId = `${pair.person1Id}-${pair.person2Id}`;
                const isExpanded = expandedPairs.has(pairId);
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-card/50 border border-border/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-foreground">
                            {getPersonName(pair.person1Id)} & {getPersonName(pair.person2Id)}
                          </span>
                          <Badge variant={getScoreBadgeVariant(pair.compatibility.overallScore)}>
                            {pair.compatibility.overallScore}%
                          </Badge>
                        </div>
                        {isExpanded && (
                          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">{t.lifePathTitle}: </span>
                              {pair.compatibility.lifePathCompatibility.score}%
                            </div>
                            <div>
                              <span className="font-medium">{t.destinyTitle}: </span>
                              {pair.compatibility.destinyCompatibility.score}%
                            </div>
                            <div>
                              <span className="font-medium">{t.soulUrgeTitle}: </span>
                              {pair.compatibility.soulUrgeCompatibility.score}%
                            </div>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePair(pairId)}
                        className="ml-2"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {comparison.recommendations[language].length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-purple-500">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-cinzel text-lg text-foreground">
                {t.compatibility?.groupRecommendations || "Recomandări pentru Grup"}
              </h3>
            </div>
            <ul className="space-y-2">
              {comparison.recommendations[language].map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

