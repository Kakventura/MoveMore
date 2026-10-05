// Papel: exibir identidade, saldo, estatísticas e rotas associadas à conta.
// Motivo: oferecer uma visão consolidada da atividade e acesso para encerrar a sessão.
import { ActivityIndicator, Platform, View } from 'react-native';
import { AppText as Text } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { ProfilePhoto } from '@/components/ProfilePhoto';
import { RouteMap } from '@/components/RouteMap';
import { Screen } from '@/components/Screen';
import { StatTile } from '@/components/StatTile';
import { Colors, Radius } from '@/constants/colors';
import { useAuth } from '@/context/AuthContext';
import { useRewards } from '@/context/RewardsContext';
import { useRoutes } from '@/context/RoutesContext';
import { demoRoutes } from '@/data/demoRoutes';
import { formatDistance } from '@/utils/distance';

export default function Profile() {
  // Reúne informações dos contextos; na web, usa trajetos demonstrativos quando não há rotas locais.
  const { user, signOut } = useAuth();
  const { routes, loading } = useRoutes();
  const { earned, balance, redemptions } = useRewards();
  const showingDemoRoutes = Platform.OS === 'web' && !loading && routes.length === 0;
  const visibleRoutes = showingDemoRoutes ? demoRoutes : routes;
  const totalDistance = routes.reduce((sum, route) => sum + route.distanceMeters, 0);
  const username = user?.username ?? 'Usuário';

  return (
    <Screen maxWidth={Platform.OS === 'web' ? 1120 : 560}>
      <Card style={{ padding: 0, alignItems: 'center', marginTop: 0 }}>
        <View style={{ height: 110, width: '100%', backgroundColor: Colors.forest, overflow: 'hidden', borderTopLeftRadius: Radius.lg - 1, borderTopRightRadius: Radius.lg - 1 }}>
          <View style={{ position: 'absolute', right: -30, top: -50, width: 170, height: 170, borderRadius: 85, backgroundColor: Colors.orange, opacity: 0.9 }} />
          <View style={{ position: 'absolute', left: -40, bottom: -70, width: 160, height: 160, borderRadius: 80, backgroundColor: Colors.magenta, opacity: 0.6 }} />
        </View>
        <View style={{ width: 108, height: 108, borderRadius: 54, backgroundColor: Colors.white, alignItems: 'center', paddingTop: 6, marginTop: -54, zIndex: 10 }}>
          {user && <ProfilePhoto userId={user.userId} username={username} />}
        </View>
        <Text style={{ color: Colors.ink, fontSize: 28, fontWeight: '700', marginTop: 8 }}>{username}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6, marginBottom: 20, backgroundColor: '#F3E8FA', borderRadius: Radius.sm, paddingHorizontal: 12, paddingVertical: 6 }}>
          <Icon name="star-circle" size={18} color={Colors.orange} />
          <Text style={{ color: Colors.violet, fontSize: 16, fontWeight: '700' }}>{balance} pontos disponíveis</Text>
        </View>
      </Card>

      <Text style={{ color: Colors.ink, fontSize: 22, fontWeight: '700', marginTop: 20, marginBottom: 8 }}>Minha atividade</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        <StatTile icon="map-marker-path" label="Rotas salvas" value={String(routes.length)} />
        <StatTile icon="walk" label="Distância total" value={formatDistance(totalDistance)} />
        <StatTile icon="star-circle" label="Pontos ganhos" value={String(earned)} />
        <StatTile icon="gift-outline" label="Trocas feitas" value={String(redemptions.length)} />
      </View>

      <Text style={{ color: Colors.ink, fontSize: 22, fontWeight: '700', marginTop: 28, marginBottom: 6 }}>
        {showingDemoRoutes ? 'Trajetos de exemplo' : 'Caminhos das minhas rotas'}
      </Text>
      {showingDemoRoutes && (
        <Card style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
          <Icon name="information-outline" size={22} color={Colors.violet} />
          <Text style={{ color: Colors.muted, fontSize: 15, flex: 1 }}>
            Estes caminhos são fictícios e servem apenas para demonstrar os mapas. Rotas gravadas no celular não são sincronizadas com este navegador.
          </Text>
        </Card>
      )}
      {loading && <ActivityIndicator color={Colors.forest} />}
      {!loading && visibleRoutes.length === 0 && (
        <Card style={{ alignItems: 'center' }}>
          <Icon name="routes" size={36} color={Colors.muted} />
          <Text style={{ color: Colors.muted, fontSize: 16, marginTop: 6, textAlign: 'center' }}>Suas rotas gravadas vão aparecer aqui.</Text>
        </Card>
      )}
      {!loading && visibleRoutes.map((route) => (
        <Card key={route.id}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: Colors.ink, fontSize: 18, fontWeight: '700' }}>{route.name}</Text>
              <Text style={{ color: Colors.muted, fontSize: 15 }}>{new Date(route.createdAt).toLocaleDateString('pt-BR')}</Text>
            </View>
            <View style={{ backgroundColor: '#F3E8FA', borderRadius: Radius.sm, paddingHorizontal: 12, paddingVertical: 8 }}>
              <Text style={{ color: Colors.violet, fontWeight: '700', fontSize: 16 }}>{formatDistance(route.distanceMeters)}</Text>
            </View>
          </View>
          <View style={{ marginTop: 12, borderRadius: Radius.md, overflow: 'hidden' }}>
            {route.points.length > 1 ? (
              <RouteMap center={route.points[0]} points={route.points} fit />
            ) : (
              <Text style={{ color: Colors.muted }}>Esta rota não tem pontos suficientes para exibir o caminho.</Text>
            )}
          </View>
          {route.notes ? <Text style={{ color: Colors.muted, fontSize: 15, marginTop: 10 }}>{route.notes}</Text> : null}
        </Card>
      ))}

      <View style={{ marginTop: 20 }}>
        <AppButton title="Sair da conta" variant="outline" onPress={signOut} />
      </View>
    </Screen>
  );
}