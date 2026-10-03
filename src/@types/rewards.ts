export interface Product {
  id: string;
  name: string;
  description: string;
  cost: number; // custo em pontos
  emoji: string;
}

export interface Redemption {
  id: string;
  productId: string;
  productName: string;
  cost: number;
  redeemedAt: string;
}