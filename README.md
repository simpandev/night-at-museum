# Night at the Museum 🏛️

Your AI guide to the Egyptian Museum of Turin - A Progressive Web Application with offline audio guides and location-based features.

## Features

✨ **Progressive Web App (PWA)**
- Installable on mobile devices (Android & iOS)
- Offline functionality with service worker caching
- App-like experience with standalone mode

🎵 **Offline Audio Guides**
- Pre-cached audio files for offline playback
- Audio guides for each museum room
- Full playback controls (play, pause, stop, seek, volume)

📍 **High-Precision Geolocation**
- GPS-based indoor positioning
- Automatic room detection
- Location-based audio guide suggestions
- Manual room selection for testing

🎨 **Material Design 3**
- Modern, responsive UI
- Material Design components
- Indigo-pink color theme
- Mobile-first design

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/simpandev/night-at-museum.git
cd night-at-museum

# Install dependencies
npm install

# Start development server
npm start
```

The application will be available at `http://localhost:4200`

### Build for Production

```bash
# Build the PWA
npm run build

# The production build will be in the dist/ directory
```

## Project Structure

```
night-at-museum/
├── src/
│   ├── app/
│   │   ├── services/
│   │   │   ├── audio.service.ts       # Audio playback service
│   │   │   └── geolocation.service.ts # Location tracking service
│   │   ├── app.ts                     # Main app component
│   │   ├── app.html                   # Main app template
│   │   └── app.scss                   # Main app styles
│   ├── index.html                     # HTML entry point
│   └── styles.scss                    # Global styles
├── public/
│   ├── assets/
│   │   └── audio/                     # Audio guide files
│   ├── icons/                         # PWA icons
│   └── manifest.webmanifest          # PWA manifest
├── ngsw-config.json                  # Service worker config
└── package.json
```

## Adding Audio Files

Place your audio guide MP3 files in `public/assets/audio/`:

- `welcome.mp3` - Welcome message
- `room1.mp3` - Room 1: Ancient Kingdom
- `room2.mp3` - Room 2: Middle Kingdom
- `room3.mp3` - Room 3: New Kingdom
- `room4.mp3` - Room 4: Tutankhamun Exhibition

The service worker will automatically cache these files for offline playback.

## Configuration

### Museum Rooms

Edit `src/app/services/geolocation.service.ts` to configure room coordinates:

```typescript
private readonly rooms: MuseumRoom[] = [
  {
    id: '1',
    name: 'Entrance Hall',
    latitude: 45.0677,
    longitude: 7.6847,
    radius: 15,
    audioTrackId: '1'
  },
  // Add more rooms...
];
```

### Audio Tracks

Edit `src/app/services/audio.service.ts` to add or modify audio tracks:

```typescript
private tracks: AudioTrack[] = [
  {
    id: '1',
    title: 'Welcome to the Egyptian Museum',
    description: 'Introduction to the museum',
    url: 'assets/audio/welcome.mp3'
  },
  // Add more tracks...
];
```

## PWA Installation

### Android
1. Open the app in Chrome
2. Tap the menu (⋮) and select "Add to Home screen"
3. Follow the prompts to install

### iOS
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Follow the prompts to install

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run watch` - Build and watch for changes

### Testing Geolocation

When GPS is not available, use the "Museum Rooms" section to manually simulate room entry and trigger location-based features.

## Technologies Used

- **Angular 21** - Framework
- **Angular Material** - UI components
- **Angular PWA** - Progressive Web App features
- **Service Workers** - Offline functionality
- **Geolocation API** - Location tracking
- **Web Audio API** - Audio playback

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Android Chrome 90+

## License

See [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Museum Information

This application is designed for the Egyptian Museum of Turin (Museo Egizio di Torino), one of the world's most important collections of Egyptian artifacts.

**Museum Location:**
Via Accademia delle Scienze, 6
10123 Torino TO, Italy

**Coordinates:**
Latitude: 45.0677° N
Longitude: 7.6847° E
