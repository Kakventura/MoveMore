import { Platform, useWindowDimensions, View } from 'react-native';
import { AppText as Text } from '@/components/AppText';
import type { Product } from '@/@types/rewards';
import { AppButton } from '@/components/AppButton';
import { Screen } from '@/components/Screen';
import { Colors, Radius, Shadow } from '@/constants/colors';
import { products } from '@/data/products';
import { useRewards } from '@/context/RewardsContext';
import { confirmAction, notify } from '@/utils/feedback';
import { Icon } from '@/components/Icon';

const card = {
  flexGrow: 1,
  backgroundColor: Colors.white,
  borderWidth: 1,
  borderColor: Colors.line,
  borderRadius: Radius.lg,
  padding: 18,
  margin: 7,
  maxWidth: 360,
  ...Shadow,
};

export default function Rewards() {
  const { balance, earned, spent, redemptions, redeem } = useRewards();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const columns = isWeb ? (width >= 1000 ? 3 : width >= 680 ? 2 : 1) : 1;
  const cardWidth = isWeb ? `${100 / columns - 2}%` as `${number}%` : '100%' as const;

  async function handleRedeem(product: Product) {
    if (!(await confirmAction(`Trocar ${product.cost} pontos por "${product.name}"?`))) return;
    try {
      await redeem(product);
      notify(`Troca realizada: ${product.name}!`);
    } catch (e) { notify((e as Error).message); }
  }

  return (
    <Screen maxWidth={isWeb ? 1120 : 560}>
      <View style={{ ...card, maxWidth: undefined, margin: 0, marginBottom: 14, backgroundColor: Colors.forest, padding: 24, overflow: 'hidden', shadowOpacity: 0.2 }}>
        <View style={{ position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: 70, backgroundColor: Colors.orange, opacity: 0.9 }} />
        <Text style={{ color: Colors.white, fontSize: 17 }}>Seu saldo</Text>
        <Text style={{ color: Colors.white, fontSize: 48, fontWeight: '700' }}>{balance} pts</Text>
        <Text style={{ color: Colors.sand, fontSize: 16 }}>{earned} ganhos · {spent} trocados</Text>
      </View>
      <Text style={{ color: Colors.muted, fontSize: 16, marginVertical: 6 }}>Como ganhar: cada 10 m percorridos em uma rota valem 1 ponto.</Text>

      <Text style={{ fontSize: 20, fontWeight: '600', marginTop: 12 }}>Produtos disponíveis</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginHorizontal: -7, marginTop: 8 }}>
        {products.map((p) => {
          const missing = p.cost - balance;
          return (
            <View key={p.id} style={{ ...card, width: cardWidth, maxWidth: isWeb ? 360 : undefined }}>
              <Text style={{ color: Colors.ink, fontSize: 21, fontWeight: '700', textAlign: 'center' }}>
                {p.name}
              </Text>
              <View style={{
                height: 112,
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 12,
                borderRadius: Radius.md,
                backgroundColor: '#F3E8FA',
              }}>
                <Icon name={p.icon} size={56} color={Colors.violet} />
              </View>
              <Text style={{ color: Colors.muted, fontSize: 16, minHeight: 48, textAlign: 'center' }}>
                {p.description}
              </Text>
              <Text style={{ color: Colors.violet, fontSize: 20, fontWeight: '700', textAlign: 'center', marginTop: 10 }}>
                {p.cost} pts
              </Text>
              <AppButton
                title={missing > 0 ? `Faltam ${missing} pts` : 'Trocar'}
                disabled={missing > 0}
                onPress={() => handleRedeem(p)}
              />
            </View>
          );
        })}
      </View>

      <Text style={{ fontSize: 20, fontWeight: '600', marginTop: 20 }}>Minhas trocas</Text>
      {redemptions.length === 0 && <Text style={{ color: Colors.muted, fontSize: 16 }}>Você ainda não fez nenhuma troca.</Text>}
      {redemptions.map((r) => (
        <View key={r.id} style={{ ...card, maxWidth: undefined, marginHorizontal: 0 }}>
          <Text style={{ fontSize: 17, fontWeight: '600' }}>{r.productName}</Text>
          <Text style={{ color: Colors.muted, fontSize: 16 }}>{new Date(r.redeemedAt).toLocaleString('pt-BR')} · -{r.cost} pts</Text>
        </View>
      ))}
    </Screen>
  );
}