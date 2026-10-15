import { Outfit_400Regular } from "@expo-google-fonts/outfit/400Regular";
import { Outfit_500Medium } from "@expo-google-fonts/outfit/500Medium";
import { Outfit_600SemiBold } from "@expo-google-fonts/outfit/600SemiBold";
import { Outfit_700Bold } from "@expo-google-fonts/outfit/700Bold";
import { Fraunces_400Regular } from "@expo-google-fonts/fraunces/400Regular";
import { GreatVibes_400Regular } from "@expo-google-fonts/great-vibes/400Regular";

/** Mismas familias que la web: Outfit (texto), Fraunces (títulos), Great Vibes (script). */
export const ARCHIVOS_FUENTES = {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Fraunces_400Regular,
  GreatVibes_400Regular,
};

// En Android `fontWeight` no aplica a fuentes personalizadas: cada peso es una familia.
export const FUENTES = {
  regular: "Outfit_400Regular",
  medio: "Outfit_500Medium",
  semi: "Outfit_600SemiBold",
  bold: "Outfit_700Bold",
  display: "Fraunces_400Regular",
  script: "GreatVibes_400Regular",
} as const;

export type PesoFuente = keyof typeof FUENTES;
