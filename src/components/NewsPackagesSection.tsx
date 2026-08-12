import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SkeletonLoader } from '@components';
import { fetchNewsData } from '@services/newsService';
import type { Article } from '@types';

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
        const allArticles = [data.hero, data.featured, ...data.articles].filter((a): a is Article => a !== null);

        const latestPlaced = allArticles.filter((a) => (a as any).homepageSectionId === 'latest' && (a as any).homepageSlot !== 'featured');
        const packagesPlaced = allArticles.filter((a) => (a as any).homepageSectionId === 'packages');

        const newsFallback = allArticles.slice(0, 3);
        const packagesFallback = allArticles.slice(3, 6);

        setNewsArticles((latestPlaced.length > 0 ? latestPlaced : newsFallback).slice(0, 3));
        setPackageArticles((packagesPlaced.length > 0 ? packagesPlaced : packagesFallback).slice(0, 3));
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
      <section className="py-12 w-full transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[5rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* News Column */}
            <div>
              <h2 className="text-4xl font-bold text-secondary-700 dark:text-secondary-300 mb-6 border-b-4 border-brand-red pb-3 text-left font-akshar inline-block">
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
              <h2 className="text-4xl font-bold text-secondary-700 dark:text-secondary-300 mb-6 border-b-4 border-[#e0e0e0] dark:border-gray-600 pb-3 text-left font-akshar">
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
    <section className="py-12 w-full transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[5rem]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">

          {/* News Column */}
          <div className="flex flex-col h-full">
            <h2 className="text-4xl font-bold text-secondary-700 dark:text-secondary-300 mb-6 border-b-4 border-brand-red pb-3 text-left font-akshar inline-block">
              {newsTitle}
            </h2>
            <div className="flex flex-col gap-4 flex-1">
              {newsArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/news/${article.id}`}
                  className="flex-1 flex flex-row gap-4 p-4 border border-[#e0e0e0] dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 overflow-hidden items-start hover:shadow-md transition-shadow duration-300 group"
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-28 h-24 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="text-lg font-bold text-[#5e5ca7] dark:text-[#5e5ca7] group-hover:text-brand-red transition-colors mb-1 line-clamp-2">
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
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">
                        {article.author} <span className="mx-1 text-gray-300 dark:text-gray-600">•</span> {article.date}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Packages Column */}
          <div className="flex flex-col h-full">
            <h2 className="text-4xl font-bold text-secondary-700 dark:text-secondary-300 mb-6 border-b-4 border-brand-red pb-3 text-left font-akshar inline-block">
              {packageTitle}
            </h2>
            <div className="flex flex-col gap-4 flex-1">
              {packageArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/news/${article.id}`}
                  className="flex-1 flex flex-row gap-4 p-4 border border-[#e0e0e0] dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 overflow-hidden items-start hover:shadow-md transition-shadow duration-300 group"
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-28 h-24 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="text-lg font-bold text-[#5e5ca7] dark:text-[#5e5ca7] group-hover:text-brand-red transition-colors mb-1 line-clamp-2">
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
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">
                        {article.author} <span className="mx-1 text-gray-300 dark:text-gray-600">•</span> {article.date}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {article.excerpt}
                    </p>
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
