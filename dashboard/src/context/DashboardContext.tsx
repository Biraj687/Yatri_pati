import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type {
  NewsArticle,
  FileItem,
  DashboardStats,
  CreateNewsPayload,
  UpdateNewsPayload,
  PaginationParams,
} from '@types';

interface DashboardContextType {
  // State
  articles: NewsArticle[];
  files: FileItem[];
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Article actions
  loadArticles: (params?: PaginationParams) => Promise<void>;
  loadArticleById: (id: string) => Promise<NewsArticle>;
  createArticle: (payload: CreateNewsPayload) => Promise<NewsArticle>;
  updateArticle: (id: string, payload: UpdateNewsPayload) => Promise<NewsArticle>;
  deleteArticle: (id: string) => Promise<void>;
  publishArticle: (id: string) => Promise<NewsArticle>;
  toggleSticky: (id: string) => Promise<NewsArticle>;
  
  // File actions
  loadFiles: () => Promise<void>;
  uploadFile: (file: File) => Promise<FileItem>;
  deleteFile: (id: string) => Promise<void>;
  
  // Stats
  loadStats: () => Promise<void>;
  
  // UI
  clearError: () => void;
  setError: (error: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const handleError = useCallback((err: Error) => {
    setError(err.message);
    console.error('[Dashboard Error]', err);
  }, []);

  const loadArticles = useCallback(async (params?: PaginationParams) => {
    setLoading(true);
    setError(null);
    try {
      // Mock implementation - replace with actual API call from newsService
      // For now, simulating pagination
      const allArticles = articles;
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const startIdx = (page - 1) * limit;
      const paginatedData = allArticles.slice(startIdx, startIdx + limit);
      
      setArticles(paginatedData);
      setPagination({
        page,
        limit,
        total: allArticles.length,
        totalPages: Math.ceil(allArticles.length / limit),
      });
    } catch (err) {
      handleError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [articles, handleError]);

  const loadArticleById = useCallback(async (id: string): Promise<NewsArticle> => {
    setLoading(true);
    setError(null);
    try {
      // Mock implementation - return article from current state
      const article = articles.find(a => a.id === id);
      if (!article) throw new Error('Article not found');
      return article;
    } catch (err) {
      handleError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [articles, handleError]);

  const createArticle = useCallback(async (payload: CreateNewsPayload): Promise<NewsArticle> => {
    setLoading(true);
    setError(null);
    try {
      // Mock implementation - replace with actual API call
      const article: NewsArticle = {
        id: Math.random().toString(36).substr(2, 9),
        ...payload,
        status: payload.status || 'draft',
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setArticles(prev => [article, ...prev]);
      return article;
    } catch (err) {
      handleError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const updateArticle = useCallback(async (id: string, payload: UpdateNewsPayload): Promise<NewsArticle> => {
    // Optimistic update
    const originalArticles = articles;
    const updatedArticle = articles.find(a => a.id === id);
    if (!updatedArticle) throw new Error('Article not found');
    
    const optimisticArticle: NewsArticle = { ...updatedArticle, ...payload };
    setArticles(prev => prev.map(a => a.id === id ? optimisticArticle : a));

    setLoading(true);
    setError(null);
    try {
      // Mock implementation - replace with actual API call
      setArticles(prev => prev.map(a => a.id === id ? optimisticArticle : a));
      return optimisticArticle;
    } catch (err) {
      // Rollback optimistic update
      setArticles(originalArticles);
      handleError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [articles, handleError]);

  const deleteArticle = useCallback(async (id: string) => {
    // Optimistic delete
    const originalArticles = articles;
    setArticles(prev => prev.filter(a => a.id !== id));

    setLoading(true);
    setError(null);
    try {
      // Mock implementation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      // Rollback optimistic delete
      setArticles(originalArticles);
      handleError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [articles, handleError]);

  const publishArticle = useCallback(async (id: string): Promise<NewsArticle> => {
    setLoading(true);
    setError(null);
    try {
      // Mock implementation - replace with actual API call
      const article = articles.find(a => a.id === id);
      if (!article) throw new Error('Article not found');
      const updated = { ...article, status: 'published' as const };
      setArticles(prev => prev.map(a => a.id === id ? updated : a));
      return updated;
    } catch (err) {
      handleError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [articles, handleError]);

  const toggleSticky = useCallback(async (id: string): Promise<NewsArticle> => {
    setLoading(true);
    setError(null);
    try {
      const currentArticle = articles.find(a => a.id === id);
      if (!currentArticle) throw new Error('Article not found');
      // Mock implementation - replace with actual API call
      const updated = { ...currentArticle, sticky: !currentArticle.sticky };
      setArticles(prev => prev.map(a => a.id === id ? updated : a));
      return updated;
    } catch (err) {
      handleError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [articles, handleError]);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch files from service (assuming there's a file service)
      // For now, this will use mock data
      setFiles([]);
    } catch (err) {
      handleError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const uploadFile = useCallback(async (file: File): Promise<FileItem> => {
    setLoading(true);
    setError(null);
    try {
      // Upload file through service
      const formData = new FormData();
      formData.append('file', file);
      // TODO: Replace with actual file upload service
      const fileItem: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setFiles(prev => [fileItem, ...prev]);
      return fileItem;
    } catch (err) {
      handleError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const deleteFile = useCallback(async (id: string) => {
    // Optimistic delete
    const originalFiles = files;
    setFiles(prev => prev.filter(f => f.id !== id));

    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual file delete service
      // await fileService.deleteFile(id);
    } catch (err) {
      // Rollback optimistic delete
      setFiles(originalFiles);
      handleError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [files, handleError]);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock implementation - replace with actual API call
      const data: DashboardStats = {
        totalArticles: articles.length,
        publishedArticles: articles.filter(a => a.status === 'published').length,
        draftArticles: articles.filter(a => a.status === 'draft').length,
        totalViews: articles.reduce((sum, a) => sum + (a.views || 0), 0),
        totalAuthors: new Set(articles.flatMap(a => a.authors.map(au => au.name))).size,
        recentArticles: articles.slice(0, 5),
      };
      setStats(data);
    } catch (err) {
      handleError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [articles, handleError]);

  const clearError = useCallback(() => setError(null), []);
  const setErrorMessage = useCallback((msg: string) => setError(msg), []);

  const value: DashboardContextType = {
    articles,
    files,
    stats,
    loading,
    error,
    pagination,
    loadArticles,
    loadArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    publishArticle,
    toggleSticky,
    loadFiles,
    uploadFile,
    deleteFile,
    loadStats,
    clearError,
    setError: setErrorMessage,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}
