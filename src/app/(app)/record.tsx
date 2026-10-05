// Papel: acompanhar uma caminhada pelo GPS, mostrar suas métricas e salvar a rota.
// Motivo: concentrar a gravação ao vivo e a conversão do trajeto em um registro reutilizável.
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Platform, Pressable, View } from 'react-native';
import { AppText as Text } from '@/components/AppText';
import type { LocationSubscription } from 'expo-location';
import type { RoutePoint } from '@/@types/route';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { RouteMap } from '@/components/RouteMap';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { StatTile } from '@/components/StatTile';
import { Screen } from '@/components/Screen';
import { useRoutes } from '@/context/RoutesContext';
import { Colors, Radius } from '@/constants/colors';
import { pointsFromDistance } from '@/context/RewardsContext';
import { exportRoute } from '@/services/directoryExport';
import { getCurrentPoint, requestLocationAccess, watchRoute } from '@/services/location';
import { distanceBetween, formatDistance, totalDistance } from '@/utils/distance';
import { notify } from '@/messages/feedback';

const MIN_STEP = 5;      // metros mínimos entre pontos (ignora o "tremor" do GPS)
const MAX_ACCURACY = 30; // descarta leituras com erro maior que 30 m (só no celular)

const formatTime = (total: number) => {
  // Converte segundos em relógio legível, omitindo as horas quando são zero.
  const h = Math.floor(total / 3600), m = Math.floor((total % 3600) / 60), sec = total % 60;
  const mm = String(m).padStart(2, '0'), ss = String(sec).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

export default function Record() {
  // Coordena permissões, pontos recebidos do GPS, cronômetro e persistência da rota.
  const router = useRouter();
  const { createRoute } = useRoutes();
  const subscription = useRef<LocationSubscription | null>(null);
  const mounted = useRef(true);
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [tracking, setTracking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [center, setCenter] = useState<RoutePoint | null>(null); // só existe se o GPS foi autorizado
  const [locating, setLocating] = useState(true);
  const [permissionError, setPermissionError] = useState('');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [seconds, setSeconds] = useState(0);

  // Pede permissão e, se aceita, pega a posição para mostrar o mapa
  const locate = useCallback(async () => {
    // Confirma acesso ao GPS e obtém uma posição inicial para centralizar o mapa.
    setLocating(true);
    setPermissionError('');
    try {
      await requestLocationAccess();
      const current = await getCurrentPoint();
      if (mounted.current) setCenter(current);
    } catch (e) {
      if (mounted.current) setPermissionError((e as Error).message);
    } finally {
      if (mounted.current) setLocating(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    locate();
    // Garante que o GPS pare se o usuário sair da tela
    return () => {
      mounted.current = false;
      subscription.current?.remove();
    };
  }, [locate]);

  // Cronômetro: conta enquanto a rota está sendo gravada
  useEffect(() => {
    if (!tracking) return;
    const timer = setInterval(() => setSeconds((v) => v + 1), 1000);
    return () => clearInterval(timer);
  }, [tracking]);

  async function start() {
    // Inicia a assinatura do GPS e filtra leituras imprecisas ou deslocamentos insignificantes.
    try {
      setPoints([]);
      setSeconds(0);
      subscription.current = await watchRoute((p) =>
        setPoints((prev) => {
          // No navegador a precisão vem do Wi-Fi/IP (ruim), então o filtro vale só no celular
          if (Platform.OS !== 'web' && p.accuracy && p.accuracy > MAX_ACCURACY) return prev;
          const last = prev.at(-1);
          if (last && distanceBetween(last, p) < MIN_STEP) return prev; // não andou o bastante
          return [...prev, p];
        }));
      setTracking(true);
    } catch (e) { notify((e as Error).message); }
  }

  function stop() {
    // Encerra a assinatura para interromper a coleta sem descartar os pontos já registrados.
    subscription.current?.remove();
    subscription.current = null;
    setTracking(false);
  }

  async function save() {
    // Persiste os dados da caminhada e tenta também exportar uma cópia em arquivo JSON.
    if (saving) return;
    if (!name.trim()) return notify('Dê um nome para a rota.');
    setSaving(true);
    try {
      const route = await createRoute({ name: name.trim(), notes, points, distanceMeters: totalDistance(points) });
      try { notify(`Arquivo gravado: ${await exportRoute(route)}`); }
      catch (e) { notify(`Rota salva no app, mas não foi gravada na pasta: ${(e as Error).message}`); }
      if (router.canGoBack()) router.back();
        else router.replace('/home');;
    } finally { setSaving(false); }
  }

  const last = points.at(-1);
  const meters = totalDistance(points);
  const status = tracking ? 'Gravando sua rota' : points.length ? 'Gravação pausada' : 'Pronto para começar';

  return (
    <Screen>
      {locating && <ActivityIndicator color={Colors.forest} style={{ marginVertical: 24 }} />}
      {center && (
        <View style={{ borderRadius: Radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: Colors.line }}>
          <RouteMap center={center} points={points} />
        </View>
      )}
      {permissionError !== '' && (
        <Card style={{ borderColor: Colors.danger }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Icon name="crosshairs-gps" size={24} color={Colors.danger} />
            <Text style={{ color: Colors.danger, fontSize: 16, flex: 1 }}>{permissionError}</Text>
          </View>
          <AppButton title="Tentar novamente" variant="outline" onPress={locate} />
        </Card>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 }}>
        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: tracking ? Colors.danger : Colors.muted }} />
        <Text style={{ color: Colors.ink, fontSize: 17, fontWeight: '700' }}>{status}</Text>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
        <StatTile icon="map-marker-distance" label="Distância" value={formatDistance(meters)} />
        <StatTile icon="timer-outline" label="Tempo" value={formatTime(seconds)} />
        <StatTile icon="star-circle" label="Pontos nesta rota" value={`+${pointsFromDistance(meters)}`} />
      </View>
      <Text style={{ color: Colors.muted, fontSize: 14, textAlign: 'center', marginTop: 10 }}>
        {points.length} registros{last?.accuracy ? ` · precisão do GPS ±${Math.round(last.accuracy)} m` : ''}
      </Text>

      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={tracking ? 'Parar gravação' : 'Iniciar gravação'}
          disabled={!tracking && !center}
          onPress={tracking ? stop : start}
          style={({ pressed }) => ({
            width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center',
            backgroundColor: tracking ? Colors.danger : Colors.orange,
            opacity: !tracking && !center ? 0.45 : pressed ? 0.85 : 1,
            shadowColor: tracking ? Colors.danger : Colors.orange, shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 6,
          })}
        >
          <Icon name={tracking ? 'stop' : 'play'} size={44} color={tracking ? Colors.white : Colors.ink} />
        </Pressable>
        <Text style={{ color: Colors.muted, fontSize: 16, marginTop: 10 }}>
          {tracking ? 'Toque para parar' : points.length ? 'Toque para gravar de novo' : 'Toque para iniciar'}
        </Text>
      </View>

      {!tracking && points.length >= 2 && (
        <Card>
          <Text style={{ fontSize: 20, fontWeight: '700', color: Colors.ink, marginBottom: 4 }}>Salvar rota</Text>
          <AppInput placeholder="Nome da rota" value={name} onChangeText={setName} autoCapitalize="sentences" />
          <AppInput placeholder="Observações" value={notes} onChangeText={setNotes} multiline autoCapitalize="sentences" />
          <AppButton title={saving ? 'Salvando...' : 'Salvar rota e gravar na pasta'} onPress={save} disabled={saving} />
        </Card>
      )}
    </Screen>
  );
}