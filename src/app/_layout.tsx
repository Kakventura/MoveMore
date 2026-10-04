import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  PTSansNarrow_400Regular,
  PTSansNarrow_700Bold,
} from '@expo-google-fonts/pt-sans-narrow';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PTSansNarrow: PTSansNarrow_400Regular,
    PTSansNarrowBold: PTSansNarrow_700Bold,
  });

  if (fontError) throw fontError;
  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Slot />
    </AuthProvider>
  );
}