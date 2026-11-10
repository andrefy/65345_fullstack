// Un solo formulario para iniciar sesión y registrar usuarios.
let creandoCuenta = obtenerParametroUrl("modo") === "registro";
const formulario = document.getElementById("form-acceso");
const botonEnviar = document.getElementById("btn-enviar");

construirEncabezado();
if (estaAutenticado()) {
  window.location.href = "../index.html";
}
mostrarFormulario();

document.getElementById("btn-cambiar").addEventListener("click", function () {
  creandoCuenta = !creandoCuenta;
  formulario.reset();
  limpiarMensaje("mensaje-acceso");
  mostrarFormulario();
});

function mostrarFormulario() {
  const titulo = creandoCuenta ? "Crear cuenta" : "Iniciar sesión";
  document.getElementById("titulo").textContent = titulo;
  document.title = titulo + " - Mi Tienda";
  botonEnviar.textContent = creandoCuenta ? "Registrarme" : "Entrar";
  document.getElementById("btn-cambiar").textContent = creandoCuenta
    ? "Ya tengo cuenta: iniciar sesión" : "Crear una cuenta";

  // Correo y confirmación solo se necesitan para registrar un usuario.
  document.getElementById("campo-correo").hidden = !creandoCuenta;
  document.getElementById("campo-confirmar").hidden = !creandoCuenta;
  for (const id of ["correo", "confirmar"]) {
    document.getElementById(id).disabled = !creandoCuenta;
    document.getElementById(id).required = creandoCuenta;
  }
  document.getElementById("usuario").minLength = creandoCuenta ? 3 : 1;
  document.getElementById("password").minLength = creandoCuenta ? 6 : 1;
  document.getElementById("password").autocomplete = creandoCuenta
    ? "new-password" : "current-password";
}

formulario.addEventListener("submit", async function (evento) {
  evento.preventDefault();
  limpiarMensaje("mensaje-acceso");
  const username = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value;
  if (!username) {
    mostrarMensaje("mensaje-acceso", "Escribe tu usuario.", "error");
    return;
  }
  if (creandoCuenta && password !== document.getElementById("confirmar").value) {
    mostrarMensaje("mensaje-acceso", "Las contraseñas no coinciden.", "error");
    return;
  }

  botonEnviar.disabled = true;
  try {
    if (creandoCuenta) {
      const email = document.getElementById("correo").value.trim();
      await peticionPost("/auth/register", { username, email, password });
      creandoCuenta = false;
      formulario.reset();
      mostrarFormulario();
      mostrarMensaje("mensaje-acceso", "Cuenta creada. Ya puedes iniciar sesión.", "exito");
    } else {
      const datos = await peticionFormulario("/auth/login", { username, password });
      localStorage.setItem("tienda_token", datos.access_token);
      try {
        const usuario = await peticionGet("/auth/me");
        guardarSesion(datos.access_token, usuario);
      } catch (error) {
        localStorage.removeItem("tienda_token");
        localStorage.removeItem("tienda_usuario");
        throw error;
      }
      // Permitir volver a un producto sin salir de esta tienda.
      const destino = obtenerParametroUrl("redirigir");
      const producto = /^producto\.html\?id=\d+$/;
      window.location.href = producto.test(destino) ? destino : "../index.html";
    }
  } catch (error) {
    mostrarMensaje("mensaje-acceso", error.message, "error");
  } finally {
    botonEnviar.disabled = false;
  }
});
