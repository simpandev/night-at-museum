# Installation Guide

This guide will help you install and deploy the Night at the Museum PWA.

## For Developers

### System Requirements

- **Node.js**: 20.x or higher
- **npm**: 10.x or higher
- **Operating System**: Windows, macOS, or Linux

### Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/simpandev/night-at-museum.git
   cd night-at-museum
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Add Audio Files**
   - Create audio guide files (MP3 format recommended)
   - Place them in `public/assets/audio/` with the following names:
     - `welcome.mp3`
     - `room1.mp3`
     - `room2.mp3`
     - `room3.mp3`
     - `room4.mp3`

4. **Configure Museum Coordinates**
   - Edit `src/app/services/geolocation.service.ts`
   - Update the `rooms` array with actual GPS coordinates
   - Adjust radius values based on room sizes

5. **Start Development Server**
   ```bash
   npm start
   ```
   - Open `http://localhost:4200` in your browser
   - The app will automatically reload on file changes

### Production Build

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Test the Production Build**
   ```bash
   # Install a simple HTTP server
   npm install -g http-server
   
   # Serve the production build
   cd dist/night-at-museum-app
   http-server -p 8080
   ```

3. **Access the Application**
   - Open `http://localhost:8080` in your browser
   - Test PWA installation
   - Test offline functionality

## Deployment

### Deploy to Static Hosting

The built application in `dist/night-at-museum-app` is a static website that can be deployed to any static hosting service.

#### GitHub Pages

1. **Build for GitHub Pages**
   ```bash
   npm run build -- --base-href=/night-at-museum/
   ```

2. **Deploy**
   ```bash
   # Install Angular CLI GitHub Pages tool
   npm install -g angular-cli-ghpages
   
   # Deploy to GitHub Pages
   npx angular-cli-ghpages --dir=dist/night-at-museum-app
   ```

#### Netlify

1. **Connect Repository**
   - Log in to Netlify
   - Click "New site from Git"
   - Choose your repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist/night-at-museum-app`

3. **Deploy**
   - Click "Deploy site"

#### Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

#### Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```
   - Select `dist/night-at-museum-app` as public directory
   - Configure as single-page app: Yes
   - Don't overwrite index.html

3. **Deploy**
   ```bash
   firebase deploy
   ```

## For End Users

### Installing on Mobile Devices

#### Android (Chrome)

1. **Open the Website**
   - Navigate to the deployed app URL in Chrome

2. **Install the App**
   - Look for the "Add to Home screen" prompt
   - Or tap the menu (⋮) → "Install app"
   - Follow the prompts

3. **Use Offline**
   - Once installed, the app works without internet
   - Audio files are cached automatically

#### iOS (Safari)

1. **Open the Website**
   - Navigate to the deployed app URL in Safari

2. **Add to Home Screen**
   - Tap the Share button (□↑)
   - Scroll down and tap "Add to Home Screen"
   - Tap "Add"

3. **Open the App**
   - Find the app icon on your home screen
   - Tap to open

### Desktop Installation

#### Chrome/Edge

1. **Open the Website**
   - Navigate to the deployed app URL

2. **Install the App**
   - Look for the install button (⊕) in the address bar
   - Or click the menu (⋮) → "Install Night at the Museum"
   - Follow the prompts

## Troubleshooting

### PWA Not Installing

**Problem**: The "Add to Home screen" or "Install app" option doesn't appear.

**Solutions**:
- Ensure you're using HTTPS (required for PWA)
- Check that the manifest.webmanifest file is accessible
- Clear browser cache and reload
- Use Chrome/Safari (some browsers don't support PWA)

### Audio Not Playing Offline

**Problem**: Audio doesn't play when offline.

**Solutions**:
- Visit each audio guide page while online to cache files
- Check service worker is registered (DevTools → Application → Service Workers)
- Clear cache and re-cache by visiting pages online

### Location Not Working

**Problem**: App doesn't detect location or room.

**Solutions**:
- Grant location permissions when prompted
- Ensure GPS is enabled on your device
- For indoor positioning, GPS may not be accurate
- Use manual room selection for testing

### App Not Updating

**Problem**: Changes don't appear after deployment.

**Solutions**:
- Clear browser cache
- Uninstall and reinstall the PWA
- Check service worker is updating (DevTools → Application → Service Workers)

## Security Considerations

### HTTPS Required

PWAs require HTTPS for security. Ensure your hosting provider supports HTTPS.

### Geolocation Permissions

The app requires location permissions. Users must grant permission for location-based features to work.

### Content Security Policy

If deploying with strict CSP, ensure service workers and web app manifest are allowed.

## Performance Optimization

### Audio File Optimization

- Use MP3 format with 128-192 kbps bitrate
- Keep files under 10MB each
- Use mono audio for voice guides (reduces file size)

### Image Optimization

- Icons are already optimized
- Add additional images in WebP format for better compression

### Bundle Size

Current bundle size is ~611KB (initial load). To reduce:
- Remove unused Material components
- Enable lazy loading for routes
- Tree-shake unused dependencies

## Support

For issues or questions:
- Open an issue on GitHub
- Check the README.md for documentation
- Review the code comments for implementation details
