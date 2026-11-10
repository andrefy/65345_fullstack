// carrito.js — muestra los items del carrito y permite modificarlos o confirmar el pedido

document.addEventListener("DOMContentLoaded", async () => {
  if (!requerirAutenticacion()) return;
  construirEncabezado();
  document.getElementById("btn-confirmar").addEventListener("click", function () {
    window.location.href = "confirmacion.html";
  });
  await cargarCarrito();
});

async function cargarCarrito() {
  const contenedor = document.getElementById("items-carrito");
  const resumen = document.getElementById("resumen-carrito");
  const totalEl = document.getElementById("total-carrito");

  try {
    const datos = await peticionGet("/carrito/");
    contenedor.replaceChildren();

    if (!datos.items || datos.items.length === 0) {
      const p = document.createElement("p");
      p.textContent = "Tu carrito está vacío.";
      contenedor.append(p);
      resumen.hidden = true;
      return;
    }

    // Tabla de items del carrito
    const tabla = document.createElement("table");
    tabla.className = "tabla-carrito";

    // Encabezado
    const thead = document.createElement("thead");
    const encabezadoFila = document.createElement("tr");
    for (const col of ["Producto", "Precio", "Cantidad", "Subtotal", "Acción"]) {
      const th = document.createElement("th");
      th.textContent = col;
      encabezadoFila.append(th);
    }
    thead.append(encabezadoFila);
    tabla.append(thead);

    // Filas de productos
    const tbody = document.createElement("tbody");
    for (const item of datos.items) {
      tbody.append(crearFilaCarrito(item));
    }
    tabla.append(tbody);
    contenedor.append(tabla);

    // Resumen total
    totalEl.textContent = formatearPrecio(datos.total);
    resumen.hidden = false;

  } catch {
    mostrarMensaje("mensaje-carrito", "No se pudo cargar el carrito.", "error");
  }
}

function crearFilaCarrito(item) {
  const fila = document.createElement("tr");

  // Nombre + imagen pequeña
  const tdNombre = document.createElement("td");
  const img = document.createElement("img");
  img.src = obtenerUrlImagen(item.imagen);
  img.alt = item.nombre_producto;
  img.className = "carrito-thumbnail";
  const nombre = document.createElement("span");
  nombre.textContent = item.nombre_producto;
  tdNombre.append(img, nombre);

  // Precio unitario
  const tdPrecio = document.createElement("td");
  tdPrecio.textContent = formatearPrecio(item.precio_unitario);

  // Input de cantidad
  const tdCantidad = document.createElement("td");
  const inputCantidad = document.createElement("input");
  inputCantidad.type = "number";
  inputCantidad.min = "1";
  inputCantidad.value = String(item.cantidad);
  inputCantidad.className = "input-cantidad-carrito";
  inputCantidad.setAttribute("aria-label", `Cantidad de ${item.nombre_producto}`);
  inputCantidad.addEventListener("change", () =>
    actualizarItem(item.id, parseInt(inputCantidad.value, 10))
  );
  tdCantidad.append(inputCantidad);

  // Subtotal
  const tdSubtotal = document.createElement("td");
  tdSubtotal.textContent = formatearPrecio(item.subtotal);
  tdSubtotal.id = `subtotal-${item.id}`;

  // Botón eliminar
  const tdAccion = document.createElement("td");
  const btnEliminar = document.createElement("button");
  btnEliminar.className = "btn btn-peligro btn-sm";
  btnEliminar.textContent = "Eliminar";
  btnEliminar.addEventListener("click", () => eliminarItem(item.id, fila));
  tdAccion.append(btnEliminar);

  fila.append(tdNombre, tdPrecio, tdCantidad, tdSubtotal, tdAccion);
  return fila;
}

async function actualizarItem(itemId, cantidad) {
  if (!cantidad || cantidad < 1) return;
  try {
    await peticionPut(`/carrito/items/${itemId}`, { cantidad });
    actualizarContadorCarrito();
    // Recarga toda la vista para reflejar el nuevo total
    await cargarCarrito();
  } catch (error) {
    mostrarMensaje("mensaje-carrito", error.message || "Error al actualizar la cantidad.", "error");
  }
}

async function eliminarItem(itemId, fila) {
  try {
    await peticionDelete(`/carrito/items/${itemId}`);
    fila.remove();
    actualizarContadorCarrito();
    await cargarCarrito();
  } catch {
    mostrarMensaje("mensaje-carrito", "No se pudo eliminar el producto.", "error");
  }
}
