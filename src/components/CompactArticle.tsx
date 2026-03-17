import { useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import type { Article } from '../services/newsService';

export function CompactArticle({ article, index, totalLength }: { article: Article, index: number, totalLength: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(ref as import('react').RefObject<Element>, { threshold: 0.1, rootMargin: '-50px 0px' });
  
  return (
    <article
      ref={ref}
      className={`samachar-list-item threed-unfold unfold-item ${isVisible ? 'is-visible' : ''} ${
        index < totalLength - 1 ? 'samachar-list-item--bordered' : ''
      }`}
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <div className="samachar-list-content">
        <h3 className="samachar-list-title">{article.title}</h3>
        <div className="samachar-meta">
          <img src={article.authorAvatar || ''} alt="Author" className="samachar-avatar" />
          <span className="samachar-author">{article.author}</span>
          <span className="samachar-sep">—</span>
          <span className="samachar-date">{article.date}</span>
        </div>
        <p className="samachar-excerpt">{article.excerpt}</p>
      </div>
      <img src={article.image} alt="Thumbnail" className="samachar-list-thumb" />
    </article>
  );
}
