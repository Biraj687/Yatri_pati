import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchNewsData } from '@services/newsService';
import { useState } from 'react';
import type { Article } from '@types';

interface AccordionSectionProps {
  title?: string;
}

export function AccordionSection({ title = 'विशेष सिफारिस' }: AccordionSectionProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchNewsData();
        const all = [data.hero, data.featured, ...data.articles].filter((a): a is Article => a !== null);
        const placed = all.filter((a) => (a as any).homepageSectionId === 'trending');
        const sliced = (placed.length > 0 ? placed : all).slice(0, 3);
        setArticles(sliced);
      } catch (error) {
        console.error("Failed to load section articles", error);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  if (loading || articles.length === 0) return null;

  // Take only 3 articles max
  const displayArticles = articles.slice(0, 3);

  return (
    <section className="w-full py-16 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[5rem]">
        <h2 className="text-4xl font-extrabold text-secondary-700 dark:text-secondary-300 mb-10 text-left font-noto font-akshar border-b-4 border-brand-red inline-block pb-2">
          {title}
        </h2>
        
        {/* 3-Box Grid Layout - All Boxes Always Visible */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto lg:h-[550px]">
          {displayArticles.map((article) => {
            const displayImage = article.thumbnailImage || article.image;
            
            return (
              <Link
                key={article.id}
                to={`/news/${article.id}`}
                className="group relative overflow-hidden rounded-xl border border-[#e0e0e0] dark:border-gray-600 transition-all duration-300 hover:shadow-xl h-full"
              >
                {/* Background Image */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={displayImage}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent transition-all duration-300 group-hover:from-black/80" />
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
                  <h3 className="text-white text-lg md:text-xl font-bold mb-3 drop-shadow-lg line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-white/80 text-xs md:text-sm line-clamp-2 md:line-clamp-1 mb-4 drop-shadow-md">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/40 flex-shrink-0">
                      <img 
                        src={article.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=random`} 
                        alt={article.author} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-xs font-semibold truncate drop-shadow-md">{article.author}</p>
                      <p className="text-white/70 text-[11px] font-noto">{article.date}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
