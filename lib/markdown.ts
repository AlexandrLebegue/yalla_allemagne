import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Article, ArticleFrontmatter, ArticleMetadata } from '@/models/Article';

const contentDirectory = path.join(process.cwd(), 'content');

/**
 * Get all article slugs from the content directory
 */
export function getAllArticleSlugs(): string[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }
  
  const files = fs.readdirSync(contentDirectory);
  return files
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));
}

/**
 * Get article by slug
 */
export function getArticleBySlug(slug: string): Article | null {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const frontmatter = data as ArticleFrontmatter;
    
    // Calculate reading time (approx 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    return {
      slug,
      ...frontmatter,
      content,
      readingTime,
    };
  } catch (error) {
    console.error(`Error loading article ${slug}:`, error);
    return null;
  }
}

/**
 * Get all articles
 */
export function getAllArticles(): Article[] {
  const slugs = getAllArticleSlugs();
  const articles = slugs
    .map((slug) => getArticleBySlug(slug))
    .filter((article): article is Article => article !== null)
    .sort((a, b) => {
      // Sort by date descending (newest first)
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  
  return articles;
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter((article) => article.category === category);
}

/**
 * Get articles by tag
 */
export function getArticlesByTag(tag: string): Article[] {
  return getAllArticles().filter((article) => 
    article.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Get article metadata for AI chatbot
 */
export function getAllArticleMetadata(): ArticleMetadata[] {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    keywords: article.keywords,
  }));
}

/**
 * Extract headings from markdown content for table of contents
 */
export interface Heading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    headings.push({ id, text, level });
  }
  
  return headings;
}