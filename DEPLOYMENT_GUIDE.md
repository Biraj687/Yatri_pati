# Yatripati Vercel Deployment Guide

## Overview

Your Yatripati project now has a complete setup for deploying both the main website and the dashboard on Vercel with proper routing configuration.

## Project Structure

```
yatripati/
├── src/                    # Main website source files
├── dashboard/              # Dashboard app source files
├── dist/                   # Production build (generated)
│   ├── index.html         # Main app entry point
│   ├── assets/            # Main app assets
│   └── dashboard/         # Dashboard app (copied here during build)
│       ├── index.html     # Dashboard entry point
│       └── assets/        # Dashboard assets
├── package.json           # Main app package.json
├── dashboard/package.json # Dashboard package.json
├── vite.config.ts         # Main Vite config
├── vercel.json           # Vercel deployment config (NEW)
└── build-all.js          # Combined build script (NEW)
```

## What Was Fixed

### 1. **Vercel Configuration** (`vercel.json`)
- Added `buildCommand: "npm run build-all"` to build both apps
- Added rewrites for client-side routing:
  - `/dashboard/*` routes to `/dashboard/index.html`
  - All other non-file requests route to `/index.html`
- Configured caching headers for assets

### 2. **Build Process** (`build-all.js`)
- Builds main app first: `npm run build`
- Builds dashboard second: `npm --prefix dashboard run build`
- Copies dashboard build to `dist/dashboard/`
- Result: Single `dist/` folder ready for Vercel

### 3. **Dashboard Routing** 
- Dashboard uses `basename="/dashboard"` in React Router
- This allows proper route resolution when served from `/dashboard` path
- Works both standalone (port 5174) and integrated (via Vercel)

### 4. **Main Build Scripts**
- `npm run build` - Builds main app only
- `npm run build-all` - Builds both main and dashboard (used by Vercel)
- `npm run dev` - Runs main app dev server


## Step-by-Step Deployment Instructions

### 1. Verify Local Build Works

```bash
# From project root (d:\yatripati)
npm install
npm run build-all
```

Check that `dist/` folder contains:
- `index.html` (main app)
- `dist/dashboard/index.html` (dashboard app)
- `assets/` folders for both

### 2. Push to GitHub

```bash
cd d:\yatripati

# Stage all changes
git add .

# Commit your changes
git commit -m "fix: add Vercel routing config and dashboard integration

- Add vercel.json with proper rewrites for SPA routing
- Add build-all.js script for combined builds
- Update dashboard app to use basename for nested routing
- Fix TypeScript compilation errors
- Setup dashboard to run at /dashboard path on Vercel"

# Push to GitHub (adjust 'main' if using different branch)
git push origin main
```

### 3. Connect to Vercel (First Time Only)

If not already connected:

1. Go to https://vercel.com
2. Sign in or create account
3. Click "Add New..." → "Project"
4. Select your GitHub repository (yatripati)
5. Vercel should automatically detect the configuration

### 4. Configure Vercel Project Settings

Vercel will auto-detect from `vercel.json`, but verify:

**Build & Output Settings:**
- Build Command: `npm run build-all`
- Output Directory: `dist`
- Install Command: `npm install`

**Environment Variables** (if needed):
- `VITE_API_URL`: Your API backend URL
- `VITE_ENV`: `production`

### 5. Deploy

Push your changes and Vercel will automatically:
1. Detect the push to main branch
2. Run `npm run build-all`
3. Copy `dist/` to Vercel CDN
4. Apply the rewrites from `vercel.json`
5. Deploy within 1-2 minutes

### 6. Verify Deployment

Once deployed, test these URLs on your Vercel domain:

- `https://your-vercel-app.vercel.app/` - Main homepage ✓
- `https://your-vercel-app.vercel.app/dashboard` - Dashboard home ✓
- `https://your-vercel-app.vercel.app/dashboard/news` - News management ✓
- `https://your-vercel-app.vercel.app/dashboard/files` - File manager ✓
- `https://your-vercel-app.vercel.app/dashboard/analytics` - Analytics ✓
- `https://your-vercel-app.vercel.app/dashboard/settings` - Settings ✓
- `https://your-vercel-app.vercel.app/news/[id]` - Article detail ✓
- `https://your-vercel-app.vercel.app/category/[slug]` - Category pages ✓

All routes should work without 404 errors.

## Troubleshooting

### Issue: Still Getting 404 on /dashboard

**Solution:** 
1. Verify `vercel.json` exists in project root
2. Check vercel.json was committed and pushed to GitHub
3. Trigger a redeploy: Go to Vercel dashboard → Project → Deployments → Redeploy

### Issue: Dashboard shows but routing doesn't work inside dashboard

**Solution:**
1. Check browser console for errors
2. Verify React Router is loading at `/dashboard` path
3. Check that `basename="/dashboard"` is set in dashboard App.tsx

### Issue: Assets not loading (CSS/JS files)

**Solution:**
1. Verify `dist/` folder structure is correct
2. Check Asset paths: should be `/assets/...` not relative paths
3. In Vercel logs, check for 404 errors on asset requests

### Issue: Old version cached on Vercel

**Solution:**
1. Go to Vercel dashboard → Project → Settings → Git
2. Click "Clear Build Cache"
3. Trigger a redeploy

## Files Changed/Created

### New Files:
- `vercel.json` - Vercel routing and deployment config
- `build-all.js` - Combined build script
- `dashboard/src/index.ts` - Re-export App component

### Modified Files:
- `package.json` - Added build-all script
- `vite.config.ts` - Added @dashboard alias
- `tsconfig.app.json` - Added dashboard paths
- `dashboard/src/App.tsx` - Added basename="/dashboard"
- `dashboard/src/main.tsx` - Fixed App import
- `src/components/NewsSection.tsx` - Fixed TypeScript errors
- `src/pages/ArticleDetail.tsx` - Fixed unused imports

## Development Workflow

**For local development:**

```bash
# Terminal 1: Main app dev server (port 3000)
npm run dev

# Terminal 2: Dashboard dev server (separate, port 5174)
cd dashboard
npm run dev
```

Access:
- Main app: http://localhost:3000
- Dashboard: http://localhost:5174

**For production testing locally:**

```bash
npm run build-all
npm run preview
```

This serves the production build locally.

## Monitoring & Logs

In Vercel dashboard:

1. **Deployments** tab: See build history and logs
2. **Analytics** tab: Monitor traffic and performance
3. **Functions** tab: View serverless function logs (if used)

Click any deployment to see:
- Build output logs
- Full build command output
- Error messages if build failed

## Performance Optimization

The current setup includes:

- ✅ Code splitting (lazy loading for pages)
- ✅ Asset caching headers (immutable for versioned assets)
- ✅ Gzip compression
- ✅ Tree-shaking and minification

Additional optimizations available:

- Add image optimization: Configure Vercel Image Optimization
- Add analytics: Vercel Web Analytics Dashboard
- Monitor Core Web Vitals: Built into Vercel Analytics

## Rollback Strategy

If something goes wrong after deployment:

1. Go to Vercel dashboard → Deployments
2. Find the most recent successful deployment
3. Click the "..." menu → "Promote to Production"
4. This instantly rolls back to that version

## Next Steps

1. **Push to GitHub** (see Step 2 above)
2. **Verify Vercel is connected** to your repository
3. **Check deployment** is successful (should be automatic)
4. **Test all routes** on the live Vercel app
5. **Set custom domain** if you have one (Vercel settings)

## Support

If you encounter any issues:

1. **Check Vercel logs**: Dashboard → Deployments → Click failed build
2. **Verify vercel.json**: Make sure file is in root of repository
3. **Check GitHub connection**: Vercel should auto-sync on push
4. **Clear Vercel cache**: Settings → Git → Clear Build Cache

## Technical Details

### How Routing Works

**Vercel rewrites:**
1. Request for `/dashboard` comes in
2. Vercel checks `vercel.json` rewrites
3. Matches `/dashboard/:path*` pattern
4. Rewrites to `/dashboard/index.html`
5. Browser HTTP response is 200 (not 404)
6. React Router in dashboard/index.html loads and handles routing

**Inside dashboard app:**
- React Router with `basename="/dashboard"`
- Routes defined: `/`, `/news`, `/files`, `/analytics`, `/settings`  
- Full paths become: `/dashboard/`, `/dashboard/news`, etc.
- Browser URL and router state stay in sync

### Why Two Apps?

**Kept separate because:**
1. Independent development cycles
2. Dashboard can scale independently
3. Separate concerns (content site vs admin tool)
4. Different dependencies and build characteristics
5. Easier to maintain and update separately

**Combined for deployment because:**
1. Vercel works best with single `dist/` output
2. Single deployment simplifies management
3. Both apps share same domain
4. CSP headers and cookies work consistently

