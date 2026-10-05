// Papel: calcular pontos/saldo e executar trocas disponibilizando esse estado às telas.
// Motivo: manter as regras de recompensa em um único lugar compartilhado pelo app.
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Product, Redemption } from '@/@types/rewards';
import { useAuth } from '@/context/AuthContext';
import { useRoutes } from '@/context/RoutesContext';
import { loadRedemptions, saveRedemptions } from '@/services/rewardsStorage';

// Regra de pontuação: 1 ponto a cada 10 metros percorridos
export const POINTS_PER_METER = 0.1;
// Converte uma distância em metros nos pontos inteiros que podem ser resgatados.
export const pointsFromDistance = (meters: number) => Math.floor(meters * POINTS_PER_METER);

interface RewardsContextData {
  earned: number;   // pontos ganhos nas rotas
  spent: number;    // pontos já trocados
  balance: number;  // saldo disponível
  redemptions: Redemption[];
  redeem: (product: Product) => Promise<void>;
}

const RewardsContext = createContext<RewardsContextData | null>(null);

export function RewardsProvider({ children }: { children: ReactNode }) {
  // Deriva pontos das rotas e carrega o histórico de resgates do usuário atual.
  const { user } = useAuth();
  const { routes } = useRoutes();
  const userId = user?.userId ?? '';
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);

  useEffect(() => {
    if (userId) loadRedemptions(userId).then(setRedemptions);
  }, [userId]);

  const value = useMemo<RewardsContextData>(() => {
    const earned = routes.reduce((sum, r) => sum + pointsFromDistance(r.distanceMeters), 0);
    const spent = redemptions.reduce((sum, r) => sum + r.cost, 0);
    const balance = Math.max(0, earned - spent);

    async function redeem(product: Product) {
      // Impede saldo negativo e salva o novo resgate antes de atualizar o estado visível.
      if (balance < product.cost) throw new Error('Pontos insuficientes para esta troca.');
      const redemption: Redemption = {
        id: String(Date.now()),
        productId: product.id,
        productName: product.name,
        cost: product.cost,
        redeemedAt: new Date().toISOString(),
      };
      const next = [redemption, ...redemptions];
      await saveRedemptions(userId, next);
      setRedemptions(next);
    }

    return { earned, spent, balance, redemptions, redeem };
  }, [routes, redemptions, userId]);

  return <RewardsContext.Provider value={value}>{children}</RewardsContext.Provider>;
}

export function useRewards() {
  // Permite que telas leiam o saldo e solicitem trocas sem conhecer o armazenamento.
  const ctx = useContext(RewardsContext);
  if (!ctx) throw new Error('useRewards requer RewardsProvider.');
  return ctx;
}