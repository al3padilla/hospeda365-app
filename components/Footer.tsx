import { Linking, Pressable, View } from "react-native";
import { COLORES } from "../constants/colors";
import { CONTACTO } from "../datos/contenido";
import { useNavegacionHotel, type SeccionInicio } from "../hooks/useNavegacionHotel";
import { useResponsive } from "../hooks/useResponsive";
import Logo from "./Logo";
import Contenedor from "./ui/Contenedor";
import Texto from "./ui/Texto";
import { estilosFooter as styles } from "../estilos/layout";

type EnlaceFooter =
  | { label: string; seccion: SeccionInicio }
  | { label: string; ruta: "/reservas" };

const FOOTER_LINKS: EnlaceFooter[] = [
  { label: "Inicio", seccion: "inicio" },
  { label: "Sobre el hotel", seccion: "sobre" },
  { label: "Amenidades", seccion: "amenidades" },
  { label: "Day Pass", seccion: "daypass" },
  { label: "Habitaciones", seccion: "habitaciones" },
  { label: "Mis reservas", ruta: "/reservas" },
  { label: "Reservar", seccion: "buscar" },
];

const TEXTO_SUAVE = "rgba(255,255,255,0.7)";

export default function Footer() {
  const { esSm } = useResponsive();
  const { router, irASeccion } = useNavegacionHotel();

  function abrir(enlace: EnlaceFooter) {
    if ("seccion" in enlace) irASeccion(enlace.seccion);
    else router.navigate(enlace.ruta);
  }

  return (
    <View style={styles.footer}>
      <Contenedor style={[styles.columnas, esSm && styles.columnasFila]}>
        <View style={styles.columna}>
          <Logo claro />
          <Texto color={TEXTO_SUAVE} tamano={14} style={styles.descripcion}>
            Hotel frente al mar. Estancias cómodas, reservas simples y atención
            personalizada.
          </Texto>
        </View>

        <View style={styles.columna}>
          <Texto peso="semi" color={COLORES.foam} tamano={16} style={styles.titulo}>
            Contacto
          </Texto>
          <Texto color={TEXTO_SUAVE} tamano={14} style={styles.item}>
            {CONTACTO.direccion}
          </Texto>
          <Pressable onPress={() => void Linking.openURL(`tel:${CONTACTO.telefono}`)}>
            <Texto color={TEXTO_SUAVE} tamano={14} style={styles.item}>
              {CONTACTO.telefonoVisible}
            </Texto>
          </Pressable>
          <Pressable onPress={() => void Linking.openURL(`mailto:${CONTACTO.email}`)}>
            <Texto color={TEXTO_SUAVE} tamano={14} style={styles.item}>
              {CONTACTO.email}
            </Texto>
          </Pressable>
        </View>

        <View style={styles.columna}>
          <Texto peso="semi" color={COLORES.foam} tamano={16} style={styles.titulo}>
            Enlaces rápidos
          </Texto>
          {FOOTER_LINKS.map((enlace) => (
            <Pressable key={enlace.label} onPress={() => abrir(enlace)}>
              <Texto color={TEXTO_SUAVE} tamano={14} style={styles.item}>
                {enlace.label}
              </Texto>
            </Pressable>
          ))}
        </View>
      </Contenedor>

      <View style={styles.copy}>
        <Texto color="rgba(255,255,255,0.4)" tamano={12} style={styles.copyright}>
          © {new Date().getFullYear()} Hotel Terra Azul · Hospeda365
        </Texto>
      </View>
    </View>
  );
}
