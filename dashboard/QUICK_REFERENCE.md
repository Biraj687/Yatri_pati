# Quick Reference Guide

## Quick Start Commands

```bash
# Install dependencies
npm install

# Start development
npm run dev
# Opens at: http://localhost:5174

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project URLs

- **Development**: `http://localhost:5174`
- **API Default**: `http://localhost:3000/api`
- **Preview/Production**: `http://localhost:4173`

## Import Paths

```typescript
// Components
import { Button, Alert, Input } from '@components'
import { NewsList, NewsEditor, FileManager } from '@components'

// Pages
import { DashboardHome, NewsManagementPage } from '@pages'

// Hooks
import { useModal, useLocalStorage, useFetch } from '@hooks'

// Utils
import { formatDate, truncate, slugify } from '@utils'

// Types
import type { NewsArticle, Author, FileItem } from '@types'

// Services
import { dashboardAPI } from '@services'

// Context
import { useDashboard, DashboardProvider } from '@context'

// Layouts
import { DashboardLayout } from '@layouts'
```

## Common Code Patterns

### Using Dashboard State

```typescript
import { useDashboard } from '@context'

function MyComponent() {
  const { articles, loading, error, loadArticles } = useDashboard()
  
  useEffect(() => {
    loadArticles()
  }, [])
  
  if (loading) return <LoadingSpinner />
  if (error) return <Alert type="error" message={error} />
  
  return <div>{articles.length} articles</div>
}
```

### Creating an Article

```typescript
const { createArticle } = useDashboard()

const handleCreate = async (data) => {
  try {
    await createArticle({
      title: 'New Article',
      content: '<p>Content here</p>',
      authors: [{ name: 'Yatripati' }],
      status: 'published'
    })
  } catch (err) {
    console.error(err)
  }
}
```

### Using Custom Hooks

```typescript
// Modal
const { isOpen, open, close } = useModal()
return <Modal isOpen={isOpen} onClose={close}>...</Modal>

// LocalStorage
const [name, setName] = useLocalStorage('name', 'default')
setName('new value') // Auto-saves to localStorage

// Fetch
const { data, loading, error } = useFetch('/api/data')

// Debounce
const debouncedSearch = useDebounce(searchTerm, 500)
```

### Formatting Utilities

```typescript
import { formatDate, formatFileSize, truncate, slugify } from '@utils'

const date = formatDate('2024-01-15')           // Jan 15, 2024, 10:30 AM
const size = formatFileSize(1048576)             // 1 MB
const short = truncate('Long text...', 20)      // Long text...
const slug = slugify('My Article Title')        // my-article-title
```

## Component Props Reference

### Button
```typescript
<Button
  variant="primary" | "secondary" | "danger" | "ghost"
  size="sm" | "md" | "lg"
  loading={false}
  fullWidth={false}
  onClick={() => {}}
>
  Click me
</Button>
```

### Input
```typescript
<Input
  label="Field Label"
  placeholder="Enter text"
  value={value}
  onChange={handleChange}
  error="Error message"
  helperText="Helper text"
  type="text" | "email" | "number" | "password"
/>
```

### Alert
```typescript
<Alert
  type="error" | "success" | "info" | "warning"
  message="Alert message"
  dismissible={true}
  onClose={() => {}}
/>
```

### Modal
```typescript
<Modal
  isOpen={true}
  title="Modal Title"
  size="sm" | "md" | "lg" | "xl"
  onClose={() => {}}
  footer={<Button>Close</Button>}
>
  Modal content
</Modal>
```

### Card
```typescript
<Card
  className="custom classes"
  hoverable={false}
>
  Content
</Card>
```

## Data Type Examples

### NewsArticle
```typescript
{
  id: "123",
  title: "Article Title",
  subtitle: "Subtitle",
  content: "<p>Content</p>",
  excerpt: "Brief summary",
  featured_image: "https://...",
  image_caption: "Image description",
  video_url: "https://youtube.com/...",
  authors: [
    { name: "Author", avatar: "...", role: "Writer" }
  ],
  category: "Travel",
  tags: ["nepal", "destination"],
  status: "published",
  rank: 1,
  sticky: true,
  views: 1500,
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z",
  seoTitle: "Article Title - SEO",
  seoDescription: "Article description",
  seoKeywords: ["keyword1", "keyword2"]
}
```

### FileItem
```typescript
{
  id: "file-123",
  name: "image.jpg",
  size: 102400,
  type: "image/jpeg",
  url: "https://cdn.../image.jpg",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z"
}
```

## File Organization Tips

### Adding New Page
1. Create `src/pages/NewPage.tsx`
2. Export from `src/pages/index.ts`
3. Add to `src/App.tsx` routes
4. Add to menu in `src/layouts/DashboardLayout.tsx`

### Adding New Component
1. Create in `src/components/ComponentName.tsx`
2. Export from `src/components/index.ts`
3. Import with: `import { ComponentName } from '@components'`

### Adding Utility Function
1. Add to `src/utils/helpers.ts`
2. Exported automatically from `index.ts`
3. Import with: `import { functionName } from '@utils'`

### Adding Custom Hook
1. Add to `src/hooks/index.ts`
2. Import with: `import { useHookName } from '@hooks'`

## Environment

### Development Environment
```
NODE_ENV=development
VITE_API_BASE_URL=http://localhost:3000/api
```

### Production Environment
```
NODE_ENV=production
VITE_API_BASE_URL=https://api.yourdomain.com
```

## Debugging Tips

### Console Logging
```typescript
console.log('Message:', value)
console.table(arrayOfObjects)
console.group('Group Name'); console.log('...'); console.groupEnd()
```

### React DevTools
1. Install React DevTools extension
2. Open DevTools (F12)
3. Go to Components tab
4. Inspect component hierarchy

### Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Look for API requests
4. Check response status and timing

### Breakpoints
1. Open DevTools (F12) → Sources tab
2. Click line number to set breakpoint
3. Reload page
4. Execution pauses at breakpoint

## Common Issues & Quick Fixes

| Issue | Fix |
|-------|-----|
| Port 5174 in use | `npm run dev -- --port 5175` |
| API connection error | Check `src/services/api.ts` URL |
| Module not found | Verify import path and export |
| Styles not applied | Clear cache: Ctrl+Shift+Delete |
| Blank page | Check console for errors (F12) |
| Page won't load | Restart dev server |

## TypeScript Tips

### Type Safety
```typescript
// Always specify types
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {}

// Use interfaces for complex objects
interface UserData {
  name: string
  age: number
}

// Use 'type' for unions
type Status = 'draft' | 'published' | 'archived'
```

### Common Types
```typescript
import type { NewsArticle, Author, FileItem } from '@types'

// Usage
const article: NewsArticle = { ... }
```

## Production Checklist

- [ ] Update API endpoint in `.env.local`
- [ ] Build: `npm run build`
- [ ] Check build size: `du -sh dist/`
- [ ] Test in preview: `npm run preview`
- [ ] Check browser console for errors
- [ ] Test all features
- [ ] Run tests if available
- [ ] Update environment variables
- [ ] Deploy to server

## Documentation Files

- **README.md** - Project overview and setup
- **FEATURES.md** - Complete feature documentation
- **API_SETUP.md** - Backend API requirements
- **DEPLOYMENT.md** - Deploy to production
- **INSTALLATION.md** - Setup and troubleshooting
- **PROJECT_STRUCTURE.md** - File organization
- **This file** - Quick reference

## Useful Links

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router Docs](https://reactrouter.com)

## API Endpoints

```
GET    /api/articles              # List articles
GET    /api/articles/:id          # Get article
POST   /api/articles              # Create article
PUT    /api/articles/:id          # Update article
DELETE /api/articles/:id          # Delete article
POST   /api/articles/:id/publish  # Publish article
POST   /api/articles/:id/sticky   # Toggle sticky

GET    /api/files                 # List files
POST   /api/files/upload          # Upload file
DELETE /api/files/:id             # Delete file

GET    /api/stats                 # Get statistics
```

## Styling with Tailwind

```jsx
// Responsive classes
<div className="text-sm md:text-base lg:text-lg">
  Text sizes on mobile, tablet, desktop
</div>

// Common patterns
className="px-4 py-2"               // Padding
className="bg-blue-600 text-white"   // Colors
className="rounded-lg shadow-md"     // Borders and shadows
className="flex items-center gap-2"  // Layout
className="hover:bg-blue-700"        // Hover states
className="transition-all duration-300" // Animations
```

## Remember

- Always use TypeScript for type safety
- Use context for global state
- Use hooks for component logic
- Import from path aliases (@components, @utils, etc.)
- Test features locally before deployment
- Check browser console for errors
- Keep components focused and reusable
- Comment complex logic
- Commit frequently with meaningful messages
