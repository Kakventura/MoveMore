// Papel: ler e gravar o histórico de trocas no armazenamento local.
// Motivo: isolar a persistência por usuário das regras de saldo e da interface de recompensas.
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Redemption } from '@/@types/rewards';

// Histórico de trocas, separado por usuário
const key = (userId: string) => `@diario-rotas/${userId}/redemptions`;

export async function loadRedemptions(userId: string): Promise<Redemption[]> {
  // Recupera e converte o histórico armazenado para os registros tipados da aplicação.
  const raw = await AsyncStorage.getItem(key(userId));
  return raw ? (JSON.parse(raw) as Redemption[]) : [];
}

// Persiste o histórico atualizado sob a chave específica do usuário.
export const saveRedemptions = (userId: string, list: Redemption[]) =>
  AsyncStorage.setItem(key(userId), JSON.stringify(list));