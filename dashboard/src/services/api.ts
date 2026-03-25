import type { NewsArticle, CreateNewsPayload, FileItem, DashboardStats } from '@types';

const API_BASE_URL = 'http://localhost:3000/api';

export class DashboardApiService {
  private baseUrl = API_BASE_URL;

  // Articles
  async getAllArticles(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sort?: string;
  }): Promise<{ data: NewsArticle[]; total: number; page: number; limit: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, String(value));
      });
    }
    const response = await fetch(`${this.baseUrl}/articles?${queryParams}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch articles');
    return response.json();
  }

  async getArticleById(id: string): Promise<NewsArticle> {
    const response = await fetch(`${this.baseUrl}/articles/${id}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch article');
    return response.json();
  }

  async createArticle(payload: CreateNewsPayload): Promise<NewsArticle> {
    const response = await fetch(`${this.baseUrl}/articles`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to create article');
    return response.json();
  }

  async updateArticle(id: string, payload: Partial<CreateNewsPayload>): Promise<NewsArticle> {
    const response = await fetch(`${this.baseUrl}/articles/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to update article');
    return response.json();
  }

  async deleteArticle(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/articles/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete article');
  }

  async publishArticle(id: string): Promise<NewsArticle> {
    const response = await fetch(`${this.baseUrl}/articles/${id}/publish`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to publish article');
    return response.json();
  }

  async toggleSticky(id: string): Promise<NewsArticle> {
    const response = await fetch(`${this.baseUrl}/articles/${id}/sticky`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to toggle sticky');
    return response.json();
  }

  // Files
  async getAllFiles(): Promise<FileItem[]> {
    const response = await fetch(`${this.baseUrl}/files`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch files');
    return response.json();
  }

  async uploadFile(file: File): Promise<FileItem> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${this.baseUrl}/files/upload`, {
      method: 'POST',
      body: formData,
      headers: this.getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to upload file');
    return response.json();
  }

  async deleteFile(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/files/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete file');
  }

  // Statistics
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${this.baseUrl}/stats`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch statistics');
    return response.json();
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
    };
  }

  private getAuthHeader() {
    return {
      'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
    };
  }
}

export const dashboardAPI = new DashboardApiService();
