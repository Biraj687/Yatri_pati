/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

/**
 * Truncate text to a specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Format date to Nepali or relative time
 */
export function formatDate(dateString: string, locale: string = 'ne-NP'): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original if can't parse
    }
    
    if (locale === 'ne-NP') {
      // Simple Nepali date formatting
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return date.toLocaleDateString('ne-NP', options);
    }
    
    // Relative time for recent dates
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return 'भर्खरै';
    } else if (diffHours < 24) {
      return `${diffHours} घण्टा अघि`;
    } else if (diffHours < 168) { // 7 days
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} दिन अघि`;
    }
    
    return date.toLocaleDateString(locale, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  } catch {
    return dateString;
  }
}

/**
 * Extract reading time from content
 */
export function calculateReadTime(content: string, wordsPerMinute: number = 200): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  if (minutes < 1) return 'कम पढ्नु';
  if (minutes === 1) return '१ मिनेट पढ्नु';
  return `${minutes} मिनेट पढ्नु`;
}

/**
 * Sanitize HTML content for safe rendering
 */
export function sanitizeHtml(html: string): string {
  // Basic sanitization - in production use DOMPurify or similar
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/javascript:/gi, '');
}

/**
 * Format large numbers with K/M suffixes
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(str: string): string {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(content: string, maxLength: number = 150): string {
  const plainText = content.replace(/<[^>]*>/g, '');
  return truncateText(plainText, maxLength);
}