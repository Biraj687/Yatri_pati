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

/**
 * Re-export types for convenience
 */
export type {
  // From useAsync
  AsyncState,
} from '../types/async';

export type {
  // From auth service
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from '../services/authService';

export type {
  // From shared types
  Article,
  PaginatedResponse,
  DashboardStats,
  FileItem,
  CreateNewsPayload,
} from '../types';