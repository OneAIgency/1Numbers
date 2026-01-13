import { useState } from 'react';
import { Search, BookOpen, Clock, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Article, ArticleCategory, searchArticles, getArticlesByCategory } from '@/lib/articles';
import { cn } from '@/lib/utils';

interface ArticleLibraryProps {
  articles: Article[];
  onArticleSelect?: (article: Article) => void;
  className?: string;
}

const categories: { value: ArticleCategory; label: string }[] = [
  { value: 'basics', label: 'Baze' },
  { value: 'calculations', label: 'Calcule' },
  { value: 'interpretations', label: 'Interpretări' },
  { value: 'relationships', label: 'Relații' },
  { value: 'career', label: 'Carieră' },
  { value: 'spirituality', label: 'Spiritualitate' },
  { value: 'advanced', label: 'Avansat' },
  { value: 'tips', label: 'Sfaturi' },
];

export const ArticleLibrary = ({ articles, onArticleSelect, className }: ArticleLibraryProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | 'all'>('all');

  const filteredArticles = searchArticles(articles, {
    searchQuery: searchQuery || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
  });

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Caută articole..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 input-mystic"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              "px-3 py-1 rounded-full text-sm border transition-all",
              selectedCategory === 'all'
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:border-primary/50"
            )}
          >
            Toate
          </button>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={cn(
                "px-3 py-1 rounded-full text-sm border transition-all",
                selectedCategory === cat.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary/50"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article) => (
            <Card
              key={article.id}
              className="card-mystic hover:glow-gold-subtle transition-all duration-300 cursor-pointer h-full"
              onClick={() => onArticleSelect?.(article)}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="font-cinzel text-lg text-foreground line-clamp-2">
                    {article.title}
                  </CardTitle>
                  {article.featured && (
                    <Badge variant="default" className="shrink-0 ml-2">Featured</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {article.excerpt}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{article.readingTime} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span>{categories.find(c => c.value === article.category)?.label}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {article.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="h-2 w-2 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nu s-au găsit articole</p>
        </div>
      )}
    </div>
  );
};

