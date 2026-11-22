import { useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { COLORES } from "../constants/colors";
import { useAlerta } from "../contexto/AlertaContext";
import { abrirComprobante } from "../servicios/pagoSimulado";
import { registrarComprobanteSimulado } from "../servicios/reservas";
import type { ReservaHistorial } from "../types/hotel";
import Boton from "./ui/Boton";
import Texto from "./ui/Texto";

const GRUPOS = [0, 1, 2, 3];
const CAMPO = { borderWidth: 1, borderColor: COLORES.mist, borderRadius: 8, padding: 10, color: COLORES.sea };

export default function PagoSimuladoReserva({ reserva }: { reserva: ReservaHistorial }) {
  const { error } = useAlerta();
  const [grupos, setGrupos] = useState(["", "", "", ""]);
  const [terminacion, setTerminacion] = useState("");
  const [ocupado, setOcupado] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const campos = useRef<(TextInput | null)[]>([]);
  const pendiente = reserva.estado === "confirmada" && reserva.estadoPago === "sin_comprobante";
  const generado = reserva.comprobanteGenerado;
  const conPdf = generado || reserva.comprobanteUrl?.startsWith("https://");

  function cambiarGrupo(indice: number, valor: string) {
    const digitos = valor.replace(/\D/g, "").slice(0, 16);
    const inicio = digitos.length === 16 ? 0 : indice;
    setGrupos((actuales) => actuales.map((grupo, pos) => {
      const offset = (pos - inicio) * 4;
      return offset < 0 || (pos !== inicio && offset >= digitos.length) ? grupo : digitos.slice(offset, offset + 4);
    }));
    if (digitos.length >= 4) campos.current[Math.min(3, inicio + Math.floor(digitos.length / 4))]?.focus();
  }

  async function ejecutar(operacion: () => Promise<void>) {
    if (ocupado) return;
    setOcupado(true);
    setMensaje("");
    try {
      await operacion();
    } catch (causa) {
      const texto = causa instanceof Error ? causa.message : "No se pudo completar la operación.";
      setMensaje(texto);
      error(texto);
    } finally {
      setOcupado(false);
    }
  }

  async function simular() {
    if (!grupos.every((grupo) => /^\d{4}$/.test(grupo))) return;
    const ultimos = grupos[3];
    setGrupos(["", "", "", ""]);
    await ejecutar(async () => {
      await registrarComprobanteSimulado(reserva.id);
      setTerminacion(ultimos);
      setMensaje("Comprobante registrado para revisión en el panel.");
    });
  }

  if (!pendiente && !conPdf) return null;

  return (
    <View style={{ gap: 10, padding: 12, borderRadius: 10, backgroundColor: COLORES.background }}>
      <Texto peso="semi" color={COLORES.sea}>{pendiente ? "Pago simulado" : "Comprobante · " + reserva.id}</Texto>
      {pendiente && (
        <>
          <Texto color={COLORES.mist}>Usa 16 dígitos ficticios. Ejercicio sin cargo.</Texto>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {GRUPOS.map((indice) => (
              <TextInput key={indice} value={grupos[indice]} ref={(campo) => { campos.current[indice] = campo; }}
                onChangeText={(valor) => cambiarGrupo(indice, valor)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace" && !grupos[indice]) campos.current[indice - 1]?.focus();
                }}
                accessibilityLabel={"Grupo " + (indice + 1) + " de cuatro dígitos"} keyboardType="number-pad"
                editable={!ocupado} autoComplete="off" importantForAutofill="no" placeholder="0000" maxLength={19}
                style={[CAMPO, { flex: 1, textAlign: "center", paddingHorizontal: 2 }]} />
            ))}
          </View>
          <Boton texto="Simular pago" cargando={ocupado}
            deshabilitado={!grupos.every((grupo) => grupo.length === 4)} onPress={() => void simular()} />
        </>
      )}
      {terminacion ? <Texto color={COLORES.mist}>Tarjeta ficticia terminada en {terminacion}</Texto> : null}
      {conPdf && (
        <Boton texto="Abrir o compartir PDF" variante="borde" deshabilitado={ocupado}
          onPress={() => void ejecutar(() => abrirComprobante(reserva))} />
      )}
      {mensaje ? <Texto accessibilityLiveRegion="polite" color={COLORES.sea}>{mensaje}</Texto> : null}
    </View>
  );
}
