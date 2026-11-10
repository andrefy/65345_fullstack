// inicio.js — carga productos aleatorios y categorías en la página de inicio

document.addEventListener("DOMContentLoaded", async () => {
  construirEncabezado();
  configurarBuscador();
  await cargarProductosAleatorios();
  await cargarCategorias();
});

// Muestra 8 productos al azar en la grilla de inicio
async function cargarProductosAleatorios() {
  const contenedor = document.getElementById("productos-destacados");
  try {
    const productos = await peticionGet("/productos/aleatorios?cantidad=8");
    contenedor.replaceChildren();
    if (productos.length === 0) {
      const p = document.createElement("p");
      p.textContent = "No hay productos disponibles por el momento.";
      contenedor.append(p);
      return;
    }
    for (const producto of productos) {
      contenedor.append(crearTarjetaProducto(producto));
    }
  } catch {
    mostrarMensaje("productos-destacados", "No se pudieron cargar los productos.", "error");
  }
}

// Muestra las categorías como chips/enlaces hacia el catálogo filtrado
async function cargarCategorias() {
  const contenedor = document.getElementById("lista-categorias");
  try {
    const categorias = await peticionGet("/categorias/");
    contenedor.replaceChildren();
    if (categorias.length === 0) {
      const p = document.createElement("p");
      p.textContent = "No hay categorías disponibles.";
      contenedor.append(p);
      return;
    }
    for (const cat of categorias) {
      const enlace = document.createElement("a");
      enlace.href = `pages/catalogo.html?categoria=${cat.id}`;
      enlace.className = "chip-categoria";
      enlace.textContent = cat.nombre;
      contenedor.append(enlace);
    }
  } catch {
    // Si falla, simplemente no se muestran las categorías
  }
}

// Al enviar el buscador de inicio, redirige al catálogo con el parámetro de búsqueda
function configurarBuscador() {
  const form = document.getElementById("form-buscar");
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const termino = document.getElementById("input-buscar").value.trim();
    if (termino) {
      window.location.href = `pages/catalogo.html?buscar=${encodeURIComponent(termino)}`;
    }
  });
}
