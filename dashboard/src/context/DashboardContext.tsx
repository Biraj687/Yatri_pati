import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { NewsArticle, FileItem, DashboardStats } from '@types';
import { dashboardAPI } from '@services';

interface DashboardContextType {
  articles: NewsArticle[];
  files: FileItem[];
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  
  // Article actions
  loadArticles: (params?: any) => Promise<void>;
  loadArticleById: (id: string) => Promise<NewsArticle>;
  createArticle: (payload: any) => Promise<NewsArticle>;
  updateArticle: (id: string, payload: any) => Promise<NewsArticle>;
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
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((err: Error) => {
    setError(err.message);
    console.error(err);
  }, []);

  const loadArticles = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await dashboardAPI.getAllArticles(params);
      setArticles(result.data);
    } catch (err) {
      handleError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const loadArticleById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const article = await dashboardAPI.getArticleById(id);
      return article;
    } catch (err) {
      handleError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const createArticle = useCallback(async (payload: any) => {
    setLoading(true);
    setError(null);
    try {
      const article = await dashboardAPI.createArticle(payload);
      setArticles(prev => [article, ...prev]);
      return article;
    } catch (err) {
      handleError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const updateArticle = useCallback(async (id: string, payload: any) => {
    setLoading(true);
    setError(null);
    try {
      const article = await dashboardAPI.updateArticle(id, payload);
      setArticles(prev => prev.map(a => a.id === id ? article : a));
      return article;
    } catch (err) {
      handleError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const deleteArticle = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await dashboardAPI.deleteArticle(id);
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      handleError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const publishArticle = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const article = await dashboardAPI.publishArticle(id);
      setArticles(prev => prev.map(a => a.id === id ? article : a));
      return article;
    } catch (err) {
      handleError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const toggleSticky = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const article = await dashboardAPI.toggleSticky(id);
      setArticles(prev => prev.map(a => a.id === id ? article : a));
      return article;
    } catch (err) {
      handleError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dashboardAPI.getAllFiles();
      setFiles(result);
    } catch (err) {
      handleError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const uploadFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const fileItem = await dashboardAPI.uploadFile(file);
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
    setLoading(true);
    setError(null);
    try {
      await dashboardAPI.deleteFile(id);
      setFiles(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      handleError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardAPI.getDashboardStats();
      setStats(data);
    } catch (err) {
      handleError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const clearError = () => setError(null);

  return (
    <DashboardContext.Provider
      value={{
        articles,
        files,
        stats,
        loading,
        error,
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
      }}
    >
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
