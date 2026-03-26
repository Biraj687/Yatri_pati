import { useCallback } from 'react';
import { useAsync, usePaginatedAsync } from './useAsync';
import { newsService } from '../services/newsService';
import { dashboardService } from '../services/dashboardService';
import type { Article, PaginatedResponse, CreateNewsPayload } from '../types';

/**
 * Hook for fetching and managing news articles (public/news portal)
 */
export function useNews() {
  const asyncState = useAsync<Article[]>([]);

  /**
   * Fetch all news articles
   */
  const fetchAll = useCallback(async (options?: {
    category?: string;
    search?: string;
    limit?: number;
    sortBy?: 'date' | 'views' | 'title';
    sortOrder?: 'asc' | 'desc';
    onSuccess?: (articles: Article[]) => void;
    onError?: (error: string) => void;
  }) => {
    await asyncState.execute(async () => {
      const response = await newsService.getNews({
        category: options?.category,
        search: options?.search,
        limit: options?.limit,
        sortBy: options?.sortBy,
        sortOrder: options?.sortOrder,
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch articles');
      }

      const articles = response.data?.data || [];
      options?.onSuccess?.(articles);
      return articles;
    }, {
      onError: options?.onError,
    });
  }, [asyncState]);

  /**
   * Fetch article by ID
   */
  const fetchById = useCallback(async (id: string | number, options?: {
    onSuccess?: (article: Article) => void;
    onError?: (error: string) => void;
  }) => {
    const articleState = useAsync<Article>();
    
    await articleState.execute(async () => {
      const response = await newsService.getArticleById(id);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Article not found');
      }

      options?.onSuccess?.(response.data);
      return response.data;
    }, {
      onError: options?.onError,
    });

    return articleState;
  }, []);

  /**
   * Search articles
   */
  const search = useCallback(async (query: string, options?: {
    limit?: number;
    onSuccess?: (articles: Article[]) => void;
    onError?: (error: string) => void;
  }) => {
    await asyncState.execute(async () => {
      const response = await newsService.searchArticles(query, options?.limit);

      if (!response.success) {
        throw new Error(response.error || 'Search failed');
      }

      const articles = response.data || [];
      options?.onSuccess?.(articles);
      return articles;
    }, {
      onError: options?.onError,
    });
  }, [asyncState]);

  /**
   * Fetch articles by category
   */
  const fetchByCategory = useCallback(async (category: string, options?: {
    limit?: number;
    onSuccess?: (articles: Article[]) => void;
    onError?: (error: string) => void;
  }) => {
    await asyncState.execute(async () => {
      const response = await newsService.getArticlesByCategory(category, options?.limit);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch category articles');
      }

      const articles = response.data || [];
      options?.onSuccess?.(articles);
      return articles;
    }, {
      onError: options?.onError,
    });
  }, [asyncState]);

  /**
   * Get trending articles
   */
  const getTrending = useCallback(async (limit: number = 5, options?: {
    onSuccess?: (articles: Article[]) => void;
    onError?: (error: string) => void;
  }) => {
    await asyncState.execute(async () => {
      const response = await newsService.getTrendingArticles(limit);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch trending articles');
      }

      const articles = response.data || [];
      options?.onSuccess?.(articles);
      return articles;
    }, {
      onError: options?.onError,
    });
  }, [asyncState]);

  /**
   * Get all categories
   */
  const getCategories = useCallback(async (options?: {
    onSuccess?: (categories: string[]) => void;
    onError?: (error: string) => void;
  }) => {
    const categoryState = useAsync<string[]>();
    
    await categoryState.execute(async () => {
      const response = await newsService.getCategories();

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch categories');
      }

      const categories = response.data || [];
      options?.onSuccess?.(categories);
      return categories;
    }, {
      onError: options?.onError,
    });

    return categoryState;
  }, []);

  return {
    // State
    articles: asyncState.data || [],
    loading: asyncState.loading,
    error: asyncState.error,
    lastUpdated: asyncState.lastUpdated,
    
    // Actions
    fetchAll,
    fetchById,
    search,
    fetchByCategory,
    getTrending,
    getCategories,
    
    // Convenience methods
    refetch: () => fetchAll(),
    clearError: () => asyncState.setError(''),
    
    // State helpers
    isEmpty: !asyncState.loading && !asyncState.error && (!asyncState.data || asyncState.data.length === 0),
    hasData: !asyncState.loading && !asyncState.error && !!asyncState.data && asyncState.data.length > 0,
  };
}

/**
 * Hook for paginated news articles (infinite scroll)
 */
export function usePaginatedNews(initialLimit: number = 20) {
  const paginatedState = usePaginatedAsync<Article>(1, initialLimit);

  const loadArticles = useCallback(async (options?: {
    category?: string;
    search?: string;
    sortBy?: 'date' | 'views' | 'title';
    sortOrder?: 'asc' | 'desc';
    append?: boolean;
    onSuccess?: (articles: Article[], total: number) => void;
    onError?: (error: string) => void;
  }) => {
    await paginatedState.loadMore(async (page, limit) => {
      const response = await newsService.getNews({
        page,
        limit,
        category: options?.category,
        search: options?.search,
        sortBy: options?.sortBy,
        sortOrder: options?.sortOrder,
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to load articles');
      }

      const paginatedData = response.data;
      return {
        data: paginatedData?.data || [],
        total: paginatedData?.total || 0,
        hasMore: paginatedData ? page < paginatedData.totalPages : false,
      };
    }, {
      append: options?.append,
      onSuccess: options?.onSuccess,
    });
  }, [paginatedState]);

  const searchArticles = useCallback(async (query: string, options?: {
    append?: boolean;
    onSuccess?: (articles: Article[], total: number) => void;
    onError?: (error: string) => void;
  }) => {
    await paginatedState.loadMore(async (page, limit) => {
      const response = await newsService.getNews({
        page,
        limit,
        search: query,
      });

      if (!response.success) {
        throw new Error(response.error || 'Search failed');
      }

      const paginatedData = response.data;
      return {
        data: paginatedData?.data || [],
        total: paginatedData?.total || 0,
        hasMore: paginatedData ? page < paginatedData.totalPages : false,
      };
    }, {
      append: options?.append,
      onSuccess: options?.onSuccess,
    });
  }, [paginatedState]);

  return {
    // State
    articles: paginatedState.data || [],
    loading: paginatedState.loading,
    error: paginatedState.error,
    page: paginatedState.page,
    hasMore: paginatedState.hasMore,
    lastUpdated: paginatedState.lastUpdated,
    
    // Actions
    loadArticles,
    searchArticles,
    reset: paginatedState.resetPagination,
    goToPage: paginatedState.goToPage,
    
    // Convenience
    isEmpty: !paginatedState.loading && !paginatedState.error && (!paginatedState.data || paginatedState.data.length === 0),
    isInitialLoad: paginatedState.page === 1 && paginatedState.loading,
    isRefreshing: paginatedState.page > 1 && paginatedState.loading,
  };
}

/**
 * Hook for dashboard news management operations
 */
export function useNewsManagement() {
  const createState = useAsync<Article>();
  const updateState = useAsync<Article>();
  const deleteState = useAsync<void>();
  const publishState = useAsync<Article>();
  const stickyState = useAsync<Article>();

  const createArticle = useCallback(async (payload: CreateNewsPayload, options?: {
    onSuccess?: (article: Article) => void;
    onError?: (error: string) => void;
  }) => {
    await createState.execute(async () => {
      const response = await dashboardService.createArticle(payload);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create article');
      }

      options?.onSuccess?.(response.data);
      return response.data;
    }, {
      onError: options?.onError,
    });
  }, [createState]);

  const updateArticle = useCallback(async (id: string, payload: Partial<CreateNewsPayload>, options?: {
    onSuccess?: (article: Article) => void;
    onError?: (error: string) => void;
  }) => {
    await updateState.execute(async () => {
      const response = await dashboardService.updateArticle(id, payload);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to update article');
      }

      options?.onSuccess?.(response.data);
      return response.data;
    }, {
      onError: options?.onError,
    });
  }, [updateState]);

  const deleteArticle = useCallback(async (id: string, options?: {
    onSuccess?: () => void;
    onError?: (error: string) => void;
  }) => {
    await deleteState.execute(async () => {
      const response = await dashboardService.deleteArticle(id);

      if (!response.success) {
        throw new Error(response.error || 'Failed to delete article');
      }

      options?.onSuccess?.();
      return undefined;
    }, {
      onError: options?.onError,
    });
  }, [deleteState]);

  const publishArticle = useCallback(async (id: string, options?: {
    onSuccess?: (article: Article) => void;
    onError?: (error: string) => void;
  }) => {
    await publishState.execute(async () => {
      const response = await dashboardService.publishArticle(id);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to publish article');
      }

      options?.onSuccess?.(response.data);
      return response.data;
    }, {
      onError: options?.onError,
    });
  }, [publishState]);

  const toggleSticky = useCallback(async (id: string, options?: {
    onSuccess?: (article: Article) => void;
    onError?: (error: string) => void;
  }) => {
    await stickyState.execute(async () => {
      const response = await dashboardService.toggleSticky(id);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to toggle sticky');
      }

      options?.onSuccess?.(response.data);
      return response.data;
    }, {
      onError: options?.onError,
    });
  }, [stickyState]);

  return {
    // Create operations
    createArticle,
    creating: createState.loading,
    createError: createState.error,
    createdArticle: createState.data,
    
    // Update operations
    updateArticle,
    updating: updateState.loading,
    updateError: updateState.error,
    updatedArticle: updateState.data,
    
    // Delete operations
    deleteArticle,
    deleting: deleteState.loading,
    deleteError: deleteState.error,
    
    // Publish operations
    publishArticle,
    publishing: publishState.loading,
    publishError: publishState.error,
    publishedArticle: publishState.data,
    
    // Sticky operations
    toggleSticky,
    togglingSticky: stickyState.loading,
    stickyError: stickyState.error,
    stickyArticle: stickyState.data,
    
    // Reset methods
    resetCreate: () => createState.reset(),
    resetUpdate: () => updateState.reset(),
    resetDelete: () => deleteState.reset(),
    resetPublish: () => publishState.reset(),
    resetSticky: () => stickyState.reset(),
  };
}