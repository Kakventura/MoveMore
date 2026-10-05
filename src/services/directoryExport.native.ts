// Papel: escolher uma pasta e exportar rotas como arquivos JSON em Android/iOS.
// Motivo: usar o seletor e o sistema de arquivos nativos, diferentes das APIs do navegador.
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import type { RouteRecord } from '@/@types/route';

const SAF = FileSystem.StorageAccessFramework;
let directoryUri: string | null = null;

// Indica se o usuário já autorizou uma pasta nesta sessão.
export const hasDirectory = () => directoryUri !== null;

// Android: Storage Access Framework abre o seletor de pastas do sistema.
// No iOS, o app usa por padrão seu diretório de documentos.
export async function pickDirectory(): Promise<string> {
  if (Platform.OS !== 'android') return FileSystem.documentDirectory ?? '';
  const result = await SAF.requestDirectoryPermissionsAsync();
  if (!result.granted) throw new Error('Nenhuma pasta foi autorizada.');
  directoryUri = result.directoryUri;
  return directoryUri;
}

export async function exportRoute(route: RouteRecord): Promise<string> {
  // Serializa a rota e grava no diretório escolhido ou no diretório de documentos do app.
  const content = JSON.stringify(route, null, 2);
  if (Platform.OS !== 'android') {
    const uri = `${FileSystem.documentDirectory}rota-${route.id}.json`;
    await FileSystem.writeAsStringAsync(uri, content);
    return uri;
  }
  if (!directoryUri) await pickDirectory();
  const fileUri = await SAF.createFileAsync(directoryUri!, `rota-${route.id}`, 'application/json');
  await FileSystem.writeAsStringAsync(fileUri, content);
  return fileUri;
}
