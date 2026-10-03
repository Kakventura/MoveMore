export interface RoutePoint { latitude: number; longitude: number; timestamp: number; accuracy?: number }

export interface RouteRecord {
  id: string;
  name: string;
  notes: string;
  points: RoutePoint[];
  distanceMeters: number;
  createdAt: string;
}

export type DraftRoute = Pick<RouteRecord, 'name' | 'notes' | 'points' | 'distanceMeters'>;
