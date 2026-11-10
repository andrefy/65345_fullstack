// producto.js — muestra el detalle de un producto y permite agregarlo al carrito

document.addEventListener("DOMContentLoaded", async () => {
  construirEncabezado();

  const id = obtenerParametroUrl("id");
  if (!id) {
    mostrarMensaje("detalle-producto", "Producto no encontrado.", "error");
    return;
  }

  await cargarProducto(id);
});

async function cargarProducto(id) {
  const contenedor = document.getElementById("detalle-producto");
  try {
    const producto = await peticionGet(`/productos/${id}`);

    // Actualiza la miga de pan
    document.getElementById("breadcrumb-nombre").textContent = producto.nombre;
    document.title = `${producto.nombre} - Mi Tienda`;

    // Construye la vista de detalle del producto
    const seccion = document.createElement("section");
    seccion.className = "detalle-producto";

    // Imagen
    const img = document.createElement("img");
    img.src = obtenerUrlImagen(producto.imagen);
    img.alt = producto.nombre;
    img.className = "detalle-imagen";

    // Info
    const info = document.createElement("div");
    info.className = "detalle-info";

    const titulo = document.createElement("h1");
    titulo.textContent = producto.nombre;

    const precio = document.createElement("p");
    precio.className = "detalle-precio";
    precio.textContent = formatearPrecio(producto.precio);

    const descripcion = document.createElement("p");
    descripcion.className = "detalle-descripcion";
    descripcion.textContent = producto.descripcion || "Sin descripción disponible.";

    const stock = document.createElement("p");
    stock.className = producto.stock > 0 ? "stock-disponible" : "stock-agotado";
    stock.textContent = producto.stock > 0 ? `Stock disponible: ${producto.stock}` : "Agotado";

    // Control de cantidad + botón agregar al carrito
    const controles = document.createElement("div");
    controles.className = "detalle-controles";

    const labelCantidad = document.createElement("label");
    labelCantidad.htmlFor = "input-cantidad";
    labelCantidad.textContent = "Cantidad:";

    const inputCantidad = document.createElement("input");
    inputCantidad.type = "number";
    inputCantidad.id = "input-cantidad";
    inputCantidad.min = "1";
    inputCantidad.max = String(producto.stock);
    inputCantidad.value = "1";
    inputCantidad.disabled = producto.stock === 0;

    const btnAgregar = document.createElement("button");
    btnAgregar.className = "btn btn-primario";
    btnAgregar.textContent = "Agregar al carrito";
    btnAgregar.disabled = producto.stock === 0;
    btnAgregar.addEventListener("click", () => agregarAlCarrito(producto.id, inputCantidad));

    controles.append(labelCantidad, inputCantidad, btnAgregar);
    info.append(titulo, precio, descripcion, stock, controles);
    seccion.append(img, info);

    contenedor.replaceChildren(seccion);
  } catch {
    mostrarMensaje("detalle-producto", "No se pudo cargar el producto.", "error");
  }
}

async function agregarAlCarrito(productoId, inputCantidad) {
  if (!estaAutenticado()) {
    window.location.href = `login.html?redirigir=producto.html?id=${productoId}`;
    return;
  }

  const cantidad = parseInt(inputCantidad.value, 10);
  if (!cantidad || cantidad < 1) {
    mostrarMensaje("mensaje-carrito", "Ingresa una cantidad válida.", "error");
    return;
  }

  try {
    await peticionPost("/carrito/items", { producto_id: productoId, cantidad });
    actualizarContadorCarrito();
    mostrarMensaje("mensaje-carrito", "¡Producto agregado al carrito!", "exito");
  } catch (error) {
    mostrarMensaje("mensaje-carrito", error.message || "Error al agregar el producto.", "error");
  }
}
