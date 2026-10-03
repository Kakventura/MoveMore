import type { RouteRecord } from '@/@types/route';

// File System Access API (Chrome/Edge). Sem suporte, cai para download.
let directory: any = null;

export const hasDirectory = () => directory !== null;

export async function pickDirectory(): Promise<string> {
  const picker = (window as any).showDirectoryPicker;
  if (!picker) throw new Error('Este navegador não permite escolher pasta. Use Chrome ou Edge.');
  directory = await picker({ mode: 'readwrite' });
  return directory.name;
}

export async function exportRoute(route: RouteRecord): Promise<string> {
  const name = `rota-${route.id}.json`;
  const content = JSON.stringify(route, null, 2);
  if (!directory) await pickDirectory();
  const handle = await directory.getFileHandle(name, { create: true });
  const writable = await handle.createWritable();
  await writable.write(content);
  await writable.close();
  return name;
}
