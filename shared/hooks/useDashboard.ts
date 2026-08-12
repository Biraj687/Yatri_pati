import { useCallback } from 'react';
import { useAsync } from './useAsync';
import { dashboardService } from '../services/dashboardService';
import type { DashboardStats, Article, FileItem, PaginatedResponse } from '../types';

/**
 * Hook for dashboard statistics and operations
 */
export function useDashboard() {
  const statsState = useAsync<DashboardStats>();
  const articlesState = useAsync<PaginatedResponse<Article>>();
  const filesState = useAsync<FileItem[]>();

  /**
   * Fetch dashboard statistics
   */
  const fetchStats = useCallback(async (options?: {
    onSuccess?: (stats: DashboardStats) => void;
    onError?: (error: string) => void;
  }) => {
    await statsState.execute(async () => {
      const response = await dashboardService.getDashboardStats();

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch dashboard stats');
      }

      options?.onSuccess?.(response.data);
      return response.data;
    }, {
      onError: options?.onError,
    });
  }, [statsState]);

  /**
   * Fetch all articles for dashboard (with pagination)
   */
  const fetchArticles = useCallback(async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    status?: 'draft' | 'published';
    onSuccess?: (response: PaginatedResponse<Article>) => void;
    onError?: (error: string) => void;
  }) => {
    await articlesState.execute(async () => {
      const response = await dashboardService.getAllArticles({
        page: params?.page,
        limit: params?.limit,
        category: params?.category,
        search: params?.search,
        status: params?.status,
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch articles');
      }

      const data = response.data || { data: [], total: 0, page: 1, limit: params?.limit || 20, totalPages: 1 };
      params?.onSuccess?.(data);
      return data;
    }, {
      onError: params?.onError,
    });
  }, [articlesState]);

  /**
   * Fetch all files
   */
  const fetchFiles = useCallback(async (options?: {
    onSuccess?: (files: FileItem[]) => void;
    onError?: (error: string) => void;
  }) => {
    await filesState.execute(async () => {
      const response = await dashboardService.getAllFiles();

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch files');
      }

      const files = response.data || [];
      options?.onSuccess?.(files);
      return files;
    }, {
      onError: options?.onError,
    });
  }, [filesState]);

  /**
   * Upload a file
   */
  const uploadFile = useCallback(async (file: File, options?: {
    onSuccess?: (fileItem: FileItem) => void;
    onError?: (error: string) => void;
  }) => {
    const uploadState = useAsync<FileItem>();
    
    await uploadState.execute(async () => {
      const response = await dashboardService.uploadFile(file);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to upload file');
      }

      // Refresh files list after successful upload
      fetchFiles();

      options?.onSuccess?.(response.data);
      return response.data;
    }, {
      onError: options?.onError,
    });

    return uploadState;
  }, [fetchFiles]);

  /**
   * Delete a file
   */
  const deleteFile = useCallback(async (id: string, options?: {
    onSuccess?: () => void;
    onError?: (error: string) => void;
  }) => {
    const deleteState = useAsync<void>();
    
    await deleteState.execute(async () => {
      const response = await dashboardService.deleteFile(id);

      if (!response.success) {
        throw new Error(response.error || 'Failed to delete file');
      }

      // Refresh files list after successful deletion
      fetchFiles();

      options?.onSuccess?.();
      return undefined;
    }, {
      onError: options?.onError,
    });

    return deleteState;
  }, [fetchFiles]);

  return {
    // Stats
    stats: statsState.data,
    statsLoading: statsState.loading,
    statsError: statsState.error,
    fetchStats,
    refreshStats: () => fetchStats(),
    
    // Articles
    articles: articlesState.data?.data || [],
    articlesPagination: articlesState.data 
      ? { 
          total: articlesState.data.total, 
          page: articlesState.data.page, 
          totalPages: articlesState.data.totalPages 
        }
      : { total: 0, page: 1, totalPages: 1 },
    articlesLoading: articlesState.loading,
    articlesError: articlesState.error,
    fetchArticles,
    refreshArticles: () => fetchArticles(),
    
    // Files
    files: filesState.data || [],
    filesLoading: filesState.loading,
    filesError: filesState.error,
    fetchFiles,
    uploadFile,
    deleteFile,
    refreshFiles: () => fetchFiles(),
    
    // Combined loading states
    isLoading: statsState.loading || articlesState.loading || filesState.loading,
    hasError: !!statsState.error || !!articlesState.error || !!filesState.error,
    
    // Reset methods
    resetStats: () => statsState.reset(),
    resetArticles: () => articlesState.reset(),
    resetFiles: () => filesState.reset(),
  };
}

/**
 * Hook for real-time dashboard updates (polling)
 */
export function useDashboardRealtime(intervalMs: number = 30000) {
  const dashboard = useDashboard();
  
  const startPolling = useCallback(() => {
    const interval = setInterval(() => {
      dashboard.fetchStats();
      dashboard.fetchArticles({ limit: 5 });
    }, intervalMs);
    
    return () => clearInterval(interval);
  }, [dashboard, intervalMs]);
  
  return {
    ...dashboard,
    startPolling,
  };
}