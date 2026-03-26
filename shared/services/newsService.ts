/**
 * News Service - Unified data layer for news operations
 * Uses the shared API client
 */

import { mainApiClient } from './apiClient';
import type {
  Article,
  PaginatedResponse,
  NewsQueryParams,
  ApiResponse
} from '../types';
import { mockArticles } from '../mocks/articles';

export class NewsService {
  private api = mainApiClient;

  /**
   * Fetch news with pagination and filtering
   */
  async getNews(params: NewsQueryParams = {}): Promise<ApiResponse<PaginatedResponse<Article>>> {
    const { page = 1, limit = 20, category, search, sortBy = 'date', sortOrder = 'desc' } = params;
    
    const endpoint = '/news';
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });

    if (category) queryParams.append('category', category);
    if (search) queryParams.append('search', search);

    const url = `${endpoint}?${queryParams.toString()}`;

    return this.api.get<PaginatedResponse<Article>>(url, {
      mockData: () => this.getMockNews(params)
    });
  }

  /**
   * Fetch single article by ID
   */
  async getArticleById(id: string | number): Promise<ApiResponse<Article>> {
    return this.api.get<Article>(`/news/${id}`, {
      mockData: () => this.getMockArticleById(id)
    });
  }

  /**
   * Fetch single article by slug
   */
  async getArticleBySlug(slug: string): Promise<ApiResponse<Article>> {
    return this.api.get<Article>(`/news/slug/${slug}`, {
      mockData: () => this.getMockArticleBySlug(slug)
    });
  }

  /**
   * Fetch trending articles
   */
  async getTrendingArticles(limit: number = 5): Promise<ApiResponse<Article[]>> {
    return this.api.get<Article[]>(`/news/trending?limit=${limit}`, {
      mockData: () => this.getMockTrendingArticles(limit)
    });
  }

  /**
   * Fetch articles by category
   */
  async getArticlesByCategory(category: string, limit?: number): Promise<ApiResponse<Article[]>> {
    const url = limit ? `/news/category/${category}?limit=${limit}` : `/news/category/${category}`;
    
    return this.api.get<Article[]>(url, {
      mockData: () => this.getMockArticlesByCategory(category, limit)
    });
  }

  /**
   * Search articles
   */
  async searchArticles(query: string, limit?: number): Promise<ApiResponse<Article[]>> {
    const url = limit ? `/news/search?q=${query}&limit=${limit}` : `/news/search?q=${query}`;
    
    return this.api.get<Article[]>(url, {
      mockData: () => this.getMockSearchResults(query, limit)
    });
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<ApiResponse<string[]>> {
    return this.api.get<string[]>('/news/categories', {
      mockData: () => this.getMockCategories()
    });
  }

  // Mock data methods (will be extracted to separate file)
  private async getMockNews(params: NewsQueryParams): Promise<PaginatedResponse<Article>> {
    let filtered = [...mockArticles];
    
    if (params.category) {
      filtered = filtered.filter(article => 
        article.category?.toLowerCase() === params.category?.toLowerCase()
      );
    }
    
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower)
      );
    }
    
    // Simple sorting
    if (params.sortBy === 'views') {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (params.sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default: sort by date (mock)
      filtered.sort((a, b) => b.date.localeCompare(a.date));
    }
    
    if (params.sortOrder === 'asc') {
      filtered.reverse();
    }
    
    const page = params.page || 1;
    const limit = params.limit || 20;
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

  private async getMockArticleById(id: string | number): Promise<Article> {
    const article = mockArticles.find(a => String(a.id) === String(id));
    
    if (!article) {
      throw new Error(`Article with ID ${id} not found`);
    }
    
    return {
      ...article,
      content: article.content || `This is the full content of article "${article.title}". It would contain the complete article text here.`
    };
  }

  private async getMockArticleBySlug(slug: string): Promise<Article> {
    // For mock, use title as slug
    const article = mockArticles.find(a => 
      a.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug.toLowerCase()
    );
    
    if (!article) {
      throw new Error(`Article with slug "${slug}" not found`);
    }
    
    return {
      ...article,
      content: article.content || `This is the full content of article "${article.title}". It would contain the complete article text here.`
    };
  }

  private async getMockTrendingArticles(limit: number): Promise<Article[]> {
    return mockArticles
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, limit);
  }

  private async getMockArticlesByCategory(category: string, limit?: number): Promise<Article[]> {
    const filtered = mockArticles.filter(article => 
      article.category?.toLowerCase() === category.toLowerCase()
    );
    
    return limit ? filtered.slice(0, limit) : filtered;
  }

  private async getMockSearchResults(query: string, limit?: number): Promise<Article[]> {
    const searchLower = query.toLowerCase();
    const filtered = mockArticles.filter(article =>
      article.title.toLowerCase().includes(searchLower) ||
      article.excerpt.toLowerCase().includes(searchLower) ||
      article.category?.toLowerCase().includes(searchLower)
    );
    
    return limit ? filtered.slice(0, limit) : filtered;
  }

  private async getMockCategories(): Promise<string[]> {
    const categories = new Set(mockArticles.map(article => article.category).filter(Boolean) as string[]);
    return Array.from(categories);
  }
}

// Export singleton instance
export const newsService = new NewsService();