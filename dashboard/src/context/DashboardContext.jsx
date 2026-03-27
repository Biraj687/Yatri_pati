import { createContext, useContext, useState, useCallback } from 'react';

const DashboardContext = createContext(undefined);

export function DashboardProvider({ children }) {
  const [articles, setArticles] = useState([]);
  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const handleError = useCallback((err) => {
    setError(err.message);
    console.error('[Dashboard Error]', err);
  }, []);

  const loadArticles = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
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
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [articles, handleError]);

  const loadArticleById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const article = articles.find(a => a.id === id);
      if (!article) throw new Error('Article not found');
      return article;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [articles, handleError]);

  const createArticle = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const article = {
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
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const updateArticle = useCallback(async (id, payload) => {
    const originalArticles = articles;
    const updatedArticle = articles.find(a => a.id === id);
    if (!updatedArticle) throw new Error('Article not found');
    
    const optimisticArticle = { ...updatedArticle, ...payload };
    setArticles(prev => prev.map(a => a.id === id ? optimisticArticle : a));

    setLoading(true);
    setError(null);
    try {
      setArticles(prev => prev.map(a => a.id === id ? optimisticArticle : a));
      return optimisticArticle;
    } catch (err) {
      setArticles(originalArticles);
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [articles, handleError]);

  const deleteArticle = useCallback(async (id) => {
    const originalArticles = articles;
    setArticles(prev => prev.filter(a => a.id !== id));

    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      setArticles(originalArticles);
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [articles, handleError]);

  const publishArticle = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const article = articles.find(a => a.id === id);
      if (!article) throw new Error('Article not found');
      const updated = { ...article, status: 'published' };
      setArticles(prev => prev.map(a => a.id === id ? updated : a));
      return updated;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [articles, handleError]);

  const toggleSticky = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const currentArticle = articles.find(a => a.id === id);
      if (!currentArticle) throw new Error('Article not found');
      const updated = { ...currentArticle, sticky: !currentArticle.sticky };
      setArticles(prev => prev.map(a => a.id === id ? updated : a));
      return updated;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [articles, handleError]);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setFiles([]);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const uploadFile = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    try {
      const fileItem = {
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
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const deleteFile = useCallback(async (id) => {
    const originalFiles = files;
    setFiles(prev => prev.filter(f => f.id !== id));

    setLoading(true);
    setError(null);
    try {
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      setFiles(originalFiles);
      handleError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [files, handleError]);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = {
        totalArticles: articles.length,
        publishedArticles: articles.filter(a => a.status === 'published').length,
        draftArticles: articles.filter(a => a.status === 'draft').length,
        totalViews: articles.reduce((sum, a) => sum + (a.views || 0), 0),
        totalAuthors: new Set(articles.flatMap(a => a.authors?.map(au => au.name) || [])).size,
        recentArticles: articles.slice(0, 5),
      };
      setStats(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [articles, handleError]);

  const clearError = useCallback(() => setError(null), []);

  const value = {
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
    setError,
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
