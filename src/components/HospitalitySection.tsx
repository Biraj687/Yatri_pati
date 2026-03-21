import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchNewsData } from '../services/newsService';
import type { Article } from '../services/newsService';

interface HospitalitySectionProps {
  hospitalityTitle?: string;
  hotelsTitle?: string;
}

export function HospitalitySection({ 
  hospitalityTitle = 'हस्पिटालिटि', 
  hotelsTitle = 'होटल र रिसोर्ट' 
}: HospitalitySectionProps) {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const sections = [
    { title: hospitalityTitle, startIndex: 6, endIndex: 12 },
    { title: hotelsTitle, startIndex: 12, endIndex: 16 },
  ];

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchNewsData();
        // Get all available articles
        const combined = [data.hero, data.featured, ...data.articles].filter((a): a is Article => a !== null);
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
      <section className="bg-white dark:bg-gray-900 py-16 px-4 md:px-6 lg:px-8 text-left border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto text-left">
          {sections.map((section, idx) => (
            <div key={idx} className={idx > 0 ? "mt-20" : ""}>
              <div className="mb-10">
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-12 font-noto tracking-tight opacity-50">
                  {section.title}
                </h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px] w-full">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-gray-50 dark:bg-gray-700/50 rounded-2xl animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-gray-900 py-16 px-4 md:px-8 lg:px-[5rem] text-left transition-colors duration-300">
      <div className="max-w-7xl mx-auto text-left">
        {sections.map((section, idx) => {
          const sectionArticles = allArticles.slice(section.startIndex, section.endIndex);
          if (sectionArticles.length === 0) return null;

          const isHospitality = section.title === hospitalityTitle;

          return (
            <div key={idx} className={idx > 0 ? "mt-24 pt-20" : ""}>
              <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-12 font-noto tracking-tight">
                {section.title}
              </h2>
              
              {isHospitality ? (
                /* HOSPITALITY SPLIT LAYOUT: 2 Large on Left, 4 horizontal on Right */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: 2 Large Cards */}
                  <div className="flex flex-col gap-4 h-full">
                    {sectionArticles.slice(0, 2).map((article) => (
                      <Link
                        key={article.id}
                        to={`/article/${article.id}`}
                        className="relative flex-1 overflow-hidden rounded-3xl group shadow-lg transition-all duration-500 hover:shadow-xl"
                      >
                        <img
                          src={article.image}
                          alt={article.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
                          <h3 className="text-white text-xl md:text-2xl font-bold leading-tight mb-3 drop-shadow-md group-hover:text-primary-200 transition-colors">
                            {article.title}
                          </h3>
                          <div className="text-white/90 text-sm font-medium flex items-center gap-3">
                            <span className="hover:text-white transition-colors">{article.author}</span>
                            <span className="opacity-50">—</span>
                            <span className="opacity-80 font-noto">{article.date}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Right Column: 4 Horizontal List Cards */}
                  <div className="flex flex-col gap-4 h-full">
                    {sectionArticles.slice(2, 6).map((article) => (
                      <Link
                        key={article.id}
                        to={`/article/${article.id}`}
                        className="group flex-1 flex gap-6 items-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:bg-gray-50/50 dark:hover:bg-gray-700/50 p-4"
                      >
                        <div className="w-32 h-32 md:w-48 md:h-40 rounded-xl overflow-hidden shadow-sm flex-shrink-0 group-hover:shadow-md transition-all duration-500">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-3">
                          <h4 className="text-md md:text-lg font-bold text-gray-900 dark:text-gray-100 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-100 dark:border-gray-700 flex-shrink-0">
                                <img 
                                  src={article.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=random`} 
                                  alt={article.author} 
                                  className="w-full h-full object-cover" 
                                />
                            </div>
                            <div className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <span className="font-bold">{article.author}</span>
                              <span className="opacity-30">—</span>
                              <span className="font-noto text-gray-500 dark:text-gray-400">{article.date}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed font-noto opacity-70">
                            {article.excerpt || "थप विवरणका लागि पूरा समाचार पढ्नुहोस्..."}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                /* RELIABLE GRID for other sections */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {sectionArticles.map((article) => (
                    <Link
                      key={article.id}
                      to={`/article/${article.id}`}
                      className="flex flex-col group h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden hover:translate-y-[-4px] transition-all duration-300"
                    >
                      <div className="h-52 overflow-hidden rounded-2xl mb-5 shadow-sm group-hover:shadow-md transition-all duration-300">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex-grow flex flex-col px-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-snug mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 h-[3.5rem] flex items-center">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-noto line-clamp-2 mb-4 leading-relaxed opacity-70 h-10 overflow-hidden">
                          {article.excerpt || "थप विवरणका लागि पूरा समाचार पढ्नुहोस्..."}
                        </p>
                        <div className="mt-auto flex items-center gap-2 text-xs md:text-sm text-gray-700 dark:text-gray-300 font-medium pt-3">
                          <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-100 dark:border-gray-600 flex-shrink-0">
                            <img 
                              src={article.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=random`} 
                              alt={article.author} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <span className="truncate">{article.author}</span>
                          <span className="opacity-30">|</span>
                          <span className="font-noto truncate text-gray-400 dark:text-gray-500">{article.date}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
