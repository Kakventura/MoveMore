import { Text, View } from 'react-native';
import type { Product } from '@/@types/rewards';
import { AppButton } from '@/components/AppButton';
import { Screen } from '@/components/Screen';
import { Colors } from '@/constants/colors';
import { products } from '@/data/products';
import { useRewards } from '@/context/RewardsContext';
import { confirmAction, notify } from '@/utils/feedback';

const card = { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.line, borderRadius: 8, padding: 14, marginVertical: 5 };

export default function Rewards() {
  const { balance, earned, spent, redemptions, redeem } = useRewards();

  async function handleRedeem(product: Product) {
    if (!(await confirmAction(`Trocar ${product.cost} pontos por "${product.name}"?`))) return;
    try {
      await redeem(product);
      notify(`Troca realizada: ${product.name}!`);
    } catch (e) { notify((e as Error).message); }
  }

  return (
    <Screen>
      <View style={{ ...card, backgroundColor: Colors.forest, padding: 20 }}>
        <Text style={{ color: Colors.white }}>Seu saldo</Text>
        <Text style={{ color: Colors.white, fontSize: 40, fontWeight: '700' }}>{balance} pts</Text>
        <Text style={{ color: Colors.sand }}>{earned} ganhos · {spent} trocados</Text>
      </View>
      <Text style={{ color: Colors.muted, marginVertical: 6 }}>Como ganhar: cada 10 m percorridos em uma rota valem 1 ponto.</Text>

      <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 12 }}>Produtos disponíveis</Text>
      {products.map((p) => {
        const missing = p.cost - balance;
        return (
          <View key={p.id} style={card}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{p.emoji} {p.name}</Text>
            <Text style={{ color: Colors.muted, marginVertical: 4 }}>{p.description}</Text>
            <Text style={{ fontWeight: '700', color: Colors.forest }}>{p.cost} pts</Text>
            <AppButton
              title={missing > 0 ? `Faltam ${missing} pts` : 'Trocar'}
              disabled={missing > 0}
              onPress={() => handleRedeem(p)}
            />
          </View>
        );
      })}

      <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 20 }}>Minhas trocas</Text>
      {redemptions.length === 0 && <Text style={{ color: Colors.muted }}>Você ainda não fez nenhuma troca.</Text>}
      {redemptions.map((r) => (
        <View key={r.id} style={card}>
          <Text style={{ fontWeight: '600' }}>{r.productName}</Text>
          <Text style={{ color: Colors.muted }}>{new Date(r.redeemedAt).toLocaleString('pt-BR')} · -{r.cost} pts</Text>
        </View>
      ))}
    </Screen>
  );
}