import { Image, Modal, Pressable, StyleSheet, View, type ImageSourcePropType } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useResponsive } from "../hooks/useResponsive";
import Icono from "./ui/Icono";
import { estilosFotoLightbox as styles } from "../estilos/layout";

type FotoLightboxProps = {
  visible: boolean;
  src: ImageSourcePropType;
  alt: string;
  onClose: () => void;
};

/** Vista ampliada de una foto. */
export default function FotoLightbox({ visible, src, alt, onClose }: FotoLightboxProps) {
  const { ancho, alto } = useResponsive();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.fondo}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Cerrar foto" />
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Cerrar foto ampliada"
          style={[styles.cerrar, { top: insets.top + 12 }]}
        >
          <Icono nombre="cerrar" tamano={24} />
        </Pressable>
        <Image
          source={src}
          accessibilityLabel={alt}
          resizeMode="contain"
          style={{ width: Math.min(ancho * 0.92, 900), height: Math.min(alto * 0.7, 620) }}
        />
      </View>
    </Modal>
  );
}
