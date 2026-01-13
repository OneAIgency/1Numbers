import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { askNumerologyQuestion, getClarifications, getNumerologyContext, type NumerologyQuestion, type AIResponse } from '@/lib/aiConsultant';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/use-profile';

export const AIConsultant = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{ question: string; response: AIResponse }>>([]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    const currentQuestion = question;
    setQuestion('');

    try {
      const numerologyQuestion: NumerologyQuestion = {
        question: currentQuestion,
        context: profile ? {
          fullName: profile.fullName,
          birthDate: new Date(profile.birthDate)
        } : undefined,
        language
      };

      const aiResponse = await askNumerologyQuestion(numerologyQuestion);
      setResponse(aiResponse);
      setConversation(prev => [...prev, { question: currentQuestion, response: aiResponse }]);
    } catch (error) {
      console.error('Error asking question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (quickQuestion: string) => {
    setQuestion(quickQuestion);
  };

  const translations: Record<string, Record<string, string>> = {
    ro: {
      title: 'Consultant AI Numerologic',
      description: 'Pune întrebări despre numerologie și primește răspunsuri personalizate',
      placeholder: 'Ex: Ce înseamnă Numărul Drumului Vieții pentru mine?',
      ask: 'Întreabă',
      quickQuestions: 'Întrebări rapide',
      relatedNumbers: 'Numere conexe',
      suggestions: 'Sugestii',
      followUp: 'Întrebări de urmărire',
      noResponse: 'Pune o întrebare pentru a începe conversația'
    },
    en: {
      title: 'AI Numerology Consultant',
      description: 'Ask questions about numerology and get personalized answers',
      placeholder: 'E.g.: What does my Life Path Number mean for me?',
      ask: 'Ask',
      quickQuestions: 'Quick Questions',
      relatedNumbers: 'Related Numbers',
      suggestions: 'Suggestions',
      followUp: 'Follow-up Questions',
      noResponse: 'Ask a question to start the conversation'
    },
    ru: {
      title: 'ИИ Нумерологический консультант',
      description: 'Задавайте вопросы о нумерологии и получайте персонализированные ответы',
      placeholder: 'Например: Что означает мое Число Жизненного Пути для меня?',
      ask: 'Спросить',
      quickQuestions: 'Быстрые вопросы',
      relatedNumbers: 'Связанные числа',
      suggestions: 'Предложения',
      followUp: 'Вопросы для продолжения',
      noResponse: 'Задайте вопрос, чтобы начать разговор'
    }
  };

  const tr = translations[language] || translations.en;

  const quickQuestions: Record<string, string[]> = {
    ro: [
      'Ce înseamnă Numărul Drumului Vieții?',
      'Cum pot folosi numerologia în viața de zi cu zi?',
      'Ce înseamnă Numărul Destinului pentru cariera mea?',
      'Cum pot îmbunătăți compatibilitatea cu partenerul meu?'
    ],
    en: [
      'What does my Life Path Number mean?',
      'How can I use numerology in daily life?',
      'What does my Destiny Number mean for my career?',
      'How can I improve compatibility with my partner?'
    ],
    ru: [
      'Что означает мое Число Жизненного Пути?',
      'Как я могу использовать нумерологию в повседневной жизни?',
      'Что означает мое Число Судьбы для моей карьеры?',
      'Как я могу улучшить совместимость с моим партнером?'
    ]
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle>{tr.title}</CardTitle>
          </div>
          <CardDescription>{tr.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Questions */}
          <div>
            <p className="text-sm font-semibold mb-2">{tr.quickQuestions}:</p>
            <div className="flex flex-wrap gap-2">
              {(quickQuestions[language] || quickQuestions.en).map((q, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>

          {/* Question Input */}
          <div className="flex gap-2">
            <Textarea
              placeholder={tr.placeholder}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAsk();
                }
              }}
              className="min-h-[100px]"
            />
            <Button onClick={handleAsk} disabled={loading || !question.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conversation History */}
      {conversation.length > 0 && (
        <div className="space-y-4">
          {conversation.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <Card>
                <CardContent className="pt-6">
                  <p className="font-semibold text-sm mb-2">Q: {item.question}</p>
                  <p className="text-sm">{item.response.answer}</p>
                  
                  {item.response.relatedNumbers && item.response.relatedNumbers.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold mb-2">{tr.relatedNumbers}:</p>
                      <div className="flex gap-2">
                        {item.response.relatedNumbers.map((num, numIdx) => (
                          <Badge key={numIdx} variant="secondary">{num}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.response.suggestions && item.response.suggestions.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold mb-2">{tr.suggestions}:</p>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {item.response.suggestions.map((suggestion, sugIdx) => (
                          <li key={sugIdx}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.response.followUpQuestions && item.response.followUpQuestions.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold mb-2">{tr.followUp}:</p>
                      <div className="flex flex-wrap gap-2">
                        {item.response.followUpQuestions.map((followUp, fuIdx) => (
                          <Button
                            key={fuIdx}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickQuestion(followUp)}
                          >
                            {followUp}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* No response yet */}
      {!response && conversation.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{tr.noResponse}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

