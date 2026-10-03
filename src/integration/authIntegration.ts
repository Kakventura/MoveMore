import axios from 'axios';

export const AUTH_API_URL =
  process.env.EXPO_PUBLIC_AUTH_API_URL?.replace(/\/$/, '') ||
  'https://login-p26w.onrender.com/fatec/login';

// withCredentials: o navegador/Android guarda e reenvia o cookie da sessão.
// O cookie é HttpOnly (criado pela API): o app nunca lê nem guarda o JWT.
const authApi = axios.create({ baseURL: AUTH_API_URL, withCredentials: true });

export interface RegisterInput { username: string; password: string; email: string; cep: string }
export interface AuthenticatedUser { userId: string; username: string; roles: string[] }

function isAuthenticatedUser(v: unknown): v is AuthenticatedUser {
  const u = v as Partial<AuthenticatedUser> | null;
  return !!u && typeof u.userId === 'string' && typeof u.username === 'string' && Array.isArray(u.roles);
}

export async function loginAuthUser(username: string, password: string) {
  const { data } = await authApi.post<AuthenticatedUser>('/v1/auth', { username, password });
  if (!isAuthenticatedUser(data)) throw new Error('A API retornou uma sessão inválida.');
  return data;
}

export async function registerAuthUser(input: RegisterInput) {
  await authApi.post('/v1/create', input);
}

export async function logoutAuthUser() {
  await authApi.post('/v1/auth/logout');
}
