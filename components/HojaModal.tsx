import type { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useResponsive } from "../hooks/useResponsive";
import { estilosHojaModal as styles } from "../estilos/layout";

type HojaModalProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  anchoMaximo?: number;
  /** Panel inferior en teléfonos, centrado en tablets (igual que la web). */
  inferiorEnMovil?: boolean;
  etiqueta?: string;
};

/** Overlay modal común: fondo sea-deep translúcido + panel blanco. En teléfono es una hoja inferior estilo app. */
export default function HojaModal({
  visible,
  onClose,
  children,
  anchoMaximo = 640,
  inferiorEnMovil = true,
  etiqueta,
}: HojaModalProps) {
  const { esSm, alto } = useResponsive();
  const insets = useSafeAreaInsets();
  const abajo = inferiorEnMovil && !esSm;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={abajo ? "slide" : "fade"}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.fondo, abajo ? styles.fondoAbajo : styles.fondoCentro]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Cerrar"
        />
        <View
          accessibilityViewIsModal
          accessibilityLabel={etiqueta}
          style={[
            styles.panel,
            {
              maxWidth: anchoMaximo,
              maxHeight: alto * (abajo ? 0.86 : 0.92),
              paddingBottom: abajo ? insets.bottom : 0,
            },
            abajo ? styles.panelAbajo : styles.panelCentro,
          ]}
        >
          {children}
          {abajo ? (
            <View pointerEvents="none" style={styles.agarradera}>
              <View style={styles.barraAgarradera} />
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}
