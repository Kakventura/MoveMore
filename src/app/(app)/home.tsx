// Papel: apresentar o início da área autenticada com saldo, atalhos e lista de rotas.
// Motivo: reunir as ações mais frequentes do usuário num ponto de entrada após o login.
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { AppText as Text } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { useRoutes } from '@/context/RoutesContext';
import { Colors, Radius } from '@/constants/colors';
import { pickDirectory } from '@/services/directoryExport';
import { formatDistance } from '@/utils/distance';
import { notify } from '@/messages/feedback';
import { useRewards } from '@/context/RewardsContext';

export default function Home() {
  // Combina dados dos contextos com a navegação para montar o resumo pessoal.
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { routes, loading } = useRoutes();
  const { balance } = useRewards();

  async function chooseFolder() {
    // Permite escolher a pasta em que as próximas rotas exportadas serão gravadas.
    try { notify(`Pasta selecionada: ${await pickDirectory()}`); }
    catch (e) { notify((e as Error).message); }
  }

  return (
    <Screen>
      <Text style={{ fontSize: 30, fontWeight: '700', color: Colors.ink, marginTop: 8 }}>Olá, {user?.username}</Text>
      <Text style={{ fontSize: 17, color: Colors.muted, marginBottom: 16 }}>Pronto para mais uma caminhada?</Text>

      <Pressable onPress={() => router.push('/rewards')}
        style={{ backgroundColor: Colors.forest, borderRadius: Radius.lg, padding: 22, overflow: 'hidden', marginBottom: 12 }}>
        <View style={{ position: 'absolute', right: -30, top: -30, width: 130, height: 130, borderRadius: 65, backgroundColor: Colors.orange, opacity: 0.9 }} />
        <Text style={{ color: '#E9D8F5', fontSize: 16 }}>Seus pontos</Text>
        <Text style={{ color: Colors.white, fontSize: 46, fontWeight: '700' }}>{balance}</Text>
        <Text style={{ color: Colors.orange, fontSize: 16, fontWeight: '700' }}>Ver prêmios para trocar</Text>
      </Pressable>

      <AppButton title="Gravar nova rota" onPress={() => router.push('/record')} />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}><AppButton title="Meu perfil" variant="soft" onPress={() => router.push('/profile')} /></View>
        <View style={{ flex: 1 }}><AppButton title="Pasta de destino" variant="soft" onPress={chooseFolder} /></View>
      </View>

      <Text style={{ fontSize: 22, fontWeight: '700', color: Colors.ink, marginTop: 24, marginBottom: 6 }}>Rotas salvas</Text>
      {loading && <ActivityIndicator color={Colors.forest} />}
      {!loading && routes.length === 0 && (
        <Card><Text style={{ color: Colors.muted, fontSize: 17 }}>Nenhuma rota ainda. Toque em "Gravar nova rota" para começar.</Text></Card>
      )}
      {routes.map((r) => (
        <Pressable key={r.id} onPress={() => router.push({ pathname: '/route/[id]', params: { id: r.id } })}>
          <Card style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', fontSize: 18, color: Colors.ink }}>{r.name}</Text>
              <Text style={{ color: Colors.muted, fontSize: 15 }}>{new Date(r.createdAt).toLocaleDateString('pt-BR')} · {r.points.length} pontos</Text>
            </View>
            <View style={{ backgroundColor: '#F3E8FA', borderRadius: Radius.sm, paddingHorizontal: 12, paddingVertical: 8 }}>
              <Text style={{ color: Colors.violet, fontWeight: '700', fontSize: 16 }}>{formatDistance(r.distanceMeters)}</Text>
            </View>
          </Card>
        </Pressable>
      ))}
      <View style={{ marginTop: 24 }}><AppButton title="Sair" variant="outline" onPress={signOut} /></View>
    </Screen>
  );
}