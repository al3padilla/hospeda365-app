import { Redirect } from "expo-router";
import { useAuth } from '../contexto/AuthContext';

export default function Index() {
  const { estaAutenticado } = useAuth();
  return <Redirect href={estaAutenticado ? '/(tabs)/perfil' : '/login'} />;
}
