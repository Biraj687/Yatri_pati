import { useState, useCallback, useEffect } from 'react';
export function useModal() {
    const [isOpen, setIsOpen] = useState(false);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen(prev => !prev), []);
    return { isOpen, open, close, toggle };
}
export function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        }
        catch (error) {
            console.error(error);
            return initialValue;
        }
    });
    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        catch (error) {
            console.error(error);
        }
    };
    return [storedValue, setValue];
}
export function useFetch(url, options) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url, options);
            if (!response.ok)
                throw new Error('Failed to fetch');
            const result = await response.json();
            setData(result);
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
        }
        finally {
            setLoading(false);
        }
    }, [url, options]);
    useEffect(() => {
        refetch();
    }, [refetch]);
    return { data, loading, error, refetch };
}
export function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}
export function useAsync(asyncFunction, immediate = true) {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const execute = useCallback(async () => {
        setStatus('pending');
        setData(null);
        setError(null);
        try {
            const response = await asyncFunction();
            setData(response);
            setStatus('success');
        }
        catch (error) {
            setError(error);
            setStatus('error');
        }
    }, [asyncFunction]);
    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);
    return { status, data, error, execute };
}
