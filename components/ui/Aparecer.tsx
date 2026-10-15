import { useEffect, useRef, type ReactNode } from "react";
import { Animated, Easing, type StyleProp, type ViewStyle } from "react-native";

type AparecerProps = {
  children: ReactNode;
  retraso?: number;
  style?: StyleProp<ViewStyle>;
};

/** Equivalente a `animate-fade-up` de la web. */
export default function Aparecer({ children, retraso = 0, style }: AparecerProps) {
  const progreso = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progreso, {
      toValue: 1,
      duration: 800,
      delay: retraso,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [progreso, retraso]);

  const translateY = progreso.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });

  return (
    <Animated.View style={[style, { opacity: progreso, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}
