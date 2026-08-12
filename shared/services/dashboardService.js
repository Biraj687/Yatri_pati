/**
 * Dashboard Service - Unified data layer for dashboard operations
 * Uses the shared API client
 */
import { dashboardApiClient } from './apiClient';
import { mockDashboardStats, mockFiles } from '../mocks/dashboard';
import { mockArticles } from '../mocks/articles';
export class DashboardService {
    constructor() {
        Object.defineProperty(this, "api", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: dashboardApiClient
        });
    }
    // Articles CRUD
    async getAllArticles(params) {
        const endpoint = '/dashboard/articles';
        const queryParams = new URLSearchParams(params || {}).toString();
        const url = queryParams ? `${endpoint}?${queryParams}` : endpoint;
        return this.api.get(url, {
            mockData: () => this.getMockArticles(params)
        });
    }
    async getArticleById(id) {
        return this.api.get(`/dashboard/articles/${id}`, {
            mockData: () => this.getMockArticleById(id)
        });
    }
    async createArticle(payload) {
        return this.api.post('/dashboard/articles', payload, {
            mockData: () => this.getMockCreatedArticle(payload)
        });
    }
    async updateArticle(id, payload) {
        return this.api.put(`/dashboard/articles/${id}`, payload, {
            mockData: () => this.getMockUpdatedArticle(id, payload)
        });
    }
    async deleteArticle(id) {
        return this.api.delete(`/dashboard/articles/${id}`, {
            mockData: () => Promise.resolve()
        });
    }
    async publishArticle(id) {
        return this.api.post(`/dashboard/articles/${id}/publish`, {}, {
            mockData: () => this.getMockPublishedArticle(id)
        });
    }
    async toggleSticky(id) {
        return this.api.post(`/dashboard/articles/${id}/toggle-sticky`, {}, {
            mockData: () => this.getMockToggledArticle(id)
        });
    }
    // Files management
    async getAllFiles() {
        return this.api.get('/dashboard/files', {
            mockData: () => Promise.resolve(mockFiles)
        });
    }
    async uploadFile(file) {
        // Note: For real implementation, this would need FormData handling
        return this.api.post('/dashboard/files/upload', { file }, {
            mockData: () => this.getMockUploadedFile(file)
        });
    }
    async deleteFile(id) {
        return this.api.delete(`/dashboard/files/${id}`, {
            mockData: () => Promise.resolve()
        });
    }
    // Dashboard stats
    async getDashboardStats() {
        return this.api.get('/dashboard/stats', {
            mockData: () => Promise.resolve(mockDashboardStats)
        });
    }
    // Mock data methods
    async getMockArticles(params) {
        // Use imported mock articles and add status fields
        const articles = mockArticles.map((article, index) => ({
            ...article,
            status: index % 2 === 0 ? 'published' : 'draft',
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
            filtered = filtered.filter(article => article.title.toLowerCase().includes(searchLower) ||
                article.excerpt.toLowerCase().includes(searchLower));
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
    async getMockArticleById(id) {
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
    async getMockCreatedArticle(payload) {
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
    async getMockUpdatedArticle(id, payload) {
        const article = await this.getMockArticleById(id);
        return {
            ...article,
            ...payload,
            id // Ensure ID doesn't change
        };
    }
    async getMockPublishedArticle(id) {
        const article = await this.getMockArticleById(id);
        return {
            ...article,
            status: 'published',
            publishedAt: new Date().toISOString()
        };
    }
    async getMockToggledArticle(id) {
        const article = await this.getMockArticleById(id);
        return {
            ...article,
            isSticky: !article.isSticky
        };
    }
    async getMockUploadedFile(file) {
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
