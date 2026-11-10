// admin-index.js — dashboard del panel de administración con estadísticas básicas

document.addEventListener("DOMContentLoaded", async () => {
  if (!requerirAdministrador()) return;
  construirEncabezado();
  await cargarEstadisticas();
});

async function cargarEstadisticas() {
  const contenedor = document.getElementById("tarjetas-resumen");
  try {
    const productos = await peticionGet("/productos/");
    const categorias = await peticionGet("/categorias/");
    const pedidos = await peticionGet("/pedidos/admin/todos");

    contenedor.replaceChildren();

    const estadisticas = [
      { titulo: "Productos", valor: productos.length, enlace: "productos.html" },
      { titulo: "Categorías", valor: categorias.length, enlace: "categorias.html" },
      { titulo: "Pedidos", valor: pedidos.length, enlace: "pedidos.html" },
    ];

    for (const stat of estadisticas) {
      const tarjeta = document.createElement("article");
      tarjeta.className = "admin-tarjeta";

      const valor = document.createElement("span");
      valor.className = "admin-tarjeta-valor";
      valor.textContent = stat.valor;

      const titulo = document.createElement("span");
      titulo.className = "admin-tarjeta-titulo";
      titulo.textContent = stat.titulo;

      const enlace = document.createElement("a");
      enlace.href = stat.enlace;
      enlace.className = "btn btn-secundario btn-sm";
      enlace.textContent = `Ver ${stat.titulo.toLowerCase()}`;

      tarjeta.append(valor, titulo, enlace);
      contenedor.append(tarjeta);
    }
  } catch {
    mostrarMensaje("tarjetas-resumen", "No se pudieron cargar las estadísticas.", "error");
  }
}
