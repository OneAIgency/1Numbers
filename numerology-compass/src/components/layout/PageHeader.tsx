import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: { icon: ReactNode; label: string };
  showBack?: boolean;
  backTo?: string;
  backLabel?: string;
  className?: string;
}

export const PageHeader = ({
  title,
  subtitle,
  badge,
  showBack = false,
  backTo = '/',
  backLabel,
  className = '',
}: PageHeaderProps) => {
  const { t } = useLanguage();

  return (
    <header className={`relative z-10 py-8 px-4 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {showBack && (
          <Link to={backTo} className="inline-block mb-6">
            <Button
              variant="ghost"
              className="text-foreground/90 hover:text-primary hover:bg-primary/10 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{backLabel || t.backToCalculator}</span>
            </Button>
          </Link>
        )}

        <div className="text-center">
          {badge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
              {badge.icon}
              <span className="text-sm font-raleway text-primary font-medium">
                {badge.label}
              </span>
            </div>
          )}

          <h1 className="font-cinzel text-3xl md:text-4xl lg:text-5xl text-gradient-gold mb-3 font-bold">
            {title}
          </h1>

          {subtitle && (
            <p className="font-raleway text-lg text-foreground/90 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
};

