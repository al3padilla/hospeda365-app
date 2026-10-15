import { Tabs } from "expo-router";
import type { ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORES, conAlfa } from "../../constants/colors";
import { FUENTES } from "../../constants/fuentes";
import { RESERVAS_HISTORIAL } from "../../datos/historialReservas";
import { vibrarToque } from "../../utilidades/hapticos";

type IconoTab = keyof typeof Ionicons.glyphMap;

/** Ícono (28) + etiqueta (15) + padding interno de cada pestaña (10) + aire. */
const ALTO_BARRA = 60;

const RESERVAS_PENDIENTES = RESERVAS_HISTORIAL.filter((r) => r.estado === "pendiente").length;

function iconoTab(activo: IconoTab, inactivo: IconoTab) {
  return ({ color, focused }: { color: ColorValue; focused: boolean }) => (
    <Ionicons name={focused ? activo : inactivo} size={22} color={color} />
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const margenInferior = Math.max(insets.bottom, 6);

  return (
    <Tabs
      screenListeners={{ tabPress: vibrarToque }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORES.coral,
        tabBarInactiveTintColor: COLORES.mist,
        tabBarStyle: {
          height: ALTO_BARRA + margenInferior,
          paddingTop: 2,
          paddingBottom: margenInferior,
          backgroundColor: COLORES.foam,
          borderTopColor: conAlfa(COLORES.sea, 0.1),
        },
        tabBarItemStyle: { paddingVertical: 0 },
        tabBarLabelStyle: { fontSize: 11, lineHeight: 15, marginTop: 0, fontFamily: FUENTES.semi },
        tabBarBadgeStyle: { backgroundColor: COLORES.coral, color: COLORES.foam, fontSize: 10, fontFamily: FUENTES.bold },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Inicio", tabBarIcon: iconoTab("home", "home-outline") }} />
      <Tabs.Screen name="habitaciones" options={{ title: "Habitaciones", tabBarIcon: iconoTab("bed", "bed-outline") }} />
      <Tabs.Screen
        name="reservas"
        options={{
          title: "Mis reservas",
          tabBarIcon: iconoTab("calendar", "calendar-outline"),
          tabBarBadge: RESERVAS_PENDIENTES > 0 ? RESERVAS_PENDIENTES : undefined,
        }}
      />
      <Tabs.Screen name="perfil" options={{ title: "Mi cuenta", tabBarIcon: iconoTab("person", "person-outline") }} />
    </Tabs>
  );
}
