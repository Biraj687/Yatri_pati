import React from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '@types';
import { OptimizedImage } from './OptimizedImage';

export type LayoutType = 
  | 'two-column'          // Two equal columns side by side
  | 'split-large-left'    // Large cards on left, horizontal on right
  | 'grid-3'              // 3-column grid
  | 'grid-4'              // 4-column grid
  | 'list-vertical'       // Vertical list
  | 'list-horizontal';    // Horizontal list

export interface NewsSectionProps {
  title: string;
  articles: Article[];
  layoutType?: LayoutType;
  maxArticles?: number;
  showCategory?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  className?: string;
  titleClassName?: string;
  containerClassName?: string;
  articleClassName?: string;
  imageHeight?: string;
  truncateLines?: number;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  title,
  articles,
  layoutType = 'two-column',
  maxArticles = 6,
  showCategory = true,
  showAuthor = true,
  showDate = true,
  className = '',
  titleClassName = '',
  containerClassName = '',
  articleClassName = '',
  imageHeight = 'h-48',
  truncateLines = 2,
}) => {
  const displayedArticles = articles.slice(0, maxArticles);
  
  if (displayedArticles.length === 0) {
    return null;
  }

  const renderArticle = (article: Article, index: number, isLarge = false) => {
    const titleClasses = isLarge
      ? 'text-3xl md:text-4xl font-bold leading-[2.5rem]'
      : 'text-xl font-bold leading-[2.5rem]';
    
    const containerClasses = `group transition-all duration-300 ${articleClassName} ${
      isLarge ? 'min-h-[300px]' : ''
    }`;

    return (
      <Link
        key={article.id}
        to={`/news/${article.id}`}
        className={containerClasses}
      >
        <div className={`overflow-hidden rounded-lg mb-4 ${isLarge ? 'h-64' : imageHeight}`}>
          <OptimizedImage
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {showCategory && article.category && (
            <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-xs font-medium px-3 py-1 rounded-full">
              {article.category}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className={`${titleClasses} text-gray-900 dark:text-gray-100 line-clamp-${truncateLines}`}>
            {article.title}
          </h3>
          
          {(showAuthor || showDate) && (
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              {showAuthor && article.author && (
                <span className="font-medium">{article.author}</span>
              )}
              {showAuthor && showDate && article.date && (
                <span className="opacity-50">—</span>
              )}
              {showDate && article.date && (
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString('ne-NP', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              )}
            </div>
          )}
          
          {article.excerpt && !isLarge && (
            <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
              {article.excerpt}
            </p>
          )}
        </div>
      </Link>
    );
  };

  const renderLayout = () => {
    switch (layoutType) {
      case 'two-column':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayedArticles.map((article, index) => (
              <div key={article.id} className="flex flex-col">
                {renderArticle(article, index)}
              </div>
            ))}
          </div>
        );

      case 'split-large-left':
        const leftArticles = displayedArticles.slice(0, 2);
        const rightArticles = displayedArticles.slice(2);
        
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Large Cards */}
            <div className="flex flex-col gap-6">
              {leftArticles.map((article, index) => (
                <div key={article.id}>
                  {renderArticle(article, index, true)}
                </div>
              ))}
            </div>
            
            {/* Right Column - Horizontal List */}
            <div className="flex flex-col gap-4">
              {rightArticles.map((article, index) => (
                <div key={article.id} className="flex gap-4 items-start">
                  <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <OptimizedImage
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-2 mb-1 leading-[2.5rem]">
                      {article.title}
                    </h4>
                    {showAuthor && article.author && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {article.author}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'grid-3':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedArticles.map((article, index) => (
              <div key={article.id}>
                {renderArticle(article, index)}
              </div>
            ))}
          </div>
        );

      case 'grid-4':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedArticles.map((article, index) => (
              <div key={article.id}>
                {renderArticle(article, index)}
              </div>
            ))}
          </div>
        );

      case 'list-vertical':
        return (
          <div className="flex flex-col gap-6">
            {displayedArticles.map((article, index) => (
              <div key={article.id} className="flex gap-6">
                <div className="w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <OptimizedImage
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 leading-[2.5rem]">
                    {article.title}
                  </h4>
                  {article.excerpt && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case 'list-horizontal':
        return (
          <div className="flex overflow-x-auto gap-6 pb-4 -mx-4 px-4">
            {displayedArticles.map((article, index) => (
              <div key={article.id} className="w-64 flex-shrink-0">
                {renderArticle(article, index)}
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayedArticles.map((article, index) => (
              <div key={article.id}>
                {renderArticle(article, index)}
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <section className={`py-12 w-full transition-colors duration-300 ${className}`}>
      <div className={`max-w-7xl mx-auto px-4 md:px-8 lg:px-[5rem] ${containerClassName}`}>
        <h2 className={`text-5xl font-bold text-gray-800 dark:text-gray-100 mb-8 border-b-4 border-[#e0e0e0] dark:border-gray-600 pb-3 text-left ${titleClassName}`}>
          {title}
        </h2>
        
        {renderLayout()}
        
        {articles.length > maxArticles && (
          <div className="mt-8 text-center">
            <Link
              to="#"
              className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
            >
              <span>सबै हेर्नुहोस्</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};