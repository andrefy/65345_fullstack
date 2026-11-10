// admin-productos.js — lista de productos para el administrador con opción de eliminar

document.addEventListener("DOMContentLoaded", async () => {
  if (!requerirAdministrador()) return;
  construirEncabezado();
  await cargarProductos();
});

async function cargarProductos() {
  const contenedor = document.getElementById("tabla-productos");
  try {
    const productos = await peticionGet("/productos/");
    contenedor.replaceChildren();

    if (productos.length === 0) {
      const p = document.createElement("p");
      p.textContent = "No hay productos registrados.";
      contenedor.append(p);
      return;
    }

    const tabla = document.createElement("table");
    tabla.className = "tabla-admin";

    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    for (const col of ["ID", "Nombre", "Precio", "Stock", "Categoría", "Acciones"]) {
      const th = document.createElement("th");
      th.textContent = col;
      trHead.append(th);
    }
    thead.append(trHead);

    const tbody = document.createElement("tbody");
    for (const p of productos) {
      tbody.append(crearFilaProducto(p));
    }

    tabla.append(thead, tbody);
    contenedor.append(tabla);
  } catch {
    mostrarMensaje("mensaje-admin", "No se pudieron cargar los productos.", "error");
  }
}

function crearFilaProducto(producto) {
  const tr = document.createElement("tr");

  const celdas = [
    producto.id,
    producto.nombre,
    formatearPrecio(producto.precio),
    producto.stock,
    producto.categoria_id || "—",
  ];

  for (const valor of celdas) {
    const td = document.createElement("td");
    td.textContent = valor;
    tr.append(td);
  }

  // Celda de acciones
  const tdAcciones = document.createElement("td");
  tdAcciones.className = "celdas-acciones";

  const btnEditar = document.createElement("a");
  btnEditar.href = `producto-formulario.html?id=${producto.id}`;
  btnEditar.className = "btn btn-secundario btn-sm";
  btnEditar.textContent = "Editar";

  const btnEliminar = document.createElement("button");
  btnEliminar.className = "btn btn-peligro btn-sm";
  btnEliminar.textContent = "Eliminar";
  btnEliminar.addEventListener("click", () => eliminarProducto(producto.id, tr));

  tdAcciones.append(btnEditar, btnEliminar);
  tr.append(tdAcciones);
  return tr;
}

async function eliminarProducto(id, fila) {
  if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
  try {
    await peticionDelete(`/productos/${id}`);
    fila.remove();
    mostrarMensaje("mensaje-admin", "Producto eliminado.", "exito");
  } catch (error) {
    mostrarMensaje("mensaje-admin", error.message || "Error al eliminar.", "error");
  }
}
