import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { CompactArticle } from '../components/CompactArticle';
import { fetchNewsData } from '../services/newsService';
import type { Article } from '../services/newsService';

export function CategoryPage() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategoryData = async () => {
      setLoading(true);
      try {
        const data = await fetchNewsData();
        // Combine all articles and filter by category
        const all = [data.hero, data.featured, ...data.articles];
        // In a real API, we would fetch only the category articles
        // For now, we simulate filtering or just show all as "related"
        const filtered = all.filter(a => 
          a.category?.toLowerCase() === categoryName?.toLowerCase() || 
          categoryName === 'all'
        );
        setArticles(filtered.length > 0 ? filtered : all.slice(0, 5));
      } catch (err) {
        console.error("Failed to load category", err);
      } finally {
        setLoading(false);
      }
    };
    loadCategoryData();
  }, [categoryName]);

  const displayName = categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : 'समाचार';

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-5 py-10">
        <div className="h-10 w-48 bg-gray-200 animate-pulse mb-8 rounded"></div>
        <div className="space-y-6">
          <SkeletonLoader type="compact" />
          <SkeletonLoader type="compact" />
          <SkeletonLoader type="compact" />
          <SkeletonLoader type="compact" />
        </div>
      </main>
    );
  }

  return (
    <main className="w-full px-5 py-10 min-h-[60vh]">
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
              totalLength={articles.length} 
            />
          ))
        ) : (
          <p className="text-gray-400 text-center py-20">यस विधामा कुनै समाचार फेला परेन।</p>
        )}
      </div>
    </main>
  );
}
