// admin-pedido.js — detalle de un pedido con opción de cambiar su estado

document.addEventListener("DOMContentLoaded", async () => {
  if (!requerirAdministrador()) return;
  construirEncabezado();

  const id = obtenerParametroUrl("id");
  if (!id) {
    mostrarMensaje("detalle-pedido-admin", "Pedido no encontrado.", "error");
    return;
  }

  await cargarDetallePedido(id);
  configurarFormEstado(id);
});

async function cargarDetallePedido(id) {
  const contenedor = document.getElementById("detalle-pedido-admin");
  const seccionEstado = document.getElementById("seccion-estado");

  try {
    const pedido = await peticionGet(`/pedidos/${id}`);

    document.title = `Pedido #${pedido.id} (admin) - Mi Tienda`;

    // Encabezado del pedido
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";

    const titulo = document.createElement("h1");
    titulo.textContent = `Pedido #${pedido.id}`;

    const filaEstado = document.createElement("p");
    filaEstado.append(document.createTextNode("Estado actual: "), crearBadgeEstado(pedido.estado));

    const filaFecha = document.createElement("p");
    filaFecha.textContent = `Fecha: ${formatearFecha(pedido.fecha)}`;

    const filaTotal = document.createElement("p");
    filaTotal.className = "pedido-total-grande";
    filaTotal.textContent = `Total: ${formatearPrecio(pedido.total)}`;

    // Tabla de items
    const tituloItems = document.createElement("h2");
    tituloItems.textContent = "Productos del pedido";

    const tabla = document.createElement("table");
    tabla.className = "tabla-pedido";

    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    for (const col of ["Producto ID", "Precio unitario", "Cantidad", "Subtotal"]) {
      const th = document.createElement("th");
      th.textContent = col;
      trHead.append(th);
    }
    thead.append(trHead);

    const tbody = document.createElement("tbody");
    for (const item of pedido.items) {
      const tr = document.createElement("tr");

      const celdas = [
        item.producto_id,
        formatearPrecio(item.precio_unitario),
        item.cantidad,
        formatearPrecio(item.precio_unitario * item.cantidad),
      ];
      for (const val of celdas) {
        const td = document.createElement("td");
        td.textContent = val;
        tr.append(td);
      }
      tbody.append(tr);
    }

    tabla.append(thead, tbody);
    tarjeta.append(titulo, filaEstado, filaFecha, filaTotal, tituloItems, tabla);
    contenedor.replaceChildren(tarjeta);

    // Pre-seleccionar el estado actual en el formulario
    document.getElementById("select-estado").value = pedido.estado;
    seccionEstado.hidden = false;
  } catch {
    mostrarMensaje("detalle-pedido-admin", "No se pudo cargar el pedido.", "error");
  }
}

function configurarFormEstado(pedidoId) {
  const form = document.getElementById("form-estado");
  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    limpiarMensaje("mensaje-estado");

    const estado = document.getElementById("select-estado").value;
    try {
      await peticionPut(`/pedidos/${pedidoId}/estado`, { estado });
      mostrarMensaje("mensaje-estado", "Estado actualizado correctamente.", "exito");
      // Recarga el detalle para reflejar el cambio
      await cargarDetallePedido(pedidoId);
    } catch (error) {
      mostrarMensaje("mensaje-estado", error.message || "Error al actualizar el estado.", "error");
    }
  });
}
