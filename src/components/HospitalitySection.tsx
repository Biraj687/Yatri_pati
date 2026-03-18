import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchNewsData } from '../services/newsService';
import type { Article } from '../services/newsService';

export function HospitalitySection() {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const sections = [
    { title: 'हस्पिटालिटि', startIndex: 6, endIndex: 10 },
    { title: 'होटल र रिसोर्ट', startIndex: 10, endIndex: 14 },
  ];

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchNewsData();
        // Get all available articles
        const combined = [data.hero, data.featured, ...data.articles].filter(Boolean);
        setAllArticles(combined);
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
      <section className="bg-white py-12 px-4 md:px-6 lg:px-8 text-left">
        <div className="max-w-7xl mx-auto text-left">
          {sections.map((section, idx) => (
            <div key={idx} className={idx > 0 ? "mt-16" : ""}>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 font-noto text-left">{section.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                    <div className="h-48 overflow-hidden rounded-2xl m-2 bg-gray-200 animate-pulse"></div>
                    <div className="p-4 pt-1">
                      <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 px-4 md:px-6 lg:px-8 text-left">
      <div className="max-w-7xl mx-auto text-left">
        {sections.map((section, idx) => {
          const sectionArticles = allArticles.slice(section.startIndex, section.endIndex);
          if (sectionArticles.length === 0) return null;

          return (
            <div key={idx} className={idx > 0 ? "mt-16" : ""}>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 font-noto text-left">{section.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                {sectionArticles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/article/${article.id}`}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 text-left group"
                  >
                    <div className="h-48 overflow-hidden rounded-2xl m-2 group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 pt-1 text-left">
                      <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2 font-noto text-left group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-500 font-noto text-left line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
