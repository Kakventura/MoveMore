// A web resolve directoryExport.web.ts; Android/iOS usam o nativo.
// Motivo: manter uma importação comum enquanto o Expo seleciona a implementação da plataforma.
export { pickDirectory, exportRoute, hasDirectory } from './directoryExport.native';
