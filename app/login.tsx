import FormularioLogin from "../components/FormularioLogin";
import PageShell from "../components/PageShell";

export default function Login() {
  return (
    <PageShell whatsapp={false} mostrarAtras>
      <FormularioLogin />
    </PageShell>
  );
}
