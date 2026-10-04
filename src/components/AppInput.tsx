import { useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';
import { Colors, Radius } from '@/constants/colors';

export const AppInput = ({ style, onFocus, onBlur, ...props }: TextInputProps) => {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      placeholderTextColor={Colors.muted}
      autoCapitalize="none"
      onFocus={(e) => { setFocused(true); onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); onBlur?.(e); }}
      style={[s.input, focused && s.focused, style, { fontFamily: 'PTSansNarrow' }]}
      {...props}
    />
  );
};

const s = StyleSheet.create({
  input: { borderWidth: 1.5, borderColor: Colors.line, backgroundColor: Colors.white, borderRadius: Radius.md, paddingHorizontal: 16, paddingVertical: 14, marginVertical: 6, fontSize: 17, color: Colors.ink },
  focused: { borderColor: Colors.violet },
});