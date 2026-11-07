import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { DevSettings, Platform } from "react-native";

type RecargaContextValue = {
  /** Recarga real de la app (web: F5; nativo: reload del runtime). */
  recargarApp: () => Promise<void>;
};

const RecargaContext = createContext<RecargaContextValue | null>(null);

async function ejecutarRecargaReal() {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
    return;
  }

  // Desarrollo (Expo Go / Metro): reinicia el JS bundle.
  if (typeof __DEV__ !== "undefined" && __DEV__ && DevSettings?.reload) {
    DevSettings.reload();
    return;
  }

  // Build con OTA: reinicia el runtime.
  try {
    const Updates = await import("expo-updates");
    await Updates.reloadAsync();
  } catch {
    if (DevSettings?.reload) DevSettings.reload();
  }
}

export function RecargaProvider({ children }: { children: ReactNode }) {
  const recargarApp = useCallback(async () => {
    await ejecutarRecargaReal();
  }, []);

  const value = useMemo(() => ({ recargarApp }), [recargarApp]);

  return (
    <RecargaContext.Provider value={value}>{children}</RecargaContext.Provider>
  );
}

export function useRecarga() {
  const ctx = useContext(RecargaContext);
  if (!ctx) {
    throw new Error("useRecarga debe usarse dentro de RecargaProvider");
  }
  return ctx;
}
