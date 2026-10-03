import { StyleSheet, Text, type TextProps } from 'react-native';

export function AppText({ style, ...props }: TextProps) {
  const fontWeight = StyleSheet.flatten(style)?.fontWeight;
  const isBold = fontWeight === 'bold' || (typeof fontWeight === 'string' && Number(fontWeight) >= 600);

  return (
    <Text
      {...props}
      style={[style, { fontFamily: isBold ? 'PTSansNarrowBold' : 'PTSansNarrow' }]}
    />
  );
}
