# Security Implementation - Quick Start Guide

## 🎯 What Was Implemented

This frontend now includes enterprise-grade security features:

| Feature | Purpose | File |
|---------|---------|------|
| **API Key Protection** | Prevents credential exposure | apiClient.ts |
| **Input Sanitization** | Prevents XSS attacks | sanitizer.ts |
| **Rate Limiting** | Prevents bot/DDoS attacks | rateLimiter.ts |
| **File Upload Validation** | Secure file handling | fileValidator.ts |
| **API Versioning** | Version management | apiClient.ts |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

### 2. Configure Environment
Create `.env` file (based on `.env.example`):
```env
VITE_API_URL=https://yourdomain.com/api/v1
VITE_USE_MOCK_DATA=false
```

### 3. Set Up Backend Proxy (CRITICAL!)
See **BACKEND_PROXY_SETUP.md** for a complete example using Express.js.

The backend proxy must:
- ✅ Store all API keys securely
- ✅ Implement rate limiting per IP
- ✅ Validate all responses
- ✅ Handle authentication

---

## 📝 How to Use Security Features

### 1. Sanitize User Inputs
```typescript
import { sanitizeInput, sanitizeSearchQuery } from '@/services/sanitizer';

// Remove all HTML tags
const cleanName = sanitizeInput(userInput);

// For search queries specifically
const searchTerm = sanitizeSearchQuery(userSearchInput);
```

### 2. Handle API Calls Safely
```typescript
import { apiClient } from '@/services/apiClient';

try {
  const response = await apiClient.get('/news');
  
  if (response.success) {
    const newsData = response.data; // Already sanitized!
  } else {
    console.error(response.error); // User-friendly error message
  }
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log(`Rate limited. Try again in ${error.resetTime}s`);
  }
}
```

### 3. Check Rate Limit Status
```typescript
import { apiClient } from '@/services/apiClient';

const { remaining, resetTime } = apiClient.getRateLimit('/news');
console.log(`Requests remaining: ${remaining}`);
```

### 4. Validate File Uploads
```typescript
import { validateFileUpload, ValidationPresets } from '@/services/fileValidator';

const fileInput = document.getElementById('file-input') as HTMLInputElement;
const file = fileInput.files?.[0];

const result = validateFileUpload(file, ValidationPresets.IMAGES);

if (!result.isValid) {
  console.error(result.error); // Show to user
}
```

---

## 🔒 Security Checklist

### Frontend
- [x] DOMPurify installed for sanitization
- [x] apiClient configured with security headers
- [x] Rate limiting implemented
- [x] Input validation in place
- [x] File upload validation available
- [ ] Remove console.log statements in production
- [ ] Test that no API keys appear in DevTools

### Backend (Your Server)
- [ ] Backend proxy server running
- [ ] API keys stored in environment variables
- [ ] Rate limiting configured per IP
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Request logging enabled
- [ ] Error handling doesn't leak sensitive data

### Deployment
- [ ] .env files not committed to git
- [ ] Production environment variables set
- [ ] HTTPS certificate installed
- [ ] Source maps not deployed
- [ ] Security headers configured

---

## 🧪 Testing Security

### Test 1: Verify No API Keys Exposed
1. Open DevTools (F12)
2. Check Network tab - no API keys should appear in URLs
3. Check Console tab - no sensitive data
4. Check Application tab (Cookies/Storage) - no credentials

### Test 2: Test Sanitization
```typescript
// In browser console
const { sanitizeInput } = await import('./services/sanitizer.ts');
sanitizeInput('<script>alert("xss")</script>');
// Should output: '' (empty string - script removed)
```

### Test 3: Test Rate Limiting
```bash
# Make rapid API requests
for i in {1..60}; do
  curl https://yourdomain.com/api/v1/news -w "\n"
done
# Should see rate limit error after 50 requests
```

### Test 4: Test Input Validation
```typescript
const { sanitizeSearchQuery } = await import('./services/sanitizer.ts');
sanitizeSearchQuery('test<script>alert("xss")</script>');
// Should output: 'testalert("xss")' (tags removed)
```

---

## 🆘 Troubleshooting

### Issue: "API URL not configured"
**Solution:**
- Add `VITE_API_URL` to `.env`
- Restart dev server: `npm run dev`
- Check that value points to your backend proxy

### Issue: "Rate limited" error immediately
**Solution:**
- Check if client-side limit is too strict
- Run: `apiClient.getRateLimit('/news')`
- Verify backend limits aren't being hit

### Issue: DOMPurify errors
**Solution:**
```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

### Issue: CORS errors
**Solution:**
- Check backend CORS configuration
- Verify frontend URL is in `corsOptions.origin`
- Backend should allow your domain

---

## 📚 Key Files

| File | Purpose |
|------|---------|
| `src/services/apiClient.ts` | Secure API client with rate limiting & versioning |
| `src/services/sanitizer.ts` | Input/output sanitization utilities |
| `src/services/rateLimiter.ts` | Client-side rate limiting system |
| `src/services/fileValidator.ts` | File upload validation utilities |
| `src/services/newsService.ts` | Updated to use secure apiClient |
| `.env.example` | Configuration template (with security notes) |
| `SECURITY_GUIDE.md` | Comprehensive security documentation |
| `BACKEND_PROXY_SETUP.md` | Backend proxy implementation guide |

---

## 🔗 Integration with Existing Components

### Home.tsx
```typescript
import { fetchNewsDataWithRetry } from '@/services/newsService';

// Already uses secure apiClient internally
const data = await fetchNewsDataWithRetry();
```

### Article Search/Filter
```typescript
import { sanitizeSearchQuery } from '@/services/sanitizer';

// Before API call
const cleanSearch = sanitizeSearchQuery(userSearch);
```

---

## 🎓 Learning Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [DOMPurify](https://github.com/cure53/DOMPurify)
- [API Security Best Practices](https://tools.ietf.org/html/rfc6749)
- [Rate Limiting Strategies](https://en.wikipedia.org/wiki/Rate_limiting)

---

## ❓ Common Questions

**Q: Why do I need a backend proxy?**  
A: API keys cannot be securely stored in frontend code. The proxy server keeps them safe and makes calls on behalf of the frontend.

**Q: Is client-side rate limiting enough?**  
A: No. Always implement server-side rate limiting. Client-side is supplementary and can be bypassed.

**Q: Do I need to sanitize data from my own API?**  
A: Yes. Defense in depth: sanitize at every layer, even if backend should be trusted.

**Q: What if someone disables JavaScript?**  
A: Backend must still handle validation. Frontend validation is for UX and basic protection.

---

## 📞 Need Help?

1. Check `SECURITY_GUIDE.md` for detailed documentation
2. Review `BACKEND_PROXY_SETUP.md` for server setup
3. Check implementation examples in service files
4. See code comments for usage patterns

**Remember:** Security is not a feature, it's a requirement! 🔐
