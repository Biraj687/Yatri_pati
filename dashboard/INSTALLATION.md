# Installation & Troubleshooting Guide

## Prerequisites

### System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Node.js**: Version 16.0.0 or higher
- **npm**: Version 7.0.0 or higher (or yarn/pnpm)
- **Browser**: Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- **Disk Space**: 500MB minimum
- **RAM**: 2GB minimum

### Check Prerequisites

```bash
# Check Node.js version
node --version  # Should be v16.0.0 or higher

# Check npm version
npm --version   # Should be 7.0.0 or higher

# Check git
git --version
```

## Installation Steps

### Step 1: Navigate to Dashboard Directory

```bash
cd d:\yatripati\dashboard

# Or on macOS/Linux:
cd ~/yatripati/dashboard
```

### Step 2: Install Dependencies

```bash
# Using npm (recommended)
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

Expected output:
```
added XXX packages in X.XXs
```

### Step 3: Verify Installation

```bash
# Check installed packages
npm list

# You should see react, react-dom, react-router-dom, etc.
```

### Step 4: Start Development Server

```bash
npm run dev
```

Expected output:
```
  VITE v7.3.1  ready in XXX ms

  ➜  Local:   http://localhost:5174/
  ➜  press h to show help
```

### Step 5: Open in Browser

Navigate to: `http://localhost:5174`

You should see the Yatripati Dashboard with a login-ready interface.

## Configuration

### API Configuration

If your API is not at `http://localhost:3000/api`, update it:

**Option 1: Using Environment Variables**

Create `.env.local`:

```
VITE_API_BASE_URL=http://your-api-domain.com/api
```

**Option 2: Update Code Directly**

Edit `src/services/api.ts`:

```typescript
private baseUrl = 'http://your-api-domain.com/api';
```

### Verify API Connection

1. Start the dashboard: `npm run dev`
2. Open browser DevTools: Press `F12`
3. Go to Console tab
4. Type: `fetch('http://localhost:3000/api/articles')`
5. If API is running, you'll get a response

## Building for Production

### Build Command

```bash
npm run build
```

**Output:**
```
dist/
├── assets/
│   ├── index-XXX.js      # JavaScript bundle
│   └── index-XXX.css     # CSS bundle
├── favicon.ico
└── index.html            # HTML entry point
```

### Preview Production Build

```bash
npm run preview
```

Opens preview at: `http://localhost:4173`

### Build Size Analysis

```bash
# Check build size
du -sh dist/

# Typical: 150-200KB (gzipped)
```

## Troubleshooting

### Issue: Dependencies Won't Install

**Symptom**: `npm install` fails or hangs

**Solutions**:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Try installing again with specific registry
npm install --registry https://registry.npmjs.org/

# If using corporate proxy
npm config set https-proxy [proxy-server-url]
```

### Issue: Port 5174 Already in Use

**Symptom**: Error "EADDRINUSE: address already in use :::5174"

**Solutions**:

```bash
# Use different port
npm run dev -- --port 5175

# Or kill process using port
# On Windows:
netstat -ano | findstr :5174
taskkill /PID [PID] /F

# On macOS/Linux:
lsof -ti:5174 | xargs kill -9
```

### Issue: API Connection Errors

**Symptom**: CORS errors, 404, connection refused

**Diagnoses**:

```bash
# Test API endpoint directly
curl http://localhost:3000/api/articles

# Check if API is running
curl -i http://localhost:3000

# Check network connectivity
ping localhost

# On Windows:
ping 127.0.0.1
```

**Solutions**:

1. Start the backend API server first
2. Verify API URL is correct in `.env.local`
3. Check CORS configuration on backend
4. Ensure API responds to GET requests
5. Check auth token in localStorage

### Issue: Build Fails with TypeScript Errors

**Symptom**: `npm run build` shows TypeScript errors

**Solutions**:

```bash
# Check TypeScript version
npx tsc --version

# Reinstall TypeScript
npm install --save-dev typescript@latest

# Clear build cache
rm -rf dist/

# Try building again
npm run build
```

### Issue: Blank White Screen on Load

**Symptoms**: Dashboard loads but shows nothing

**Diagnoses**:

1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Check if index.html loads correctly

**Solutions**:

```bash
# Ensure index.html exists
ls -la index.html

# Check if React is loaded
# In console: console.log(window.React)

# Rebuild
npm run build

# Try different port
npm run dev -- --port 5175
```

### Issue: Hot Module Replacement (HMR) Not Working

**Symptom**: Changes to files don't reflect in browser

**Solutions**:

```bash
# Restart dev server
# Press Ctrl+C to stop
npm run dev

# Check file paths are correct

# Clear browser cache
# Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)

# In vite.config.ts, add:
// server: {
//   hmr: {
//     host: 'localhost',
//     port: 5174,
//   }
// }
```

### Issue: Module Not Found Errors

**Symptom**: "Cannot find module '@components'" or similar

**Solutions**:

```bash
# Verify path aliases in tsconfig.json
cat tsconfig.json | grep -A 10 paths

# Ensure vite.config.ts has correct aliases
cat vite.config.ts

# Restart dev server
npm run dev

# Rebuild TypeScript
npx tsc --noEmit
```

### Issue: Performance is Very Slow

**Symptoms**: Dashboard loads slowly, laggy interactions

**Solutions**:

```bash
# Check dev server status
# Should see "ready in XXX ms"

# Disable browser extensions
# Especially ad blockers and React DevTools

# Check network speed
# DevTools > Network tab > check throttling

# Close unnecessary apps consuming RAM

# Restart dev server
npm run dev

# Check for large bundle
npm run build
```

### Issue: Components Not Loading

**Symptom**: Pages show errors referencing missing components or hooks

**Solutions**:

1. Check component is exported in `src/components/index.ts`
2. Verify import path is correct
3. Check component file exists
4. Verify function signature matches usage

```bash
# Search for component
grep -r "FunctionName" src/

# Check exports
grep "export" src/components/*.tsx
```

### Issue: Context Provider Errors

**Symptom**: "useDashboard must be used within DashboardProvider"

**Solutions**:

1. Ensure App is wrapped with `<DashboardProvider>`
2. Check `src/App.tsx` has provider wrapping
3. Verify no re-mounting of provider between calls

### Issue: localStorage Errors

**Symptom**: "localStorage is not defined"

**Solutions**:

```typescript
// Check if available first
if (typeof window !== 'undefined') {
  localStorage.setItem('key', 'value');
}

// Or in production build
// Make sure running in browser, not server
```

### Issue: Tailwind CSS Not Working

**Symptom**: No styling applied, components look unstyled

**Solutions**:

```bash
# Check postcss config exists
ls -la postcss.config.js

# Check tailwind config
ls -la tailwind.config.js

# Rebuild with Tailwind
npm run build

# Check CSS file is loaded
# DevTools > Elements > head > look for style tag
```

## Debugging

### Enable Debug Mode

Add to `src/main.tsx`:

```typescript
// Enable React DevTools
import { enableDebug } from './debug'; // Create this file
enableDebug();
```

### Browser DevTools

```javascript
// In console, check dashboard context
window.__DASHBOARD_STATE__ = { /* ... */ }

// Check API responses
fetch('http://localhost:3000/api/articles')
  .then(r => r.json())
  .then(d => console.table(d.data))
```

### View Source Code in Browser

1. Press F12 to open DevTools
2. Go to Sources tab
3. Find files under localhost:5174
4. Set breakpoints and debug

## Common Workflows

### Adding a New Component

1. Create component in `src/components/`
2. Export from `src/components/index.ts`
3. Import in page: `import { MyComponent } from '@components'`
4. Use in JSX: `<MyComponent />`

### Adding a New Page

1. Create in `src/pages/ComponentName.tsx`
2. Add route in `src/App.tsx`
3. Add menu item in `src/layouts/DashboardLayout.tsx`

### Testing API Endpoints

```bash
# Using curl
curl -X GET http://localhost:3000/api/articles

# With auth header
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/articles

# POST request
curl -X POST http://localhost:3000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Test article"}'
```

### Updating Dependencies

```bash
# Check for updates
npm outdated

# Update all
npm update

# Update specific
npm install package-name@latest

# Test after update
npm run build

# Commit changes
git add package.json package-lock.json
git commit -m "Update dependencies"
```

## Performance Tips

### Optimize Build

```bash
# Analyze bundle size
npm run build
# Check dist/ folder size

# Use production build in browser
npm run preview

# Enable compression
# In nginx: gzip on;
```

### Optimize Development

```bash
# Run with specific features only
npm run dev

# Use React DevTools extension (Chrome, Firefox)
# Download from browser extension store
```

### Monitor Performance

In DevTools:
1. Lighthouse tab > Generate report
2. Performance tab > Record and analyze
3. Network tab > Check request sizes
4. Memory tab > Check for leaks

## Getting Help

### Check Logs

```bash
# Development server logs
# Check terminal output

# Browser console
# Press F12 > Console tab

# Network requests
# Press F12 > Network tab
```

### Common Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### Report Issues

When reporting issues, include:

```
- Node.js version (node --version)
- npm version (npm --version)
- Operating system
- Browser and version
- Steps to reproduce
- Error messages (from console)
- Screenshots if applicable
```

## Development Standards

### Code Style

- Use TypeScript types everywhere
- Use functional components only
- Use React hooks, no class components
- Follow naming conventions:
  - Components: `PascalCase`
  - Functions: `camelCase`
  - Styles: `kebab-case`
  - Constants: `UPPER_SNAKE_CASE`

### Commit Messages

```bash
git commit -m "feat: add new feature"
git commit -m "fix: fix bug in component"
git commit -m "style: update CSS"
git commit -m "docs: update README"
git commit -m "refactor: improve code quality"
```

### Before Committing

```bash
# Check code
npm run lint

# Build
npm run build

# No errors should appear

# Then commit
git add .
git commit -m "Your message"
git push
```

## System Cleanup

### Free Up Space

```bash
# Remove node_modules
rm -rf node_modules

# Clear npm cache
npm cache clean --force

# Remove build artifacts
rm -rf dist/

# Remove OS files (macOS)
find . -name ".DS_Store" -delete
```

### Reset to Fresh state

```bash
# Remove everything except source
rm -rf node_modules package-lock.json dist/

# Reinstall
npm install

# Fresh start
npm run dev
```

## Next Steps

After successful installation:

1. ✅ Verify all features work
2. ✅ Configure your API endpoint
3. ✅ Test article creation and editing
4. ✅ Test file uploads
5. ✅ Build for production
6. ✅ Deploy to your server

See other documentation files:
- `README.md` - Project overview
- `FEATURES.md` - Feature documentation
- `API_SETUP.md` - Backend API setup
- `DEPLOYMENT.md` - Deployment instructions
