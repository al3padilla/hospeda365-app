import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/authContext';

export default function Perfil() {
  const { user, logout } = useAuth();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function closeSession() {
    if (pending) return;
    setPending(true);
    setError('');
    try { await logout(); }
    catch { setError('No se pudo cerrar la sesión. Inténtalo de nuevo.'); setPending(false); }
  }

  return <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
    <View style={s.card}>
      <Text accessibilityRole="header" style={s.title}>Mi perfil</Text>
      <Text style={s.label}>Nombre</Text>
      <Text style={s.value}>{user?.displayName || 'Huésped'}</Text>
      <Text style={s.label}>Correo electrónico</Text>
      <Text style={s.value}>{user?.email}</Text>
      {!!error && <Text accessibilityLiveRegion="polite" style={s.error}>{error}</Text>}
      <Pressable accessibilityRole="button" disabled={pending} onPress={closeSession}
        style={({ pressed }) => [s.button, (pressed || pending) && { opacity: 0.6 }]}>
        <Text style={s.buttonText}>{pending ? 'Cerrando sesión…' : 'Cerrar sesión'}</Text>
      </Pressable>
    </View>
  </SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F8F8', padding: 24 },
  card: { width: '100%', maxWidth: 468, alignSelf: 'center', backgroundColor: '#FFFFFF', borderRadius: 8, padding: 24, gap: 12 },
  title: { color: '#10252B', fontSize: 27, fontWeight: '700', marginBottom: 16 },
  label: { color: '#62768B', fontSize: 14 },
  value: { color: '#202B33', fontSize: 17, marginBottom: 12 },
  error: { color: '#B42318', lineHeight: 20 },
  button: { backgroundColor: '#007D7D', borderRadius: 7, padding: 15, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
