import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SkeletonLoader } from './SkeletonLoader';
import { fetchNewsData } from '../services/newsService';
import type { Article } from '../services/newsService';

interface NewsPackagesSectionProps {
  newsTitle?: string;
  packageTitle?: string;
}

export default function NewsPackagesSection({ 
  newsTitle = 'समाचार', 
  packageTitle = 'प्याकेज समाचार' 
}: NewsPackagesSectionProps) {
  const [newsArticles, setNewsArticles] = useState<Article[]>([]);
  const [packageArticles, setPackageArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchNewsData();
        // Get first 3 articles for news column
        const allArticles = [data.hero, data.featured, ...data.articles].filter(Boolean);
        setNewsArticles(allArticles.slice(0, 3));
        // Get next 3 articles for packages column
        setPackageArticles(allArticles.slice(3, 6));
      } catch (error) {
        console.error("Failed to load articles", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <section className="bg-gray-50 py-12 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[5rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* News Column */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-4 border-gray-400 pb-3 text-left">
                {newsTitle}
              </h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <SkeletonLoader key={i} type="news-package" />
                ))}
              </div>
            </div>

            {/* Packages Column */}
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-4 border-primary-600 pb-3 text-left">
                {packageTitle}
              </h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <SkeletonLoader key={i} type="news-package" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-12 w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[5rem]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* News Column */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-4 border-gray-400 pb-3 text-left">
              {newsTitle}
            </h2>
            <div className="space-y-4">
              {newsArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="flex gap-4 p-4">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-24 h-24 object-cover rounded flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
                          <img 
                            src={article.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=random`} 
                            alt={article.author} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <p className="text-xs font-medium text-gray-600 truncate">
                          {article.author} <span className="mx-1 text-gray-300">•</span> {article.date}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Packages Column */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-4 border-primary-600 pb-3 text-left">
              {packageTitle}
            </h2>
            <div className="space-y-4">
              {packageArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="flex gap-4 p-4">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-24 h-24 object-cover rounded flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
                          <img 
                            src={article.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=random`} 
                            alt={article.author} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <p className="text-xs font-medium text-gray-600 truncate">
                          {article.author} <span className="mx-1 text-gray-300">•</span> {article.date}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
