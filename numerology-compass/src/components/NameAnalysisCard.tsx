import { useState } from "react";
import { ChevronDown, ChevronUp, Type, Eye, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  analyzeIndividualLetters,
  analyzeVowelsSeparately,
  analyzeConsonantsSeparately,
  findHiddenNumbers,
  getNameOptimizationSuggestions,
  type LetterAnalysis,
  type VowelAnalysis,
  type ConsonantAnalysis,
  type HiddenNumber,
} from "@/lib/nameAnalysis";
import { LetterAnalysisChart } from "./charts/LetterAnalysisChart";

interface NameAnalysisCardProps {
  fullName: string;
}

export const NameAnalysisCard = ({ fullName }: NameAnalysisCardProps) => {
  const { t, language } = useLanguage();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const letters = analyzeIndividualLetters(fullName);
  const vowels = analyzeVowelsSeparately(fullName);
  const consonants = analyzeConsonantsSeparately(fullName);
  const hiddenNumbers = findHiddenNumbers(fullName);
  const optimization = getNameOptimizationSuggestions(fullName, [1, 8, 11, 22], language as 'ro' | 'en' | 'ru');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <Card className="card-mystic">
      <CardHeader>
        <CardTitle className="font-cinzel text-primary flex items-center gap-2">
          <Type className="h-5 w-5" />
          {t.nameAnalysis?.title || "Analiză Completă a Numelui"}
        </CardTitle>
        <CardDescription>
          {t.nameAnalysis?.subtitle || "Analiză detaliată a fiecărei litere și a energiilor ascunse"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Letter Distribution Chart */}
        <div className="space-y-2">
          <h3 className="font-cinzel text-lg text-foreground flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            {t.nameAnalysis?.letterDistribution || "Distribuția Literelor"}
          </h3>
          <LetterAnalysisChart name={fullName} />
        </div>

        {/* Individual Letters Analysis */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => toggleSection('letters')}
            className="w-full justify-between"
          >
            <span className="font-cinzel text-foreground flex items-center gap-2">
              <Type className="h-4 w-4" />
              {t.nameAnalysis?.individualLetters || "Analiza Fiecărei Litere"}
            </span>
            {expandedSection === 'letters' ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          {expandedSection === 'letters' && (
            <div className="mt-4 p-4 rounded-lg bg-card/50 border border-border/30 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {letters.map((letter, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-md bg-primary/5 border border-primary/10 text-center"
                  >
                    <div className="font-cinzel text-lg text-primary">{letter.letter}</div>
                    <div className="text-xs text-muted-foreground">Valoare: {letter.value}</div>
                    {letter.isVowel && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {t.nameAnalysis?.vowel || "Vocală"}
                      </Badge>
                    )}
                    {letter.isConsonant && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {t.nameAnalysis?.consonant || "Consoană"}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Vowels and Consonants Analysis */}
        <Tabs defaultValue="vowels" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vowels">
              {t.nameAnalysis?.vowelsAnalysis || "Vocale"}
            </TabsTrigger>
            <TabsTrigger value="consonants">
              {t.nameAnalysis?.consonantsAnalysis || "Consoane"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="vowels" className="space-y-3 mt-4">
            <div className="p-4 rounded-lg bg-card/50 border border-border/30">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-cinzel text-lg text-primary">
                    {t.nameAnalysis?.soulUrgeNumber || "Numărul Sufletului"}: {vowels.soulUrgeNumber}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {vowels.vowels.length} {t.nameAnalysis?.vowels || "vocale"}
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg">
                  {vowels.totalValue}
                </Badge>
              </div>
              <p className="text-sm text-foreground/80 mb-3">
                {vowels.interpretation[language]}
              </p>
              <div className="flex flex-wrap gap-2">
                {vowels.strengths[language].map((strength, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="consonants" className="space-y-3 mt-4">
            <div className="p-4 rounded-lg bg-card/50 border border-border/30">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-cinzel text-lg text-primary">
                    {t.nameAnalysis?.personalityNumber || "Numărul Personalității"}: {consonants.personalityNumber}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {consonants.consonants.length} {t.nameAnalysis?.consonants || "consoane"}
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg">
                  {consonants.totalValue}
                </Badge>
              </div>
              <p className="text-sm text-foreground/80 mb-3">
                {consonants.interpretation[language]}
              </p>
              <div className="flex flex-wrap gap-2">
                {consonants.characteristics[language].map((char, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {char}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Hidden Numbers */}
        {hiddenNumbers.length > 0 && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => toggleSection('hidden')}
              className="w-full justify-between"
            >
              <span className="font-cinzel text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {t.nameAnalysis?.hiddenNumbers || "Numere Ascunse"} ({hiddenNumbers.length})
              </span>
              {expandedSection === 'hidden' ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {expandedSection === 'hidden' && (
              <div className="mt-4 space-y-2">
                {hiddenNumbers.map((hidden, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-card/50 border border-border/30 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-cinzel text-lg text-primary">
                        {t.nameAnalysis?.number || "Număr"} {hidden.number}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {hidden.significance[language]}
                      </div>
                    </div>
                    <Badge
                      variant={
                        hidden.influence === 'strong'
                          ? 'default'
                          : hidden.influence === 'moderate'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {hidden.frequency}x
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Optimization Suggestions */}
        {optimization.suggestions.length > 0 && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => toggleSection('optimization')}
              className="w-full justify-between"
            >
              <span className="font-cinzel text-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {t.nameAnalysis?.optimizationSuggestions || "Sugestii de Optimizare"}
              </span>
              {expandedSection === 'optimization' ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {expandedSection === 'optimization' && (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-foreground/80">
                  {optimization.recommendations[language]}
                </p>
                {optimization.suggestions.slice(0, 3).map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-card/50 border border-border/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-cinzel text-lg text-primary">
                        {suggestion.name}
                      </div>
                      <Badge variant="secondary">
                        Score: {suggestion.overallScore}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {suggestion.reason[language]}
                    </p>
                    <div className="flex gap-2 text-xs">
                      <Badge variant="outline">
                        Destin: {suggestion.newAnalysis.destinyNumber}
                      </Badge>
                      <Badge variant="outline">
                        Suflet: {suggestion.newAnalysis.soulUrgeNumber}
                      </Badge>
                      <Badge variant="outline">
                        Personalitate: {suggestion.newAnalysis.personalityNumber}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

