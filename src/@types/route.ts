// Papel: descrever um ponto GPS, uma rota salva e os dados necessários para criar uma rota.
// Motivo: manter o mesmo formato de trajeto entre GPS, interface, persistência e exportação.
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
