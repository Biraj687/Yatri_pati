# API Setup Guide

## Overview

The Yatripati Dashboard communicates with a backend API. This guide shows exactly what endpoints and data structures need to be implemented.

## API Base URL

Default: `http://localhost:3000/api`

Configure in dashboard or backend accordingly.

## Authentication

All requests include an Authorization header:
```
Authorization: Bearer {token}
```

Token is stored in localStorage under `authToken` key.

## Endpoints

### Articles Management

#### GET /api/articles
Retrieve all articles with pagination, search, and filtering.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20) - Items per page
- `status` (string: 'draft' | 'published' | 'archived') - Filter by status
- `search` (string) - Full-text search
- `sort` (string: 'latest' | 'popular' | 'trending') - Sort order
- `author` (string) - Filter by author name

**Response:**
```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "subtitle": "string",
      "slug": "string",
      "content": "string (HTML)",
      "excerpt": "string",
      "featured_image": "string (URL)",
      "image_caption": "string",
      "video_url": "string",
      "authors": [
        {
          "id": "string",
          "name": "string",
          "avatar": "string (URL)",
          "email": "string",
          "role": "string"
        }
      ],
      "category": "string",
      "tags": ["string"],
      "status": "draft" | "published" | "archived",
      "rank": number,
      "sticky": boolean,
      "views": number,
      "createdAt": "ISO 8601 date",
      "updatedAt": "ISO 8601 date",
      "publishedAt": "ISO 8601 date",
      "seoTitle": "string",
      "seoDescription": "string",
      "seoKeywords": ["string"]
    }
  ],
  "total": number,
  "page": number,
  "limit": number,
  "totalPages": number
}
```

#### GET /api/articles/:id
Get a single article by ID.

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "... (same structure as above)"
}
```

**Status Codes:**
- 200 OK
- 404 Not Found

#### POST /api/articles
Create a new article.

**Request Body:**
```json
{
  "title": "string (required)",
  "subtitle": "string (optional)",
  "content": "string (required)",
  "excerpt": "string (optional)",
  "featured_image": "string (URL, optional)",
  "image_caption": "string (optional)",
  "video_url": "string (URL, optional)",
  "authors": [
    {
      "name": "string (required)",
      "avatar": "string (URL, optional)",
      "email": "string (optional)",
      "role": "string (optional)"
    }
  ],
  "category": "string (optional)",
  "tags": ["string"] (optional),
  "status": "draft" | "published" (required),
  "rank": number (optional, default: 0),
  "sticky": boolean (optional, default: false),
  "seoTitle": "string (optional)",
  "seoDescription": "string (optional)",
  "seoKeywords": ["string"] (optional)
}
```

**Response:**
- 201 Created - Returns created article object
- 400 Bad Request - Validation error
- 401 Unauthorized - Auth required

#### PUT /api/articles/:id
Update an existing article.

**Request Body:**
```json
{
  "title": "string (optional)",
  "subtitle": "string (optional)",
  "content": "string (optional)",
  "... (same fields as POST)"
}
```

**Response:**
- 200 OK - Returns updated article
- 400 Bad Request
- 404 Not Found
- 401 Unauthorized

#### DELETE /api/articles/:id
Delete an article (soft delete recommended).

**Response:**
- 204 No Content
- 404 Not Found
- 401 Unauthorized

#### POST /api/articles/:id/publish
Publish a draft article.

**Response:**
```json
{
  "id": "string",
  "status": "published",
  "publishedAt": "ISO 8601 date",
  "... (full article object)"
}
```

#### POST /api/articles/:id/sticky
Toggle sticky status of an article.

**Response:**
```json
{
  "id": "string",
  "sticky": boolean,
  "... (full article object)"
}
```

### File Management

#### GET /api/files
Get all uploaded files.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 50)
- `type` (string: 'image' | 'video' | 'document') - Filter by type

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "size": number (bytes),
    "type": "string (MIME type)",
    "url": "string (accessible URL)",
    "createdAt": "ISO 8601 date",
    "updatedAt": "ISO 8601 date"
  }
]
```

#### POST /api/files/upload
Upload a file (multipart/form-data).

**Form Data:**
- `file` (required) - File to upload

**Response:** 201 Created
```json
{
  "id": "string",
  "name": "string",
  "size": number,
  "type": "string",
  "url": "string",
  "createdAt": "ISO 8601 date",
  "updatedAt": "ISO 8601 date"
}
```

#### DELETE /api/files/:id
Delete a file.

**Response:**
- 204 No Content
- 404 Not Found

### Statistics

#### GET /api/stats
Get dashboard statistics.

**Response:**
```json
{
  "totalArticles": number,
  "publishedArticles": number,
  "draftArticles": number,
  "totalViews": number,
  "totalAuthors": number,
  "recentArticles": [
    {
      "... (article objects)"
    }
  ]
}
```

## Error Response Format

All errors should follow this format:

```json
{
  "error": "string (human-readable message)",
  "code": "string (error code)",
  "details": "object (optional additional details)"
}
```

**Common Status Codes:**
- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request - Validation error
- 401 Unauthorized - Auth required
- 403 Forbidden - Permission denied
- 404 Not Found
- 409 Conflict - Resource already exists
- 422 Unprocessable Entity - Validation error
- 500 Internal Server Error

## Rate Limiting (Recommended)

Implement rate limiting to prevent abuse:

```
Rate-Limit-Limit: 1000
Rate-Limit-Remaining: 999
Rate-Limit-Reset: 1640995200
```

## CORS Configuration

Enable CORS with these headers:

```
Access-Control-Allow-Origin: http://localhost:5174
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

## File Upload Configuration

### Supported File Types
- **Images**: JPEG, PNG, GIF, WebP (max 10MB)
- **Videos**: MP4, WebM, Ogg (max 100MB)
- **Documents**: PDF, DOCX, XLSX, PPTX (max 50MB)

### Uploaded File Storage
- Store files in a secure location (S3, local filesystem, etc.)
- Generate stable, permanent URLs
- Return full URL in API response
- Implement virus scanning for security

## Authentication Implementation

### Token Management
1. User logs in via separate auth endpoint
2. Backend returns JWT token
3. Dashboard stores token in localStorage: `localStorage.setItem('authToken', token)`
4. Token sent with every request in Authorization header
5. On 401 Unauthorized, clear token and redirect to login

### Token Refresh
Implement token refresh to prevent session expiry:
- Return refresh token with initial login
- Check token expiry before requests
- Auto-refresh if near expiry

## Data Validation

### Server-side Validation
All data should be validated on the backend:

**Articles:**
- Title: required, 5-200 characters
- Content: required, minimum 50 characters
- Excerpt: optional, max 500 characters
- Status: must be 'draft', 'published', or 'archived'
- Rank: must be non-negative number
- Tags: max 100 tags, each max 50 characters
- Authors: at least 1, max 10

**Files:**
- Size limits per file type
- Allowed MIME types
- Filename validation (sanitize)
- Prevent directory traversal

## Pagination

Always include pagination metadata:

```json
{
  "data": [...],
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

## Sorting Options

Implement support for these sort options:
- `latest` - Newest first (by createdAt)
- `oldest` - Oldest first
- `popular` - Most viewed first
- `trending` - Recent with high views
- `rank` - By rank field (highest first)

## Search Implementation

Full-text search should cover:
- Article titles
- Article content (optional for performance)
- Article excerpts
- Author names
- Tags
- Category names

## Recommendations

1. **Implement caching** - Cache frequently accessed data
2. **Add logging** - Log all API requests for debugging
3. **Data backup** - Regular backups of all article data
4. **Version API** - Support multiple API versions
5. **Documentation** - Update API docs when changing endpoints
6. **Testing** - Thoroughly test all endpoints
7. **Performance** - Optimize queries and responses
8. **Security** - Validate and sanitize all inputs
9. **Monitoring** - Monitor API performance and errors
10. **Scalability** - Plan for growth in articles and traffic

## Example Implementation (Node.js/Express)

```typescript
// Basic endpoint structure
app.get('/api/articles', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    
    // Fetch articles from database
    const articles = await Article.find({
      ...(status && { status }),
      ...(search && { $text: { $search: search } })
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
    
    const total = await Article.countDocuments();
    
    res.json({
      data: articles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

For complete backend implementation, refer to your API framework documentation.
