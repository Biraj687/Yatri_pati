export interface Author {
  id?: string;
  name: string;
  avatar?: string;
  email?: string;
  role?: string;
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
}

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
  status: 'draft' | 'published';
  rank?: number;
  sticky?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface UpdateNewsPayload extends Partial<CreateNewsPayload> {
  id: string;
}
