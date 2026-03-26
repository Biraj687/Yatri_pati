import { useState, useCallback, useRef } from 'react';
import { createAsyncState, apiResponseToStateUpdate, withAsyncState } from '../types/async';
/**
 * Generic hook for handling async operations with standardized state management
 *
 * @template T The data type
 * @param initialData Optional initial data
 * @returns Object containing state and control functions
 */
export function useAsync(initialData) {
    const [state, setState] = useState(() => createAsyncState(initialData ?? null));
    const abortControllerRef = useRef(null);
    /**
     * Execute an async operation and update state accordingly
     */
    const execute = useCallback(async (asyncFn, options) => {
        // Cancel previous request if exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        // Create new abort controller
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
        // Update state to loading
        setState(prev => ({
            ...prev,
            loading: true,
            error: null,
            // Keep previous data if requested
            data: options?.keepPreviousData ? prev.data : null,
        }));
        try {
            const result = await asyncFn();
            // Check if request was aborted
            if (abortController.signal.aborted) {
                return;
            }
            // Handle both raw data and ApiResponse
            let data;
            let isSuccess = true;
            let error = null;
            if (result && typeof result === 'object' && 'success' in result) {
                const apiResponse = result;
                isSuccess = apiResponse.success;
                data = apiResponse.data;
                error = apiResponse.error || null;
            }
            else {
                data = result;
            }
            if (!isSuccess) {
                throw new Error(error || 'Operation failed');
            }
            setState({
                data,
                loading: false,
                error: null,
                lastUpdated: Date.now(),
            });
            options?.onSuccess?.(data);
        }
        catch (error) {
            // Check if request was aborted
            if (abortController.signal.aborted) {
                return;
            }
            const errorMessage = error instanceof Error ? error.message : String(error);
            setState(prev => ({
                ...prev,
                loading: false,
                error: errorMessage,
                lastUpdated: Date.now(),
            }));
            options?.onError?.(errorMessage);
        }
        finally {
            if (!abortController.signal.aborted) {
                abortControllerRef.current = null;
                options?.onFinally?.();
            }
        }
    }, []);
    /**
     * Execute using the withAsyncState pattern
     */
    const executeWithAsyncState = useCallback(async (operation, options) => {
        return withAsyncState(operation, (update) => {
            setState(prev => ({ ...prev, ...update }));
        }).then(response => {
            if (response.success) {
                options?.onSuccess?.(response);
            }
            else {
                options?.onError?.(response);
            }
            return response;
        });
    }, []);
    /**
     * Update state from an API response
     */
    const updateFromApiResponse = useCallback((response) => {
        setState(prev => ({ ...prev, ...apiResponseToStateUpdate(response, prev) }));
    }, []);
    /**
     * Reset state to initial values
     */
    const reset = useCallback((newData) => {
        setState(createAsyncState(newData ?? initialData ?? null));
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, [initialData]);
    /**
     * Manually set data (useful for optimistic updates)
     */
    const setData = useCallback((data) => {
        setState(prev => {
            const newData = typeof data === 'function'
                ? data(prev.data)
                : data;
            return {
                ...prev,
                data: newData,
                loading: false,
                error: null,
                lastUpdated: Date.now(),
            };
        });
    }, []);
    /**
     * Manually set error
     */
    const setError = useCallback((error) => {
        setState(prev => ({
            ...prev,
            loading: false,
            error,
            lastUpdated: Date.now(),
        }));
    }, []);
    return {
        ...state,
        execute,
        executeWithAsyncState,
        updateFromApiResponse,
        reset,
        setData,
        setError,
        abort: () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        },
        // Convenience properties
        isIdle: !state.loading && !state.error && !state.data,
        isSuccess: !state.loading && !state.error && !!state.data,
        isError: !!state.error,
    };
}
/**
 * Hook for handling paginated async operations
 */
export function usePaginatedAsync(initialPage = 1, initialLimit = 20) {
    const [page, setPage] = useState(initialPage);
    const [limit] = useState(initialLimit);
    const [hasMore, setHasMore] = useState(true);
    const asyncState = useAsync([]);
    const loadMore = useCallback(async (loadFn, options) => {
        const append = options?.append ?? true;
        await asyncState.execute(async () => {
            const result = await loadFn(page, limit);
            setPage(prev => prev + 1);
            setHasMore(result.hasMore);
            const newData = append && asyncState.data
                ? [...asyncState.data, ...result.data]
                : result.data;
            options?.onSuccess?.(newData, result.total);
            return newData;
        }, {
            keepPreviousData: append,
        });
    }, [page, limit, asyncState]);
    const resetPagination = useCallback(() => {
        setPage(initialPage);
        setHasMore(true);
        asyncState.reset([]);
    }, [initialPage, asyncState]);
    const goToPage = useCallback((newPage) => {
        setPage(newPage);
        // Reset data when changing pages (will be loaded by component)
        asyncState.setData([]);
        setHasMore(true);
    }, [asyncState]);
    return {
        ...asyncState,
        page,
        limit,
        hasMore,
        loadMore,
        resetPagination,
        goToPage,
        setPage,
    };
}
