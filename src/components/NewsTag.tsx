import React from 'react';

export interface NewsTagProps {
  label: string;
  variant?: 'breaking' | 'current-affairs' | 'default';
  className?: string;
}

export const NewsTag: React.FC<NewsTagProps> = ({
  label,
  variant = 'default',
  className = '',
}) => {
  const baseClasses = 'inline-block px-2 py-1 text-xs font-bold uppercase tracking-wide rounded';
  
  const variantClasses = {
    'breaking': 'bg-brand-red text-white',
    'current-affairs': 'bg-brand-blue text-white',
    'default': 'bg-gray-800 text-white',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {label}
    </span>
  );
};