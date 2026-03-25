# Quick Start & Deployment Guide

## Quick Start

### 1. Installation

```bash
cd dashboard
npm install
```

### 2. Development

```bash
npm run dev
```

Dashboard opens at: `http://localhost:5174`

### 3. Building for Production

```bash
npm run build
```

Output in `dist/` folder is ready for deployment.

### 4. Preview Production Build

```bash
npm run preview
```

## Configuration

### Environment Variables

Create `.env.local`:

```
VITE_API_BASE_URL=http://api.yourdomain.com/api
VITE_APP_NAME=Yatripati News Portal
VITE_DEFAULT_AUTHOR=Yatripati
```

Or copy from `.env.example`:

```bash
cp .env.example .env.local
```

### API Configuration

Update API URL in `src/services/api.ts` if needed:

```typescript
private baseUrl = 'http://localhost:3000/api'; // Change this
```

Or use environment variable approach in `vite.config.ts`.

## Deployment Options

### Option 1: Vercel (Recommended for Easy Setup)

1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel settings
4. Deploy with one click

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy
vercel
```

### Option 2: GitHub Pages

```bash
# Build
npm run build

# Deploy dist/ folder to GitHub Pages
```

### Option 3: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Option 4: Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

Build and run:

```bash
docker build -t yatripati-dashboard .
docker run -p 3000:3000 yatripati-dashboard
```

### Option 5: Traditional Server (nginx)

1. Build locally: `npm run build`
2. Upload `dist/` folder to server
3. Configure nginx:

```nginx
server {
    listen 80;
    server_name dashboard.yourdomain.com;
    
    root /var/www/dashboard/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Restart nginx:

```bash
sudo systemctl restart nginx
```

### Option 6: AWS S3 + CloudFront

```bash
# Build
npm run build

# Configure AWS CLI
aws configure

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Create CloudFront distribution (in AWS console)
```

## Server Requirements

### Minimum Specs
- Node.js 16+
- 512MB RAM
- 500MB disk space (for static files)
- Fast internet connection

### Recommended Specs
- Node.js 18+
- 1GB RAM
- 2GB disk space
- CDN for static asset delivery

## Post-Deployment

### 1. Verify Installation

```bash
curl https://your-dashboard-domain.com
# Should return HTML
```

### 2. Test API Connection

In dashboard, check browser console:

```javascript
// Test API
fetch('http://api.yourdomain.com/api/articles')
  .then(r => r.json())
  .then(d => console.log(d))
```

### 3. Check Performance

```bash
# Google PageSpeed Insights
https://pagespeed.web.dev/

# GTmetrix
https://gtmetrix.com/
```

### 4. SSL Certificate

Use Let's Encrypt for HTTPS (free):

```bash
sudo certbot certonly --webroot -w /var/www/dashboard/dist \
  -d dashboard.yourdomain.com
```

Update nginx to use certificate:

```nginx
listen 443 ssl;
ssl_certificate /etc/letsencrypt/live/dashboard.yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/dashboard.yourdomain.com/privkey.pem;
```

## Performance Optimization

### Enable Caching Headers

```nginx
location ~* \.(js|css)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
}

location / {
    add_header Cache-Control "public, max-age=3600, must-revalidate";
}
```

### Enable Compression

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### Use CDN

Configure Cloudflare or similar CDN to cache assets globally.

## Monitoring

### Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- Datadog

### Error Tracking

Implement error tracking:

```typescript
// Add to src/App.tsx
import * as Sentry from "@sentry/react"; // if using Sentry

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
});
```

Or use Analytics services:
- Google Analytics
- Mixpanel
- Hotjar

## Backup Strategy

### Backup API/Database

Backup before deploys:

```bash
# Backup database
mongodump --uri "mongodb://..." --out /backups/$(date +%Y%m%d)

# Backup files
tar -czf /backups/files_$(date +%Y%m%d).tar.gz /data/files/
```

### Backup Dashboard Code

Always use version control:

```bash
git add .
git commit -m "Production deployment"
git push origin main
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0
```

## Rollback Procedure

### Quick Rollback

Keep backup builds:

```bash
# Save builds
npm run build
cp -r dist/ dist_v1.0.0_backup/

# If needed, rollback
cp -r dist_v1.0.0_backup/ dist/
npm run preview
```

Or use git tags:

```bash
git checkout v1.0.0
npm install && npm run build
```

## Update Procedure

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update all
npm update

# Or update specific package
npm install package@latest

# Test before deployment
npm run build
npm run preview

# Deploy if working
git add .
git commit -m "Update dependencies"
git push origin main
npm run build
# Upload to server
```

## SSL/TLS Configuration

### Production Best Practices

1. **Use HTTPS everywhere**
2. **Set HSTS header** (enforces HTTPS)
3. **Enable OCSP stapling**
4. **Use secure cipher suites**

Nginx config:

```nginx
# Security headers
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

## Database Considerations

### Recommended Database

- **MongoDB** - Great for JSON data (articles with flexible schema)
- **PostgreSQL** - Reliable relational database
- **MySQL** - Popular choice, good performance

### Indexes for Performance

Create database indexes on:

```sql
-- Article indexes
CREATE INDEX idx_status ON articles(status);
CREATE INDEX idx_createdAt ON articles(createdAt);
CREATE INDEX idx_sticky ON articles(sticky);
CREATE INDEX idx_category ON articles(category);
CREATE INDEX idx_title_search ON articles(title); -- for full-text search

-- File indexes
CREATE INDEX idx_createdAt ON files(createdAt);
CREATE INDEX idx_type ON files(type);
```

## Load Balancing (if needed)

For high traffic, use load balancer:

```nginx
upstream dashboard_backend {
    server 10.0.1.1:3000 weight=3;
    server 10.0.1.2:3000 weight=1;
    server 10.0.1.3:3000 weight=1;
}

server {
    listen 80;
    location / {
        proxy_pass http://dashboard_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Connection Issues

```bash
# Check CORS headers
curl -I https://api.yourdomain.com/api/articles

# Verify API endpoint is correct
# Check browser console for errors
# Ensure auth token is valid
```

### Slow Performance

```bash
# Check build size
npm run build
du -sh dist/

# Analyze bundle
npm install --save-dev rollup-plugin-visualizer
# Add to vite.config.ts and check output
```

### White Screen on Load

1. Check browser console for errors
2. Verify index.html is served correctly
3. Check that all assets are loading (network tab)
4. Verify JavaScript is enabled in browser

## Documentation

- README.md - Project overview and setup
- API_SETUP.md - Backend API requirements
- FEATURES.md - Complete feature list
- This file - Deployment guide

## Support & Maintenance

### Keep Updated

```bash
# Weekly checks
npm outdated

# Monthly updates
npm update
npm audit

# Quarterly major version updates
npm install package@latest
```

### Monitoring & Maintenance

- Monitor uptime daily
- Check error logs weekly
- Review performance metrics monthly
- Update dependencies quarterly
- Perform security audits annually

### Emergency Contacts

- DevOps Team: [contact info]
- Database Admin: [contact info]
- API Team: [contact info]
- Security: [contact info]
