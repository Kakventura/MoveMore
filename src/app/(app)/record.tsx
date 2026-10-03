import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Platform } from 'react-native';
import { AppText as Text } from '@/components/AppText';
import type { LocationSubscription } from 'expo-location';
import type { RoutePoint } from '@/@types/route';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { RouteMap } from '@/components/RouteMap';
import { Screen } from '@/components/Screen';
import { useRoutes } from '@/context/RoutesContext';
import { Colors } from '@/constants/colors';
import { exportRoute } from '@/services/directoryExport';
import { getCurrentPoint, requestLocationAccess, watchRoute } from '@/services/location';
import { distanceBetween, formatDistance, totalDistance } from '@/utils/distance';
import { notify } from '@/utils/feedback';

const MIN_STEP = 5;      // metros mínimos entre pontos (ignora o "tremor" do GPS)
const MAX_ACCURACY = 30; // descarta leituras com erro maior que 30 m (só no celular)

export default function Record() {
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

  // Pede permissão e, se aceita, pega a posição para mostrar o mapa
  const locate = useCallback(async () => {
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

  async function start() {
    try {
      setPoints([]);
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
    subscription.current?.remove();
    subscription.current = null;
    setTracking(false);
  }

  async function save() {
    if (saving) return;
    if (!name.trim()) return notify('Dê um nome para a rota.');
    setSaving(true);
    try {
      const route = await createRoute({ name: name.trim(), notes, points, distanceMeters: totalDistance(points) });
      try { notify(`Arquivo gravado: ${await exportRoute(route)}`); }
      catch (e) { notify(`Rota salva no app, mas não foi gravada na pasta: ${(e as Error).message}`); }
      router.back();
    } finally { setSaving(false); }
  }

  const last = points.at(-1);
  return (
    <Screen>
      {locating && <ActivityIndicator color={Colors.forest} style={{ marginVertical: 24 }} />}
      {center && <RouteMap center={center} points={points} />}
      {permissionError !== '' && (
        <>
          <Text style={{ color: Colors.danger, marginBottom: 8 }}>{permissionError}</Text>
          <AppButton title="Tentar novamente" variant="outline" onPress={locate} />
        </>
      )}

      <Text style={{ fontSize: 28, fontWeight: '700', color: Colors.forest }}>{formatDistance(totalDistance(points))}</Text>
      <Text style={{ color: Colors.muted, marginBottom: 12 }}>
        {points.length} pontos{last ? ` · ${last.latitude.toFixed(5)}, ${last.longitude.toFixed(5)}` : ''}
        {last?.accuracy ? ` · precisão ±${Math.round(last.accuracy)} m` : ''}
      </Text>

      {tracking
        ? <AppButton title="Parar" variant="danger" onPress={stop} />
        : <AppButton title={points.length ? 'Gravar de novo' : 'Iniciar'} onPress={start} disabled={!center} />}

      {!tracking && points.length >= 2 && (
        <>
          <AppInput placeholder="Nome da rota" value={name} onChangeText={setName} autoCapitalize="sentences" />
          <AppInput placeholder="Observações" value={notes} onChangeText={setNotes} multiline autoCapitalize="sentences" />
          <AppButton title={saving ? 'Salvando...' : 'Salvar rota e gravar na pasta'} onPress={save} disabled={saving} />
        </>
      )}
    </Screen>
  );
}
