import { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { searchArticles } from '../services/newsService';
import type { Article } from '../services/newsService';

interface SearchContextType {
  // Search state
  searchQuery: string;
  searchResults: Article[];
  isSearching: boolean;
  searchError: string | null;
  
  // Actions
  setSearchQuery: (query: string) => void;
  performSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
  
  // UI state
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchProviderProps {
  children: ReactNode;
  debounceDelay?: number;
}

export function SearchProvider({ children, debounceDelay = 300 }: SearchProviderProps) {
  const [searchQuery, setSearchQueryState] = useState('');
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchTimeoutRef = useRef<number | null>(null);

  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await searchArticles(query, 10);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchError('Failed to perform search. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced setSearchQuery
  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    if (query.trim()) {
      const timeout = setTimeout(() => {
        performSearch(query);
      }, debounceDelay);
      searchTimeoutRef.current = timeout;
    } else {
      setSearchResults([]);
      setSearchError(null);
    }
  }, [debounceDelay, performSearch]);

  const clearSearch = useCallback(() => {
    setSearchQueryState('');
    setSearchResults([]);
    setSearchError(null);
    setIsSearching(false);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
  }, []);

  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);
  const toggleSearch = useCallback(() => setIsSearchOpen(prev => !prev), []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const value = useMemo(() => ({
    searchQuery,
    searchResults,
    isSearching,
    searchError,
    setSearchQuery,
    performSearch,
    clearSearch,
    isSearchOpen,
    openSearch,
    closeSearch,
    toggleSearch,
  }), [
    searchQuery,
    searchResults,
    isSearching,
    searchError,
    setSearchQuery,
    performSearch,
    clearSearch,
    isSearchOpen,
    openSearch,
    closeSearch,
    toggleSearch,
  ]);

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}