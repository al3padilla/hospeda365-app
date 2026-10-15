import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import type { StyleProp, TextStyle } from "react-native";
import { COLORES } from "../../constants/colors";

type GlifoIon = keyof typeof Ionicons.glyphMap;
type GlifoMci = keyof typeof MaterialCommunityIcons.glyphMap;

type Definicion =
  | { familia: "ion"; glifo: GlifoIon }
  | { familia: "mci"; glifo: GlifoMci };

const ion = (glifo: GlifoIon): Definicion => ({ familia: "ion", glifo });
const mci = (glifo: GlifoMci): Definicion => ({ familia: "mci", glifo });

/** Equivalentes en la app de los iconos lucide-react usados en la web. */
const ICONOS = {
  palmera: mci("palm-tree"),
  cama: mci("bed-double-outline"),
  cubiertos: mci("silverware-fork-knife"),
  olas: mci("waves"),
  sol: ion("sunny-outline"),
  parqueo: mci("alpha-p-box-outline"),
  fiesta: mci("party-popper"),
  wifi: ion("wifi"),
  reloj: ion("time-outline"),
  check: ion("checkmark"),
  checkCirculo: ion("checkmark-circle-outline"),
  xCirculo: ion("close-circle-outline"),
  calendario: ion("calendar-outline"),
  calendarioCheck: mci("calendar-check-outline"),
  calendarioX: mci("calendar-remove-outline"),
  calendarioRango: mci("calendar-range"),
  calendarioReloj: mci("calendar-clock"),
  buscar: ion("search"),
  personas: ion("people-outline"),
  persona: ion("person-outline"),
  personaCirculo: ion("person-circle-outline"),
  personaMas: ion("person-add-outline"),
  bebe: mci("baby-face-outline"),
  menos: ion("remove"),
  mas: ion("add"),
  ojo: ion("eye-outline"),
  ojoOff: ion("eye-off-outline"),
  cerrar: ion("close"),
  compartir: ion("share-social-outline"),
  zoom: mci("magnify-plus-outline"),
  menu: ion("menu"),
  entrar: ion("log-in-outline"),
  salir: ion("log-out-outline"),
  arroba: ion("at"),
  llave: ion("key-outline"),
  telefono: ion("call-outline"),
  correo: ion("mail-outline"),
  ubicacion: ion("location-outline"),
  alerta: ion("alert-circle-outline"),
  historial: mci("history"),
  luna: ion("moon-outline"),
  recibo: ion("receipt-outline"),
  subir: ion("cloud-upload-outline"),
  archivoImagen: mci("file-image-outline"),
  archivo: ion("document-text-outline"),
  archivoCheck: mci("file-check-outline"),
  dashboard: mci("view-dashboard-outline"),
  clipboard: mci("clipboard-list-outline"),
  clipboardCheck: mci("clipboard-check-outline"),
  chevronAbajo: ion("chevron-down"),
  chevronIzq: ion("chevron-back"),
  chevronDer: ion("chevron-forward"),
  porcentaje: mci("percent-outline"),
  billetera: ion("wallet-outline"),
  tabla: mci("table"),
  subiendo: ion("trending-up"),
  bajando: ion("trending-down"),
  inicio: ion("home-outline"),
  lapiz: ion("pencil"),
  basura: ion("trash-outline"),
  escudo: ion("shield-checkmark-outline"),
  whatsapp: ion("logo-whatsapp"),
  flechaIzq: ion("arrow-back"),
} as const;

export type NombreIcono = keyof typeof ICONOS;

type IconoProps = {
  nombre: NombreIcono;
  tamano?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export default function Icono({
  nombre,
  tamano = 18,
  color = COLORES.sea,
  style,
}: IconoProps) {
  const def = ICONOS[nombre];

  if (def.familia === "ion") {
    return <Ionicons name={def.glifo} size={tamano} color={color} style={style} />;
  }
  return (
    <MaterialCommunityIcons name={def.glifo} size={tamano} color={color} style={style} />
  );
}
