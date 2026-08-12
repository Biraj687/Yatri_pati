/**
 * useAdvertisements Hook - Advertisement management hook
 * Provides CRUD operations and state management for advertisements
 */

import { useState, useCallback, useEffect } from 'react';
import type { Advertisement, AsyncState, CreateAdvPayload, UpdateAdvPayload, PaginatedResponse } from '../types';
import { advertisementService } from '../services/advertisementService';

/**
 * Hook for managing advertisements with loading/error states
 */
export function useAdvertisements(initialParams?: { page?: number; limit?: number; position?: string; isActive?: boolean }) {
  const [state, setState] = useState<AsyncState<PaginatedResponse<Advertisement>>>({
    data: null,
    loading: true,
    error: null
  });
  const [params, setParams] = useState(initialParams || { page: 1, limit: 10 });

  const fetchAdvertisements = useCallback(async () => {
    setState((prev: AsyncState<PaginatedResponse<Advertisement>>) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await advertisementService.getAllAdvertisements(params);
      if (response.success && response.data) {
        setState({ data: response.data, loading: false, error: null });
      } else {
        setState((prev: AsyncState<PaginatedResponse<Advertisement> | null>) => ({ ...prev, data: null, loading: false, error: response.error || 'Failed to fetch advertisements' }));
      }
    } catch (error) {
      setState((prev: AsyncState<PaginatedResponse<Advertisement> | null>) => ({ ...prev, data: null, loading: false, error: (error as Error).message }));
    }
  }, [params]);

  useEffect(() => {
    fetchAdvertisements();
  }, [fetchAdvertisements]);

  const createAdvertisement = useCallback(async (payload: CreateAdvPayload): Promise<Advertisement | null> => {
    try {
      const response = await advertisementService.createAdvertisement(payload);
      if (response.success && response.data) {
        // Refetch the list
        await fetchAdvertisements();
        return response.data;
      } else {
        setState((prev: AsyncState<PaginatedResponse<Advertisement> | null>) => ({ ...prev, error: response.error || 'Failed to create advertisement' }));
        return null;
      }
    } catch (error) {
      setState((prev: AsyncState<PaginatedResponse<Advertisement> | null>) => ({ ...prev, error: (error as Error).message }));
      return null;
    }
  }, [fetchAdvertisements]);

  const updateAdvertisement = useCallback(async (id: string | number, payload: Partial<UpdateAdvPayload>): Promise<Advertisement | null> => {
    try {
      const response = await advertisementService.updateAdvertisement(id, payload);
      if (response.success && response.data) {
        // Refetch the list
        await fetchAdvertisements();
        return response.data;
      } else {
        setState((prev: AsyncState<PaginatedResponse<Advertisement> | null>) => ({ ...prev, error: response.error || 'Failed to update advertisement' }));
        return null;
      }
    } catch (error) {
      setState((prev: AsyncState<PaginatedResponse<Advertisement> | null>) => ({ ...prev, error: (error as Error).message }));
      return null;
    }
  }, [fetchAdvertisements]);

  const deleteAdvertisement = useCallback(async (id: string | number): Promise<boolean> => {
    try {
      const response = await advertisementService.deleteAdvertisement(id);
      if (response.success) {
        // Refetch the list
        await fetchAdvertisements();
        return true;
      } else {
        setState((prev: AsyncState<PaginatedResponse<Advertisement> | null>) => ({ ...prev, error: response.error || 'Failed to delete advertisement' }));
        return false;
      }
    } catch (error) {
      setState((prev: AsyncState<PaginatedResponse<Advertisement> | null>) => ({ ...prev, error: (error as Error).message }));
      return false;
    }
  }, [fetchAdvertisements]);

  const toggleAdvertisement = useCallback(async (id: string | number): Promise<Advertisement | null> => {
    try {
      const response = await advertisementService.toggleAdvertisement(id);
      if (response.success && response.data) {
        // Refetch the list
        await fetchAdvertisements();
        return response.data;
      } else {
        setState((prev: AsyncState<PaginatedResponse<Advertisement> | null>) => ({ ...prev, error: response.error || 'Failed to toggle advertisement' }));
        return null;
      }
    } catch (error) {
      setState((prev: AsyncState<PaginatedResponse<Advertisement> | null>) => ({ ...prev, error: (error as Error).message }));
      return null;
    }
  }, [fetchAdvertisements]);

  const handlePageChange = useCallback((page: number) => {
    setParams(prev => ({ ...prev, page }));
  }, []);

  return {
    ...state,
    params,
    handlePageChange,
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
    toggleAdvertisement,
    refetch: fetchAdvertisements
  };
}

/**
 * Hook for getting active advertisements
 */
export function useActiveAdvertisements(position?: 'hero' | 'sidebar' | 'inline' | 'footer' | 'fullwidth') {
  const [state, setState] = useState<AsyncState<Advertisement[]>>({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const response = await advertisementService.getActiveAdvertisements(position);
        if (mounted) {
          if (response.success && response.data) {
            setState({ data: response.data, loading: false, error: null });
          } else {
            setState({ data: null, loading: false, error: response.error || 'Failed to fetch advertisements' });
          }
        }
      } catch (error) {
        if (mounted) {
          setState({ data: null, loading: false, error: (error as Error).message });
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [position]);

  return state;
}

/**
 * Hook for getting advertisement analytics
 */
export function useAdvertisementAnalytics() {
  const [state, setState] = useState<any>({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    (async () => {
      setState((prev: any) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await advertisementService.getAdvertisementAnalytics();
        if (response.success && response.data) {
          setState({ data: response.data, loading: false, error: null });
        } else {
          setState({ data: null, loading: false, error: response.error || 'Failed to fetch analytics' });
        }
      } catch (error) {
        setState({ data: null, loading: false, error: (error as Error).message });
      }
    })();
  }, []);

  return state;
}
