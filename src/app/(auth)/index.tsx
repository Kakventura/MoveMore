import { useState } from 'react';
import { Link } from 'expo-router';
import { ActivityIndicator, Text } from 'react-native';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/colors';
import { authErrorMessage, notify } from '@/utils/feedback';

export default function Login() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!username.trim() || !password) return notify('Informe usuário e senha.');
    setLoading(true);
    try { await signIn(username.trim(), password); }
    catch (e) { notify(authErrorMessage(e)); }
    finally { setLoading(false); }
  }

  return (
    <Screen>
      <Text style={{ fontSize: 30, fontWeight: '700', color: Colors.forest, marginTop: 60, marginBottom: 20 }}>Diário de Rotas</Text>
      <AppInput placeholder="Usuário" value={username} onChangeText={setUsername} />
      <AppInput placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} />
      {loading ? <ActivityIndicator color={Colors.forest} /> : <AppButton title="Entrar" onPress={handleLogin} />}
      <Link href="/register" style={{ color: Colors.forest, textAlign: 'center', marginTop: 16 }}>Criar conta</Link>
    </Screen>
  );
}
