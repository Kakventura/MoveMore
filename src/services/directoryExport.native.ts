import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import type { RouteRecord } from '@/@types/route';

const SAF = FileSystem.StorageAccessFramework;
let directoryUri: string | null = null;

export const hasDirectory = () => directoryUri !== null;

// Android: Storage Access Framework abre o seletor de pastas do sistema.
export async function pickDirectory(): Promise<string> {
  if (Platform.OS !== 'android') return FileSystem.documentDirectory ?? '';
  const result = await SAF.requestDirectoryPermissionsAsync();
  if (!result.granted) throw new Error('Nenhuma pasta foi autorizada.');
  directoryUri = result.directoryUri;
  return directoryUri;
}

export async function exportRoute(route: RouteRecord): Promise<string> {
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
