import { Link } from 'react-router-dom';
import { FiUser, FiCalendar, FiClock, FiEye } from 'react-icons/fi';
import type { Article } from '../services/newsService';
import { OptimizedImage } from './OptimizedImage';

interface NewsCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'featured' | 'horizontal';
  showCategory?: boolean;
  showExcerpt?: boolean;
  showMeta?: boolean;
  className?: string;
}

export function NewsCard({
  article,
  variant = 'default',
  showCategory = true,
  showExcerpt = true,
  showMeta = true,
  className = ''
}: NewsCardProps) {
  const articleUrl = `/news/${article.id}`;
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'compact':
        return 'flex flex-row gap-4';
      case 'featured':
        return 'flex flex-col h-full';
      case 'horizontal':
        return 'flex flex-row gap-6 items-center';
      default:
        return 'flex flex-col h-full';
    }
  };

  const getImageSize = () => {
    switch (variant) {
      case 'compact':
        return 'w-24 h-24 md:w-32 md:h-32';
      case 'featured':
        return 'w-full h-48 md:h-56';
      case 'horizontal':
        return 'w-32 h-32 md:w-48 md:h-40';
      default:
        return 'w-full h-48 md:h-56';
    }
  };

  const getContentPadding = () => {
    switch (variant) {
      case 'compact':
        return 'p-0';
      case 'horizontal':
        return 'p-0';
      default:
        return 'p-4 md:p-6';
    }
  };

  return (
    <Link
      to={articleUrl}
      className={`group block ${getVariantClasses()} ${className} ${
        variant === 'default' || variant === 'featured'
          ? 'bg-white dark:bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1'
          : ''
      }`}
    >
      {/* Image */}
      {(variant === 'default' || variant === 'featured' || variant === 'horizontal') && article.image && (
        <div className={`${getImageSize()} overflow-hidden rounded-lg flex-shrink-0`}>
          <OptimizedImage
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            width={variant === 'horizontal' ? 192 : 400}
            height={variant === 'horizontal' ? 160 : 300}
            lazy={true}
            fallbackSrc="https://via.placeholder.com/400x300?text=Image+Not+Available"
          />
        </div>
      )}

      {/* Compact variant image */}
      {variant === 'compact' && article.image && (
        <div className={`${getImageSize()} overflow-hidden rounded-lg flex-shrink-0`}>
          <OptimizedImage
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            width={128}
            height={128}
            lazy={true}
            fallbackSrc="https://via.placeholder.com/150x150?text=Image+Not+Available"
          />
        </div>
      )}

      {/* Content */}
      <div className={`flex-1 ${getContentPadding()} flex flex-col`}>
        {/* Category */}
        {showCategory && article.category && (
          <div className="mb-2">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 rounded-full">
              {article.category}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className={`font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors ${
          variant === 'compact' ? 'text-base line-clamp-2' :
          variant === 'horizontal' ? 'text-lg md:text-xl line-clamp-2' :
          'text-xl md:text-2xl line-clamp-2'
        }`}>
          {article.title}
        </h3>

        {/* Excerpt */}
        {showExcerpt && article.excerpt && (
          <p className={`mt-2 text-gray-600 dark:text-gray-400 line-clamp-2 ${
            variant === 'compact' ? 'text-sm' : 'text-base'
          }`}>
            {article.excerpt}
          </p>
        )}

        {/* Meta Information */}
        {showMeta && (
          <div className="mt-auto pt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <FiUser className="w-3 h-3" />
              <span className="truncate">{article.author}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <FiCalendar className="w-3 h-3" />
              <span>{article.date}</span>
            </div>
            
            {article.readTime && (
              <div className="flex items-center gap-1">
                <FiClock className="w-3 h-3" />
                <span>{article.readTime}</span>
              </div>
            )}
            
            {article.views && (
              <div className="flex items-center gap-1">
                <FiEye className="w-3 h-3" />
                <span>{article.views.toLocaleString()}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

// NewsGrid component for displaying multiple news cards
interface NewsGridProps {
  articles: Article[];
  variant?: NewsCardProps['variant'];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function NewsGrid({
  articles,
  variant = 'default',
  columns = 3,
  className = ''
}: NewsGridProps) {
  const getGridColumns = () => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  const getGap = () => {
    switch (variant) {
      case 'compact': return 'gap-4';
      case 'horizontal': return 'gap-6';
      default: return 'gap-6 md:gap-8';
    }
  };

  return (
    <div className={`grid ${getGridColumns()} ${getGap()} ${className}`}>
      {articles.map((article) => (
        <NewsCard
          key={article.id}
          article={article}
          variant={variant}
        />
      ))}
    </div>
  );
}