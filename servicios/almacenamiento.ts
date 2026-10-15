import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Equivalente al `localStorage` de la web. Nunca lanza: si el almacenamiento
 * falla, la app sigue funcionando con los datos en memoria.
 */
export const almacenamiento = {
  async leer<T>(clave: string): Promise<T | null> {
    try {
      const valor = await AsyncStorage.getItem(clave);
      return valor ? (JSON.parse(valor) as T) : null;
    } catch {
      return null;
    }
  },

  async guardar(clave: string, valor: unknown): Promise<void> {
    try {
      await AsyncStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      // Ignorado: el dato sigue en memoria.
    }
  },

  async borrar(clave: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(clave);
    } catch {
      // Ignorado.
    }
  },
};
