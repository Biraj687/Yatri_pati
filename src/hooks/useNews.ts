import { useState, useEffect, useCallback } from 'react';
import { newsApi } from '@services/api';
import type { NewsQueryParams, PaginatedResponse } from '@services/api';
import type { Article } from '@types';

interface UseNewsOptions extends NewsQueryParams {
  enabled?: boolean;
  onSuccess?: (data: PaginatedResponse<Article>) => void;
  onError?: (error: Error) => void;
}

interface UseNewsReturn {
  data: PaginatedResponse<Article> | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export function useNews(options: UseNewsOptions = {}): UseNewsReturn {
  const {
    enabled = true,
    page = 1,
    limit = 20,
    category,
    search,
    sort = 'latest',
    author,
    onSuccess,
    onError
  } = options;

  const [data, setData] = useState<PaginatedResponse<Article> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(page);

  const fetchNews = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await newsApi.getNews({
        page: pageNum,
        limit,
        category,
        search,
        sort,
        author
      });

      if (append && data) {
        // Append new data to existing data
        setData({
          ...result,
          data: [...data.data, ...result.data]
        });
      } else {
        setData(result);
      }

      setCurrentPage(pageNum);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch news');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, limit, category, search, sort, author, data, onSuccess, onError]);

  const refetch = useCallback(async () => {
    await fetchNews(1, false);
  }, [fetchNews]);

  const loadMore = useCallback(async () => {
    if (!data || isLoading || currentPage >= data.totalPages) return;
    await fetchNews(currentPage + 1, true);
  }, [data, isLoading, currentPage, fetchNews]);

  useEffect(() => {
    fetchNews(page, false);
  }, [fetchNews, page]);

  const hasMore = data ? currentPage < data.totalPages : false;

  return {
    data,
    isLoading,
    error,
    refetch,
    hasMore,
    loadMore
  };
}

// Hook for fetching a single article by ID
interface UseArticleOptions {
  id?: string | number;
  slug?: string;
  enabled?: boolean;
  onSuccess?: (article: Article | null) => void;
  onError?: (error: Error) => void;
}

interface UseArticleReturn {
  article: Article | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useArticle(options: UseArticleOptions): UseArticleReturn {
  const { id, slug, enabled = true, onSuccess, onError } = options;

  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchArticle = useCallback(async () => {
    if (!enabled || (!id && !slug)) return;

    setIsLoading(true);
    setError(null);

    try {
      let result: Article | null = null;
      
      if (id) {
        result = await newsApi.getArticleById(id);
      } else if (slug) {
        result = await newsApi.getArticleBySlug(slug);
      }
      
      setArticle(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(`Failed to fetch article: ${id || slug}`);
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [id, slug, enabled, onSuccess, onError]);

  const refetch = useCallback(async () => {
    await fetchArticle();
  }, [fetchArticle]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  return {
    article,
    isLoading,
    error,
    refetch
  };
}

// Hook for fetching trending articles
interface UseTrendingArticlesOptions {
  limit?: number;
  enabled?: boolean;
  onSuccess?: (articles: Article[]) => void;
  onError?: (error: Error) => void;
}

interface UseTrendingArticlesReturn {
  articles: Article[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useTrendingArticles(options: UseTrendingArticlesOptions = {}): UseTrendingArticlesReturn {
  const { limit = 5, enabled = true, onSuccess, onError } = options;

  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTrending = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await newsApi.getTrendingArticles(limit);
      setArticles(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch trending articles');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, limit, onSuccess, onError]);

  const refetch = useCallback(async () => {
    await fetchTrending();
  }, [fetchTrending]);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  return {
    articles,
    isLoading,
    error,
    refetch
  };
}

// Hook for fetching categories
interface UseCategoriesReturn {
  categories: Category[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  articleCount: number;
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await newsApi.getCategories();
      setCategories(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch categories');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    refetch
  };
}