import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { CompactArticle } from '../components/CompactArticle';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { fetchNewsData, fetchArticlesByCategory } from '../services/newsService';
import type { Article } from '../types';
import { useSiteConfig } from '../context/SiteConfigContext';

export function CategoryPage() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { config, loading: configLoading } = useSiteConfig();

  const loadCategoryData = useCallback(async () => {
    setLoading(true);
    setError(null);
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
      const all = [data.hero, data.featured, ...data.articles].filter((a): a is Article => a !== null);
      const filtered = all.filter(a =>
        a.category?.toLowerCase() === categoryName?.toLowerCase() ||
        categoryName === 'all'
      );
      setArticles(filtered.length > 0 ? filtered : all.slice(0, 10));
    } catch (err) {
      console.error("Failed to load category", err);
      setError('समाचार लोड गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [categoryName]);

  useEffect(() => {
    loadCategoryData();
  }, [categoryName, loadCategoryData]);

  const currentNav = config?.navigation.find(item => item.path === `/category/${categoryName}`) ||
    config?.navigation.flatMap(item => item.dropdownItems || []).find(sub => sub.path === `/category/${categoryName}`);
    
  let displayName = 'समाचार';
  if (currentNav) {
    displayName = currentNav.label;
  } else if (categoryName) {
    displayName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  }

  if (loading || configLoading) {
    return (
      <main className="w-full py-12 bg-white dark:bg-gray-900">
        <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[5rem]">
          <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse mb-8 rounded"></div>
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

  if (error) {
    return (
      <main className="w-full py-12 min-h-[60vh] bg-white dark:bg-gray-900">
        <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[5rem]">
          <Helmet>
            <title>{`${displayName} - ${config?.siteName || 'Yatripati'}`}</title>
            <meta name="description" content={`Read the latest ${displayName} news and updates on ${config?.siteName || 'Yatripati'}.`} />
          </Helmet>

          <div className="border-b border-primary-500 mb-10 pb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 uppercase">
              {displayName}
            </h1>
          </div>

          <ErrorState
            title="समाचार लोड गर्न असफल"
            message={error}
            onRetry={loadCategoryData}
          />
        </section>
      </main>
    );
  }

  return (
    <main className="w-full py-12 min-h-[60vh] bg-white dark:bg-gray-900">
      <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[5rem]">
        <Helmet>
          <title>{`${displayName} - ${config?.siteName || 'Yatripati'}`}</title>
          <meta name="description" content={`Read the latest ${displayName} news and updates on ${config?.siteName || 'Yatripati'}.`} />
        </Helmet>

        <div className="border-b border-primary-500 mb-10 pb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 uppercase">
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
            <EmptyState
              title="यस विधामा कुनै समाचार भेटिएन"
              message={`${displayName} श्रेणीमा हाल कुनै समाचार उपलब्ध छैन।`}
              icon="news"
            />
          )}
        </div>
      </section>
    </main>
  );
}
