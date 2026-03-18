# Frontend Security Implementation Guide

## Overview
This guide covers the security measures implemented in the Yatripati frontend to protect against common web attacks and ensure secure API communication.

---

## 1. API KEY & CREDENTIALS SECURITY ⚠️ CRITICAL

### Problem
Never store API keys, database URLs, or secrets directly in frontend code. They will be exposed in:
- Browser developer tools
- Network requests
- Source maps
- Client bundles

### Solution: Backend Proxy Pattern

**Architecture:**
```
Frontend → Backend Proxy → Third-party APIs
```

**Frontend:**
- Calls: `https://yourdomain.com/api/v1/news`
- No API keys stored

**Backend Proxy (Your Server):**
```javascript
// Example Node.js/Express proxy
app.get('/api/v1/news', (req, res) => {
  // Backend securely holds API keys in environment variables
  const apiKey = process.env.ACTUAL_API_KEY; // Never expose to frontend
  
  // Make actual API call with your key
  fetch(`https://third-party-api.com/news?key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      // Validate, sanitize, and return to frontend
      res.json(data);
    });
});
```

### Environment Configuration

**`.env` file (DO NOT COMMIT SECRETS):**
```env
# Never use real API keys here!
VITE_API_URL=https://yourdomain.com/api/v1
VITE_USE_MOCK_DATA=false
```

**`.gitignore`:**
```
.env
.env.local
.env.*.local
```

### Implementation

The app uses `apiClient.ts` which:
- Only calls your backend proxy (not third-party APIs directly)
- Never logs or exposes credentials
- Uses API versioning headers

```typescript
// In frontend code
const apiClient = new ApiClient({
  baseUrl: import.meta.env.VITE_API_URL, // Points to your proxy
  version: 'v1'
});

// This only exposes your domain, not credentials
await apiClient.get('/news');
```

---

## 2. INPUT SANITIZATION & XSS PREVENTION

### Implementation
Uses **DOMPurify** library to remove malicious scripts and HTML.

### Key Functions

**`sanitizeInput()`** - Remove ALL HTML tags
```typescript
import { sanitizeInput } from './services/sanitizer';

// User input from forms, search bars, etc.
const userSearch = sanitizeInput(userInput);
```

**`sanitizeHtml()`** - Keep safe tags only
```typescript
import { sanitizeHtml } from './services/sanitizer';

// Article content from API
const safeContent = sanitizeHtml(apiResponse.content);
```

**`sanitizeArticle()`** - Full article sanitization
```typescript
import { sanitizeArticle } from './services/sanitizer';

const cleanArticle = sanitizeArticle(apiResponse.article);
```

### Where to Sanitize
1. **User Inputs**: Search bars, filters, forms
2. **API Responses**: All data from backend before rendering
3. **URLs**: Validate before navigating

### Example Usage
```typescript
// Before: Vulnerable
<div>{userInput}</div>

// After: Safe
import { sanitizeInput } from './services/sanitizer';
const safe = sanitizeInput(userInput);
<div>{safe}</div>
```

### Protected Against
- XSS (Cross-Site Scripting)
- Script injection via comments
- Event handler injection
- Data exfiltration

---

## 3. RATE LIMITING

### Purpose
Prevent:
- Bot attacks
- DDoS attempts
- Brute force attacks
- Resource exhaustion

### Implementation

**Client-side Rate Limiting** (Supplementary):
- Configured to 50 requests per minute
- Uses browser fingerprinting (not IP-based)

**Server-side Rate Limiting** (REQUIRED):
- Must be implemented on your backend proxy
- Uses IP address + user ID for accuracy
- More difficult to bypass

### Configuration
```typescript
// In rateLimiter.ts
export const apiRateLimiter = createRateLimiter({
  maxRequests: 50,  // requests
  windowMs: 60000   // milliseconds (1 minute)
});
```

### What Happens When Rate Limited
```typescript
try {
  await apiClient.get('/news');
} catch (error) {
  if (error instanceof RateLimitError) {
    console.log(`Rate limited. Retry in ${error.resetTime}s`);
    // Show user message: "Too many requests, please try again in 30 seconds"
  }
}
```

### Server-side Rate Limiting Example
```javascript
// Express middleware
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000,      // 1 minute
  max: 50,                   // 50 requests per windowMs
  message: 'Too many requests, please try again later',
  standardHeaders: true,     // Return rate limit info in headers
  legacyHeaders: false,
});

app.use('/api/', limiter);
```

---

## 4. API VERSIONING

### Purpose
- Support multiple API versions simultaneously
- Smooth migrations when changing backend
- Backward compatibility for older clients

### Implementation

**Frontend Setup:**
```typescript
const apiClient = new ApiClient({
  baseUrl: import.meta.env.VITE_API_URL,
  version: 'v1' // Specifies API version
});
```

**Request Headers:**
- Every request includes: `X-API-Version: v1`
- Backend uses this to route to correct handler

**URL Structure:**
```
/api/v1/news      ← Version in URL
/api/v1/articles
/api/v1/search

/api/v2/news      ← Future version
/api/v2/articles
```

### Changing Versions
```typescript
// When backend changes versions
const apiClient = new ApiClient({
  baseUrl: import.meta.env.VITE_API_URL,
  version: 'v2' // Switch to new version
});
```

---

## 5. SECURE UPLOADS (When Needed)

### File Upload Security Checklist

**Client-side Validation** (First line of defense):
```typescript
import { validateFileUpload } from './services/fileValidator';

const file = inputElement.files[0];
const validation = validateFileUpload(file, {
  maxSize: 5 * 1024 * 1024,        // 5MB
  allowedTypes: ['image/jpeg', 'image/png'],
  allowedExtensions: ['.jpg', '.png']
});

if (!validation.isValid) {
  console.error(validation.error);
  return;
}
```

**Server-side Validation** (REQUIRED):
```javascript
// Always validate on backend!
app.post('/api/upload', (req, res) => {
  // 1. Verify file type (check MIME, not just extension)
  // 2. Verify file size limits
  // 3. Scan for malware
  // 4. Store securely (never in web root)
  // 5. Generate random filename (don't use user input)
  // 6. Return signed URL for retrieval
});
```

### Security Measures
- ✅ Check file size before upload
- ✅ Validate MIME type
- ✅ Rename files (prevent directory traversal)
- ✅ Store outside web root
- ✅ Scan uploaded files
- ✅ Never trust user input for filename

---

## SECURITY CHECKLIST

### Before Production

- [ ] Backend proxy server is set up and working
- [ ] All API keys are stored server-side only (never in frontend)
- [ ] `.env` files are in `.gitignore`
- [ ] Rate limiting is configured on backend
- [ ] Input sanitization is applied to all user inputs
- [ ] All API responses are sanitized before rendering
- [ ] API versioning headers are sent with requests
- [ ] HTTPS is enforced for all API calls
- [ ] CORS is properly configured on backend
- [ ] Error messages don't leak sensitive information
- [ ] Source maps are not deployed to production

### Production Environment

```env
# .env.production
VITE_API_URL=https://yourdomain.com/api/v1
VITE_USE_MOCK_DATA=false
```

### Testing Security

1. **Open DevTools** and check:
   - No API keys in console
   - No passwords in Network tab
   - No database URLs anywhere

2. **Test Rate Limiting**:
   - Make rapid requests
   - Verify error after limit reached

3. **Test Sanitization**:
   - Try injecting `<script>alert('xss')</script>`
   - Should be removed before render

4. **Test API Versioning**:
   - Check headers in Network tab
   - Should see `X-API-Version: v1`

---

## Common Vulnerabilities & How We Prevent Them

| Vulnerability | How We Prevent |
|---|---|
| **API Key Exposure** | Backend proxy, environment variables |
| **XSS Attacks** | DOMPurify sanitization |
| **SQL Injection** | Backend parameterized queries |
| **CSRF** | CORS + SameSite cookies |
| **Rate Limit Bypass** | Server-side rate limiting |
| **Path Traversal** | Server-side file validation |

---

## Need Help?

### Common Issues

**"API URL not configured"**
- Add `VITE_API_URL` to your `.env` file
- Restart dev server: `npm run dev`

**"Rate limited immediately"**
- Check if server-side limits are too strict
- Client shows remaining requests: `apiClient.getRateLimit('/news')`

**"Scripts still executing"**
- Verify sanitization is being applied
- Check browser console for warnings
- Ensure no dangerouslySetInnerHTML used

---

## References
- [OWASP Security Best Practices](https://owasp.org/)
- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [Express Rate Limit](https://github.com/nfriedly/express-rate-limit)
- [API Security](https://tools.ietf.org/html/rfc6749)
