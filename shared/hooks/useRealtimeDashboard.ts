/**
 * Dashboard real-time and optimistic UI hook
 * Combines real-time updates with optimistic UI for dashboard operations
 */

import { useEffect, useCallback, useState } from 'react';
import { useRealtime, RealtimeEvent } from '../services/realtimeService';
import { useOptimistic } from '../utils/optimistic';
import type { Article } from '../types';
import type { FileItem, DashboardStats } from '../types';

// Helper type for optimistic updates (requires string ID)
interface OptimisticArticle extends Omit<Article, 'id'> {
  id: string;
}

// Convert Article to OptimisticArticle (ensuring string ID)
function toOptimisticArticle(article: Article): OptimisticArticle {
  return {
    ...article,
    id: String(article.id)
  };
}

// Convert OptimisticArticle back to Article
function fromOptimisticArticle(article: OptimisticArticle): Article {
  return {
    ...article,
    id: article.id
  };
}

export function useRealtimeDashboard() {
  const { subscribe, send, getStatus, isEnabled } = useRealtime();
  const { addItem, updateItem, removeItem, isTempId } = useOptimistic<OptimisticArticle>();
  const [connectionStatus, setConnectionStatus] = useState(getStatus());

  // Update connection status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(getStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, [getStatus]);

  /**
   * Subscribe to article events
   */
  const subscribeToArticles = useCallback((handlers: {
    onCreate?: (article: Article) => void;
    onUpdate?: (article: Article) => void;
    onDelete?: (articleId: string) => void;
    onPublish?: (article: Article) => void;
  }) => {
    const unsubscribers: (() => void)[] = [];

    if (handlers.onCreate) {
      unsubscribers.push(
        subscribe<Article>('article.created', handlers.onCreate)
      );
    }

    if (handlers.onUpdate) {
      unsubscribers.push(
        subscribe<Article>('article.updated', handlers.onUpdate)
      );
    }

    if (handlers.onDelete) {
      unsubscribers.push(
        subscribe<{ id: string }>('article.deleted', (data) => handlers.onDelete?.(data.id))
      );
    }

    if (handlers.onPublish) {
      unsubscribers.push(
        subscribe<Article>('article.published', handlers.onPublish)
      );
    }

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [subscribe]);

  /**
   * Subscribe to file events
   */
  const subscribeToFiles = useCallback((handlers: {
    onUpload?: (file: FileItem) => void;
    onDelete?: (fileId: string) => void;
  }) => {
    const unsubscribers: (() => void)[] = [];

    if (handlers.onUpload) {
      unsubscribers.push(
        subscribe<FileItem>('file.uploaded', handlers.onUpload)
      );
    }

    if (handlers.onDelete) {
      unsubscribers.push(
        subscribe<{ id: string }>('file.deleted', (data) => handlers.onDelete?.(data.id))
      );
    }

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [subscribe]);

  /**
   * Subscribe to stats updates
   */
  const subscribeToStats = useCallback((handler: (stats: DashboardStats) => void) => {
    return subscribe<DashboardStats>('stats.updated', handler);
  }, [subscribe]);

  /**
   * Send article event
   */
  const sendArticleEvent = useCallback((event: RealtimeEvent, data: any) => {
    return send(event, data);
  }, [send]);

  /**
   * Send file event
   */
  const sendFileEvent = useCallback((event: RealtimeEvent, data: any) => {
    return send(event, data);
  }, [send]);

  /**
   * Optimistically create article
   */
  const optimisticallyCreateArticle = useCallback((
    currentArticles: Article[],
    newArticle: Omit<Article, 'id'>,
    apiPromise: Promise<Article>
  ) => {
    // Convert articles to optimistic format
    const optimisticArticles = currentArticles.map(toOptimisticArticle);
    
    // Convert newArticle to OptimisticArticle format (without id)
    const optimisticNewArticle = newArticle as Omit<OptimisticArticle, 'id'>;
    
    // Wrap API promise to convert result
    const wrappedPromise = apiPromise.then(article => toOptimisticArticle(article));
    
    const result = addItem(optimisticArticles, optimisticNewArticle, wrappedPromise);
    
    // Convert back to Article format
    const newArticles = result.newArray.map(fromOptimisticArticle);
    
    // Notify real-time subscribers
    send('article.created', newArticles.find(a => a.id === result.tempId));
    
    return {
      newArray: newArticles,
      tempId: result.tempId
    };
  }, [addItem, send]);

  /**
   * Optimistically update article
   */
  const optimisticallyUpdateArticle = useCallback((
    currentArticles: Article[],
    articleId: string,
    updates: Partial<Article>,
    apiPromise: Promise<Article>
  ) => {
    // Convert articles to optimistic format
    const optimisticArticles = currentArticles.map(toOptimisticArticle);
    
    // Convert updates to OptimisticArticle format
    const optimisticUpdates = updates as Partial<OptimisticArticle>;
    
    // Wrap API promise to convert result
    const wrappedPromise = apiPromise.then(article => toOptimisticArticle(article));
    
    const result = updateItem(optimisticArticles, articleId, optimisticUpdates, wrappedPromise);
    
    // Convert back to Article format
    const newArticles = result.newArray.map(fromOptimisticArticle);
    
    // Notify real-time subscribers
    send('article.updated', newArticles.find(a => a.id === result.tempId));
    
    return {
      newArray: newArticles,
      tempId: result.tempId
    };
  }, [updateItem, send]);

  /**
   * Optimistically delete article
   */
  const optimisticallyDeleteArticle = useCallback((
    currentArticles: Article[],
    articleId: string,
    apiPromise: Promise<void>
  ) => {
    // Convert articles to optimistic format
    const optimisticArticles = currentArticles.map(toOptimisticArticle);
    
    const result = removeItem(optimisticArticles, articleId, apiPromise);
    
    // Convert back to Article format
    const newArticles = result.newArray.map(fromOptimisticArticle);
    
    // Notify real-time subscribers
    send('article.deleted', { id: articleId });
    
    return {
      newArray: newArticles,
      removedItem: result.removedItem ? fromOptimisticArticle(result.removedItem) : undefined
    };
  }, [removeItem, send]);

  /**
   * Replace temporary ID with real ID
   */
  const replaceTempId = useCallback((
    items: Article[],
    tempId: string,
    realId: string
  ): Article[] => {
    return items.map(item =>
      String(item.id) === tempId ? { ...item, id: realId } : item
    );
  }, []);

  /**
   * Check if ID is temporary
   */
  const isTempIdWrapper = useCallback((id: string | number): boolean => {
    return isTempId(String(id));
  }, [isTempId]);

  return {
    // Real-time features
    subscribeToArticles,
    subscribeToFiles,
    subscribeToStats,
    sendArticleEvent,
    sendFileEvent,
    connectionStatus,
    isRealtimeEnabled: isEnabled,
    
    // Optimistic UI features
    optimisticallyCreateArticle,
    optimisticallyUpdateArticle,
    optimisticallyDeleteArticle,
    replaceTempId,
    isTempId: isTempIdWrapper,
    
    // Combined status
    status: {
      ...connectionStatus,
      optimisticUpdates: isEnabled ? 'active' : 'disabled'
    }
  };
}

/**
 * Hook for dashboard notifications
 */
export function useDashboardNotifications() {
  const { subscribe, isEnabled } = useRealtime();
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>>([]);

  // Subscribe to system notifications
  useEffect(() => {
    if (!isEnabled) return;

    const unsubscribe = subscribe<{
      type: 'info' | 'success' | 'warning' | 'error';
      title: string;
      message: string;
    }>('system.notification', (data) => {
      const newNotification = {
        id: Date.now().toString(),
        type: data.type,
        title: data.title,
        message: data.message,
        timestamp: new Date(),
        read: false
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep last 10
    });

    return unsubscribe;
  }, [subscribe, isEnabled]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    hasNotifications: notifications.length > 0,
    isEnabled
  };
}