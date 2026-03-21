import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import type { Article } from '../services/newsService';

export function FeaturedArticle({ article }: { article: Article }) {
  const featuredRef = useRef<HTMLElement>(null);
  const featuredVisible = useIntersectionObserver(featuredRef as import('react').RefObject<Element>, { threshold: 0.2, rootMargin: '-100px 0px' });

  return (
    <article 
      ref={featuredRef} 
      className={`transition-all duration-300 opacity-0 translate-y-8 text-left h-full ${featuredVisible ? 'opacity-100 translate-y-0' : ''}`}
    >
      <Link to={`/article/${article.id}`} className="flex flex-col h-full group">
        <div className="w-full h-[250px] md:h-[280px] overflow-hidden flex-shrink-0 rounded-xl">
          <img 
            src={article.image} 
            alt="Featured Article" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        </div>
        <div className="p-6 pt-5 flex flex-col flex-grow">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {article.title}
          </h3>
          <div className="flex items-center mb-4 text-sm text-gray-700 dark:text-gray-400">
            <img src={article.authorAvatar || ''} alt="Author" className="w-8 h-8 rounded-full mr-3 border border-gray-200 dark:border-gray-700" />
            <span className="font-bold">{article.author}</span>
            <span className="mx-2 text-gray-400 dark:text-gray-600">—</span>
            <span className="text-gray-500 dark:text-gray-400">{article.date}</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
}
