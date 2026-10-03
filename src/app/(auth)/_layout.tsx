import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

// Quem já está logado não vê login/cadastro
export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Redirect href="/home" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
