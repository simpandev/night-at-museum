import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AudioTrack {
  id: string;
  title: string;
  description: string;
  url: string;
  duration?: number;
}

export interface AudioState {
  isPlaying: boolean;
  currentTrack: AudioTrack | null;
  currentTime: number;
  duration: number;
  volume: number;
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio: HTMLAudioElement;
  private audioStateSubject = new BehaviorSubject<AudioState>({
    isPlaying: false,
    currentTrack: null,
    currentTime: 0,
    duration: 0,
    volume: 1
  });

  public audioState$: Observable<AudioState> = this.audioStateSubject.asObservable();

  // Sample audio tracks for the Egyptian Museum
  private tracks: AudioTrack[] = [
    {
      id: '1',
      title: 'Welcome to the Egyptian Museum',
      description: 'Introduction to the museum and its history',
      url: 'assets/audio/welcome.mp3'
    },
    {
      id: '2',
      title: 'Room 1: Ancient Kingdom',
      description: 'Discover the artifacts from the Ancient Kingdom period',
      url: 'assets/audio/room1.mp3'
    },
    {
      id: '3',
      title: 'Room 2: Middle Kingdom',
      description: 'Explore the Middle Kingdom treasures',
      url: 'assets/audio/room2.mp3'
    },
    {
      id: '4',
      title: 'Room 3: New Kingdom',
      description: 'Learn about the New Kingdom era',
      url: 'assets/audio/room3.mp3'
    },
    {
      id: '5',
      title: 'Room 4: Tutankhamun',
      description: 'Special exhibition about Tutankhamun',
      url: 'assets/audio/room4.mp3'
    }
  ];

  constructor() {
    this.audio = new Audio();
    this.setupAudioEventListeners();
  }

  private setupAudioEventListeners(): void {
    this.audio.addEventListener('timeupdate', () => {
      this.updateState({
        currentTime: this.audio.currentTime,
        duration: this.audio.duration
      });
    });

    this.audio.addEventListener('ended', () => {
      this.updateState({ isPlaying: false, currentTime: 0 });
    });

    this.audio.addEventListener('play', () => {
      this.updateState({ isPlaying: true });
    });

    this.audio.addEventListener('pause', () => {
      this.updateState({ isPlaying: false });
    });

    this.audio.addEventListener('volumechange', () => {
      this.updateState({ volume: this.audio.volume });
    });
  }

  private updateState(partial: Partial<AudioState>): void {
    const currentState = this.audioStateSubject.value;
    this.audioStateSubject.next({ ...currentState, ...partial });
  }

  getTracks(): AudioTrack[] {
    return this.tracks;
  }

  getTrackById(id: string): AudioTrack | undefined {
    return this.tracks.find(track => track.id === id);
  }

  loadTrack(track: AudioTrack): void {
    if (this.audio.src !== track.url) {
      this.audio.src = track.url;
      this.updateState({ currentTrack: track, currentTime: 0 });
    }
  }

  play(): void {
    if (this.audio.src) {
      this.audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  }

  pause(): void {
    this.audio.pause();
  }

  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.updateState({ isPlaying: false, currentTime: 0 });
  }

  seek(time: number): void {
    this.audio.currentTime = time;
  }

  setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  togglePlay(): void {
    if (this.audioStateSubject.value.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  playTrackById(id: string): void {
    const track = this.getTrackById(id);
    if (track) {
      this.loadTrack(track);
      this.play();
    }
  }
}
