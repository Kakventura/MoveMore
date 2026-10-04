import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppText as Text } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { RouteMap } from '@/components/RouteMap';
import { Screen } from '@/components/Screen';
import { useRoutes } from '@/context/RoutesContext';
import { Colors } from '@/constants/colors';
import { exportRoute } from '@/services/directoryExport';
import { formatDistance } from '@/utils/distance';
import { confirmAction, notify } from '@/utils/feedback';

export default function RouteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { routes, updateRoute, deleteRoute } = useRoutes();
  const route = routes.find((r) => r.id === id);
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => { if (route) { setName(route.name); setNotes(route.notes); } }, [route?.id]);

  if (!route) return <Screen><Text>Rota não encontrada.</Text></Screen>;

  async function handleUpdate() {
    if (!name.trim()) return notify('O nome não pode ficar vazio.');
    await updateRoute(route!.id, { name: name.trim(), notes });
    notify('Rota atualizada.');
  }

  async function handleDelete() {
    if (!(await confirmAction(`Excluir "${route!.name}"?`))) return;
    await deleteRoute(route!.id);
    router.back();
  }

  async function handleExport() {
    try { notify(`Arquivo gravado: ${await exportRoute(route!)}`); }
    catch (e) { notify((e as Error).message); }
  }

  return (
    <Screen>
      {route.points.length > 1 && <RouteMap center={route.points[0]} points={route.points} fit />}
      <Text style={{ color: Colors.muted, fontSize: 16, marginVertical: 10 }}>
        {new Date(route.createdAt).toLocaleString('pt-BR')} · {route.points.length} pontos · {formatDistance(route.distanceMeters)}
      </Text>
      <AppInput value={name} onChangeText={setName} autoCapitalize="sentences" />
      <AppInput value={notes} onChangeText={setNotes} multiline placeholder="Observações" autoCapitalize="sentences" />
      <AppButton title="Salvar alterações" onPress={handleUpdate} />
      <AppButton title="Gravar de novo na pasta" variant="outline" onPress={handleExport} />
      <AppButton title="Excluir rota" variant="danger" onPress={handleDelete} />
    </Screen>
  );
}