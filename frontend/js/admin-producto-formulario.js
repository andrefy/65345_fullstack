// admin-producto-formulario.js — crear o editar un producto desde el panel admin

document.addEventListener("DOMContentLoaded", async () => {
  if (!requerirAdministrador()) return;
  construirEncabezado();
  await cargarCategorias();

  const id = obtenerParametroUrl("id");
  if (id) {
    document.getElementById("titulo-formulario").textContent = "Editar producto";
    await cargarProducto(id);
  }

  document.getElementById("form-producto").addEventListener("submit", (evento) => {
    evento.preventDefault();
    guardarProducto(id);
  });
});

// Llena el <select> de categorías
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
    mostrarMensaje("mensaje-form", "No se pudieron cargar las categorías.", "error");
  }
}

// Si editamos, pre-carga los datos del producto en el formulario
async function cargarProducto(id) {
  try {
    const producto = await peticionGet(`/productos/${id}`);
    document.getElementById("input-nombre").value = producto.nombre;
    document.getElementById("input-descripcion").value = producto.descripcion || "";
    document.getElementById("input-precio").value = producto.precio;
    document.getElementById("input-stock").value = producto.stock;
    document.getElementById("input-imagen").value = producto.imagen || "";
    document.getElementById("select-categoria").value = producto.categoria_id || "";
  } catch {
    mostrarMensaje("mensaje-form", "No se pudo cargar el producto.", "error");
  }
}

async function guardarProducto(id) {
  limpiarMensaje("mensaje-form");

  const datos = {
    nombre: document.getElementById("input-nombre").value.trim(),
    descripcion: document.getElementById("input-descripcion").value.trim() || null,
    precio: parseFloat(document.getElementById("input-precio").value),
    stock: parseInt(document.getElementById("input-stock").value, 10),
    imagen: document.getElementById("input-imagen").value.trim() || null,
    categoria_id: parseInt(document.getElementById("select-categoria").value, 10) || null,
  };

  if (!datos.nombre || isNaN(datos.precio) || isNaN(datos.stock)) {
    mostrarMensaje("mensaje-form", "Nombre, precio y stock son obligatorios.", "error");
    return;
  }

  const btn = document.getElementById("btn-guardar");
  btn.disabled = true;

  try {
    if (id) {
      await peticionPut(`/productos/${id}`, datos);
    } else {
      await peticionPost("/productos/", datos);
    }
    window.location.href = "productos.html";
  } catch (error) {
    mostrarMensaje("mensaje-form", error.message || "Error al guardar el producto.", "error");
    btn.disabled = false;
  }
}
