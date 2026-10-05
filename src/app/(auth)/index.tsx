// Papel: oferecer login e cadastro adaptados para celular e navegador.
// Motivo: centralizar a entrada e a criação de conta antes de liberar a área autenticada.
//TELA DE LOGIN
import { useEffect, useRef, useState } from 'react';
import { Platform, useWindowDimensions, ActivityIndicator, Animated, Pressable, View } from 'react-native';
import { AppText as Text } from '@/components/AppText';
import { AppInput } from '@/components/AppInput';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/colors';
import { authErrorMessage, notify } from '@/messages/feedback';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // FORMATAÇÃO E-MAIL
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const LOGO = require('../../../assets/images/Logo.png');

function HoverAction({
  title,
  onPress,
  backgroundColor,
  textColor,
  outlined = false,
}: {
  title: string;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
  outlined?: boolean;
}) {
  // Botão com animação de foco/hover usado nas ações do formulário.
  const progress = useRef(new Animated.Value(0)).current;
  const animateTo = (value: number) => {
    Animated.timing(progress, {
      toValue: value,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  const background = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [backgroundColor, textColor],
  });
  const foreground = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [textColor, backgroundColor],
  });

  return (
    <AnimatedPressable
      accessibilityRole="button"
      onPress={onPress}
      onHoverIn={() => animateTo(1)}
      onHoverOut={() => animateTo(0)}
      onFocus={() => animateTo(1)}
      onBlur={() => animateTo(0)}
      style={{
        minHeight: 56,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 18,
        borderRadius: 16,
        backgroundColor: background,
        borderWidth: outlined ? 2 : 0,
        borderColor: textColor,
        marginTop: 12,
      }}
    >
      <Animated.Text style={{ color: foreground, fontSize: 16, fontWeight: '700', fontFamily: 'PTSansNarrowBold' }}>
        {title}
      </Animated.Text>
    </AnimatedPressable>
  );
}

function PasswordField({ value, onChangeText }: { value: string; onChangeText: (v: string) => void }) {
  // Campo de senha com controle para alternar entre texto oculto e visível.
  const [visible, setVisible] = useState(false);
  return (
    <View>
      <AppInput
        placeholder="Senha"
        secureTextEntry={!visible}
        value={value}
        onChangeText={onChangeText}
        style={{ ...inputStyle, paddingRight: 92 }}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
        onPress={() => setVisible((v) => !v)}
        style={{ position: 'absolute', right: 6, top: 0, bottom: 0, justifyContent: 'center', paddingHorizontal: 14 }}
      >
        <Text style={{ color: Colors.violet, fontWeight: '700', fontSize: 15 }}>{visible ? 'Ocultar' : 'Mostrar'}</Text>
      </Pressable>
    </View>
  );
}

function FloatingLogo({ width, height }: { width: number; height: number }) {
  // Mantém a marca em movimento sutil para compor o painel de apresentação.
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: -7, duration: 1800, useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [bob]);

  return (
    <Animated.Image
      accessibilityLabel="Logo Move+"
      source={LOGO}
      resizeMode="contain"
      style={{ width, height, transform: [{ translateY: bob }] }}
    />
  );
}

export default function Login() {
  // Controla os modos de login/cadastro, valida os dados e chama o contexto de autenticação.
  const { signIn, signUp } = useAuth();
  const { width: viewportWidth } = useWindowDimensions();
  const [registering, setRegistering] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', cep: '', password: '' });
  const [loading, setLoading] = useState(false);
  const transition = useRef(new Animated.Value(0)).current;
  const set = (key: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const isWideWeb = Platform.OS === 'web' && viewportWidth >= 760;
  const panelWidth = Math.max(0, Math.min(viewportWidth - 40, 1100) / 2);

  useEffect(() => {
    Animated.timing(transition, {
      toValue: registering ? 1 : 0,
      duration: 650,
      useNativeDriver: true,
    }).start();
  }, [registering, transition]);

  async function handleSubmit() {
    // Valida os campos do modo atual e envia a operação adequada com estado de carregamento.
    if (registering) {
      const cep = form.cep.replace(/\D/g, '');
      if (!form.username.trim() || !form.password) return notify('Preencha usuário e senha.');
      if (!EMAIL.test(form.email.trim())) return notify('Informe um e-mail válido.');
      if (cep.length !== 8) return notify('O CEP deve ter 8 dígitos.');
      setLoading(true);
      try {
        await signUp({
          username: form.username.trim(),
          email: form.email.trim().toLowerCase(),
          cep,
          password: form.password,
        });
      } catch (error) {
        notify(authErrorMessage(error));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!form.username.trim() || !form.password) return notify('Informe usuário e senha.');
    setLoading(true);
    try {
      await signIn(form.username.trim(), form.password);
    } catch (error) {
      notify(authErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  const loginFields = (
    <>
      <AppInput
        placeholder="Usuário"
        value={form.username}
        onChangeText={set('username')}
        style={inputStyle}
      />
      <PasswordField value={form.password} onChangeText={set('password')} />
    </>
  );

  const registerFields = (
    <>
      <AppInput
        placeholder="Usuário"
        value={form.username}
        onChangeText={set('username')}
        style={inputStyle}
      />
      <AppInput
        placeholder="E-mail"
        keyboardType="email-address"
        value={form.email}
        onChangeText={set('email')}
        style={inputStyle}
      />
      <AppInput
        placeholder="CEP (somente números)"
        keyboardType="number-pad"
        maxLength={9}
        value={form.cep}
        onChangeText={set('cep')}
        style={inputStyle}
      />
      <PasswordField value={form.password} onChangeText={set('password')} />
    </>
  );

  const formContent = (
    <View style={{
      width: '100%',
      maxWidth: 460,
      alignSelf: 'center',
      padding: isWideWeb ? 40 : 15,
    }}>
      <Text style={{ color: Colors.ink, fontSize: 32, fontWeight: '800', textAlign: 'center', marginBottom: 6 }}>
        {registering ? 'Crie sua conta' : 'Bem-vindo(a) de volta!'}
      </Text>
      <Text style={{ color: Colors.muted, fontSize: 17, textAlign: 'center', marginBottom: 20 }}>
        {registering ? 'Comece a registrar seus caminhos e conquistas.' : 'Entre para acompanhar suas rotas e recompensas.'}
      </Text>

      {registering ? registerFields : loginFields}

      {loading ? (
        <ActivityIndicator color={Colors.violet} style={{ marginTop: 22 }} />
      ) : (
        <HoverAction
          title={registering ? 'Criar conta' : 'Entrar'}
          onPress={handleSubmit}
          backgroundColor={Colors.orange}
          textColor={Colors.ink}
        />
      )}
      <HoverAction
        title={registering ? 'Já tenho conta · Entrar' : 'Criar uma conta'}
        onPress={() => setRegistering((current) => !current)}
        backgroundColor={Colors.white}
        textColor={Colors.violet}
        outlined
      />
    </View>
  );

  const brandPanel = (
    <View style={{
      flex: 1,
      width: '100%',
      minHeight: isWideWeb ? 600 : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      overflow: 'hidden',
      backgroundColor: '#F3E8FA',
    }}>
      <View style={{ position: 'absolute', top: -70, right: -60, width: 220, height: 220, borderRadius: 110, backgroundColor: Colors.orange, opacity: 0.85 }} />
      <View style={{ position: 'absolute', bottom: -90, left: -70, width: 240, height: 240, borderRadius: 120, backgroundColor: Colors.magenta, opacity: 0.22 }} />
      <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <FloatingLogo
          width={isWideWeb ? 340 : 190}
          height={isWideWeb ? 340 : 190}
        />
      </View>
      <Text style={{ color: Colors.forest, fontSize: 20, fontWeight: '700', marginTop: 8, textAlign: 'center' }}>
        Diário de Rotas e Recompensas
      </Text>
      {isWideWeb && (
        <Text style={{ color: Colors.violet, fontSize: 19, marginTop: 10, textAlign: 'center' }}>
          Cada caminho conta. Continue em movimento!
        </Text>
      )}
    </View>
  );

  return (
    <Screen centered maxWidth={1100}>
      {isWideWeb ? (
        <View style={{
          width: '100%',
          height: 600,
          overflow: 'hidden',
          borderRadius: 24,
          backgroundColor: Colors.white,
          borderWidth: 1,
          borderColor: Colors.line,
          shadowColor: Colors.ink,
          shadowOpacity: 0.12,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 12 },
          elevation: 5,
        }}>
          <Animated.View style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: panelWidth,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.white,
            transform: [{
              translateX: transition.interpolate({ inputRange: [0, 1], outputRange: [0, panelWidth] }),
            }],
          }}>
            {formContent}
          </Animated.View>
          <Animated.View style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: panelWidth,
            height: '100%',
            transform: [{
              translateX: transition.interpolate({ inputRange: [0, 1], outputRange: [panelWidth, 0] }),
            }],
          }}>
            {brandPanel}
          </Animated.View>
        </View>
      ) : (
        <View style={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: 26,
          backgroundColor: Colors.white,
          borderWidth: 1,
          borderColor: Colors.line,
          shadowColor: Colors.ink,
          shadowOpacity: 0.1,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 4,
        }}>
          {brandPanel}
          {formContent}
        </View>
      )}
    </Screen>
  );
}

const inputStyle = {
  minHeight: 58,
  paddingHorizontal: 18,
  borderWidth: 1.5,
  borderRadius: 16,
  marginVertical: 7,
  backgroundColor: Colors.sand,
};
