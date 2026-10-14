
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";

import { useRouter } from "expo-router";
import { habitaciones } from "../../data/habitaciones";
import HabitacionCard from "../../components/habitacionCard";

export default function Habitaciones() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <FlatList
        data={habitaciones}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <View style={styles.encabezado}>
            <Text style={styles.etiqueta}>
              Hotel Terra Azul
            </Text>

            <Text style={styles.titulo}>
              Nuestras habitaciones
            </Text>

            <Text style={styles.descripcion}>
              Desde la opción Básica hasta Platinum:
              encuentra el espacio ideal para tu viaje.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <HabitacionCard
            habitacion={item}
            onPress={() =>
              router.push({
                pathname: "/habitaciones/[id]",
                params: { id: String(item.id) },
              })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  lista: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 35,
  },
  encabezado: {
    marginBottom: 25,
  },
  etiqueta: {
    fontSize: 16,
    color: "#5A7A9A",
    marginBottom: 8,
  },
  titulo: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#0C3B66",
    marginBottom: 12,
  },
  descripcion: {
    fontSize: 15,
    color: "#5A7A9A",
    lineHeight: 23,
  },
});
