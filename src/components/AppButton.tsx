import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors } from '@/constants/colors';

interface Props { title: string; onPress: () => void; variant?: 'primary' | 'danger' | 'outline'; disabled?: boolean }

export function AppButton({ title, onPress, variant = 'primary', disabled }: Props) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
      style={[s.base, variant === 'danger' && s.danger, variant === 'outline' && s.outline, disabled && { opacity: 0.5 }]}>
      <Text style={[s.text, variant === 'outline' && { color: Colors.forest }]}>{title}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  base: { backgroundColor: Colors.forest, padding: 14, borderRadius: 8, alignItems: 'center', marginVertical: 4 },
  danger: { backgroundColor: Colors.danger },
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.forest },
  text: { color: Colors.white, fontWeight: '600', fontSize: 16 },
});
