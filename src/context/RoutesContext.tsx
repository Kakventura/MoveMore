import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { DraftRoute, RouteRecord } from '@/@types/route';
import { useAuth } from '@/context/AuthContext';
import { loadRoutes, saveRoutes } from '@/services/routesStorage';

interface RoutesContextData {
  routes: RouteRecord[];
  loading: boolean;
  createRoute: (draft: DraftRoute) => Promise<RouteRecord>;                         // C
  updateRoute: (id: string, patch: Partial<Pick<RouteRecord, 'name' | 'notes'>>) => Promise<void>; // U
  deleteRoute: (id: string) => Promise<void>;                                       // D
}

const RoutesContext = createContext<RoutesContextData | null>(null);

export function RoutesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.userId ?? '';
  const [routes, setRoutes] = useState<RouteRecord[]>([]);   // R
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    loadRoutes(userId).then(setRoutes).finally(() => setLoading(false));
  }, [userId]);

  const persist = useCallback(async (next: RouteRecord[]) => {
    await saveRoutes(userId, next);
    setRoutes(next);
  }, [userId]);

  const value = useMemo<RoutesContextData>(() => ({
    routes, loading,
    createRoute: async (draft) => {
      const route: RouteRecord = { ...draft, id: String(Date.now()), createdAt: new Date().toISOString() };
      await persist([route, ...routes]);
      return route;
    },
    updateRoute: (id, patch) => persist(routes.map((r) => (r.id === id ? { ...r, ...patch } : r))),
    deleteRoute: (id) => persist(routes.filter((r) => r.id !== id)),
  }), [routes, loading, persist]);

  return <RoutesContext.Provider value={value}>{children}</RoutesContext.Provider>;
}

export function useRoutes() {
  const ctx = useContext(RoutesContext);
  if (!ctx) throw new Error('useRoutes requer RoutesProvider.');
  return ctx;
}
