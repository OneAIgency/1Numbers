import { useState } from "react";
import { Sparkles, Crown, Star } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const NumerologyGuide = () => {
  const { t } = useLanguage();
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const coreNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const masterNumbers = [11, 22, 33];

  const getMeaning = (num: number) => {
    return t.meanings[num as keyof typeof t.meanings];
  };

  return (
    <PageLayout>
      <PageHeader
        title={t.guideTitle}
        subtitle={t.guideSubtitle}
        badge={{
          icon: <Sparkles className="h-4 w-4 text-primary" />,
          label: t.guideLabel
        }}
      />

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-16">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* Core Numbers Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Star className="h-6 w-6 text-primary" />
              <h2 className="font-cinzel text-2xl text-foreground">{t.coreNumbersTitle}</h2>
            </div>
            <p className="text-muted-foreground max-w-3xl">
              {t.coreNumbersDesc}
            </p>
            
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
              {coreNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedNumber(selectedNumber === num ? null : num)}
                  className={cn(
                    "number-display cursor-pointer transition-all duration-300 hover:scale-110",
                    selectedNumber === num && "number-display-large glow-gold scale-110"
                  )}
                >
                  {num}
                </button>
              ))}
            </div>
          </section>

          {/* Master Numbers Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-primary" />
              <h2 className="font-cinzel text-2xl text-foreground">{t.masterNumbersTitle}</h2>
            </div>
            <p className="text-muted-foreground max-w-3xl">
              {t.masterNumbersDesc}
            </p>
            
            <div className="grid grid-cols-3 gap-4 max-w-md">
              {masterNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedNumber(selectedNumber === num ? null : num)}
                  className={cn(
                    "number-display cursor-pointer transition-all duration-300 hover:scale-110",
                    "border-2 border-primary/60",
                    selectedNumber === num && "number-display-large glow-gold scale-110"
                  )}
                >
                  {num}
                </button>
              ))}
            </div>
          </section>

          {/* Selected Number Detail */}
          {selectedNumber && (
            <section className="card-mystic rounded-2xl p-8 glow-gold-subtle animate-scale-in">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="number-display-large shrink-0 animate-float">
                  {selectedNumber}
                </div>
                
                <div className="flex-1 text-center md:text-left space-y-4">
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-primary/70">
                      {masterNumbers.includes(selectedNumber) ? t.masterNumber : t.coreNumber}
                    </span>
                    <h3 className="font-cinzel text-3xl text-foreground mt-1">
                      {getMeaning(selectedNumber).title}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {getMeaning(selectedNumber).traits.map((trait, index) => (
                      <span
                        key={index}
                        className="px-4 py-1.5 text-sm rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-foreground/90 leading-relaxed text-lg">
                    {getMeaning(selectedNumber).description}
                  </p>

                  {/* Extended description */}
                  <div className="pt-4 border-t border-border/30 space-y-3">
                    <h4 className="font-cinzel text-lg text-primary">{t.detailedAnalysis}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {t.extendedMeanings[selectedNumber as keyof typeof t.extendedMeanings]}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* All Numbers Grid */}
          <section className="space-y-6">
            <h2 className="font-cinzel text-2xl text-foreground text-center">{t.allNumbersTitle}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...coreNumbers, ...masterNumbers].map((num, index) => {
                const meaning = getMeaning(num);
                const isMaster = masterNumbers.includes(num);
                
                return (
                  <div
                    key={num}
                    className={cn(
                      "card-mystic rounded-xl p-5 opacity-0 animate-fade-in cursor-pointer",
                      "hover:glow-gold-subtle transition-all duration-300 hover:scale-[1.02]",
                      isMaster && "border-primary/40"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => setSelectedNumber(num)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center",
                        "bg-gradient-to-br from-primary/20 to-accent/20",
                        "border border-primary/30 font-cinzel text-xl text-primary",
                        isMaster && "border-2 border-primary/60"
                      )}>
                        {num}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-cinzel text-lg text-foreground truncate">
                            {meaning.title}
                          </h3>
                          {isMaster && (
                            <Crown className="h-4 w-4 text-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {meaning.traits.slice(0, 3).join(" • ")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-border/30">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground font-raleway">
            {t.footer}
          </p>
        </div>
      </footer>
    </PageLayout>
  );
};

export default NumerologyGuide;
