import { getArticleBySlug, getAllArticleSlugs, extractHeadings } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import ArticlePageClient from '@/components/ArticlePageClient';

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const headings = extractHeadings(article.content);

  return <ArticlePageClient article={article} headings={headings} />;
}