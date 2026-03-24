import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useIntersectionObserver } from '@hooks/useIntersectionObserver';
import type { Article } from '@types';
import { OptimizedImage } from './OptimizedImage';

export function FeaturedArticle({ article }: { article: Article }) {
  const featuredRef = useRef<HTMLElement>(null);
  const featuredVisible = useIntersectionObserver(featuredRef as import('react').RefObject<Element>, { threshold: 0.2, rootMargin: '-100px 0px' });

  return (
    <article 
      ref={featuredRef} 
      className={`relative rounded-xl border border-black dark:border-gray-600 transition-all duration-300 opacity-0 translate-y-4 text-left bg-white dark:bg-gray-800 h-full flex flex-col gap-4 p-0 overflow-hidden ${featuredVisible ? 'opacity-100 translate-y-0' : ''}`}
      style={{ animationDelay: '0s', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
    >
      <Link to={`/news/${article.id}`} className="contents">
        {/* Thumbnail - Full width at top */}
        <div className="overflow-hidden w-full h-64 md:h-96 flex-shrink-0">
          <OptimizedImage
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
            width={600}
            height={400}
            lazy={true}
            fallbackSrc="https://via.placeholder.com/600x400?text=Image+Not+Available"
          />
        </div>
        
        {/* Content - Below image */}
        <div className="flex-1 flex flex-col justify-start min-w-0 p-4">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2 leading-tight line-clamp-3 text-base md:text-lg">
            {article.title}
          </h3>
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3 text-xs md:text-sm">
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
          <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm leading-relaxed line-clamp-3 font-noto opacity-80">
            {article.excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
}
