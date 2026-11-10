// confirmacion.js — crea el pedido desde el carrito y muestra la confirmación

document.addEventListener("DOMContentLoaded", async () => {
  if (!requerirAutenticacion()) return;
  construirEncabezado();
  await confirmarPedido();
});

async function confirmarPedido() {
  const contenedor = document.getElementById("resultado-confirmacion");
  try {
    // POST /pedidos/ crea el pedido desde el carrito actual
    const pedido = await peticionPost("/pedidos/", {});

    actualizarContadorCarrito();
    contenedor.replaceChildren();

    // Icono de éxito
    const iconoDiv = document.createElement("div");
    iconoDiv.className = "confirmacion-icono";
    iconoDiv.textContent = "✓";

    const titulo = document.createElement("h1");
    titulo.textContent = "¡Pedido confirmado!";

    const descripcion = document.createElement("p");
    descripcion.textContent = `Tu pedido #${pedido.id} ha sido creado exitosamente.`;

    const total = document.createElement("p");
    total.className = "confirmacion-total";
    total.textContent = `Total: ${formatearPrecio(pedido.total)}`;

    const acciones = document.createElement("div");
    acciones.className = "confirmacion-acciones";

    const enlacePedido = document.createElement("a");
    enlacePedido.href = `pedido.html?id=${pedido.id}`;
    enlacePedido.className = "btn btn-primario";
    enlacePedido.textContent = "Ver mi pedido";

    const enlaceTienda = document.createElement("a");
    enlaceTienda.href = "../index.html";
    enlaceTienda.className = "btn btn-secundario";
    enlaceTienda.textContent = "Seguir comprando";

    acciones.append(enlacePedido, enlaceTienda);
    contenedor.append(iconoDiv, titulo, descripcion, total, acciones);
  } catch (error) {
    mostrarMensaje(
      "resultado-confirmacion",
      error.message || "No se pudo crear el pedido. Verifica que tu carrito no esté vacío.",
      "error"
    );

    // Botón para volver al carrito
    const btnVolver = document.createElement("a");
    btnVolver.href = "carrito.html";
    btnVolver.className = "btn btn-secundario";
    btnVolver.textContent = "Volver al carrito";
    document.getElementById("resultado-confirmacion").append(btnVolver);
  }
}
