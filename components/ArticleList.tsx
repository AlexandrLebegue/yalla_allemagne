import { Article } from '@/models/Article';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
  articles: Article[];
  showFeatured?: boolean;
}

export default function ArticleList({ articles, showFeatured = false }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-gray">Aucun article trouvé.</p>
      </div>
    );
  }

  const featuredArticle = showFeatured ? articles[0] : null;
  const remainingArticles = showFeatured ? articles.slice(1) : articles;

  return (
    <div className="space-y-8">
      {/* Featured Article */}
      {featuredArticle && (
        <div className="mb-12">
          <ArticleCard article={featuredArticle} variant="featured" index={0} />
        </div>
      )}

      {/* Articles Grid */}
      {remainingArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remainingArticles.map((article, index) => (
            <ArticleCard key={article.slug} article={article} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}