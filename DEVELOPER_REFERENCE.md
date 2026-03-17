# 📖 Developer's Quick Reference - YatriPati

Quick reference for common development tasks and code snippets.

## 🚀 Project Commands

```bash
# Install dependencies
npm install

# Start development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Install a new package
npm install package-name
```

## 📂 Project Structure

```
yatripati/
├── src/
│   ├── components/          # React components
│   │   ├── TopBar.tsx       # Top bar (date, news, social)
│   │   ├── Navbar.tsx       # Main navigation
│   │   ├── Header.tsx       # Combined header
│   │   └── index.ts         # Component exports
│   ├── App.tsx              # Main component
│   ├── App.css              # App styles
│   ├── index.css            # Global styles
│   └── main.tsx             # React entry point
├── public/                  # Static assets
├── index.html               # HTML template
├── tailwind.config.js       # Tailwind config
├── postcss.config.js        # PostCSS config
├── vite.config.ts           # Vite config
├── package.json             # Dependencies
└── README.md                # Documentation
```

## 🎯 Core Components Usage

### Header (Main Component)
```tsx
import { Header } from './components'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const handleToggle = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return <Header darkMode={darkMode} onDarkModeToggle={handleToggle} />
}
```

### TopBar
```tsx
import { TopBar } from './components'

// Standalone usage
<TopBar />

// Features: Nepali date, breaking news, social icons
```

### Navbar
```tsx
import { Navbar } from './components'

<Navbar 
  darkMode={darkMode} 
  onDarkModeToggle={handleToggle} 
/>

// Features: Logo, navigation menu, search, dark mode toggle
```

## 🎨 Common Tailwind Patterns

### Responsive Layout
```tsx
{/* Show on mobile, hide on desktop */}
<div className="lg:hidden">Mobile Menu</div>

{/* Hide on mobile, show on desktop */}
<div className="hidden lg:block">Desktop Menu</div>

{/* Responsive padding */}
<div className="px-4 md:px-6 lg:px-8">Content</div>

{/* Responsive grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Items */}
</div>
```

### Flexbox Layout
```tsx
{/* Center content */}
<div className="flex items-center justify-center">Content</div>

{/* Space between items */}
<div className="flex items-center justify-between">
  <div>Left</div>
  <div>Right</div>
</div>

{/* With spacing between children */}
<div className="flex items-center space-x-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

{/* Vertical stack */}
<div className="flex flex-col space-y-2">
  <div>Row 1</div>
  <div>Row 2</div>
  <div>Row 3</div>
</div>
```

### Dark Mode
```tsx
{/* Tailwind approach */}
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content
</div>

{/* Conditional approach */}
<div className={darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}>
  Content
</div>
```

### Hover & Transitions
```tsx
{/* Simple hover */}
<button className="text-gray-700 hover:text-red-600">Button</button>

{/* With transition */}
<a className="transition-colors duration-200 hover:text-red-600">
  Link
</a>

{/* Background hover */}
<button className="bg-white hover:bg-gray-100 transition-colors duration-200">
  Button
</button>

{/* Multiple transitions */}
<div className="hover:bg-gray-100 hover:shadow-lg transition-all duration-300">
  Content
</div>
```

### Typography
```tsx
{/* Responsive text sizes */}
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Title</h1>

{/* Font variations */}
<p className="text-sm font-medium">Medium text</p>
<p className="text-base font-semibold">Semibold text</p>
<p className="text-lg font-bold">Bold text</p>

{/* Text colors */}
<p className="text-gray-700">Default text</p>
<p className="text-red-600">Red text</p>
<p className="dark:text-white">Dark mode text</p>
```

### Spacing
```tsx
{/* Padding variants */}
<div className="p-4">All sides (16px)</div>
<div className="px-4 py-2">Horizontal 16px, Vertical 8px</div>
<div className="pt-4 pb-8">Top 16px, Bottom 32px</div>

{/* Margin variants */}
<div className="m-4">All sides</div>
<div className="mx-auto">Horizontal auto (center)</div>

{/* Gap between items */}
<div className="space-x-4">Horizontal 16px between items</div>
<div className="space-y-2">Vertical 8px between items</div>
```

## 🎭 Icon Usage (react-icons)

```tsx
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'
import { FiSearch, FiMenu, FiX } from 'react-icons/fi'
import { BsMoon, BsSun } from 'react-icons/bs'
import { GiAirplane } from 'react-icons/gi'

// Using icons
<FaFacebook className="w-4 h-4" />
<FiSearch className="w-5 h-5" />
<BsMoon className="w-6 h-6" />

// With click handler
<button onClick={handleClick}>
  <FiMenu className="w-6 h-6" />
</button>

// Sizes
className="w-4 h-4"   {/* 16px */}
className="w-5 h-5"   {/* 20px */}
className="w-6 h-6"   {/* 24px */}

// Colors
className="text-gray-700"
className="hover:text-red-600"
className="dark:text-white"
```

## 🔧 Customization Snippets

### Add New Navigation Item
```tsx
// In Navbar.tsx, modify navItems array:
const navItems = [
  { label: 'होमपेज', href: '/' },
  { label: 'प्रदेश', href: '/pradesh' },
  { label: 'नयाँ सेक्शन', href: '/new-section' }, // New item
]
```

### Change Color Scheme
```tsx
// In tailwind.config.js
theme: {
  extend: {
    colors: {
      'primary': '#your-color',
    }
  }
}

// Usage
className="text-primary hover:text-primary-dark"
```

### Add New Font
```tsx
// In index.html
<link href="https://fonts.googleapis.com/..." rel="stylesheet" />

// In tailwind.config.js
fontFamily: {
  sans: ['Your Font', 'fallback'],
}
```

### Update Social Links
```tsx
// In TopBar.tsx
const socialLinks = [
  { icon: FaFacebook, url: 'https://facebook.com/yourpage' },
  { icon: FaInstagram, url: 'https://instagram.com/yourpage' },
  { icon: FaTwitter, url: 'https://twitter.com/yourpage' },
  { icon: FaYoutube, url: 'https://youtube.com/yourpage' },
]

{socialLinks.map((social) => (
  <a href={social.url} key={social.url} target="_blank">
    <social.icon className="w-4 h-4" />
  </a>
))}
```

## 🐛 Common Issues & Solutions

### Issue: Tailwind classes not working
```bash
# Solution: Restart dev server
npm run dev

# Clear node_modules if needed
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: Dark mode not toggling
```tsx
// Ensure classList toggle in App.tsx
document.documentElement.classList.toggle('dark')
```

### Issue: Icons not appearing
```bash
# Install react-icons
npm install react-icons

# Verify import path
import { IconName } from 'react-icons/fa' // correct
// NOT: import IconName from 'react-icons/fa/IconName'
```

### Issue: Responsive not working
```tsx
// Wrong - missing breakpoint prefix
className="flex md:grid"

// Correct
className="flex md:grid"

// Check config has breakpoints defined
// They should match mobile-first approach
```

## 📊 Performance Tips

### Image Optimization
```tsx
<img 
  src="image.jpg" 
  alt="Description"
  loading="lazy"
  width="100"
  height="100"
/>
```

### Code Splitting
```tsx
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

<Suspense fallback={<div>Loading...</div>}>
  <HeavyComponent />
</Suspense>
```

### Memoization (prevent re-renders)
```tsx
import { memo } from 'react'

const MemoizedComponent = memo(function Component(props) {
  return <div>{props.data}</div>
})

export default MemoizedComponent
```

## 🧪 Testing Checklist

Before deploying, verify:
- [ ] All navigation links work
- [ ] Dark mode toggles correctly
- [ ] Mobile menu opens/closes
- [ ] Social icons appear and link correctly
- [ ] Hover effects work on desktop
- [ ] Icons display properly on all devices
- [ ] No console errors
- [ ] Responsive design at all breakpoints
- [ ] Accessibility: keyboard navigation works
- [ ] Performance: page loads fast

## 📚 Useful Resources

**Tailwind CSS**
- Docs: https://tailwindcss.com/docs
- Components: https://tailwindui.com
- Color Tool: https://tailwindcolor.com

**React**
- Docs: https://react.dev
- Hooks Guide: https://react.dev/reference/react

**Icons**
- react-icons: https://react-icons.github.io/react-icons
- Icon Sets: Font Awesome, Feather, Bootstrap Icons

**Tools**
- VS Code: https://code.visualstudio.com
- Tailwind CSS IntelliSense: VS Code Extension
- Prettier: Auto-formatter

## 🎯 Git Workflow

```bash
# Clone/start project
git init
git add .
git commit -m "Initial commit"

# Create feature branch
git checkout -b feature/navbar-update

# Make changes, then commit
git add .
git commit -m "Update navbar styling"

# Push to repository
git push origin feature/navbar-update

# Create pull request on GitHub
```

## 💾 File Templates

### New Component Template
```tsx
import { ReactNode } from 'react'

interface ComponentNameProps {
  children?: ReactNode
  className?: string
}

export function ComponentName({ 
  children, 
  className = '' 
}: ComponentNameProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}
```

### New Hook Template
```tsx
import { useState, useEffect } from 'react'

export function useHookName(initialValue: string) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    // Effect logic
  }, [value])

  return { value, setValue }
}
```

## 🎓 Learning Path

1. **Basics** - Understand React components and JSX
2. **Styling** - Learn Tailwind CSS utilities
3. **Responsive** - Master responsive design patterns
4. **Interactivity** - Add state and event handlers
5. **Performance** - Optimize rerenders and bundle size
6. **Advanced** - Context, custom hooks, error boundaries

---

**Last Updated**: March 2024
**For Issues**: Open GitHub issue or contact development team
