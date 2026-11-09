
# Catalogo de Productos - Corte II

## Descripcion del proyecto

Este proyecto consiste en una aplicacion movil
desarrollada con React Native y Expo.

La aplicacion permite consultar, crear, editar
y eliminar productos utilizando una API REST.

Tambien permite guardar productos localmente,
utilizar el catalogo sin conexion a internet
y marcar productos como favoritos.

## Tecnologias utilizadas

- React Native
- Expo
- Expo Go
- JavaScript
- Expo Router
- Fetch API
- AsyncStorage
- JSONPlaceholder

## Funcionalidades

### 1. Consultar productos (GET)

La aplicacion consulta una API REST y muestra
un listado inicial de 10 productos.

### 2. Crear productos (POST)

Permite agregar productos mediante un formulario
con nombre y descripcion.

### 3. Editar productos (PUT)

Permite modificar el nombre y la descripcion
de los productos existentes.

### 4. Eliminar productos (DELETE)

Permite eliminar productos de la lista
despues de mostrar una confirmacion.

### 5. Validacion de formularios

El nombre y la descripcion son obligatorios.
La aplicacion muestra mensajes cuando
alguno de los campos esta vacio.

### 6. Almacenamiento local

Se utiliza AsyncStorage para guardar
los productos en el dispositivo.

Los cambios se conservan al cerrar
y volver a abrir la aplicacion.

### 7. Funcionamiento sin conexion

La aplicacion puede mostrar productos
guardados localmente sin internet.

Tambien permite realizar cambios locales
cuando falla la conexion.

Los cambios locales no se sincronizan
automaticamente con el servidor.

### 8. Manejo de errores

Se muestran mensajes cuando ocurren
problemas de conexion, errores HTTP
o cuando se agota el tiempo de espera.

### 9. Favoritos

Permite marcar y desmarcar productos
como favoritos.

Los favoritos se guardan localmente
y pueden consultarse mediante un filtro.

## API utilizada

https://jsonplaceholder.typicode.com/posts

Se utiliza JSONPlaceholder como API REST
publica de pruebas.

Los metodos POST, PUT y DELETE son simulados
por la API y no modifican permanentemente
la informacion del servidor.

## Estructura del proyecto

CatalogoProductos/
  app/
    api/
      productos.js
    datos/
      productosLocales.js
    _layout.jsx
    index.jsx
  assets/
  app.json
  package.json
  README.md

## Instalacion

1. Descargar o clonar el repositorio.

2. Abrir la carpeta del proyecto
   en Visual Studio Code.

3. Instalar las dependencias:

   npm install

4. Iniciar el proyecto:

   npx expo start

5. Abrir Expo Go en el celular.

6. Escanear el codigo QR para
   ejecutar la aplicacion.

## Decisiones tecnicas

Se utilizo React Native con Expo para
facilitar el desarrollo y las pruebas
en dispositivos moviles.

Se utilizo JavaScript con archivos JSX.

Expo Router se utiliza para organizar
la pantalla principal de la aplicacion.

Las peticiones HTTP se encuentran en
app/api/productos.js, separadas de
la interfaz de usuario.

AsyncStorage permite guardar los productos
y favoritos localmente.

Se utiliza JSONPlaceholder para practicar
las operaciones de una API REST.

## Pruebas realizadas

- Consultar productos.
- Crear un producto nuevo.
- Editar un producto.
- Eliminar un producto.
- Validar campos vacios.
- Guardar productos localmente.
- Recuperar productos al reiniciar.
- Consultar productos sin internet.
- Guardar cambios locales sin conexion.
- Agregar y quitar favoritos.
- Conservar favoritos al reiniciar.

## Limitaciones

JSONPlaceholder no guarda permanentemente
las operaciones POST, PUT y DELETE.

Los cambios realizados sin conexion se
conservan en el dispositivo, pero no se
envian automaticamente al servidor.

Para una aplicacion de produccion seria
necesario utilizar una API con almacenamiento
real y sincronizacion de datos.

## Entrega

El proyecto se entrega mediante:

- Repositorio de GitHub.
- Archivo README.md.
- Codigo fuente completo.
- Video demostrativo de 3 a 5 minutos.

