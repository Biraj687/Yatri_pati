# Complete API Implementation Guide - Yatripati News Portal

## Overview

This guide will help you set up your Yatripati news portal to work seamlessly with your backend API. The frontend is already configured to handle various API response formats and field name variations.

---

## 1. ENVIRONMENT SETUP

### Step 1: Configure Environment Variables

Edit `.env.local` (or create it):

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Set to 'false' when using real API
VITE_USE_MOCK_DATA=false

# For production:
# VITE_API_URL=https://your-api-domain.com/api
# VITE_USE_MOCK_DATA=false
```

### Switching Between Mock and Real API

```env
# Use mock data (for testing without backend)
VITE_USE_MOCK_DATA=true

# Use real API
VITE_USE_MOCK_DATA=false
```

---

## 2. REQUIRED API ENDPOINTS

Your backend must provide these endpoints. Choose the structure that fits your setup:

### Option A: Unified News Endpoint (Recommended)

**GET `/api/v1/news`**

```json
{
  "success": true,
  "data": {
    "hero": { /* article object */ },
    "featured": { /* article object */ },
    "articles": [ /* array of articles */ ]
  }
}
```

### Option B: Separate Endpoints

**GET `/api/v1/news/hero`**
**GET `/api/v1/news/featured`**
**GET `/api/v1/news?limit=10`**

Each returns an article object or array.

---

## 3. ARTICLE FIELD MAPPING

Your API can return fields with ANY of these names. The frontend automatically normalizes them:

| Frontend Field | Accepted API Field Names |
|---|---|
| `id` | `id`, `_id`, `articleId` |
| `title` | `title`, `headline`, `name` |
| `image` | `image`, `thumbnail`, `thumb`, `imageUrl` |
| `excerpt` | `excerpt`, `summary`, `description`, `intro` |
| `author` | `author`, `writer`, `authorName` |
| `date` | `date`, `published_at`, `createdAt`, `publishedDate` |
| `category` | `category`, `type`, `channel`, `section` |
| `authorAvatar` | `authorAvatar`, `avatar`, `profileImage` |

**Example API Response (all variations work):**

```json
{
  "_id": "123",
  "headline": "Breaking News Title",
  "thumb": "https://example.com/image.jpg",
  "summary": "Article summary here",
  "writer": "Author Name",
  "published_at": "2024-03-18",
  "category": "Politics"
}
```

---

## 4. LINE-BY-LINE IMPLEMENTATION

### 4.1 Data Flow Architecture

```
Backend API
    ↓
apiClient (src/services/apiClient.ts)
    ↓
newsService (src/services/newsService.ts)
    ├─ normalizeArticle() - Fix field names
    ├─ sanitizeArticle() - Fix XSS vulnerabilities
    └─ fetchNewsData() - Main fetch function
    ↓
Components (FeaturedArticle, CompactArticle, ArticleDetail)
    ↓
Display to User
```

### 4.2 Update newsService.ts

The newsService ALREADY handles:
- ✅ Field name variations
- ✅ Mock data fallback
- ✅ Retry logic
- ✅ Error handling
- ✅ XSS sanitization

**Just update the endpoint if needed** (line 118):

```typescript
// Current (works as-is):
const response = await apiClient.get<any>('/news');

// If your endpoint is different, update to:
const response = await apiClient.get<any>('/articles');
```

### 4.3 Data Type Flow

```
Raw API Response
    ↓ normalizeArticle()
Article Object {
  id: string | number
  title: string
  image: string
  excerpt: string
  author: string
  date: string (formatted)
  category?: string
  authorAvatar?: string
}
    ↓ sanitizeArticle()
Safe Article {
  ... (XSS cleaned)
}
    ↓ Component Props
Display Ready
```

---

## 5. DATE FORMATTING GUIDE

Dates are automatically handled! Your API can provide:

```javascript
// All these formats work:
"2024-03-18"                          // ISO date
"March 18, 2024"                      // Human readable
"18-03-2024"                          // DD-MM-YYYY
"2024-03-18T10:30:00Z"               // ISO datetime
1710768600000                         // Unix timestamp
```

The frontend displays them as-is, but you should format them on the backend for consistency.

**Recommended backend format for Nepali:** `"१८ फाल्गुन २०८०"`

---

## 6. IMAGE HANDLING

### Image Requirements

- **Format**: JPEG, PNG, WebP
- **Hero Image**: 1920x1080 or 16:9 aspect ratio
- **Featured/Compact**: 400x300 or similar
- **Author Avatar**: 200x200 or larger

### Image URL Requirements

All images MUST be:
- ✅ **Full URLs** (not relative paths): `https://example.com/image.jpg`
- ✅ **CORS enabled** on your server (if different domain)
- ✅ **Valid** (no 404s or broken links)

**Error Handling**: If an image fails to load, the article will display but without the image.

---

## 7. COMPLETE API RESPONSE EXAMPLES

### Example 1: Simple Structure

```json
{
  "success": true,
  "data": {
    "hero": {
      "id": 1,
      "title": "नेपालमा नयाँ नीति लागू",
      "image": "https://example.com/hero.jpg",
      "excerpt": "सरकारले नयाँ आर्थिक नीति घोषणा गरेको छ",
      "author": "राज शर्मा",
      "date": "२०८०/११/१८",
      "category": "Politics"
    },
    "featured": {
      "id": 2,
      "title": "पर्यटन क्षेत्र वृद्धि पाएको छ",
      "image": "https://example.com/featured.jpg",
      "excerpt": "यो साल पर्यटकहरूको आगमन २०% वृद्धि पाएको छ",
      "author": "सीमा पांडे",
      "date": "२०८०/११/१७",
      "category": "Tourism"
    },
    "articles": [
      {
        "id": 3,
        "title": "शिक्षा प्रणालीमा सुधार",
        "image": "https://example.com/article1.jpg",
        "excerpt": "नयाँ शिक्षा नीति लागू गरिने छ",
        "author": "विजय कुमार",
        "date": "२०८०/११/१६",
        "category": "Education"
      }
    ]
  }
}
```

### Example 2: With Field Variations

```json
{
  "success": true,
  "data": {
    "hero": {
      "_id": "hero-1",
      "headline": "महत्वपूर्ण समाचार",
      "thumb": "https://example.com/image.jpg",
      "summary": "यो एक महत्वपूर्ण समाचार हो",
      "writer": "नाम",
      "published_at": "2024-03-18",
      "type": "Breaking"
    },
    "featured": { /* same */ },
    "articles": [
      {
        "articleId": "456",
        "name": "समाचार शीर्षक",
        "imageUrl": "https://example.com/img.jpg",
        "description": "विवरण",
        "authorName": "लेखक",
        "createdAt": "2024-03-18",
        "channel": "News"
      }
    ]
  }
}
```

---

## 8. COMPLETE IMPLEMENTATION CHECKLIST

### Phase 1: Backend Setup
- [ ] Create `/api/v1/news` endpoint (or choose your structure)
- [ ] Return `hero`, `featured`, `articles` objects
- [ ] Format dates consistently (preferably in Nepali calendar)
- [ ] Include full image URLs with CORS enabled
- [ ] Test endpoint returns valid JSON

### Phase 2: Frontend Configuration
- [ ] Update `.env.local` with your API URL
- [ ] Set `VITE_USE_MOCK_DATA=false`
- [ ] Run `npm run dev` to test

### Phase 3: Testing
- [ ] Articles display on home page
- [ ] Click article goes to detail page
- [ ] Author name, date, category display correctly
- [ ] Images load properly
- [ ] Category filter works
- [ ] Error states work (if API fails)

### Phase 4: Content Enhancement
- [ ] Add full article content (currently placeholder in ArticleDetail.tsx)
- [ ] Add article metadata (read time, views, etc.)
- [ ] Add comments/reactions if desired
- [ ] Add search functionality if needed

### Phase 5: Production
- [ ] Update `.env` for production API URL
- [ ] Run `npm run build`
- [ ] Test in production build: `npm run preview`
- [ ] Deploy dist/ folder

---

## 9. COMPLETE CODE FILES REFERENCE

### Key Files You Might Need to Update

1. **`.env.local`** - API URL and mock data toggle
2. **`src/services/newsService.ts`** - API endpoint path (line 118)
3. **`src/pages/ArticleDetail.tsx`** - Article content (currently placeholder)
4. **`src/services/sanitizer.ts`** - XSS protection (already configured)

### Files Already Configured
- ✅ `src/services/apiClient.ts` - Handles API calls
- ✅ `src/components/FeaturedArticle.tsx` - Displays data
- ✅ `src/components/CompactArticle.tsx` - Displays data
- ✅ `src/pages/Home.tsx` - Already uses API
- ✅ `src/pages/ArticleDetail.tsx` - Ready for data
- ✅ `src/pages/CategoryPage.tsx` - Filters by category

---

## 10. FETCH ARTICLE FULL CONTENT

Currently, `ArticleDetail.tsx` shows placeholder content. To display real content:

### Option A: Add content field to API response

Your API should return a `content` field:

```json
{
  "id": 1,
  "title": "...",
  "excerpt": "...",
  "content": "यो अनुच्छेद १\n\nयो अनुच्छेद २\n\n...",
  ...
}
```

### Option B: Create separate content endpoint

```
GET /api/v1/articles/:id/content
```

Then fetch in `ArticleDetail.tsx`:

```typescript
useEffect(() => {
  const loadContent = async () => {
    const response = await apiClient.get<any>(`/articles/${id}`);
    if (response.success) {
      setArticleContent(response.data.content);
    }
  };
  loadContent();
}, [id]);
```

---

## 11. CATEGORY PAGE IMPLEMENTATION

### Backend Support

For proper category filtering, your backend should support:

```
GET /api/v1/articles?category=Politics
GET /api/v1/articles?category=Tourism&limit=10
```

### Frontend Implementation (Already Done)

The `CategoryPage.tsx` already:
- ✅ Filters articles by category
- ✅ Falls back to all articles if none match
- ✅ Displays category name in header
- ✅ Shows loading state

---

## 12. ERROR HANDLING

The app already includes:

✅ **3 automatic retry attempts** (1 second delay each)
✅ **User-friendly error messages** (in Nepali)
✅ **Retry button** when API fails
✅ **Loading skeletons** while fetching
✅ **Graceful fallbacks** if data is incomplete

### Error Messages (Nepali)

| Error | Nepali Message |
|---|---|
| Network error | "नेटवर्क त्रुटि। कृपया जाँच गर्नुहोस्।" |
| Timeout | "अनुरोध समय सीमा समाप्त भयो।" |
| 404 | "पृष्ठ फेला परेन।" |
| Server error | "सर्भर त्रुटि। कृपया पुनः प्रयास गर्नुहोस्।" |

---

## 13. PERFORMANCE OPTIMIZATION

The app includes:

✅ **Lazy loading** - Images load as you scroll
✅ **Skeleton loaders** - Shows placeholders while loading
✅ **Rate limiting** - Frontend protects API from spam
✅ **Request timeout** - 30 seconds max per request
✅ **Intersection Observer** - Only renders visible items

### Backend Recommendations

```javascript
// Add these headers to responses
Cache-Control: public, max-age=3600
ETag: "hash-of-content"
Vary: Accept-Encoding
```

---

## 14. CRITICAL SECURITY NOTES

⚠️ **IMPORTANT - Read This Carefully**

### DO NOT:
❌ Put API keys in frontend code
❌ Store tokens in localStorage without encryption
❌ Send sensitive data without HTTPS
❌ Trust all user input

### DO:
✅ Use backend proxy for real API calls
✅ Keep API keys on server only
✅ Validate all input on backend
✅ Sanitize all output (already done)
✅ Use HTTPS in production

---

## 15. LOCAL TESTING WITHOUT BACKEND

### Using jsonblob.com

1. Create your JSON data file
2. Go to https://jsonblob.com/
3. Paste your JSON, click Save
4. Copy the URL
5. Update `.env.local`:
   ```env
   VITE_API_URL=https://jsonblob.com/api/jsonblob/YOUR_ID
   ```

### Using json-server

```bash
npm install -g json-server

# Create db.json with your data

json-server --watch db.json --port 3000

# Then set:
VITE_API_URL=http://localhost:3000
```

---

## 16. TROUBLESHOOTING

| Issue | Solution |
|---|---|
| **Blank articles** | Check API response has `title` or `excerpt` field |
| **Images not loading** | Verify image URLs are full URLs (with https://) and CORS is enabled |
| **Date shows wrong** | Ensure date format matches your display requirements |
| **"Failed to fetch" error** | Check CORS headers, API is running, URL in .env is correct |
| **Category filter not working** | Verify API returns `category` field in articles |
| **Mobile layout broken** | Clear browser cache, rebuild with `npm run build` |
| **Rate limit errors** | Wait 1 minute, check browser console for details |

---

## 17. QUICK START SUMMARY

1. **Create backend with `/api/v1/news` endpoint**
2. **Return proper JSON with articles**
3. **Update `.env.local` with your API URL**
4. **Set `VITE_USE_MOCK_DATA=false`**
5. **Run `npm run dev`**
6. **Test in browser**
7. **Deploy when ready**

---

## 18. NEXT STEPS

After API integration works:

1. Add article content field to show full posts
2. Implement search functionality
3. Add pagination for article lists
4. Add comments/ratings section
5. Add social sharing features
6. Implement user authentication if needed
7. Add admin/editor dashboard

---

## Questions?

- Check browser console (F12) for error details
- Verify API endpoint is responding: `curl http://localhost:3000/api/v1/news`
- Test with mock data first: `VITE_USE_MOCK_DATA=true`

Happy coding! 🎉
