# Tienda Virtual Full Stack con FastAPI, SQLModel y SQLite

## Objetivo

Desarrollar una aplicación web Full Stack que permita gestionar y comercializar productos mediante una arquitectura cliente-servidor. Los estudiantes deberán implementar un backend con FastAPI, una base de datos relacional SQLite gestionada exclusivamente mediante SQLModel y un frontend que permita explorar productos, gestionar categorías, autenticar usuarios y simular el proceso de compra.

La aplicación deberá contar con una landing page que presente productos seleccionados aleatoriamente de todo el catálogo, un catálogo con búsqueda y filtros, un sistema de autenticación y un flujo de carrito de compras y generación de pedidos.

## Requerimientos Técnicos Obligatorios

### 1. Gestión de recursos

- Crear una carpeta denominada `Assets` para almacenar las imágenes de los productos.
- Descargar las imágenes que se utilizarán en la tienda.
- Organizar las imágenes para facilitar su identificación y asociación con los productos.
- Registrar en SQLite las rutas de las imágenes correspondientes a cada producto.
- Utilizar las imágenes almacenadas localmente, sin depender de servicios externos.

### 2. Backend: FastAPI, SQLModel y SQLite

- Framework: Implementar el backend utilizando FastAPI.
- Base de datos: Utilizar SQLite con SQLModel. No se permite utilizar SQLAlchemy puro.
- Arquitectura: Organizar el backend mediante una estructura modular que separe modelos, esquemas, controladores, servicios, dependencias y configuración.
- Middleware: Configurar `CORSMiddleware` para permitir la comunicación entre frontend y backend.

Modelado de datos:

Definir los modelos necesarios para gestionar:

| Modelo        | Descripción                                                  |
| ------------- | ------------------------------------------------------------ |
| `Usuario`     | Información de los usuarios, correo electrónico y contraseña protegida. |
| `Producto`    | Nombre, descripción, precio, stock, imagen y categoría.      |
| `Categoria`   | Nombre y descripción.                                        |
| `Carrito`     | Carrito de compras asociado a un usuario.                    |
| `CarritoItem` | Productos y cantidades agregadas al carrito.                 |
| `Pedido`      | Información general de una compra realizada.                 |
| `PedidoItem`  | Productos, cantidades y precios correspondientes a cada pedido. |

Relaciones:

- Un usuario puede tener un carrito de compras.
- Un usuario puede realizar múltiples pedidos.
- Una categoría puede tener múltiples productos.
- Un carrito puede contener múltiples productos.
- Un pedido puede contener múltiples productos.
- Cada producto puede pertenecer a múltiples pedidos mediante sus respectivos detalles.

### 3. Sistema de autenticación y autorización

Implementar un sistema de autenticación utilizando JWT.

Funcionalidades:

- Registro de usuarios.
- Inicio de sesión mediante correo electrónico y contraseña.
- Cifrado hash de contraseñas; nunca almacenarlas en texto plano.
- Generación y validación de tokens JWT.
- Endpoint para obtener la información del usuario autenticado.
- Protección de endpoints mediante dependencias de autenticación

### 4. Gestión de productos y categorías

Implementar los endpoints necesarios para:

- Obtener todos los productos.
- Obtener el detalle de un producto.
- Crear, actualizar y eliminar productos.
- Buscar productos por nombre o descripción.
- Filtrar productos por categoría.
- Obtener productos aleatorios de todo el catálogo.
- Consultar productos por categoría.
- Crear, actualizar y eliminar categorías.
- Controlar el stock disponible de los productos.

### 5. Carrito de compras y pedidos

Implementar un sistema de compras que permita:

Carrito de compras:

- Agregar productos al carrito.
- Consultar los productos agregados.
- Modificar las cantidades.
- Eliminar productos del carrito.
- Calcular automáticamente el subtotal y total de la compra.
- Validar que exista stock suficiente.

Pedidos:

- Generar un pedido a partir del carrito de compras.
- Registrar los productos, cantidades y precios de cada pedido.
- Descontar el stock correspondiente al confirmar la compra.
- Consultar el historial de pedidos del usuario.
- Consultar el detalle de un pedido.
- Permitir al administrador consultar los pedidos registrados.
- Gestionar estados de los pedidos: pendiente, procesando, enviado y entregado.

No es necesario implementar una pasarela de pagos. El proceso de compra será simulado.

### 6. Frontend: Experiencia de Usuario (UX/UI)

- Maquetación: Implementar un diseño Mobile First utilizando etiquetas HTML semánticas.
- Estructura: Utilizar CSS Grid para la distribución general de los elementos y Flexbox para los componentes.
- Consumo de API: Consumir los endpoints de FastAPI mediante JavaScript utilizando `fetch`.
- Restricción: Queda prohibido el uso de `innerHTML` en JavaScript.

Funcionalidades obligatorias:

A. Landing Page

- Mostrar productos seleccionados aleatoriamente de todo el catálogo.
- Incorporar secciones de productos destacados y categorías.
- Mostrar imágenes, nombres, precios y descripciones breves.
- Implementar una barra de búsqueda.
- Permitir acceder al detalle de cada producto.

B. Catálogo de productos

- Mostrar todos los productos registrados.
- Filtrar por categoría.
- Buscar por nombre o descripción.
- Mostrar disponibilidad y precio.
- Navegar al detalle de cada producto.

C. Detalle del producto

- Mostrar imagen, nombre, descripción, precio y stock.
- Mostrar la categoría correspondiente.
- Permitir agregar el producto al carrito.
- Validar disponibilidad antes de agregarlo.

D. Autenticación

- Crear páginas de registro e inicio de sesión.
- Mostrar información del usuario autenticado.
- Permitir cerrar sesión.
- Restringir las funcionalidades que requieren autenticación.

E. Carrito de compras

- Mostrar los productos agregados.
- Modificar cantidades y eliminar productos.
- Calcular el total automáticamente.
- Permitir confirmar la compra.

F. Mis pedidos

- Mostrar el historial de compras del usuario.
- Consultar el detalle de cada pedido.
- Mostrar el estado actual de cada pedido.



## Setup Backend

### Variables de entorno

| Variable                      | Descripción                                                  |
| ----------------------------- | ------------------------------------------------------------ |
| `DATABASE_URL`                | URL de conexión a la base de datos (ej. `sqlite:///./database.db`) |
| `SECRET_KEY`                  | Clave secreta para firmar y verificar los tokens JWT         |
| `ALGORITHM`                   | Algoritmo de cifrado del token JWT (ej. `HS256`)             |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Tiempo de expiración del token en minutos                    |

### Instalación

Configurar python3

```bash
python3 -m venv .venv
```

Inicializar virtual environment

```bash
source .venv/bin/activate
```

Instalar dependencias

```bash
python3 -m pip install -r requirements.txt
```

Inicializar fastapi HTTP server

```bash
fastapi dev
```

