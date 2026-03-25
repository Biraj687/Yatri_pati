/**
 * Type definitions for the Yatri Pati news portal
 */

export interface RawArticle {
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
  [key: string]: unknown;
}

export interface Author {
  name: string;
  avatar?: string;
  role?: string;
  bio?: string;
}

export interface Article {
  id: string | number;
  title: string;
  image: string;
  excerpt: string;
  author: string; // Legacy single author field (string)
  authors?: Author[]; // New multi-author support
  date: string;
  category?: string;
  authorAvatar?: string;
  content?: string;
  readTime?: string;
  views?: number;
  source?: string;
  videoUrl?: string;
  thumbnailImage?: string;
  tags?: string[];
  slug?: string;
  [key: string]: unknown;
}

export interface SiteConfig {
  siteName: string;
  logo: {
    text: string;
    image?: string;
  };
  navigation: {
    label: string;
    path: string;
    isCategory: boolean;
    hasDropdown?: boolean;
    dropdownItems?: { label: string; path: string }[];
  }[];
  socialLinks: {
    platform: string;
    url: string;
  }[];
  footer: {
    aboutText: string;
    copyright: string;
    columns: {
      title: string;
      links: { label: string; path: string; isExternal?: boolean }[];
    }[];
  };
  sectionTitles: {
    [key: string]: string;
  };
  tickerNews: string[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface NewsApiResponse {
  hero?: RawArticle;
  featured?: RawArticle;
  articles?: RawArticle[];
  [key: string]: unknown;
}

export interface Category {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  articleCount?: number;
}