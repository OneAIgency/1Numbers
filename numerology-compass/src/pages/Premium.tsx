import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionPlans } from '@/components/SubscriptionPlans';
import { AIConsultant } from '@/components/AIConsultant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Crown, Sparkles, FileText, Zap } from 'lucide-react';
import { api } from '@/services/api';
import { PageLayout } from '@/components/layout/PageLayout';

const Premium = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    isPremium: boolean;
    planName: string;
    status: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptionStatus();
  }, []);

  const loadSubscriptionStatus = async () => {
    try {
      const response = await api.checkSubscription();
      if (response.success) {
        setSubscriptionStatus({
          isPremium: response.isPremium,
          planName: response.planName,
          status: response.status
        });
      }
    } catch (error) {
      console.error('Error loading subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const translations: Record<string, Record<string, string>> = {
    ro: {
      title: 'Premium',
      subtitle: 'Deblochează funcționalități avansate',
      plans: 'Planuri de Abonare',
      aiConsultant: 'Consultant AI',
      features: 'Caracteristici Premium',
      currentPlan: 'Planul tău actual',
      upgrade: 'Upgrade',
      premiumFeatures: 'Funcționalități Premium',
      advancedReports: 'Rapoarte Avansate',
      aiConsultantDesc: 'Consultant AI pentru întrebări numerologice',
      unlimitedAccess: 'Acces Nelimitat',
      prioritySupport: 'Suport Priorititar',
      exportPDF: 'Export PDF',
      customReports: 'Rapoarte Personalizate'
    },
    en: {
      title: 'Premium',
      subtitle: 'Unlock advanced features',
      plans: 'Subscription Plans',
      aiConsultant: 'AI Consultant',
      features: 'Premium Features',
      currentPlan: 'Your current plan',
      upgrade: 'Upgrade',
      premiumFeatures: 'Premium Features',
      advancedReports: 'Advanced Reports',
      aiConsultantDesc: 'AI consultant for numerology questions',
      unlimitedAccess: 'Unlimited Access',
      prioritySupport: 'Priority Support',
      exportPDF: 'PDF Export',
      customReports: 'Custom Reports'
    },
    ru: {
      title: 'Премиум',
      subtitle: 'Разблокировать расширенные функции',
      plans: 'Планы подписки',
      aiConsultant: 'ИИ Консультант',
      features: 'Премиум функции',
      currentPlan: 'Ваш текущий план',
      upgrade: 'Обновить',
      premiumFeatures: 'Премиум функции',
      advancedReports: 'Расширенные отчеты',
      aiConsultantDesc: 'ИИ консультант для нумерологических вопросов',
      unlimitedAccess: 'Неограниченный доступ',
      prioritySupport: 'Приоритетная поддержка',
      exportPDF: 'Экспорт PDF',
      customReports: 'Пользовательские отчеты'
    }
  };

  const tr = translations[language] || translations.en;

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Crown className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">{tr.title}</h1>
          </div>
          <p className="text-xl text-muted-foreground">{tr.subtitle}</p>
        </div>

        {/* Current Subscription Status */}
        {!loading && subscriptionStatus && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{tr.currentPlan}</p>
                  <p className="text-2xl font-bold capitalize">{subscriptionStatus.planName}</p>
                </div>
                {!subscriptionStatus.isPremium && (
                  <Badge variant="outline" className="text-sm">
                    {tr.upgrade}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="plans" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plans">{tr.plans}</TabsTrigger>
            <TabsTrigger value="consultant">{tr.aiConsultant}</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-6">
            <SubscriptionPlans />
            
            {/* Premium Features List */}
            <Card>
              <CardHeader>
                <CardTitle>{tr.premiumFeatures}</CardTitle>
                <CardDescription>Tot ce primești cu un abonament Premium</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">{tr.advancedReports}</p>
                      <p className="text-sm text-muted-foreground">
                        Rapoarte profesionale cu interpretări detaliate
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">{tr.aiConsultant}</p>
                      <p className="text-sm text-muted-foreground">
                        {tr.aiConsultantDesc}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">{tr.unlimitedAccess}</p>
                      <p className="text-sm text-muted-foreground">
                        Fără limitări de utilizare
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Crown className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold">{tr.prioritySupport}</p>
                      <p className="text-sm text-muted-foreground">
                        Suport priorititar pentru întrebări
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultant">
            {subscriptionStatus?.isPremium ? (
              <AIConsultant />
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Crown className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    {tr.aiConsultant} este disponibil doar pentru utilizatorii Premium.
                  </p>
                  <a href="#plans" className="text-primary hover:underline">
                    Vezi planurile de abonare
                  </a>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Premium;

