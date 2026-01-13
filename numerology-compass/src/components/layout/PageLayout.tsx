import { ReactNode } from 'react';
import { StarField } from '@/components/StarField';
import AppHeader from './AppHeader';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export const PageLayout = ({ children, className = '' }: PageLayoutProps) => {
  return (
    <div className="min-h-screen relative">
      <StarField />
      <AppHeader />
      <div className={`pt-16 ${className}`}>
        {children}
      </div>
    </div>
  );
};

