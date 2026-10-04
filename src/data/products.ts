import type { Product } from '@/@types/rewards';

// MOCK do catálogo de produtos (simula a tabela "produtos" do banco)
export const products: Product[] = [
  { id: 'p1', name: 'Garrafa térmica', description: 'Garrafa de aço 500 ml para suas caminhadas.', cost: 150, icon: 'bottle-tonic-outline' },
  { id: 'p2', name: 'Boné esportivo', description: 'Boné leve com proteção UV.', cost: 250, icon: 'hat-fedora' },
  { id: 'p3', name: 'Mochila de trilha', description: 'Mochila 20 L resistente à água.', cost: 500, icon: 'bag-personal-outline' },
  { id: 'p4', name: 'Tênis de corrida', description: 'Tênis com amortecimento para longas distâncias.', cost: 1000, icon: 'shoe-sneaker' },
  { id: 'p5', name: 'Relógio com GPS', description: 'Relógio esportivo para medir seus percursos.', cost: 2000, icon: 'watch-variant' },
];