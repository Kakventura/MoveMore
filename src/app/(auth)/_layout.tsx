import { Redirect, Stack } from 'expo-router';
import { Platform } from 'react-native';
import { useAuth } from '@/context/AuthContext';

// Quem já está logado não vê login/cadastro
export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Redirect href={Platform.OS === 'web' ? '/rewards' : '/home'} />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
