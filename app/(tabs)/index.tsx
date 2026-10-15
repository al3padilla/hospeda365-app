import { useEffect, useRef } from "react";
import { ScrollView, View, type LayoutChangeEvent } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Amenidades from "../../components/Amenidades";
import DayPass from "../../components/DayPass";
import HabitacionesDestacadas from "../../components/HabitacionesDestacadas";
import HeroCarousel from "../../components/HeroCarousel";
import PageShell from "../../components/PageShell";
import SearchBar from "../../components/SearchBar";
import SobreHotel from "../../components/SobreHotel";
import type { SeccionInicio } from "../../hooks/useNavegacionHotel";
import { estilosPantallaInicio as styles } from "../../estilos/inicio";

/** Margen para que el título de la sección no quede pegado al navbar. */
const MARGEN_SUPERIOR = 12;

export default function Inicio() {
  const { seccion, t } = useLocalSearchParams<{ seccion?: SeccionInicio; t?: string }>();
  const scrollRef = useRef<ScrollView>(null);
  const posiciones = useRef<Partial<Record<SeccionInicio, number>>>({ inicio: 0 });

  function registrar(id: SeccionInicio) {
    return (e: LayoutChangeEvent) => {
      posiciones.current[id] = e.nativeEvent.layout.y;
    };
  }

  function irA(id: SeccionInicio) {
    const y = posiciones.current[id];
    if (y === undefined) return;
    scrollRef.current?.scrollTo({ y: Math.max(0, y - MARGEN_SUPERIOR), animated: true });
  }

  useEffect(() => {
    if (!seccion) return;
    // Espera un frame para que las secciones ya tengan su posición medida.
    const id = setTimeout(() => irA(seccion), 60);
    return () => clearTimeout(id);
  }, [seccion, t]);

  return (
    <PageShell scrollRef={scrollRef}>
      <HeroCarousel onReservar={() => irA("buscar")} onVerHabitaciones={() => irA("habitaciones")} />
      <View onLayout={registrar("buscar")} style={styles.buscador}>
        <SearchBar onBuscar={() => irA("habitaciones")} />
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
      <View onLayout={registrar("habitaciones")}>
        <HabitacionesDestacadas />
      </View>
    </PageShell>
  );
}
