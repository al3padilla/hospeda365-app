import type { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { HabitacionesProvider } from "./HabitacionesContext";

export default function Proveedores({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <HabitacionesProvider>{children}</HabitacionesProvider>
    </AuthProvider>
  );
}
