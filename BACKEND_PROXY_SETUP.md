# Backend Proxy Setup - Example Implementation

## Why a Backend Proxy is Essential

Your frontend communicates with a **backend proxy server** (your own server), NOT directly with third-party APIs or databases. This is the foundation of frontend security.

```
┌─────────────┐         ┌──────────────┐         ┌────────────────┐
│  Frontend   │────────>│ Backend Proxy │────────>│ Third-party API│
│ (Browser)   │         │  (Your Server)│         │   or Database  │
└─────────────┘         └──────────────┘         └────────────────┘
                              ↑
                    Holds all secrets/keys
                        (environment vars)
```

---

## Express.js Backend Proxy Example

### Step 1: Create Backend Server

```javascript
// backend/server.js
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// CORS Configuration - Allow only your frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-API-Version']
};
app.use(cors(corsOptions));

// Rate Limiting Middleware
const newsLimiter = rateLimit({
  windowMs: 60 * 1000,           // 1 minute
  max: 50,                       // 50 requests per minute per IP
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,         // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,          // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API Proxy Endpoint
// Frontend calls: GET /api/v1/news
// Backend calls: Third-party API with secure key
app.get('/api/v1/news', newsLimiter, async (req, res) => {
  try {
    // Your actual API key is stored in environment variable (never in code)
    const apiKey = process.env.THIRD_PARTY_API_KEY;
    
    if (!apiKey) {
      console.error('API_KEY not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Call the actual API securely from backend
    const response = await fetch(
      `https://api.example.com/news?key=${apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Yatripati-Backend/1.0'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Validate and sanitize data before sending to frontend
    const sanitizedData = {
      hero: validateArticle(data.hero),
      featured: validateArticle(data.featured),
      articles: (data.articles || []).map(validateArticle)
    };

    // Send to frontend with cache headers
    res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    res.json(sanitizedData);

  } catch (error) {
    console.error('Proxy error:', error);
    
    // Never leak internal error details to frontend
    res.status(500).json({
      error: 'Failed to fetch news',
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'Please try again later'
    });
  }
});

// Validate article data
function validateArticle(article) {
  if (!article) return null;

  return {
    id: article.id,
    title: String(article.title || '').substring(0, 500),
    excerpt: String(article.excerpt || '').substring(0, 1000),
    author: String(article.author || ''),
    date: String(article.date || ''),
    category: String(article.category || ''),
    image: article.image ? validateUrl(article.image) : null,
    authorAvatar: article.authorAvatar ? validateUrl(article.authorAvatar) : null
  };
}

// Validate URLs to prevent SSRF
function validateUrl(url) {
  try {
    const parsed = new URL(url);
    // Only allow http/https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    // Prevent internal network access
    const hostname = parsed.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || 
        hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend proxy running on port ${PORT}`);
  console.log(`Frontend origin: ${corsOptions.origin}`);
});
```

### Step 2: Environment Variables

```bash
# backend/.env
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://yourdomain.com
THIRD_PARTY_API_KEY=your_actual_api_key_here
DATABASE_URL=your_database_url_here
JWT_SECRET=your_secret_here
```

**NEVER commit .env files!**

```bash
# backend/.gitignore
.env
.env.local
node_modules/
```

### Step 3: Package Dependencies

```bash
npm init -y
npm install express cors express-rate-limit node-fetch dotenv
```

### Step 4: Running the Server

```bash
# Development
NODE_ENV=development node server.js

# Production (use PM2 or systemd)
npm install -g pm2
pm2 start server.js --name "yatripati-api"
```

---

## Frontend Configuration

### .env File
```env
# Point to your backend proxy, NOT third-party APIs
VITE_API_URL=https://yourdomain.com/api
VITE_USE_MOCK_DATA=false
```

### apiClient Usage
```typescript
// frontend/src/services/apiClient.ts
const apiClient = new ApiClient({
  baseUrl: import.meta.env.VITE_API_URL, // Your backend proxy
  version: 'v1'
});

// Frontend calls backend proxy:
// GET https://yourdomain.com/api/v1/news
// (NOT the third-party API directly)
```

---

## Deployment Architecture

### Option 1: Same Domain (Recommended)

```
Frontend:  https://yourdomain.com/
Backend:   https://yourdomain.com/api/v1/
```

**Benefits:**
- No CORS issues
- Easier to hide APIs
- Better security

### Option 2: Separate Subdomains

```
Frontend:  https://app.yourdomain.com/
Backend:   https://api.yourdomain.com/v1/
```

**Configure CORS:**
```javascript
const corsOptions = {
  origin: 'https://app.yourdomain.com',
  credentials: true
};
```

### Option 3: Separate Domain (Not Recommended)

```
Frontend:  https://app.yourcompany.com/
Backend:   https://api.thirdpartyhost.com/
```

**Requires careful CORS setup:**
```javascript
const corsOptions = {
  origin: ['https://app.yourcompany.com'],
  credentials: false, // Cannot use credentials across domains
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};
```

---

## Security Best Practices

### 1. API Key Rotation
```javascript
// Use multiple keys, rotate periodically
const apiKeys = [
  process.env.ACTIVE_API_KEY,
  process.env.BACKUP_API_KEY
];

// Use active key, fallback to backup
```

### 2. Request Logging
```javascript
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});
```

### 3. Security Headers
```javascript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
```

### 4. Input Validation
```javascript
// Validate all incoming requests
function validateNewsQuery(req, res, next) {
  const { page, limit, category } = req.query;
  
  // Ensure numbers are numbers
  if (page && isNaN(page)) {
    return res.status(400).json({ error: 'Invalid page' });
  }
  
  if (limit && (isNaN(limit) || limit > 100)) {
    return res.status(400).json({ error: 'Invalid limit (max 100)' });
  }
  
  next();
}

app.get('/api/v1/news', validateNewsQuery, newsLimiter, async (req, res) => {
  // Handle request
});
```

---

## Monitoring & Troubleshooting

### Check Rate Limit Headers
```bash
curl -I https://yourdomain.com/api/v1/news
# Look for:
# RateLimit-Limit: 50
# RateLimit-Remaining: 49
# RateLimit-Reset: 1234567890
```

### Monitor for Attacks
```bash
# Check for suspicious rate limit hits
tail -f /var/log/app.log | grep "rate limit"
```

### SSL Certificate
```bash
# Use Let's Encrypt for free HTTPS
# With Certbot:
certbot certonly --standalone -d yourdomain.com
```

---

## Questions?

See **SECURITY_GUIDE.md** in the frontend for more details on frontend security implementation.
