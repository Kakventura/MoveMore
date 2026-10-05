// Papel: organizar as telas públicas de autenticação e redirecionar usuários já conectados.
// Motivo: separar o fluxo de login/cadastro da área principal da aplicação.
import { Redirect, Stack } from 'expo-router';
import { Platform } from 'react-native';
import { useAuth } from '@/context/AuthContext';

// Quem já está logado não vê login/cadastro
export default function AuthLayout() {
  // Usuários autenticados seguem direto para o app; os demais veem as telas públicas.
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Redirect href={Platform.OS === 'web' ? '/rewards' : '/record'} />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
