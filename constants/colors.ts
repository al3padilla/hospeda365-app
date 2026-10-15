/** Paleta idéntica a la de la web (app/globals.css). */
export const COLORES = {
  background: "#F8FAFC",
  foreground: "#0F2744",
  sea: "#0C3B66",
  seaDeep: "#082A47",
  coral: "#E8911A",
  coralHover: "#D07D0F",
  mist: "#5A7A9A",
  foam: "#FFFFFF",
  celeste: "#E8F4FA",
  whatsapp: "#25D366",
  rojo: "#DC2626",
  rojoClaro: "#FEF2F2",
  rojoBorde: "#FECACA",
  verde: "#059669",
} as const;

/** `conAlfa("#0C3B66", 0.1)` → "rgba(12,59,102,0.1)" */
export function conAlfa(hex: string, alfa: number): string {
  const limpio = hex.replace("#", "");
  const r = parseInt(limpio.slice(0, 2), 16);
  const g = parseInt(limpio.slice(2, 4), 16);
  const b = parseInt(limpio.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alfa})`;
}

export const SOMBRA_TARJETA = {
  shadowColor: COLORES.sea,
  shadowOpacity: 0.12,
  shadowRadius: 20,
  shadowOffset: { width: 0, height: 12 },
  elevation: 6,
} as const;
