// Papel: encapsular as chamadas HTTP de login/cadastro/logout e validar a resposta de login.
// Motivo: manter detalhes da API externa fora da interface e do estado de autenticação.
import axios from 'axios';

// LINK API DE AUTENTICAÇÃO
export const AUTH_API_URL =
  process.env.EXPO_PUBLIC_AUTH_API_URL?.replace(/\/$/, '') ||
  'https://login-p26w.onrender.com/fatec/login';

// withCredentials: o navegador/Android guarda e reenvia o cookie da sessão.
// O cookie é HttpOnly (criado pela API): o app nunca lê nem guarda o JWT.
const authApi = axios.create({ baseURL: AUTH_API_URL, withCredentials: true });

export interface RegisterInput { username: string; password: string; email: string; cep: string }
export interface AuthenticatedUser { userId: string; username: string; roles: string[] }

//VALIDAÇÃO DE USUÁRIO AUTENTICADO
function isAuthenticatedUser(v: unknown): v is AuthenticatedUser {
  // Confere o formato mínimo esperado antes de tratar a resposta remota como usuário autenticado.
  const u = v as Partial<AuthenticatedUser> | null;
  return !!u && typeof u.userId === 'string' && typeof u.username === 'string' && Array.isArray(u.roles);
}


// REQUISIÇÃO DE LOGIN
export async function loginAuthUser(username: string, password: string) {
  // Envia credenciais à API e rejeita respostas que não representam uma sessão válida.
  const { data } = await authApi.post<AuthenticatedUser>('/v1/auth', { username, password });
  if (!isAuthenticatedUser(data)) throw new Error('A API retornou uma sessão inválida.');
  return data;
}


//NA HIPOTESE DE ADICIONAR UM NOVE FUNCIONÁRIO
export async function registerAuthUser(input: RegisterInput) {
  // Solicita à API externa a criação da conta com os dados informados.
  await authApi.post('/v1/create', input);
}

// SAIR DA CONTA -- NÃO USADO
export async function logoutAuthUser() {
  // Solicita ao servidor que encerre o cookie/sessão de autenticação.
  await authApi.post('/v1/auth/logout');
}
