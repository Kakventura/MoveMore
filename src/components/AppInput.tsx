import { StyleSheet, TextInput, type TextInputProps } from 'react-native';
import { Colors } from '@/constants/colors';

export const AppInput = ({ style, ...props }: TextInputProps) => (
  <TextInput
    placeholderTextColor={Colors.muted}
    autoCapitalize="none"
    style={[s.input, style, { fontFamily: 'PTSansNarrow' }]}
    {...props}
  />
);

const s = StyleSheet.create({
  input: { borderWidth: 1, borderColor: Colors.line, backgroundColor: Colors.white, borderRadius: 8, padding: 12, marginVertical: 6, fontSize: 16, color: Colors.ink },
});
