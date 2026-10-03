import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RouteRecord } from '@/@types/route';

// Um "banco" por usuário. AsyncStorage funciona no Android e na web.
const key = (userId: string) => `@diario-rotas/${userId}/routes`;

export async function loadRoutes(userId: string): Promise<RouteRecord[]> {
  const raw = await AsyncStorage.getItem(key(userId));
  return raw ? (JSON.parse(raw) as RouteRecord[]) : [];
}

export const saveRoutes = (userId: string, routes: RouteRecord[]) =>
  AsyncStorage.setItem(key(userId), JSON.stringify(routes));
