import { useLocalSearchParams } from "expo-router";
import ConfirmacionReserva from "../components/ConfirmacionReserva";
import PageShell from "../components/PageShell";

export default function Confirmacion() {
  const { habitacion, checkIn, checkOut } = useLocalSearchParams<{
    habitacion?: string;
    checkIn?: string;
    checkOut?: string;
  }>();

  return (
    <PageShell mostrarAtras>
      <ConfirmacionReserva habitacionId={habitacion} checkInInicial={checkIn} checkOutInicial={checkOut} />
    </PageShell>
  );
}
