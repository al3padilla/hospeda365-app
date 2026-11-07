import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ScrollLockContextValue = {
  scrollHabilitado: boolean;
  /** Bloquea el ScrollView padre mientras se manipula el mapa. */
  bloquearScroll: () => void;
  liberarScroll: () => void;
};

const ScrollLockContext = createContext<ScrollLockContextValue | null>(null);

export function ScrollLockProvider({ children }: { children: ReactNode }) {
  const [scrollHabilitado, setScrollHabilitado] = useState(true);

  const bloquearScroll = useCallback(() => setScrollHabilitado(false), []);
  const liberarScroll = useCallback(() => setScrollHabilitado(true), []);

  const value = useMemo(
    () => ({ scrollHabilitado, bloquearScroll, liberarScroll }),
    [scrollHabilitado, bloquearScroll, liberarScroll],
  );

  return (
    <ScrollLockContext.Provider value={value}>{children}</ScrollLockContext.Provider>
  );
}

export function useScrollLock() {
  const ctx = useContext(ScrollLockContext);
  if (!ctx) {
    throw new Error("useScrollLock debe usarse dentro de ScrollLockProvider");
  }
  return ctx;
}
