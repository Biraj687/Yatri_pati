import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { CompactArticle } from '../components/CompactArticle';
import { fetchNewsData, fetchArticlesByCategory } from '../services/newsService';
import type { Article } from '../services/newsService';

export function CategoryPage() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategoryData = async () => {
      setLoading(true);
      try {
        // Try to fetch from dedicated category endpoint first
        if (categoryName && categoryName !== 'all') {
          const categoryArticles = await fetchArticlesByCategory(categoryName, 20);
          if (categoryArticles.length > 0) {
            setArticles(categoryArticles);
            setLoading(false);
            return;
          }
        }

        // Fallback: Fetch all data and filter locally
        const data = await fetchNewsData();
        const all = [data.hero, data.featured, ...data.articles];
        const filtered = all.filter(a =>
          a.category?.toLowerCase() === categoryName?.toLowerCase() ||
          categoryName === 'all'
        );
        setArticles(filtered.length > 0 ? filtered : all.slice(0, 10));
      } catch (err) {
        console.error("Failed to load category", err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    loadCategoryData();
  }, [categoryName]);

  const displayName = categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : 'समाचार';

  if (loading) {
    return (
      <main className="w-full py-12">
        <section className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="h-10 w-48 bg-gray-200 animate-pulse mb-8 rounded"></div>
          <div className="space-y-6">
            <SkeletonLoader type="compact" />
            <SkeletonLoader type="compact" />
            <SkeletonLoader type="compact" />
            <SkeletonLoader type="compact" />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full py-12 min-h-[60vh]">
      <section className="max-w-7xl mx-auto px-6 lg:px-8">
        <Helmet>
          <title>{`${displayName} - Yatripati News`}</title>
          <meta name="description" content={`Read the latest ${displayName} news and updates on Yatripati.`} />
        </Helmet>

        <div className="border-b border-blue-500 mb-10 pb-4">
          <h1 className="text-4xl font-bold text-white uppercase tracking-wider">
            {displayName}
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <CompactArticle
                key={`${article.id}-${index}`}
                article={article}
                index={index}
              />
            ))
          ) : (
            <p className="text-gray-400 text-center py-20">यस विधामा कुनै समाचार फेला परेन।</p>
          )}
        </div>
      </section>
    </main>
  );
}
