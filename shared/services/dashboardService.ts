/**
 * Dashboard Service - Unified data layer for dashboard operations
 * Uses the shared API client
 */

import { dashboardApiClient } from './apiClient';
import type {
  Article,
  FileItem,
  DashboardStats,
  CreateNewsPayload,
  ApiResponse,
  PaginatedResponse
} from '../types';
import { mockDashboardStats, mockFiles } from '../mocks/dashboard';
import { mockArticles } from '../mocks/articles';

export class DashboardService {
  private api = dashboardApiClient;

  // Articles CRUD
  async getAllArticles(params?: any): Promise<ApiResponse<PaginatedResponse<Article>>> {
    const endpoint = '/dashboard/articles';
    const queryParams = new URLSearchParams(params || {}).toString();
    const url = queryParams ? `${endpoint}?${queryParams}` : endpoint;

    return this.api.get<PaginatedResponse<Article>>(url, {
      mockData: () => this.getMockArticles(params)
    });
  }

  async getArticleById(id: string): Promise<ApiResponse<Article>> {
    return this.api.get<Article>(`/dashboard/articles/${id}`, {
      mockData: () => this.getMockArticleById(id)
    });
  }

  async createArticle(payload: CreateNewsPayload): Promise<ApiResponse<Article>> {
    return this.api.post<Article>('/dashboard/articles', payload, {
      mockData: () => this.getMockCreatedArticle(payload)
    });
  }

  async updateArticle(id: string, payload: Partial<CreateNewsPayload>): Promise<ApiResponse<Article>> {
    return this.api.put<Article>(`/dashboard/articles/${id}`, payload, {
      mockData: () => this.getMockUpdatedArticle(id, payload)
    });
  }

  async deleteArticle(id: string): Promise<ApiResponse<void>> {
    return this.api.delete<void>(`/dashboard/articles/${id}`, {
      mockData: () => Promise.resolve()
    });
  }

  async publishArticle(id: string): Promise<ApiResponse<Article>> {
    return this.api.post<Article>(`/dashboard/articles/${id}/publish`, {}, {
      mockData: () => this.getMockPublishedArticle(id)
    });
  }

  async toggleSticky(id: string): Promise<ApiResponse<Article>> {
    return this.api.post<Article>(`/dashboard/articles/${id}/toggle-sticky`, {}, {
      mockData: () => this.getMockToggledArticle(id)
    });
  }

  // Files management
  async getAllFiles(): Promise<ApiResponse<FileItem[]>> {
    return this.api.get<FileItem[]>('/dashboard/files', {
      mockData: () => Promise.resolve(mockFiles)
    });
  }

  async uploadFile(file: File): Promise<ApiResponse<FileItem>> {
    // Note: For real implementation, this would need FormData handling
    return this.api.post<FileItem>('/dashboard/files/upload', { file }, {
      mockData: () => this.getMockUploadedFile(file)
    });
  }

  async deleteFile(id: string): Promise<ApiResponse<void>> {
    return this.api.delete<void>(`/dashboard/files/${id}`, {
      mockData: () => Promise.resolve()
    });
  }

  // Dashboard stats
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.api.get<DashboardStats>('/dashboard/stats', {
      mockData: () => Promise.resolve(mockDashboardStats)
    });
  }

  // Mock data methods
  private async getMockArticles(params?: any): Promise<PaginatedResponse<Article>> {
    // Use imported mock articles and add status fields
    const articles: Article[] = mockArticles.map((article, index) => ({
      ...article,
      status: index % 2 === 0 ? 'published' : 'draft' as const,
      views: article.views || Math.floor(Math.random() * 1000)
    }));

    // Simple filtering based on params
    let filtered = [...articles];
    
    if (params?.status) {
      filtered = filtered.filter(article => article.status === params.status);
    }
    
    if (params?.category) {
      filtered = filtered.filter(article => article.category === params.category);
    }
    
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower)
      );
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

  private async getMockArticleById(id: string): Promise<Article> {
    const articles = await this.getMockArticles({});
    const article = articles.data.find(a => String(a.id) === id);
    
    if (!article) {
      throw new Error(`Article with ID ${id} not found`);
    }
    
    return {
      ...article,
      content: article.content || `This is the full content of article "${article.title}". It would contain the complete article text here.`
    };
  }

  private async getMockCreatedArticle(payload: CreateNewsPayload): Promise<Article> {
    // Use placeholder image if none provided
    const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIwLjNlbSI+TkVXIEFSVElDTEU8L3RleHQ+PC9zdmc+';
    
    return {
      id: Date.now().toString(),
      title: payload.title,
      image: payload.image || placeholderImage,
      excerpt: payload.excerpt || '',
      author: payload.author || 'बिराज प्याकुरेल',
      date: new Date().toLocaleDateString('ne-NP'),
      category: payload.category || 'समाचार',
      content: payload.content,
      status: payload.status || 'draft',
      views: 0
    };
  }

  private async getMockUpdatedArticle(id: string, payload: Partial<CreateNewsPayload>): Promise<Article> {
    const article = await this.getMockArticleById(id);
    
    return {
      ...article,
      ...payload,
      id // Ensure ID doesn't change
    };
  }

  private async getMockPublishedArticle(id: string): Promise<Article> {
    const article = await this.getMockArticleById(id);
    
    return {
      ...article,
      status: 'published',
      publishedAt: new Date().toISOString()
    };
  }

  private async getMockToggledArticle(id: string): Promise<Article> {
    const article = await this.getMockArticleById(id);
    
    return {
      ...article,
      isSticky: !article.isSticky
    };
  }

  private async getMockUploadedFile(file: File): Promise<FileItem> {
    return {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User'
    };
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();