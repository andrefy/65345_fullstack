// comun.js - Funciones compartidas: sesión, encabezado, utilidades

// Detecta en qué carpeta estamos para ajustar rutas
const _enAdmin = window.location.pathname.includes("/admin/");
const _enPages = window.location.pathname.includes("/pages/");
const rutaBase  = (_enAdmin || _enPages) ? "../" : "";
const rutaPages = _enAdmin ? "../pages/" : _enPages ? "" : "pages/";

// --- Sesión ---

function obtenerUsuario() {
  // Devuelve el objeto usuario guardado o null si no hay sesión
  const datos = localStorage.getItem("tienda_usuario");
  if (!datos) return null;
  try {
    return JSON.parse(datos);
  } catch {
    return null;
  }
}

function guardarSesion(token, usuario) {
  // Guarda el token y los datos del usuario en el navegador
  localStorage.setItem("tienda_token", token);
  localStorage.setItem("tienda_usuario", JSON.stringify(usuario));
}

function cerrarSesion() {
  // Limpia la sesión y redirige al inicio
  localStorage.removeItem("tienda_token");
  localStorage.removeItem("tienda_usuario");
  localStorage.removeItem("tienda_carrito_cantidad");
  window.location.href = rutaBase + "index.html";
}

function estaAutenticado() {
  return obtenerToken() !== null;
}

function requerirAutenticacion() {
  // Redirige al login si el usuario no está autenticado
  if (!estaAutenticado()) {
    window.location.href = rutaPages + "login.html";
    return false;
  }
  return true;
}

function esAdministrador() {
  const usuario = obtenerUsuario();
  return usuario !== null && usuario.username === "andres_yajamin";
}

function requerirAdministrador() {
  // Esta validación controla la página; FastAPI también verifica los permisos.
  if (!requerirAutenticacion()) return false;
  if (!esAdministrador()) {
    window.location.href = rutaBase + "index.html";
    return false;
  }
  return true;
}

// --- Encabezado ---

function crearEnlace(texto, ruta) {
  const enlace = document.createElement("a");
  enlace.textContent = texto;
  enlace.href = ruta;
  return enlace;
}

function construirEncabezado() {
  const encabezado = document.getElementById("encabezado");
  const usuario = obtenerUsuario();
  const header = document.createElement("header");
  header.className = "encabezado";
  const logo = crearEnlace("Mi Tienda", rutaBase + "index.html");
  logo.className = "logo";

  const nav = document.createElement("nav");
  nav.className = "navegacion";
  nav.setAttribute("aria-label", "Navegación principal");
  nav.append(crearEnlace("Inicio", rutaBase + "index.html"));
  nav.append(crearEnlace("Catálogo", rutaPages + "catalogo.html"));

  const carrito = crearEnlace("Carrito (", rutaPages + "carrito.html");
  const contador = document.createElement("span");
  contador.id = "contador-carrito";
  contador.textContent = "0";
  carrito.append(contador, ")");
  nav.append(carrito);

  if (usuario) {
    nav.append(crearEnlace("Mi cuenta", rutaPages + "cuenta.html"));
    nav.append(crearEnlace("Mis pedidos", rutaPages + "mis-pedidos.html"));
    if (esAdministrador()) {
      nav.append(crearEnlace("Admin", rutaBase + "admin/index.html"));
    }
    const salir = document.createElement("button");
    salir.className = "btn-enlace";
    salir.id = "btn-salir";
    salir.textContent = "Cerrar sesión";
    salir.addEventListener("click", cerrarSesion);
    nav.append(salir);
  } else {
    nav.append(crearEnlace("Iniciar sesión / Crear cuenta", rutaPages + "login.html"));
  }

  header.append(logo, nav);
  encabezado.replaceChildren(header);
  if (usuario) actualizarContadorCarrito();
}

async function actualizarContadorCarrito() {
  // Obtiene la cantidad de items del carrito y actualiza los contadores
  try {
    const datos = await peticionGet("/carrito/");
    const cantidad = datos.items ? datos.items.length : 0;

    document.getElementById("contador-carrito").textContent = cantidad;
  } catch {
    // Si falla la petición no interrumpimos la página
  }
}

// --- Mensajes de estado ---

function mostrarMensaje(idContenedor, texto, tipo) {
  // Muestra un mensaje (exito, error, info, advertencia) en el contenedor
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;

  const div = document.createElement("div");
  div.className = "mensaje mensaje-" + tipo;
  div.setAttribute("role", "status");
  div.setAttribute("aria-live", "polite");
  div.textContent = texto;

  contenedor.replaceChildren(div);
}

function limpiarMensaje(idContenedor) {
  const contenedor = document.getElementById(idContenedor);
  if (contenedor) contenedor.replaceChildren();
}

// --- Utilidades ---

function formatearPrecio(numero) {
  return "$" + Number(numero).toFixed(2);
}

function formatearFecha(fechaStr) {
  if (!fechaStr) return "";
  const fecha = new Date(fechaStr);
  const dia  = String(fecha.getDate()).padStart(2, "0");
  const mes  = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();
  return dia + "/" + mes + "/" + anio;
}

function crearBadgeEstado(estado) {
  const badge = document.createElement("span");
  badge.className = "badge badge-" + estado;
  badge.textContent = estado.charAt(0).toUpperCase() + estado.slice(1);
  return badge;
}

function obtenerUrlImagen(imagen) {
  // Devuelve la URL completa de la imagen del producto
  if (!imagen) return rutaBase + "assets/placeholder.svg";
  if (imagen.startsWith("http")) return imagen;
  // La imagen está en la carpeta Assets del backend, servida en /assets/
  const nombre = imagen.replace(/^Assets[\\/]/, "");
  return API_BASE_URL + "/assets/" + nombre;
}

function crearTarjetaProducto(producto) {
  // Crea el elemento HTML de una tarjeta de producto
  const article = document.createElement("article");
  article.className = "tarjeta-producto";

  const divImg = document.createElement("div");
  divImg.className = "img-contenedor";
  const img = document.createElement("img");
  img.src = obtenerUrlImagen(producto.imagen);
  img.alt = producto.nombre;
  img.width = 80;
  img.height = 80;
  img.onerror = function () {
    this.onerror = null;
    this.src = rutaBase + "assets/placeholder.svg";
  };
  divImg.append(img);

  const divInfo = document.createElement("div");
  divInfo.className = "tarjeta-info";

  const nombre = document.createElement("p");
  nombre.className = "tarjeta-nombre";
  nombre.textContent = producto.nombre;

  const precio = document.createElement("p");
  precio.className = "tarjeta-precio";
  precio.textContent = formatearPrecio(producto.precio);

  const desc = document.createElement("p");
  desc.className = "tarjeta-desc";
  desc.textContent = producto.descripcion || "";

  divInfo.append(nombre, precio, desc);

  const divAcciones = document.createElement("div");
  divAcciones.className = "tarjeta-acciones";

  const enlace = document.createElement("a");
  enlace.href = rutaPages + "producto.html?id=" + producto.id;
  enlace.className = "btn btn-primario";
  enlace.textContent = "Ver producto";

  divAcciones.append(enlace);

  article.append(divImg, divInfo, divAcciones);
  return article;
}

function mostrarCargando(idContenedor) {
  const c = document.getElementById(idContenedor);
  if (!c) return;
  const p = document.createElement("p");
  p.className = "cargando";
  p.textContent = "Cargando…";
  c.replaceChildren(p);
}

function obtenerParametroUrl(nombre) {
  // Lee un parámetro de la URL actual, por ejemplo ?id=5
  const params = new URLSearchParams(window.location.search);
  return params.get(nombre);
}
