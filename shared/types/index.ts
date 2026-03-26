/**
 * Shared Type Definitions for Yatripati
 * Used by both main app and dashboard
 */

// Base interfaces
export interface Author {
  name: string;
  avatar?: string;
  role?: string;
  bio?: string;
}

export interface ArticleBase {
  id: string | number;
  title: string;
  image: string;
  excerpt: string;
  date: string;
  category?: string;
}

export interface ArticleMeta {
  readTime?: string;
  views?: number;
  source?: string;
  videoUrl?: string;
  thumbnailImage?: string;
  tags?: string[];
  slug?: string;
}

export interface ArticleContent {
  content?: string;
  authors?: Author[];
  author?: string; // Legacy single author field
  authorAvatar?: string;
}

// Strict Article type for internal use
export interface Article extends ArticleBase, ArticleMeta, ArticleContent {
  // Additional specific fields
  status?: 'draft' | 'published' | 'archived';
  isSticky?: boolean;
  publishedAt?: string;
  updatedAt?: string;
}

// Raw article type for API responses (allows unknown fields)
export interface RawArticle extends Omit<Article, 'id' | 'title' | 'image' | 'excerpt' | 'date'> {
  id?: string | number;
  _id?: string | number;
  articleId?: string | number;
  title?: string;
  headline?: string;
  name?: string;
  image?: string;
  thumbnail?: string;
  thumb?: string;
  imageUrl?: string;
  excerpt?: string;
  summary?: string;
  description?: string;
  intro?: string;
  author?: string;
  writer?: string;
  authorName?: string;
  date?: string;
  published_at?: string;
  createdAt?: string;
  publishedDate?: string;
  category?: string;
  type?: string;
  channel?: string;
  section?: string;
  authorAvatar?: string;
  avatar?: string;
  profileImage?: string;
  content?: string;
  body?: string;
  article?: string;
  readTime?: string;
  estimatedReadTime?: string;
  views?: number;
  viewCount?: number;
  source?: string;
  publisher?: string;
  publication?: string;
  [key: string]: unknown; // Allow unknown fields for API compatibility
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SiteConfig {
  siteName: string;
  logo: {
    text: string;
    image?: string;
  };
  navigation: Array<{
    label: string;
    path: string;
    isCategory: boolean;
    hasDropdown?: boolean;
    dropdownItems?: Array<{ label: string; path: string }>;
  }>;
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
  footer: {
    aboutText: string;
    copyright: string;
    columns: Array<{
      title: string;
      links: Array<{ label: string; path: string; isExternal?: boolean }>;
    }>;
  };
  sectionTitles: Record<string, string>;
}

// Dashboard specific types
export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalFiles: number;
  totalViews: number;
  recentArticles: Article[];
  popularCategories: Array<{ name: string; count: number }>;
}

export interface CreateNewsPayload {
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  image?: string;
  author?: string;
  tags?: string[];
  status?: 'draft' | 'published';
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
  retries?: number;
}

// Request parameter types
export interface NewsQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: 'date' | 'views' | 'title';
  sortOrder?: 'asc' | 'desc';
}