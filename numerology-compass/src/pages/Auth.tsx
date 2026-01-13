import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StarField } from '@/components/StarField';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const Auth = () => {
  const { language, t } = useLanguage();
  const { login, register, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const labels = {
    ro: {
      login: 'Autentificare',
      register: 'Înregistrare',
      email: 'Email',
      password: 'Parolă',
      confirmPassword: 'Confirmă parola',
      name: 'Nume complet',
      loginButton: 'Conectare',
      registerButton: 'Creează cont',
      switchToRegister: 'Nu ai cont? Înregistrează-te',
      switchToLogin: 'Ai deja cont? Conectează-te',
      welcome: 'Bine ai venit',
      createAccount: 'Creează un cont',
      loginSubtitle: 'Conectează-te pentru a-ți accesa profilul numerologic',
      registerSubtitle: 'Creează un cont pentru a-ți salva profilul numerologic',
      backToCalculator: 'Înapoi la Calculator',
      loginSuccess: 'Te-ai conectat cu succes!',
      registerSuccess: 'Contul a fost creat cu succes!',
      error: 'Eroare',
    },
    en: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
      name: 'Full name',
      loginButton: 'Sign In',
      registerButton: 'Create Account',
      switchToRegister: "Don't have an account? Register",
      switchToLogin: 'Already have an account? Sign in',
      welcome: 'Welcome Back',
      createAccount: 'Create Account',
      loginSubtitle: 'Sign in to access your numerology profile',
      registerSubtitle: 'Create an account to save your numerology profile',
      backToCalculator: 'Back to Calculator',
      loginSuccess: 'Successfully logged in!',
      registerSuccess: 'Account created successfully!',
      error: 'Error',
    },
    ru: {
      login: 'Вход',
      register: 'Регистрация',
      email: 'Эл. почта',
      password: 'Пароль',
      confirmPassword: 'Подтвердите пароль',
      name: 'Полное имя',
      loginButton: 'Войти',
      registerButton: 'Создать аккаунт',
      switchToRegister: 'Нет аккаунта? Зарегистрируйтесь',
      switchToLogin: 'Уже есть аккаунт? Войдите',
      welcome: 'С возвращением',
      createAccount: 'Создать аккаунт',
      loginSubtitle: 'Войдите для доступа к вашему нумерологическому профилю',
      registerSubtitle: 'Создайте аккаунт для сохранения вашего нумерологического профиля',
      backToCalculator: 'Назад к Калькулятору',
      loginSuccess: 'Вы успешно вошли!',
      registerSuccess: 'Аккаунт успешно создан!',
      error: 'Ошибка',
    }
  };

  const l = labels[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      if (isLoginMode) {
        const validated = loginSchema.parse(formData);
        const result = await login({ email: validated.email, password: validated.password });
        
        if (result.success) {
          toast({ title: l.loginSuccess });
          navigate('/');
        } else {
          toast({ title: l.error, description: result.error, variant: 'destructive' });
        }
      } else {
        const validated = registerSchema.parse(formData);
        const result = await register({ 
          email: validated.email, 
          password: validated.password,
          name: validated.name 
        });
        
        if (result.success) {
          toast({ title: l.registerSuccess });
          navigate('/');
        } else {
          toast({ title: l.error, description: result.error, variant: 'destructive' });
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4">
      <StarField />
      
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>


      <div className="relative z-10 w-full max-w-md">
        <div className="card-mystic rounded-2xl p-8 glow-gold-subtle">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-cinzel text-2xl text-foreground mb-2">
              {isLoginMode ? l.welcome : l.createAccount}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLoginMode ? l.loginSubtitle : l.registerSubtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground/90 font-raleway text-sm">
                  {l.name}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange('name')}
                    className="input-mystic h-12 pl-10"
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/90 font-raleway text-sm">
                {l.email}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  className="input-mystic h-12 pl-10"
                  placeholder="email@example.com"
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/90 font-raleway text-sm">
                {l.password}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange('password')}
                  className="input-mystic h-12 pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            {!isLoginMode && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground/90 font-raleway text-sm">
                  {l.confirmPassword}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    className="input-mystic h-12 pl-10"
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
              </div>
            )}

            <Button
              type="submit"
              className="btn-mystic w-full h-12 text-base mt-6"
              disabled={isLoading}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isLoginMode ? l.loginButton : l.registerButton}
            </Button>
          </form>

          {/* Switch mode */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setErrors({});
              }}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {isLoginMode ? l.switchToRegister : l.switchToLogin}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
