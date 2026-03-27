import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useIntersectionObserver } from '@hooks/useIntersectionObserver';
import type { Article } from '@types';
import { OptimizedImage } from './OptimizedImage';

export function FeaturedArticle({ article }: { article: Article }) {
  const featuredRef = useRef<HTMLElement>(null);
  const featuredVisible = useIntersectionObserver(featuredRef as import('react').RefObject<Element>, { threshold: 0.2, rootMargin: '-100px 0px' });
  
  // Use thumbnailImage if available, otherwise fall back to main image
  const displayImage = article.thumbnailImage || article.image;

  return (
    <article
      ref={featuredRef}
      className={`relative rounded-xl border border-[#e0e0e0] dark:border-gray-600 transition-all duration-300 opacity-0 translate-y-4 text-left bg-white dark:bg-gray-800 h-full flex flex-col gap-0 p-0 overflow-hidden ${featuredVisible ? 'opacity-100 translate-y-0' : ''}`}
      style={{ animationDelay: '0s', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
    >
      <Link to={`/news/${article.id}`} className="contents">
        {/* Thumbnail - Top */}
        <div className="overflow-hidden w-full h-48 md:h-64 flex-shrink-0">
          <OptimizedImage
            src={displayImage}
            alt={article.title}
            className="w-full h-full object-cover"
            width={400}
            height={400}
            lazy={true}
            fallbackSrc="https://via.placeholder.com/400x400?text=Image+Not+Available"
          />
        </div>
        
        {/* Content - Below image */}
        <div className="flex-1 flex flex-col justify-center min-w-0 p-6 md:p-8">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 leading-[2.45rem] line-clamp-2 text-3xl md:text-3xl">
            {article.title}
          </h3>
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4 text-xs md:text-sm">
            <div className="w-6 h-6 rounded-full overflow-hidden mr-2 border border-gray-100 flex-shrink-0">
              <OptimizedImage
                src={article.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=random`}
                alt={article.author}
                className="w-full h-full object-cover"
                width={24}
                height={24}
                lazy={true}
                fallbackSrc="https://ui-avatars.com/api/?name=Author&background=random"
              />
            </div>
            <span className="font-semibold text-gray-700 dark:text-gray-300 truncate">{article.author}</span>
            <span className="mx-1.5 text-gray-300 dark:text-gray-600">•</span>
            <span className="text-gray-500 dark:text-gray-400 font-noto truncate">{article.date}</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed line-clamp-3 font-noto opacity-80">
            {article.excerpt}
          </p>
        </div>

      </Link>
    </article>
  );
}
