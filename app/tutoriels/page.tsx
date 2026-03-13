import { getArticlesByCategory } from '@/lib/markdown';
import TutorielsPageClient from '@/components/TutorielsPageClient';

export default function GuidesPage() {
  const visaArticles = getArticlesByCategory('visa-et-papiers');
  const logementArticles = getArticlesByCategory('logement');
  const travailArticles = getArticlesByCategory('travail');
  const langueArticles = getArticlesByCategory('langue');
  const vieQuotidienneArticles = getArticlesByCategory('vie-quotidienne');

  return (
    <TutorielsPageClient
      visaArticles={visaArticles}
      logementArticles={logementArticles}
      travailArticles={travailArticles}
      langueArticles={langueArticles}
      vieQuotidienneArticles={vieQuotidienneArticles}
    />
  );
}
