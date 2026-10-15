import { useEffect, useState } from "react";
import HistorialReservas from "../../components/HistorialReservas";
import { PageLoader } from "../../components/Loader";
import PageShell from "../../components/PageShell";
import { esperar } from "../../datos/carga";

export default function Reservas() {
  const [listo, setListo] = useState(false);

  useEffect(() => {
    let activo = true;
    void esperar().then(() => activo && setListo(true));
    return () => {
      activo = false;
    };
  }, []);

  return (
    <PageShell>
      {listo ? <HistorialReservas /> : <PageLoader titulo="Cargando tus reservas…" />}
    </PageShell>
  );
}
