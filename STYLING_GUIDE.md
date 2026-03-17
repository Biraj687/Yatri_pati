# 🎨 Styling Guide - YatriPati

## Overview

YatriPati uses **Tailwind CSS** as the primary styling framework with custom CSS for specific enhancements. This guide explains all styling decisions and utilities used.

## 📚 Tailwind CSS Fundamentals

Tailwind provides utility classes for:
- Layout (flexbox, grid)
- Spacing (padding, margin)
- Colors (text, background, border)
- Typography (font size, weight)
- Effects (shadows, transitions)
- Responsive design (breakpoints)

## 🎯 Color System

### Primary Colors
| Class | Color | Usage |
|-------|-------|-------|
| `text-red-600` | #DC143C | Hover states, accents |
| `text-gray-700` | #374151 | Default text and icons |
| `bg-gray-100` | #F3F4F6 | Top bar background |
| `bg-white` | #FFFFFF | Main backgrounds |

### Dark Mode Colors
| Class | Color | Usage |
|-------|-------|-------|
| `dark:bg-gray-900` | #111827 | Dark background |
| `dark:text-white` | #FFFFFF | Dark mode text |
| `dark:text-gray-400` | #9CA3AF | Dark mode secondary text |
| `dark:border-gray-700` | #374151 | Dark mode borders |

## 📐 Responsive Design

### Breakpoints
```
sm: 640px   - Small devices
md: 768px   - Tablets
lg: 1024px  - Large tablets/small desktops
xl: 1280px  - Desktops
2xl: 1536px - Large desktops
```

### Usage Examples
```tsx
// Hide on mobile, show on desktop
<div className="hidden lg:flex">...</div>

// Different text size by device
<p className="text-xs sm:text-sm md:text-base">...</p>

// Responsive spacing
<div className="px-4 md:px-6 lg:px-8">...</div>
```

## 🎨 Component Styling

### TopBar Component

```tsx
<div className="bg-gray-100 border-b border-gray-300">
```
- Light gray background with bottom border
- Creates visual separation from main navbar

**Responsive Text**
```tsx
<div className="text-xs sm:text-sm text-gray-700">
```
- Extra small on mobile (12px)
- Small on tablet+ (14px)
- Neutral gray color

**Social Icons**
```tsx
className="text-gray-700 hover:text-red-600 transition-colors duration-200"
```
- Default: gray-700
- Hover: red-600 (brand color)
- Smooth 200ms transition

### Navbar Component

**Container Styling**
```tsx
className="sticky top-0 z-40 bg-white border-b border-gray-300"
```
- `sticky` - Stays at top while scrolling
- `top-0` - Position from top
- `z-40` - Stack above other elements
- Border separates from content

**Logo Section**
```tsx
<div className="flex items-center space-x-2">
```
- `flex` - Flexbox layout
- `items-center` - Vertical center alignment
- `space-x-2` - 8px horizontal spacing

**Navigation Links**
```tsx
className="px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-red-600"
```
- `px-3 py-2` - 12px horizontal, 8px vertical padding
- `text-sm` - 14px font size
- `font-medium` - 500 weight
- `border-b-2` - 2px bottom border
- `border-transparent` - Initially transparent
- `hover:border-red-600` - Red on hover
- Transition applied globally in index.css

**Mobile Menu Dropdown**
```tsx
className="lg:hidden border-t border-gray-300 py-4"
```
- `lg:hidden` - Hidden on desktop
- Border-top separates from header
- Proper vertical spacing

### Dark Mode Styling

All components support dark mode using Tailwind's `dark:` prefix:

```tsx
className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'}`}
```

Or using conditional rendering:
```tsx
className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
```

## 🔧 Custom CSS

Located in `App.css` and `index.css`:

### Tailwind Directives
```css
@tailwind base;      /* Reset and defaults */
@tailwind components; /* Component classes */
@tailwind utilities; /* Utility classes */
```

### Custom Utilities
```css
@layer components {
  .container {
    @apply max-w-7xl;
  }
}
```

Adds custom `.container` class with max-width constraint.

### Animations
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
```

## 📝 Typography

### Font Family
```tsx
className="font-sans"
```

Configured in `tailwind.config.js`:
- Primary: 'Noto Sans Devanagari' (Nepali support)
- Fallback: system fonts

### Font Sizes
| Class | Size | Usage |
|-------|------|-------|
| `text-xs` | 12px | Small secondary text |
| `text-sm` | 14px | Top bar, labels |
| `text-base` | 16px | Body text |
| `text-lg` | 18px | Section headings |
| `text-xl` | 20px | Subheadings |
| `text-2xl` | 24px | Page titles |

### Font Weights
| Class | Weight | Usage |
|-------|--------|-------|
| `font-normal` | 400 | Regular text |
| `font-medium` | 500 | Navigation items |
| `font-semibold` | 600 | Subheadings |
| `font-bold` | 700 | Headings |

## 🎭 Transitions & Effects

### Smooth Transitions
```css
* {
  @apply transition-colors duration-200;
}
```

Global transition on color changes (200ms duration).

### Individual Transitions
```tsx
className="transition-colors duration-200 hover:text-red-600"
```

### Hover Effects
```tsx
// Icon hover
className="hover:text-red-600"

// Button hover
className="hover:bg-gray-100"

// Border hover
className="hover:border-red-600"
```

## 🎯 Spacing System

### Padding & Margin
```
0 - 0px
1 - 4px
2 - 8px
3 - 12px
4 - 16px
6 - 24px
8 - 32px
```

### Usage
```tsx
// Padding on all sides
<div className="p-4">...</div>

// Horizontal & vertical
<div className="px-4 py-2">...</div>

// Responsive
<div className="px-4 md:px-6 lg:px-8">...</div>

// Gap between items
<div className="space-x-3">...</div> <!-- 12px between items -->
```

## 🔌 Flexbox Utilities

### Container Setup
```tsx
<div className="flex items-center justify-between">
```

- `flex` - Enable flexbox
- `items-center` - Vertical center
- `justify-between` - Space items apart horizontally

### Common Patterns
```tsx
// Centered content
<div className="flex items-center justify-center">...</div>

// Horizontal spacing
<div className="flex space-x-3">...</div>

// Vertical stack
<div className="flex flex-col space-y-2">...</div>

// Wrap on mobile
<div className="flex flex-wrap">...</div>
```

## ♿ Accessibility

### Focus Visible
```css
button:focus-visible,
a:focus-visible {
  @apply outline-2 outline-offset-2 outline-red-600;
}
```

Red outline on focus for keyboard navigation.

### Semantic HTML
```tsx
<header>...</header>
<nav>...</nav>
<main>...</main>
<footer>...</footer>
```

### ARIA Labels
```tsx
<button aria-label="Toggle menu">
  <FiMenu />
</button>
```

## 🎬 Performance Optimizations

### Tree Shaking
Only used Tailwind utilities are included in production.

### CSS Purging
Configure in `tailwind.config.js`:
```js
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
]
```

### Bundle Size
- Development: ~200KB (with debug info)
- Production (gzipped): ~50KB

## 📱 Mobile-First Approach

All layouts start mobile-optimized, then enhance for larger screens:

```tsx
{/* Mobile: single column */}
<div className="grid gap-4">

{/* Tablet+: two columns */}
<div className="md:grid md:grid-cols-2 gap-4">

{/* Desktop: three columns */}
<div className="md:grid-cols-2 lg:grid-cols-3 gap-4">
</div>
```

## 🔄 Dark Mode Implementation

### Global Setup
In `App.tsx`:
```tsx
const [darkMode, setDarkMode] = useState(false)

document.documentElement.classList.toggle('dark')
```

### Component Usage
```tsx
className={`${darkMode ? 'bg-gray-900' : 'bg-white'}`}
```

Or with Tailwind's dark mode utilities:
```tsx
className="bg-white dark:bg-gray-900"
```

## 📊 Debugging

### Visual Debugging
Use browser DevTools to:
1. Inspect elements
2. Check computed Tailwind classes
3. Test responsive breakpoints
4. Debug color values

### Common Issues

**Classes not applying?**
- Clear DevTools cache (Ctrl+Shift+R)
- Restart dev server
- Check for typos in class names

**Responsive not working?**
- Use mobile DevTools
- Check breakpoint syntax (e.g., `md:`)
- Verify responsive settings in config

**Dark mode not updating?**
- Check if `dark` class is on html element
- Verify conditional rendering in components

## 🎓 Best Practices

1. **Use responsive utilities** - Don't hardcode breakpoints
2. **Avoid inline styles** - Use Tailwind classes
3. **Group related utilities** - Keep related properties together
4. **Use semantic colors** - red-600 instead of hardcoding #DC143C
5. **Keep transitions smooth** - 200-300ms duration
6. **Test accessibility** - Keyboard navigation and screen readers
7. **Mobile first** - Start with mobile, enhance for desktop
8. **Consistent spacing** - Use Tailwind spacing scale

---

**Tailwind CSS Documentation**: https://tailwindcss.com
**Responsive Design Guide**: https://tailwindcss.com/docs/responsive-design
