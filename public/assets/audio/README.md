# Audio Files

This directory should contain the audio guide files for the museum.

## Required Files

Place the following MP3 files in this directory:

- `welcome.mp3` - Welcome message for the Egyptian Museum
- `room1.mp3` - Audio guide for Room 1 (Ancient Kingdom)
- `room2.mp3` - Audio guide for Room 2 (Middle Kingdom)
- `room3.mp3` - Audio guide for Room 3 (New Kingdom)
- `room4.mp3` - Audio guide for Room 4 (Tutankhamun Exhibition)

## Audio Format Recommendations

- Format: MP3 (recommended for best compatibility)
- Bitrate: 128-192 kbps (balance between quality and file size)
- Sample Rate: 44.1 kHz
- Mono or Stereo: Mono is sufficient for voice guides and reduces file size

## File Size Considerations

Keep individual audio files under 10MB for optimal loading and caching performance. The service worker will cache these files for offline playback.

## Adding New Audio Guides

To add new audio guides:

1. Add the MP3 file to this directory
2. Update `src/app/services/audio.service.ts` to include the new track
3. If the audio is for a specific room, update `src/app/services/geolocation.service.ts` with the room coordinates

## Testing Without Audio Files

The application will work without actual audio files, but audio playback will fail. For testing, you can use any MP3 files with the required filenames.
