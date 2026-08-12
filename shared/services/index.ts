/**
 * Unified Services Export
 * All services use the shared apiClient and follow consistent patterns
 */

export { ApiClient, mainApiClient, dashboardApiClient } from './apiClient';
export type { ApiClientConfig, ApiResponse, RequestOptions } from './apiClient';

export { authService } from './authService';
export type { User, LoginCredentials, AuthResponse, RegisterData } from './authService';

export { DashboardService, dashboardService } from './dashboardService';
export { NewsService, newsService } from './newsService';
export { AdvertisementService, advertisementService } from './advertisementService';
export { RealtimeService, realtimeService } from './realtimeService';
