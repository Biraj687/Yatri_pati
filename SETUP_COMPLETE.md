# 🚀 Installation & Setup Guide

## Complete Setup Instructions for Yatripati Security Implementation

---

## Step 1: Install Dependencies

### In Your Project Directory
```bash
cd d:\yatripati\yatripati

# Install DOMPurify (required for XSS prevention)
npm install dompurify

# Install TypeScript types for DOMPurify
npm install --save-dev @types/dompurify

# Optional: Verify package.json was updated
npm list dompurify
```

### Verify Installation
```bash
npm list | grep dompurify
# Should show: dompurify@3.0.9 (or latest version)
```

---

## Step 2: Configure Environment Variables

### Create `.env` File
Create a new file named `.env` in your project root:

```env
# ============================================
# Yatripati Frontend Configuration
# ============================================

# API Configuration
# Point to YOUR BACKEND PROXY SERVER
# Never point directly to third-party APIs
VITE_API_URL=https://yourdomain.com/api/v1

# For development with local backend:
# VITE_API_URL=http://localhost:3000/api

# Use mock data for development/testing
# Set to false when backend is ready
VITE_USE_MOCK_DATA=false
```

### Add to .gitignore
Make sure your `.gitignore` includes:
```
.env
.env.local
.env.*.local
```

---

## Step 3: Set Up Backend Proxy Server

### THIS IS CRITICAL! 🚨

Your frontend will NOT work securely without a backend proxy server. 

**Follow [BACKEND_PROXY_SETUP.md](./BACKEND_PROXY_SETUP.md) to set up a backend server.**

Quick summary:
1. Create a Node.js/Express backend server
2. Store all API keys in environment variables
3. Create proxy endpoints that forward requests
4. Implement rate limiting per IP address
5. Deploy to your server

---

## Step 4: Run Development Server

```bash
# Start Vite development server
npm run dev

# Your app will be at: http://localhost:5173
```

### Verify Everything Works
1. Open http://localhost:5173 in your browser
2. Check that the application loads
3. Open DevTools (F12) and verify no API keys appear
4. Check Network tab for requests

---

## Step 5: Test Security Features

### Test 1: Input Sanitization
```typescript
// In browser console
await import('./src/services/sanitizer.ts').then(m => {
  console.log(m.sanitizeInput('<script>alert("xss")</script>'));
  // Should output: '' (empty - script removed)
});
```

### Test 2: Rate Limiting
```typescript
// In browser console
await import('./src/services/rateLimiter.ts').then(m => {
  const limiter = m.createRateLimiter({ maxRequests: 3, windowMs: 60000 });
  console.log(limiter.isAllowed('test-key')); // true
  console.log(limiter.isAllowed('test-key')); // true
  console.log(limiter.isAllowed('test-key')); // true
  console.log(limiter.isAllowed('test-key')); // false (rate limited)
});
```

### Test 3: File Upload Validation
```typescript
// In browser console
await import('./src/services/fileValidator.ts').then(m => {
  const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  console.log(m.validateFileUpload(file, m.ValidationPresets.IMAGES));
  // Should output: { isValid: true }
});
```

---

## Step 6: Production Build

### Build for Production
```bash
# Run TypeScript compiler and build
npm run build

# This creates optimized files in dist/ directory
```

### Test Production Build Locally
```bash
# Preview production build
npm run preview

# Your app will be at: http://localhost:4173
```

### Verify Build
```bash
# Check build succeeded
ls dist/

# Should contain:
# - index.html
# - assets/ (CSS, JS files)
# - Check file sizes are reasonable
```

---

## Step 7: Deployment

### Before Deploying

#### Frontend
- [ ] Run `npm run build` successfully
- [ ] No errors in console
- [ ] `.env` file NOT in git repository
- [ ] Check `SECURITY_CHECKLIST.md` items

#### Backend
- [ ] Backend proxy server ready
- [ ] API keys in environment variables (NOT in code)
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] HTTPS certificate ready

### Deploy Frontend
```bash
# Build
npm run build

# Your hosting provider will serve the dist/ folder
# Examples:
# - Vercel: `vercel deploy`
# - Netlify: `netlify deploy --prod`
# - GitHub Pages: Push to gh-pages branch
# - Your server: Copy dist/ to web root
```

### Deploy Backend
```bash
# Set environment variables on your server
export VITE_API_URL=https://yourdomain.com/api/v1
export THIRD_PARTY_API_KEY=your_real_api_key_here
export DATABASE_URL=your_database_url_here

# Start backend server
node server.js
# Or use PM2 for production:
# pm2 start server.js --name "yatripati-api"
```

### Update Frontend Environment
```env
# .env.production (if using separate config)
VITE_API_URL=https://yourdomain.com/api/v1
VITE_USE_MOCK_DATA=false
```

---

## Common Setup Issues

### Issue: "dompurify not found"
```bash
# Solution
npm install dompurify @types/dompurify
npm run dev
```

### Issue: "API URL not configured"
```bash
# Solution
# 1. Create .env file
# 2. Add VITE_API_URL=https://yourdomain.com/api/v1
# 3. Restart: npm run dev
```

### Issue: "CORS error" from browser
```bash
# Solution:
# 1. Your backend is not running
# 2. Or backend CORS not configured for your domain
# 3. Check BACKEND_PROXY_SETUP.md CORS section
```

### Issue: Build fails with TypeScript errors
```bash
npm run lint
# Fix any errors shown, then:
npm run build
```

### Issue: Network requests failing
```bash
# 1. Check that backend proxy is running
# 2. Verify VITE_API_URL in .env is correct
# 3. Check browser DevTools Network tab
# 4. Look for CORS headers in response
```

---

## Verification Checklist

### After Installation
- [ ] Dependencies installed: `npm list dompurify`
- [ ] `.env` file created with API_URL
- [ ] Backend proxy server running
- [ ] Development server starts: `npm run dev`
- [ ] Application loads in browser

### Security Verification
- [ ] DevTools shows no API keys in Network tab
- [ ] Console shows no sensitive data
- [ ] Sanitization test passes
- [ ] Rate limiting test passes
- [ ] File validation test passes

### Build Verification
- [ ] `npm run build` succeeds
- [ ] No errors in output
- [ ] `dist/` folder created
- [ ] `npm run preview` works
- [ ] Production version loads correctly

---

## File Locations

After setup, your project structure should be:

```
d:\yatripati\yatripati\
├── .env                                    # Your config (not in git)
├── .env.example                            # Template (in git)
├── .gitignore                              # Includes .env
├── package.json                            # Updated with dompurify
├── src/
│   ├── services/
│   │   ├── apiClient.ts                   # Secure API client
│   │   ├── sanitizer.ts                   # Input sanitization
│   │   ├── rateLimiter.ts                 # Rate limiting
│   │   ├── fileValidator.ts               # File validation
│   │   └── newsService.ts                 # Updated to use apiClient
│   ├── components/                         # Your components
│   ├── pages/                              # Your pages
│   └── ...
├── SECURITY_IMPLEMENTATION_SUMMARY.md     # What was added
├── SECURITY_QUICK_START.md                # Quick start
├── SECURITY_GUIDE.md                      # Full documentation
├── BACKEND_PROXY_SETUP.md                 # Backend setup
├── SECURITY_INDEX.md                      # This index
├── SETUP_COMPLETE.md                      # This file
└── dist/                                   # Build output (not in git)
```

---

## Quick Commands Reference

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint --fix   # Auto-fix ESLint issues

# Package management
npm install          # Install all dependencies
npm update           # Update to latest versions
npm list             # List installed packages

# Git (always before committing)
git status           # Check what will be committed
git diff             # See changes
git add .
git commit -m "message"
```

---

## Important Reminders ⚠️

### 1. Never Commit Secrets
```bash
# Verify before committing
git status
# Should NOT show: .env
# Should show: .env.example only
```

### 2. Backend Proxy is Required
- Cannot skip backend proxy setup
- Frontend alone cannot protect API keys
- See BACKEND_PROXY_SETUP.md

### 3. Environment Variables
- Different `.env` for each environment
- Development: Use local backend
- Production: Use your deployed backend

### 4. Testing Before Deployment
```bash
npm run build        # Verify build works
npm run preview      # Test production build
# Check DevTools for no exposed secrets
```

### 5. Monitoring After Deployment
- Monitor API rate limits
- Check error logs
- Watch for security alerts
- Keep dependencies updated

---

## Support & Troubleshooting

### Can't Start Dev Server?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### TypeScript Errors?
```bash
# Check configuration
npx tsc --noEmit

# Rebuild
npm run build
```

### Need Help?
1. Read [SECURITY_QUICK_START.md](./SECURITY_QUICK_START.md)
2. Check [SECURITY_GUIDE.md](./SECURITY_GUIDE.md)
3. See code comments in `src/services/`
4. Review [BACKEND_PROXY_SETUP.md](./BACKEND_PROXY_SETUP.md)

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Create `.env` file
3. ✅ Set up backend proxy (see BACKEND_PROXY_SETUP.md)
4. ✅ Start dev server
5. ✅ Test security features
6. ✅ Build for production
7. ✅ Deploy!

---

**🎉 You're all set! Your Yatripati frontend is now secure and ready for production.**

Have questions? Check the comprehensive documentation files in your project root.
