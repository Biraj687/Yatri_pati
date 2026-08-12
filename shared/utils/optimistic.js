/**
 * Optimistic UI utilities
 * Provides functions for optimistic updates and rollback handling
 */
/**
 * Generate a temporary ID for optimistic updates
 */
export function generateTempId(prefix = 'temp_') {
    return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Create an optimistic update manager
 */
export class OptimisticManager {
    constructor() {
        Object.defineProperty(this, "updates", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "maxAge", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 5 * 60 * 1000
        }); // 5 minutes
    }
    /**
     * Add an optimistic update
     */
    add(update) {
        const tempId = update.tempId || generateTempId();
        const fullUpdate = {
            ...update,
            tempId,
            timestamp: Date.now()
        };
        this.updates.set(tempId, fullUpdate);
        // Set up promise handlers
        update.promise
            .then(result => {
            this.handleSuccess(tempId, result);
        })
            .catch(error => {
            this.handleError(tempId, error);
        });
        // Clean up old updates
        this.cleanup();
        return tempId;
    }
    /**
     * Handle successful API response
     */
    handleSuccess(tempId, result) {
        const update = this.updates.get(tempId);
        if (!update)
            return;
        try {
            if (update.onSuccess) {
                update.onSuccess(result, tempId);
            }
        }
        catch (error) {
            console.error('Error in optimistic update success handler:', error);
        }
        finally {
            this.updates.delete(tempId);
        }
    }
    /**
     * Handle API error (rollback)
     */
    handleError(tempId, error) {
        const update = this.updates.get(tempId);
        if (!update)
            return;
        try {
            if (update.onError) {
                update.onError(error, tempId);
            }
            else {
                console.warn(`Optimistic update failed for ${tempId}:`, error);
                // Default rollback behavior: show error notification
                this.notifyError(`Operation failed: ${error.message || 'Unknown error'}`);
            }
        }
        catch (rollbackError) {
            console.error('Error in optimistic update error handler:', rollbackError);
        }
        finally {
            this.updates.delete(tempId);
        }
    }
    /**
     * Get all pending optimistic updates
     */
    getPendingUpdates() {
        return Array.from(this.updates.values());
    }
    /**
     * Check if an ID is a temporary ID
     */
    isTempId(id) {
        return this.updates.has(id) || id.startsWith('temp_');
    }
    /**
     * Get an optimistic update by ID
     */
    getUpdate(tempId) {
        return this.updates.get(tempId);
    }
    /**
     * Remove an optimistic update (manual cleanup)
     */
    remove(tempId) {
        return this.updates.delete(tempId);
    }
    /**
     * Clean up old updates
     */
    cleanup() {
        const now = Date.now();
        for (const [tempId, update] of this.updates.entries()) {
            if (now - update.timestamp > this.maxAge) {
                console.warn(`Cleaning up stale optimistic update: ${tempId}`);
                this.updates.delete(tempId);
            }
        }
    }
    /**
     * Notify error (can be overridden)
     */
    notifyError(message) {
        console.error('Optimistic update error:', message);
        // In a real app, you might want to show a toast notification
        // toast.error(message);
    }
}
/**
 * Helper for optimistic array updates
 */
export class OptimisticArrayManager extends OptimisticManager {
    /**
     * Optimistically add item to array
     */
    optimisticAdd(currentArray, newItem, apiPromise) {
        const tempId = generateTempId();
        const tempItem = { ...newItem, id: tempId };
        this.add({
            tempId,
            data: tempItem,
            promise: apiPromise,
            onSuccess: (result) => {
                // Replace temp item with real item
                console.log(`Optimistic add succeeded: ${tempId} -> ${result.id}`);
            },
            onError: (error, tempId) => {
                console.error(`Optimistic add failed for ${tempId}:`, error);
                // The UI should remove the temp item
            }
        });
        return {
            newArray: [...currentArray, tempItem],
            tempId
        };
    }
    /**
     * Optimistically update item in array
     */
    optimisticUpdate(currentArray, itemId, updates, apiPromise) {
        const tempId = generateTempId('update_');
        const itemIndex = currentArray.findIndex(item => item.id === itemId);
        if (itemIndex === -1) {
            throw new Error(`Item with id ${itemId} not found`);
        }
        const originalItem = currentArray[itemIndex];
        const tempItem = { ...originalItem, ...updates, id: tempId };
        this.add({
            tempId,
            data: tempItem,
            promise: apiPromise,
            onSuccess: (_result) => {
                console.log(`Optimistic update succeeded: ${tempId}`);
            },
            onError: (error, tempId) => {
                console.error(`Optimistic update failed for ${tempId}:`, error);
                // The UI should revert to original item
            }
        });
        const newArray = [...currentArray];
        newArray[itemIndex] = tempItem;
        return {
            newArray,
            tempId
        };
    }
    /**
     * Optimistically remove item from array
     */
    optimisticRemove(currentArray, itemId, apiPromise) {
        const itemIndex = currentArray.findIndex(item => item.id === itemId);
        if (itemIndex === -1) {
            throw new Error(`Item with id ${itemId} not found`);
        }
        const removedItem = currentArray[itemIndex];
        const newArray = currentArray.filter(item => item.id !== itemId);
        this.add({
            tempId: itemId,
            data: removedItem,
            promise: apiPromise,
            onSuccess: () => {
                console.log(`Optimistic remove succeeded: ${itemId}`);
            },
            onError: (error, tempId) => {
                console.error(`Optimistic remove failed for ${tempId}:`, error);
                // The UI should restore the removed item
            }
        });
        return {
            newArray,
            removedItem
        };
    }
}
/**
 * React hook for optimistic updates
 */
export function useOptimistic() {
    const manager = new OptimisticArrayManager();
    const addItem = (currentArray, newItem, apiPromise) => {
        return manager.optimisticAdd(currentArray, newItem, apiPromise);
    };
    const updateItem = (currentArray, itemId, updates, apiPromise) => {
        return manager.optimisticUpdate(currentArray, itemId, updates, apiPromise);
    };
    const removeItem = (currentArray, itemId, apiPromise) => {
        return manager.optimisticRemove(currentArray, itemId, apiPromise);
    };
    const isTempId = (id) => {
        return manager.isTempId(id);
    };
    return {
        addItem,
        updateItem,
        removeItem,
        isTempId,
        getPendingUpdates: () => manager.getPendingUpdates()
    };
}
