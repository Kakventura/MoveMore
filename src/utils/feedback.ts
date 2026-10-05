// TRADUTOR DE ERROS

// Papel: centralizar avisos, confirmações e mensagens amigáveis para erros de autenticação.
// Motivo: adaptar o feedback às diferenças entre navegador e celular e evitar mensagens técnicas cruas.
import { Alert, Platform } from 'react-native';
import axios from 'axios';

// Alert.alert não funciona na web, por isso o desvio por plataforma
export function confirmAction(message: string): Promise<boolean> {
  // Usa confirmação nativa no celular e a confirmação do navegador na web.
  if (Platform.OS === 'web') return Promise.resolve(window.confirm(message));
  return new Promise((resolve) =>
    Alert.alert('Confirmar', message, [
      { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
      { text: 'Confirmar', style: 'destructive', onPress: () => resolve(true) },
    ]));
}

export function notify(message: string) {
  // Mostra um aviso na plataforma atual.
  if (Platform.OS === 'web') window.alert(message);
  else Alert.alert('Aviso', message);
}

// ERRO DA API
export function authErrorMessage(error: unknown): string {
  // Traduz respostas comuns da API para mensagens que orientam o usuário.
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    const apiMessage = typeof data === 'string' ? data : data?.message;
    if (apiMessage) return apiMessage;
    if (error.response?.status === 401 || error.response?.status === 403) return 'Usuário ou senha inválidos.';
    if (error.message === 'Network Error') return 'Sem acesso à API. O serviço no Render pode levar ~1 min para acordar; tente de novo.';
  }
  return error instanceof Error ? error.message : 'Não foi possível concluir a ação.';
}
