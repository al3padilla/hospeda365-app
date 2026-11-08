import { View } from "react-native";
import type { EstadoReserva } from "../types/hotel";
import Icono, { type NombreIcono } from "./ui/Icono";
import Texto from "./ui/Texto";
import { estilosBadgeEstado as styles } from "../estilos/reservas";

type EstiloEstado = { label: string; fondo: string; texto: string; borde: string; icono: NombreIcono };

export const ESTADO_UI: Record<string, EstiloEstado> = {
  confirmada: { label: "Confirmada", fondo: "#ECFDF5", texto: "#047857", borde: "#A7F3D0", icono: "checkCirculo" },
  pendiente: { label: "Pendiente", fondo: "#FFFBEB", texto: "#B45309", borde: "#FDE68A", icono: "reloj" },
  cancelada: { label: "Cancelada", fondo: "#FEF2F2", texto: "#B91C1C", borde: "#FECACA", icono: "xCirculo" },
  rechazada: { label: "Rechazada", fondo: "#FEF2F2", texto: "#B91C1C", borde: "#FECACA", icono: "xCirculo" },
  en_curso: { label: "En curso", fondo: "#EFF6FF", texto: "#1D4ED8", borde: "#BFDBFE", icono: "checkCirculo" },
  finalizada: { label: "Finalizada", fondo: "#F1F5F9", texto: "#334155", borde: "#CBD5E1", icono: "checkCirculo" },
};

/** Estados que defina el panel web y la app no conozca se muestran con estilo neutro. */
export function estiloEstado(estado: EstadoReserva): EstiloEstado {
  if (Object.hasOwn(ESTADO_UI, estado)) return ESTADO_UI[estado];
  const label = estado ? estado.charAt(0).toUpperCase() + estado.slice(1).replace(/_/g, " ") : "Sin estado";
  return { label, fondo: "#F1F5F9", texto: "#334155", borde: "#CBD5E1", icono: "reloj" };
}

export default function BadgeEstado({ estado }: { estado: EstadoReserva }) {
  const ui = estiloEstado(estado);

  return (
    <View style={[styles.badge, { backgroundColor: ui.fondo, borderColor: ui.borde }]}>
      <Icono nombre={ui.icono} tamano={14} color={ui.texto} />
      <Texto peso="semi" color={ui.texto} tamano={12} style={styles.texto}>
        {ui.label}
      </Texto>
    </View>
  );
}
