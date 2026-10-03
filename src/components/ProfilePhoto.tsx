import { Text, View } from 'react-native';
import { Colors } from '@/constants/colors';

export function ProfilePhoto({ username }: { userId: string; username: string }) {
  const initials = username.slice(0, 1).toLocaleUpperCase('pt-BR') || '?';

  return (
    <View style={{
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: Colors.forest,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Text style={{ color: Colors.white, fontSize: 36, fontWeight: '700' }}>{initials}</Text>
    </View>
  );
}
