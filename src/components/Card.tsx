import type { ReactNode } from 'react';
import { View, type ViewStyle } from 'react-native';
import { Colors, Radius, Shadow } from '@/constants/colors';

export const Card = ({ children, style }: { children: ReactNode; style?: ViewStyle }) => (
  <View style={[{ backgroundColor: Colors.white, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.line, padding: 18, marginVertical: 6 }, Shadow, style]}>
    {children}
  </View>
);