
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

import {
  crearProducto,
  editarProducto,
  eliminarProducto,
} from "./api/productos";

import {
  guardarProductos,
  cargarProductosGuardados,
} from "./datos/productosLocales";

const productosIniciales = [
  {
    id: 1,
    title: "Teclado Gamer",
    body: "Teclado con iluminación LED, ideal para jugar y trabajar.",
    favorito: false,
  },
  {
    id: 2,
    title: "Mouse inalámbrico",
    body: "Mouse cómodo y preciso, con conexión inalámbrica.",
    favorito: false,
  },
  {
    id: 3,
    title: "Audífonos Bluetooth",
    body: "Audífonos inalámbricos con sonido de alta calidad.",
    favorito: false,
  },
  {
    id: 4,
    title: "Laptop HP",
    body: "Computadora portátil ideal para estudiar y trabajar.",
    favorito: false,
  },
  {
    id: 5,
    title: "Memoria USB 64 GB",
    body: "Dispositivo para almacenar y transportar archivos.",
    favorito: false,
  },
  {
    id: 6,
    title: "Monitor Samsung",
    body: "Monitor de 24 pulgadas con pantalla Full HD.",
    favorito: false,
  },
  {
    id: 7,
    title: "Cámara web HD",
    body: "Cámara para videollamadas y reuniones virtuales.",
    favorito: false,
  },
  {
    id: 8,
    title: "Bocina Bluetooth",
    body: "Altavoz portátil para escuchar música sin cables.",
    favorito: false,
  },
  {
    id: 9,
    title: "Disco duro externo",
    body: "Unidad de almacenamiento para respaldar información.",
    favorito: false,
  },
  {
    id: 10,
    title: "Impresora Epson",
    body: "Impresora multifuncional para documentos e imágenes.",
    favorito: false,
  },
];

export default function Inicio() {
  const [productos, setProductos] = useState([]);
  const productosRef = useRef([]);
  const colaGuardado = useRef(Promise.resolve());

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [productoEditar, setProductoEditar] = useState(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [errores, setErrores] = useState({});

  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(null);
  const [soloFavoritos, setSoloFavoritos] = useState(false);

  const productosVisibles = soloFavoritos
    ? productos.filter((p) => p.favorito === true)
    : productos;

  const cantidadFavoritos = productos.filter(
    (p) => p.favorito === true
  ).length;

  useEffect(() => {
    cargarProductos();
  }, []);

  function actualizarPantalla(lista) {
    productosRef.current = lista;
    setProductos(lista);
  }

  async function guardarLista(lista) {
    actualizarPantalla(lista);

    const operacion = colaGuardado.current
      .catch(() => {})
      .then(() => guardarProductos(lista));

    colaGuardado.current = operacion;

    await operacion;
  }

  async function cargarProductos() {
    setCargando(true);
    setError("");

    try {
      const guardados = await cargarProductosGuardados();

      if (Array.isArray(guardados)) {
        actualizarPantalla(guardados);
      } else {
        const lista = productosIniciales.map(
          (p) => ({ ...p })
        );

        await guardarLista(lista);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function cambiarFavorito(id) {
    const lista = productosRef.current.map((producto) =>
      producto.id === id
        ? {
            ...producto,
            favorito: !producto.favorito,
          }
        : producto
    );

    try {
      await guardarLista(lista);
      setAviso("");
    } catch (err) {
      setAviso(
        "No se pudo guardar el favorito. " + err.message
      );

      Alert.alert("Error al guardar", err.message);
    }
  }

  function abrirCrear() {
    setProductoEditar(null);
    setNombre("");
    setDescripcion("");
    setErrores({});
    setMostrarFormulario(true);
  }

  function abrirEditar(producto) {
    setProductoEditar(producto);
    setNombre(producto.title);
    setDescripcion(producto.body);
    setErrores({});
    setMostrarFormulario(true);
  }

  function cancelarFormulario() {
    setMostrarFormulario(false);
    setProductoEditar(null);
    setNombre("");
    setDescripcion("");
    setErrores({});
  }

  async function guardarProducto() {
    const nuevosErrores = {};

    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }

    if (!descripcion.trim()) {
      nuevosErrores.descripcion =
        "La descripción es obligatoria.";
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    setGuardando(true);
    let errorConexion = "";

    try {
      if (productoEditar) {
        if (productoEditar.id <= 100) {
          try {
            await editarProducto(
              productoEditar.id,
              nombre.trim(),
              descripcion.trim()
            );
          } catch (err) {
            errorConexion = err.message;
          }
        }

        const lista = productosRef.current.map((p) =>
          p.id === productoEditar.id
            ? {
                ...p,
                title: nombre.trim(),
                body: descripcion.trim(),
              }
            : p
        );

        await guardarLista(lista);
      } else {
        try {
          await crearProducto(
            nombre.trim(),
            descripcion.trim()
          );
        } catch (err) {
          errorConexion = err.message;
        }

        const nuevoProducto = {
          id: Date.now(),
          title: nombre.trim(),
          body: descripcion.trim(),
          favorito: false,
        };

        await guardarLista([
          nuevoProducto,
          ...productosRef.current,
        ]);
      }

      cancelarFormulario();

      setAviso(
        errorConexion
          ? "Producto guardado localmente. La API no respondió."
          : "Producto guardado correctamente."
      );

      Alert.alert(
        "Éxito",
        "Producto guardado correctamente."
      );
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setGuardando(false);
    }
  }

  function confirmarEliminar(producto) {
    Alert.alert(
      "Eliminar producto",
      `¿Querés eliminar "${producto.title}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => borrarProducto(producto),
        },
      ]
    );
  }

  async function borrarProducto(producto) {
    setEliminando(producto.id);
    let errorConexion = "";

    try {
      if (producto.id <= 100) {
        try {
          await eliminarProducto(producto.id);
        } catch (err) {
          errorConexion = err.message;
        }
      }

      const lista = productosRef.current.filter(
        (p) => p.id !== producto.id
      );

      await guardarLista(lista);

      setAviso(
        errorConexion
          ? "Producto eliminado localmente."
          : "Producto eliminado correctamente."
      );
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setEliminando(null);
    }
  }

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>
        Catálogo de Productos
      </Text>

      {aviso !== "" && (
        <Text style={estilos.aviso}>{aviso}</Text>
      )}

      {!mostrarFormulario && (
        <Pressable
          style={estilos.botonAgregar}
          onPress={abrirCrear}
        >
          <Text style={estilos.textoBoton}>
            + Agregar producto
          </Text>
        </Pressable>
      )}

      {mostrarFormulario && (
        <View style={estilos.formulario}>
          <Text style={estilos.subtitulo}>
            {productoEditar
              ? "Editar producto"
              : "Nuevo producto"}
          </Text>

          <TextInput
            style={estilos.entrada}
            placeholder="Nombre del producto"
            value={nombre}
            onChangeText={setNombre}
          />

          {errores.nombre && (
            <Text style={estilos.errorCampo}>
              {errores.nombre}
            </Text>
          )}

          <TextInput
            style={estilos.entrada}
            placeholder="Descripción del producto"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
          />

          {errores.descripcion && (
            <Text style={estilos.errorCampo}>
              {errores.descripcion}
            </Text>
          )}

          <Pressable
            style={estilos.botonGuardar}
            onPress={guardarProducto}
            disabled={guardando}
          >
            <Text style={estilos.textoBoton}>
              {guardando
                ? "Guardando..."
                : productoEditar
                ? "Actualizar producto"
                : "Guardar producto"}
            </Text>
          </Pressable>

          <Pressable
            style={estilos.botonCancelar}
            onPress={cancelarFormulario}
            disabled={guardando}
          >
            <Text style={estilos.textoBoton}>
              Cancelar
            </Text>
          </Pressable>
        </View>
      )}

      {!cargando && error === "" && (
        <View style={estilos.filtros}>
          <Pressable
            style={[
              estilos.botonFiltro,
              !soloFavoritos && estilos.filtroActivo,
            ]}
            onPress={() => setSoloFavoritos(false)}
          >
            <Text
              style={[
                estilos.textoFiltro,
                !soloFavoritos && estilos.textoActivo,
              ]}
            >
              Todos ({productos.length})
            </Text>
          </Pressable>

          <Pressable
            style={[
              estilos.botonFiltro,
              soloFavoritos && estilos.filtroActivo,
            ]}
            onPress={() => setSoloFavoritos(true)}
          >
            <Text
              style={[
                estilos.textoFiltro,
                soloFavoritos && estilos.textoActivo,
              ]}
            >
              Favoritos ({cantidadFavoritos})
            </Text>
          </Pressable>
        </View>
      )}

      {cargando ? (
        <View style={estilos.centro}>
          <ActivityIndicator
            size="large"
            color="#0066cc"
          />
          <Text>Cargando productos...</Text>
        </View>
      ) : error !== "" ? (
        <View style={estilos.centro}>
          <Text style={estilos.errorCampo}>
            {error}
          </Text>

          <Pressable
            style={estilos.botonAgregar}
            onPress={cargarProductos}
          >
            <Text style={estilos.textoBoton}>
              Reintentar
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={productosVisibles}
          keyExtractor={(item) => String(item.id)}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={estilos.lista}
          ListEmptyComponent={
            <View style={estilos.centro}>
              <Text style={estilos.mensajeVacio}>
                {soloFavoritos
                  ? "Todavía no tenés productos favoritos."
                  : "No hay productos disponibles."}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={estilos.tarjeta}>
              <Text style={estilos.nombre}>
                {item.title}
              </Text>

              <Text style={estilos.descripcion}>
                {item.body}
              </Text>

              <Pressable
                style={[
                  estilos.botonFavorito,
                  item.favorito && estilos.favoritoActivo,
                ]}
                onPress={() => cambiarFavorito(item.id)}
              >
                <Text
                  style={[
                    estilos.textoFavorito,
                    item.favorito &&
                      estilos.textoFavoritoActivo,
                  ]}
                >
                  {item.favorito
                    ? "Quitar de favoritos"
                    : "Agregar a favoritos"}
                </Text>
              </Pressable>

              <View style={estilos.filaBotones}>
                <Pressable
                  style={estilos.botonEditar}
                  onPress={() => abrirEditar(item)}
                  disabled={eliminando !== null}
                >
                  <Text style={estilos.textoBoton}>
                    Editar
                  </Text>
                </Pressable>

                <Pressable
                  style={estilos.botonEliminar}
                  onPress={() => confirmarEliminar(item)}
                  disabled={eliminando !== null}
                >
                  <Text style={estilos.textoBoton}>
                    {eliminando === item.id
                      ? "Eliminando..."
                      : "Eliminar"}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#f2f5fa",
    paddingHorizontal: 15,
    paddingTop: 50,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#003366",
    marginBottom: 20,
  },
  aviso: {
    backgroundColor: "#fff3cd",
    color: "#664d03",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    textAlign: "center",
  },
  botonAgregar: {
    backgroundColor: "#0066cc",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  botonGuardar: {
    backgroundColor: "#008000",
    padding: 13,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  botonCancelar: {
    backgroundColor: "#777777",
    padding: 13,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  textoBoton: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 15,
  },
  formulario: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 12,
  },
  entrada: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#ffffff",
  },
  errorCampo: {
    color: "#d32f2f",
    fontSize: 14,
    marginBottom: 10,
  },
  filtros: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  botonFiltro: {
    flex: 1,
    padding: 11,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0066cc",
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  filtroActivo: {
    backgroundColor: "#0066cc",
  },
  textoFiltro: {
    color: "#0066cc",
    fontWeight: "bold",
    fontSize: 13,
  },
  textoActivo: {
    color: "#ffffff",
  },
  lista: {
    paddingBottom: 30,
    flexGrow: 1,
  },
  tarjeta: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 2,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 15,
    color: "#555555",
    marginBottom: 14,
    lineHeight: 22,
  },
  botonFavorito: {
    backgroundColor: "#fff0f3",
    borderWidth: 1,
    borderColor: "#e91e63",
    padding: 11,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  favoritoActivo: {
    backgroundColor: "#e91e63",
  },
  textoFavorito: {
    color: "#c2185b",
    fontWeight: "bold",
  },
  textoFavoritoActivo: {
    color: "#ffffff",
  },
  filaBotones: {
    flexDirection: "row",
    gap: 10,
  },
  botonEditar: {
    flex: 1,
    backgroundColor: "#e69500",
    padding: 11,
    borderRadius: 8,
    alignItems: "center",
  },
  botonEliminar: {
    flex: 1,
    backgroundColor: "#d32f2f",
    padding: 11,
    borderRadius: 8,
    alignItems: "center",
  },
  centro: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  mensajeVacio: {
    fontSize: 16,
    color: "#555555",
    textAlign: "center",
  },
});
