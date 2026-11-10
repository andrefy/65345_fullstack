// mis-pedidos.js — lista todos los pedidos del usuario autenticado

document.addEventListener("DOMContentLoaded", async () => {
  if (!requerirAutenticacion()) return;
  construirEncabezado();
  await cargarMisPedidos();
});

async function cargarMisPedidos() {
  const contenedor = document.getElementById("lista-pedidos");
  try {
    const pedidos = await peticionGet("/pedidos/mis-pedidos");
    contenedor.replaceChildren();

    if (pedidos.length === 0) {
      const p = document.createElement("p");
      p.textContent = "Aún no has realizado ningún pedido.";
      contenedor.append(p);

      const enlace = document.createElement("a");
      enlace.href = "catalogo.html";
      enlace.className = "btn btn-primario";
      enlace.textContent = "Ver catálogo";
      contenedor.append(enlace);
      return;
    }

    // Lista de pedidos como tarjetas
    for (const pedido of pedidos) {
      contenedor.append(crearTarjetaPedido(pedido));
    }
  } catch {
    mostrarMensaje("lista-pedidos", "No se pudieron cargar los pedidos.", "error");
  }
}

function crearTarjetaPedido(pedido) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "tarjeta pedido-fila";

  const encabezado = document.createElement("div");
  encabezado.className = "pedido-encabezado";

  const tituloPedido = document.createElement("span");
  tituloPedido.className = "pedido-numero";
  tituloPedido.textContent = `Pedido #${pedido.id}`;

  const badge = crearBadgeEstado(pedido.estado);

  encabezado.append(tituloPedido, badge);

  const fecha = document.createElement("p");
  fecha.className = "pedido-fecha";
  fecha.textContent = `Fecha: ${formatearFecha(pedido.fecha)}`;

  const total = document.createElement("p");
  total.className = "pedido-total";
  total.textContent = `Total: ${formatearPrecio(pedido.total)}`;

  const enlace = document.createElement("a");
  enlace.href = `pedido.html?id=${pedido.id}`;
  enlace.className = "btn btn-secundario btn-sm";
  enlace.textContent = "Ver detalle";

  tarjeta.append(encabezado, fecha, total, enlace);
  return tarjeta;
}
