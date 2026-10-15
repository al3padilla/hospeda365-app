import { Stack } from "expo-router";
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../contexts/authContext';

export default function RootLayout() {
  return <AuthProvider><Navigation /></AuthProvider>;
}

function Navigation() {
  const { user, loading } = useAuth();
  if (loading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5F8F8' }}><ActivityIndicator size="large" color="#007D7D" accessibilityLabel="Cargando sesión" /></View>;
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" />
        <Stack.Screen name="registro" />
      </Stack.Protected>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="habitaciones/[id]" />
      </Stack.Protected>
    </Stack>
  );
}
