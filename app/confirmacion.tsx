import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import ConfirmacionReserva from "../components/ConfirmacionReserva";
import { PageLoader } from "../components/Loader";
import PageShell from "../components/PageShell";
import { esperar } from "../datos/carga";

export default function Confirmacion() {
  const { habitacion, checkIn, checkOut } = useLocalSearchParams<{
    habitacion?: string;
    checkIn?: string;
    checkOut?: string;
  }>();
  const [listo, setListo] = useState(false);

  useEffect(() => {
    let activo = true;
    void esperar().then(() => activo && setListo(true));
    return () => {
      activo = false;
    };
  }, []);

  return (
    <PageShell mostrarAtras>
      {listo ? (
        <ConfirmacionReserva habitacionId={habitacion} checkInInicial={checkIn} checkOutInicial={checkOut} />
      ) : (
        <PageLoader titulo="Cargando confirmación…" />
      )}
    </PageShell>
  );
}
