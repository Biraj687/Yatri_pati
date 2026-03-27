/**
 * Realtime & Optimistic UI Demo Component
 * Demonstrates real-time updates and optimistic UI features
 */

import { useState, useEffect, useCallback } from 'react';
import { useRealtimeDashboard, useDashboardNotifications } from '../../../shared/hooks/useRealtimeDashboard';
import { Button, Card, Alert, Badge } from './UI';
import type { Article, DashboardStats } from '../../../shared/types';

export function RealtimeDemo() {
  const {
    subscribeToArticles,
    subscribeToStats,
    connectionStatus,
    isRealtimeEnabled,
    optimisticallyCreateArticle,
    optimisticallyUpdateArticle,
    optimisticallyDeleteArticle,
    isTempId
  } = useRealtimeDashboard();

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    hasNotifications,
    isEnabled: notificationsEnabled
  } = useDashboardNotifications();

  const [demoArticles, setDemoArticles] = useState<any[]>([
    { id: '1', title: 'Sample Article 1', status: 'published', views: 100 },
    { id: '2', title: 'Sample Article 2', status: 'draft', views: 50 },
    { id: '3', title: 'Sample Article 3', status: 'published', views: 200 }
  ]);

  const [demoStats, setDemoStats] = useState({
    totalArticles,
    publishedArticles,
    draftArticles,
    totalFiles,
    totalViews,
    recentArticles: [],
    popularCategories: []
  });

  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState('');

  // Subscribe to real-time events
  useEffect(() => {
    if (!isRealtimeEnabled) return;

    const unsubscribeArticles = subscribeToArticles({
      onCreate: (article) => {
        setLastEvent(`Article created: ${article.title}`);
        setDemoArticles(prev => [...prev, article]);
        setDemoStats(prev => ({
          ...prev,
          totalArticles: prev.totalArticles + 1
        }));
      },
      onUpdate: (article) => {
        setLastEvent(`Article updated: ${article.title}`);
        setDemoArticles(prev =>
          prev.map(a => a.id === article.id ? article )
        );
      },
      onDelete: (articleId) => {
        setLastEvent(`Article deleted: ${articleId}`);
        setDemoArticles(prev => prev.filter(a => a.id !== articleId));
        setDemoStats(prev => ({
          ...prev,
          totalArticles: Math.max(0, prev.totalArticles - 1)
        }));
      }
    });

    const unsubscribeStats = subscribeToStats((stats) => {
      setLastEvent('Stats updated');
      setDemoStats(stats);
    });

    return () => {
      unsubscribeArticles();
      unsubscribeStats();
    };
  }, [isRealtimeEnabled, subscribeToArticles, subscribeToStats]);

  // Update connection status
  useEffect(() => {
    setIsConnected(connectionStatus.isConnected);
  }, [connectionStatus]);

  // Demo: Optimistically create article
  const handleCreateDemoArticle = useCallback(() => {
    const newArticle: Omit<Article, 'id'> = {
      title: `New Article ${Date.now()}`,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTk5OTkiPk5ldyBBcnRpY2xlPC90ZXh0Pjwvc3ZnPg==',
      excerpt: 'This is a demo article created with optimistic UI',
      date: new Date().toISOString().split('T')[0],
      status: 'draft' ,
      views: 0
    };

    // Simulate API call
    const apiPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...newArticle,
          id: `real_${Date.now()}`,
          category: 'demo',
          readTime: '2 min',
          source: 'Demo',
          tags: ['demo', 'optimistic']
        });
      }, 2000);
    });

    const result = optimisticallyCreateArticle(demoArticles, newArticle, apiPromise);
    setDemoArticles(result.newArray);
    
    // Simulate replacing temp ID with real ID after API succeeds
    apiPromise.then((realArticle) => {
      setDemoArticles(prev =>
        prev.map(article =>
          article.id === result.tempId ? realArticle )
      );
    });
  }, [demoArticles, optimisticallyCreateArticle]);

  // Demo: Optimistically update article
  const handleUpdateDemoArticle = useCallback((articleId) => {
    const updates = {
      title: `Updated ${Date.now()}`,
      views: Math.floor(Math.random() * 1000)
    };

    // Simulate API call
    const apiPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id, ...updates });
      }, 2000);
    });

    const result = optimisticallyUpdateArticle(demoArticles, articleId, updates, apiPromise);
    setDemoArticles(result.newArray);
  }, [demoArticles, optimisticallyUpdateArticle]);

  // Demo: Optimistically delete article
  const handleDeleteDemoArticle = useCallback((articleId) => {
    // Simulate API call
    const apiPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random failure (30% chance)
        if (Math.random() < 0.3) {
          reject(new Error('Delete failed: Simulated error'));
        } else {
          resolve();
        }
      }, 2000);
    });

    const result = optimisticallyDeleteArticle(demoArticles, articleId, apiPromise);
    setDemoArticles(result.newArray);

    // Handle rollback on error
    apiPromise.catch(() => {
      // In a real app, you would show an error message
      console.log('Delete failed, article restored');
    });
  }, [demoArticles, optimisticallyDeleteArticle]);

  // Demo: Send test notification
  const handleSendTestNotification = useCallback(() => {
    // In a real app, this would send via WebSocket
    // For demo, we'll just add a local notification
    // This would normally come from real-time service
    setLastEvent('Test notification sent');
  }, []);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Real-time & Optimistic UI Demo</h2>
          <div className="flex items-center gap-2">
            <Badge
              variant={isConnected ? 'success' : 'danger'}
              className="animate-pulse"
            >
              {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </Badge>
            <Badge variant="info">
              {connectionStatus.usePolling ? '📡 Polling' : '🔌 WebSocket'}
            </Badge>
          </div>
        </div>

        {!isRealtimeEnabled && (
          <Alert
            type="warning"
            message="Real-time features are disabled. Enable them in your environment variables."
            className="mb-4"
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Connection Status */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Connection Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mode:</span>
                {connectionStatus.usePolling ? 'Polling' : 'WebSocket'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reconnect Attempts:</span>
                {connectionStatus.reconnectAttempts}</span>
              </div>
              {lastEvent && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800">Last Event: {lastEvent}</p>
                </div>
              )}
            </div>
          </div>

          {/* Demo Controls */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">Demo Controls</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="primary"
                onClick={handleCreateDemoArticle}
                disabled={!isRealtimeEnabled}
              >
                Create Article (Optimistic)
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleUpdateDemoArticle('1')}
                disabled={!isRealtimeEnabled}
              >
                Update Article 1
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteDemoArticle('2')}
                disabled={!isRealtimeEnabled}
              >
                Delete Article 2 (30% fail)
              </Button>
              <Button
                variant="ghost"
                onClick={handleSendTestNotification}
                disabled={!isRealtimeEnabled}
              >
                Send Test Notification
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Demo Articles */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Demo Articles</h3>
        <div className="space-y-3">
          {demoArticles.map((article) => (
            <div
              key={article.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              
                <div className="flex items-center gap-2">
                  <span className="font-medium">{article.title}</span>
                  {isTempId(article.id) && (
                    <Badge variant="warning" className="text-xs">
                      Optimistic
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Status: {article.status} • Views: {article.views}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleUpdateDemoArticle(article.id)}
                >
                  Update
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDeleteDemoArticle(article.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Notifications */}
      {notificationsEnabled && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Badge variant="danger">{unreadCount} unread</Badge>
              )}
              <Button size="sm" variant="ghost" onClick={markAllAsRead}>
                Mark all read
              </Button>
              <Button size="sm" variant="ghost" onClick={clearAll}>
                Clear all
              </Button>
            </div>
          </div>

          {hasNotifications ? (
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}
                >
                  <div className="flex justify-between items-start">
                    
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {notification.timestamp.toLocaleTimeString()}
                      </span>
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeNotification(notification.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {notifications.length > 3 && (
                <div className="text-center text-sm text-gray-500">
                  + {notifications.length - 3} more notifications
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No notifications yet
            </div>
          )}
        </Card>
      )}

      {/* Stats */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-700 mb-4">Demo Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-800">{demoStats.totalArticles}</div>
            <div className="text-sm text-gray-600">Total Articles</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-800">{demoStats.publishedArticles}</div>
            <div className="text-sm text-gray-600">Published</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-800">{demoStats.totalViews}</div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-800">{demoArticles.length}</div>
            <div className="text-sm text-gray-600">Current</div>
          </div>
        </div>
      </Card>

      {/* Explanation */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="font-semibold text-gray-800 mb-3">How It Works</h3>
        <div className="space-y-3 text-gray-700">
          
            Real-time Updates:</strong> This demo shows how articles and stats can update in real-time
            using WebSocket or polling. When enabled, changes from other users would appear instantly.
          </p>
          
            Optimistic UI:</strong> When you create, update, or delete articles, the UI updates immediately
            (optimistically) while the API request is in progress. If the request fails, the UI rolls back.
          </p>
          
            Notifications:</strong> Real-time notifications appear for system events and user activities.
          </p>
          <p className="text-sm text-gray-600">
            Note: This is a frontend demo. For full functionality, you need a backend with WebSocket support.
            Enable real-time features by setting VITE_ENABLE_REALTIME=true</code> in your environment.
          </p>
        </div>
      </Card>
    </div>
  );
}
