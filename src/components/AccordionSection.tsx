import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchNewsData } from '@services/newsService';
import type { Article } from '@types';

interface AccordionSectionProps {
  title?: string;
}

export function AccordionSection({ title = 'विशेष सिफारिस' }: AccordionSectionProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeId, setActiveId] = useState<number | string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchNewsData();
        // Use a subset of articles for the accordion
        const all = [data.hero, data.featured, ...data.articles].filter((a): a is Article => a !== null);
        const sliced = all.slice(4, 9);
        setArticles(sliced);
        if (sliced.length > 0) setActiveId(sliced[0].id);
      } catch (error) {
        console.error("Failed to load accordion articles", error);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  if (loading || articles.length === 0) return null;

  // Determine the visually active item. 
  // activeId is managed by state now.

  return (
    <section className="w-full py-16 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[5rem]">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-10 text-left font-noto">
          {title}
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[600px] w-full overflow-hidden">
          {articles.map((article) => {
            const isActive = activeId === article.id;
            // Use thumbnailImage if available, otherwise fall back to main image
            const displayImage = article.thumbnailImage || article.image;
            
            return (
              <Link
                key={article.id}
                to={`/news/${article.id}`}
                onMouseEnter={() => setActiveId(article.id)}
                className={`relative overflow-hidden rounded-3xl transition-all duration-700 ease-in-out group shadow-md
                  ${isActive ? 'lg:w-[60%] flex-grow' : 'lg:w-[20%] flex-grow-0'}
                  w-full lg:flex-none h-64 lg:h-full`}
              >
                {/* Background Image */}
                <img
                  src={displayImage}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-500
                  ${isActive ? 'opacity-100' : 'opacity-80'}`} 
                />
                
                {/* Content - Fully Revealed Strategy */}
                <div className={`absolute bottom-0 left-0 w-full p-6 md:p-10 transition-all duration-500 flex flex-col justify-end h-full z-20
                  ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 lg:opacity-100 lg:translate-y-0'}`}>
                  
                  {/* Expanded Content */}
                  <div className={`transition-all duration-500 ${isActive ? 'opacity-100 visible h-auto' : 'opacity-0 invisible h-0 overflow-hidden'}`}>
                    <span className="inline-block bg-white/20 backdrop-blur-md text-white text-[12px] font-bold px-3 py-1 rounded-full uppercase mb-4 border border-white/30">
                      {article.category || 'समाचार'}
                    </span>
                    
                    <h3 className="text-white font-extrabold leading-tight mb-4 font-noto text-2xl md:text-3xl lg:text-4xl drop-shadow-md">
                      {article.title}
                    </h3>
                    
                    <p className="text-white/90 text-sm md:text-base line-clamp-2 md:line-clamp-3 font-noto leading-relaxed max-w-2xl mb-6">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/40 shadow-sm">
                        <img src={article.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=random`} alt={article.author} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white tracking-wide">{article.author}</span>
                        <span className="text-xs text-white/70 font-noto">{article.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Small horizontal title for COMPRESSED state */}
                <div className={`absolute bottom-0 left-0 w-full p-4 lg:p-6 flex items-end pointer-events-none transition-all duration-500 z-10
                  ${isActive ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0 lg:opacity-100'}`}>
                  <div className="bg-gradient-to-t from-black/60 to-transparent absolute inset-0 transition-opacity duration-300" />
                   <h3 className="text-white font-bold text-sm lg:text-[15px] leading-snug font-noto line-clamp-3 md:line-clamp-4 drop-shadow-lg relative z-10">
                     {article.title}
                   </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
