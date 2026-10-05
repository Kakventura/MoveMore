// Papel: apresentar um formulário de cadastro independente para criação de conta.
// Motivo: disponibilizar o cadastro como rota própria além da alternância existente na tela inicial.
import { useState } from 'react';
import { Link } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { AppText as Text } from '@/components/AppText';
import { AppButton } from '@/components/AppButton';
import { AppInput } from '@/components/AppInput';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/colors';
import { authErrorMessage, notify } from '@/utils/feedback';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  // Controla os campos, valida e solicita o cadastro pelo contexto de autenticação.
  const { signUp } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', cep: '', password: '' });
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleRegister() {
    // Normaliza e valida usuário, e-mail e CEP antes de enviar os dados.
    const cep = form.cep.replace(/\D/g, '');
    if (!form.username.trim() || !form.password) return notify('Preencha usuário e senha.');
    if (!EMAIL.test(form.email.trim())) return notify('Informe um e-mail válido.');
    if (cep.length !== 8) return notify('O CEP deve ter 8 dígitos.');
    setLoading(true);
    try { await signUp({ ...form, username: form.username.trim(), email: form.email.trim().toLowerCase(), cep }); }
    catch (e) { notify(authErrorMessage(e)); }
    finally { setLoading(false); }
  }

  return (
    <Screen>
      <Text style={{ fontSize: 32, fontWeight: '700', color: Colors.forest, marginTop: 40, marginBottom: 16 }}>Criar conta</Text>
      <AppInput placeholder="Usuário" value={form.username} onChangeText={set('username')} />
      <AppInput placeholder="E-mail" keyboardType="email-address" value={form.email} onChangeText={set('email')} />
      <AppInput placeholder="CEP (somente números)" keyboardType="number-pad" maxLength={9} value={form.cep} onChangeText={set('cep')} />
      <AppInput placeholder="Senha" secureTextEntry value={form.password} onChangeText={set('password')} />
      {loading ? <ActivityIndicator color={Colors.forest} /> : <AppButton title="Cadastrar e entrar" onPress={handleRegister} />}
      <Link href="/" style={{ color: Colors.violet, fontSize: 17, fontWeight: '700', textAlign: 'center', marginTop: 20 }}>Já tenho conta</Link>
    </Screen>
  );
}