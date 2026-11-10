// admin-categorias.js — lista de categorías para el administrador con opción de eliminar

document.addEventListener("DOMContentLoaded", async () => {
  if (!requerirAdministrador()) return;
  construirEncabezado();
  await cargarCategorias();
});

async function cargarCategorias() {
  const contenedor = document.getElementById("tabla-categorias");
  try {
    const categorias = await peticionGet("/categorias/");
    contenedor.replaceChildren();

    if (categorias.length === 0) {
      const p = document.createElement("p");
      p.textContent = "No hay categorías registradas.";
      contenedor.append(p);
      return;
    }

    const tabla = document.createElement("table");
    tabla.className = "tabla-admin";

    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    for (const col of ["ID", "Nombre", "Descripción", "Acciones"]) {
      const th = document.createElement("th");
      th.textContent = col;
      trHead.append(th);
    }
    thead.append(trHead);

    const tbody = document.createElement("tbody");
    for (const cat of categorias) {
      tbody.append(crearFilaCategoria(cat));
    }

    tabla.append(thead, tbody);
    contenedor.append(tabla);
  } catch {
    mostrarMensaje("mensaje-admin", "No se pudieron cargar las categorías.", "error");
  }
}

function crearFilaCategoria(categoria) {
  const tr = document.createElement("tr");

  const celdas = [
    categoria.id,
    categoria.nombre,
    categoria.descripcion || "—",
  ];

  for (const valor of celdas) {
    const td = document.createElement("td");
    td.textContent = valor;
    tr.append(td);
  }

  const tdAcciones = document.createElement("td");
  tdAcciones.className = "celdas-acciones";

  const btnEditar = document.createElement("a");
  btnEditar.href = `categoria-formulario.html?id=${categoria.id}`;
  btnEditar.className = "btn btn-secundario btn-sm";
  btnEditar.textContent = "Editar";

  const btnEliminar = document.createElement("button");
  btnEliminar.className = "btn btn-peligro btn-sm";
  btnEliminar.textContent = "Eliminar";
  btnEliminar.addEventListener("click", () => eliminarCategoria(categoria.id, tr));

  tdAcciones.append(btnEditar, btnEliminar);
  tr.append(tdAcciones);
  return tr;
}

async function eliminarCategoria(id, fila) {
  if (!confirm("¿Eliminar esta categoría?")) return;
  try {
    await peticionDelete(`/categorias/${id}`);
    fila.remove();
    mostrarMensaje("mensaje-admin", "Categoría eliminada.", "exito");
  } catch (error) {
    mostrarMensaje("mensaje-admin", error.message || "Error al eliminar.", "error");
  }
}
