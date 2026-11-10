// cuenta.js — muestra la información de la cuenta del usuario autenticado

document.addEventListener("DOMContentLoaded", async () => {
  if (!requerirAutenticacion()) return;
  construirEncabezado();
  await cargarInfoUsuario();
  document.getElementById("btn-cerrar-sesion").addEventListener("click", cerrarSesion);
});

async function cargarInfoUsuario() {
  const contenedor = document.getElementById("info-usuario");
  try {
    const usuario = await peticionGet("/auth/me");
    contenedor.replaceChildren();

    const filas = [
      ["Usuario", usuario.username],
      ["Correo", usuario.email],
    ];
    for (const [etiqueta, valor] of filas) {
      const p = document.createElement("p");
      const fuerte = document.createElement("strong");
      fuerte.textContent = `${etiqueta}: `;
      p.append(fuerte, valor);
      contenedor.append(p);
    }
  } catch {
    mostrarMensaje("info-usuario", "No se pudo cargar la información de la cuenta.", "error");
  }
}
