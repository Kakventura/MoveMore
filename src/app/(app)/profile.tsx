import { ActivityIndicator, Platform, View } from 'react-native';
import { AppText as Text } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { ProfilePhoto } from '@/components/ProfilePhoto';
import { RouteMap } from '@/components/RouteMap';
import { Screen } from '@/components/Screen';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { useRewards } from '@/context/RewardsContext';
import { useRoutes } from '@/context/RoutesContext';
import { demoRoutes } from '@/data/demoRoutes';
import { formatDistance } from '@/utils/distance';

const card = {
  backgroundColor: Colors.white,
  borderWidth: 1,
  borderColor: Colors.line,
  borderRadius: 10,
  padding: 16,
};

export default function Profile() {
  const { user, signOut } = useAuth();
  const { routes, loading } = useRoutes();
  const { earned, balance, redemptions } = useRewards();
  const showingDemoRoutes = Platform.OS === 'web' && !loading && routes.length === 0;
  const visibleRoutes = showingDemoRoutes ? demoRoutes : routes;
  const totalDistance = routes.reduce((sum, route) => sum + route.distanceMeters, 0);
  const username = user?.username ?? 'Usuário';

  return (
    <Screen maxWidth={Platform.OS === 'web' ? 1120 : 560}>
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        {user && <ProfilePhoto userId={user.userId} username={username} />}
        <Text style={{ color: Colors.ink, fontSize: 24, fontWeight: '700' }}>
          {username}
        </Text>
        <Text style={{ color: Colors.muted, marginTop: 4 }}>Seu resumo no MoveMore</Text>
      </View>

      <Text style={{ color: Colors.ink, fontSize: 18, fontWeight: '600', marginBottom: 10 }}>
        Minha atividade
      </Text>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
        <View style={{ ...card, flex: 1 }}>
          <Text style={{ color: Colors.muted }}>Rotas salvas</Text>
          <Text style={{ color: Colors.forest, fontSize: 24, fontWeight: '700', marginTop: 6 }}>
            {routes.length}
          </Text>
        </View>
        <View style={{ ...card, flex: 1 }}>
          <Text style={{ color: Colors.muted }}>Distância total</Text>
          <Text style={{ color: Colors.forest, fontSize: 20, fontWeight: '700', marginTop: 6 }}>
            {formatDistance(totalDistance)}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
        <View style={{ ...card, flex: 1 }}>
          <Text style={{ color: Colors.muted }}>Pontos ganhos</Text>
          <Text style={{ color: Colors.forest, fontSize: 24, fontWeight: '700', marginTop: 6 }}>
            {earned}
          </Text>
        </View>
        <View style={{ ...card, flex: 1 }}>
          <Text style={{ color: Colors.muted }}>Pontos disponíveis</Text>
          <Text style={{ color: Colors.forest, fontSize: 24, fontWeight: '700', marginTop: 6 }}>
            {balance}
          </Text>
        </View>
      </View>

      <View style={card}>
        <Text style={{ color: Colors.ink, fontWeight: '600' }}>Trocas realizadas</Text>
        <Text style={{ color: Colors.muted, marginTop: 4 }}>
          {redemptions.length === 1
            ? '1 produto resgatado'
            : `${redemptions.length} produtos resgatados`}
        </Text>
      </View>

      <View style={{ marginTop: 24 }}>
        <AppButton title="Sair da conta" variant="outline" onPress={signOut} />
      </View>

      <View style={{ marginTop: 32 }}>
          <Text style={{ color: Colors.ink, fontSize: 20, fontWeight: '700', marginBottom: 12 }}>
            {showingDemoRoutes ? 'Trajetos de exemplo' : 'Caminhos das minhas rotas'}
          </Text>
          {showingDemoRoutes && (
            <Text style={{ color: Colors.muted, marginBottom: 12 }}>
              Estes caminhos são fictícios e servem apenas para demonstrar os mapas. Rotas gravadas no celular não são sincronizadas com este navegador.
            </Text>
          )}
          {loading && <ActivityIndicator color={Colors.forest} />}
          {!loading && visibleRoutes.map((route) => (
            <View key={route.id} style={{ ...card, marginBottom: 16 }}>
              <Text style={{ color: Colors.ink, fontSize: 17, fontWeight: '600' }}>{route.name}</Text>
              <Text style={{ color: Colors.muted, marginTop: 4, marginBottom: 12 }}>
                {new Date(route.createdAt).toLocaleString('pt-BR')} · {formatDistance(route.distanceMeters)}
              </Text>
              {route.points.length > 1 ? (
                <RouteMap center={route.points[0]} points={route.points} fit />
              ) : (
                <Text style={{ color: Colors.muted }}>Esta rota não tem pontos suficientes para exibir o caminho.</Text>
              )}
              {route.notes ? <Text style={{ color: Colors.muted }}>{route.notes}</Text> : null}
            </View>
          ))}
      </View>
    </Screen>
  );
}
