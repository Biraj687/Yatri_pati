import { useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import type { Article } from '../services/newsService';

export function FeaturedArticle({ article }: { article: Article }) {
  const featuredRef = useRef<HTMLElement>(null);
  const featuredVisible = useIntersectionObserver(featuredRef as import('react').RefObject<Element>, { threshold: 0.2, rootMargin: '-100px 0px' });

  return (
    <article 
      ref={featuredRef} 
      className={`samachar-featured threed-unfold ${featuredVisible ? 'is-visible' : ''}`}
    >
      <a href="#" className="samachar-featured-img-link">
        <img src={article.image} alt="Featured Article" className="samachar-featured-img" />
      </a>
      <h3 className="samachar-featured-title">{article.title}</h3>
      <div className="samachar-meta">
        <img src={article.authorAvatar || ''} alt="Author" className="samachar-avatar" />
        <span className="samachar-author">{article.author}</span>
        <span className="samachar-sep">—</span>
        <span className="samachar-date">{article.date}</span>
      </div>
      <p className="samachar-excerpt">{article.excerpt}</p>
    </article>
  );
}
