import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { COLORES } from "../constants/colors";
import { ARCHIVOS_FUENTES } from "../constants/fuentes";
import Proveedores from "../contexto/Proveedores";

export default function RootLayout() {
  const [fuentesListas, errorFuentes] = useFonts(ARCHIVOS_FUENTES);

  // Si las fuentes fallan, la app sigue con la tipografía del sistema.
  if (!fuentesListas && !errorFuentes) return null;

  return (
    <SafeAreaProvider>
      <Proveedores>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: COLORES.background },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" />
          <Stack.Screen name="registro" />
          <Stack.Screen name="confirmacion" />
          <Stack.Screen name="habitaciones/[id]" />
        </Stack>
      </Proveedores>
    </SafeAreaProvider>
  );
}
