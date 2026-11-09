
import AsyncStorage from "@react-native-async-storage/async-storage";

const CLAVE = "productos_guardados";

// Guardar lista de productos
export async function guardarProductos(productos) {
  try {
    const datos = JSON.stringify(productos);
    await AsyncStorage.setItem(CLAVE, datos);
  } catch (error) {
    throw new Error(
      "No se pudieron guardar los productos en el celular."
    );
  }
}

// Recuperar lista guardada
export async function cargarProductosGuardados() {
  try {
    const datos = await AsyncStorage.getItem(CLAVE);

    if (datos !== null) {
      return JSON.parse(datos);
    }

    return null;
  } catch (error) {
    throw new Error(
      "No se pudieron recuperar los productos guardados."
    );
  }
}
