// ARMAZENAMENTO DE ROTAS NO CELULAR
// Motivo: separar leitura e gravação local das operações de CRUD oferecidas pelo contexto.
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RouteRecord } from '@/@types/route';

// AsyncStorage funciona no Android e na web.
const key = (userId: string) => `@diario-rotas/${userId}/routes`;

export async function loadRoutes(userId: string): Promise<RouteRecord[]> {
  // Recupera as rotas da conta atual; uma chave por usuário evita misturar registros.
  const raw = await AsyncStorage.getItem(key(userId));
  return raw ? (JSON.parse(raw) as RouteRecord[]) : [];
}

// Persiste a lista completa de rotas da conta atual em formato JSON.
export const saveRoutes = (userId: string, routes: RouteRecord[]) =>
  AsyncStorage.setItem(key(userId), JSON.stringify(routes));
