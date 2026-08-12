/**
 * Dashboard configuration
 * Provides typed access to environment variables for the dashboard
 */

// Type definitions for environment variables
export interface DashboardConfig {
  // API Configuration
  api: {
    url: string;
    version: string;
    timeout: number;
    maxRetries: number;
    useMock: boolean;
  };
  
  // Application Configuration
  app: {
    name: string;
    dashboardUrl: string;
    dashboardBasePath: string;
  };
  
  // Feature Flags
  features: {
    analytics: boolean;
    fileManager: boolean;
    seoSettings: boolean;
    realtime: boolean;
    caching: boolean;
    authEnabled: boolean;
    errorReporting: boolean;
    enableBulkActions: boolean;
    enableExport: boolean;
    enableImport: boolean;
    enableAuditLog: boolean;
  };
  
  // Authentication
  auth: {
    enabled: boolean;
    tokenKey: string;
    userKey: string;
    refreshKey: string;
    tokenExpiry: number;
    demoEmail: string;
    demoPassword: string;
  };
  
  // Dashboard UI settings
  ui: {
    defaultPageSize: number;
    maxUploadSize: number;
    refreshInterval: number;
    showTour: boolean;
  };
  
  // Development & Debugging
  development: {
    debug: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    errorReportingUrl?: string;
  };
}

/**
 * Get environment variable with fallback
 */
function getEnv(key: string, defaultValue: string = ''): string {
  // Try Vite's import.meta.env (client-side)
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      const value = (import.meta as any).env[key];
      if (value !== undefined) return value;
    }
  } catch {
    // Ignore errors in non-Vite environments
  }
  
  // Try Node.js process.env (server-side/build time)
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[key];
    if (value !== undefined) return value;
  }
  
  return defaultValue;
}

/**
 * Get boolean environment variable
 */
function getBoolEnv(key: string, defaultValue: boolean = false): boolean {
  const value = getEnv(key, '');
  if (value === '') return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Get number environment variable
 */
function getNumberEnv(key: string, defaultValue: number): number {
  const value = getEnv(key, '');
  if (value === '') return defaultValue;
  const num = parseInt(value, 10);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Main configuration object
 */
export const config: DashboardConfig = {
  api: {
    url: getEnv('VITE_DASHBOARD_API_URL', 'http://localhost:3000/api'),
    version: getEnv('VITE_API_VERSION', 'v1'),
    timeout: getNumberEnv('VITE_API_TIMEOUT', 30000),
    maxRetries: getNumberEnv('VITE_API_MAX_RETRIES', 3),
    useMock: getBoolEnv('VITE_USE_MOCK_DATA', true)
  },
  
  app: {
    name: getEnv('VITE_APP_NAME', 'Yatripati Dashboard'),
    dashboardUrl: getEnv('VITE_DASHBOARD_URL', 'http://localhost:5174'),
    dashboardBasePath: getEnv('VITE_DASHBOARD_BASEPATH', '/dashboard')
  },
  
  features: {
    analytics: getBoolEnv('VITE_ENABLE_ANALYTICS', true),
    fileManager: getBoolEnv('VITE_ENABLE_FILE_MANAGER', true),
    seoSettings: getBoolEnv('VITE_ENABLE_SEO_SETTINGS', true),
    realtime: getBoolEnv('VITE_ENABLE_REALTIME', false),
    caching: getBoolEnv('VITE_ENABLE_CACHING', true),
    authEnabled: getBoolEnv('VITE_AUTH_ENABLED', true),
    errorReporting: getBoolEnv('VITE_ENABLE_ERROR_REPORTING', false),
    enableBulkActions: getBoolEnv('VITE_ENABLE_BULK_ACTIONS', true),
    enableExport: getBoolEnv('VITE_ENABLE_EXPORT', true),
    enableImport: getBoolEnv('VITE_ENABLE_IMPORT', true),
    enableAuditLog: getBoolEnv('VITE_ENABLE_AUDIT_LOG', true),
  },
  
  auth: {
    enabled: getBoolEnv('VITE_AUTH_ENABLED', true),
    tokenKey: getEnv('VITE_AUTH_TOKEN_KEY', 'yatripati_auth_token'),
    userKey: getEnv('VITE_AUTH_USER_KEY', 'yatripati_user'),
    refreshKey: getEnv('VITE_AUTH_REFRESH_KEY', 'yatripati_refresh_token'),
    tokenExpiry: getNumberEnv('VITE_TOKEN_EXPIRY', 60),
    demoEmail: getEnv('VITE_DEMO_EMAIL', 'admin@yatripati.com'),
    demoPassword: getEnv('VITE_DEMO_PASSWORD', 'password')
  },
  
  ui: {
    defaultPageSize: getNumberEnv('VITE_DEFAULT_PAGE_SIZE', 20),
    maxUploadSize: getNumberEnv('VITE_MAX_UPLOAD_SIZE', 10 * 1024 * 1024), // 10MB
    refreshInterval: getNumberEnv('VITE_REFRESH_INTERVAL', 30000), // 30 seconds
    showTour: getBoolEnv('VITE_SHOW_TOUR', true),
  },
  
  development: {
    debug: getBoolEnv('VITE_DEBUG', false),
    logLevel: (getEnv('VITE_LOG_LEVEL', 'info') as 'debug' | 'info' | 'warn' | 'error'),
    errorReportingUrl: getEnv('VITE_ERROR_REPORTING_URL', '')
  }
};

/**
 * Check if running in development mode
 */
export const isDevelopment = getEnv('NODE_ENV', 'development') === 'development' || 
                           getEnv('VITE_DEV', 'true') === 'true';

/**
 * Check if running in production mode
 */
export const isProduction = !isDevelopment;

/**
 * Export individual config sections for convenience
 */
export const apiConfig = config.api;
export const appConfig = config.app;
export const featureConfig = config.features;
export const authConfig = config.auth;
export const uiConfig = config.ui;
export const devConfig = config.development;

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof featureConfig): boolean {
  return featureConfig[feature];
}

/**
 * Log configuration (for debugging)
 */
export function logConfig() {
  if (!config.development.debug) return;
  
  console.group('🔧 Dashboard Configuration');
  console.log('Environment:', isDevelopment ? 'Development' : 'Production');
  console.log('API URL:', config.api.url);
  console.log('Using Mock Data:', config.api.useMock);
  console.log('Features:', config.features);
  console.groupEnd();
}

/**
 * Validate required configuration
 */
export function validateConfig(): string[] {
  const errors: string[] = [];
  
  // Check required API configuration
  if (!config.api.url && !config.api.useMock) {
    errors.push('VITE_DASHBOARD_API_URL is required when not using mock data');
  }
  
  // Check URL formats
  const urlRegex = /^https?:\/\/.+/;
  if (config.api.url && !urlRegex.test(config.api.url)) {
    errors.push(`Invalid API URL format: ${config.api.url}`);
  }
  
  // Validate numeric values
  if (config.api.timeout <= 0) {
    errors.push('VITE_API_TIMEOUT must be positive');
  }
  
  if (config.api.maxRetries < 0) {
    errors.push('VITE_API_MAX_RETRIES cannot be negative');
  }
  
  if (config.ui.maxUploadSize <= 0) {
    errors.push('VITE_MAX_UPLOAD_SIZE must be positive');
  }
  
  return errors;
}