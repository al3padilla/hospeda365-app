import { useEffect, useRef } from "react";
import { ScrollView, View, type LayoutChangeEvent } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Amenidades from "../../components/Amenidades";
import DayPass from "../../components/DayPass";
import HeroCarousel from "../../components/HeroCarousel";
import PageShell from "../../components/PageShell";
import SearchBar from "../../components/SearchBar";
import SobreHotel from "../../components/SobreHotel";
import UbicacionHotel from "../../components/UbicacionHotel";
import type { SeccionInicio } from "../../hooks/useNavegacionHotel";
import { estilosPantallaInicio as styles } from "../../estilos/inicio";

/** Margen para que el título de la sección no quede pegado al navbar. */
const MARGEN_SUPERIOR = 12;

export default function Inicio() {
  const router = useRouter();
  const { seccion, t } = useLocalSearchParams<{ seccion?: SeccionInicio; t?: string }>();
  const scrollRef = useRef<ScrollView>(null);
  const posiciones = useRef<Partial<Record<SeccionInicio, number>>>({ inicio: 0 });

  function registrar(id: SeccionInicio) {
    return (e: LayoutChangeEvent) => {
      posiciones.current[id] = e.nativeEvent.layout.y;
    };
  }

  function irAHabitaciones() {
    router.navigate("/(tabs)/habitaciones");
  }

  function irA(id: SeccionInicio) {
    if (id === "habitaciones") {
      irAHabitaciones();
      return;
    }
    const y = posiciones.current[id];
    if (y === undefined) return;
    scrollRef.current?.scrollTo({ y: Math.max(0, y - MARGEN_SUPERIOR), animated: true });
  }

  useEffect(() => {
    if (!seccion || seccion === "habitaciones") return;
    const id = setTimeout(() => irA(seccion), 60);
    return () => clearTimeout(id);
  }, [seccion, t]);

  return (
    <PageShell scrollRef={scrollRef}>
      <HeroCarousel onReservar={irAHabitaciones} onVerHabitaciones={irAHabitaciones} />
      <View onLayout={registrar("buscar")} style={styles.buscador}>
        <SearchBar onBuscar={irAHabitaciones} />
      </View>
      <View onLayout={registrar("sobre")}>
        <SobreHotel />
      </View>
      <View onLayout={registrar("amenidades")}>
        <Amenidades />
      </View>
      <View onLayout={registrar("daypass")}>
        <DayPass />
      </View>
      <View onLayout={registrar("ubicacion")}>
        <UbicacionHotel />
      </View>
    </PageShell>
  );
}
