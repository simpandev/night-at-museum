import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

import { AudioService, AudioTrack, AudioState } from './services/audio.service';
import { GeolocationService, MuseumRoom } from './services/geolocation.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, 
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatSliderModule,
    MatSnackBarModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('Night at the Museum');
  
  audioState: AudioState = {
    isPlaying: false,
    currentTrack: null,
    currentTime: 0,
    duration: 0,
    volume: 1
  };
  
  currentRoom: MuseumRoom | null = null;
  tracks: AudioTrack[] = [];
  rooms: MuseumRoom[] = [];
  
  private subscriptions = new Subscription();

  constructor(
    private audioService: AudioService,
    private geolocationService: GeolocationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Load tracks
    this.tracks = this.audioService.getTracks();
    this.rooms = this.geolocationService.getRooms();

    // Subscribe to audio state changes
    this.subscriptions.add(
      this.audioService.audioState$.subscribe(state => {
        this.audioState = state;
      })
    );

    // Subscribe to room changes
    this.subscriptions.add(
      this.geolocationService.currentRoom$.subscribe(room => {
        if (room && room !== this.currentRoom) {
          this.currentRoom = room;
          this.snackBar.open(`Welcome to ${room.name}`, 'PLAY AUDIO', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          }).onAction().subscribe(() => {
            this.audioService.playTrackById(room.audioTrackId).catch(error => {
              this.snackBar.open(error.message || 'Failed to play audio', 'OK', { duration: 5000 });
            });
          });
        }
      })
    );

    // Start geolocation tracking
    this.startLocationTracking();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.geolocationService.stopTracking();
  }

  async startLocationTracking(): Promise<void> {
    try {
      await this.geolocationService.startTracking();
      this.snackBar.open('Location tracking enabled', 'OK', { duration: 3000 });
    } catch (error) {
      console.error('Failed to start location tracking:', error);
      this.snackBar.open('Location tracking unavailable. Using manual room selection.', 'OK', { duration: 5000 });
    }
  }

  playTrack(track: AudioTrack): void {
    this.audioService.loadTrack(track);
    this.audioService.play().catch(error => {
      this.snackBar.open(error.message || 'Failed to play audio', 'OK', { duration: 5000 });
    });
  }

  togglePlayPause(): void {
    if (this.audioState.isPlaying) {
      this.audioService.pause();
    } else {
      this.audioService.play().catch(error => {
        this.snackBar.open(error.message || 'Failed to play audio', 'OK', { duration: 5000 });
      });
    }
  }

  stopAudio(): void {
    this.audioService.stop();
  }

  seekTo(value: number): void {
    this.audioService.seek(value);
  }

  setVolume(value: number): void {
    this.audioService.setVolume(value / 100);
  }

  selectRoom(room: MuseumRoom): void {
    this.geolocationService.simulateRoomEntry(room.id);
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) {
      return '0:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
