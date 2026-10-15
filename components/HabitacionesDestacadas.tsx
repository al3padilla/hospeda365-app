import { Pressable, View } from "react-native";
import { COLORES } from "../constants/colors";
import {
  useHabitaciones,
  type CriteriosBusqueda,
} from "../contexto/HabitacionesContext";
import { useResponsive } from "../hooks/useResponsive";
import { resumenHuespedes } from "./GuestsPicker";
import { LoaderInline, SkeletonCard } from "./Loader";
import RoomCard from "./RoomCard";
import Contenedor from "./ui/Contenedor";
import EncabezadoSeccion from "./ui/EncabezadoSeccion";
import Icono from "./ui/Icono";
import Rejilla from "./ui/Rejilla";
import Texto from "./ui/Texto";
import { pluralizar } from "../datos/texto";
import { estilosHabitacionesDestacadas as styles } from "../estilos/habitaciones";

function DetalleFiltro({ busqueda }: { busqueda: CriteriosBusqueda }) {
  return (
    <Texto color={COLORES.mist} tamano={15} style={styles.textoFiltro}>
      Mostrando habitaciones para{" "}
      <Texto peso="bold" color={COLORES.sea} tamano={15}>
        {busqueda.personas}
      </Texto>{" "}
      o más huéspedes · {resumenHuespedes(busqueda)}
      {busqueda.checkIn && busqueda.checkOut
        ? ` · ${busqueda.checkIn} → ${busqueda.checkOut}`
        : ""}
      .
    </Texto>
  );
}

export default function HabitacionesDestacadas() {
  const { columnas, esSm } = useResponsive();
  const { habitacionesFiltradas, busqueda, cargando, limpiarBusqueda } = useHabitaciones();
  const numColumnas = columnas({ base: 1, sm: 2, lg: 3 });

  return (
    <Contenedor style={styles.seccion}>
      <View style={styles.encabezado}>
        <EncabezadoSeccion script="Tu espacio ideal" titulo="Nuestras habitaciones" />

        {busqueda ? (
          <View style={[styles.filtro, esSm && styles.filtroFila]}>
            <DetalleFiltro busqueda={busqueda} />
            <Pressable onPress={limpiarBusqueda} style={styles.quitar} hitSlop={8}>
              <Icono nombre="cerrar" tamano={16} color={COLORES.coral} />
              <Texto peso="medio" color={COLORES.coral} tamano={14}>
                Quitar filtro
              </Texto>
            </Pressable>
          </View>
        ) : (
          <Texto color={COLORES.mist} tamano={15} style={styles.descripcion}>
            Desde la opción Básica hasta Platinum: elige el nivel de comodidad
            que mejor se adapte a tu viaje.
          </Texto>
        )}
      </View>

      {cargando ? (
        <View accessibilityLabel="Buscando habitaciones">
          <LoaderInline texto="Buscando habitaciones…" />
          <Rejilla columnas={numColumnas} separacion={32}>
            {Array.from({ length: 3 }, (_, i) => (
              <SkeletonCard key={i} />
            ))}
          </Rejilla>
        </View>
      ) : habitacionesFiltradas.length === 0 ? (
        <View style={styles.vacio}>
          <Texto color={COLORES.mist} tamano={15} style={styles.textoVacio}>
            No hay habitaciones disponibles para{" "}
            {busqueda ? pluralizar(busqueda.personas, "persona") : "ese número de personas"}. Prueba con menos huéspedes o quita el filtro.
          </Texto>
        </View>
      ) : (
        <Rejilla columnas={numColumnas} separacion={32}>
          {habitacionesFiltradas.map((room) => (
            <RoomCard
              key={room.id}
              habitacion={room}
              checkIn={busqueda?.checkIn}
              checkOut={busqueda?.checkOut}
            />
          ))}
        </Rejilla>
      )}
    </Contenedor>
  );
}
