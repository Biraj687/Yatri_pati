/**
 * Shared React hooks for the Yatripati project
 *
 * These hooks provide reusable logic for data fetching, state management,
 * and business operations across both main app and dashboard.
 */
export { useAsync, usePaginatedAsync } from './useAsync';
export { useNews, usePaginatedNews, useNewsManagement } from './useNews';
export { useDashboard, useDashboardRealtime } from './useDashboard';
export { useAuth, useRequireAuth } from './useAuth';
export { useAdvertisements, useActiveAdvertisements, useAdvertisementAnalytics } from './useAdvertisements';
export { useRealTimeUpdates, useLiveNotifications } from './useRealTimeUpdates';
