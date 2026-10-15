import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

type ContenedorProps = {
  children: ReactNode;
  /** Ancho máximo, igual que `max-w-*` de la web. */
  anchoMaximo?: number;
  style?: StyleProp<ViewStyle>;
};

/** Equivalente a `container mx-auto px-4`: centra el contenido en tablets y web. */
export default function Contenedor({
  children,
  anchoMaximo = 1200,
  style,
}: ContenedorProps) {
  return (
    <View
      style={[
        { width: "100%", maxWidth: anchoMaximo, alignSelf: "center", paddingHorizontal: 16 },
        style,
      ]}
    >
      {children}
    </View>
  );
}
