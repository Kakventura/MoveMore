// Papel: escolher uma pasta do navegador e exportar nela os dados JSON de uma rota.
// Motivo: oferecer exportação web usando File System Access API, sem depender do sistema nativo.
import type { RouteRecord } from '@/@types/route';

// File System Access API (Chrome/Edge). Sem suporte, cai para download.
let directory: any = null;

// Indica se o navegador já concedeu acesso a uma pasta nesta sessão.
export const hasDirectory = () => directory !== null;

export async function pickDirectory(): Promise<string> {
  // Abre o seletor de diretório suportado por navegadores compatíveis.
  const picker = (window as any).showDirectoryPicker;
  if (!picker) throw new Error('Este navegador não permite escolher pasta. Use Chrome ou Edge.');
  directory = await picker({ mode: 'readwrite' });
  return directory.name;
}

export async function exportRoute(route: RouteRecord): Promise<string> {
  // Cria ou substitui o arquivo JSON da rota no diretório autorizado pelo usuário.
  const name = `rota-${route.id}.json`;
  const content = JSON.stringify(route, null, 2);
  if (!directory) await pickDirectory();
  const handle = await directory.getFileHandle(name, { create: true });
  const writable = await handle.createWritable();
  await writable.write(content);
  await writable.close();
  return name;
}
