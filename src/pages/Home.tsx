import { useEffect, useState } from 'react';
import { HeroSection } from '../components/HeroSection';
import { FeaturedArticle } from '../components/FeaturedArticle';
import { CompactArticle } from '../components/CompactArticle';
import { fetchNewsDataWithRetry } from '../services/newsService';
import type { Article } from '../services/newsService';

export function Home() {
  const [hero, setHero] = useState<Article | null>(null);
  const [featured, setFeatured] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchNewsDataWithRetry(3, 1000);
        setHero(data.hero);
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
        setHero(data.hero);
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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: '#fff' }}>
        <h2>लोड हुँदैछ... (Loading...)</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh', 
        color: '#fff',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#ff6b6b', marginBottom: '20px' }}>❌ त्रुटि</h2>
        <p style={{ marginBottom: '20px', fontSize: '16px' }}>{error}</p>
        <button
          onClick={handleRetry}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
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
    );
  }

  return (
    <>
      {/* Hero Banner */}
      {hero && <HeroSection heroArticle={hero} />}

      {/* Samachar Section */}
      <main className="max-w-7xl mx-auto px-5 py-10">
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">समाचार</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Large featured article */}
            {featured && <FeaturedArticle article={featured} />}

            {/* Right: List of compact articles */}
            <div className="space-y-0">
              {articles.map((article, index) => (
                <CompactArticle
                  key={article.id}
                  article={article}
                  index={index}
                  totalLength={articles.length}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
