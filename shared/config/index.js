/**
 * Environment configuration for Yatripati applications
 * Provides typed access to environment variables with defaults
 */
/**
 * Get environment variable with fallback
 */
function getEnv(key, defaultValue = '') {
    // Try Vite's import.meta.env (client-side)
    try {
        if (typeof import.meta !== 'undefined' && import.meta.env) {
            const value = import.meta.env[key];
            if (value !== undefined)
                return value;
        }
    }
    catch {
        // Ignore errors in non-Vite environments
    }
    // Try Node.js process.env (server-side/build time)
    if (typeof process !== 'undefined' && process.env) {
        const value = process.env[key];
        if (value !== undefined)
            return value;
    }
    return defaultValue;
}
/**
 * Get boolean environment variable
 */
function getBoolEnv(key, defaultValue = false) {
    const value = getEnv(key, '');
    if (value === '')
        return defaultValue;
    return value.toLowerCase() === 'true' || value === '1';
}
/**
 * Get number environment variable
 */
function getNumberEnv(key, defaultValue) {
    const value = getEnv(key, '');
    if (value === '')
        return defaultValue;
    const num = parseInt(value, 10);
    return isNaN(num) ? defaultValue : num;
}
/**
 * Main configuration object
 */
export const config = {
    api: {
        url: getEnv('VITE_API_URL', 'http://localhost:3000/api'),
        dashboardUrl: getEnv('VITE_DASHBOARD_API_URL', 'http://localhost:3000/api'),
        version: getEnv('VITE_API_VERSION', 'v1'),
        timeout: getNumberEnv('VITE_API_TIMEOUT', 30000),
        maxRetries: getNumberEnv('VITE_API_MAX_RETRIES', 3),
        useMock: getBoolEnv('VITE_USE_MOCK_DATA', true)
    },
    app: {
        name: getEnv('VITE_APP_NAME', 'Yatripati News Portal'),
        defaultAuthor: getEnv('VITE_DEFAULT_AUTHOR', 'Yatripati'),
        siteUrl: getEnv('VITE_SITE_URL', 'http://localhost:5173'),
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
        imageOptimization: getBoolEnv('VITE_ENABLE_IMAGE_OPTIMIZATION', true),
        serviceWorker: getBoolEnv('VITE_ENABLE_SERVICE_WORKER', false),
        errorReporting: getBoolEnv('VITE_ENABLE_ERROR_REPORTING', false)
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
    performance: {
        cacheTTL: getNumberEnv('VITE_CACHE_TTL', 5),
        lazyLoadThreshold: getNumberEnv('VITE_LAZY_LOAD_THRESHOLD', 200)
    },
    development: {
        debug: getBoolEnv('VITE_DEBUG', false),
        logLevel: getEnv('VITE_LOG_LEVEL', 'info'),
        errorReportingUrl: getEnv('VITE_ERROR_REPORTING_URL', '')
    },
    integrations: {
        analyticsId: getEnv('VITE_ANALYTICS_ID', ''),
        facebookAppId: getEnv('VITE_FACEBOOK_APP_ID', ''),
        twitterHandle: getEnv('VITE_TWITTER_HANDLE', '')
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
 * Get configuration for specific environment
 */
export function getConfigForEnv(env = isDevelopment ? 'development' : 'production') {
    const baseConfig = { ...config };
    if (env === 'production') {
        // Override defaults for production
        return {
            ...baseConfig,
            api: {
                ...baseConfig.api,
                useMock: false
            },
            development: {
                ...baseConfig.development,
                debug: false,
                logLevel: 'error'
            },
            features: {
                ...baseConfig.features,
                errorReporting: true
            }
        };
    }
    if (env === 'test') {
        // Override defaults for testing
        return {
            ...baseConfig,
            api: {
                ...baseConfig.api,
                useMock: true
            },
            development: {
                ...baseConfig.development,
                debug: false,
                logLevel: 'warn'
            }
        };
    }
    return baseConfig;
}
/**
 * Validate required configuration
 */
export function validateConfig() {
    const errors = [];
    // Check required API configuration
    if (!config.api.url && !config.api.useMock) {
        errors.push('VITE_API_URL is required when not using mock data');
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
    if (config.performance.cacheTTL <= 0) {
        errors.push('VITE_CACHE_TTL must be positive');
    }
    return errors;
}
/**
 * Log configuration (for debugging)
 */
export function logConfig() {
    if (!config.development.debug)
        return;
    console.group('🔧 Application Configuration');
    console.log('Environment:', isDevelopment ? 'Development' : 'Production');
    console.log('API URL:', config.api.url);
    console.log('Using Mock Data:', config.api.useMock);
    console.log('Features:', config.features);
    console.groupEnd();
}
// Export individual config sections for convenience
export const apiConfig = config.api;
export const appConfig = config.app;
export const featureConfig = config.features;
export const authConfig = config.auth;
export const devConfig = config.development;
