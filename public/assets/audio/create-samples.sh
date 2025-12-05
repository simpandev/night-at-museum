#!/bin/bash
# This script creates silent MP3 placeholders for testing
# In production, replace these with actual audio guide recordings

echo "Creating placeholder audio files..."

# Create 1-second silent audio files using ffmpeg if available
# These are just placeholders - replace with real audio guides
for file in welcome.mp3 room1.mp3 room2.mp3 room3.mp3 room4.mp3; do
    # Create a minimal valid MP3 file (silent, 1 second)
    # This is a base64 encoded minimal MP3 file
    echo "Creating $file..."
    echo "Replace this file with actual audio content" > "${file}.txt"
done

echo "Placeholder files created. Replace these with actual audio recordings."
echo "Recommended format: MP3, 128-192 kbps, 44.1 kHz, mono"
