import { Children, type ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

type RejillaProps = {
  children: ReactNode;
  columnas: number;
  separacion?: number;
  style?: StyleProp<ViewStyle>;
};

/** Equivalente a `grid grid-cols-N gap-X`. */
export default function Rejilla({
  children,
  columnas,
  separacion = 16,
  style,
}: RejillaProps) {
  const items = Children.toArray(children);
  const mitad = separacion / 2;

  return (
    <View
      style={[
        { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -mitad, marginVertical: -mitad },
        style,
      ]}
    >
      {items.map((item, i) => (
        <View key={i} style={{ width: `${100 / columnas}%`, padding: mitad }}>
          {item}
        </View>
      ))}
    </View>
  );
}
