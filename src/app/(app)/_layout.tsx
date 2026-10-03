import { Redirect, Stack, usePathname, useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { BrandLogo } from '@/components/BrandLogo';
import { useAuth } from '@/context/AuthContext';
import { RewardsProvider } from '@/context/RewardsContext';
import { RoutesProvider } from '@/context/RoutesContext';

function AppNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const isWeb = Platform.OS === 'web';
  const menuItems = isWeb
    ? [
        { label: 'Perfil', path: '/profile' as const },
        { label: 'Trocas', path: '/rewards' as const },
      ]
    : [
        { label: 'Início · minhas rotas', path: '/home' as const },
        { label: 'Gravar rota', path: '/record' as const },
        { label: 'Trocas', path: '/rewards' as const },
        { label: 'Perfil', path: '/profile' as const },
      ];

  if (isWeb && pathname !== '/profile' && pathname !== '/rewards') {
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
          <BrandLogo />
          {isWeb ? (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {menuItems.map(({ label, path }) => {
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
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              accessibilityState={{ expanded: menuOpen }}
              onPress={() => setMenuOpen((open) => !open)}
              style={{ padding: 10, borderRadius: 8, backgroundColor: Colors.sand }}
            >
              <Text style={{ color: Colors.forest, fontSize: 16, fontWeight: '700' }}>
                {menuOpen ? 'Fechar ×' : '☰ Menu'}
              </Text>
            </Pressable>
          )}
        </View>
        {!isWeb && menuOpen && (
          <View style={{ paddingHorizontal: 20, paddingBottom: 12, backgroundColor: Colors.white }}>
            {menuItems.map(({ label, path }) => {
              const selected = pathname === path;
              return (
                <Pressable
                  key={path}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    setMenuOpen(false);
                    router.push(path);
                  }}
                  style={{
                    paddingVertical: 13,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    marginTop: 4,
                    backgroundColor: selected ? Colors.sand : Colors.white,
                  }}
                >
                  <Text style={{ color: selected ? Colors.violet : Colors.forest, fontWeight: '600' }}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
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
        <AppNavigation />
      </RewardsProvider>
    </RoutesProvider>
  );
}