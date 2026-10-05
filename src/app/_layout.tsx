// Papel: configurar a raiz da navegação, carregar as fontes e disponibilizar a autenticação.
// Motivo: essas configurações precisam envolver todas as telas e ser inicializadas uma única vez.
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  PTSansNarrow_400Regular,
  PTSansNarrow_700Bold,
} from '@expo-google-fonts/pt-sans-narrow';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {
  // Carrega as fontes antes de renderizar para evitar que a interface apareça com tipografia diferente.
  const [fontsLoaded, fontError] = useFonts({
    PTSansNarrow: PTSansNarrow_400Regular,
    PTSansNarrowBold: PTSansNarrow_700Bold,
  });

 if (!fontsLoaded && !fontError) return null;

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Slot />
    </AuthProvider>
  );
}