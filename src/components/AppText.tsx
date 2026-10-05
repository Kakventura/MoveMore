// Papel: aplicar as fontes do aplicativo aos textos do React Native.
// Motivo: manter a tipografia uniforme e escolher a variante em negrito conforme o estilo recebido.
import { StyleSheet, Text, type TextProps } from 'react-native';

export function AppText({ style, ...props }: TextProps) {
  // Detecta o peso solicitado para selecionar a fonte regular ou a fonte bold.
  const fontWeight = StyleSheet.flatten(style)?.fontWeight;
  const isBold = fontWeight === 'bold' || (typeof fontWeight === 'string' && Number(fontWeight) >= 600);

  return (
    <Text
      {...props}
      style={[style, { fontFamily: isBold ? 'PTSansNarrowBold' : 'PTSansNarrow' }]}
    />
  );
}
