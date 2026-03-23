import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FeaturedArticle } from '../components/FeaturedArticle';
import { CompactArticle } from '../components/CompactArticle';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { fetchNewsDataWithRetry } from '../services/newsService';
import type { Article } from '../services/newsService';
import { useSiteConfig } from '../context/SiteConfigContext';

import { AccordionSection } from '../components/AccordionSection';

export function Home() {
  const [featured, setFeatured] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { config, loading: configLoading } = useSiteConfig();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchNewsDataWithRetry(3, 1000);
        setFeatured(data.featured);
        setArticles(data.articles);
        setError(null);
      } catch (error) {
        console.error("Failed to load news", error);
        setError(error instanceof Error ? error.message : 'समाचार लोड गर्न असफल भयो। कृपया पुनः प्रयास गर्नुहोस्।');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    const loadData = async () => {
      try {
        const data = await fetchNewsDataWithRetry(3, 1000);
        setFeatured(data.featured);
        setArticles(data.articles);
      } catch (error) {
        console.error("Retry failed", error);
        setError(error instanceof Error ? error.message : 'समाचार लोड गर्न असफल भयो।');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  };

  if (loading || configLoading) {
    return (
      <>
        <Helmet>
          <title>{config?.siteName || 'Yatripati'} - Loading News...</title>
        </Helmet>
        <SkeletonLoader type="hero" />
        <main className="w-full py-12">
          <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[5rem]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
              <SkeletonLoader type="featured" />
              <div className="space-y-4">
                <SkeletonLoader type="compact" />
                <SkeletonLoader type="compact" />
                <SkeletonLoader type="compact" />
                <SkeletonLoader type="compact" />
              </div>
            </div>
          </section>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[5rem] py-12">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          color: '#333',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#ef4444', marginBottom: '20px' }}>❌ त्रुटि</h2>
          <p style={{ marginBottom: '20px', fontSize: '16px' }}>{error}</p>
          <button
            onClick={handleRetry}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            पुनः प्रयास गर्नुहोस्
          </button>
        </div>
      </div>
    );
  }

  const sectionTitles = config?.sectionTitles || {};

  return (
    <>
      <Helmet>
        <title>{config?.siteName || 'Yatripati'} - Latest News from Nepal</title>
        <meta name="description" content={`Stay updated with the latest news on politics, tourism, economy, and more from ${config?.siteName}.`} />
        <meta property="og:title" content={`${config?.siteName} - Latest News from Nepal`} />
        <meta property="og:description" content="The ultimate portal for Nepali news, tourism, and culture." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Samachar Section - with breathing space */}
      <main className="w-full py-12 dark:bg-gray-900 transition-colors duration-300">
        <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[5rem]">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-10 text-left uppercase border-b-2 border-primary-600 inline-block pb-2">
            {sectionTitles.latest || 'समाचार'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
            {/* Left: Large featured article */}
            {featured && <FeaturedArticle article={featured} />}

            {/* Right: List of compact articles */}
            <div className="flex flex-col gap-4 h-full bg-white dark:bg-gray-800 rounded-xl p-4 md:p-8">
              {articles.slice(0, 3).map((article, index) => (
                <div key={article.id} className="flex-1">
                  <CompactArticle
                    article={article}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <AccordionSection title={sectionTitles.trending} />
      </main>
    </>
  );
}
