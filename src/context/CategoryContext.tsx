import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Category } from '../services/api';
import { newsApi } from '../services/api';

interface CategoryContextType {
  // Categories state
  categories: Category[];
  selectedCategory: Category | null;
  categoryLoading: boolean;
  categoryError: string | null;
  
  // Actions
  setSelectedCategory: (category: Category | null) => void;
  selectCategoryBySlug: (slug: string) => void;
  loadCategories: () => Promise<void>;
  clearSelectedCategory: () => void;
  
  // UI state
  isCategoryMenuOpen: boolean;
  openCategoryMenu: () => void;
  closeCategoryMenu: () => void;
  toggleCategoryMenu: () => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

interface CategoryProviderProps {
  children: ReactNode;
  initialCategorySlug?: string;
}

export function CategoryProvider({ children, initialCategorySlug }: CategoryProviderProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategoryState] = useState<Category | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  // Load categories on mount
  const loadCategories = useCallback(async () => {
    setCategoryLoading(true);
    setCategoryError(null);

    try {
      const fetchedCategories = await newsApi.getCategories();
      setCategories(fetchedCategories);

      // If initial category slug is provided, select it
      if (initialCategorySlug && fetchedCategories.length > 0) {
        const category = fetchedCategories.find((cat: Category) => cat.slug === initialCategorySlug);
        if (category) {
          setSelectedCategoryState(category);
        }
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      setCategoryError('Failed to load categories. Please try again.');
    } finally {
      setCategoryLoading(false);
    }
  }, [initialCategorySlug]);

  // Initial load
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const setSelectedCategory = useCallback((category: Category | null) => {
    setSelectedCategoryState(category);
    
    // Save to localStorage for persistence
    if (category) {
      localStorage.setItem('selectedCategory', JSON.stringify({
        id: category.id,
        slug: category.slug,
        name: category.name
      }));
    } else {
      localStorage.removeItem('selectedCategory');
    }
  }, []);

  const selectCategoryBySlug = useCallback((slug: string) => {
    const category = categories.find((cat: Category) => cat.slug === slug);
    if (category) {
      setSelectedCategory(category);
    } else {
      console.warn(`Category with slug "${slug}" not found`);
    }
  }, [categories, setSelectedCategory]);

  const clearSelectedCategory = useCallback(() => {
    setSelectedCategoryState(null);
    localStorage.removeItem('selectedCategory');
  }, []);

  const openCategoryMenu = useCallback(() => setIsCategoryMenuOpen(true), []);
  const closeCategoryMenu = useCallback(() => setIsCategoryMenuOpen(false), []);
  const toggleCategoryMenu = useCallback(() => setIsCategoryMenuOpen(prev => !prev), []);

  // Load selected category from localStorage on mount
  useEffect(() => {
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory && categories.length > 0) {
      try {
        const parsed = JSON.parse(savedCategory);
        const category = categories.find((cat: Category) => cat.id === parsed.id || cat.slug === parsed.slug);
        if (category) {
          setSelectedCategoryState(category);
        }
      } catch (error) {
        console.error('Failed to parse saved category:', error);
      }
    }
  }, [categories]);

  const value = useMemo(() => ({
    categories,
    selectedCategory,
    categoryLoading,
    categoryError,
    setSelectedCategory,
    selectCategoryBySlug,
    loadCategories,
    clearSelectedCategory,
    isCategoryMenuOpen,
    openCategoryMenu,
    closeCategoryMenu,
    toggleCategoryMenu,
  }), [
    categories,
    selectedCategory,
    categoryLoading,
    categoryError,
    setSelectedCategory,
    selectCategoryBySlug,
    loadCategories,
    clearSelectedCategory,
    isCategoryMenuOpen,
    openCategoryMenu,
    closeCategoryMenu,
    toggleCategoryMenu,
  ]);

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCategory() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
}