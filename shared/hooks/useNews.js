import { useCallback } from 'react';
import { useAsync, usePaginatedAsync } from './useAsync';
import { newsService } from '../services/newsService';
import { dashboardService } from '../services/dashboardService';
/**
 * Hook for fetching and managing news articles (public/news portal)
 */
export function useNews() {
    const asyncState = useAsync([]);
    /**
     * Fetch all news articles
     */
    const fetchAll = useCallback(async (options) => {
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
    const fetchById = useCallback(async (id, options) => {
        const articleState = useAsync();
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
    const search = useCallback(async (query, options) => {
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
    const fetchByCategory = useCallback(async (category, options) => {
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
    const getTrending = useCallback(async (limit = 5, options) => {
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
    const getCategories = useCallback(async (options) => {
        const categoryState = useAsync();
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
export function usePaginatedNews(initialLimit = 20) {
    const paginatedState = usePaginatedAsync(1, initialLimit);
    const loadArticles = useCallback(async (options) => {
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
    const searchArticles = useCallback(async (query, options) => {
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
    const createState = useAsync();
    const updateState = useAsync();
    const deleteState = useAsync();
    const publishState = useAsync();
    const stickyState = useAsync();
    const createArticle = useCallback(async (payload, options) => {
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
    const updateArticle = useCallback(async (id, payload, options) => {
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
    const deleteArticle = useCallback(async (id, options) => {
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
    const publishArticle = useCallback(async (id, options) => {
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
    const toggleSticky = useCallback(async (id, options) => {
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
