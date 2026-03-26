/**
 * Real-time service for WebSocket/polling based updates
 * Provides real-time notifications for dashboard updates
 */
import { apiConfig, featureConfig } from '../config';
export class RealtimeService {
    constructor() {
        Object.defineProperty(this, "ws", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "subscribers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "reconnectAttempts", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "maxReconnectAttempts", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 5
        });
        Object.defineProperty(this, "reconnectDelay", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1000
        });
        Object.defineProperty(this, "isConnected", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "usePolling", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "pollingInterval", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "lastPollTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        // Check if realtime feature is enabled
        if (!featureConfig.realtime) {
            console.warn('Realtime features are disabled. Set VITE_ENABLE_REALTIME=true to enable.');
            return;
        }
        this.initialize();
    }
    /**
     * Initialize real-time connection
     */
    initialize() {
        if (typeof WebSocket !== 'undefined' && !this.usePolling) {
            this.connectWebSocket();
        }
        else {
            this.startPolling();
        }
    }
    /**
     * Connect to WebSocket server
     */
    connectWebSocket() {
        try {
            const wsUrl = apiConfig.url.replace('http', 'ws') + '/ws';
            this.ws = new WebSocket(wsUrl);
            this.ws.onopen = () => {
                console.log('🔌 WebSocket connected');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.notifySubscribers('system.notification', { type: 'connected', message: 'Real-time connection established' });
            };
            this.ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    this.handleMessage(message);
                }
                catch (error) {
                    console.error('Failed to parse WebSocket message:', error);
                }
            };
            this.ws.onclose = () => {
                console.log('🔌 WebSocket disconnected');
                this.isConnected = false;
                this.handleDisconnection();
            };
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.isConnected = false;
            };
        }
        catch (error) {
            console.error('Failed to connect WebSocket:', error);
            this.fallbackToPolling();
        }
    }
    /**
     * Fallback to polling if WebSocket fails
     */
    fallbackToPolling() {
        console.log('Falling back to polling');
        this.usePolling = true;
        this.startPolling();
    }
    /**
     * Start polling for updates
     */
    startPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
        }
        this.pollingInterval = setInterval(() => {
            this.pollForUpdates();
        }, 5000); // Poll every 5 seconds
        console.log('📡 Started polling for updates');
    }
    /**
     * Poll server for updates
     */
    async pollForUpdates() {
        try {
            const response = await fetch(`${apiConfig.url}/realtime/updates?since=${this.lastPollTime}`);
            if (response.ok) {
                const updates = await response.json();
                updates.forEach(update => this.handleMessage(update));
                this.lastPollTime = Date.now();
            }
        }
        catch (error) {
            console.error('Polling failed:', error);
        }
    }
    /**
     * Handle disconnection and attempt reconnect
     */
    handleDisconnection() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
            console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => {
                if (!this.isConnected) {
                    this.initialize();
                }
            }, delay);
        }
        else {
            console.warn('Max reconnection attempts reached. Falling back to polling.');
            this.fallbackToPolling();
        }
    }
    /**
     * Handle incoming message
     */
    handleMessage(message) {
        const handlers = this.subscribers.get(message.event);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(message.data);
                }
                catch (error) {
                    console.error(`Error in handler for event ${message.event}:`, error);
                }
            });
        }
    }
    /**
     * Subscribe to real-time events
     */
    subscribe(event, handler) {
        if (!this.subscribers.has(event)) {
            this.subscribers.set(event, new Set());
        }
        const handlers = this.subscribers.get(event);
        handlers.add(handler);
        return {
            unsubscribe: () => {
                handlers.delete(handler);
                if (handlers.size === 0) {
                    this.subscribers.delete(event);
                }
            }
        };
    }
    /**
     * Send event to server (if connected via WebSocket)
     */
    send(event, data = {}) {
        if (this.ws && this.isConnected && this.ws.readyState === WebSocket.OPEN) {
            const message = {
                event,
                data,
                timestamp: new Date().toISOString()
            };
            this.ws.send(JSON.stringify(message));
            return true;
        }
        // If not connected via WebSocket, simulate local event
        this.notifySubscribers(event, data);
        return false;
    }
    /**
     * Notify subscribers of an event (local only)
     */
    notifySubscribers(event, data) {
        const handlers = this.subscribers.get(event);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(data);
                }
                catch (error) {
                    console.error(`Error in handler for event ${event}:`, error);
                }
            });
        }
    }
    /**
     * Get connection status
     */
    getStatus() {
        return {
            isConnected: this.isConnected,
            usePolling: this.usePolling,
            reconnectAttempts: this.reconnectAttempts
        };
    }
    /**
     * Disconnect and clean up
     */
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
        this.subscribers.clear();
        this.isConnected = false;
        console.log('🔌 Real-time service disconnected');
    }
}
// Singleton instance
export const realtimeService = new RealtimeService();
/**
 * Hook for using real-time service in React components
 */
export function useRealtime() {
    const subscribe = (event, handler) => {
        const subscription = realtimeService.subscribe(event, handler);
        // Auto-unsubscribe on unmount
        return () => {
            subscription.unsubscribe();
        };
    };
    const send = (event, data) => {
        return realtimeService.send(event, data);
    };
    const getStatus = () => {
        return realtimeService.getStatus();
    };
    return {
        subscribe,
        send,
        getStatus,
        isEnabled: featureConfig.realtime
    };
}
