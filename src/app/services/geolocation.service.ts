import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Position {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface MuseumRoom {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  audioTrackId: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  private currentPositionSubject = new BehaviorSubject<Position | null>(null);
  private currentRoomSubject = new BehaviorSubject<MuseumRoom | null>(null);
  private watchId: number | null = null;

  public currentPosition$: Observable<Position | null> = this.currentPositionSubject.asObservable();
  public currentRoom$: Observable<MuseumRoom | null> = this.currentRoomSubject.asObservable();

  // Egyptian Museum of Turin coordinates (example)
  // In a real application, these would be actual GPS coordinates or beacon-based positioning
  private readonly rooms: MuseumRoom[] = [
    {
      id: '1',
      name: 'Entrance Hall',
      description: 'Welcome to the Egyptian Museum of Turin',
      latitude: 45.0677,
      longitude: 7.6847,
      radius: 15,
      audioTrackId: '1'
    },
    {
      id: '2',
      name: 'Room 1: Ancient Kingdom',
      description: 'Artifacts from 3100-2181 BC',
      latitude: 45.0678,
      longitude: 7.6848,
      radius: 10,
      audioTrackId: '2'
    },
    {
      id: '3',
      name: 'Room 2: Middle Kingdom',
      description: 'Artifacts from 2055-1650 BC',
      latitude: 45.0679,
      longitude: 7.6849,
      radius: 10,
      audioTrackId: '3'
    },
    {
      id: '4',
      name: 'Room 3: New Kingdom',
      description: 'Artifacts from 1550-1077 BC',
      latitude: 45.0680,
      longitude: 7.6850,
      radius: 10,
      audioTrackId: '4'
    },
    {
      id: '5',
      name: 'Room 4: Tutankhamun Exhibition',
      description: 'Special exhibition dedicated to the Boy King',
      latitude: 45.0681,
      longitude: 7.6851,
      radius: 10,
      audioTrackId: '5'
    }
  ];

  constructor() {}

  startTracking(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      // Request high accuracy positioning
      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const pos: Position = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          
          this.currentPositionSubject.next(pos);
          this.updateCurrentRoom(pos);
          resolve();
        },
        (error) => {
          console.error('Error getting location:', error);
          reject(error);
        },
        options
      );
    });
  }

  stopTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.currentPositionSubject.next(null);
      this.currentRoomSubject.next(null);
    }
  }

  private updateCurrentRoom(position: Position): void {
    const currentRoom = this.findNearestRoom(position);
    if (currentRoom) {
      const previousRoom = this.currentRoomSubject.value;
      if (!previousRoom || previousRoom.id !== currentRoom.id) {
        this.currentRoomSubject.next(currentRoom);
      }
    }
  }

  private findNearestRoom(position: Position): MuseumRoom | null {
    let nearestRoom: MuseumRoom | null = null;
    let minDistance = Infinity;

    for (const room of this.rooms) {
      const distance = this.calculateDistance(
        position.latitude,
        position.longitude,
        room.latitude,
        room.longitude
      );

      if (distance <= room.radius && distance < minDistance) {
        minDistance = distance;
        nearestRoom = room;
      }
    }

    return nearestRoom;
  }

  // Haversine formula to calculate distance between two GPS coordinates
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  getRooms(): MuseumRoom[] {
    return this.rooms;
  }

  getCurrentPosition(): Position | null {
    return this.currentPositionSubject.value;
  }

  getCurrentRoom(): MuseumRoom | null {
    return this.currentRoomSubject.value;
  }

  // Simulate room detection for testing purposes (when GPS is not available)
  simulateRoomEntry(roomId: string): boolean {
    const room = this.rooms.find(r => r.id === roomId);
    if (room) {
      this.currentRoomSubject.next(room);
      return true;
    } else {
      console.warn(`Room with id '${roomId}' not found`);
      return false;
    }
  }
}
