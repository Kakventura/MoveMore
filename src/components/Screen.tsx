import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

// Limita a largura no site e mantém o layout de celular
export const Screen = ({ children }: { children: ReactNode }) => (
  <ScrollView style={{ backgroundColor: Colors.sand }} contentContainerStyle={s.content}>{children}</ScrollView>
);

const s = StyleSheet.create({ content: { padding: 20, width: '100%', maxWidth: 560, alignSelf: 'center' } });
