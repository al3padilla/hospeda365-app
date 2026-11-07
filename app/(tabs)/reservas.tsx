import HistorialReservas from "../../components/HistorialReservas";
import PageShell from "../../components/PageShell";
import { useAlerta } from "../../contexto/AlertaContext";
import { useReservas } from "../../contexto/ReservasContext";

export default function Reservas() {
  const { refrescar } = useReservas();
  const { info, error: alertaError } = useAlerta();

  return (
    <PageShell
      onRefrescar={async () => {
        try {
          await refrescar();
          info("Historial actualizado");
        } catch {
          alertaError("No se pudo actualizar el historial");
        }
      }}
    >
      <HistorialReservas />
    </PageShell>
  );
}
