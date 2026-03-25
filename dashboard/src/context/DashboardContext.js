import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from 'react';
import { dashboardAPI } from '@services';
const DashboardContext = createContext(undefined);
export function DashboardProvider({ children }) {
    const [articles, setArticles] = useState([]);
    const [files, setFiles] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleError = useCallback((err) => {
        setError(err.message);
        console.error(err);
    }, []);
    const loadArticles = useCallback(async (params) => {
        setLoading(true);
        setError(null);
        try {
            const result = await dashboardAPI.getAllArticles(params);
            setArticles(result.data);
        }
        catch (err) {
            handleError(err);
        }
        finally {
            setLoading(false);
        }
    }, [handleError]);
    const loadArticleById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const article = await dashboardAPI.getArticleById(id);
            return article;
        }
        catch (err) {
            handleError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [handleError]);
    const createArticle = useCallback(async (payload) => {
        setLoading(true);
        setError(null);
        try {
            const article = await dashboardAPI.createArticle(payload);
            setArticles(prev => [article, ...prev]);
            return article;
        }
        catch (err) {
            handleError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [handleError]);
    const updateArticle = useCallback(async (id, payload) => {
        setLoading(true);
        setError(null);
        try {
            const article = await dashboardAPI.updateArticle(id, payload);
            setArticles(prev => prev.map(a => a.id === id ? article : a));
            return article;
        }
        catch (err) {
            handleError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [handleError]);
    const deleteArticle = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            await dashboardAPI.deleteArticle(id);
            setArticles(prev => prev.filter(a => a.id !== id));
        }
        catch (err) {
            handleError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [handleError]);
    const publishArticle = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const article = await dashboardAPI.publishArticle(id);
            setArticles(prev => prev.map(a => a.id === id ? article : a));
            return article;
        }
        catch (err) {
            handleError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [handleError]);
    const toggleSticky = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const article = await dashboardAPI.toggleSticky(id);
            setArticles(prev => prev.map(a => a.id === id ? article : a));
            return article;
        }
        catch (err) {
            handleError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [handleError]);
    const loadFiles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await dashboardAPI.getAllFiles();
            setFiles(result);
        }
        catch (err) {
            handleError(err);
        }
        finally {
            setLoading(false);
        }
    }, [handleError]);
    const uploadFile = useCallback(async (file) => {
        setLoading(true);
        setError(null);
        try {
            const fileItem = await dashboardAPI.uploadFile(file);
            setFiles(prev => [fileItem, ...prev]);
            return fileItem;
        }
        catch (err) {
            handleError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [handleError]);
    const deleteFile = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            await dashboardAPI.deleteFile(id);
            setFiles(prev => prev.filter(f => f.id !== id));
        }
        catch (err) {
            handleError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [handleError]);
    const loadStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await dashboardAPI.getDashboardStats();
            setStats(data);
        }
        catch (err) {
            handleError(err);
        }
        finally {
            setLoading(false);
        }
    }, [handleError]);
    const clearError = () => setError(null);
    return (_jsx(DashboardContext.Provider, { value: {
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
        }, children: children }));
}
export function useDashboard() {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within DashboardProvider');
    }
    return context;
}
