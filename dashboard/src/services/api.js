import { apiConfig } from '../config';
export class DashboardApiService {
    constructor() {
        Object.defineProperty(this, "baseUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: apiConfig.url
        });
        Object.defineProperty(this, "useMock", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: apiConfig.useMock
        });
    }
    // Articles
    async getAllArticles(params) {
        if (this.useMock) {
            // Mock articles
            const mockArticles = [
                {
                    id: '1',
                    title: 'Sample Article 1',
                    subtitle: 'A sample article for testing',
                    slug: 'sample-article-1',
                    content: 'This is the content of the sample article.',
                    excerpt: 'Sample excerpt',
                    featured_image: 'https://picsum.photos/800/400',
                    image_caption: 'Sample image',
                    video_url: '',
                    authors: [{ name: 'Admin', avatar: '', email: 'admin@example.com', role: 'admin' }],
                    category: 'News',
                    tags: ['sample', 'test'],
                    status: 'published',
                    rank: 1,
                    sticky: false,
                    views: 100,
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z',
                    publishedAt: '2024-01-01T00:00:00Z',
                    seoTitle: 'Sample Article 1',
                    seoDescription: 'Sample description',
                    seoKeywords: ['sample', 'article'],
                },
                {
                    id: '2',
                    title: 'Sample Article 2',
                    subtitle: 'Another sample article',
                    slug: 'sample-article-2',
                    content: 'Content for article 2.',
                    excerpt: 'Another excerpt',
                    featured_image: 'https://picsum.photos/800/400',
                    image_caption: 'Image 2',
                    video_url: '',
                    authors: [{ name: 'Editor', avatar: '', email: 'editor@example.com', role: 'editor' }],
                    category: 'Technology',
                    tags: ['tech', 'sample'],
                    status: 'draft',
                    rank: 2,
                    sticky: false,
                    views: 50,
                    createdAt: '2024-01-02T00:00:00Z',
                    updatedAt: '2024-01-02T00:00:00Z',
                    publishedAt: '',
                    seoTitle: 'Sample Article 2',
                    seoDescription: 'Sample description 2',
                    seoKeywords: ['tech', 'sample'],
                },
            ];
            // Filter based on params (simplified)
            let filtered = mockArticles;
            if (params?.status) {
                filtered = filtered.filter(article => article.status === params.status);
            }
            if (params?.search) {
                const searchLower = params.search.toLowerCase();
                filtered = filtered.filter(article => article.title.toLowerCase().includes(searchLower) ||
                    article.excerpt?.toLowerCase().includes(searchLower));
            }
            // Simulate pagination
            const page = params?.page || 1;
            const limit = params?.limit || 10;
            const start = (page - 1) * limit;
            const data = filtered.slice(start, start + limit);
            return {
                data,
                total: filtered.length,
                page,
                limit,
            };
        }
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined)
                    queryParams.append(key, String(value));
            });
        }
        const response = await fetch(`${this.baseUrl}/articles?${queryParams}`, {
            headers: this.getHeaders(),
        });
        if (!response.ok)
            throw new Error('Failed to fetch articles');
        return response.json();
    }
    async getArticleById(id) {
        const response = await fetch(`${this.baseUrl}/articles/${id}`, {
            headers: this.getHeaders(),
        });
        if (!response.ok)
            throw new Error('Failed to fetch article');
        return response.json();
    }
    async createArticle(payload) {
        const response = await fetch(`${this.baseUrl}/articles`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(payload),
        });
        if (!response.ok)
            throw new Error('Failed to create article');
        return response.json();
    }
    async updateArticle(id, payload) {
        const response = await fetch(`${this.baseUrl}/articles/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(payload),
        });
        if (!response.ok)
            throw new Error('Failed to update article');
        return response.json();
    }
    async deleteArticle(id) {
        const response = await fetch(`${this.baseUrl}/articles/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        if (!response.ok)
            throw new Error('Failed to delete article');
    }
    async publishArticle(id) {
        const response = await fetch(`${this.baseUrl}/articles/${id}/publish`, {
            method: 'POST',
            headers: this.getHeaders(),
        });
        if (!response.ok)
            throw new Error('Failed to publish article');
        return response.json();
    }
    async toggleSticky(id) {
        const response = await fetch(`${this.baseUrl}/articles/${id}/sticky`, {
            method: 'POST',
            headers: this.getHeaders(),
        });
        if (!response.ok)
            throw new Error('Failed to toggle sticky');
        return response.json();
    }
    // Files
    async getAllFiles() {
        if (this.useMock) {
            const mockFiles = [
                {
                    id: '1',
                    name: 'sample-image.jpg',
                    size: 1024 * 1024,
                    type: 'image/jpeg',
                    url: 'https://picsum.photos/200/300',
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z',
                },
                {
                    id: '2',
                    name: 'document.pdf',
                    size: 512 * 1024,
                    type: 'application/pdf',
                    url: 'https://example.com/document.pdf',
                    createdAt: '2024-01-02T00:00:00Z',
                    updatedAt: '2024-01-02T00:00:00Z',
                },
                {
                    id: '3',
                    name: 'video.mp4',
                    size: 50 * 1024 * 1024,
                    type: 'video/mp4',
                    url: 'https://example.com/video.mp4',
                    createdAt: '2024-01-03T00:00:00Z',
                    updatedAt: '2024-01-03T00:00:00Z',
                },
            ];
            return mockFiles;
        }
        const response = await fetch(`${this.baseUrl}/files`, {
            headers: this.getHeaders(),
        });
        if (!response.ok)
            throw new Error('Failed to fetch files');
        return response.json();
    }
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${this.baseUrl}/files/upload`, {
            method: 'POST',
            body: formData,
            headers: this.getAuthHeader(),
        });
        if (!response.ok)
            throw new Error('Failed to upload file');
        return response.json();
    }
    async deleteFile(id) {
        const response = await fetch(`${this.baseUrl}/files/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        });
        if (!response.ok)
            throw new Error('Failed to delete file');
    }
    // Statistics
    async getDashboardStats() {
        if (this.useMock) {
            const mockStats = {
                totalArticles: 15,
                publishedArticles: 10,
                draftArticles: 5,
                totalViews: 12500,
                totalAuthors: 3,
                recentArticles: [
                    {
                        id: '1',
                        title: 'Sample Article 1',
                        subtitle: 'A sample article for testing',
                        slug: 'sample-article-1',
                        content: 'This is the content of the sample article.',
                        excerpt: 'Sample excerpt',
                        featured_image: 'https://picsum.photos/800/400',
                        image_caption: 'Sample image',
                        video_url: '',
                        authors: [{ name: 'Admin', avatar: '', email: 'admin@example.com', role: 'admin' }],
                        category: 'News',
                        tags: ['sample', 'test'],
                        status: 'published',
                        rank: 1,
                        sticky: false,
                        views: 100,
                        createdAt: '2024-01-01T00:00:00Z',
                        updatedAt: '2024-01-01T00:00:00Z',
                        publishedAt: '2024-01-01T00:00:00Z',
                        seoTitle: 'Sample Article 1',
                        seoDescription: 'Sample description',
                        seoKeywords: ['sample', 'article'],
                    },
                    {
                        id: '2',
                        title: 'Sample Article 2',
                        subtitle: 'Another sample article',
                        slug: 'sample-article-2',
                        content: 'Content for article 2.',
                        excerpt: 'Another excerpt',
                        featured_image: 'https://picsum.photos/800/400',
                        image_caption: 'Image 2',
                        video_url: '',
                        authors: [{ name: 'Editor', avatar: '', email: 'editor@example.com', role: 'editor' }],
                        category: 'Technology',
                        tags: ['tech', 'sample'],
                        status: 'draft',
                        rank: 2,
                        sticky: false,
                        views: 50,
                        createdAt: '2024-01-02T00:00:00Z',
                        updatedAt: '2024-01-02T00:00:00Z',
                        publishedAt: '',
                        seoTitle: 'Sample Article 2',
                        seoDescription: 'Sample description 2',
                        seoKeywords: ['tech', 'sample'],
                    },
                ],
            };
            return mockStats;
        }
        const response = await fetch(`${this.baseUrl}/stats`, {
            headers: this.getHeaders(),
        });
        if (!response.ok)
            throw new Error('Failed to fetch statistics');
        return response.json();
    }
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
        };
    }
    getAuthHeader() {
        return {
            'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
        };
    }
}
export const dashboardAPI = new DashboardApiService();
