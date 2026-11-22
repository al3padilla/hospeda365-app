import { File, Paths } from "expo-file-system";
import { isAvailableAsync, shareAsync } from "expo-sharing";
import { Linking, Platform } from "react-native";
import { getFirebase } from "../services/firebase";
import type { ReservaHistorial } from "../types/hotel";

export const simuladorConfigurado = Boolean(process.env.EXPO_PUBLIC_HOSPEDA365_WEB_URL?.trim());

async function solicitar(datos: object) {
  const origen = process.env.EXPO_PUBLIC_HOSPEDA365_WEB_URL?.trim().replace(/\/+$/, "");
  if (!origen) throw new Error("La dirección del servidor de pagos todavía no está configurada.");
  const token = await getFirebase().auth.currentUser?.getIdToken();
  if (!token) throw new Error("Inicia sesión para continuar.");
  let respuesta: Response;
  try {
    respuesta = await fetch(origen + "/api/pago-simulado", {
      method: "POST",
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor de pagos.");
  }
  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => null);
    throw new Error(error?.error || "El servidor de pagos no está disponible.");
  }
  return respuesta;
}

export async function solicitarPagoSimulado(reservaId: string, correo: string, enviar: boolean) {
  const respuesta = await solicitar({ reservaId, correo, enviar });
  return await respuesta.json() as { enviado: boolean; correoVerificado: boolean };
}

export async function abrirComprobante(reserva: ReservaHistorial) {
  if (!reserva.comprobanteGenerado && reserva.comprobanteUrl?.startsWith("https://")) {
    await Linking.openURL(reserva.comprobanteUrl);
    return;
  }

  const respuesta = await solicitar({ reservaId: reserva.id, abrir: true });
  const nombre = "comprobante-simulado-" + reserva.id + ".pdf";
  if (Platform.OS === "web") {
    const url = URL.createObjectURL(await respuesta.blob());
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = nombre;
    enlace.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }

  if (!(await isAvailableAsync())) throw new Error("Este dispositivo no puede abrir el comprobante.");
  const archivo = new File(Paths.cache, nombre);
  archivo.write(new Uint8Array(await respuesta.arrayBuffer()));
  await shareAsync(archivo.uri, { mimeType: "application/pdf", dialogTitle: nombre });
}
