/**
 * Dashboard Type Definitions - Comprehensive & Type-Safe
 */

// ============ Entity Types ============

export interface Author {
  id?: string;
  name: string;
  avatar?: string;
  email?: string;
  role?: 'admin' | 'editor' | 'contributor';
}

export interface NewsArticle {
  id: string;
  title: string;
  subtitle?: string;
  slug?: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  image_caption?: string;
  video_url?: string;
  authors: Author[];
  category?: string;
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  rank?: number;
  sticky?: boolean;
  views?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface Advertisement {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  link?: string;
  position: 'banner' | 'sidebar' | 'footer' | 'inline';
  isActive: boolean;
  startDate: string;
  endDate?: string;
  impressions: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  totalAuthors: number;
  recentArticles: NewsArticle[];
  advertisementMetrics?: AdvertisementMetrics;
}

export interface AdvertisementMetrics {
  totalImpressions: number;
  totalClicks: number;
  clickThroughRate: number;
  topPerformingAds: Advertisement[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============ Payload Types (for create/update operations) ============

export interface CreateNewsPayload {
  title: string;
  subtitle?: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  image_caption?: string;
  video_url?: string;
  authors: Author[];
  category?: string;
  tags?: string[];
  status?: 'draft' | 'published';
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface UpdateNewsPayload extends Partial<CreateNewsPayload> {
  id?: string;
}

export interface CreateAdvertisementPayload {
  title: string;
  description?: string;
  imageUrl: string;
  link?: string;
  position: 'banner' | 'sidebar' | 'footer' | 'inline';
  isActive?: boolean;
  startDate: string;
  endDate?: string;
}

export interface UpdateAdvertisementPayload extends Partial<CreateAdvertisementPayload> {
  id?: string;
}

export interface UploadFilePayload {
  file: File;
  name?: string;
}

export interface DashboardSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logoUrl?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  maintenanceMode: boolean;
  enableComments: boolean;
  postsPerPage: number;
  timezone: string;
}

export interface UpdateSettingsPayload extends Partial<DashboardSettings> {}
