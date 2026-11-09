
const URL = "https://jsonplaceholder.typicode.com/posts";


const TIEMPO_ESPERA = 8000;

async function hacerPeticion(url, opciones = {}) {
  const controlador = new AbortController();

  const temporizador = setTimeout(() => {
    controlador.abort();
  }, TIEMPO_ESPERA);

  try {
    const respuesta = await fetch(url, {
      ...opciones,
      signal: controlador.signal,
    });

    if (respuesta.status >= 500) {
      throw new Error(
        "Error del servidor (HTTP " +
          respuesta.status +
          "). Intenta mas tarde."
      );
    }

    if (respuesta.status >= 400) {
      throw new Error(
        "Solicitud rechazada (HTTP " +
          respuesta.status +
          ")."
      );
    }

    if (!respuesta.ok) {
      throw new Error("No se pudo completar la solicitud.");
    }

    if (respuesta.status === 204) {
      return null;
    }

    const texto = await respuesta.text();

    return texto ? JSON.parse(texto) : null;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "Tiempo de espera agotado. Revisa tu conexion."
      );
    }

    if (
      error.message.includes("Network request failed") ||
      error.message.includes("Failed to fetch")
    ) {
      throw new Error(
        "Sin conexion a internet. Revisa tu red."
      );
    }

    throw error;
  } finally {
    clearTimeout(temporizador);
  }
}

// GET - Consultar productos
export async function obtenerProductos() {
  const datos = await hacerPeticion(URL);
  return datos.slice(0, 10);
}


export async function crearProducto(nombre, descripcion) {
  return await hacerPeticion(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: nombre,
      body: descripcion,
      userId: 1,
    }),
  });
}


export async function editarProducto(id, nombre, descripcion) {
  return await hacerPeticion(`${URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      title: nombre,
      body: descripcion,
      userId: 1,
    }),
  });
}

export async function eliminarProducto(id) {
  await hacerPeticion(`${URL}/${id}`, {
    method: "DELETE",
  });

  return true;
}
