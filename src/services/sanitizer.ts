import DOMPurify from 'dompurify';
import type { Article } from '../types';

/**
 * Sanitize user input to prevent XSS attacks
 * Removes dangerous HTML/JavaScript from strings
 */
export const sanitizeInput = (dirty: string): string => {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
};

/**
 * Sanitize HTML content while preserving safe tags
 * Used for article content from trusted API sources
 */
export const sanitizeHtml = (dirty: string): string => {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'title', 'target']
  });
};

/**
 * Validate and sanitize search queries
 */
export const sanitizeSearchQuery = (query: string): string => {
  if (!query) return '';
  
  // Remove special characters and limit length
  const sanitized = query
    .replace(/[<>"'`]/g, '') // Remove dangerous characters
    .trim()
    .substring(0, 100); // Limit to 100 chars
  
  return sanitized;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL to prevent javascript: and data: protocols
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Sanitize article/content from API responses
 */
export const sanitizeArticle = (article: Partial<Article> & Record<string, unknown>): Article | null => {
  if (!article) return null;
  
  return {
    id: article.id ?? '',
    title: sanitizeInput((article.title as string) || ''),
    excerpt: sanitizeInput((article.excerpt as string) || ''),
    author: sanitizeInput((article.author as string) || ''),
    date: sanitizeInput((article.date as string) || ''),
    category: sanitizeInput((article.category as string) || ''),
    image: article.image ? (isValidUrl(article.image as string) ? article.image : '') : '',
    authorAvatar: article.authorAvatar ? (isValidUrl(article.authorAvatar as string) ? article.authorAvatar : '') : ''
  };
};
