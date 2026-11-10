// catalogo.js — lista y filtra productos por búsqueda y categoría

document.addEventListener("DOMContentLoaded", async () => {
  construirEncabezado();
  await cargarCategorias();
  await cargarProductos();
  configurarFiltros();
});

// Carga las categorías en el <select> del filtro
async function cargarCategorias() {
  const select = document.getElementById("select-categoria");
  try {
    const categorias = await peticionGet("/categorias/");
    for (const cat of categorias) {
      const opcion = document.createElement("option");
      opcion.value = cat.id;
      opcion.textContent = cat.nombre;
      select.append(opcion);
    }
  } catch {
    // Si falla, el filtro queda sin opciones de categoría
  }

  // Si la URL tiene ?categoria=X, pre-selecciona esa opción
  const catParam = obtenerParametroUrl("categoria");
  if (catParam) {
    select.value = catParam;
  }
}

// Carga los productos según los parámetros de la URL actual
async function cargarProductos() {
  const contenedor = document.getElementById("grilla-productos");
  const contadorEl = document.getElementById("contador-resultados");

  mostrarCargando("grilla-productos");
  contadorEl.textContent = "";

  const termino = obtenerParametroUrl("buscar");
  const categoriaId = document.getElementById("select-categoria").value;

  // Si hay término de búsqueda en la URL, lo pre-carga en el input
  const inputBuscar = document.getElementById("input-buscar");
  if (termino) {
    inputBuscar.value = termino;
  }

  try {
    let productos = [];

    if (termino) {
      // Búsqueda por texto
      productos = await peticionGet(`/productos/buscar?termino=${encodeURIComponent(termino)}`);
    } else if (categoriaId) {
      // Filtrar por categoría
      productos = await peticionGet(`/productos/categoria/${categoriaId}`);
    } else {
      // Todos los productos
      productos = await peticionGet("/productos/");
    }

    contenedor.replaceChildren();

    if (productos.length === 0) {
      const p = document.createElement("p");
      p.textContent = "No se encontraron productos con esos filtros.";
      contenedor.append(p);
      contadorEl.textContent = "0 productos";
      return;
    }

    contadorEl.textContent = `${productos.length} producto${productos.length !== 1 ? "s" : ""}`;

    for (const producto of productos) {
      contenedor.append(crearTarjetaProducto(producto));
    }
  } catch {
    mostrarMensaje("grilla-productos", "No se pudieron cargar los productos.", "error");
  }
}

// Al enviar el formulario de filtros, actualiza la URL y recarga
function configurarFiltros() {
  const form = document.getElementById("form-filtros");
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const termino = document.getElementById("input-buscar").value.trim();
    const categoriaId = document.getElementById("select-categoria").value;

    // Construye la nueva URL con los parámetros de búsqueda
    const params = new URLSearchParams();
    if (termino) params.set("buscar", termino);
    if (categoriaId) params.set("categoria", categoriaId);

    const nuevaUrl = params.toString() ? `catalogo.html?${params}` : "catalogo.html";
    window.location.href = nuevaUrl;
  });
}
