// Papel: fornecer trajetos estáticos usados como demonstração visual na web.
// Motivo: ilustrar mapas de perfil quando o navegador não possui rotas locais do celular.
import type { RouteRecord } from '@/@types/route';

export const demoRoutes: RouteRecord[] = [
  {
    id: 'demo-route-1',
    name: 'Caminhada de demonstração',
    notes: 'Trajeto fictício para demonstrar a visualização do mapa.',
    points: [
      { latitude: -23.55052, longitude: -46.63330, timestamp: 0 },
      { latitude: -23.55002, longitude: -46.63280, timestamp: 1 },
      { latitude: -23.54948, longitude: -46.63227, timestamp: 2 },
      { latitude: -23.54897, longitude: -46.63178, timestamp: 3 },
    ],
    distanceMeters: 250,
    createdAt: '2026-01-15T12:00:00.000Z',
  },
  {
    id: 'demo-route-2',
    name: 'Percurso de demonstração',
    notes: 'Este caminho também é apenas ilustrativo.',
    points: [
      { latitude: -23.55610, longitude: -46.63910, timestamp: 0 },
      { latitude: -23.55568, longitude: -46.63848, timestamp: 1 },
      { latitude: -23.55525, longitude: -46.63783, timestamp: 2 },
      { latitude: -23.55486, longitude: -46.63720, timestamp: 3 },
    ],
    distanceMeters: 230,
    createdAt: '2026-01-10T12:00:00.000Z',
  },
];
