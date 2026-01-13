import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/services/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface Plan {
  id: number;
  name: string;
  displayName: string;
  description: string;
  priceMonthly: number;
  priceYearly: number | null;
  features: string[];
  isActive: boolean;
}

export const SubscriptionPlans = () => {
  const { t, language } = useLanguage();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await api.getSubscriptionPlans();
      if (response.success) {
        setPlans(response.plans as Plan[]);
      }
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: number) => {
    try {
      setSelectedPlan(planId);
      const response = await api.createSubscription({
        planId,
        billingPeriod
      });

      if (response.success) {
        // Handle success (redirect to payment, show success message, etc.)
        window.location.href = '/premium?success=true';
      }
    } catch (error) {
      console.error('Error subscribing:', error);
    } finally {
      setSelectedPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-32 bg-muted rounded" />
              <div className="h-4 w-48 bg-muted rounded mt-2" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-24 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const translations: Record<string, Record<string, string>> = {
    ro: {
      monthly: 'Lunar',
      yearly: 'Anual',
      subscribe: 'Abonează-te',
      current: 'Planul tău',
      mostPopular: 'Cel mai popular',
      features: 'Caracteristici',
      save: 'Economisește',
      perMonth: '/lună',
      perYear: '/an'
    },
    en: {
      monthly: 'Monthly',
      yearly: 'Yearly',
      subscribe: 'Subscribe',
      current: 'Your plan',
      mostPopular: 'Most popular',
      features: 'Features',
      save: 'Save',
      perMonth: '/month',
      perYear: '/year'
    },
    ru: {
      monthly: 'Ежемесячно',
      yearly: 'Ежегодно',
      subscribe: 'Подписаться',
      current: 'Ваш план',
      mostPopular: 'Самый популярный',
      features: 'Возможности',
      save: 'Сэкономить',
      perMonth: '/месяц',
      perYear: '/год'
    }
  };

  const tr = translations[language] || translations.en;

  return (
    <div className="space-y-6">
      {/* Billing Period Toggle */}
      <div className="flex justify-center gap-4">
        <Button
          variant={billingPeriod === 'monthly' ? 'default' : 'outline'}
          onClick={() => setBillingPeriod('monthly')}
        >
          {tr.monthly}
        </Button>
        <Button
          variant={billingPeriod === 'yearly' ? 'default' : 'outline'}
          onClick={() => setBillingPeriod('yearly')}
        >
          {tr.yearly} {tr.save}
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => {
          const price = billingPeriod === 'monthly' ? plan.priceMonthly : (plan.priceYearly || plan.priceMonthly * 12);
          const isPopular = plan.name === 'premium';
          const isFree = plan.name === 'free';

          return (
            <Card
              key={plan.id}
              className={`relative ${isPopular ? 'border-primary border-2' : ''}`}
            >
              {isPopular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  {tr.mostPopular}
                </Badge>
              )}
              
              <CardHeader>
                <CardTitle>{plan.displayName}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ${price.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">
                    {billingPeriod === 'monthly' ? tr.perMonth : tr.perYear}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-sm">{tr.features}:</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={isPopular ? 'default' : 'outline'}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isFree || selectedPlan === plan.id}
                >
                  {isFree ? tr.current : selectedPlan === plan.id ? '...' : tr.subscribe}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

