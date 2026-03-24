import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { useSearch } from '@context/SearchContext';
import type { Article } from '@types';
import { UI_STRINGS } from '@utils/constants';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  autoFocus?: boolean;
  initialValue?: string;
  useContext?: boolean;
}

export function SearchBar({
  placeholder = 'समाचार खोज्नुहोस्...',
  onSearch,
  className = '',
  autoFocus = false,
  initialValue = '',
  useContext = true
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const searchContext = useSearch();

  // Handle search query changes - directly use context's debounced search
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Use context's debounced search if available
    if (useContext) {
      searchContext.setSearchQuery(value);
    }
    
    // Call onSearch callback if provided
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    setQuery('');
    
    if (useContext) {
      searchContext.clearSearch();
    }
    
    if (onSearch) {
      onSearch('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Use context's search if available
      if (useContext) {
        searchContext.setSearchQuery(query);
      }
      
      // Call onSearch callback if provided
      if (onSearch) {
        onSearch(query);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
        />
        
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label={UI_STRINGS.CLEAR_SEARCH}
          >
            <FiX className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
          </button>
        )}
      </div>
      
      {/* Search tips */}
      {!query && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="hidden sm:inline">
            {UI_STRINGS.SEARCH_HELP}
          </span>
        </div>
      )}
    </form>
  );
}

// Search results component
interface SearchResultsProps {
  query: string;
  results: Article[];
  isLoading: boolean;
  error: Error | null;
  onResultClick?: (result: Article) => void;
  className?: string;
}

export function SearchResults({
  query,
  results,
  isLoading,
  error,
  onResultClick,
  className = ''
}: SearchResultsProps) {
  if (!query.trim()) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mt-2 ${className}`}>
        <div className="p-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">{UI_STRINGS.SEARCHING}</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mt-2 ${className}`}>
        <div className="p-4 text-red-600 dark:text-red-400">
          <p>{UI_STRINGS.SEARCH_ERROR}</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mt-2 ${className}`}>
        <div className="p-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            "{query}" {UI_STRINGS.SEARCH_NO_RESULTS}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mt-2 max-h-96 overflow-y-auto ${className}`}>
      <div className="p-2">
        <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
          {results.length} {UI_STRINGS.SEARCH_RESULTS_FOUND}
        </div>
        
        {results.map((result, index) => (
          <button
            key={result.id || index}
            onClick={() => onResultClick?.(result)}
            className="w-full text-left px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700"
          >
            <div className="flex items-start gap-3">
              {result.image && (
                <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden">
                  <img
                    src={result.image}
                    alt={result.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {result.title}
                </h4>
                {result.category && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                    {result.category}
                  </span>
                )}
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {result.author} • {result.date}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}