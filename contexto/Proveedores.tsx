import type { ReactNode } from "react";
import { AlertaProvider } from "./AlertaContext";
import { AuthProvider } from "./AuthContext";
import { HabitacionesProvider } from "./HabitacionesContext";
import { RecargaProvider } from "./RecargaContext";
import { ReservasProvider } from "./ReservasContext";
import { ScrollLockProvider } from "./ScrollLockContext";

export default function Proveedores({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AlertaProvider>
        <RecargaProvider>
          <ScrollLockProvider>
            <HabitacionesProvider>
              <ReservasProvider>{children}</ReservasProvider>
            </HabitacionesProvider>
          </ScrollLockProvider>
        </RecargaProvider>
      </AlertaProvider>
    </AuthProvider>
  );
}
