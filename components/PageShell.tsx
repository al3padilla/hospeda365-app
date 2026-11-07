import { useCallback, useRef, useState, type ReactNode, type Ref } from "react";
import {
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { useAlerta } from "../contexto/AlertaContext";
import { useRecarga } from "../contexto/RecargaContext";
import { useScrollLock } from "../contexto/ScrollLockContext";
import AccionesFlotantes from "./AccionesFlotantes";
import Footer from "./Footer";
import { PageLoader } from "./Loader";
import Navbar from "./Navbar";
import WhatsAppFloat from "./WhatsAppFloat";
import { estilosPageShell as styles } from "../estilos/layout";

type PageShellProps = {
  children: ReactNode;
  whatsapp?: boolean;
  footer?: boolean;
  mostrarAtras?: boolean;
  scrollRef?: Ref<ScrollView>;
  onRefrescar?: () => Promise<void> | void;
};

const UMBRAL_FAB = 140;

/** Layout común: Navbar + contenido + Footer. */
export default function PageShell({
  children,
  whatsapp = true,
  footer = true,
  mostrarAtras = false,
  scrollRef,
  onRefrescar,
}: PageShellProps) {
  const internoRef = useRef<ScrollView>(null);
  const [mostrarAcciones, setMostrarAcciones] = useState(false);
  const [actualizando, setActualizando] = useState(false);
  const { recargarApp } = useRecarga();
  const { scrollHabilitado } = useScrollLock();
  const { info } = useAlerta();

  const asignarRef = useCallback(
    (nodo: ScrollView | null) => {
      internoRef.current = nodo;
      if (!scrollRef) return;
      if (typeof scrollRef === "function") scrollRef(nodo);
      else (scrollRef as React.MutableRefObject<ScrollView | null>).current = nodo;
    },
    [scrollRef],
  );

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const y = contentOffset.y;
    const cercaDelFondo = y + layoutMeasurement.height >= contentSize.height - 80;
    const bajoDelInicio = y > UMBRAL_FAB;
    setMostrarAcciones(bajoDelInicio || cercaDelFondo);
  }

  function subirArriba() {
    internoRef.current?.scrollTo({ y: 0, animated: true });
    setMostrarAcciones(false);
  }

  async function actualizarPantalla() {
    setActualizando(true);
    info("Actualizando…");
    try {
      if (onRefrescar) {
        await onRefrescar();
        info("Pantalla actualizada");
        setActualizando(false);
        subirArriba();
        return;
      }
      // Recarga real: en web/nativo reinicia la app (el loader se ve hasta el reload).
      await recargarApp();
    } catch {
      setActualizando(false);
      info("No se pudo actualizar. Intenta de nuevo.");
    }
  }

  return (
    <View style={styles.pagina}>
      <Navbar mostrarAtras={mostrarAtras} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={asignarRef}
          style={styles.flex}
          contentContainerStyle={styles.contenido}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={onScroll}
          scrollEnabled={scrollHabilitado}
          nestedScrollEnabled
        >
          {children}
          {footer ? <Footer /> : null}
        </ScrollView>
      </KeyboardAvoidingView>

      {actualizando ? (
        <View style={styles.overlayCarga} accessibilityLabel="Actualizando pantalla">
          <PageLoader titulo="Actualizando…" subtitulo="Recargando la aplicación" />
        </View>
      ) : null}

      <AccionesFlotantes
        visible={mostrarAcciones && !actualizando}
        onSubir={subirArriba}
        onActualizar={() => void actualizarPantalla()}
        actualizando={actualizando}
      />
      {whatsapp ? <WhatsAppFloat /> : null}
    </View>
  );
}
