# 🚀 Quick Start Guide - YatriPati News Portal

## Installation & Setup

### Step 1: Install Dependencies
```bash
npm install
```

This will install all required packages including:
- React 19
- react-icons (icon library)
- tailwindcss (CSS framework)
- TypeScript (type safety)

### Step 2: Start Development Server
```bash
npm run dev
```

The application will be available at: `http://localhost:5173`

### Step 3: Open in Browser
Navigate to `http://localhost:5173` and you'll see:
- Top bar with Nepali date and social icons
- Main header with logo and navigation menu
- Breaking news banner
- Main content area
- Footer

## 🎮 Using the Application

### Dark Mode Toggle
Click the moon/sun icon in the top-right corner to toggle dark mode.

### Mobile Menu
On mobile devices (< 768px), the navigation menu converts to a hamburger menu. Click the hamburger icon to reveal the menu.

### Social Media Icons
Click any social media icon in the top bar to visit (URLs need to be configured).

### Search Button
Click the magnifying glass icon to trigger a search (functionality needs to be implemented).

## 📁 Key Files to Explore

1. **`src/components/TopBar.tsx`** - Top bar with date and social icons
2. **`src/components/Navbar.tsx`** - Main navigation with logo and menu
3. **`src/components/Header.tsx`** - Combined header component
4. **`src/App.tsx`** - Main application component
5. **`src/App.css`** - Custom styles
6. **`tailwind.config.js`** - Tailwind configuration

## 🎨 Customization

### Change Logo Text
Edit `Navbar.tsx` line 31-32:
```tsx
<h1 className="...">यात्री</h1>
<p className="...">पाती</p>
```

### Change Breaking News
Edit `TopBar.tsx` line 9:
```tsx
const nepaliDate = '११ चैत्र २०८२, बुधबार'
```

### Update Navigation Items
Edit `Navbar.tsx` lines 11-20:
```tsx
const navItems = [
  { label: 'होमपेज', href: '/' },
  // Change or add items here
]
```

### Change Social Media Links
Edit `TopBar.tsx` lines 26-52:
```tsx
<a href="your-facebook-link" ...>
<a href="your-instagram-link" ...>
// etc.
```

## 🌐 Build for Production

### Build
```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

This serves the production build locally to test.

## 🔧 Troubleshooting

### Port 5173 is already in use
```bash
npm run dev -- --port 3000
```

### Dependencies not installing
```bash
rm -rf node_modules package-lock.json
npm install
```

### Tailwind not working
Make sure you've run `npm install` and the dev server has restarted.

### React Icons not showing
Ensure `react-icons` is installed:
```bash
npm install react-icons
```

## 📱 Responsive Testing

Test on different screen sizes:
- **Mobile** (< 640px): Hamburger menu, single column
- **Tablet** (640px - 1024px): Partial navigation
- **Desktop** (> 1024px): Full layout with all features

Use browser DevTools (F12) to test responsive views.

## 🎯 Next Steps

1. Implement search functionality
2. Add dark mode persistence (localStorage)
3. Create category pages
4. Build article detail pages
5. Add comment system
6. Integrate with backend API

## 📞 Help & Support

For more information, see `COMPONENT_GUIDE.md` in the project root.

---

**Happy coding with YatriPati!** 📰✨
