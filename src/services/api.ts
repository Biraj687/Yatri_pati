import { apiClient } from './apiClient';
import type { Article } from './newsService';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NewsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: 'latest' | 'popular' | 'trending';
  author?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  articleCount: number;
}

class NewsApiService {
  private client = apiClient;

  // Fetch all news with pagination and filtering
  async getNews(params: NewsQueryParams = {}): Promise<PaginatedResponse<Article>> {
    const { page = 1, limit = 20, category, search, sort = 'latest', author } = params;
    
    try {
      // Build query string
      const queryParams = new URLSearchParams();
      queryParams.set('page', page.toString());
      queryParams.set('limit', limit.toString());
      queryParams.set('sort', sort);
      if (category) queryParams.set('category', category);
      if (search) queryParams.set('q', search);
      if (author) queryParams.set('author', author);
      
      const endpoint = `/news?${queryParams.toString()}`;
      const response = await this.client.get<PaginatedResponse<Article>>(endpoint);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch news');
      }

      return response.data || { data: [], total: 0, page: 1, limit: 20, totalPages: 0 };
    } catch (error) {
      console.error('Error fetching news:', error);
      // Fallback to mock data if API fails
      return this.getMockNews(params);
    }
  }


  // Fetch single article by ID
  async getArticleById(id: string | number): Promise<Article | null> {
    try {
      const response = await this.client.get<Article>(`/news/article/${id}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Article not found');
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching article ${id}:`, error);
      // Fallback to mock article
      return this.getMockArticleById(id);
    }
  }

  // Fetch single article by slug
  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const response = await this.client.get<Article>(`/news/${slug}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Article not found');
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching article ${slug}:`, error);
      // Fallback to mock article
      return this.getMockArticleBySlug(slug);
    }
  }

  // Fetch articles by category
  async getArticlesByCategory(categorySlug: string, params: Omit<NewsQueryParams, 'category'> = {}): Promise<PaginatedResponse<Article>> {
    return this.getNews({ ...params, category: categorySlug });
  }

  // Fetch trending articles
  async getTrendingArticles(limit: number = 5): Promise<Article[]> {
    try {
      const endpoint = `/news/trending?limit=${limit}`;
      const response = await this.client.get<Article[]>(endpoint);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch trending articles');
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching trending articles:', error);
      return this.getMockTrendingArticles(limit);
    }
  }

  // Fetch all categories
  async getCategories(): Promise<Category[]> {
    try {
      const response = await this.client.get<Category[]>('/categories');
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch categories');
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return this.getMockCategories();
    }
  }

  // Search articles with debounced API call
  async searchArticles(query: string, params: Omit<NewsQueryParams, 'search'> = {}): Promise<PaginatedResponse<Article>> {
    return this.getNews({ ...params, search: query });
  }

  // Mock data fallbacks
  private async getMockNews(params: NewsQueryParams): Promise<PaginatedResponse<Article>> {
    // Import the existing mock data from newsService
    const { fetchNewsData } = await import('./newsService');
    
    try {
      const data = await fetchNewsData();
      const allArticles = [data.hero, data.featured, ...data.articles];
      
      // Apply filters
      let filtered = allArticles;
      
      if (params.category) {
        filtered = filtered.filter(article => 
          article.category?.toLowerCase() === params.category?.toLowerCase()
        );
      }
      
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filtered = filtered.filter(article =>
          article.title.toLowerCase().includes(searchLower) ||
          article.excerpt.toLowerCase().includes(searchLower) ||
          article.author.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply sorting
      if (params.sort === 'popular') {
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
      } else if (params.sort === 'trending') {
        // Simple trending logic based on recency and views
        filtered.sort((a, b) => {
          const aScore = (a.views || 0) * 0.7 + (this.getDateScore(a.date) || 0) * 0.3;
          const bScore = (b.views || 0) * 0.7 + (this.getDateScore(b.date) || 0) * 0.3;
          return bScore - aScore;
        });
      } else {
        // Latest first (default)
        filtered.sort((a, b) => this.getDateScore(b.date) - this.getDateScore(a.date));
      }
      
      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filtered.slice(startIndex, endIndex);
      
      return {
        data: paginatedData,
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit)
      };
    } catch (error) {
      console.error('Error in mock news fallback:', error);
      return { data: [], total: 0, page: 1, limit: 20, totalPages: 0 };
    }
  }

  private async getMockArticleById(id: string | number): Promise<Article | null> {
    try {
      // Try dynamic import first
      const { fetchNewsData } = await import('./newsService');
      const data = await fetchNewsData();
      const allArticles = [data.hero, data.featured, ...data.articles];
      
      // Find article by ID
      const article = allArticles.find(a => a.id.toString() === id.toString());
      
      if (article) {
        return article;
      }
      
      // If not found, return first article as fallback
      if (allArticles.length > 0) {
        console.warn(`Article with ID ${id} not found, returning first available article as fallback`);
        return allArticles[0];
      }
      
      // Last resort: create a dummy article
      console.warn(`No articles available, creating dummy article for ID ${id}`);
      return this.createDummyArticle(id);
    } catch (error) {
      console.error('Error in mock article by id fallback:', error);
      // Return dummy article on complete failure
      return this.createDummyArticle(id);
    }
  }

  private async getMockArticleBySlug(slug: string): Promise<Article | null> {
    try {
      // Try dynamic import first
      const { fetchNewsData } = await import('./newsService');
      const data = await fetchNewsData();
      const allArticles = [data.hero, data.featured, ...data.articles];
      
      // Debug: log all articles and their slugs
      console.log(`Searching for slug: "${slug}"`);
      console.log(`Total articles: ${allArticles.length}`);
      allArticles.forEach((a, i) => {
        const articleSlug = this.generateSlug(a.title);
        console.log(`Article ${i}: title="${a.title}", slug="${articleSlug}", id="${a.id}"`);
      });
      
      // Find article by slug (using title as slug for mock)
      const article = allArticles.find(a =>
        this.generateSlug(a.title) === slug ||
        a.id.toString() === slug ||
        (a as any).slug === slug
      );
      
      if (article) {
        console.log(`Found mock article for slug "${slug}": ${article.title}`);
        return article;
      }
      
      console.warn(`No mock article found for slug "${slug}", trying fallback...`);
      
      // If not found by slug, try to find any article
      if (allArticles.length > 0) {
        console.log(`Returning first article as fallback for slug "${slug}"`);
        return allArticles[0];
      }
      
      return null;
    } catch (error) {
      console.error('Error in mock article fallback:', error);
      
      // Create a fallback article if everything fails
      const fallbackArticle: Article = {
        id: 'fallback-1',
        title: `समाचार: ${slug}`,
        image: 'https://via.placeholder.com/800x450?text=Image+Not+Available',
        excerpt: 'यो समाचारको विवरण उपलब्ध छैन।',
        author: 'बिराज प्याकुरेल',
        date: new Date().toLocaleDateString('ne-NP'),
        category: 'समाचार',
        content: 'यो एक मोकअप समाचार हो। वास्तविक समाचार सेवा उपलब्ध नभएको कारण यो प्रदर्शन गरिएको छ।'
      };
      
      return fallbackArticle;
    }
  }

  private async getMockTrendingArticles(limit: number): Promise<Article[]> {
    const { fetchNewsData } = await import('./newsService');
    
    try {
      const data = await fetchNewsData();
      const allArticles = [data.hero, data.featured, ...data.articles];
      
      // Sort by views and date for trending
      return allArticles
        .sort((a, b) => {
          const aScore = (a.views || 0) * 0.7 + (this.getDateScore(a.date) || 0) * 0.3;
          const bScore = (b.views || 0) * 0.7 + (this.getDateScore(b.date) || 0) * 0.3;
          return bScore - aScore;
        })
        .slice(0, limit);
    } catch (error) {
      console.error('Error in mock trending fallback:', error);
      return [];
    }
  }

  private getMockCategories(): Category[] {
    // Common news categories
    return [
      { id: '1', name: 'राजनीति', slug: 'rajniti', articleCount: 42 },
      { id: '2', name: 'अर्थ', slug: 'arth', articleCount: 38 },
      { id: '3', name: 'समाज', slug: 'samaj', articleCount: 56 },
      { id: '4', name: 'खेलकुद', slug: 'khelkud', articleCount: 29 },
      { id: '5', name: 'मनोरञ्जन', slug: 'manoranjan', articleCount: 47 },
      { id: '6', name: 'विज्ञान र प्रविधि', slug: 'vigyan-ra-pravidhi', articleCount: 31 },
      { id: '7', name: 'स्वास्थ्य', slug: 'swasthya', articleCount: 24 },
      { id: '8', name: 'अन्तर्राष्ट्रिय', slug: 'antarrastriya', articleCount: 19 },
    ];
  }

  // Helper methods
  private createDummyArticle(id: string | number): Article {
    const timestamp = new Date().toLocaleDateString('ne-NP');
    return {
      id: id,
      title: `समाचार - ${id}`,
      image: 'https://via.placeholder.com/800x450?text=समाचार',
      excerpt: 'यो एक डेमो समाचार हो। वास्तविक डेटा उपलब्ध नभएकोले यो प्रदर्शन गरिएको हो।',
      author: 'यत्रिपाटि',
      date: timestamp,
      category: 'समाचार',
      content: `यो एक प्रदर्शनी समाचार हो।

आपको डिभाइसमा समाचार डेटा सही तरीकले लोड भएको छैन। कृपया पछि पुनः प्रयास गर्नुहोस्।

डेमो उद्देश्यको लागि यो सामग्री प्रदर्शन गरिएको हो। साइट सामान्य अवस्थामा वास्तविक समाचार सामग्री प्रदान गर्छ।`,
      readTime: '२ मिनेट पढ्नु',
      views: 1234,
      source: 'यत्रिपाटि न्यूज'
    };
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }

  private getDateScore(dateString: string): number {
    try {
      // Try to parse Nepali date or fallback to current date
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return Date.now(); // Fallback to current timestamp
      }
      return date.getTime();
    } catch {
      return Date.now();
    }
  }
}

export const newsApi = new NewsApiService();