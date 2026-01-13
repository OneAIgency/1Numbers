/**
 * Article library for numerology education
 */

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: ArticleCategory;
  tags: string[];
  author: string;
  publishedAt: string;
  readingTime: number; // in minutes
  featured: boolean;
}

export type ArticleCategory = 
  | 'basics'
  | 'calculations'
  | 'interpretations'
  | 'relationships'
  | 'career'
  | 'spirituality'
  | 'advanced'
  | 'tips';

export interface ArticleSearchFilters {
  category?: ArticleCategory;
  tags?: string[];
  searchQuery?: string;
  featured?: boolean;
}

/**
 * Get articles by category
 */
export const getArticlesByCategory = (
  articles: Article[],
  category: ArticleCategory
): Article[] => {
  return articles.filter(a => a.category === category);
};

/**
 * Search articles
 */
export const searchArticles = (
  articles: Article[],
  filters: ArticleSearchFilters
): Article[] => {
  let results = [...articles];
  
  if (filters.category) {
    results = results.filter(a => a.category === filters.category);
  }
  
  if (filters.tags && filters.tags.length > 0) {
    results = results.filter(a => 
      filters.tags!.some(tag => a.tags.includes(tag))
    );
  }
  
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    results = results.filter(a => 
      a.title.toLowerCase().includes(query) ||
      a.content.toLowerCase().includes(query) ||
      a.excerpt.toLowerCase().includes(query) ||
      a.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  if (filters.featured !== undefined) {
    results = results.filter(a => a.featured === filters.featured);
  }
  
  return results;
};

/**
 * Get featured articles
 */
export const getFeaturedArticles = (articles: Article[]): Article[] => {
  return articles.filter(a => a.featured).sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
};

/**
 * Get related articles
 */
export const getRelatedArticles = (
  article: Article,
  articles: Article[],
  limit: number = 3
): Article[] => {
  return articles
    .filter(a => 
      a.id !== article.id &&
      (a.category === article.category || 
       a.tags.some(tag => article.tags.includes(tag)))
    )
    .slice(0, limit);
};

/**
 * Initial article content (can be expanded)
 */
export const initialArticles: Article[] = [
  {
    id: 'intro-numerology',
    title: 'Introduction to Numerology',
    excerpt: 'Discover the ancient art of numerology and how numbers influence our lives.',
    content: 'Numerology is an ancient metaphysical science that studies the hidden meanings and influences of numbers...',
    category: 'basics',
    tags: ['basics', 'introduction', 'history'],
    author: 'Numerology Compass',
    publishedAt: new Date().toISOString(),
    readingTime: 5,
    featured: true,
  },
  {
    id: 'master-numbers',
    title: 'Understanding Master Numbers',
    excerpt: 'Learn about the powerful master numbers 11, 22, and 33 and their special significance.',
    content: 'Master numbers are special numbers in numerology that carry enhanced spiritual vibrations...',
    category: 'basics',
    tags: ['master-numbers', '11', '22', '33'],
    author: 'Numerology Compass',
    publishedAt: new Date().toISOString(),
    readingTime: 7,
    featured: true,
  },
  {
    id: 'life-path-guide',
    title: 'Complete Guide to Life Path Numbers',
    excerpt: 'Everything you need to know about calculating and interpreting your Life Path Number.',
    content: 'The Life Path Number is the most important number in your numerology chart...',
    category: 'calculations',
    tags: ['life-path', 'calculations', 'guide'],
    author: 'Numerology Compass',
    publishedAt: new Date().toISOString(),
    readingTime: 10,
    featured: true,
  },
];

