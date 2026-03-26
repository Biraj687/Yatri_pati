/**
 * useRealTimeUpdates Hook
 * Simulates real-time updates using polling
 */
import { useEffect, useState, useRef, useCallback } from 'react';
/**
 * Hook for simulating real-time updates via polling
 */
export function useRealTimeUpdates(fetchFn, options = {}) {
    const { interval = 30000, // 30 seconds default
    enabled = true, } = options;
    const [data, setData] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const intervalRef = useRef(null);
    const fetchRef = useRef(fetchFn);
    // Update reference to fetch function
    useEffect(() => {
        fetchRef.current = fetchFn;
    }, [fetchFn]);
    const fetchData = useCallback(async () => {
        setIsUpdating(true);
        try {
            const result = await fetchRef.current();
            setData(result);
        }
        catch (error) {
            console.error('Error fetching real-time data:', error);
        }
        finally {
            setIsUpdating(false);
        }
    }, []);
    // Set up polling
    useEffect(() => {
        // Initial fetch
        if (enabled) {
            fetchData();
            // Set up polling interval
            intervalRef.current = setInterval(() => {
                fetchData();
            }, interval);
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [enabled, interval, fetchData]);
    return {
        data,
        isUpdating,
        refetch: fetchData,
    };
}
/**
 * Hook for live notification simulation
 */
export function useLiveNotifications(fetchFn, options = {}) {
    const { interval = 60000, // 1 minute default
    enabled = true, } = options;
    const [notifications, setNotifications] = useState([]);
    const [newCount, setNewCount] = useState(0);
    const previousCountRef = useRef(0);
    const intervalRef = useRef(null);
    const fetchRef = useRef(fetchFn);
    useEffect(() => {
        fetchRef.current = fetchFn;
    }, [fetchFn]);
    useEffect(() => {
        if (!enabled)
            return;
        const checkForUpdates = async () => {
            try {
                const result = await fetchRef.current();
                setNotifications(result);
                // Track new items
                const currentCount = result.length;
                if (currentCount > previousCountRef.current) {
                    setNewCount(currentCount - previousCountRef.current);
                }
                previousCountRef.current = currentCount;
            }
            catch (error) {
                console.error('Error checking notifications:', error);
            }
        };
        // Initial check
        checkForUpdates();
        // Set up polling
        intervalRef.current = setInterval(checkForUpdates, interval);
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [enabled, interval]);
    const clearNewCount = useCallback(() => {
        setNewCount(0);
    }, []);
    return {
        notifications,
        newCount,
        clearNewCount,
    };
}
