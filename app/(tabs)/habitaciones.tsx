import { View } from "react-native";
import HabitacionesDestacadas from "../../components/HabitacionesDestacadas";
import PageShell from "../../components/PageShell";
import SearchBar from "../../components/SearchBar";
import { estilosPantallaInicio as styles } from "../../estilos/inicio";

export default function Habitaciones() {
  return (
    <PageShell>
      <View style={styles.buscador}>
        <SearchBar variante="secciones" />
      </View>
      <HabitacionesDestacadas />
    </PageShell>
  );
}
