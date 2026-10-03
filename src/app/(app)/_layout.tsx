import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { RewardsProvider } from '@/context/RewardsContext';
import { RoutesProvider } from '@/context/RoutesContext';

// Guarda de rota: sem sessão, volta para o login
export default function AppLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Redirect href="/" />;
  return (
    <RoutesProvider>
      <RewardsProvider>
        <ProfileProvider>
          <Stack screenOptions={{ headerTintColor: '#2F5D3A', headerTitleAlign: 'center' }}>
            <Stack.Screen name="home" options={{ title: 'Minhas rotas' }} />
            <Stack.Screen name="record" options={{ title: 'Gravar rota' }} />
            <Stack.Screen name="route/[id]" options={{ title: 'Detalhes' }} />
            <Stack.Screen name="rewards" options={{ title: 'Trocar pontos' }} />
            <Stack.Screen name="profile" options={{ title: 'Meu perfil' }} />
          </Stack>
        </ProfileProvider>
      </RewardsProvider>
    </RoutesProvider>
  );
}