import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, BookOpen, Lightbulb, Calculator, Users, TrendingUp, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

const FAQ = () => {
  const { language, t } = useLanguage();

  const labels = {
    ro: {
      title: 'Întrebări Frecvente',
      subtitle: 'Răspunsuri la cele mai comune întrebări despre numerologie',
      label: 'FAQ',
      backToCalculator: 'Înapoi la Calculator',
      categories: {
        basics: 'Concepte de Bază',
        calculations: 'Calcule',
        interpretation: 'Interpretare',
        practical: 'Aplicații Practice'
      },
      faqs: [
        {
          category: 'basics',
          question: 'Ce este numerologia?',
          answer: 'Numerologia este un sistem metafizic care studiază relația dintre numere și evenimentele din viață. Se bazează pe credința că numerele au vibrații specifice care influențează personalitatea și destinul nostru.'
        },
        {
          category: 'basics',
          question: 'Ce sistem folosiți pentru calcule?',
          answer: 'Folosim sistemul Pitagoreic, cel mai popular și utilizat sistem în numerologia occidentală. Acest sistem atribuie valori numerice de la 1 la 9 literelor alfabetului.'
        },
        {
          category: 'basics',
          question: 'Ce sunt numerele master?',
          answer: 'Numerele master (11, 22, 33) sunt considerate cele mai puternice în numerologie. Ele nu se reduc la o singură cifră și poartă o energie spirituală intensificată și un potențial extraordinar.'
        },
        {
          category: 'calculations',
          question: 'De ce trebuie să folosesc numele complet de la naștere?',
          answer: 'Numele de la naștere reprezintă vibrația completă cu care ai venit în această lume. Schimbările ulterioare de nume pot influența energia, dar nu înlocuiesc vibrația originală.'
        },
        {
          category: 'calculations',
          question: 'Cum se calculează Numărul Drumului Vieții?',
          answer: 'Numărul Drumului Vieții se calculează prin adunarea tuturor cifrelor din data nașterii (zi + lună + an) și reducerea sumei la o singură cifră sau număr master.'
        },
        {
          category: 'calculations',
          question: 'Ce diferență este între Numărul Destinului și Numărul Drumului Vieții?',
          answer: 'Numărul Drumului Vieții derivă din data nașterii și reprezintă calea ta în viață, în timp ce Numărul Destinului derivă din numele complet și arată talentele și abilitățile pe care le ai.'
        },
        {
          category: 'interpretation',
          question: 'Ce înseamnă dacă am mai multe numere identice?',
          answer: 'Când ai același număr în mai multe poziții (de exemplu, Drum al Vieții și Destin), energia acelui număr este amplificată în viața ta, oferind atât mai multe oportunități, cât și provocări în acel domeniu.'
        },
        {
          category: 'interpretation',
          question: 'Numerologia poate prezice viitorul?',
          answer: 'Numerologia nu prezice evenimente specifice, ci identifică tendințe energetice și cicluri. Te ajută să înțelegi potențialul și provocările diferitelor perioade, permițându-ți să iei decizii informate.'
        },
        {
          category: 'interpretation',
          question: 'Ce este Anul Personal?',
          answer: 'Anul Personal este un ciclu de 9 ani care influențează temele și oportunitățile anului curent. Se calculează folosind data nașterii și anul calendaristic actual.'
        },
        {
          category: 'practical',
          question: 'Cum pot folosi numerologia în viața de zi cu zi?',
          answer: 'Poți folosi numerologia pentru a înțelege mai bine relațiile, pentru a alege momente optime pentru decizii importante, pentru dezvoltare personală și pentru a naviga prin ciclurile vieții cu mai multă claritate.'
        },
        {
          category: 'practical',
          question: 'Compatibilitatea numerologică garantează succesul unei relații?',
          answer: 'Nu. Compatibilitatea numerologică oferă perspective asupra dinamicii dintre două persoane, dar succesul unei relații depinde de mult mai mulți factori, inclusiv comunicare, valori comune și efort reciproc.'
        },
        {
          category: 'practical',
          question: 'Pot să-mi schimb destinul prin schimbarea numelui?',
          answer: 'Schimbarea numelui poate adăuga noi vibrații în viața ta, dar nu șterge energia numelui original. Mulți numerologi recomandă să lucrezi cu energia existentă în loc să încerci să o schimbi.'
        }
      ]
    },
    en: {
      title: 'Frequently Asked Questions',
      subtitle: 'Answers to the most common questions about numerology',
      label: 'FAQ',
      backToCalculator: 'Back to Calculator',
      categories: {
        basics: 'Basic Concepts',
        calculations: 'Calculations',
        interpretation: 'Interpretation',
        practical: 'Practical Applications'
      },
      faqs: [
        {
          category: 'basics',
          question: 'What is numerology?',
          answer: 'Numerology is a metaphysical system that studies the relationship between numbers and life events. It is based on the belief that numbers have specific vibrations that influence our personality and destiny.'
        },
        {
          category: 'basics',
          question: 'What system do you use for calculations?',
          answer: 'We use the Pythagorean system, the most popular and widely used system in Western numerology. This system assigns numerical values from 1 to 9 to the letters of the alphabet.'
        },
        {
          category: 'basics',
          question: 'What are master numbers?',
          answer: 'Master numbers (11, 22, 33) are considered the most powerful in numerology. They are not reduced to a single digit and carry intensified spiritual energy and extraordinary potential.'
        },
        {
          category: 'calculations',
          question: 'Why should I use my full birth name?',
          answer: 'Your birth name represents the complete vibration you came into this world with. Later name changes may influence energy, but they do not replace the original vibration.'
        },
        {
          category: 'calculations',
          question: 'How is the Life Path Number calculated?',
          answer: 'The Life Path Number is calculated by adding all the digits in your birth date (day + month + year) and reducing the sum to a single digit or master number.'
        },
        {
          category: 'calculations',
          question: 'What is the difference between Destiny Number and Life Path Number?',
          answer: 'The Life Path Number derives from your birth date and represents your life path, while the Destiny Number derives from your full name and shows the talents and abilities you have.'
        },
        {
          category: 'interpretation',
          question: 'What does it mean if I have multiple identical numbers?',
          answer: 'When you have the same number in multiple positions (e.g., Life Path and Destiny), that number\'s energy is amplified in your life, offering both more opportunities and challenges in that area.'
        },
        {
          category: 'interpretation',
          question: 'Can numerology predict the future?',
          answer: 'Numerology does not predict specific events, but identifies energy trends and cycles. It helps you understand the potential and challenges of different periods, allowing you to make informed decisions.'
        },
        {
          category: 'interpretation',
          question: 'What is a Personal Year?',
          answer: 'Personal Year is a 9-year cycle that influences the themes and opportunities of the current year. It is calculated using your birth date and the current calendar year.'
        },
        {
          category: 'practical',
          question: 'How can I use numerology in everyday life?',
          answer: 'You can use numerology to better understand relationships, to choose optimal moments for important decisions, for personal development, and to navigate life cycles with more clarity.'
        },
        {
          category: 'practical',
          question: 'Does numerological compatibility guarantee relationship success?',
          answer: 'No. Numerological compatibility offers perspectives on the dynamics between two people, but relationship success depends on many more factors, including communication, shared values, and mutual effort.'
        },
        {
          category: 'practical',
          question: 'Can I change my destiny by changing my name?',
          answer: 'Changing your name can add new vibrations to your life, but it doesn\'t erase the original name\'s energy. Many numerologists recommend working with existing energy rather than trying to change it.'
        }
      ]
    },
    ru: {
      title: 'Часто Задаваемые Вопросы',
      subtitle: 'Ответы на самые распространённые вопросы о нумерологии',
      label: 'FAQ',
      backToCalculator: 'Назад к Калькулятору',
      categories: {
        basics: 'Основные Концепции',
        calculations: 'Расчёты',
        interpretation: 'Интерпретация',
        practical: 'Практическое Применение'
      },
      faqs: [
        {
          category: 'basics',
          question: 'Что такое нумерология?',
          answer: 'Нумерология — это метафизическая система, изучающая связь между числами и жизненными событиями. Она основана на вере в то, что числа имеют специфические вибрации, влияющие на нашу личность и судьбу.'
        },
        {
          category: 'basics',
          question: 'Какую систему вы используете для расчётов?',
          answer: 'Мы используем пифагорейскую систему — самую популярную в западной нумерологии. Эта система присваивает числовые значения от 1 до 9 буквам алфавита.'
        },
        {
          category: 'basics',
          question: 'Что такое мастер-числа?',
          answer: 'Мастер-числа (11, 22, 33) считаются самыми мощными в нумерологии. Они не сводятся к одной цифре и несут усиленную духовную энергию и экстраординарный потенциал.'
        },
        {
          category: 'calculations',
          question: 'Почему нужно использовать полное имя при рождении?',
          answer: 'Ваше имя при рождении представляет полную вибрацию, с которой вы пришли в этот мир. Последующие изменения имени могут влиять на энергию, но не заменяют исходную вибрацию.'
        },
        {
          category: 'calculations',
          question: 'Как рассчитывается Число Жизненного Пути?',
          answer: 'Число Жизненного Пути рассчитывается путём сложения всех цифр даты рождения (день + месяц + год) и сведения суммы к одной цифре или мастер-числу.'
        },
        {
          category: 'calculations',
          question: 'В чём разница между Числом Судьбы и Числом Жизненного Пути?',
          answer: 'Число Жизненного Пути происходит от даты рождения и представляет ваш жизненный путь, тогда как Число Судьбы происходит от полного имени и показывает ваши таланты и способности.'
        },
        {
          category: 'interpretation',
          question: 'Что значит, если у меня несколько одинаковых чисел?',
          answer: 'Когда у вас одно и то же число в нескольких позициях (например, Жизненный Путь и Судьба), энергия этого числа усиливается в вашей жизни, предлагая больше возможностей и вызовов в этой области.'
        },
        {
          category: 'interpretation',
          question: 'Может ли нумерология предсказать будущее?',
          answer: 'Нумерология не предсказывает конкретные события, а определяет энергетические тенденции и циклы. Она помогает понять потенциал и вызовы разных периодов, позволяя принимать информированные решения.'
        },
        {
          category: 'interpretation',
          question: 'Что такое Личный Год?',
          answer: 'Личный Год — это 9-летний цикл, влияющий на темы и возможности текущего года. Он рассчитывается с использованием даты рождения и текущего календарного года.'
        },
        {
          category: 'practical',
          question: 'Как использовать нумерологию в повседневной жизни?',
          answer: 'Вы можете использовать нумерологию для лучшего понимания отношений, выбора оптимальных моментов для важных решений, личностного развития и навигации по жизненным циклам с большей ясностью.'
        },
        {
          category: 'practical',
          question: 'Гарантирует ли нумерологическая совместимость успех отношений?',
          answer: 'Нет. Нумерологическая совместимость даёт представление о динамике между двумя людьми, но успех отношений зависит от многих других факторов, включая общение, общие ценности и взаимные усилия.'
        },
        {
          category: 'practical',
          question: 'Могу ли я изменить судьбу, сменив имя?',
          answer: 'Смена имени может добавить новые вибрации в вашу жизнь, но не стирает энергию первоначального имени. Многие нумерологи рекомендуют работать с существующей энергией, а не пытаться её изменить.'
        }
      ]
    }
  };

  const l = labels[language];
  const categoryIcons = {
    basics: BookOpen,
    calculations: Calculator,
    interpretation: Lightbulb,
    practical: TrendingUp
  };

  const groupedFaqs = l.faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, typeof l.faqs>);

  return (
    <PageLayout>
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      <PageHeader
        title={l.title}
        subtitle={l.subtitle}
        badge={{
          icon: <HelpCircle className="h-4 w-4 text-primary" />,
          label: l.label
        }}
      />

      {/* Main Content */}
      <main className="relative z-10 px-4 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {Object.entries(groupedFaqs).map(([category, faqs]) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons] || HelpCircle;
            return (
              <section key={category} className="card-mystic rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="font-cinzel text-xl text-foreground">
                    {l.categories[category as keyof typeof l.categories]}
                  </h2>
                </div>
                
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`${category}-${index}`}
                      className="border border-border/30 rounded-lg px-4 data-[state=open]:bg-card/50"
                    >
                      <AccordionTrigger className="text-left text-foreground/90 hover:text-primary hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-border/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground font-raleway">{t.footer}</p>
        </div>
      </footer>
    </PageLayout>
  );
};

export default FAQ;
