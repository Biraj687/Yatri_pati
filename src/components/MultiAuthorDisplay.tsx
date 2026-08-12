import React from 'react';
import { FiUser, FiUsers } from 'react-icons/fi';
import type { Author } from '@types';
import { OptimizedImage } from './OptimizedImage';

export interface MultiAuthorDisplayProps {
  authors?: Author[];
  author?: string; // Legacy single author
  maxDisplay?: number;
  showAvatars?: boolean;
  showRoles?: boolean;
  className?: string;
  avatarSize?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical' | 'compact';
}

export const MultiAuthorDisplay: React.FC<MultiAuthorDisplayProps> = ({
  authors,
  author,
  maxDisplay = 3,
  showAvatars = true,
  showRoles = false,
  className = '',
  avatarSize = 'md',
  layout = 'horizontal',
}) => {
  // Determine which authors to display
  const displayAuthors: Author[] = [];
  
  if (authors && authors.length > 0) {
    // Use the new authors array
    displayAuthors.push(...authors.slice(0, maxDisplay));
  } else if (author) {
    // Fallback to legacy single author
    displayAuthors.push({ name: author });
  }
  
  if (displayAuthors.length === 0) {
    return null;
  }

  const isSingleAuthor = displayAuthors.length === 1;
  const remainingCount = authors ? authors.length - maxDisplay : 0;
  
  const avatarClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const renderAuthor = (authorObj: Author, index: number) => {
    const avatarClass = `${avatarClasses[avatarSize]} rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0`;
    
    return (
      <div 
        key={index} 
        className={`flex items-center gap-2 ${layout === 'vertical' ? 'mb-2 last:mb-0' : ''}`}
      >
        {showAvatars && (
          <div className={avatarClass}>
            {authorObj.avatar ? (
              <OptimizedImage
                src={authorObj.avatar}
                alt={authorObj.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                <FiUser className="w-3/5 h-3/5 text-white" />
              </div>
            )}
          </div>
        )}
        
        <div className="min-w-0">
          <div className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
            {authorObj.name}
          </div>
          {showRoles && authorObj.role && (
            <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {authorObj.role}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCompact = () => {
    if (displayAuthors.length === 1) {
      return renderAuthor(displayAuthors[0], 0);
    }
    
    return (
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {displayAuthors.slice(0, 3).map((authorObj, index) => (
            <div 
              key={index} 
              className={`${avatarClasses[avatarSize]} rounded-full overflow-hidden border-2 border-white dark:border-gray-800`}
            >
              {authorObj.avatar ? (
                <OptimizedImage
                  src={authorObj.avatar}
                  alt={authorObj.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                  <FiUser className="w-3/5 h-3/5 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex flex-col">
          <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
            {isSingleAuthor ? displayAuthors[0].name : `${displayAuthors.length} लेखकहरू`}
          </div>
          {remainingCount > 0 && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              +{remainingCount} थप
            </div>
          )}
        </div>
      </div>
    );
  };

  if (layout === 'compact') {
    return (
      <div className={`flex items-center ${className}`}>
        {renderCompact()}
      </div>
    );
  }

  return (
    <div className={`flex ${layout === 'vertical' ? 'flex-col' : 'flex-wrap items-center gap-3'} ${className}`}>
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        {isSingleAuthor ? (
          <FiUser className="w-4 h-4 flex-shrink-0" />
        ) : (
          <FiUsers className="w-4 h-4 flex-shrink-0" />
        )}
        <span className="text-sm font-medium">
          {isSingleAuthor ? 'लेखक:' : 'लेखकहरू:'}
        </span>
      </div>
      
      <div className={`flex ${layout === 'vertical' ? 'flex-col gap-2' : 'flex-wrap items-center gap-3'}`}>
        {displayAuthors.map((authorObj, index) => renderAuthor(authorObj, index))}
        
        {remainingCount > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            +{remainingCount} थप
          </div>
        )}
      </div>
    </div>
  );
};