// admin-categoria-formulario.js — crear o editar una categoría desde el panel admin

document.addEventListener("DOMContentLoaded", async () => {
  if (!requerirAdministrador()) return;
  construirEncabezado();

  const id = obtenerParametroUrl("id");
  if (id) {
    document.getElementById("titulo-formulario").textContent = "Editar categoría";
    await cargarCategoria(id);
  }

  document.getElementById("form-categoria").addEventListener("submit", (evento) => {
    evento.preventDefault();
    guardarCategoria(id);
  });
});

async function cargarCategoria(id) {
  try {
    const categoria = await peticionGet(`/categorias/${id}`);
    document.getElementById("input-nombre").value = categoria.nombre;
    document.getElementById("input-descripcion").value = categoria.descripcion || "";
  } catch {
    mostrarMensaje("mensaje-form", "No se pudo cargar la categoría.", "error");
  }
}

async function guardarCategoria(id) {
  limpiarMensaje("mensaje-form");

  const datos = {
    nombre: document.getElementById("input-nombre").value.trim(),
    descripcion: document.getElementById("input-descripcion").value.trim() || null,
  };

  if (!datos.nombre) {
    mostrarMensaje("mensaje-form", "El nombre es obligatorio.", "error");
    return;
  }

  const btn = document.getElementById("btn-guardar");
  btn.disabled = true;

  try {
    if (id) {
      await peticionPut(`/categorias/${id}`, datos);
    } else {
      await peticionPost("/categorias/", datos);
    }
    window.location.href = "categorias.html";
  } catch (error) {
    mostrarMensaje("mensaje-form", error.message || "Error al guardar la categoría.", "error");
    btn.disabled = false;
  }
}
