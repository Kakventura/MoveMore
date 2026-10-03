import { Redirect, Stack, usePathname, useRouter } from 'expo-router';
import { Platform, Pressable, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { RewardsProvider } from '@/context/RewardsContext';
import { RoutesProvider } from '@/context/RoutesContext';

function WebApp() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname !== '/profile' && pathname !== '/rewards') {
    return <Redirect href="/profile" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.sand }}>
      <View style={{ backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.line }}>
        <View style={{
          width: '100%',
          maxWidth: 1120,
          alignSelf: 'center',
          minHeight: 72,
          paddingHorizontal: 24,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}>
          <Text style={{ color: Colors.forest, fontSize: 22, fontWeight: '700' }}>MoveMore</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[
              { label: 'Perfil', path: '/profile' as const },
              { label: 'Trocas', path: '/rewards' as const },
            ].map(({ label, path }) => {
              const selected = pathname === path;
              return (
                <Pressable
                  key={path}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => router.replace(path)}
                  style={{
                    paddingHorizontal: 18,
                    paddingVertical: 11,
                    borderRadius: 8,
                    backgroundColor: selected ? Colors.forest : 'transparent',
                  }}
                >
                  <Text style={{ color: selected ? Colors.white : Colors.forest, fontWeight: '600' }}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" />
        <Stack.Screen name="record" />
        <Stack.Screen name="route/[id]" />
        <Stack.Screen name="rewards" />
        <Stack.Screen name="profile" />
      </Stack>
    </View>
  );
}

// Guarda de rota: sem sessão, volta para o login
export default function AppLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Redirect href="/" />;
  return (
    <RoutesProvider>
      <RewardsProvider>
        {Platform.OS === 'web' ? (
          <WebApp />
        ) : (
          <Stack screenOptions={{ headerTintColor: Colors.forest, headerTitleAlign: 'center' }}>
            <Stack.Screen name="home" options={{ title: 'Minhas rotas' }} />
            <Stack.Screen name="record" options={{ title: 'Gravar rota' }} />
            <Stack.Screen name="route/[id]" options={{ title: 'Detalhes' }} />
            <Stack.Screen name="rewards" options={{ title: 'Trocar pontos' }} />
            <Stack.Screen name="profile" options={{ title: 'Meu perfil' }} />
          </Stack>
        )}
      </RewardsProvider>
    </RoutesProvider>
  );
}