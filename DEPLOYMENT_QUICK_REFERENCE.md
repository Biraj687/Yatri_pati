# Quick Reference: Yatripati Dashboard Vercel Deployment

## TL;DR - Get Dashboard Working on Vercel

### Local Verification (Run Once)
```bash
cd d:\yatripati
npm install
npm run build-all
# Should complete without errors
```

### Push to Vercel
```bash
git add .
git commit -m "feat: fix Vercel routing for dashboard at /dashboard"
git push origin main
# Vercel auto-deploys - wait 1-2 minutes
```

### Verify Deployment
Open your Vercel app URL and test:
- https://your-app.vercel.app/ ✓ Main site
- https://your-app.vercel.app/dashboard ✓ Dashboard
- https://your-app.vercel.app/dashboard/news ✓ Works!

---

## Key Files & What They Do

| File | Purpose |
|------|---------|
| `vercel.json` | Tells Vercel how to route requests properly |
| `build-all.js` | Builds main site AND dashboard together |
| `dashboard/src/App.tsx` | Dashboard with `basename="/dashboard"` |
| `dist/dashboard/` | Where dashboard build goes (auto-created) |

---

## Commands Reference

| Command | What It Does |
|---------|-------------|
| `npm run build-all` | Builds both main + dashboard (Vercel uses this) |
| `npm run build` | Builds just main site |
| `npm run dev` | Dev server for main site (port 3000) |
| `cd dashboard && npm run dev` | Dev server for dashboard (port 5174) |
| `npm run preview` | Preview production build locally |

---

## Architecture

```
Vercel Request: GET https://app.vercel.app/dashboard/news
         ↓
    vercel.json rewrites to /dashboard/index.html
         ↓
    Loads dist/dashboard/index.html
         ↓
    React Router with basename="/dashboard"
         ↓
    Routes to /news component
         ↓
    User sees dashboard news page ✓
```

---

## Troubleshooting Checklist

1. **Build fails locally?**
   ```bash
   npm run build-all
   # Check for TypeScript errors
   ```

2. **Still 404 on /dashboard in Vercel?**
   - Verify `vercel.json` exists in repo root
   - Check file was pushed: `git log --oneline`
   - Redeploy in Vercel dashboard → Settings → Git → Clear Cache

3. **Dashboard loads but routing broken?**
   - Check browser DevTools Console for errors
   - Verify `dashboard/src/App.tsx` has `basename="/dashboard"`

4. **CSS/JS not loading?**
   - Check `dist/` folder has both main assets and `dashboard/assets/`
   - Verify asset paths in built index.html files

---

## One-Time Setup (If Starting Fresh)

1. **Install dependencies**
   ```bash
   npm install
   cd dashboard && npm install && cd ..
   ```

2. **Connect to Vercel**
   - Go to vercel.com
   - Import GitHub repository
   - Vercel auto-detects vercel.json config

3. **Verify build works**
   ```bash
   npm run build-all
   ```

4. **Push to GitHub**
   ```bash
   git add .
   git commit -m "chore: setup Vercel deployment"
   git push origin main
   ```

5. **Wait for auto-deploy** (1-2 minutes on Vercel)

6. **Test routes** on your Vercel domain

---

## File Structure After Build

```
dist/
├── index.html              ← Served as main site
├── assets/
│   ├── js/
│   │   ├── index-XXX.js    ← Main app JS
│   │   └── ...
│   ├── css/
│   │   └── index-XXX.css   ← Main app CSS
│   └── ...
└── dashboard/              ← Copied from dashboard/dist/
    ├── index.html          ← Served when accessing /dashboard
    └── assets/
        ├── js/
        │   └── index-XXX.js ← Dashboard JS
        ├── css/
        │   └── index-XXX.css ← Dashboard CSS
        └── ...
```

---

## Deployment Flow

```
git push → GitHub → Vercel webhook →
  npm run build-all →
    npm run build →
      tsc -b && vite build (produces dist/)
    npm --prefix dashboard run build →
      tsc -b && vite build (produces dashboard/dist/)
    Copy dashboard/dist/* to dist/dashboard/ →
  Upload dist/ to Vercel CDN →
  Apply vercel.json rewrites →
  App live! ✓
```

---

## Common Error Messages & Fixes

| Error | Fix |
|-------|-----|
| `Cannot find module '@context'` | Run build from correct directory |
| `404 on /dashboard` | Check vercel.json exists and was pushed |
| `vercel.json parse error` | Validate JSON syntax (use jsonlint.com) |
| `Build cache issue` | Clear cache in Vercel → Settings → Git |

---

## Success Indicators

✅ You're good when:
- `npm run build-all` completes without errors
- `dist/dashboard/` folder exists with index.html
- Vercel deployment shows "Ready"
- https://your-app.vercel.app/dashboard works
- All dashboard routes work (news, files, analytics, settings)

🚨 Something's wrong if:
- `/dashboard` returns 404
- Can access dashboard but sub-routes 404
- Builds locally but fails on Vercel
- Asset files (CSS/JS) not loading

---

## Need Help?

1. Check DEPLOYMENT_GUIDE.md for detailed explanations
2. Verify all files are pushed: `git status` shows clean working directory
3. Check Vercel build logs: Deployments → Failed build → View logs
4. Ensure proper Node version: Vercel defaults to latest (should be fine)

