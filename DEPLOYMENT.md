# Deployment Guide

This guide covers deploying the Night at the Museum PWA to various hosting platforms.

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Added actual audio guide files to `public/assets/audio/`
- [ ] Updated museum room coordinates in `geolocation.service.ts`
- [ ] Tested the application locally
- [ ] Verified PWA features work correctly
- [ ] Updated manifest.webmanifest with correct URLs
- [ ] Run production build successfully
- [ ] Tested on target devices (mobile, tablet, desktop)

## Building for Production

```bash
# Standard production build
npm run build

# Build output will be in dist/night-at-museum-app/
```

## Deployment Options

### Option 1: Netlify (Recommended for Ease)

Netlify provides automatic HTTPS, continuous deployment, and excellent PWA support.

#### Method A: Git Integration

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to https://netlify.com
   - Click "New site from Git"
   - Select your repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist/night-at-museum-app`
   - Click "Deploy site"

3. **Configure Custom Domain** (Optional)
   - Go to Site settings → Domain management
   - Add your custom domain
   - Configure DNS according to Netlify's instructions

#### Method B: Manual Deploy

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
cd dist/night-at-museum-app
netlify deploy --prod
```

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist/night-at-museum-app"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/manifest.webmanifest"
  [headers.values]
    Content-Type = "application/manifest+json"

[[headers]]
  for = "/ngsw-worker.js"
  [headers.values]
    Cache-Control = "no-cache"
```

### Option 2: Vercel

Vercel offers excellent Angular support and automatic deployments.

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Vercel Configuration** (`vercel.json`):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/night-at-museum-app"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Option 3: Firebase Hosting

Firebase provides robust hosting with excellent PWA support.

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize project
firebase init hosting

# Configuration:
# - Public directory: dist/night-at-museum-app
# - Configure as single-page app: Yes
# - Set up automatic builds: Optional

# Deploy
firebase deploy --only hosting
```

**Firebase Configuration** (`firebase.json`):
```json
{
  "hosting": {
    "public": "dist/night-at-museum-app",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/ngsw-worker.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### Option 4: GitHub Pages

GitHub Pages is free but requires additional configuration for SPAs.

```bash
# Build with correct base href
npm run build -- --base-href=/night-at-museum/

# Install deployment tool
npm install -g angular-cli-ghpages

# Deploy
npx angular-cli-ghpages --dir=dist/night-at-museum-app
```

**Note**: GitHub Pages serves over HTTPS automatically, which is required for PWA.

### Option 5: Azure Static Web Apps

Azure offers excellent integration with GitHub and automatic deployments.

1. **Create Static Web App** in Azure Portal
2. **Connect GitHub Repository**
3. **Configure Build**:
   - App location: `/`
   - API location: (leave empty)
   - Output location: `dist/night-at-museum-app`

**Azure Configuration** (`staticwebapp.config.json`):
```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*", "/*.js", "/*.css"]
  },
  "mimeTypes": {
    ".json": "application/json",
    ".webmanifest": "application/manifest+json"
  },
  "globalHeaders": {
    "cache-control": "must-revalidate, max-age=3600"
  },
  "routes": [
    {
      "route": "/ngsw-worker.js",
      "headers": {
        "cache-control": "no-cache"
      }
    }
  ]
}
```

### Option 6: Docker Container

For self-hosting or cloud platforms that support Docker.

**Dockerfile**:
```dockerfile
# Build stage
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist/night-at-museum-app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(?:manifest|webmanifest|json)$ {
        add_header Cache-Control "no-cache";
    }

    location /ngsw-worker.js {
        add_header Cache-Control "no-cache";
    }

    location ~* \.(?:jpg|jpeg|gif|png|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.(?:css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**Build and Run**:
```bash
docker build -t night-at-museum .
docker run -p 8080:80 night-at-museum
```

## Post-Deployment Steps

### 1. Verify HTTPS

PWAs require HTTPS. Verify your site is served over HTTPS:
- Check address bar shows padlock icon
- Visit https://your-domain.com

### 2. Test Service Worker

Open Chrome DevTools:
1. Go to Application tab
2. Click Service Workers
3. Verify "ngsw-worker.js" is registered
4. Check status is "activated and running"

### 3. Test PWA Installation

**On Desktop**:
- Look for install icon in address bar
- Click and verify app installs
- Open installed app and verify it works

**On Mobile**:
- Open site in Chrome/Safari
- Look for "Add to Home screen" prompt
- Install and verify app works offline

### 4. Test Offline Functionality

1. Open app in browser
2. Open DevTools → Network tab
3. Check "Offline" mode
4. Reload page - should still work
5. Try playing audio - should work if cached

### 5. Verify Geolocation

1. Grant location permissions
2. Verify location tracking starts
3. Test room detection (if in museum)
4. Test manual room selection

### 6. Performance Testing

Use Lighthouse in Chrome DevTools:
```
1. Open DevTools
2. Go to Lighthouse tab
3. Select "Progressive Web App"
4. Click "Generate report"
```

Target scores:
- PWA: 100
- Performance: >90
- Accessibility: >90
- Best Practices: >90

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      with:
        args: deploy --prod --dir=dist/night-at-museum-app
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Monitoring and Analytics

### Google Analytics (Optional)

1. Add to `src/index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### Error Tracking

Consider integrating:
- Sentry
- LogRocket
- Bugsnag

## Troubleshooting Deployment

### Issue: Service Worker Not Registering

**Solution**:
- Ensure HTTPS is enabled
- Check `ngsw-worker.js` is accessible
- Verify Content-Type is correct
- Clear browser cache and retry

### Issue: PWA Not Installable

**Solution**:
- Verify manifest.webmanifest is valid
- Check all required icons are present
- Ensure HTTPS is enabled
- Validate manifest with Chrome DevTools

### Issue: Routes Not Working

**Solution**:
- Configure server to redirect all routes to index.html
- Check SPA configuration for your hosting provider

### Issue: Large Bundle Size

**Solution**:
- Enable production optimizations
- Remove unused Material components
- Implement lazy loading
- Compress assets

## Security Considerations

### Content Security Policy

Add to hosting configuration:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; media-src 'self';
```

### HTTPS Configuration

- Use TLS 1.2 or higher
- Enable HSTS
- Implement certificate pinning if needed

### Rate Limiting

Configure rate limiting on hosting platform to prevent abuse.

## Rollback Strategy

### Quick Rollback

Most platforms support instant rollback:

**Netlify**: Site settings → Deploys → Click old deploy → "Publish deploy"

**Vercel**: Project → Deployments → Click old deployment → "Promote to Production"

**Firebase**: `firebase hosting:rollback`

## Support

For deployment issues:
- Check hosting provider documentation
- Review application logs
- Test locally first
- Check browser console for errors

## Cost Estimates

### Free Tier Limits

- **Netlify**: 100GB bandwidth/month
- **Vercel**: 100GB bandwidth/month
- **Firebase**: 10GB storage, 360MB/day downloads
- **GitHub Pages**: 100GB bandwidth/month, 1GB storage

Most suitable for small to medium museum deployments.
