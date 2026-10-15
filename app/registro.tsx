import FormularioRegistro from "../components/FormularioRegistro";
import PageShell from "../components/PageShell";

export default function Registro() {
  return (
    <PageShell whatsapp={false} mostrarAtras>
      <FormularioRegistro />
    </PageShell>
  );
}
