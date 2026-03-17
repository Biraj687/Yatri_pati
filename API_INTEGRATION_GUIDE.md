# API Integration Guide

Your Yatripati news website is now set up for **dynamic API integration**. Follow these steps to connect it to your backend.

## Quick Start

### 1. Set Your API URL

Edit `.env.local`:

```env
VITE_API_URL=http://localhost:3000/api
```

For production:
```env
VITE_API_URL=https://your-api-domain.com/api
```

### 2. Backend API Endpoints Required

Your backend must provide these endpoints:

#### **Endpoint 1: Hero Article**
```
GET /api/articles/hero
```

**Response Format:**
```json
{
  "id": "hero-1",
  "title": "Article Title",
  "headline": "または headline フィールド",
  "image": "https://url-to-image.jpg",
  "thumbnail": "または thumbnail フィールド",
  "excerpt": "Short summary",
  "summary": "または summary フィールド",
  "author": "Author Name",
  "writer": "または writer フィールド",
  "date": "2024-03-17",
  "published_at": "または published_at フィールド",
  "category": "News"
}
```

#### **Endpoint 2: Featured Article**
```
GET /api/articles/featured
```

Same response format as hero article.

#### **Endpoint 3: Articles List**
```
GET /api/articles?limit=10
```

**Response Format (Choose One):**

**Option A - Array:**
```json
[
  {
    "id": 1,
    "title": "Article 1",
    "image": "https://url.jpg",
    ...
  },
  {
    "id": 2,
    "title": "Article 2",
    ...
  }
]
```

**Option B - Paginated:**
```json
{
  "articles": [
    { "id": 1, "title": "Article 1", ... },
    { "id": 2, "title": "Article 2", ... }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

**Option C - Data Object:**
```json
{
  "data": [
    { "id": 1, "title": "Article 1", ... }
  ]
}
```

## Field Normalization

The frontend automatically normalizes field names. Your API can use any of these:

| Standard | Alternative 1 | Alternative 2 |
|----------|---|---|
| `id` | `_id` | |
| `title` | `headline` | |
| `image` | `thumbnail` | `thumb` |
| `excerpt` | `summary` | `description` |
| `author` | `writer` | |
| `date` | `published_at` | `createdAt` |
| `category` | `type` | |

**Example:** Your API can return:
```json
{
  "_id": 1,
  "headline": "My News",
  "thumb": "image.jpg",
  "summary": "Brief",
  "writer": "John",
  "published_at": "2024-03-17"
}
```

And it will be automatically converted and displayed correctly!

## Error Handling

The app includes:
- ✅ **3 retry attempts** with 1-second delays
- ✅ **Error UI** with user-friendly messages
- ✅ **Retry button** for manual retries
- ✅ **Console logging** for debugging

## Testing Your API

### Test Locally
1. Start your backend on `http://localhost:3000`
2. Run the frontend:
   ```bash
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173`

### Test with Mock Data (Temporary)

If you need to quickly mock the API, use an online JSON server:

1. Create a GitHub Gist with your JSON
2. Use `https://jsonblob.com/` or similar
3. Update `.env.local`:
   ```env
   VITE_API_URL=https://jsonblob.com/api/jsonblob/YOUR_ID
   ```

## CORS Issues?

If you see CORS errors, your backend should include:

```javascript
// Express.js example
app.use(cors({
  origin: ['http://localhost:5173', 'https://yourdomain.com'],
  credentials: true
}));
```

## Production Deployment

1. Update `.env.local` or set environment variable:
   ```bash
   VITE_API_URL=https://your-production-api.com/api
   ```

2. Build for production:
   ```bash
   npm run build
   ```

3. Deploy the `dist/` folder to your hosting

## Available Functions

### Fetch All News (with retry)
```typescript
import { fetchNewsDataWithRetry } from './services/newsService';

// Retry 3 times with 1 second delay between attempts
const data = await fetchNewsDataWithRetry(3, 1000);
```

### Fetch All News (no retry)
```typescript
import { fetchNewsData } from './services/newsService';

const data = await fetchNewsData();
```

### Fetch Individual Items
```typescript
// These are used internally but available for custom use
const hero = await fetchHeroArticle();
const featured = await fetchFeaturedArticle();
const articles = await fetchArticles(10); // limit: 10
```

## Type Definitions

```typescript
export interface Article {
  id: string | number;
  title: string;
  image: string;
  excerpt: string;
  author: string;
  date: string;
  category?: string;
  authorAvatar?: string;
}

export interface ApiResponse {
  hero: Article;
  featured: Article;
  articles: Article[];
}
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to fetch" | Check CORS headers, API is running, URL is correct |
| API returns different field names | The normalization handles common variations automatically |
| Blank articles | Check if API returns required fields (at least `title` or `excerpt`) |
| 3 retry attempts fail | Check browser console for detailed error, verify API URL |

## Need Help?

Check the browser console (F12 → Console tab) for detailed error messages.
