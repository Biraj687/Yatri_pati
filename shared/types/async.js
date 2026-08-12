/**
 * Standardized async state types for consistent data handling
 */
/**
 * Create initial async state
 */
export function createAsyncState(initialData = null) {
    return {
        data: initialData,
        loading: false,
        error: null,
        lastUpdated: undefined
    };
}
/**
 * Convert ApiResponse to AsyncState update
 */
export function apiResponseToStateUpdate(response, currentState) {
    if (response.success) {
        return {
            data: response.data ?? currentState.data,
            loading: false,
            error: null,
            lastUpdated: Date.now()
        };
    }
    else {
        return {
            loading: false,
            error: response.error || 'Unknown error',
            lastUpdated: Date.now()
        };
    }
}
/**
 * Standard async operation wrapper
 */
export async function withAsyncState(operation, onStateChange) {
    // Set loading state
    onStateChange({ loading: true, error: null });
    try {
        const response = await operation();
        const update = apiResponseToStateUpdate(response, { data: null, loading: true, error: null });
        onStateChange(update);
        return response;
    }
    catch (error) {
        const errorResponse = {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
        onStateChange({
            loading: false,
            error: errorResponse.error || 'Unknown error',
            lastUpdated: Date.now()
        });
        return errorResponse;
    }
}
/**
 * Create initial paginated async state
 */
export function createPaginatedAsyncState() {
    return {
        data: [],
        loading: false,
        error: null,
        lastUpdated: undefined,
        pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false
        }
    };
}
