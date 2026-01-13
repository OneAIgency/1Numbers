import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Heart, TrendingUp, GraduationCap, HelpCircle, Wrench, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeSelector } from '@/components/ThemeSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
  mobileLabel?: string;
}

const AppHeader = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { path: '/guide', icon: BookOpen, labelKey: 'viewGuide', mobileLabel: 'Guide' },
    { path: '/compatibility', icon: Heart, labelKey: 'viewCompatibility', mobileLabel: 'Compatibility' },
    { path: '/predictions', icon: TrendingUp, labelKey: 'predictions', mobileLabel: 'Predictions' },
    { path: '/tools', icon: Wrench, labelKey: 'tools', mobileLabel: 'Tools' },
    { path: '/tutorials', icon: GraduationCap, labelKey: 'tutorials', mobileLabel: 'Tutorials' },
    { path: '/faq', icon: HelpCircle, labelKey: 'faq', mobileLabel: 'FAQ' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Home */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md group-hover:bg-primary/30 transition-colors" />
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center">
                <span className="text-primary-foreground font-cinzel font-bold text-lg">N</span>
              </div>
            </div>
            <span className="hidden sm:inline font-cinzel text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {t.title}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-9 px-3 gap-2 font-raleway text-sm transition-all",
                      active
                        ? "bg-primary/10 text-primary border-b-2 border-primary"
                        : "text-foreground/90 hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{(t[item.labelKey as keyof typeof t] as string) || item.mobileLabel}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Profile / Auth */}
            {isAuthenticated ? (
              <Link to="/profile">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-9 px-3 gap-2 font-raleway text-sm",
                    isActive('/profile')
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/90 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.myProfile}</span>
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-3 gap-2 font-raleway text-sm text-foreground/90 hover:text-primary hover:bg-primary/5"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.login}</span>
                </Button>
              </Link>
            )}

            {/* Theme Selector */}
            <ThemeSelector />

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden h-9 w-9 p-0 text-foreground/90"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/50 py-4 animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-10 px-4 gap-3 font-raleway text-sm",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/90 hover:text-primary hover:bg-primary/5"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{t[item.labelKey as keyof typeof t] || item.mobileLabel}</span>
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;

