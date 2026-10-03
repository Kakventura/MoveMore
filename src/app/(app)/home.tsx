import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { AppText as Text } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { useRoutes } from '@/context/RoutesContext';
import { Colors } from '@/constants/colors';
import { pickDirectory } from '@/services/directoryExport';
import { formatDistance } from '@/utils/distance';
import { notify } from '@/utils/feedback';
import { useRewards } from '@/context/RewardsContext';

export default function Home() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { routes, loading } = useRoutes();
  const { balance } = useRewards();

  async function chooseFolder() {
    try { notify(`Pasta selecionada: ${await pickDirectory()}`); }
    catch (e) { notify((e as Error).message); }
  }

  return (
    <Screen>
      <Text style={{ fontSize: 22, fontWeight: '700', color: Colors.ink }}>Olá, {user?.username}</Text>
      <AppButton title="Meu perfil" variant="outline" onPress={() => router.push('/profile')} />
      <AppButton title="Gravar nova rota" onPress={() => router.push('/record')} />
      <AppButton title={`Trocar pontos (${balance} pts)`} variant="outline" onPress={() => router.push('/rewards')} />
      <AppButton title="Escolher pasta de destino" variant="outline" onPress={chooseFolder} />
      <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 8 }}>Rotas salvas</Text>
      {loading && <ActivityIndicator color={Colors.forest} />}
      {!loading && routes.length === 0 && <Text style={{ color: Colors.muted }}>Nenhuma rota ainda. Grave a primeira.</Text>}
      {routes.map((r) => (
        <Pressable key={r.id} onPress={() => router.push({ pathname: '/route/[id]', params: { id: r.id } })}
          style={{ backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.line, borderRadius: 8, padding: 14, marginVertical: 5 }}>
          <Text style={{ fontWeight: '600', fontSize: 16 }}>{r.name}</Text>
          <Text style={{ color: Colors.muted }}>
            {new Date(r.createdAt).toLocaleString('pt-BR')} · {r.points.length} pontos · {formatDistance(r.distanceMeters)}
          </Text>
        </Pressable>
      ))}
      <View style={{ marginTop: 24 }}><AppButton title="Sair" variant="outline" onPress={signOut} /></View>
    </Screen>
  );
}
