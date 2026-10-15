import { useWindowDimensions } from "react-native";

/** Mismos breakpoints que Tailwind en la web. */
export const BREAKPOINTS = { sm: 640, md: 768, lg: 1024 } as const;

type Columnas = { base: number; sm?: number; md?: number; lg?: number };

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const esSm = width >= BREAKPOINTS.sm;
  const esMd = width >= BREAKPOINTS.md;
  const esLg = width >= BREAKPOINTS.lg;

  function columnas({ base, sm, md, lg }: Columnas): number {
    if (esLg && lg) return lg;
    if (esMd && md) return md;
    if (esSm && sm) return sm;
    if (esLg || esMd) return md ?? sm ?? base;
    return base;
  }

  return { ancho: width, alto: height, esSm, esMd, esLg, columnas };
}
