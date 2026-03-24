/**
 * Client-side rate limiting using sliding window algorithm
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RequestEntry {
  timestamp: number;
}

class RateLimiter {
  private requests: Map<string, RequestEntry[]> = new Map();
  private maxRequests: number;
  private windowMs: number;
  private cleanupInterval: number | null = null;

  constructor(config: RateLimitConfig = { maxRequests: 50, windowMs: 60000 }) {
    this.maxRequests = config.maxRequests;
    this.windowMs = config.windowMs;
    this.startCleanup();
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }

    const requestLog = this.requests.get(key)!;
    const validRequests = requestLog.filter(req => now - req.timestamp < this.windowMs);

    if (validRequests.length < this.maxRequests) {
      validRequests.push({ timestamp: now });
      this.requests.set(key, validRequests);
      return true;
    }

    return false;
  }

  getRemaining(key: string): number {
    const now = Date.now();
    if (!this.requests.has(key)) return this.maxRequests;
    const validRequests = this.requests.get(key)!.filter(req => now - req.timestamp < this.windowMs);
    return Math.max(0, this.maxRequests - validRequests.length);
  }

  getResetTime(key: string): number {
    if (!this.requests.has(key) || this.requests.get(key)!.length === 0) return 0;
    const oldestRequest = Math.min(...this.requests.get(key)!.map(req => req.timestamp));
    const resetTime = Math.ceil((oldestRequest + this.windowMs - Date.now()) / 1000);
    return Math.max(0, resetTime);
  }

  private startCleanup() {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, requests] of this.requests.entries()) {
        const validRequests = requests.filter(req => now - req.timestamp < this.windowMs);
        if (validRequests.length === 0) {
          this.requests.delete(key);
        } else {
          this.requests.set(key, validRequests);
        }
      }
    }, 5 * 60 * 1000);
  }

  destroy() {
    if (this.cleanupInterval) clearInterval(this.cleanupInterval);
    this.requests.clear();
  }
}

export const createRateLimiter = (config?: RateLimitConfig) => new RateLimiter(config);

export const apiRateLimiter = createRateLimiter({
  maxRequests: 50,
  windowMs: 60000
});

export const sensitiveOperationRateLimiter = createRateLimiter({
  maxRequests: 5,
  windowMs: 60000
});

export const searchRateLimiter = createRateLimiter({
  maxRequests: 30,
  windowMs: 60000
});

export const generateRateLimitKey = (endpoint: string): string => {
  const fingerprint = getBrowserFingerprint();
  return `${fingerprint}:${endpoint}`;
};

function getBrowserFingerprint(): string {
  try {
    const components = [
      navigator.userAgent,
      navigator.language,
      new Date().getTimezoneOffset(),
      typeof window !== 'undefined' && !!window.sessionStorage,
      typeof window !== 'undefined' && !!window.localStorage
    ].join('|');

    let hash = 0;
    for (let i = 0; i < components.length; i++) {
      const char = components.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  } catch (_e) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return Math.random().toString(16);
  }
}

export class RateLimitError extends Error {
  resetTime: number;
  remaining: number;

  constructor(resetTime: number, remaining: number) {
    super(`Rate limit exceeded. Reset in ${resetTime}s`);
    this.name = 'RateLimitError';
    this.resetTime = resetTime;
    this.remaining = remaining;
  }
}
