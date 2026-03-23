import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import type { Article } from '../services/newsService';
import { OptimizedImage } from './OptimizedImage';

export function CompactArticle({
  article,
  index,
  minimal = false
}: {
  article: Article,
  index: number,
  minimal?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(ref as import('react').RefObject<Element>, { threshold: 0.1, rootMargin: '-50px 0px' });
  const articleUrl = `/news/${article.id}`;
  
  return (
    <article
      ref={ref}
      className={`relative rounded-xl transition-all duration-300 opacity-0 translate-y-4 text-left group
        ${minimal ? 'p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50' : 'p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30'}
        ${isVisible ? 'opacity-100 translate-y-0' : ''}`}
      style={{ animationDelay: `${index * 0.1}s`, transition: 'opacity 0.6s ease, transform 0.6s ease' }}
    >
      <Link to={articleUrl} className={`flex gap-4 items-center ${minimal ? 'h-auto' : 'h-full'}`}>
        {/* Thumbnail */}
        <div className={`overflow-hidden rounded-lg flex-shrink-0 transition-all duration-300
          ${minimal ? 'w-24 h-20 md:w-28 md:h-24' : 'w-32 h-24 md:w-40 md:h-28'}`}>
          <OptimizedImage
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            width={minimal ? 112 : 160}
            height={minimal ? 96 : 112}
            lazy={true}
            fallbackSrc="https://via.placeholder.com/200x150?text=Image+Not+Available"
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <h3 className={`font-bold text-gray-800 dark:text-gray-100 mb-1.5 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2
            ${minimal ? 'text-sm md:text-base' : 'text-base md:text-lg'}`}>
            {article.title}
          </h3>
          <div className={`flex items-center text-gray-600 dark:text-gray-400 ${minimal ? 'mb-0.5 text-[10px] md:text-xs' : 'mb-2 text-xs md:text-sm'}`}>
            <div className="w-5 h-5 rounded-full overflow-hidden mr-2 border border-gray-100 flex-shrink-0">
              <OptimizedImage
                src={article.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=random`}
                alt={article.author}
                className="w-full h-full object-cover"
                width={20}
                height={20}
                lazy={true}
                fallbackSrc="https://ui-avatars.com/api/?name=Author&background=random"
              />
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300 truncate">{article.author}</span>
            <span className="mx-1.5 text-gray-300 dark:text-gray-600">•</span>
            <span className="text-gray-500 dark:text-gray-400 font-noto truncate">{article.date}</span>
          </div>
          {!minimal && (
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed line-clamp-2 font-noto opacity-80">{article.excerpt}</p>
          )}
        </div>
      </Link>
    </article>
  );
}
