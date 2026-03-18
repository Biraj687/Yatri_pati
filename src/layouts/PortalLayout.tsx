import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header, Footer, TopNewsBlock } from '../components';
import { fetchNewsData, type Article } from '../services/newsService';

interface PortalLayoutProps {
  children: React.ReactNode;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  const [topArticle, setTopArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const getTopNews = async () => {
      try {
        const data = await fetchNewsData();
        setTopArticle(data.hero);
      } catch (err) {
        console.error("Failed to fetch top news for layout", err);
      } finally {
        setLoading(false);
      }
    };
    getTopNews();
  }, []);

  // Don't show the big news block on article detail pages to avoid redundancy
  const showTopBlock = !location.pathname.startsWith('/article/');

  return (
    <div className="portal-layout w-full min-h-screen flex flex-col">
      <Header />
      {showTopBlock && <TopNewsBlock article={topArticle} loading={loading} />}
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};
