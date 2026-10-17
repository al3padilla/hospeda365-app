import { useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORES } from "../constants/colors";
import { useAuth } from "../contexto/AuthContext";
import { useNavegacionHotel, type SeccionInicio } from "../hooks/useNavegacionHotel";
import { useResponsive } from "../hooks/useResponsive";
import Logo from "./Logo";
import Boton from "./ui/Boton";
import Icono, { type NombreIcono } from "./ui/Icono";
import Texto from "./ui/Texto";
import { estilosNavbar as styles } from "../estilos/layout";

/** Solo secundarios: lo principal vive en el tab bar; sesión en Mi cuenta. */
const MENU_SECUNDARIO: { label: string; seccion: SeccionInicio; icono: NombreIcono; descripcion: string }[] = [
  {
    label: "Amenidades",
    seccion: "amenidades",
    icono: "olas",
    descripcion: "Piscina, spa y más",
  },
  {
    label: "Day Pass",
    seccion: "daypass",
    icono: "sol",
    descripcion: "Disfruta el hotel por el día",
  },
];

type NavbarProps = {
  /** Muestra la flecha de regreso (pantallas fuera de las pestañas). */
  mostrarAtras?: boolean;
};

export default function Navbar({ mostrarAtras = false }: NavbarProps) {
  const insets = useSafeAreaInsets();
  const { esMd } = useResponsive();
  const { router, irASeccion } = useNavegacionHotel();
  const { estaAutenticado, state } = useAuth();
  const [abierto, setAbierto] = useState(false);

  function irSeccion(seccion: SeccionInicio) {
    setAbierto(false);
    irASeccion(seccion);
  }

  return (
    <View style={[styles.nav, { paddingTop: insets.top }]}>
      <View style={styles.barra}>
        <View style={styles.izquierda}>
          {mostrarAtras && router.canGoBack() ? (
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Regresar"
              hitSlop={8}
              style={styles.atras}
            >
              <Icono nombre="flechaIzq" tamano={22} />
            </Pressable>
          ) : null}
          <Pressable
            onPress={() => irSeccion("inicio")}
            accessibilityRole="link"
            accessibilityLabel="Ir al inicio"
          >
            <Logo compacto={!esMd} />
          </Pressable>
        </View>

        <Pressable
          onPress={() => setAbierto((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={abierto ? "Cerrar menú" : "Abrir menú"}
          accessibilityState={{ expanded: abierto }}
          style={styles.botonMenu}
        >
          <Icono nombre={abierto ? "cerrar" : "menu"} tamano={22} color={COLORES.foam} />
        </Pressable>
      </View>

      {abierto ? (
        <View style={styles.menuPanel}>
          <View style={styles.menuContenido}>
            <Texto color={COLORES.mist} tamano={12} peso="semi" style={styles.menuEtiqueta}>
              Explorar
            </Texto>

            <View style={styles.menuLista}>
              {MENU_SECUNDARIO.map((enlace) => (
                <Pressable
                  key={enlace.label}
                  onPress={() => irSeccion(enlace.seccion)}
                  accessibilityRole="button"
                  accessibilityLabel={enlace.label}
                  style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                >
                  <View style={styles.menuIcono}>
                    <Icono nombre={enlace.icono} tamano={20} color={COLORES.coral} />
                  </View>
                  <View style={styles.menuTexto}>
                    <Texto peso="semi" color={COLORES.sea} tamano={16}>
                      {enlace.label}
                    </Texto>
                    <Texto color={COLORES.mist} tamano={12}>
                      {enlace.descripcion}
                    </Texto>
                  </View>
                  <Icono nombre="chevronDer" tamano={18} color={COLORES.mist} />
                </Pressable>
              ))}
            </View>

            <Boton
              texto="RESERVA AHORA"
              icono="calendarioCheck"
              mayusculas
              onPress={() => irSeccion("buscar")}
            />

            {state.estado === "inicializando" ? (
              <View style={[styles.placeholder, { width: "100%", height: 44 }]} />
            ) : !estaAutenticado ? (
              <Boton
                texto="Iniciar sesión"
                icono="entrar"
                variante="borde"
                onPress={() => {
                  setAbierto(false);
                  router.push("/login");
                }}
              />
            ) : null}
          </View>
        </View>
      ) : null}
    </View>
  );
}
