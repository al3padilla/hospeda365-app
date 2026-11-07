import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { COLORES } from "../constants/colors";
import { ARCHIVOS_FUENTES } from "../constants/fuentes";
import Proveedores from "../contexto/Proveedores";
import { useAuth } from "../contexto/AuthContext";
import { PageLoader } from "../components/Loader";

export default function RootLayout() {
  const [fuentesListas, errorFuentes] = useFonts(ARCHIVOS_FUENTES);

  // Mientras cargan fuentes: loader de marca (si fallan, seguimos con tipografía del sistema).
  if (!fuentesListas && !errorFuentes) {
    return (
      <SafeAreaProvider>
        <PageLoader titulo="Hotel Terra Azul" subtitulo="Preparando la experiencia…" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Proveedores>
        <StatusBar style="dark" />
        <Navigation />
      </Proveedores>
    </SafeAreaProvider>
  );
}

function Navigation() {
  const { state, estaAutenticado } = useAuth();
  if (state.estado === "inicializando") {
    return <PageLoader titulo="Verificando tu sesión…" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        animationDuration: 280,
        contentStyle: { backgroundColor: COLORES.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Protected guard={!estaAutenticado}>
        <Stack.Screen name="login" options={{ animation: "fade" }} />
        <Stack.Screen name="registro" options={{ animation: "slide_from_bottom" }} />
      </Stack.Protected>
      <Stack.Protected guard={estaAutenticado}>
        <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
        <Stack.Screen name="confirmacion" options={{ animation: "slide_from_bottom" }} />
        <Stack.Screen name="habitaciones/[id]" />
      </Stack.Protected>
    </Stack>
  );
}
