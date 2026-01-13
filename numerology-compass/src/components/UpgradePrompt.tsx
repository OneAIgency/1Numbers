import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradePromptProps {
  feature?: string;
  onUpgrade?: () => void;
  variant?: 'default' | 'inline' | 'banner';
}

export const UpgradePrompt = ({ feature, onUpgrade, variant = 'default' }: UpgradePromptProps) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      navigate('/premium');
    }
  };

  const translations: Record<string, Record<string, string>> = {
    ro: {
      title: 'Funcționalitate Premium',
      description: 'Această funcționalitate necesită un abonament Premium.',
      upgrade: 'Upgrade la Premium',
      unlock: 'Deblochează funcționalități avansate',
      features: 'Caracteristici Premium',
      getStarted: 'Începe acum'
    },
    en: {
      title: 'Premium Feature',
      description: 'This feature requires a Premium subscription.',
      upgrade: 'Upgrade to Premium',
      unlock: 'Unlock advanced features',
      features: 'Premium Features',
      getStarted: 'Get Started'
    },
    ru: {
      title: 'Премиум функция',
      description: 'Эта функция требует премиум подписки.',
      upgrade: 'Обновить до Премиум',
      unlock: 'Разблокировать расширенные функции',
      features: 'Премиум функции',
      getStarted: 'Начать'
    }
  };

  const tr = translations[language] || translations.en;

  if (variant === 'inline') {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Crown className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-sm mb-1">{tr.title}</p>
              <p className="text-sm text-muted-foreground mb-3">{tr.description}</p>
              <Button size="sm" onClick={handleUpgrade}>
                {tr.upgrade}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold text-sm">{tr.unlock}</p>
              <p className="text-xs text-muted-foreground">{tr.description}</p>
            </div>
          </div>
          <Button size="sm" onClick={handleUpgrade}>
            {tr.upgrade}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="text-center">
      <CardHeader>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Crown className="h-8 w-8 text-primary" />
        </div>
        <CardTitle>{tr.title}</CardTitle>
        <CardDescription>{tr.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="flex items-start gap-2">
            <Zap className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Rapoarte Avansate</p>
              <p className="text-xs text-muted-foreground">Interpretări profesionale</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Sparkles className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Consultant AI</p>
              <p className="text-xs text-muted-foreground">Răspunsuri personalizate</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Crown className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Acces Nelimitat</p>
              <p className="text-xs text-muted-foreground">Fără restricții</p>
            </div>
          </div>
        </div>
        <Button onClick={handleUpgrade} className="w-full">
          {tr.getStarted}
        </Button>
      </CardContent>
    </Card>
  );
};

