// Papel: organizar a navegação da área autenticada e instalar os contextos de rotas e recompensas.
// Motivo: manter menu, proteção de acesso e dados compartilhados num ponto comum às telas logadas.
import { Redirect, Stack, usePathname, useRouter } from 'expo-router';
import { Platform, Pressable, View } from 'react-native';
import { AppText as Text } from '@/components/AppText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, type IconName } from '@/components/Icon';
import { Colors } from '@/constants/colors';
import { BrandLogo } from '@/components/BrandLogo';
import { useAuth } from '@/context/AuthContext';
import { RewardsProvider } from '@/context/RewardsContext';
import { RoutesProvider } from '@/context/RoutesContext';

const tabs: { label: string; path: '/home' | '/record' | '/rewards' | '/profile'; icon: IconName }[] = [
  { label: 'Rotas', path: '/home', icon: 'map-marker-path' },
  { label: 'Gravar', path: '/record', icon: 'camera-outline' },
  { label: 'Trocas', path: '/rewards', icon: 'gift-outline' },
  { label: 'Perfil', path: '/profile', icon: 'account-outline' },
];

function BottomTabs({ pathname }: { pathname: string }) {
  // Desenha a navegação inferior mobile e destaca a seção correspondente à rota atual.
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: Colors.white,
      borderTopWidth: 1,
      borderTopColor: Colors.line,
      paddingTop: 8,
      paddingBottom: Math.max(insets.bottom, 10),
      paddingHorizontal: 8,
      shadowColor: Colors.forest,
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: -4 },
      elevation: 12,
    }}>
      {tabs.map(({ label, path, icon }) => {
        const selected = path === '/home' ? pathname === '/home' || pathname.startsWith('/route') : pathname === path;
        return (
          <Pressable
            key={path}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ selected }}
            onPress={() => router.navigate(path)}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <View style={{
              width: 60, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
              backgroundColor: selected ? '#F3E8FA' : 'transparent',
            }}>
              <Icon name={selected ? (icon.replace('-outline', '') as IconName) : icon} size={24} color={selected ? Colors.violet : Colors.muted} />
            </View>
            <Text style={{ fontSize: 13, marginTop: 2, fontWeight: selected ? '700' : '400', color: selected ? Colors.violet : Colors.muted }}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function AppNavigation() {
  // Adapta a navegação entre navegador e celular e registra as telas da área logada.
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  if (isWeb && pathname !== '/profile' && pathname !== '/rewards') {
    return <Redirect href="/rewards" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.sand }}>
      <View style={{ backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.line, paddingTop: isWeb ? 0 : insets.top }}>
        <View style={{
          width: '100%',
          maxWidth: 1120,
          alignSelf: 'center',
          minHeight: isWeb ? 72 : 60,
          paddingHorizontal: 24,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}>
          <BrandLogo />
          {isWeb ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Abrir trocas"
                accessibilityState={{ selected: pathname === '/rewards' }}
                onPress={() => router.replace('/rewards')}
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 11,
                  borderRadius: 8,
                  backgroundColor: pathname === '/rewards' ? Colors.forest : 'transparent',
                }}
              >
                <Text style={{ color: pathname === '/rewards' ? Colors.white : Colors.forest, fontWeight: '600' }}>
                  Trocas
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Abrir perfil"
                accessibilityState={{ selected: pathname === '/profile' }}
                onPress={() => router.replace('/profile')}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: pathname === '/profile' ? Colors.forest : Colors.sand,
                  borderWidth: 1,
                  borderColor: Colors.line,
                }}
              >
                <View style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: pathname === '/profile' ? Colors.white : Colors.forest,
                  marginBottom: 3,
                }} />
                <View style={{
                  width: 20,
                  height: 10,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  backgroundColor: pathname === '/profile' ? Colors.white : Colors.forest,
                }} />
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" />
        <Stack.Screen name="record" />
        <Stack.Screen name="route/[id]" />
        <Stack.Screen name="rewards" />
        <Stack.Screen name="profile" />
      </Stack>
      {!isWeb && <BottomTabs pathname={pathname} />}
    </View>
  );
}

// Guarda de rota: sem sessão, volta para o login
export default function AppLayout() {
  // Impede acesso à área principal sem sessão e fornece os estados usados por suas telas.
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