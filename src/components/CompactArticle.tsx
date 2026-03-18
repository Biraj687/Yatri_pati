import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import type { Article } from '../services/newsService';

export function CompactArticle({ article, index, totalLength }: { article: Article, index: number, totalLength: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(ref as import('react').RefObject<Element>, { threshold: 0.1, rootMargin: '-50px 0px' });
  
  return (
    <article
      ref={ref}
      className={`relative hover:bg-gray-50 transition-colors duration-300 opacity-0 translate-y-4 text-left ${isVisible ? 'opacity-100 translate-y-0' : ''} ${
        index < totalLength - 1 ? 'border-b border-gray-200' : ''
      }`}
      style={{ animationDelay: `${index * 0.15}s`, transition: 'opacity 0.6s ease, transform 0.6s ease' }}
    >
      <Link to={`/article/${article.id}`} className="flex gap-4 py-4 w-full group">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{article.title}</h3>
          <div className="flex items-center mb-2 text-sm text-gray-600">
            <img src={article.authorAvatar || ''} alt="Author" className="w-5 h-5 rounded-full mr-2" />
            <span className="font-medium">{article.author}</span>
            <span className="mx-2">—</span>
            <span className="text-gray-500">{article.date}</span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{article.excerpt}</p>
        </div>
        <div className="overflow-hidden rounded flex-shrink-0 w-30 h-20">
          <img src={article.image} alt="Thumbnail" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>
      </Link>
    </article>
  );
}
