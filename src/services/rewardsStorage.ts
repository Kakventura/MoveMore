import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Redemption } from '@/@types/reward';

// Histórico de trocas, separado por usuário
const key = (userId: string) => `@diario-rotas/${userId}/redemptions`;

export async function loadRedemptions(userId: string): Promise<Redemption[]> {
  const raw = await AsyncStorage.getItem(key(userId));
  return raw ? (JSON.parse(raw) as Redemption[]) : [];
}

export const saveRedemptions = (userId: string, list: Redemption[]) =>
  AsyncStorage.setItem(key(userId), JSON.stringify(list));