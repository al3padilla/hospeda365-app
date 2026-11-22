export function generarComprobantePdf(id: string, monto: number): Uint8Array<ArrayBuffer> {
  if (!/^[\w-]{1,100}$/.test(id) || !Number.isFinite(monto) || monto < 0) {
    throw new Error("Los datos del comprobante son inválidos.");
  }

  // Todos los objetos del PDF usan ASCII. La longitud de texto coincide con la de bytes.
  const lineas = [
    "Hospeda365 - Comprobante de simulacion",
    "Ejercicio universitario. Sin cargo ni valor fiscal.",
    "Reserva: " + id,
    "Monto simulado: USD " + monto.toFixed(2),
  ];
  const contenido = "BT /F1 16 Tf 50 740 Td " +
    lineas.map((linea) => "(" + linea + ") Tj 0 -30 Td").join("\n") + " ET";
  const objetos = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Length " + contenido.length + " >>\nstream\n" + contenido + "\nendstream",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = objetos.map((objeto, indice) => {
    const offset = pdf.length;
    pdf += (indice + 1) + " 0 obj\n" + objeto + "\nendobj\n";
    return offset;
  });
  const xref = pdf.length;
  pdf += "xref\n0 6\n0000000000 65535 f \n";
  pdf += offsets.map((offset) => String(offset).padStart(10, "0") + " 00000 n \n").join("");
  pdf += "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF\n";
  return Uint8Array.from(pdf, (caracter) => caracter.charCodeAt(0));
}
