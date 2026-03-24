import { FaNewspaper, FaSearch } from 'react-icons/fa';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: 'news' | 'search';
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ 
  title = 'कुनै समाचार भेटिएन',
  message = 'तपाईंले खोज्नुभएको क्राइटेरियामा कुनै समाचार भेटिएन।',
  icon = 'news',
  action,
  className = ''
}: EmptyStateProps) {
  const IconComponent = icon === 'search' ? FaSearch : FaNewspaper;
  const iconColor = icon === 'search' ? 'text-blue-500' : 'text-gray-400';

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className={`mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-full ${iconColor}`}>
        <IconComponent className="w-12 h-12" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        {message}
      </p>
      
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}

// Specific empty state for search results
export function SearchEmptyState({ query, onClearSearch }: { query: string; onClearSearch?: () => void }) {
  return (
    <EmptyState
      title="खोज परिणाम भेटिएन"
      message={`"${query}" को लागि कुनै समाचार भेटिएन। अर्को खोज शब्द प्रयास गर्नुहोस्।`}
      icon="search"
      action={
        onClearSearch && (
          <button
            onClick={onClearSearch}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            खोज खाली गर्नुहोस्
          </button>
        )
      }
    />
  );
}

// Specific empty state for category
export function CategoryEmptyState({ category, onBrowseAll }: { category: string; onBrowseAll?: () => void }) {
  return (
    <EmptyState
      title={`${category} श्रेणीमा कुनै समाचार भेटिएन`}
      message={`यस समय ${category} श्रेणीमा कुनै समाचार उपलब्ध छैन।`}
      icon="news"
      action={
        onBrowseAll && (
          <button
            onClick={onBrowseAll}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            सबै समाचार हेर्नुहोस्
          </button>
        )
      }
    />
  );
}