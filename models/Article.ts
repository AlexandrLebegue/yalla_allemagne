export type ArticleCategory = 'visa-et-papiers' | 'logement' | 'travail' | 'langue' | 'vie-quotidienne';

export interface ArticleFrontmatter {
  title: string;
  excerpt: string;
  date: string;
  coverImage: string;
  category: ArticleCategory;
  tags: string[];
  keywords: string[];
  author?: string;
}

export interface Article extends ArticleFrontmatter {
  slug: string;
  content: string;
  readingTime?: number;
}

export interface ArticleMetadata {
  slug: string;
  title: string;
  excerpt: string;
  keywords: string[];
}
