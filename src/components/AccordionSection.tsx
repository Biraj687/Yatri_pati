import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchNewsData } from '../services/newsService';
import type { Article } from '../services/newsService';

interface AccordionSectionProps {
  title?: string;
}

export function AccordionSection({ title = 'विशेष सिफारिस' }: AccordionSectionProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [hoveredId, setHoveredId] = useState<number | string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchNewsData();
        // Use a subset of articles for the accordion
        const all = [data.hero, data.featured, ...data.articles].filter((a): a is Article => a !== null);
        setArticles(all.slice(4, 9)); // Get 5 articles
      } catch (error) {
        console.error("Failed to load accordion articles", error);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  if (loading || articles.length === 0) return null;

  return (
    <section className="w-full py-16 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-10 text-left font-noto tracking-tight">
          {title}
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-4 h-[500px] w-full overflow-hidden">
          {articles.map((article) => {
            const isHovered = hoveredId === article.id;
            
            return (
              <Link
                key={article.id}
                to={`/article/${article.id}`}
                onMouseEnter={() => setHoveredId(article.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`relative flex-grow overflow-hidden rounded-3xl transition-all duration-700 ease-in-out group shadow-md
                  ${isHovered ? 'flex-[4] lg:flex-[4]' : 'flex-[1] lg:flex-[1]'}`}
              >
                {/* Background Image */}
                <img
                  src={article.image}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500
                  ${isHovered ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'}`} 
                />
                
                {/* Content - Revealed on hover or always partially visible */}
                <div className={`absolute bottom-0 left-0 w-full p-6 transition-all duration-500 
                  ${isHovered ? 'translate-y-0 opacity-100' : 'lg:translate-y-4 lg:opacity-0'}`}>
                  
                  <span className="inline-block bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter mb-2">
                    {article.category}
                  </span>
                  
                  <h3 className={`text-white font-bold leading-tight mb-2 font-noto 
                    ${isHovered ? 'text-xl md:text-2xl' : 'text-sm md:text-base line-clamp-1'}`}>
                    {article.title}
                  </h3>
                  
                  {isHovered && (
                    <div className="flex flex-col gap-3 animate-fadeIn">
                       <p className="text-white/80 text-xs md:text-sm line-clamp-2 md:line-clamp-3 font-noto leading-relaxed max-w-lg">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30">
                          <img src={article.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=random`} alt={article.author} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-[11px] md:text-xs text-white/90">
                          <span className="font-bold">{article.author}</span>
                          <span className="mx-1">•</span>
                          <span className="font-noto">{article.date}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Vertical title for collapsed state (desktop only) */}
                <div className={`absolute top-0 right-0 h-full w-12 flex items-center justify-center pointer-events-none transition-opacity duration-500
                  ${isHovered ? 'opacity-0' : 'opacity-0 lg:opacity-100'}`}>
                   <span className="text-white/60 font-bold uppercase tracking-[0.3em] whitespace-nowrap rotate-90 text-xs">
                    सविस्तार  पढ्नुहोस्
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
