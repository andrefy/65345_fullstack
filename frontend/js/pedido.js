// pedido.js — muestra el detalle completo de un pedido del usuario

document.addEventListener("DOMContentLoaded", async () => {
  if (!requerirAutenticacion()) return;
  construirEncabezado();

  const id = obtenerParametroUrl("id");
  if (!id) {
    mostrarMensaje("detalle-pedido", "Pedido no encontrado.", "error");
    return;
  }

  await cargarDetallePedido(id);
});

async function cargarDetallePedido(id) {
  const contenedor = document.getElementById("detalle-pedido");
  try {
    const pedido = await peticionGet(`/pedidos/${id}`);

    contenedor.replaceChildren();

    document.title = `Pedido #${pedido.id} - Mi Tienda`;

    // Encabezado del pedido
    const encabezado = document.createElement("div");
    encabezado.className = "pedido-encabezado tarjeta";

    const titulo = document.createElement("h1");
    titulo.textContent = `Pedido #${pedido.id}`;

    const filaEstado = document.createElement("p");
    filaEstado.append(document.createTextNode("Estado: "), crearBadgeEstado(pedido.estado));

    const filaFecha = document.createElement("p");
    filaFecha.textContent = `Fecha: ${formatearFecha(pedido.fecha)}`;

    const filaTotal = document.createElement("p");
    filaTotal.className = "pedido-total-grande";
    filaTotal.textContent = `Total: ${formatearPrecio(pedido.total)}`;

    encabezado.append(titulo, filaEstado, filaFecha, filaTotal);

    // Tabla de items del pedido
    const tituloItems = document.createElement("h2");
    tituloItems.textContent = "Productos";

    const tabla = document.createElement("table");
    tabla.className = "tabla-pedido";

    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    for (const col of ["Producto", "Precio unitario", "Cantidad", "Subtotal"]) {
      const th = document.createElement("th");
      th.textContent = col;
      trHead.append(th);
    }
    thead.append(trHead);

    const tbody = document.createElement("tbody");
    for (const item of pedido.items) {
      const tr = document.createElement("tr");

      const tdNombre = document.createElement("td");
      tdNombre.textContent = item.nombre_producto || `Producto #${item.producto_id}`;

      const tdPrecio = document.createElement("td");
      tdPrecio.textContent = formatearPrecio(item.precio_unitario);

      const tdCantidad = document.createElement("td");
      tdCantidad.textContent = item.cantidad;

      const tdSubtotal = document.createElement("td");
      tdSubtotal.textContent = formatearPrecio(item.precio_unitario * item.cantidad);

      tr.append(tdNombre, tdPrecio, tdCantidad, tdSubtotal);
      tbody.append(tr);
    }

    tabla.append(thead, tbody);

    const enlaceVolver = document.createElement("a");
    enlaceVolver.href = "mis-pedidos.html";
    enlaceVolver.className = "btn btn-secundario";
    enlaceVolver.textContent = "← Mis pedidos";

    contenedor.append(encabezado, tituloItems, tabla, enlaceVolver);
  } catch {
    mostrarMensaje("detalle-pedido", "No se pudo cargar el pedido.", "error");
  }
}
