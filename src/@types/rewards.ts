// Papel: definir os formatos de catálogo de produtos e de resgates de pontos.
// Motivo: compartilhar contratos tipados entre telas, contextos e armazenamento de recompensas.
import type { IconName } from '@/components/Icon';

export interface Product {
  id: string;
  name: string;
  description: string;
  cost: number; // custo em pontos
  icon: IconName; // nome do ícone (MaterialCommunityIcons)
}

export interface Redemption {
  id: string;
  productId: string;
  productName: string;
  cost: number;
  redeemedAt: string;
}