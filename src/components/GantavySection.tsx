import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SkeletonLoader } from './SkeletonLoader';
import { fetchNewsData } from '../services/newsService';
import type { Article } from '../services/newsService';

export function GantavySection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchNewsData();
        // Get first 6 articles from all available articles
        const allArticles = [data.hero, data.featured, ...data.articles].filter(Boolean);
        setArticles(allArticles.slice(0, 6));
      } catch (error) {
        console.error("Failed to load articles", error);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-white text-3xl font-bold text-left mb-12">गन्तव्य</h2>
          <div className="bg-black rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonLoader key={i} type="card" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-black rounded-lg p-8">
          {/* Header */}
          <h2 className="text-white text-3xl font-bold text-left mb-12">गन्तव्य</h2>

          {/* 2x3 Grid - Equal Width */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link key={article.id} to={`/article/${article.id}`} className="flex flex-col group hover:opacity-80 transition-opacity duration-300">
                {/* Image */}
                <div className="mb-4 h-40 overflow-hidden rounded group-hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Title Summary */}
                <h3 className="text-white text-base font-semibold leading-relaxed mb-3 flex-grow group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h3>

                {/* Author with date */}
                <div className="flex items-center gap-3">
                  <img
                    src={article.authorAvatar || ''}
                    alt={article.author}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="text-white text-xs opacity-75">
                    {article.author} — {article.date}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
