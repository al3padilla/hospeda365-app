import { useState, type ReactNode, type Ref } from "react";
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, View } from "react-native";
import { COLORES } from "../constants/colors";
import { esperar } from "../datos/carga";
import { vibrarToque } from "../utilidades/hapticos";
import Footer from "./Footer";
import Navbar from "./Navbar";
import WhatsAppFloat from "./WhatsAppFloat";
import { estilosPageShell as styles } from "../estilos/layout";

type PageShellProps = {
  children: ReactNode;
  /** Mostrar botón flotante de WhatsApp (default: true). */
  whatsapp?: boolean;
  /** Mostrar footer al final del scroll (default: true). */
  footer?: boolean;
  mostrarAtras?: boolean;
  scrollRef?: Ref<ScrollView>;
  /** Acción al deslizar hacia abajo para recargar (gesto táctil de Android/iOS). */
  onRefrescar?: () => Promise<void> | void;
};

/** Layout común: Navbar + contenido + Footer (igual que la web). */
export default function PageShell({
  children,
  whatsapp = true,
  footer = true,
  mostrarAtras = false,
  scrollRef,
  onRefrescar,
}: PageShellProps) {
  const [refrescando, setRefrescando] = useState(false);

  async function refrescar() {
    vibrarToque();
    setRefrescando(true);
    await Promise.all([esperar(), onRefrescar?.()]);
    setRefrescando(false);
  }

  return (
    <View style={styles.pagina}>
      <Navbar mostrarAtras={mostrarAtras} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.flex}
          contentContainerStyle={styles.contenido}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            Platform.OS !== "web" ? (
              <RefreshControl
                refreshing={refrescando}
                onRefresh={() => void refrescar()}
                colors={[COLORES.coral]}
                tintColor={COLORES.coral}
                progressBackgroundColor={COLORES.foam}
              />
            ) : undefined
          }
        >
          {children}
          {footer ? <Footer /> : null}
        </ScrollView>
      </KeyboardAvoidingView>
      {whatsapp ? <WhatsAppFloat /> : null}
    </View>
  );
}
