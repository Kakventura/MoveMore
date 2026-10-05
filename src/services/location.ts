// INTEGRAÇÃO DO GPS
// Motivo: separar permissões e leitura contínua de localização da lógica da tela de gravação.
import * as Location from 'expo-location';
import type { RoutePoint } from '@/@types/route';

export async function requestLocationAccess() {
  // Confirma permissão em primeiro plano e disponibilidade dos serviços de localização.
  const { granted } = await Location.requestForegroundPermissionsAsync();
  if (!granted) throw new Error('Acesso à localização negado. Autorize nas configurações.');
  if (!(await Location.hasServicesEnabledAsync())) throw new Error('Ative o GPS do dispositivo.');
}

const toPoint = (pos: Location.LocationObject): RoutePoint => ({
  latitude: pos.coords.latitude,
  longitude: pos.coords.longitude,
  timestamp: pos.timestamp,
  accuracy: pos.coords.accuracy ?? undefined,
});

const timeout = (ms: number) =>
  new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));

// Posição inicial para centralizar o mapa: usa a última posição recente (rápido)
// e, se não houver, pede uma leitura nova com limite de tempo.
export async function getCurrentPoint(): Promise<RoutePoint> {
  // Tenta primeiro uma posição recente e recorre a uma leitura nova com limite de espera.
  try {
    const recent = await Location.getLastKnownPositionAsync({ maxAge: 60000 });
    if (recent) return toPoint(recent);
  } catch { /* não suportado em algumas plataformas */ }
  try {
    const fresh = await Promise.race([
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
      timeout(20000),
    ]);
    return toPoint(fresh);
  } catch {
    throw new Error('Não foi possível obter sua localização. Verifique o sinal de GPS e tente novamente.');
  }
}

// Retorna a assinatura; quem chama deve usar subscription.remove() para parar.
export async function watchRoute(onPoint: (p: RoutePoint) => void) {
  // Entrega posições ao chamador até que ele remova a assinatura retornada.
  await requestLocationAccess();
  return Location.watchPositionAsync(
    { accuracy: Location.Accuracy.High, distanceInterval: 5, timeInterval: 3000 },
    (pos) => onPoint(toPoint(pos)),
  );
}
