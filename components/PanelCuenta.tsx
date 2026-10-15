import { Pressable, View } from "react-native";
import { useRouter, type Href } from "expo-router";
import { COLORES } from "../constants/colors";
import { useAuth } from "../contexto/AuthContext";
import { formatearFecha } from "../datos/fechas";
import { useNavegacionHotel } from "../hooks/useNavegacionHotel";
import { useResponsive } from "../hooks/useResponsive";
import FormularioLogin from "./FormularioLogin";
import { PageLoader } from "./Loader";
import Aparecer from "./ui/Aparecer";
import Boton from "./ui/Boton";
import Icono, { type NombreIcono } from "./ui/Icono";
import Rejilla from "./ui/Rejilla";
import Texto from "./ui/Texto";
import { estilosPanelCuenta as styles } from "../estilos/cuenta";

type Opcion = {
  titulo: string;
  descripcion: string;
  destino: Href | "habitaciones";
  icono: NombreIcono;
};

const OPCIONES: Opcion[] = [
  {
    titulo: "Mis reservas",
    descripcion: "Historial de tus estancias y comprobantes de pago.",
    destino: "/reservas",
    icono: "calendarioRango",
  },
  {
    titulo: "Ver habitaciones",
    descripcion: "Explora el catálogo y reserva tu próxima estancia.",
    destino: "habitaciones",
    icono: "cama",
  },
];

function Dato({ icono, etiqueta, valor, primero }: { icono: NombreIcono; etiqueta: string; valor: string; primero?: boolean }) {
  return (
    <View style={[styles.filaDato, !primero && styles.separadorDato]}>
      <Icono nombre={icono} tamano={18} color={COLORES.coral} />
      <View style={styles.expandir}>
        <Texto color={COLORES.mist} tamano={11} style={styles.etiquetaDato}>
          {etiqueta}
        </Texto>
        <Texto peso="medio" color={COLORES.sea} tamano={15}>
          {valor}
        </Texto>
      </View>
    </View>
  );
}

/** Perfil del huésped: la app no tiene vistas para el personal del hotel. */
export default function PanelCuenta() {
  const router = useRouter();
  const { irASeccion } = useNavegacionHotel();
  const { esSm, columnas } = useResponsive();
  const { usuario, nombreCompleto, iniciales, estaAutenticado, state, logout } = useAuth();

  if (state.estado === "inicializando") {
    return <PageLoader titulo="Verificando tu sesión…" />;
  }

  if (!estaAutenticado || !usuario) {
    return <FormularioLogin />;
  }

  function abrir(opcion: Opcion) {
    if (opcion.destino === "habitaciones") irASeccion("habitaciones");
    else router.push(opcion.destino);
  }

  return (
    <View style={styles.seccion}>
      <Aparecer style={[styles.tarjeta, styles.cabecera, esSm && styles.cabeceraFila]}>
        <View style={styles.avatar}>
          <Texto peso="bold" color={COLORES.foam} tamano={20}>
            {iniciales}
          </Texto>
        </View>

        <View style={esSm ? styles.expandir : undefined}>
          <Texto color={COLORES.mist} tamano={12} style={styles.etiquetaCabecera}>
            Huésped
          </Texto>
          <Texto peso="display" color={COLORES.sea} tamano={esSm ? 30 : 24}>
            Hola, {nombreCompleto}
          </Texto>
        </View>

        <Boton
          texto="Cerrar sesión"
          icono="salir"
          variante="borde"
          tamano="sm"
          cargando={state.estado === "cargando"}
          onPress={() => void logout()}
        />
      </Aparecer>

      <Texto peso="display" color={COLORES.sea} tamano={20} style={styles.tituloSeccion}>
        Mis datos
      </Texto>
      <View style={[styles.tarjeta, styles.datos]}>
        <Dato primero icono="correo" etiqueta="Correo" valor={usuario.email} />
        <Dato icono="telefono" etiqueta="Teléfono" valor={usuario.telefono ?? "Sin registrar"} />
        <Dato icono="calendario" etiqueta="Huésped desde" valor={formatearFecha(usuario.creadoEn.slice(0, 10))} />
      </View>

      <Texto peso="display" color={COLORES.sea} tamano={20} style={styles.tituloSeccion}>
        ¿Qué quieres hacer?
      </Texto>
      <Rejilla columnas={columnas({ base: 1, sm: 2 })} separacion={16}>
        {OPCIONES.map((opcion) => (
          <Pressable
            key={opcion.titulo}
            onPress={() => abrir(opcion)}
            accessibilityRole="link"
            style={({ pressed }) => [styles.tarjeta, styles.opcion, pressed && styles.opcionPresionada]}
          >
            <View style={styles.iconoOpcion}>
              <Icono nombre={opcion.icono} tamano={20} color={COLORES.coral} />
            </View>
            <View style={styles.expandir}>
              <Texto peso="semi" color={COLORES.sea} tamano={15}>
                {opcion.titulo}
              </Texto>
              <Texto color={COLORES.mist} tamano={14} style={styles.subtitulo}>
                {opcion.descripcion}
              </Texto>
            </View>
          </Pressable>
        ))}
      </Rejilla>
    </View>
  );
}
