# Technical Documentation

This document provides detailed technical information about the Night at the Museum PWA architecture and implementation.

## Architecture Overview

The application follows Angular's component-based architecture with service-oriented design patterns.

```
┌─────────────────────────────────────────────────────────┐
│                     App Component                        │
│  - Main UI container                                    │
│  - Audio player controls                               │
│  - Room information display                            │
└────────────┬────────────────────────────────┬──────────┘
             │                                 │
    ┌────────▼────────┐              ┌────────▼────────┐
    │  Audio Service  │              │ Geolocation     │
    │                 │              │ Service         │
    │ - Track mgmt    │              │                 │
    │ - Playback      │              │ - GPS tracking  │
    │ - State mgmt    │              │ - Room detect   │
    └────────┬────────┘              └────────┬────────┘
             │                                 │
    ┌────────▼────────┐              ┌────────▼────────┐
    │  HTML5 Audio    │              │ Geolocation API │
    └─────────────────┘              └─────────────────┘
```

## Core Services

### Audio Service (`audio.service.ts`)

**Purpose**: Manages audio playback and state management.

**Key Features**:
- HTML5 Audio API integration
- Observable-based state management
- Track queue management
- Playback controls (play, pause, stop, seek)
- Volume control

**State Management**:
```typescript
interface AudioState {
  isPlaying: boolean;
  currentTrack: AudioTrack | null;
  currentTime: number;
  duration: number;
  volume: number;
}
```

**Usage Example**:
```typescript
constructor(private audioService: AudioService) {}

ngOnInit() {
  this.audioService.audioState$.subscribe(state => {
    console.log('Audio state:', state);
  });
  
  const track = this.audioService.getTrackById('1');
  this.audioService.loadTrack(track);
  this.audioService.play();
}
```

### Geolocation Service (`geolocation.service.ts`)

**Purpose**: Handles GPS-based location tracking and room detection.

**Key Features**:
- High-accuracy GPS tracking
- Haversine distance calculation
- Room proximity detection
- Observable-based position updates

**Room Detection Algorithm**:
1. Get current GPS position
2. Calculate distance to all museum rooms using Haversine formula
3. Find rooms within defined radius
4. Select nearest room as current location
5. Emit room change event if different from previous

**Haversine Formula Implementation**:
```typescript
private calculateDistance(lat1, lon1, lat2, lon2): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}
```

**Usage Example**:
```typescript
constructor(private geoService: GeolocationService) {}

async ngOnInit() {
  await this.geoService.startTracking();
  
  this.geoService.currentRoom$.subscribe(room => {
    if (room) {
      console.log('Entered room:', room.name);
    }
  });
}
```

## Progressive Web App (PWA) Implementation

### Service Worker Configuration

**File**: `ngsw-config.json`

**Asset Groups**:
1. **App Shell** (prefetch): HTML, CSS, JS files
2. **Static Assets** (lazy): Images, fonts
3. **Audio Files** (lazy): Audio guides

**Caching Strategy**:
- **App Shell**: Cache-first with network fallback
- **Audio Files**: Performance strategy (cache-first)
- **API Calls**: Network-first with cache fallback

### Manifest Configuration

**File**: `public/manifest.webmanifest`

**Key Properties**:
```json
{
  "name": "Night at the Museum",
  "short_name": "Museum Guide",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#1976d2",
  "background_color": "#ffffff"
}
```

### Offline Functionality

**Implementation**:
1. Service worker caches critical resources on first visit
2. Audio files are cached lazily when accessed
3. App shell remains available offline
4. Content updates on next online session

**Cache Lifecycle**:
```
Install → Activate → Fetch
    ↓        ↓         ↓
  Cache   Cleanup   Serve
```

## Material Design Integration

### Components Used

- **MatToolbar**: App header with navigation
- **MatCard**: Content containers
- **MatButton/MatFabButton**: Action buttons
- **MatIcon**: Material icons
- **MatList**: Track and room lists
- **MatSlider**: Audio progress and volume controls
- **MatSnackBar**: Notifications and alerts

### Theme Configuration

**File**: `src/styles.scss`

Uses pre-built Material Design Indigo-Pink theme:
- Primary: Indigo (#1976d2)
- Accent: Pink (#ff4081)
- Warn: Red (default)

### Responsive Design

Mobile-first approach with breakpoints:
- Mobile: < 600px
- Tablet: 600px - 960px
- Desktop: > 960px

## Location-Based Features

### Indoor Positioning

**Challenge**: GPS accuracy indoors can be 10-50 meters.

**Solutions**:
1. **Beacon Technology** (future): Use BLE beacons for precise indoor positioning
2. **WiFi Triangulation** (future): Use WiFi signal strength
3. **Manual Override**: Allow users to select room manually

**Current Implementation**:
- GPS-based with generous room radius (10-15m)
- Manual room selection for testing/backup

### Room Transition Handling

```typescript
currentRoom$.subscribe(room => {
  if (room && room !== previousRoom) {
    // Room changed
    showNotification(`Welcome to ${room.name}`);
    offerAudioGuide(room.audioTrackId);
  }
});
```

## Performance Considerations

### Bundle Optimization

**Current Size**: ~611KB initial bundle

**Optimization Strategies**:
1. Lazy loading routes (not yet implemented)
2. Tree-shaking unused Material components
3. Code splitting for large features
4. Compression in production build

### Audio Streaming

**Consideration**: Pre-loading vs. streaming

**Current Approach**:
- Audio files served as static assets
- Service worker caches for offline use
- No streaming (files are fully downloaded)

**Future Enhancement**:
- Implement chunked streaming for large files
- Progressive loading indicator

### Memory Management

**Audio Service**:
- Single Audio element instance (reduces memory)
- Automatic cleanup on track change
- Event listener management

**Subscription Management**:
- Unsubscribe on component destroy
- Use takeUntil pattern for automatic cleanup

## Security Features

### Content Security Policy

**Recommendations**:
```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  media-src 'self';
  connect-src 'self';
```

### Geolocation Permissions

- Requests permission before accessing location
- Handles permission denial gracefully
- No location data sent to external servers

### Data Privacy

- No user tracking
- No analytics (can be added if needed)
- Location data stays on device
- Audio playback is local

## Testing Strategy

### Unit Tests

**Framework**: Vitest (configured)

**Test Coverage Areas**:
- Service methods
- Component logic
- State management
- Distance calculations

**Example Test**:
```typescript
describe('AudioService', () => {
  it('should play track', () => {
    const service = new AudioService();
    const track = service.getTracks()[0];
    service.loadTrack(track);
    service.play();
    expect(service.audioState$.value.isPlaying).toBe(true);
  });
});
```

### E2E Tests

**Considerations**:
- PWA installation flow
- Offline functionality
- Location permissions
- Audio playback

### Manual Testing Checklist

- [ ] Install PWA on Android
- [ ] Install PWA on iOS
- [ ] Test offline mode
- [ ] Test audio playback
- [ ] Test location detection
- [ ] Test manual room selection
- [ ] Test service worker updates
- [ ] Test on slow network (3G)

## Browser APIs Used

### HTML5 Audio API

```typescript
const audio = new Audio();
audio.src = 'path/to/audio.mp3';
audio.play();
audio.pause();
audio.currentTime = 30; // Seek to 30 seconds
audio.volume = 0.5; // 50% volume
```

### Geolocation API

```typescript
navigator.geolocation.watchPosition(
  (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const accuracy = position.coords.accuracy;
  },
  (error) => console.error(error),
  {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  }
);
```

### Service Worker API

```typescript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/ngsw-worker.js')
    .then(reg => console.log('SW registered'))
    .catch(err => console.error('SW error', err));
}
```

## Future Enhancements

### Planned Features

1. **Beacon Integration**: BLE beacons for precise indoor positioning
2. **Augmented Reality**: AR overlays for artifacts
3. **Multi-language Support**: i18n for multiple languages
4. **User Preferences**: Save playback position, favorites
5. **Social Features**: Share discoveries, ratings
6. **Analytics**: Anonymous usage statistics
7. **Push Notifications**: Event reminders, new exhibits
8. **Accessibility**: Screen reader support, high contrast mode

### Technical Improvements

1. **State Management**: NgRx or Akita for complex state
2. **Testing**: Comprehensive unit and E2E tests
3. **Performance**: Lazy loading, virtual scrolling
4. **PWA**: Background sync, periodic sync
5. **Audio**: Equalizer, playback speed control
6. **Location**: Compass integration, floor detection

## Troubleshooting

### Common Issues

**Issue**: Service worker not registering
- **Solution**: Ensure HTTPS, check console for errors

**Issue**: Location not accurate
- **Solution**: Increase room radius, use manual selection

**Issue**: Audio not caching offline
- **Solution**: Visit audio pages online first, check storage quota

## API Reference

### AudioService

```typescript
class AudioService {
  audioState$: Observable<AudioState>
  getTracks(): AudioTrack[]
  getTrackById(id: string): AudioTrack | undefined
  loadTrack(track: AudioTrack): void
  play(): void
  pause(): void
  stop(): void
  seek(time: number): void
  setVolume(volume: number): void
  togglePlay(): void
  playTrackById(id: string): void
}
```

### GeolocationService

```typescript
class GeolocationService {
  currentPosition$: Observable<Position | null>
  currentRoom$: Observable<MuseumRoom | null>
  startTracking(): Promise<void>
  stopTracking(): void
  getRooms(): MuseumRoom[]
  getCurrentPosition(): Position | null
  getCurrentRoom(): MuseumRoom | null
  simulateRoomEntry(roomId: string): void
}
```

## Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow Angular style guide
- Use async/await for asynchronous operations
- Document public APIs with JSDoc comments
- Use meaningful variable names

### Git Workflow

1. Create feature branch from main
2. Make atomic commits with clear messages
3. Test thoroughly before PR
4. Request code review
5. Merge after approval

### Version Control

**Semantic Versioning**: MAJOR.MINOR.PATCH
- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes
