import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArticleLibrary } from '@/components/ArticleLibrary';
import { Article, initialArticles } from '@/lib/articles';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';

const Articles = () => {
  const { t } = useLanguage();
  const [articles] = useState<Article[]>(initialArticles);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <PageLayout>
      <PageHeader
        title="Bibliotecă Articole"
        subtitle="Explorează articole despre numerologie, calcule și interpretări"
        badge={{
          icon: <BookOpen className="h-4 w-4 text-primary" />,
          label: 'Articole'
        }}
      />

      <main className="relative z-10 px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {selectedArticle ? (
            <div className="space-y-6">
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-primary hover:underline"
              >
                ← Înapoi la articole
              </button>
              <Card className="card-mystic">
                <CardContent className="p-8">
                  <h1 className="font-cinzel text-3xl text-foreground mb-4">
                    {selectedArticle.title}
                  </h1>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-foreground/90 whitespace-pre-wrap">
                      {selectedArticle.content}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <ArticleLibrary
              articles={articles}
              onArticleSelect={setSelectedArticle}
            />
          )}
        </div>
      </main>
    </PageLayout>
  );
};

export default Articles;

