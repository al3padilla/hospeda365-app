import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AUTH_LIMITS, AuthErrors, AuthValues, validateAuth } from '../utils/authValidation';
import { useAuth } from '../contexts/authContext';
import { authErrorMessage } from '../services/auth';

type Field = keyof AuthValues;
const C = {
  dark: '#10252B', primary: '#007D7D', background: '#F5F8F8',
  text: '#202B33', muted: '#62768B', border: '#DCE4E9', error: '#B42318',
};

export default function AuthScreen({ register = false }: { register?: boolean }) {
  const [values, setValues] = useState<AuthValues>({ name: '', surname: '', email: '', password: '', confirmation: '' });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState({ password: false, confirmation: false });
  const [focused, setFocused] = useState<Field>();
  const [requestError, setRequestError] = useState('');
  const [sending, setSending] = useState(false);
  const requestLock = useRef(false);
  const { ready, submit: authenticate } = useAuth();
  const refs = useRef<Partial<Record<Field, TextInput | null>>>({});
  const scroll = useRef<ScrollView>(null);
  const errors: AuthErrors = validateAuth(values, register);
  const fields: Field[] = register ? ['name', 'surname', 'email', 'password', 'confirmation'] : ['email', 'password'];

  async function submit() {
    if (requestLock.current || !ready) return;
    setSubmitted(true);
    setRequestError('');
    const invalid = fields.find((field) => errors[field]);
    if (invalid) {
      refs.current[invalid]?.focus();
      return;
    }
    Keyboard.dismiss();
    requestLock.current = true;
    setSending(true);
    try {
      await authenticate(values, register);
      setValues({ name: '', surname: '', email: '', password: '', confirmation: '' });
    } catch (error) {
      setRequestError(authErrorMessage(error));
      scroll.current?.scrollToEnd({ animated: true });
    } finally {
      requestLock.current = false;
      setSending(false);
    }
  }

  const labels: Record<Field, string> = {
    name: 'Nombres', surname: 'Apellidos', email: 'Correo electrónico',
    password: 'Contraseña', confirmation: 'Confirmar contraseña',
  };
  const placeholders: Record<Field, string> = {
    name: 'Tus nombres', surname: 'Tus apellidos', email: 'huesped@correo.com',
    password: register ? 'Crea una contraseña' : 'Ingresa tu contraseña',
    confirmation: 'Repite tu contraseña',
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView ref={scroll} style={s.scroll} contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" showsVerticalScrollIndicator={false}>
          <View style={s.hero}>
            <View style={s.heroContent}>
              <Text style={s.brand}>Hospeda365</Text>
              <Text style={s.headline}>{register ? 'Tu próxima estadía\ncomienza aquí.' : 'Reserva tu estadía en Hotel Terra Azul.'}</Text>
            </View>
          </View>
          <View style={s.body}>
            <View style={s.card}>
              <Text accessibilityRole="header" style={s.title}>{register ? 'Crear cuenta' : 'Iniciar sesión'}</Text>
              {register && <Text style={s.intro}>Regístrate como huésped y prepara tu próxima visita.</Text>}
              <View style={s.fields}>
                {fields.map((field, index) => {
                  const secret = field === 'password' || field === 'confirmation';
                  const error = (submitted || touched[field]) ? errors[field] : undefined;
                  return (
                    <View key={field} style={s.field}>
                      <Text nativeID={`${field}-label`} style={s.label}>{labels[field]}</Text>
                      <View style={[s.inputRow, focused === field && s.inputFocused, !!error && s.inputError]}>
                        <TextInput ref={(ref) => { refs.current[field] = ref; }} style={s.input}
                          accessibilityLabel={labels[field]} accessibilityHint={error}
                          placeholder={placeholders[field]} placeholderTextColor="#768594"
                          editable={!sending}
                          maxLength={field === 'name' || field === 'surname' ? AUTH_LIMITS.name : field === 'email' ? AUTH_LIMITS.email : AUTH_LIMITS.password}
                          value={values[field]} onChangeText={(text) => { setValues((prev) => ({ ...prev, [field]: text })); setRequestError(''); }}
                          onFocus={() => setFocused(field)}
                          onBlur={() => { setTouched((prev) => ({ ...prev, [field]: true })); setFocused(undefined); }}
                          autoCapitalize={field === 'name' || field === 'surname' ? 'words' : 'none'} autoCorrect={false}
                          keyboardType={field === 'email' ? 'email-address' : 'default'}
                          autoComplete={field === 'name' ? 'given-name' : field === 'surname' ? 'family-name' : field === 'email' ? 'email' : register ? 'new-password' : 'current-password'}
                          secureTextEntry={secret && !visible[field as 'password' | 'confirmation']}
                          returnKeyType={index === fields.length - 1 ? 'done' : 'next'}
                          submitBehavior={index === fields.length - 1 ? 'blurAndSubmit' : 'submit'}
                          onSubmitEditing={() => index === fields.length - 1 ? submit() : refs.current[fields[index + 1]]?.focus()}
                        />
                        {secret && <Pressable accessibilityRole="button"
                          accessibilityLabel={`${visible[field as 'password' | 'confirmation'] ? 'Ocultar' : 'Mostrar'} ${labels[field].toLowerCase()}`}
                          onPress={() => setVisible((prev) => ({ ...prev, [field]: !prev[field as 'password' | 'confirmation'] }))}
                          style={s.eye}>
                          <Ionicons name={visible[field as 'password' | 'confirmation'] ? 'eye-off-outline' : 'eye-outline'} size={21} color={C.muted} />
                        </Pressable>}
                      </View>
                      {!!error && <Text accessibilityLiveRegion="polite" style={s.error}>{error}</Text>}
                      {register && field === 'password' && !error && <Text style={s.hint}>De 12 a 128 caracteres, con mayúscula, minúscula y número.</Text>}
                    </View>
                  );
                })}
              </View>
              {!ready && <Text accessibilityLiveRegion="polite" style={[s.error, { marginBottom: 16 }]}>El servicio de acceso aún no está configurado. Contacta al administrador.</Text>}
              {!!requestError && <Text accessibilityLiveRegion="polite" style={[s.error, { marginBottom: 16 }]}>{requestError}</Text>}
              <Pressable accessibilityRole="button" onPress={submit} disabled={sending || !ready}
                accessibilityState={{ disabled: sending || !ready, busy: sending }}
                style={({ pressed }) => [s.button, s.primary, (pressed || sending || !ready) && s.pressed]}>
                <Text style={s.primaryText}>{sending ? 'Procesando…' : register ? 'Crear cuenta' : 'Entrar'}</Text>
              </Pressable>
              <Link href={register ? '/login' : '/registro'} replace asChild>
                <Pressable accessibilityRole="link" style={({ pressed }) => [s.button, s.secondary, pressed && s.pressed]}>
                  <Text style={s.secondaryText}>{register ? 'Ya tengo cuenta · Iniciar sesión' : 'Crear cuenta'}</Text>
                </Pressable>
              </Link>
            </View>
            <Text style={s.footer}>Hotel Terra Azul · Una experiencia Hospeda365</Text>
          </View>
          <SafeAreaView edges={['bottom']} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: C.dark },
  scroll: { flex: 1, backgroundColor: C.background },
  content: { flexGrow: 1, paddingBottom: 20 },
  hero: { backgroundColor: C.dark, paddingHorizontal: 28, paddingTop: 34, paddingBottom: 70 },
  heroContent: { width: '100%', maxWidth: 420, alignSelf: 'center' },
  brand: { color: '#FFFFFF', fontSize: 23, fontWeight: '700', marginBottom: 30 },
  headline: { color: '#FFFFFF', fontSize: 31, lineHeight: 40, fontWeight: '700', maxWidth: 340 },
  body: { width: '100%', maxWidth: 468, alignSelf: 'center', paddingHorizontal: 24, marginTop: -40 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: C.border, paddingHorizontal: 22, paddingTop: 30, paddingBottom: 34, boxShadow: '0 5px 18px rgba(16, 37, 43, 0.07)' },
  title: { color: C.text, fontSize: 27, fontWeight: '700', marginBottom: 22 },
  intro: { color: C.muted, fontSize: 14, lineHeight: 21, marginTop: -10, marginBottom: 22 },
  fields: { gap: 20, marginBottom: 30 },
  field: { gap: 7 },
  label: { color: C.muted, fontSize: 14, fontWeight: '500' },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.border, borderRadius: 7, minHeight: 49 },
  inputFocused: { borderColor: C.primary, backgroundColor: '#F7FCFC' },
  inputError: { borderColor: C.error },
  input: { flex: 1, minWidth: 0, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: C.text },
  eye: { minWidth: 46, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  error: { color: C.error, fontSize: 12, lineHeight: 18 },
  hint: { color: C.muted, fontSize: 12, lineHeight: 18 },
  button: { minHeight: 49, borderRadius: 7, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, paddingVertical: 13 },
  primary: { backgroundColor: C.primary, marginBottom: 14 },
  primaryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', textAlign: 'center' },
  secondary: { borderColor: C.border, borderWidth: 1 },
  secondaryText: { color: C.primary, fontSize: 14, fontWeight: '700', textAlign: 'center' },
  pressed: { opacity: 0.7 },
  footer: { textAlign: 'center', color: C.muted, fontSize: 11, lineHeight: 18, marginTop: 25, marginBottom: 10 },
});
