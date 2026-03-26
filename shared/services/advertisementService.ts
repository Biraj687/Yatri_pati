/**
 * Advertisement Service - Unified data layer for advertisement operations
 * Handles CRUD and analytics for advertisements
 */

import { dashboardApiClient } from './apiClient';
import type {
  Advertisement,
  CreateAdvPayload,
  UpdateAdvPayload,
  ApiResponse,
  PaginatedResponse,
  AnalyticsData
} from '../types';
import { mockAdvertisements, mockAnalyticsData } from '../mocks/advertisements';

export class AdvertisementService {
  private api = dashboardApiClient;

  // Advertisements CRUD
  async getAllAdvertisements(
    params?: Partial<{ page: number; limit: number; position: string; isActive: boolean }>
  ): Promise<ApiResponse<PaginatedResponse<Advertisement>>> {
    const endpoint = '/dashboard/advertisements';
    const queryParams = new URLSearchParams(
      Object.entries(params || {}).map(([key, val]) => [key, String(val)])
    ).toString();
    const url = queryParams ? `${endpoint}?${queryParams}` : endpoint;

    return this.api.get<PaginatedResponse<Advertisement>>(url, {
      mockData: () => this.getMockAdvertisements(params)
    });
  }

  async getAdvertisementById(id: string | number): Promise<ApiResponse<Advertisement>> {
    return this.api.get<Advertisement>(`/dashboard/advertisements/${id}`, {
      mockData: () => this.getMockAdvertisementById(id)
    });
  }

  async createAdvertisement(payload: CreateAdvPayload): Promise<ApiResponse<Advertisement>> {
    return this.api.post<Advertisement>('/dashboard/advertisements', payload, {
      mockData: () => this.getMockCreatedAdvertisement(payload)
    });
  }

  async updateAdvertisement(
    id: string | number,
    payload: Partial<UpdateAdvPayload>
  ): Promise<ApiResponse<Advertisement>> {
    return this.api.put<Advertisement>(`/dashboard/advertisements/${id}`, payload, {
      mockData: () => this.getMockUpdatedAdvertisement(id, payload)
    });
  }

  async deleteAdvertisement(id: string | number): Promise<ApiResponse<void>> {
    return this.api.delete<void>(`/dashboard/advertisements/${id}`, {
      mockData: () => Promise.resolve()
    });
  }

  async toggleAdvertisement(id: string | number): Promise<ApiResponse<Advertisement>> {
    return this.api.post<Advertisement>(`/dashboard/advertisements/${id}/toggle`, {}, {
      mockData: () => this.getMockToggledAdvertisement(id)
    });
  }

  // Analytics
  async getAdvertisementAnalytics(): Promise<ApiResponse<AnalyticsData>> {
    return this.api.get<AnalyticsData>('/dashboard/advertisements/analytics', {
      mockData: () => Promise.resolve(mockAnalyticsData)
    });
  }

  async recordImpression(id: string | number): Promise<ApiResponse<void>> {
    return this.api.post<void>(`/dashboard/advertisements/${id}/impression`, {}, {
      mockData: () => Promise.resolve()
    });
  }

  async recordClick(id: string | number): Promise<ApiResponse<void>> {
    return this.api.post<void>(`/dashboard/advertisements/${id}/click`, {}, {
      mockData: () => Promise.resolve()
    });
  }

  // Public-facing method to get active advertisements
  async getActiveAdvertisements(
    position?: 'hero' | 'sidebar' | 'inline' | 'footer' | 'fullwidth'
  ): Promise<ApiResponse<Advertisement[]>> {
    const endpoint = '/advertisements/active';
    const url = position ? `${endpoint}?position=${position}` : endpoint;

    return this.api.get<Advertisement[]>(url, {
      mockData: () => this.getMockActiveAdvertisements(position)
    });
  }

  // Mock data methods
  private async getMockAdvertisements(
    params?: Partial<{ page: number; limit: number; position: string; isActive: boolean }>
  ): Promise<PaginatedResponse<Advertisement>> {
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

  private async getMockAdvertisementById(id: string | number): Promise<Advertisement> {
    const ad = mockAdvertisements.find(a => String(a.id) === String(id));
    if (!ad) {
      throw new Error(`Advertisement with ID ${id} not found`);
    }
    return ad;
  }

  private async getMockCreatedAdvertisement(payload: CreateAdvPayload): Promise<Advertisement> {
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

  private async getMockUpdatedAdvertisement(
    id: string | number,
    payload: Partial<UpdateAdvPayload>
  ): Promise<Advertisement> {
    const ad = await this.getMockAdvertisementById(id);
    return {
      ...ad,
      ...payload,
      updatedAt: new Date().toISOString()
    };
  }

  private async getMockToggledAdvertisement(id: string | number): Promise<Advertisement> {
    const ad = await this.getMockAdvertisementById(id);
    return {
      ...ad,
      isActive: !ad.isActive,
      updatedAt: new Date().toISOString()
    };
  }

  private async getMockActiveAdvertisements(
    position?: string
  ): Promise<Advertisement[]> {
    let active = mockAdvertisements.filter(ad => ad.isActive);
    if (position) {
      active = active.filter(ad => ad.position === position);
    }
    return active;
  }
}

export const advertisementService = new AdvertisementService();
