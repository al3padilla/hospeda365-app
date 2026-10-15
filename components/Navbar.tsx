import { useState } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORES } from "../constants/colors";
import { useAuth } from "../contexto/AuthContext";
import { useNavegacionHotel, type SeccionInicio } from "../hooks/useNavegacionHotel";
import { useResponsive } from "../hooks/useResponsive";
import Logo from "./Logo";
import Boton from "./ui/Boton";
import Icono from "./ui/Icono";
import Texto from "./ui/Texto";
import { estilosNavbar as styles } from "../estilos/layout";

type Enlace =
  | { label: string; seccion: SeccionInicio }
  | { label: string; ruta: "/habitaciones" | "/reservas" };

const NAV_LINKS: Enlace[] = [
  { label: "Inicio", seccion: "inicio" },
  { label: "Habitaciones", ruta: "/habitaciones" },
  { label: "Amenidades", seccion: "amenidades" },
  { label: "Day Pass", seccion: "daypass" },
  { label: "Mis reservas", ruta: "/reservas" },
];

type NavbarProps = {
  /** Muestra la flecha de regreso (pantallas fuera de las pestañas). */
  mostrarAtras?: boolean;
};

export default function Navbar({ mostrarAtras = false }: NavbarProps) {
  const insets = useSafeAreaInsets();
  const { esMd } = useResponsive();
  const { router, irASeccion } = useNavegacionHotel();
  const [abierto, setAbierto] = useState(false);

  function abrirEnlace(enlace: Enlace) {
    setAbierto(false);
    if ("seccion" in enlace) irASeccion(enlace.seccion);
    else router.navigate(enlace.ruta);
  }

  function reservarAhora() {
    setAbierto(false);
    irASeccion("buscar");
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
            onPress={() => irASeccion("inicio")}
            accessibilityRole="link"
            accessibilityLabel="Ir al inicio"
          >
            <Logo compacto={!esMd} />
          </Pressable>
        </View>

        {esMd ? (
          <View style={styles.enlacesEscritorio}>
            {NAV_LINKS.map((enlace) => (
              <Pressable key={enlace.label} onPress={() => abrirEnlace(enlace)} hitSlop={6}>
                <Texto color={COLORES.sea} tamano={14}>
                  {enlace.label}
                </Texto>
              </Pressable>
            ))}
            <Boton texto="RESERVA AHORA" tamano="sm" mayusculas onPress={reservarAhora} />
            <NavbarAuth />
          </View>
        ) : (
          <Pressable
            onPress={() => setAbierto((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={abierto ? "Cerrar menú" : "Abrir menú"}
            accessibilityState={{ expanded: abierto }}
            style={styles.botonMenu}
          >
            <Icono nombre={abierto ? "cerrar" : "menu"} tamano={22} color={COLORES.foam} />
          </Pressable>
        )}
      </View>

      {abierto && !esMd ? (
        <View style={styles.menuMovil}>
          {NAV_LINKS.map((enlace) => (
            <Pressable
              key={enlace.label}
              onPress={() => abrirEnlace(enlace)}
              style={styles.enlaceMovil}
            >
              <Texto color={COLORES.sea} tamano={16}>
                {enlace.label}
              </Texto>
            </Pressable>
          ))}
          <Boton texto="RESERVA AHORA" mayusculas onPress={reservarAhora} />
          <NavbarAuthMovil onNavegar={() => setAbierto(false)} />
        </View>
      ) : null}
    </View>
  );
}

/** Versión de escritorio/tablet: chip con iniciales. */
function NavbarAuth() {
  const { estaAutenticado, usuario, iniciales, state } = useAuth();
  const { router } = useNavegacionHotel();

  if (state.estado === "inicializando") {
    return <View style={styles.placeholder} />;
  }

  if (!estaAutenticado || !usuario) {
    return (
      <Boton texto="Iniciar sesión" variante="borde" tamano="sm" onPress={() => router.push("/login")} />
    );
  }

  return (
    <Pressable
      onPress={() => router.navigate("/perfil")}
      style={styles.chipUsuario}
      accessibilityRole="button"
      accessibilityLabel="Mi cuenta"
    >
      <View style={styles.avatarChico}>
        <Texto peso="bold" color={COLORES.foam} tamano={11}>
          {iniciales}
        </Texto>
      </View>
      <Texto color={COLORES.sea} tamano={14} numberOfLines={1} style={styles.nombreUsuario}>
        {usuario.nombre}
      </Texto>
    </Pressable>
  );
}

/** Versión para el menú móvil: todo a la vista. */
function NavbarAuthMovil({ onNavegar }: { onNavegar: () => void }) {
  const { estaAutenticado, usuario, nombreCompleto, iniciales, logout, state } = useAuth();
  const { router } = useNavegacionHotel();

  if (state.estado === "inicializando") {
    return <View style={[styles.placeholder, { width: "100%", height: 40 }]} />;
  }

  if (!estaAutenticado || !usuario) {
    return (
      <Boton
        texto="Iniciar sesión"
        variante="borde"
        onPress={() => {
          onNavegar();
          router.push("/login");
        }}
      />
    );
  }

  return (
    <View style={styles.bloqueUsuario}>
      <View style={styles.filaUsuario}>
        <View style={styles.avatar}>
          <Texto peso="bold" color={COLORES.foam} tamano={12}>
            {iniciales}
          </Texto>
        </View>
        <View style={styles.datosUsuario}>
          <Texto peso="semi" color={COLORES.sea} tamano={14} numberOfLines={1}>
            {nombreCompleto}
          </Texto>
          <Texto color={COLORES.mist} tamano={12} numberOfLines={1}>
            {usuario.email}
          </Texto>
        </View>
      </View>
      <Boton
        texto="Mi cuenta"
        variante="borde"
        tamano="sm"
        onPress={() => {
          onNavegar();
          router.navigate("/perfil");
        }}
      />
      <Pressable
        onPress={() => {
          onNavegar();
          void logout();
        }}
        style={styles.botonCerrarSesion}
      >
        <Texto color={COLORES.mist} tamano={14}>
          Cerrar sesión
        </Texto>
      </Pressable>
    </View>
  );
}
