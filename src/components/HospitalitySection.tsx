import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchNewsData } from '../services/newsService';
import type { Article } from '../services/newsService';

export function HospitalitySection() {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const sections = [
    { title: 'हस्पिटालिटि', startIndex: 6, endIndex: 12 },
    { title: 'होटल र रिसोर्ट', startIndex: 12, endIndex: 16 },
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
      <section className="bg-white py-16 px-4 md:px-6 lg:px-8 text-left border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-left">
          {sections.map((_, idx) => (
            <div key={idx} className={idx > 0 ? "mt-20" : ""}>
              <div className="mb-10">
                <div className="h-10 w-64 bg-gray-100 rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px] w-full">
                <div className="bg-gray-100 rounded-3xl animate-pulse"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-gray-50 rounded-2xl animate-pulse"></div>
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
    <section className="bg-white py-16 px-4 md:px-6 lg:px-8 text-left border-t border-gray-100">
      <div className="max-w-7xl mx-auto text-left">
        {sections.map((section, idx) => {
          const sectionArticles = allArticles.slice(section.startIndex, section.endIndex);
          if (sectionArticles.length === 0) return null;

          const isHospitality = section.title === 'हस्पिटालिटि';

          return (
            <div key={idx} className={idx > 0 ? "mt-24 border-t border-gray-50 pt-20" : ""}>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-12 font-noto tracking-tight">
                {section.title}
              </h2>
              
              {isHospitality ? (
                /* HOSPITALITY SPLIT LAYOUT: 2 Large on Left, 4 horizontal on Right */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-[750px]">
                  {/* Left Column: 2 Large Cards */}
                  <div className="lg:col-span-7 flex flex-col gap-8 h-full">
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
                          <h3 className="text-white text-xl md:text-2xl font-bold leading-tight mb-3 drop-shadow-md">
                            {article.title}
                          </h3>
                          <div className="text-white/90 text-sm font-medium flex items-center gap-3">
                            <span className="hover:text-white transition-colors uppercase tracking-wider">{article.author}</span>
                            <span className="opacity-50">—</span>
                            <span className="opacity-80 font-noto">{article.date}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Right Column: 4 Horizontal List Cards */}
                  <div className="lg:col-span-5 flex flex-col gap-6 h-full">
                    {sectionArticles.slice(2, 6).map((article) => (
                      <Link
                        key={article.id}
                        to={`/article/${article.id}`}
                        className="group flex-1 flex gap-4 items-center bg-white rounded-xl transition-all duration-300 hover:bg-gray-50/50 p-1"
                      >
                        <div className="flex-1 space-y-2">
                          <h4 className="text-md md:text-lg font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                              <img 
                                src={article.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=random`} 
                                alt={article.author} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className="text-xs md:text-sm font-medium text-gray-700">
                              <span className="truncate">{article.author}</span> <span className="mx-1 text-gray-300">—</span> <span className="text-gray-500 font-noto">{article.date}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-1 leading-relaxed font-noto opacity-70">
                            {article.excerpt || "यदि मलाई कसैले जहाजबाट समुद्रमा धकेलिदियो र जमिन हजार माइल टाढा भएको बतायो भने पनि म पौडिरहनेछु ।"}
                          </p>
                        </div>
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shadow-sm flex-shrink-0 group-hover:shadow-md transition-shadow">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
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
                      className="flex flex-col group h-full"
                    >
                      <div className="h-52 overflow-hidden rounded-2xl mb-5 shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-500 font-noto line-clamp-2 mb-4 leading-relaxed opacity-80">
                        {article.excerpt || "यदि मलाई कसैले जहाजबाट समुद्रमा धकेलिदियो र जमिन हजार माइल टाढा भएको बतायो भने पनि म पौडिरहनेछु ।"}
                      </p>
                      <div className="mt-auto flex items-center gap-2 text-sm text-gray-700 font-medium border-t border-gray-50 pt-4">
                        <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
                          <img 
                            src={article.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=random`} 
                            alt={article.author} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <span className="truncate">{article.author}</span>
                        <span className="opacity-30">|</span>
                        <span className="font-noto truncate text-gray-500">{article.date}</span>
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
