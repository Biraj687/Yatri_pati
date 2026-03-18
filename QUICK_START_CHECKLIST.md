# Quick Start Implementation Checklist

Complete these steps to get your Yatripati news portal working with your backend API.

---

## Phase 1: Backend Preparation (Your Server)

### Step 1: Create Main API Endpoint
- [ ] Create endpoint: `GET /api/v1/news`
- [ ] Return JSON object with `success` and `data` fields
- [ ] Inside `data`, return `hero`, `featured`, and `articles`
- [ ] Test with cURL: `curl http://localhost:3000/api/v1/news`

### Step 2: Prepare Article Data
- [ ] Collect news articles into database or JSON
- [ ] Ensure each article has: `title`, `image` (full URL), `excerpt`
- [ ] Add optional fields: `author`, `date`, `category`, `content`
- [ ] Verify all image URLs are full URLs (https://...)

### Step 3: Enable CORS
- [ ] Add CORS headers to allow frontend requests
- [ ] Allow `http://localhost:5173` for development
- [ ] Example header: `Access-Control-Allow-Origin: *`

### Step 4: Test Backend
```bash
# Test if API returns proper JSON
curl http://localhost:3000/api/v1/news | json_pp

# Should see: { "success": true, "data": { "hero": {...}, "featured": {...}, "articles": [...] } }
```

---

## Phase 2: Frontend Configuration

### Step 5: Update Environment Variables

Edit `.env.local` in project root:

```env
# Point to your backend API
VITE_API_URL=http://localhost:3000/api

# Set to false to use real API (not mock data)
VITE_USE_MOCK_DATA=false
```

For production:
```env
VITE_API_URL=https://your-api-domain.com/api
VITE_USE_MOCK_DATA=false
```

### Step 6: Install Dependencies
```bash
cd yatripati
npm install
```

### Step 7: Start Development Server
```bash
npm run dev
```

Output should show:
```
VITE v... ready in ... ms

➜  Local:   http://localhost:5173/
```

---

## Phase 3: Testing

### Step 8: Test Home Page
- [ ] Open `http://localhost:5173` in browser
- [ ] Should see hero article at top
- [ ] Should see featured article below
- [ ] Should see list of compact articles
- [ ] All images should load
- [ ] Click article should navigate to detail page

### Step 9: Test Article Details
- [ ] Click on any article
- [ ] Should display full article with images
- [ ] Author name, date should show correctly
- [ ] Related articles sidebar should show
- [ ] Navigation buttons should work

### Step 10: Test Categories
- [ ] Click on category tag on article detail
- [ ] Should show all articles in that category
- [ ] Category name should appear in header
- [ ] Articles should be properly filtered

### Step 11: Check Browser Console
- [ ] Press F12 to open Developer Tools
- [ ] Go to Console tab
- [ ] Should see no errors (warnings are ok)
- [ ] API requests should show successful responses

---

## Phase 4: Data Troubleshooting

### If Articles Don't Show

**Check these:**

1. **API is running**
   ```bash
   curl http://localhost:3000/api/v1/news
   ```
   Should return JSON, not error

2. **API URL is correct in `.env.local`**
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

3. **CORS is enabled** - check with:
   ```bash
   curl -H "Origin: http://localhost:5173" \
        -H "Access-Control-Request-Method: GET" \
        http://localhost:3000/api/v1/news -v
   ```

4. **Article fields exist**
   ```json
   {
     "hero": { "title": "...", "image": "...", "excerpt": "..." },
     "featured": { "title": "...", "image": "...", "excerpt": "..." },
     "articles": [{ "title": "...", "image": "...", "excerpt": "..." }]
   }
   ```

### If Images Don't Load

1. **Verify URLs are full URLs**
   ```
   ✅ https://example.com/image.jpg
   ❌ /image.jpg
   ❌ image.jpg
   ```

2. **Check image CORS**
   ```bash
   curl -I https://example.com/image.jpg
   ```
   Should return `200 OK`

3. **Try different format**
   ```
   jpg, png, webp all work
   ```

### If Dates Show Incorrectly

1. **Check date field in API**
   ```json
   {
     "date": "२०८०/११/१८"
   }
   ```

2. **Any of these formats work:**
   - `2024-03-18`
   - `March 18, 2024`
   - `२०८०/११/१८`
   - Unix timestamp

### If Categories Not Working

1. **Ensure articles have category field**
   ```json
   {
     "title": "...",
     "category": "Politics"
   }
   ```

2. **Verify category names match**
   - No extra spaces
   - Consistent capitalization

---

## Phase 5: Production Deployment

### Step 12: Build for Production

```bash
npm run build
```

Output:
```
✓ 1234 modules transformed
dist/index.html     12.34 kB │ gzip:  3.45 kB
dist/assets/...     ...
```

### Step 13: Update for Production

Edit `.env` (or `.env.local`):
```env
VITE_API_URL=https://your-production-api.com/api
VITE_USE_MOCK_DATA=false
```

### Step 14: Deploy

1. Upload `dist/` folder to web server
2. Configure server to serve `index.html` for all routes
3. Test in production

---

## Phase 6: Optional Enhancements

### Add Full Article Content
- [ ] Backend should return `content` field with full article text
- [ ] Article detail page will display it automatically

### Add Search
- [ ] Create backend endpoint: `GET /api/v1/search?q=query`
- [ ] Frontend already has search function available

### Add Category Filter
- [ ] Create backend endpoint: `GET /api/v1/articles?category=Politics`
- [ ] Frontend already handles category filtering

### Add Article By ID
- [ ] Create backend endpoint: `GET /api/v1/articles/:id`
- [ ] Fetches full article data including content

---

## Example Complete API Response

```json
{
  "success": true,
  "data": {
    "hero": {
      "id": "hero-1",
      "title": "नेपालमा विद्युत उत्पादन बृद्धि",
      "image": "https://example.com/hero.jpg",
      "excerpt": "विद्युत उत्पादनमा २५% बृद्धि",
      "author": "राज शर्मा",
      "date": "२०८०/११/१८",
      "category": "Politics",
      "content": "Full article text here..."
    },
    "featured": {
      "id": "featured-1",
      "title": "पर्यटन क्षेत्र रेकर्ड आय",
      "image": "https://example.com/featured.jpg",
      "excerpt": "होटल बुकिङ बढेको छ",
      "author": "सीमा पांडे",
      "date": "२०८०/११/१७",
      "category": "Tourism"
    },
    "articles": [
      {
        "id": 1,
        "title": "शिक्षा प्रणालीमा डिजिटल बदलाव",
        "image": "https://example.com/article1.jpg",
        "excerpt": "डिजिटल संसाधन आउन लागेको छ",
        "author": "विजय कुमार",
        "date": "२०८०/११/१६",
        "category": "Education"
      }
    ]
  }
}
```

---

## File Reference

**Key files you might modify:**

| File | Purpose | When to Modify |
|---|---|---|
| `.env.local` | API URL | Always - first step |
| `src/services/newsService.ts` | API logic | If endpoint path differs |
| `src/pages/ArticleDetail.tsx` | Article display | For custom layout |
| `src/pages/CategoryPage.tsx` | Category view | For custom filtering |

**Files already configured (don't modify):**

| File | Purpose |
|---|---|
| `src/services/apiClient.ts` | Handles all API calls |
| `src/services/sanitizer.ts` | Protects against XSS |
| `src/components/FeaturedArticle.tsx` | Displays featured article |
| `src/components/CompactArticle.tsx` | Displays compact article |
| `src/pages/Home.tsx` | Home page logic |

---

## Testing Checklist

Before going live:

- [ ] All articles display on home page
- [ ] Images load correctly
- [ ] Click article shows detail page with content
- [ ] Author name shows correctly
- [ ] Date shows correctly
- [ ] Category links work
- [ ] No errors in browser console
- [ ] Mobile layout works properly
- [ ] Loading skeleton shows while fetching
- [ ] Error page shows if API fails
- [ ] Retry button works on error
- [ ] Back button returns to previous page

---

## Common Issues & Solutions

| Issue | Solution |
|---|---|
| **404 Not Found** | Check API URL in `.env.local` |
| **CORS Error** | Enable CORS on backend server |
| **Blank articles** | Verify API returns `title` field |
| **Images broken** | Use full URLs (https://...) |
| **Slow loading** | Check API response time, add caching |
| **Category not filtering** | Verify `category` field in API response |
| **Mobile broken** | Clear cache, rebuild with `npm run build` |
| **Date weird** | Check date format, any format works |

---

## Support Commands

```bash
# Check if backend is running
curl http://localhost:3000/api/v1/news

# Check if frontend builds
npm run build

# Preview production build
npm run preview

# Check environment variables
cat .env.local

# Check for errors
npm run dev

# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Success Indicators

✅ **You're done when:**
- API is returning JSON correctly
- Frontend loads articles from API
- All images display
- Click articles work
- Categories work
- No console errors
- Production build works

---

## Next Support Steps

If you get stuck:

1. **Check browser console** (F12 → Console tab)
2. **Check API directly** - `curl your-api-url/api/v1/news`
3. **Verify .env.local** - correct API URL?
4. **Check documentation** - refer to `API_IMPLEMENTATION_COMPLETE_GUIDE.md`
5. **Check examples** - refer to `BACKEND_API_EXAMPLES.md`

---

## Ready to Deploy?

After everything works locally:

1. Update `.env` for production URL
2. Run `npm run build`
3. Deploy `dist/` folder
4. Configure server for SPA routing
5. Test in production
6. Monitor error logs

🎉 **You're all set!**
