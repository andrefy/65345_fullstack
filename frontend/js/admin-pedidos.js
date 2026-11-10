// admin-pedidos.js — lista todos los pedidos de la tienda para el administrador

document.addEventListener("DOMContentLoaded", async () => {
  if (!requerirAdministrador()) return;
  construirEncabezado();
  await cargarTodosPedidos();
});

async function cargarTodosPedidos() {
  const contenedor = document.getElementById("tabla-pedidos");
  try {
    const pedidos = await peticionGet("/pedidos/admin/todos");
    contenedor.replaceChildren();

    if (pedidos.length === 0) {
      const p = document.createElement("p");
      p.textContent = "No hay pedidos registrados.";
      contenedor.append(p);
      return;
    }

    const tabla = document.createElement("table");
    tabla.className = "tabla-admin";

    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    for (const col of ["ID", "Usuario", "Fecha", "Total", "Estado", "Acción"]) {
      const th = document.createElement("th");
      th.textContent = col;
      trHead.append(th);
    }
    thead.append(trHead);

    const tbody = document.createElement("tbody");
    for (const pedido of pedidos) {
      tbody.append(crearFilaPedido(pedido));
    }

    tabla.append(thead, tbody);
    contenedor.append(tabla);
  } catch {
    mostrarMensaje("mensaje-admin", "No se pudieron cargar los pedidos.", "error");
  }
}

function crearFilaPedido(pedido) {
  const tr = document.createElement("tr");

  const tdId = document.createElement("td");
  tdId.textContent = pedido.id;

  const tdUsuario = document.createElement("td");
  tdUsuario.textContent = pedido.usuario_id;

  const tdFecha = document.createElement("td");
  tdFecha.textContent = formatearFecha(pedido.fecha);

  const tdTotal = document.createElement("td");
  tdTotal.textContent = formatearPrecio(pedido.total);

  const tdEstado = document.createElement("td");
  tdEstado.append(crearBadgeEstado(pedido.estado));

  const tdAccion = document.createElement("td");
  const enlace = document.createElement("a");
  enlace.href = `pedido.html?id=${pedido.id}`;
  enlace.className = "btn btn-secundario btn-sm";
  enlace.textContent = "Ver detalle";
  tdAccion.append(enlace);

  tr.append(tdId, tdUsuario, tdFecha, tdTotal, tdEstado, tdAccion);
  return tr;
}
