import type { RoutePoint } from '@/@types/route';

// Fórmula de Haversine: distância entre dois pontos da Terra, em metros
export function distanceBetween(a: RoutePoint, b: RoutePoint): number {
  const R = 6371000;
  const rad = (x: number) => (x * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLng = rad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export const totalDistance = (points: RoutePoint[]) =>
  points.slice(1).reduce((sum, p, i) => sum + distanceBetween(points[i], p), 0);

export const formatDistance = (m: number) =>
  m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`;
