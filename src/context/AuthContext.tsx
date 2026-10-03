import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  loginAuthUser, logoutAuthUser, registerAuthUser,
  type AuthenticatedUser, type RegisterInput,
} from '@/integration/authIntegration';

interface AuthContextData {
  isAuthenticated: boolean;
  user: AuthenticatedUser | null;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (input: RegisterInput) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);

  const value = useMemo<AuthContextData>(() => ({
    isAuthenticated: !!user,
    user,
    signIn: async (username, password) => setUser(await loginAuthUser(username, password)),
    signUp: async (input) => {
      await registerAuthUser(input);
      setUser(await loginAuthUser(input.username, input.password));
    },
    signOut: async () => {
      setUser(null);
      try { await logoutAuthUser(); } catch { /* sessão expira no servidor */ }
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth requer AuthProvider.');
  return ctx;
}
