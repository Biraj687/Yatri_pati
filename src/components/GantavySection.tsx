import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SkeletonLoader } from './SkeletonLoader';
import { fetchNewsData } from '../services/newsService';
import type { Article } from '../services/newsService';

interface GantavySectionProps {
  title?: string;
}

export function GantavySection({ title = 'गन्तव्य' }: GantavySectionProps) {
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
      <section className="w-full py-16 bg-black">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[5rem]">
          <h2 className="text-white text-4xl font-bold text-left mb-12">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonLoader key={i} type="card" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-white text-4xl font-bold text-left mb-12">{title}</h2>

        {/* 2x3 Grid - Equal Width */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((article) => (
            <Link key={article.id} to={`/news/${article.id}`} className="flex flex-col group transition-all duration-300">
              {/* Image */}
              <div className="mb-5 aspect-[3/2] overflow-hidden rounded-xl group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Title */}
              <h3 className="text-white text-xl md:text-2xl font-bold leading-tight mb-4 flex-grow group-hover:text-primary-400 transition-colors line-clamp-2">
                {article.title}
              </h3>

              {/* Author with date */}
              <div className="flex items-center gap-3">
                <img
                  src={article.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=random`}
                  alt={article.author}
                  className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover flex-shrink-0 border border-white/20"
                />
                <div className="text-white text-xs md:text-sm font-medium">
                  {article.author} <span className="mx-1 opacity-50">—</span> <span className="opacity-70">{article.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
