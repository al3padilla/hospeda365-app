import { File, Paths } from "expo-file-system";
import { isAvailableAsync, shareAsync } from "expo-sharing";
import { Linking, Platform } from "react-native";
import { generarComprobantePdf } from "./comprobantePdf";
import type { ReservaHistorial } from "../types/hotel";

export async function abrirComprobante(reserva: ReservaHistorial) {
  if (!reserva.comprobanteGenerado) {
    if (!reserva.comprobanteUrl?.startsWith("https://")) {
      throw new Error("Esta reserva no tiene un comprobante disponible.");
    }
    await Linking.openURL(reserva.comprobanteUrl);
    return;
  }

  const bytes = generarComprobantePdf(reserva.id, reserva.total);
  const nombre = "comprobante-simulado-" + reserva.id + ".pdf";
  if (Platform.OS === "web") {
    const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = nombre;
    enlace.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }

  if (!(await isAvailableAsync())) throw new Error("Este dispositivo no puede compartir el comprobante.");
  const archivo = new File(Paths.cache, nombre);
  archivo.write(bytes);
  await shareAsync(archivo.uri, { mimeType: "application/pdf", dialogTitle: nombre });
}
