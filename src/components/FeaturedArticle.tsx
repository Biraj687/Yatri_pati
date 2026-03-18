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
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 mb-5 opacity-0 translate-y-8 text-left ${featuredVisible ? 'opacity-100 translate-y-0' : ''}`}
    >
      <Link to={`/article/${article.id}`} className="block overflow-hidden group">
        <img src={article.image} alt="Featured Article" className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="p-5">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
          <div className="flex items-center mb-4 text-sm text-gray-700">
            <img src={article.authorAvatar || ''} alt="Author" className="w-8 h-8 rounded-full mr-3 border border-gray-200" />
            <span className="font-bold">{article.author}</span>
            <span className="mx-2 text-gray-400">—</span>
            <span className="text-gray-500">{article.date}</span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-2 line-clamp-3">
            {article.excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
}
