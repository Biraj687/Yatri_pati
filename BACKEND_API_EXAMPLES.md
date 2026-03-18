# Backend API Setup Guide

This guide shows you exactly what your backend should return for the Yatripati news portal.

## Quick Setup Summary

1. **Create endpoint**: `GET /api/v1/news`
2. **Return JSON** with `hero`, `featured`, `articles`
3. **Use any field names** (they're auto-normalized)
4. **Use full image URLs** (include https://)
5. **Break each article into news items**
6. **Test with provided examples**

---

## Option 1: Simple API Response (Recommended)

### Endpoint: `GET /api/v1/news`

```json
{
  "success": true,
  "data": {
    "hero": {
      "id": "hero-1",
      "title": "नेपालमा विद्युत उत्पादन बृद्धि पाएको छ",
      "image": "https://example.com/images/hero-1.jpg",
      "excerpt": "यो वर्ष विद्युत उत्पादनमा २५% बृद्धि भएको सरकारले घोषणा गरेको छ।",
      "content": "नेपाल सरकारले आज लोडशेडिङ समस्याको समाधानका लागि नयाँ नीति घोषणा गरेको छ। यो वर्ष विद्युत उत्पादनमा २५% बृद्धि भएको छ जो राष्ट्रिय विद्युत प्राधिकरणले घोषणा गरेको छ।\n\nनेपालको विद्युत क्षेत्र तीव्र गतिमा अगाडि बढिरहेको छ। हिमालयन जलस्रोत र नवीकरणीय उर्जाको विकास गर्दै सरकार आत्मनिर्भरता हासिल गरिरहेको छ।\n\nयो वर्षको अन्तमा लोडशेडिङ पूर्ण रूपमा समाप्त हुने संकेत छ। सरकारले आन्तरिक उत्पादन बढाउन र विद्युत आयात कम गर्न प्रतिबद्ध छ।",
      "author": "राज शर्मा",
      "date": "२०८०/११/१८",
      "category": "Politics",
      "readTime": "३ मिनेट पढ्नु",
      "views": 15420
    },
    "featured": {
      "id": "featured-1",
      "title": "पर्यटन क्षेत्र रेकर्ड आय भएको छ",
      "image": "https://example.com/images/featured-1.jpg",
      "excerpt": "पोखरा र काठमाडौंमा होटल बुकिङ सबैभन्दा बढी भएको छ।",
      "content": "नेपालको पर्यटन क्षेत्र यो वर्ष यतिकै सफल कहिले भएको छैन। होटल र रिसोर्टहरूमा बुकिङ रेकर्ड तोडिरहेको छ।\n\nविदेशी पर्यटकहरूको संख्या अलिकति समय लगाएर पुनरुद्धार भएको छ। विशेषगरी भारत, चीन र अमेरिकाका पर्यटकहरूको आगमन बढेको छ।",
      "author": "सीमा पांडे",
      "date": "२०८०/११/१७",
      "category": "Tourism",
      "readTime": "२ मिनेट पढ्नु",
      "views": 8932
    },
    "articles": [
      {
        "id": 1,
        "title": "शिक्षा प्रणालीमा डिजिटल बदलाव आई रहेको छ",
        "image": "https://example.com/images/article-1.jpg",
        "excerpt": "सबै स्कूलमा अनलाइन क्लास र डिजिटल संसाधन आउन लागेको छ।",
        "content": "नेपालको शिक्षा प्रणाली डिजिटल बदलाववाट गुजरिरहेको छ। सरकारले सबै शिक्षकहरूलाई कम्प्युटर र इन्टरनेट प्रशिक्षण दिने निर्णय गरेको छ।",
        "author": "विजय कुमार",
        "date": "२०८०/११/१६",
        "category": "Education",
        "readTime": "२ मिनेट पढ्नु",
        "views": 5234
      },
      {
        "id": 2,
        "title": "काठमाडौंमा नयाँ मेट्रो प्रणाली शुरु हुने छ",
        "image": "https://example.com/images/article-2.jpg",
        "excerpt": "काठमाडौंको जनता भीडभाड समस्या समाधानका लागि मेट्रो प्रणाली आउन लागेको छ।",
        "author": "अनिल शाह",
        "date": "२०८०/११/१५",
        "category": "Infrastructure",
        "readTime": "३ मिनेट पढ्नु",
        "views": 12450
      },
      {
        "id": 3,
        "title": "कृषि उत्पादन रेकर्ड तोडिरहेको छ",
        "image": "https://example.com/images/article-3.jpg",
        "excerpt": "आधुनिक कृषि विधि प्रयोग गर्दै किसानले राम्रो उत्पादन पाइरहेका छन्।",
        "author": "प्रिया शर्मा",
        "date": "२०८०/११/१४",
        "category": "Agriculture",
        "readTime": "२ मिनेट पढ्नु",
        "views": 3421
      }
    ]
  }
}
```

---

## Option 2: Alternative Field Names

Your API can use different field names! All these work:

```json
{
  "success": true,
  "data": {
    "hero": {
      "_id": "hero-001",
      "headline": "नेपालमा विद्युत उत्पादन बृद्धि",
      "thumb": "https://example.com/hero.jpg",
      "summary": "विद्युत उत्पादनमा २५% बृद्धि",
      "body": "विस्तृत लेख सामग्री...",
      "writer": "लेखक नाम",
      "published_at": "2024-03-18T10:30:00Z",
      "type": "Politics",
      "estimatedReadTime": "३ मिनेट"
    },
    "featured": { /* same structure */ },
    "articles": [ /* same structure */ ]
  }
}
```

---

## Option 3: Separate Endpoints

If you prefer separate endpoints:

### Hero Endpoint: `GET /api/v1/articles/hero`

```json
{
  "success": true,
  "data": {
    "id": "hero-1",
    "title": "नेपालमा विद्युत उत्पादन बृद्धि पाएको छ",
    "image": "https://example.com/hero.jpg",
    "excerpt": "विद्युत उत्पादनमा २५% बृद्धि",
    "author": "राज शर्मा",
    "date": "२०८०/११/१८",
    "category": "Politics"
  }
}
```

### Featured Endpoint: `GET /api/v1/articles/featured`

```json
{
  "success": true,
  "data": {
    "id": "featured-1",
    "title": "पर्यटन क्षेत्र रेकर्ड आय",
    "image": "https://example.com/featured.jpg",
    "excerpt": "होटल बुकिङ बढेको छ",
    "author": "सीमा पांडे",
    "date": "२०८०/११/१७",
    "category": "Tourism"
  }
}
```

### Articles List: `GET /api/v1/articles?limit=10`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "शिक्षा प्रणालीमा डिजिटल बदलाव",
      "image": "https://example.com/article-1.jpg",
      "excerpt": "शिक्षकहरूको प्रशिक्षण शुरु",
      "author": "विजय कुमार",
      "date": "२०८०/११/१६",
      "category": "Education"
    }
  ]
}
```

---

## Option 4: Paginated Response

```json
{
  "success": true,
  "data": {
    "articles": [
      { /* article object */ }
    ],
    "total": 150,
    "page": 1,
    "limit": 10,
    "pages": 15
  }
}
```

---

## Option 5: Data-wrapped Response

```json
{
  "success": true,
  "data": {
    "data": [
      { /* articles */ }
    ]
  }
}
```

---

## Category-specific Endpoint

To enable category filtering:

### Endpoint: `GET /api/v1/articles?category=Politics`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "नेपालमा विद्युत उत्पादन बृद्धि",
      "image": "https://example.com/img1.jpg",
      "excerpt": "विद्युत उत्पादनमा २५%",
      "author": "राज शर्मा",
      "date": "२०८०/११/१८",
      "category": "Politics"
    }
  ]
}
```

---

## Search Endpoint (Optional)

### Endpoint: `GET /api/v1/search?q=विद्युत`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "नेपालमा विद्युत उत्पादन बृद्धि",
      "image": "https://example.com/img1.jpg",
      "excerpt": "विद्युत उत्पादनमा २५%",
      "author": "राज शर्मा",
      "date": "२०८०/११/१८",
      "category": "Politics"
    }
  ]
}
```

---

## Error Response Example

```json
{
  "success": false,
  "error": "अनुमति अस्वीकृत"
}
```

---

## Field Mapping Reference

| Your Field Name | Frontend Field | Notes |
|---|---|---|
| `id` or `_id` | Unique identifier | |
| `title` or `headline` | Article title | |
| `image`, `thumbnail`, `thumb` | Featured image URL | Must be full URL |
| `excerpt`, `summary`, `description` | Short description | 50-200 characters |
| `author` or `writer` | Author name | Character name |
| `date`, `published_at`, `createdAt` | Publication date | Any format works |
| `category`, `type`, `channel` | News category | "Politics", "Tourism", etc |
| `content` or `body` | Full article text | For detail pages |
| `authorAvatar`, `avatar` | Author profile pic | Optional, full URL |
| `readTime` or `estimatedReadTime` | Reading duration | "२ मिनेट" |
| `views` or `viewCount` | Article views | Number, optional |

---

## Backend Implementation Examples

### Node.js/Express

```javascript
app.get('/api/v1/news', async (req, res) => {
  try {
    const [heroArticle, featuredArticle, articles] = await Promise.all([
      Article.findOne({ featured: true, hero: true }),
      Article.findOne({ featured: true }),
      Article.find().limit(20)
    ]);

    res.json({
      success: true,
      data: {
        hero: heroArticle,
        featured: featuredArticle,
        articles: articles
      }
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
});
```

### Python/Flask

```python
@app.route('/api/v1/news', methods=['GET'])
def get_news():
    try:
        hero = Article.query.filter_by(hero=True).first()
        featured = Article.query.filter_by(featured=True).first()
        articles = Article.query.limit(20).all()

        return jsonify({
            'success': True,
            'data': {
                'hero': hero.to_dict(),
                'featured': featured.to_dict(),
                'articles': [a.to_dict() for a in articles]
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })
```

### PHP

```php
<?php
header('Content-Type: application/json');

try {
    $hero = $db->query("SELECT * FROM articles WHERE hero = 1 LIMIT 1")->fetch();
    $featured = $db->query("SELECT * FROM articles WHERE featured = 1 LIMIT 1")->fetch();
    $articles = $db->query("SELECT * FROM articles LIMIT 20")->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => [
            'hero' => $hero,
            'featured' => $featured,
            'articles' => $articles
        ]
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
```

---

## Image URL Guidelines

✅ **Good URLs:**
- `https://example.com/images/article1.jpg` (full URL)
- `https://cdn.example.com/articles/news.png` (CDN)
- `https://storage.example.com/photos/article.webp` (cloud storage)

❌ **Bad URLs:**
- `/images/article1.jpg` (relative path - WRONG!)
- `images/article1.jpg` (relative - WRONG!)
- `example.com/image.jpg` (missing https://)

---

## Date Format Guidelines

All formats work, but recommend Nepali calendar:

✅ **Recommended:**
- `२०८०/११/१८` (Nepali calendar)
- `२०८० मंसिर १८` (Nepali text format)

✅ **Also works:**
- `2024-03-18` (ISO date)
- `March 18, 2024` (English)
- `18-03-2024` (DD-MM-YYYY)

---

## Testing Your API

### 1. Test in Browser

```
https://your-api.com/api/v1/news
```

Should return formatted JSON.

### 2. Test with cURL

```bash
curl http://localhost:3000/api/v1/news
```

### 3. Test with Postman

- URL: `http://localhost:3000/api/v1/news`
- Method: GET
- Expected: Valid JSON response

### 4. Frontend Testing

Set in `.env.local`:
```env
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCK_DATA=false
```

Run:
```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## Production Deployment

1. **Update API URL** in `.env`
2. **Enable CORS** on backend
3. **Use HTTPS** only
4. **Add cache headers** to responses
5. **Implement rate limiting** on backend
6. **Monitor logs** for errors
7. **Test thoroughly** before deploying

---

## Support

If you need help:
- Check browser console (F12 → Console)
- Verify API is running: `curl http://localhost:3000/api/v1/news`
- Test with provided mock data first
- Check network tab for response details
