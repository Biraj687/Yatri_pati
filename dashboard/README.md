# Yatripati News Management Dashboard

A professional, production-ready React-based news management dashboard for the Yatripati news portal.

## Features

### 📰 News Management
- **Create, Edit, Delete** articles with full content management
- **Multiple Authors** support with default "Yatripati" author
- **Rich Content** editor for article body and excerpts
- **Featured Media** - upload and manage featured images and videos
- **Image Captions** for enhanced accessibility
- **SEO Optimization** - SEO titles, descriptions, and keywords
- **Article Ranking** - set custom ranks for article ordering
- **Sticky Articles** - mark important news as sticky/featured
- **Status Management** - draft, published, and archived states
- **Sorting & Filtering** - by date, views, rank, status, and category
- **Full-text Search** - search articles by title and content

### 📁 File Manager
- **Drag & Drop** file uploads - WordPress-style interface
- **Bulk Upload** support
- **File Organization** - organize by type (images, videos, documents)
- **Media Preview** - preview images and videos inline
- **File Operations**:
  - Copy URL to clipboard
  - Download files
  - Delete files
  - Search and filter by name/type
- **File Stats** - track total files and storage usage

### 📊 Analytics & Insights
- **Dashboard Statistics**:
  - Total articles, published count, drafts
  - Total views and engagement metrics
  - Active authors count
  - Sticky articles overview
- **Performance Charts**:
  - Articles by category
  - Top contributing authors
  - Top performing articles by views
- **Publishing Metrics**:
  - Publication rate
  - Average views per article
  - Category distribution

### ⚙️ Dashboard Settings
- **Site Configuration** - customize site name and defaults
- **Display Preferences** - theme selection and appearance
- **Notification Settings** - auto-save and email preferences
- **API Configuration** - manage API endpoints

## Project Structure

```
dashboard/
├── src/
│   ├── components/
│   │   ├── UI.tsx                 # Reusable UI components
│   │   ├── NewsList.tsx           # News list and preview components
│   │   ├── NewsEditor.tsx         # Article editor form
│   │   ├── FileManager.tsx        # File management interface
│   │   └── index.ts               # Component exports
│   ├── context/
│   │   ├── DashboardContext.tsx   # State management
│   │   └── index.ts
│   ├── hooks/
│   │   └── index.ts               # Custom React hooks
│   ├── layouts/
│   │   ├── DashboardLayout.tsx    # Main dashboard layout
│   │   └── index.ts
│   ├── pages/
│   │   ├── DashboardHome.tsx      # Home/overview page
│   │   ├── NewsManagementPage.tsx # News management page
│   │   ├── FileManagerPage.tsx    # File manager page
│   │   ├── AnalyticsPage.tsx      # Analytics page
│   │   ├── SettingsPage.tsx       # Settings page
│   │   └── index.ts
│   ├── services/
│   │   ├── api.ts                 # API service client
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   ├── utils/
│   │   ├── helpers.ts             # Utility functions
│   │   └── index.ts
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite config
├── tailwind.config.js             # Tailwind CSS config
└── postcss.config.js              # PostCSS config
```

## Tech Stack

- **Frontend Framework**: React 19.2.0
- **Language**: TypeScript 5.9
- **Build Tool**: Vite 7.3
- **Styling**: Tailwind CSS 3.3
- **Routing**: React Router 7.13
- **Icons**: React Icons 5.0
- **HTTP Client**: Fetch API

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment** (optional):
Create `.env.local`:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

3. **Start development server**:
```bash
npm run dev
```

The dashboard will be available at `http://localhost:5174`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## API Integration

The dashboard expects a backend API with the following endpoints:

### Articles
- `GET /api/articles` - Get all articles (with pagination, search, filters)
- `GET /api/articles/:id` - Get single article
- `POST /api/articles` - Create article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article
- `POST /api/articles/:id/publish` - Publish article
- `POST /api/articles/:id/sticky` - Toggle sticky status

### Files
- `GET /api/files` - Get all uploaded files
- `POST /api/files/upload` - Upload file
- `DELETE /api/files/:id` - Delete file

### Statistics
- `GET /api/stats` - Get dashboard statistics

## Data Types

### NewsArticle
```typescript
{
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  image_caption?: string;
  video_url?: string;
  authors: Author[];
  category?: string;
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  rank?: number;
  sticky?: boolean;
  views?: number;
  createdAt: string;
  updatedAt: string;
}
```

### Author
```typescript
{
  id?: string;
  name: string;
  avatar?: string;
  email?: string;
  role?: string;
}
```

### FileItem
```typescript
{
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}
```

## UI Components

All reusable UI components are available from `@components`:

- `Alert` - Alert messages
- `Badge` - Small labels
- `Button` - Action buttons
- `Input` - Text input fields
- `TextArea` - Multi-line text input
- `LoadingSpinner` - Loading indicator
- `Card` - Card container
- `Modal` - Modal dialogs
- `Tabs` - Tab navigation
- `Skeleton` - Skeleton loader
- `NewsList` - Article table view
- `NewsCardPreview` - Article card preview
- `NewsEditor` - Article form editor
- `FileManager` - File management interface

## Custom Hooks

Available custom hooks in `@hooks`:

- `useModal()` - Manage modal open/close state
- `useLocalStorage<T>()` - Persist state to localStorage
- `useFetch<T>()` - Handle async data fetching
- `useDebounce<T>()` - Debounce values
- `useAsync<T>()` - Manage async operations

## Utility Functions

Available in `@utils/helpers`:

- `formatDate()` - Format date strings
- `formatFileSize()` - Format file size bytes
- `truncate()` - Truncate strings
- `slugify()` - Convert to URL slug
- `getFileIcon()` - Get emoji icon for file type
- `isImage()` / `isVideo()` - Type checking
- `generateId()` - Generate unique IDs
- `formatNumberCompact()` - Format numbers (10K, 1.2M)
- `getColorForStatus()` - Get Tailwind color classes
- `stripHtml()` - Remove HTML tags

## Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Collapsible sidebar on mobile
- Touch-friendly interface
- Optimized for tablets and desktops

## Performance Features

- Lazy loading of images and components
- Debounced search and filters
- Optimized re-renders with React.memo
- Efficient state management with Context API
- Code splitting with dynamic imports
- Browser caching enabled

## Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast compliance
- Semantic HTML structure
- Screen reader friendly

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Tips

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation item in `src/layouts/DashboardLayout.tsx`

### Adding New UI Components

1. Create component in `src/components/`
2. Export from `src/components/index.ts`
3. Use with `import { ComponentName } from '@components'`

### State Management

Use the `useDashboard()` hook to access global state:
```typescript
const { articles, loading, error, loadArticles } = useDashboard();
```

## Customization

### Colors
Edit `tailwind.config.js` to customize color scheme:
```javascript
colors: {
  primary: '#1e40af',
  secondary: '#7c3aed',
  // ...
}
```

### Fonts
Modify `src/index.css` or `tailwind.config.js` for font families.

### API Endpoint
Update API URL in `src/services/api.ts`:
```typescript
private baseUrl = 'YOUR_API_URL';
```

## License

Proprietary - Yatripati News Portal

## Support

For issues or questions, contact the development team.
