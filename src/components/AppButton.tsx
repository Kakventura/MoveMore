import { Pressable, StyleSheet } from 'react-native';
import { AppText as Text } from '@/components/AppText';
import { Colors, Radius } from '@/constants/colors';

interface Props { title: string; onPress: () => void; variant?: 'primary' | 'danger' | 'outline' | 'soft'; disabled?: boolean }

export function AppButton({ title, onPress, variant = 'primary', disabled }: Props) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
      style={({ pressed }) => [s.base, variant === 'danger' && s.danger, variant === 'outline' && s.outline,
        variant === 'soft' && s.soft, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }, disabled && { opacity: 0.45 }]}>
      <Text style={[s.text, variant === 'primary' && s.primaryText, (variant === 'outline' || variant === 'soft') && s.darkText]}>
        {title}
      </Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  base: { backgroundColor: Colors.orange, minHeight: 52, paddingHorizontal: 18, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', marginVertical: 5 },
  danger: { backgroundColor: Colors.danger },
  outline: { backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.forest },
  soft: { backgroundColor: '#EFE6F6' },
  text: { color: Colors.white, fontWeight: '700', fontSize: 17 },
  primaryText: { color: Colors.ink },
  darkText: { color: Colors.forest },
});