import { View } from 'react-native';
import { AppText as Text } from '@/components/AppText';
import { Icon, type IconName } from '@/components/Icon';
import { Colors, Radius, Shadow } from '@/constants/colors';

// Bloco de número com ícone (usado no perfil e na gravação)
export function StatTile({ icon, label, value, flex = true }: { icon: IconName; label: string; value: string; flex?: boolean }) {
  return (
    <View style={[{ backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.line, padding: 16, minWidth: 140 }, flex && { flexGrow: 1, flexBasis: 140 }, Shadow]}>
      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3E8FA', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
        <Icon name={icon} size={22} color={Colors.violet} />
      </View>
      <Text style={{ color: Colors.muted, fontSize: 15 }}>{label}</Text>
      <Text style={{ color: Colors.forest, fontSize: 26, fontWeight: '700' }}>{value}</Text>
    </View>
  );
}