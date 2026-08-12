import React from 'react';
import { Link } from 'react-router-dom';
import { FiTag, FiHash } from 'react-icons/fi';

export interface TagDisplayProps {
  tags?: string[];
  slug?: string;
  maxDisplay?: number;
  showIcon?: boolean;
  variant?: 'default' | 'pill' | 'compact';
  className?: string;
  tagClassName?: string;
  onTagClick?: (tag: string) => void;
}

export const TagDisplay: React.FC<TagDisplayProps> = ({
  tags,
  slug,
  maxDisplay = 5,
  showIcon = true,
  variant = 'default',
  className = '',
  tagClassName = '',
  onTagClick,
}) => {
  const displayTags = tags?.slice(0, maxDisplay) || [];
  const remainingCount = tags ? Math.max(0, tags.length - maxDisplay) : 0;
  
  if (displayTags.length === 0 && !slug) {
    return null;
  }

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    if (onTagClick) {
      e.preventDefault();
      onTagClick(tag);
    }
  };

  const renderTag = (tag: string, index: number) => {
    const tagUrl = `/tag/${encodeURIComponent(tag.toLowerCase())}`;
    
    const baseClasses = `transition-colors duration-200 ${
      variant === 'pill' 
        ? 'px-3 py-1.5 rounded-full text-sm' 
        : variant === 'compact'
        ? 'px-2 py-1 rounded text-xs'
        : 'px-2.5 py-1 rounded-md text-sm'
    } ${tagClassName}`;
    
    const tagContent = (
      <>
        {variant === 'compact' && <FiHash className="w-3 h-3 inline mr-1" />}
        {tag}
      </>
    );

    if (onTagClick) {
      return (
        <button
          key={index}
          onClick={(e) => handleTagClick(tag, e)}
          className={`${baseClasses} bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700`}
        >
          {tagContent}
        </button>
      );
    }

    return (
      <Link
        key={index}
        to={tagUrl}
        className={`${baseClasses} bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700`}
      >
        {tagContent}
      </Link>
    );
  };

  const renderSlug = () => {
    if (!slug) return null;
    
    const slugUrl = `/news/${slug}`;
    const slugDisplay = `#${slug.slice(0, 20)}${slug.length > 20 ? '...' : ''}`;
    
    return (
      <div className="flex items-center gap-2">
        {showIcon && <FiTag className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
        <Link
          to={slugUrl}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-mono"
          title={slug}
        >
          {slugDisplay}
        </Link>
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
        {showIcon && tags && tags.length > 0 && (
          <FiTag className="w-3 h-3 text-gray-400 dark:text-gray-500" />
        )}
        {displayTags.map((tag, index) => renderTag(tag, index))}
        {remainingCount > 0 && (
          <span className="text-xs text-gray-500 dark:text-gray-400 px-1">
            +{remainingCount}
          </span>
        )}
        {slug && renderSlug()}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {(tags && tags.length > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          {showIcon && <FiTag className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            ट्यागहरू:
          </span>
          {displayTags.map((tag, index) => renderTag(tag, index))}
          {remainingCount > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400 px-2">
              +{remainingCount} थप
            </span>
          )}
        </div>
      )}
      
      {slug && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            स्लग:
          </span>
          {renderSlug()}
        </div>
      )}
    </div>
  );
};