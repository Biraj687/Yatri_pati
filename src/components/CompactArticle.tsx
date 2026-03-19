import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import type { Article } from '../services/newsService';

export function CompactArticle({ article, index }: { article: Article, index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(ref as import('react').RefObject<Element>, { threshold: 0.1, rootMargin: '-50px 0px' });
  
  return (
    <article
      ref={ref}
      className={`relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 opacity-0 translate-y-4 text-left h-full group ${isVisible ? 'opacity-100 translate-y-0' : ''}`}
      style={{ animationDelay: `${index * 0.15}s`, transition: 'opacity 0.6s ease, transform 0.6s ease' }}
    >
      <Link to={`/article/${article.id}`} className="flex gap-5 h-full items-center">
        {/* Thumbnail on the LEFT */}
        <div className="overflow-hidden rounded-lg flex-shrink-0 w-32 h-24 md:w-40 md:h-28">
          <img 
            src={article.image} 
            alt="Thumbnail" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        </div>
        
        {/* News content on the RIGHT */}
        <div className="flex-1 flex flex-col justify-center">
          <h3 className="text-base md:text-lg font-bold text-gray-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
          <div className="flex items-center mb-2 text-xs md:text-sm text-gray-600">
            <img src={article.authorAvatar || ''} alt="Author" className="w-5 h-5 rounded-full mr-2" />
            <span className="font-semibold text-gray-700">{article.author}</span>
            <span className="mx-2 text-gray-400">—</span>
            <span className="text-gray-500">{article.date}</span>
          </div>
          <p className="text-gray-600 text-xs md:text-sm leading-relaxed line-clamp-2">{article.excerpt}</p>
        </div>
      </Link>
    </article>
  );
}
