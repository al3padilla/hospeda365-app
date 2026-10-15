import { View } from "react-native";
import type { EstadoReserva } from "../datos/historialReservas";
import Icono, { type NombreIcono } from "./ui/Icono";
import Texto from "./ui/Texto";
import { estilosBadgeEstado as styles } from "../estilos/reservas";

export const ESTADO_UI: Record<
  EstadoReserva,
  { label: string; fondo: string; texto: string; borde: string; icono: NombreIcono }
> = {
  confirmada: { label: "Confirmada", fondo: "#ECFDF5", texto: "#047857", borde: "#A7F3D0", icono: "checkCirculo" },
  pendiente: { label: "Pendiente", fondo: "#FFFBEB", texto: "#B45309", borde: "#FDE68A", icono: "reloj" },
  cancelada: { label: "Cancelada", fondo: "#FEF2F2", texto: "#B91C1C", borde: "#FECACA", icono: "xCirculo" },
};

export default function BadgeEstado({ estado }: { estado: EstadoReserva }) {
  const ui = ESTADO_UI[estado];

  return (
    <View style={[styles.badge, { backgroundColor: ui.fondo, borderColor: ui.borde }]}>
      <Icono nombre={ui.icono} tamano={14} color={ui.texto} />
      <Texto peso="semi" color={ui.texto} tamano={12} style={styles.texto}>
        {ui.label}
      </Texto>
    </View>
  );
}
