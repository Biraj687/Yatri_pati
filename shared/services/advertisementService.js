/**
 * Advertisement Service - Unified data layer for advertisement operations
 * Handles CRUD and analytics for advertisements
 */
import { dashboardApiClient } from './apiClient';
import { mockAdvertisements, mockAnalyticsData } from '../mocks/advertisements';
export class AdvertisementService {
    constructor() {
        Object.defineProperty(this, "api", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: dashboardApiClient
        });
    }
    // Advertisements CRUD
    async getAllAdvertisements(params) {
        const endpoint = '/dashboard/advertisements';
        const queryParams = new URLSearchParams(Object.entries(params || {}).map(([key, val]) => [key, String(val)])).toString();
        const url = queryParams ? `${endpoint}?${queryParams}` : endpoint;
        return this.api.get(url, {
            mockData: () => this.getMockAdvertisements(params)
        });
    }
    async getAdvertisementById(id) {
        return this.api.get(`/dashboard/advertisements/${id}`, {
            mockData: () => this.getMockAdvertisementById(id)
        });
    }
    async createAdvertisement(payload) {
        return this.api.post('/dashboard/advertisements', payload, {
            mockData: () => this.getMockCreatedAdvertisement(payload)
        });
    }
    async updateAdvertisement(id, payload) {
        return this.api.put(`/dashboard/advertisements/${id}`, payload, {
            mockData: () => this.getMockUpdatedAdvertisement(id, payload)
        });
    }
    async deleteAdvertisement(id) {
        return this.api.delete(`/dashboard/advertisements/${id}`, {
            mockData: () => Promise.resolve()
        });
    }
    async toggleAdvertisement(id) {
        return this.api.post(`/dashboard/advertisements/${id}/toggle`, {}, {
            mockData: () => this.getMockToggledAdvertisement(id)
        });
    }
    // Analytics
    async getAdvertisementAnalytics() {
        return this.api.get('/dashboard/advertisements/analytics', {
            mockData: () => Promise.resolve(mockAnalyticsData)
        });
    }
    async recordImpression(id) {
        return this.api.post(`/dashboard/advertisements/${id}/impression`, {}, {
            mockData: () => Promise.resolve()
        });
    }
    async recordClick(id) {
        return this.api.post(`/dashboard/advertisements/${id}/click`, {}, {
            mockData: () => Promise.resolve()
        });
    }
    // Public-facing method to get active advertisements
    async getActiveAdvertisements(position) {
        const endpoint = '/advertisements/active';
        const url = position ? `${endpoint}?position=${position}` : endpoint;
        return this.api.get(url, {
            mockData: () => this.getMockActiveAdvertisements(position)
        });
    }
    // Mock data methods
    async getMockAdvertisements(params) {
        let filtered = [...mockAdvertisements];
        if (params?.position) {
            filtered = filtered.filter(ad => ad.position === params.position);
        }
        if (params?.isActive !== undefined) {
            filtered = filtered.filter(ad => ad.isActive === params.isActive);
        }
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const start = (page - 1) * limit;
        const end = start + limit;
        return {
            data: filtered.slice(start, end),
            total: filtered.length,
            page,
            limit,
            totalPages: Math.ceil(filtered.length / limit)
        };
    }
    async getMockAdvertisementById(id) {
        const ad = mockAdvertisements.find(a => String(a.id) === String(id));
        if (!ad) {
            throw new Error(`Advertisement with ID ${id} not found`);
        }
        return ad;
    }
    async getMockCreatedAdvertisement(payload) {
        const newId = Math.max(...mockAdvertisements.map(a => Number(a.id)), 0) + 1;
        return {
            ...payload,
            id: newId,
            isActive: payload.isActive ?? true,
            impressions: 0,
            clicks: 0,
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }
    async getMockUpdatedAdvertisement(id, payload) {
        const ad = await this.getMockAdvertisementById(id);
        return {
            ...ad,
            ...payload,
            updatedAt: new Date().toISOString()
        };
    }
    async getMockToggledAdvertisement(id) {
        const ad = await this.getMockAdvertisementById(id);
        return {
            ...ad,
            isActive: !ad.isActive,
            updatedAt: new Date().toISOString()
        };
    }
    async getMockActiveAdvertisements(position) {
        let active = mockAdvertisements.filter(ad => ad.isActive);
        if (position) {
            active = active.filter(ad => ad.position === position);
        }
        return active;
    }
}
export const advertisementService = new AdvertisementService();
