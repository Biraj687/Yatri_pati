# Dashboard Refactoring - Implementation Guide

## Next Steps for Developers

This guide provides clear instructions for completing the remaining 15% of the dashboard refactoring.

---

## 1. Form Integration in Components (2-3 hours)

### Task: Update NewsEditor.tsx with React Hook Form + Zod

**Current State**: Uses untyped form handling
**Target State**: Fully validated with react-hook-form + zod

**Implementation Steps**:

```typescript
// dashboard/src/components/NewsEditor.tsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createNewsSchema, type CreateNewsInput } from '@utils/validation';
import { useNotification } from '@context/NotificationContext';
import type { CreateNewsPayload } from '@types';

interface NewsEditorProps {
  article?: NewsArticle;
  onSave?: (payload: CreateNewsPayload) => Promise<void>;
}

export function NewsEditor({ article, onSave }: NewsEditorProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateNewsInput>({
    resolver: zodResolver(createNewsSchema),
    defaultValues: article ? {
      title: article.title,
      content: article.content,
      // ... map other fields
    } : undefined,
  });
  
  const { showNotification } = useNotification();
  
  const onSubmit = async (data: CreateNewsInput) => {
    try {
      await onSave?.(data);
      showNotification('Article saved successfully!', 'success');
    } catch (error) {
      showNotification((error as Error).message, 'error');
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title Field */}
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          {...register('title')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Article title"
        />
        {errors.title && <span className="text-red-600 text-xs">{errors.title.message}</span>}
      </div>
      
      {/* Content Field */}
      <div>
        <label className="block text-sm font-medium mb-2">Content</label>
        <textarea
          {...register('content')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          rows={10}
          placeholder="Article content"
        />
        {errors.content && <span className="text-red-600 text-xs">{errors.content.message}</span>}
      </div>
      
      {/* Submit Button */}
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Save Article
      </button>
    </form>
  );
}
```

**Repeat for**: 
- `AdvertisementForm.tsx`
- `SettingsPage.tsx` (partial - already done)

---

## 2. Pagination UI Implementation (1-2 hours)

### Task: Add pagination controls to list pages

**Implementation Pattern**:

```typescript
// Example: NewsManagementPage.tsx

import { useCallback } from 'react';
import { useDashboard } from '@context/DashboardContext';

export function NewsManagementPage() {
  const { articles, pagination, loadArticles, loading } = useDashboard();
  
  const handlePageChange = useCallback((page: number) => {
    loadArticles({ page, limit: pagination.limit });
  }, [loadArticles, pagination.limit]);
  
  const handleLimitChange = useCallback((limit: number) => {
    loadArticles({ page: 1, limit });
  }, [loadArticles]);
  
  return (
    <div>
      {/* Article List */}
      <div className="space-y-4">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      
      {/* Pagination Controls */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
          {pagination.total} results
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 rounded ${
                page === pagination.page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        
        <select
          value={pagination.limit}
          onChange={e => handleLimitChange(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded"
        >
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
    </div>
  );
}
```

**Apply to**:
- `NewsManagementPage.tsx`
- `AdvertisementManagementPage.tsx`
- `FileManagerPage.tsx` (already partially done)

---

## 3. Bulk Actions Implementation (1-2 hours)

### Task: Add multi-select and bulk operations

```typescript
// Pattern for bulk selection

const [selectedIds, setSelectedIds] = useState<string[]>([]);

const toggleSelect = (id: string) => {
  setSelectedIds(prev =>
    prev.includes(id)
      ? prev.filter(selected => selected !== id)
      : [...prev, id]
  );
};

const toggleSelectAll = () => {
  if (selectedIds.length === articles.length) {
    setSelectedIds([]);
  } else {
    setSelectedIds(articles.map(a => a.id));
  }
};

const handleBulkDelete = async () => {
  if (!confirm(`Delete ${selectedIds.length} items?`)) return;
  
  try {
    for (const id of selectedIds) {
      await deleteArticle(id);
    }
    setSelectedIds([]);
    showNotification('Items deleted successfully', 'success');
  } catch (error) {
    showNotification((error as Error).message, 'error');
  }
};

const handleBulkPublish = async () => {
  try {
    for (const id of selectedIds) {
      await publishArticle(id);
    }
    setSelectedIds([]);
    showNotification('Items published successfully', 'success');
  } catch (error) {
    showNotification((error as Error).message, 'error');
  }
};

// In JSX:
<table>
  <thead>
    <tr>
      <th>
        <input
          type="checkbox"
          checked={selectedIds.length === articles.length}
          onChange={toggleSelectAll}
        />
      </th>
      {/* Other headers */}
    </tr>
  </thead>
  <tbody>
    {articles.map(article => (
      <tr key={article.id}>
        <td>
          <input
            type="checkbox"
            checked={selectedIds.includes(article.id)}
            onChange={() => toggleSelect(article.id)}
          />
        </td>
        {/* Other cells */}
      </tr>
    ))}
  </tbody>
</table>

{selectedIds.length > 0 && (
  <div className="mt-4 flex gap-2">
    <button onClick={handleBulkPublish} className="px-4 py-2 bg-green-600 text-white rounded">
      Publish ({selectedIds.length})
    </button>
    <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-600 text-white rounded">
      Delete ({selectedIds.length})
    </button>
  </div>
)}
```

---

## 4. Real-Time Updates Implementation (2-3 hours)

### Task: WebSocket integration for live metrics

```typescript
// dashboard/src/hooks/useRealtimeMetrics.ts

import { useEffect } from 'react';
import { realtimeService } from '@shared/services';
import { useNotification } from '@context/NotificationContext';

export function useRealtimeMetrics(onUpdate: (data: any) => void) {
  const { showNotification } = useNotification();

  useEffect(() => {
    const connect = async () => {
      try {
        const socket = await realtimeService.connect();
        
        socket.on('metrics:update', (data) => {
          onUpdate(data);
        });
        
        socket.on('disconnect', () => {
          showNotification('Connection lost', 'warning');
        });
        
        return () => socket.disconnect();
      } catch (error) {
        showNotification('Real-time connection failed', 'error');
      }
    };

    return connect();
  }, [onUpdate, showNotification]);
}

// Usage in Dashboard:
export function DashboardHome() {
  const [liveStats, setLiveStats] = useState<DashboardStats | null>(null);
  
  useRealtimeMetrics((data) => {
    setLiveStats(data);
  });
  
  // Render with liveStats
}
```

---

## 5. Performance Optimization (1-2 hours)

### Task: Lazy load pages and optimize bundle

```typescript
// dashboard/src/App.tsx - Add lazy loading

import { lazy, Suspense } from 'react';

const DashboardHome = lazy(() => import('@pages/DashboardHome'));
const NewsManagementPage = lazy(() => import('@pages/NewsManagementPage'));
const AnalyticsPage = lazy(() => import('@pages/AnalyticsPage'));
const SettingsPage = lazy(() => import('@pages/SettingsPage'));
const FileManagerPage = lazy(() => import('@pages/FileManagerPage'));
const AdvertisementManagementPage = lazy(() => import('@pages/AdvertisementManagementPage'));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );
}

// In your routes:
<Route
  path="/analytics"
  element={
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout>
        <Suspense fallback={<LoadingFallback />}>
          <AnalyticsPage />
        </Suspense>
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
```

**Additional optimizations**:
```typescript
// Use memoization
const ArticleCard = memo(({ article }: Props) => { /*...*/ });

// Use useMemo for expensive computations
const sortedArticles = useMemo(() => {
  return [...articles].sort((a, b) => b.views - a.views);
}, [articles]);

// Code splitting for large libraries
import('chart-library').then(({ Chart }) => {
  // Use Chart
});
```

---

## 6. Testing Setup (4-5 hours)

### Task: Add unit and integration tests

**File**: `dashboard/src/__tests__/services/newsService.test.ts`

```typescript
import { newsService } from '@shared/services';
import { createNewsSchema } from '@utils/validation';

describe('News Service', () => {
  describe('getNews', () => {
    it('should fetch articles with pagination', async () => {
      const result = await newsService.getNews(1, 10);
      expect(result.data).toBeDefined();
      expect(result.total).toBeGreaterThanOrEqual(0);
      expect(result.page).toBe(1);
    });
  });

  describe('createArticle', () => {
    it('should create article with valid payload', async () => {
      const validPayload = {
        title: 'Test Article',
        content: 'This is test content for the article',
        authors: [{ name: 'Test Author', email: 'test@example.com' }],
        status: 'draft' as const,
      };

      const article = await newsService.createArticle(validPayload);
      expect(article.id).toBeDefined();
      expect(article.title).toBe('Test Article');
    });

    it('should reject invalid payload', async () => {
      const invalidPayload = {
        title: '', // Too short
        content: 'x', // Too short
      };

      await expect(createNewsSchema.parseAsync(invalidPayload))
        .rejects
        .toThrow();
    });
  });
});
```

---

## 7. Environment Configuration

### Required Environment Variables

```env
# .env.local for development

# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_USE_MOCK_DATA=true
VITE_ENABLE_REALTIME=false

# Dashboard Config
VITE_DASHBOARD_URL=http://localhost:5174
VITE_SESSION_TIMEOUT=3600000

# Analytics & Monitoring (Optional)
VITE_SENTRY_DSN=
VITE_ANALYTICS_ID=
```

---

## 8. Build & Deployment Checklist

```bash
# Type checking
tsc --noEmit

# Linting
npm run lint

# Testing
npm run test

# Build
npm run build

# Preview production build
npm run preview
```

**Pre-deployment verification**:
- ✅ No TypeScript errors
- ✅ All tests passing
- ✅ Bundle size < 500KB (gzipped)
- ✅ Lighthouse score > 80
- ✅ All E2E tests passing

---

## 9. Integration Testing Scenarios

### Critical Paths to Test

1. **Authentication Flow**
   - Login with valid credentials
   - Login with invalid credentials
   - Logout functionality
   - Session persistence

2. **Article Management**
   - Create article with validation
   - Edit article
   - Publish/unpublish article
   - Delete article
   - Bulk operations

3. **Advertisement Management**
   - Create advertisement
   - View analytics
   - Pause/resume ad
   - Delete ad

4. **File Management**
   - Upload file
   - Download file
   - Delete file
   - Bulk file operations

---

## Recommended Implementation Order

1. **Week 1**: Form validation + Pagination
2. **Week 2**: Bulk actions + Real-time updates
3. **Week 3**: Performance optimization + Testing
4. **Week 4**: Final testing + Deployment

---

## Support Resources

- **Types**: Review `src/types/index.ts` for all available types
- **Validation**: Review `src/utils/validation.ts` for validation patterns
- **Services**: Review `shared/services/` for API integration
- **Examples**: Review existing pages for implementation patterns

---

**Last Updated**: March 26, 2026
